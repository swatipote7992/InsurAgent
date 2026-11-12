import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../src/App";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("Home page (US1)", () => {
  it("shows the product name and the demo statement", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { level: 1, name: "InsurAgent" })).toBeInTheDocument();
    expect(
      screen.getByText("This is a demonstration. No real customer data is used."),
    ).toBeInTheDocument();
  });

  it("offers a Get a quote link that opens the Quote area", async () => {
    renderAt("/");
    const link = screen.getByRole("link", { name: "Get a quote" });
    expect(link).toHaveAttribute("href", "/quote");

    await userEvent.click(link);

    expect(screen.getByRole("heading", { level: 1, name: "Quote" })).toBeInTheDocument();
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).getByRole("link", { name: "Quote" })).toHaveAttribute("aria-current", "page");
  });
});
