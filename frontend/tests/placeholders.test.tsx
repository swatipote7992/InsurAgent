import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import App from "../src/App";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("Placeholder areas (US2)", () => {
  it.each([
    ["/quote", "Quote"],
    ["/policy", "Policy"],
    ["/underwriter", "Underwriter"],
    ["/claims", "Claims"],
  ])("%s shows the %s placeholder", (path, area) => {
    renderAt(path);
    expect(screen.getByRole("heading", { level: 1, name: area })).toBeInTheDocument();
    expect(screen.getByText(`The ${area} area is not yet available.`)).toBeInTheDocument();
  });
});

describe("Unknown address (US2)", () => {
  it("shows page not found with the navigation still visible", () => {
    renderAt("/nothing-here");
    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to Home" })).toHaveAttribute("href", "/");

    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    const active = within(nav)
      .getAllByRole("link")
      .filter((link) => link.hasAttribute("aria-current"));
    expect(active).toHaveLength(0);
  });
});
