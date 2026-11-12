# Implementation Plan: Application Shell and Home Page

**Branch**: `001-app-shell` | **Date**: 2026-11-12 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-app-shell/spec.md`

## Summary

Build the first screen of InsurAgent: a client-side web application with a persistent left-hand
navigation (Home, Quote, Policy, Underwriter, Claims) and a home page that introduces the product
and offers a "Get a quote" action. Quote, Policy, Underwriter and Claims are placeholder pages.
There is no data, storage or server logic. The app is a Vite + React + TypeScript single-page
application using React Router for per-area addresses and Tailwind CSS for styling, with Vitest
and Testing Library for network-free tests. It lives in a new `frontend/` folder beside the
existing Python agent so a later feature can put an API behind it.

## Technical Context

**Language/Version**: TypeScript 7 (strict) on Node.js 24 (npm 11). No Python in this feature.

**Primary Dependencies**: React 19, React Router 8 (declarative `BrowserRouter` mode), Vite 8,
Tailwind CSS 4 via `@tailwindcss/vite`. Exact versions and the migration notes checked for each
new major are in [research.md](research.md); the lock file `frontend/package-lock.json` pins
them.

**Storage**: N/A (static content only).

**Testing**: Vitest with jsdom, React Testing Library and jest-dom matchers. Tests run with no
network and no API keys. `tsc --noEmit` is part of the check.

**Target Platform**: Modern evergreen browsers (Chrome, Edge, Firefox, Safari) on desktop and
phone widths; developed and run on Windows 11.

**Project Type**: Web application, frontend only (the existing `agent.py` is untouched).

**Performance Goals**: Home page visible within 2 seconds on broadband (SC-004). The Vite
production build of this shell is 258 KB of JavaScript, 82 KB gzipped (measured 2026-11-12),
which loads well inside 2 seconds on broadband.

**Constraints**: No sign-in, no backend calls, no real customer data, English only. Keyboard
operable navigation with a landmark role (FR-008). Readable at 375 px width (FR-009).

**Scale/Scope**: 5 routes plus a not-found route, 1 layout component, 1 navigation component,
5 page components, demo-scale traffic.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Applies? | Status | Notes |
|-----------|----------|--------|-------|
| I. LangGraph is the orchestration layer | No | Pass | No agent workflow in this feature. Nothing is routed, decided or resumed. |
| II. Deterministic code owns money | No | Pass | No monetary figure exists in this feature. |
| III. Human in the loop for high risk | No | Pass | No underwriting outcome exists in this feature. |
| IV. Tests run without the network | Yes | Pass | Vitest + jsdom tests cover navigation, highlighting, placeholders and not-found. No network, no keys. |
| V. Typed, simple and observable | Yes | Pass | TypeScript strict mode is the frontend equivalent of mypy. No data crosses a boundary, so no schema validation is needed. No agent run exists to trace. Each dependency is justified below. |
| Security and data constraints | Yes | Pass with one deviation | No secrets, no payments, no personal data. The constitution names Python 3.13 as the runtime; this feature adds Node.js 24 for the frontend. Recorded in Complexity Tracking. |
| Development workflow | Yes | Pass | Spec Kit flow followed; README run commands and activity log will be updated during implementation. |

**Dependency justification (Principle V)**

| Dependency | Current requirement it serves |
|------------|-------------------------------|
| React, React DOM | Component model for a layout shared by five areas (FR-003) and reuse by the later quote form. |
| React Router | Stable per-area addresses, direct open, refresh, back/forward and active-link highlighting (FR-004, FR-006, FR-007). |
| Vite, `@vitejs/plugin-react` | Build and dev server; the standard React toolchain. |
| TypeScript | Constitution V (typed code). |
| Tailwind CSS, `@tailwindcss/vite` | Styling chosen by the user at planning time; utility classes keep the sidebar and home page to a handful of files with no custom CSS to maintain. |
| Vitest, jsdom, Testing Library (react, user-event), jest-dom | Constitution IV (network-free tests of user-visible behaviour). `user-event` drives the click and keyboard scenarios in the contract. |

**Gate result (pre-research)**: PASS. One documented deviation (Node runtime), justified below.

## Project Structure

### Documentation (this feature)

```text
specs/001-app-shell/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── routes.md        # UI contract: routes, navigation order, page content
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
agent.py                     # existing Python agent, untouched by this feature
requirements.txt             # existing Python dependencies, untouched

frontend/
├── index.html
├── package.json
├── package-lock.json        # pins every frontend dependency
├── vite.config.ts           # React + Tailwind plugins, Vitest config
├── tsconfig.json
├── .gitignore               # node_modules, dist
├── src/
│   ├── main.tsx             # mounts <App/> inside <BrowserRouter>
│   ├── App.tsx              # <Routes> built from the nav config, inside <Layout/>
│   ├── index.css            # Tailwind import and design tokens
│   ├── nav.ts               # NAV_ITEMS: single source of truth for labels, paths, pages
│   ├── components/
│   │   ├── Layout.tsx       # sidebar + content area, wraps every route via <Outlet/>
│   │   └── Sidebar.tsx      # <nav aria-label="Main navigation"> with NavLinks
│   └── pages/
│       ├── Home.tsx
│       ├── Placeholder.tsx  # one component, takes the area name as a prop
│       └── NotFound.tsx
└── tests/
    ├── setup.ts             # jest-dom matchers
    ├── navigation.test.tsx  # order, highlighting, direct open, back/forward
    ├── home.test.tsx        # product name, intro, demo statement, Get a quote
    └── placeholders.test.tsx# placeholder text, not-found with nav visible
```

**Structure Decision**: Web application layout with a `frontend/` folder at the repository root.
The Python agent stays at the root for now; moving it under `backend/` is deferred to the feature
that first exposes an API, to avoid churn in this feature. One `Placeholder` page component is
used for Quote, Policy, Underwriter and Claims instead of four near-identical files.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Node.js 24 added as a second runtime alongside Python 3.13 | A browser front end needs a JavaScript toolchain to type-check, bundle and test. Dependencies are pinned in `frontend/package-lock.json`, matching the spirit of the `requirements.txt` rule. | Serving plain HTML from Python avoids Node but gives no component model, router or typed code, so the quote form feature would have to migrate anyway (see research.md). Recommend a PATCH amendment to the constitution's runtime line to name both runtimes. |

## Constitution Check (post-design)

Re-evaluated after Phase 1 artifacts ([data-model.md](data-model.md),
[contracts/routes.md](contracts/routes.md), [quickstart.md](quickstart.md)):

- The only "model" is a static navigation configuration; no boundary crossing, no schema needed.
- The UI contract lists every route and its required content, which the tests assert directly
  without network access.
- No new dependency was introduced by the design beyond those justified above.

**Gate result (post-design)**: PASS, same single documented deviation.
