# UI Contract: Routes and Page Content

The application exposes no API. Its external interface is the set of browser addresses below and
what each one must show. Tests assert this contract directly.

## Routes

| Address | Area | Sidebar label | Page content that MUST be present |
|---------|------|---------------|------------------------------------|
| `/` | Home | Home | Heading "InsurAgent"; an introduction of at most three sentences describing a demonstration of AI-assisted car insurance; the sentence "This is a demonstration. No real customer data is used."; a link or button labelled "Get a quote" that navigates to `/quote`. |
| `/quote` | Quote | Quote | Heading "Quote"; the text "The Quote area is not yet available." |
| `/policy` | Policy | Policy | Heading "Policy"; the text "The Policy area is not yet available." |
| `/underwriter` | Underwriter | Underwriter | Heading "Underwriter"; the text "The Underwriter area is not yet available." |
| `/claims` | Claims | Claims | Heading "Claims"; the text "The Claims area is not yet available." |
| any other | none | none highlighted | Heading "Page not found"; a link labelled "Go to Home" that navigates to `/`. |

## Navigation panel (present on every route, including not-found)

- A `<nav>` element with `aria-label="Main navigation"`.
- Contains, in this order, links labelled Home, Quote, Policy, Underwriter, Claims, pointing to
  the addresses above.
- Exactly one link carries `aria-current="page"` when the address matches a route; none does on
  the not-found route. Home matches `/` only.
- The active link is visually distinct (background colour) from the others.
- Links are native anchors so they are reachable with Tab and activated with Enter.
- The panel is on the left at widths of 768 px and above. Below that it may stack above the
  content; it must remain visible without horizontal scrolling at 375 px.

## Document title

`<title>` is "InsurAgent" on every route. Per-area titles are not required in this feature.

## Behaviour

- Opening any address directly, refreshing it, or arriving by back/forward renders exactly what
  clicking the matching sidebar link renders.
- No request leaves the browser other than loading the application's own files.
