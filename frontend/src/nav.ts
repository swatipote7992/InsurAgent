import type { ComponentType } from "react";
import Home from "./pages/Home";
import Placeholder from "./pages/Placeholder";

export interface NavItem {
  /** Text shown in the sidebar. */
  label: string;
  /** Browser address for the area. Unique; starts with "/". */
  path: string;
  /** Page rendered for the path. */
  Page: ComponentType;
}

function placeholderFor(areaName: string): ComponentType {
  const Page = () => Placeholder({ areaName });
  Page.displayName = `${areaName}Placeholder`;
  return Page;
}

/**
 * Single source of truth for the sidebar links and the routes they open.
 * Order here is the order in the sidebar (FR-003).
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", path: "/", Page: Home },
  { label: "Quote", path: "/quote", Page: placeholderFor("Quote") },
  { label: "Policy", path: "/policy", Page: placeholderFor("Policy") },
  { label: "Underwriter", path: "/underwriter", Page: placeholderFor("Underwriter") },
  { label: "Claims", path: "/claims", Page: placeholderFor("Claims") },
];
