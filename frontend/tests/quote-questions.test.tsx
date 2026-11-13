import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../src/App";
import { addDays, ageOn, formatDate, todayIso } from "../src/components/quote-chat/dates";

// The assistant "types" before each question; tests do not wait for that.
vi.mock("../src/components/quote-chat/typing", () => ({ TYPING_DELAY_MS: 0 }));

type User = ReturnType<typeof userEvent.setup>;

const START = addDays(todayIso(), 7);
const BORN = "1988-03-14";

async function openQuotePage(user: User) {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>,
  );
  await user.click(screen.getByRole("button", { name: "Open assistant" }));
  await user.click(screen.getByRole("button", { name: /Create a new quote/ }));
  await screen.findByLabelText("Start date");
}

const next = (user: User) => user.click(screen.getByRole("button", { name: "Next" }));

/** Types an answer and presses Next, or clicks the bubble with this name. */
async function answer(user: User, label: string, value: string) {
  const control = await screen.findByLabelText(label);
  if (control.getAttribute("role") === "group") {
    // A choice question: click the bubble. That answers the question straight away.
    await user.click(within(control).getByRole("button", { name: value }));
    return;
  }
  fireEvent.change(control, { target: { value } });
  await next(user);
}

/** The first questions, up to and including the licence type. */
async function answerFirstQuestions(user: User) {
  await answer(user, "Start date", START);
  await answer(user, "Full name", "Test Person");
  await answer(user, "Date of birth", BORN);
  await answer(user, "Email", "test.person@example.com");
  await answer(user, "Postcode area", "M (Manchester)");
  await answer(user, "Licence type", "Full UK");
}

/** Answers every question but the last with values that are accepted. */
async function answerAllButLast(user: User) {
  await answerFirstQuestions(user);
  await answer(user, "Years licence held", "16");
  await answer(user, "Claims (5 years)", "1");
  await answer(user, "Car", "Ford Fiesta");
  await answer(user, "Year", "2019");
  await answer(user, "Annual mileage", "5,001 to 10,000");
  await answer(user, "Cover level", "Comprehensive");
}

const conversation = () => screen.getByRole("region", { name: "Quote conversation" });
const summary = () => screen.getByRole("complementary", { name: "Your quote so far" });
const progress = () => screen.getByRole("progressbar", { name: "Quote progress" });

