import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../src/App";
import {
  ASSISTANT_ASK_PROMPT,
  ASSISTANT_GREETING,
  ASSISTANT_NEW_QUOTE_PROMPT,
  ASSISTANT_STUB_REPLY,
} from "../src/services/assistantApi";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

const openButton = () => screen.getByRole("button", { name: "Open assistant" });

describe("AI assistant widget", () => {
  it("is closed when the page loads, with only the floating button showing", () => {
    renderAt("/");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(openButton()).toHaveAttribute("aria-expanded", "false");
  });

  it("opens a chat panel with a greeting and puts the cursor in the message box", async () => {
    const user = userEvent.setup();
    renderAt("/");

    await user.click(openButton());

    const panel = screen.getByRole("dialog", { name: "AI assistant" });
    expect(within(panel).getByRole("heading", { name: "Assistant" })).toBeInTheDocument();
    expect(within(panel).getByText(ASSISTANT_GREETING)).toBeInTheDocument();
    expect(within(panel).getByLabelText("Message")).toHaveFocus();
    expect(screen.getByRole("button", { name: "Close assistant" })).toHaveAttribute("aria-expanded", "true");
  });

  it("sends a message with Enter and shows the assistant's reply", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());

    await user.type(screen.getByLabelText("Message"), "What is an excess?{Enter}");

    const log = screen.getByRole("log", { name: "Conversation" });
    expect(within(log).getByText("What is an excess?")).toBeInTheDocument();
    expect(await within(log).findByText(ASSISTANT_STUB_REPLY)).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toHaveValue("");
  });

  it("sends a message with the Send button", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());

    await user.type(screen.getByLabelText("Message"), "Hello");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText(ASSISTANT_STUB_REPLY)).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("does not send an empty or blank message", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());
    const log = screen.getByRole("log", { name: "Conversation" });
    const before = log.querySelectorAll("p").length;

    await user.click(screen.getByRole("button", { name: "Send" }));
    await user.type(screen.getByLabelText("Message"), "   {Enter}");

    expect(log.querySelectorAll("p")).toHaveLength(before);
    expect(screen.queryByText(ASSISTANT_STUB_REPLY)).not.toBeInTheDocument();
  });

  it("closes with the close button and returns focus to the floating button", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());

    await user.click(screen.getByRole("button", { name: "Close chat" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(openButton()).toHaveFocus();
  });

  it("closes with the Escape key and returns focus to the floating button", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(openButton()).toHaveFocus();
  });

  it("closes when the floating button is pressed again", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());

    await user.click(screen.getByRole("button", { name: "Close assistant" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps the conversation when the panel is closed and opened again", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());
    await user.type(screen.getByLabelText("Message"), "Remember me{Enter}");
    await screen.findByText(ASSISTANT_STUB_REPLY);

    await user.keyboard("{Escape}");
    await user.click(openButton());

    expect(screen.getByText("Remember me")).toBeInTheDocument();
    expect(screen.getByText(ASSISTANT_STUB_REPLY)).toBeInTheDocument();
  });

  it("offers quick actions when it opens", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());

    const menu = screen.getByRole("group", { name: "What would you like to do?" });
    expect(within(menu).getAllByRole("button").map((b) => b.textContent)).toEqual([
      "Ask a questionGet help with quotes, cover or excess",
      "Create a new quoteStart a car insurance quote",
      "See recent quotesOpen the quotes list on the home page",
    ]);
    expect(screen.queryByRole("group", { name: "Suggested questions" })).not.toBeInTheDocument();
  });

  it("'Create a new quote' makes the chat window big and keeps it open", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());
    const panel = screen.getByRole("dialog", { name: "AI assistant" });
    expect(panel).toHaveAttribute("data-size", "normal");

    await user.click(screen.getByRole("button", { name: /Create a new quote/ }));

    expect(panel).toHaveAttribute("data-size", "expanded");
    expect(screen.getByText(ASSISTANT_NEW_QUOTE_PROMPT)).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "What would you like to do?" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "InsurAgent" })).toBeInTheDocument(); // still on the home page
    expect(screen.getByLabelText("Message")).toHaveFocus();
  });

  it("can be shrunk and expanded again with the header button", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());
    const panel = screen.getByRole("dialog", { name: "AI assistant" });

    await user.click(screen.getByRole("button", { name: "Expand chat" }));
    expect(panel).toHaveAttribute("data-size", "expanded");
    expect(screen.getByRole("button", { name: "Shrink chat" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Shrink chat" }));
    expect(panel).toHaveAttribute("data-size", "normal");
  });

  it("stays big when the panel is closed and opened again", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());
    await user.click(screen.getByRole("button", { name: /Create a new quote/ }));

    await user.keyboard("{Escape}");
    await user.click(openButton());

    expect(screen.getByRole("dialog", { name: "AI assistant" })).toHaveAttribute("data-size", "expanded");
  });

  it("'See recent quotes' opens the home page", async () => {
    const user = userEvent.setup();
    renderAt("/claims");
    await user.click(openButton());

    await user.click(screen.getByRole("button", { name: /See recent quotes/ }));

    expect(screen.getByRole("heading", { level: 1, name: "InsurAgent" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("'Ask a question' swaps the menu for a prompt and suggestions, and focuses the message box", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());

    await user.click(screen.getByRole("button", { name: /Ask a question/ }));

    expect(screen.queryByRole("group", { name: "What would you like to do?" })).not.toBeInTheDocument();
    expect(screen.getByText(ASSISTANT_ASK_PROMPT)).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Suggested questions" })).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toHaveFocus();
  });

  it("hides the quick actions once the visitor sends a message", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());

    await user.type(screen.getByLabelText("Message"), "Hi{Enter}");

    expect(screen.queryByRole("group", { name: "What would you like to do?" })).not.toBeInTheDocument();
  });

  it("offers suggested questions before the first message, and sends one when it is chosen", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());
    await user.click(screen.getByRole("button", { name: /Ask a question/ }));

    const suggestions = screen.getByRole("group", { name: "Suggested questions" });
    await user.click(within(suggestions).getByRole("button", { name: "What does excess mean?" }));

    expect(within(screen.getByRole("log", { name: "Conversation" })).getByText("What does excess mean?")).toBeInTheDocument();
    expect(await screen.findByText(ASSISTANT_STUB_REPLY)).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Suggested questions" })).not.toBeInTheDocument();
  });

  it("shows that the assistant is typing until the reply arrives", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(openButton());

    await user.type(screen.getByLabelText("Message"), "Hello{Enter}");

    expect(screen.getByRole("status")).toHaveTextContent("The assistant is typing");
    expect(await screen.findByText(ASSISTANT_STUB_REPLY)).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it.each(["/", "/quote", "/policy", "/underwriter", "/claims", "/nothing-here"])(
    "is available on %s",
    (path) => {
      renderAt(path);
      expect(openButton()).toBeInTheDocument();
    },
  );
});
