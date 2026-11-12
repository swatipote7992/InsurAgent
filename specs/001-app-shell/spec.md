# Feature Specification: Application Shell and Home Page

**Feature Branch**: `001-app-shell`

**Created**: 2026-11-12

**Status**: Draft

**Input**: User description: "A simple web page with a navigation bar on the left-hand side listing Home, Quote, Policy, Underwriter and Claims. For now only the home page is built; the other areas are placeholders."

## Clarifications

### Session 2026-11-12

- Q: What is in scope for this feature? → A: Only the application shell (left navigation) and the home page. Quote, Policy, Underwriter and Claims are placeholders. The car insurance quote journey is parked as a draft for a later feature.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See the Home Page (Priority: P1)

A visitor opens the application and lands on the home page. It names the product, InsurAgent,
explains in a few sentences that it is a demonstration of AI-assisted car insurance, and offers a
clear "Get a quote" action that takes the visitor to the Quote area.

**Why this priority**: The home page is the first thing anyone sees and the starting point of
every demo. It is the whole deliverable of this feature.

**Independent Test**: Can be fully tested by opening the application's root address and confirming
the product name, the introduction and the "Get a quote" action are visible, and that the action
opens the Quote area.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** the visitor opens the root address, **Then** the
   home page is shown with the product name, a short introduction and a "Get a quote" action.
2. **Given** the home page is shown, **When** the visitor chooses "Get a quote", **Then** the Quote
   area opens and Quote is highlighted in the navigation.
3. **Given** the home page is shown, **When** the visitor reads it, **Then** it states that the
   application is a demonstration and uses no real customer data.

---

### User Story 2 - Navigate Between Areas (Priority: P2)

A visitor sees a persistent navigation panel on the left listing, in order, Home, Quote, Policy,
Underwriter and Claims. Choosing an item opens that area and highlights the item. Quote, Policy,
Underwriter and Claims each show a placeholder page saying the area is coming in a later release.
The navigation stays visible on every page, including when an address matches no area.

**Why this priority**: The navigation is the frame every later feature plugs into and lets a demo
audience see the shape of the whole product. It is second because the home page is useful on its
own.

**Independent Test**: Can be tested by choosing each navigation item in turn and confirming the
matching page opens, the item is highlighted, and the navigation remains visible.

**Acceptance Scenarios**:

1. **Given** any page is open, **When** the visitor looks at the left panel, **Then** it lists Home,
   Quote, Policy, Underwriter and Claims in that order.
2. **Given** any page is open, **When** the visitor chooses an item, **Then** the matching area
   opens and that item alone is highlighted.
3. **Given** the visitor chooses Quote, Policy, Underwriter or Claims, **When** the page opens,
   **Then** it shows the area's name and states that the area is not yet available.
4. **Given** the visitor opens an address that matches no area, **When** the page loads, **Then** a
   "page not found" message is shown, a link back to Home is offered, and the navigation remains
   visible.
5. **Given** the visitor uses only a keyboard, **When** they move through the navigation, **Then**
   every item can be reached and activated.

---

### Edge Cases

- What happens when the visitor opens a placeholder area directly by its address? The placeholder
  page opens with the matching item highlighted, exactly as if chosen from the navigation.
- What happens when the browser window is narrow (phone width)? The navigation and content remain
  readable and usable; a collapsed or stacked layout is acceptable.
- What happens when the visitor refreshes a page? The same page reopens with the same item
  highlighted.
- What happens when the visitor uses the browser back button after navigating? The previous area
  reopens with its item highlighted.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST show the home page at the application's root address.
- **FR-002**: The home page MUST show the product name "InsurAgent", a short introduction (no more
  than three sentences) describing it as a demonstration of AI-assisted car insurance, a statement
  that no real customer data is used, and a "Get a quote" action that opens the Quote area.
- **FR-003**: System MUST present a persistent left-hand navigation on every page listing, in
  order, Home, Quote, Policy, Underwriter and Claims.
- **FR-004**: System MUST highlight exactly one navigation item, the one matching the current
  area, and MUST update it when the visitor changes area, including by browser back and forward.
- **FR-005**: Quote, Policy, Underwriter and Claims MUST each open a placeholder page showing the
  area's name and a statement that the area is not yet available.
- **FR-006**: Each area MUST have its own stable address so it can be opened directly, refreshed,
  and shared.
- **FR-007**: Any address that matches no area MUST show a "page not found" message with a link to
  Home, with the navigation still visible.
- **FR-008**: Navigation MUST be operable by keyboard and MUST identify itself to assistive
  technology as the main navigation.
- **FR-009**: Pages MUST remain readable and usable at phone width.
- **FR-010**: No sign-in MUST be required for any page in this feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of navigation items open their matching page with that item alone highlighted.
- **SC-002**: A first-time visitor can identify the five product areas and start a quote from the
  home page within 30 seconds, without instructions.
- **SC-003**: Every page, including "page not found", shows the navigation.
- **SC-004**: The home page is visible within 2 seconds of opening the root address on a typical
  broadband connection.
- **SC-005**: Every navigation item can be reached and activated using only the keyboard.

## Assumptions

- This feature has no data, no storage and no server-side logic; every page is static content.
- The Quote area is a placeholder in this feature. The car insurance quote journey is parked in
  `specs/drafts/car-insurance-quote-spec.md` and will become a later feature.
- The application is in English only.
- A collapsed or stacked navigation at phone width is acceptable; a dedicated mobile design is out
  of scope.
- Branding is limited to the product name and a simple colour scheme; a design system is chosen at
  planning time.