describe("The assistant asks the quote questions", () => {
  it("starts by itself: it greets you, then asks the first question with a date picker", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    await user.click(screen.getByRole("button", { name: "Open assistant" }));
    await user.click(screen.getByRole("button", { name: /Create a new quote/ }));

    expect(conversation()).toHaveTextContent("Let's create your quote together");
    expect(await screen.findByText(/when would you like your cover to start/)).toBeInTheDocument();
    const date = screen.getByLabelText("Start date");
    expect(date).toHaveAttribute("type", "date");
    expect(date).toHaveAttribute("min", todayIso());
    expect(date).toHaveAttribute("max", addDays(todayIso(), 30));
    expect(date).toHaveFocus();
    // One question at a time: nothing from later questions is on the page yet.
    expect(screen.queryByLabelText("Full name")).not.toBeInTheDocument();
    expect(screen.queryByText("Great. What is your full name?")).not.toBeInTheDocument();
  });

  it("asks only these 13 questions", async () => {
    const user = userEvent.setup();
    await openQuotePage(user);
    const labels = within(summary())
      .getAllByRole("term")
      .map((term) => term.textContent);
    expect(labels).toEqual([
      "Full name",
      "Date of birth",
      "Email",
      "Postcode area",
      "Licence type",
      "Years licence held",
      "Claims (5 years)",
      "Car",
      "Year",
      "Annual mileage",
      "Start date",
      "Cover level",
      "Voluntary excess",
    ]);
    for (const dropped of ["Convictions (5 years)", "Make", "Model", "Category", "Estimated value", "Optional extras"]) {
      expect(within(summary()).queryByText(dropped)).not.toBeInTheDocument();
    }
  });

  it("shows your answer as a message and asks the next question", async () => {
    const user = userEvent.setup();
    await openQuotePage(user);

    await answer(user, "Start date", START);

    expect(within(conversation()).getByText(formatDate(START))).toBeInTheDocument();
    expect(await screen.findByText("Great. What is your full name?")).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toHaveAttribute("type", "text");
  });

  it("explains a problem and asks the same question again", async () => {
    const user = userEvent.setup();
    await openQuotePage(user);

    await answer(user, "Start date", addDays(todayIso(), -1));

    expect(await screen.findByRole("alert")).toHaveTextContent("Please choose a date between");
    expect(screen.getByLabelText("Start date")).toBeInTheDocument();
    expect(screen.queryByLabelText("Full name")).not.toBeInTheDocument();
    expect(within(summary()).getAllByText("—")).toHaveLength(13);
  });

  it("uses the right control for each kind of question", async () => {
    const user = userEvent.setup();
    await openQuotePage(user);
    const kinds: [string, string, string, string][] = [
      ["Start date", "INPUT", "date", START],
      ["Full name", "INPUT", "text", "Test Person"],
      ["Date of birth", "INPUT", "date", BORN],
      ["Email", "INPUT", "email", "a@b.co"],
      ["Postcode area", "GROUP", "", "M (Manchester)"],
      ["Licence type", "GROUP", "", "Full UK"],
      ["Years licence held", "INPUT", "text", "5"],
      ["Claims (5 years)", "INPUT", "number", "0"],
      ["Car", "GROUP", "", "Ford Fiesta"],
      ["Year", "INPUT", "text", "2019"],
      ["Annual mileage", "GROUP", "", "Up to 5,000"],
      ["Cover level", "GROUP", "", "Comprehensive"],
      ["Voluntary excess", "GROUP", "", "£0"],
    ];
    for (const [label, tag, type, value] of kinds) {
      const control = await screen.findByLabelText(label);
      if (tag === "GROUP") expect(control, label).toHaveAttribute("role", "group");
      else expect(control.tagName, label).toBe(tag);
      if (type) expect(control, label).toHaveAttribute("type", type);
      await answer(user, label, value);
    }
  });

  it("shows choices as bubbles you click, with no dropdown and no Next button", async () => {
    const user = userEvent.setup();
    await openQuotePage(user);
    await answerFirstQuestions(user);
    await answer(user, "Years licence held", "5");
    await answer(user, "Claims (5 years)", "0");

    const group = await screen.findByLabelText("Car");
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
    const names = within(group)
      .getAllByRole("button")
      .map((b) => b.textContent);
    expect(names).toContain("Ford Fiesta");
    expect(names).toContain("Volkswagen Golf");
    expect(names).toContain("BMW 3 Series");
    expect(names).toHaveLength(35);

    await user.click(within(group).getByRole("button", { name: "Volkswagen Golf" }));

    expect(within(conversation()).getByText("Volkswagen Golf")).toBeInTheDocument();
    expect(await screen.findByLabelText("Year")).toBeInTheDocument();
  });

  it("checks answers: age, email, licence years, claims and year", async () => {
    const user = userEvent.setup();
    await openQuotePage(user);
    await answer(user, "Start date", START);
    await answer(user, "Full name", "Test Person");

    await answer(user, "Date of birth", addDays(todayIso(), -365 * 10));
    expect(await screen.findByRole("alert")).toHaveTextContent("You must be at least 17 when the policy starts.");
    await answer(user, "Date of birth", BORN);

    await answer(user, "Email", "not-an-email");
    expect(await screen.findByRole("alert")).toHaveTextContent("Please enter a valid email address");
    await answer(user, "Email", "a@b.co");

    await answer(user, "Postcode area", "M (Manchester)");
    await answer(user, "Licence type", "Full UK");

    const most = ageOn(BORN, START) - 17;
    await answer(user, "Years licence held", String(most + 1));
    expect(await screen.findByRole("alert")).toHaveTextContent(`from 0 to ${most} for your date of birth`);
    await answer(user, "Years licence held", "abc");
    expect(await screen.findByRole("alert")).toHaveTextContent("Please enter a whole number");
    await answer(user, "Years licence held", String(most));

    await answer(user, "Claims (5 years)", "11");
    expect(await screen.findByRole("alert")).toHaveTextContent("whole number from 0 to 10");
    await answer(user, "Claims (5 years)", "0");
    await answer(user, "Car", "Ford Fiesta");

    await answer(user, "Year", "1979");
    expect(await screen.findByRole("alert")).toHaveTextContent("from 1980 to");
  });

  it("will not accept an empty answer", async () => {
    const user = userEvent.setup();
    await openQuotePage(user);
    await answer(user, "Start date", START);
    await next(user);
    expect(await screen.findByRole("alert")).toHaveTextContent("Please type your full name.");
  });

  it("fills the quote so far as you answer, and marks the current question", async () => {
    const user = userEvent.setup();
    await openQuotePage(user);
    expect(within(summary()).getByText("Start date").parentElement).toHaveAttribute("aria-current", "step");

    await answer(user, "Start date", START);
    await answer(user, "Full name", "Test Person");

    expect(within(summary()).getByText("Test Person")).toBeInTheDocument();
    expect(within(summary()).getByText(formatDate(START))).toBeInTheDocument();
    expect(within(summary()).getByText("Date of birth").parentElement).toHaveAttribute("aria-current", "step");
  });

  it("goes through all 13 questions, fills the whole summary and shows progress", async () => {
    const user = userEvent.setup();
    await openQuotePage(user);
    expect(progress()).toHaveAttribute("aria-valuenow", "0");
    expect(progress()).toHaveAttribute("aria-valuemax", "13");

    await answerAllButLast(user);
    expect(progress()).toHaveAttribute("aria-valuenow", "12");
    await answer(user, "Voluntary excess", "£250");

    expect(await screen.findByText(/That's every question answered/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
    expect(progress()).toHaveAttribute("aria-valuenow", "13");
    for (const text of [
      "Test Person", "M (Manchester)", "Full UK", "16 years", "Ford Fiesta", "2019",
      "5,001 to 10,000", "Comprehensive", "£250", formatDate(START), formatDate(BORN),
    ]) {
      expect(within(summary()).getAllByText(text).length, text).toBeGreaterThan(0);
    }
    expect(within(summary()).queryByText("—")).not.toBeInTheDocument();
  });
});
