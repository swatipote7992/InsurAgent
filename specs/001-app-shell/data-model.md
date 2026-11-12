# Data Model: Application Shell and Home Page

This feature stores no data and calls no service. The only structured value is the static
navigation configuration that drives both the sidebar and the routes, so they can never drift
apart.

## NavItem (static configuration)

| Field | Type | Rules |
|-------|------|-------|
| `label` | string | Shown in the sidebar. Exactly: "Home", "Quote", "Policy", "Underwriter", "Claims". |
| `path` | string | Browser address for the area. Unique. Starts with `/`. Home is `/`. |
| `page` | component | The page rendered for the path. Home → `Home`; the other four → `Placeholder` with the label as its `areaName` prop. |

**Collection**: `NAV_ITEMS`, an ordered array of exactly five `NavItem`s in the order above
(FR-003). Order in the array is the order in the sidebar and is asserted by a test.

**Invariants**

- Every `path` is unique.
- Exactly one item is active at any time: the item whose `path` matches the current address
  (FR-004). Home uses exact matching so it is not active on other paths.
- Any address not in `NAV_ITEMS` renders `NotFound` inside the same layout (FR-007).

## Placeholder page props

| Prop | Type | Rules |
|------|------|-------|
| `areaName` | string | The area's label. Rendered as the heading and inside the sentence "The {areaName} area is not yet available." (FR-005). |

## State

There is no application state beyond the current address, which the browser and React Router
own. No local storage, no session storage, no cookies.

## Lifecycle

None. Pages are stateless and re-render from the address alone, which is what makes refresh,
direct open and back/forward behave identically (edge cases in spec.md).
