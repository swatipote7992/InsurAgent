import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router";
import App from "../src/App";

const LABELS = ["Home", "Quote", "Policy", "Underwriter", "Claims"];

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

function getNav() {
  return screen.getByRole("navigation", { name: "Main navigation" });
}

function activeLinks() {
  return within(getNav())
    .getAllByRole("link")
    .filter((link) => link.getAttribute("aria-current") === "page");
}

/** Test-only control that behaves like the browser back button. */
function BackButton() {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => void navigate(-1)}>
      test-back
    </button>
  );
}

describe("Sidebar navigation (US2)", () => {
  it("lists the five areas in order inside the main navigation landmark", () => {
    renderAt("/");
    const names = within(getNav())
      .getAllByRole("link")
      .map((link) => link.textContent);
    expect(names).toEqual(LABELS);
  });

  it("highlights only the current area", () => {
    renderAt("/policy");
    const active = activeLinks();
    expect(active).toHaveLength(1);
    expect(active[0]).toHaveTextContent("Policy");
  });

  it("highlights Home only on the root address", () => {
    renderAt("/");
    const active = activeLinks();
    expect(active).toHaveLength(1);
    expect(active[0]).toHaveTextContent("Home");
  });

  it("follows the address when the user goes back", async () => {
    render(
      <MemoryRouter initialEntries={["/", "/claims"]} initialIndex={1}>
        <App />
        <BackButton />
      </MemoryRouter>,
    );
    expect(activeLinks()[0]).toHaveTextContent("Claims");

    await userEvent.click(screen.getByRole("button", { name: "test-back" }));

    expect(activeLinks()).toHaveLength(1);
    expect(activeLinks()[0]).toHaveTextContent("Home");
  });

  it("is operable by keyboard", async () => {
    renderAt("/");
    const user = userEvent.setup();
    for (const label of LABELS) {
      await user.tab();
      expect(within(getNav()).getByRole("link", { name: label })).toHaveFocus();
    }
    await user.keyboard("{Enter}");
    expect(screen.getByRole("heading", { level: 1, name: "Claims" })).toBeInTheDocument();
  });
});
