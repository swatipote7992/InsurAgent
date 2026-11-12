---

description: "Task list for the application shell and home page"
---

# Tasks: Application Shell and Home Page

**Input**: Design documents from `/specs/001-app-shell/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/routes.md, quickstart.md

**Tests**: Included. The constitution (Principle IV) requires every feature to ship with tests
that pass with no network access. Tests use Vitest + jsdom + Testing Library and are written
before the code they cover.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested
on its own.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- Web app, frontend only: all paths are under `frontend/` at the repository root. The Python
  agent at the root is untouched.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the frontend project and its toolchain exactly as research.md pins it.

- [X] T001 Create `frontend/package.json` with name `insuragent-frontend`, `"type": "module"`, `"private": true`, scripts `dev: vite`, `build: tsc --noEmit && vite build`, `check: tsc --noEmit`, `test: vitest run`, `preview: vite preview`; dependencies `react ^19.3.1`, `react-dom ^19.3.1`, `react-router ^8.5.1`; devDependencies `vite ^8.3.8`, `@vitejs/plugin-react ^6.3.0`, `typescript ^7.0.2`, `tailwindcss ^4.3.5`, `@tailwindcss/vite ^4.3.5`, `vitest ^5.1.0`, `jsdom ^31.0.0`, `@testing-library/react ^16.3.3`, `@testing-library/jest-dom ^7.0.1`, `@types/react ^19`, `@types/react-dom ^19`
- [X] T002 [P] Create `frontend/.gitignore` with `node_modules`, `dist`, `*.local`, `.env*`, `coverage`
- [X] T003 [P] Create `frontend/tsconfig.json`: `target ES2022`, `lib ["ES2022","DOM","DOM.Iterable"]`, `module ESNext`, `moduleResolution bundler`, `jsx react-jsx`, `strict true`, `noEmit true`, `isolatedModules true`, `skipLibCheck true`, `noUnusedLocals true`, `noUnusedParameters true`, `types ["vite/client","vitest/globals","@testing-library/jest-dom"]`, `include ["src","tests"]`. Do not set `baseUrl` or `esModuleInterop: false` (hard errors in TypeScript 7, see research.md R4)
- [X] T004 [P] Create `frontend/vite.config.ts` using `defineConfig` from `vitest/config`, plugins `react()` and `tailwindcss()`, and `test: { environment: "jsdom", globals: true, setupFiles: ["./tests/setup.ts"] }`
- [X] T005 [P] Create `frontend/index.html` with `<title>InsurAgent</title>`, viewport meta, `<div id="root">` and `<script type="module" src="/src/main.tsx">`
- [X] T006 [P] Create `frontend/src/index.css` with `@import "tailwindcss";` and an `@theme` block defining `--color-brand` (sidebar background), `--color-brand-active` (active link) and `--color-surface` (content background)
- [X] T007 [P] Create `frontend/src/vite-env.d.ts` containing `/// <reference types="vite/client" />`
- [X] T008 [P] Create `frontend/tests/setup.ts` importing `@testing-library/jest-dom/vitest`
- [X] T009 Run `npm install` in `frontend/` to produce `frontend/package-lock.json`, then run `npm run check` and confirm it exits 0 with no source files yet (depends on T001, T003)
- [X] T010 Verify the root `.gitignore` ignores `node_modules/` and `frontend/dist/`; append the patterns if missing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The navigation configuration, router bootstrap and layout shell that both user
stories render inside.

**ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¯ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 Create `frontend/src/nav.ts` exporting `interface NavItem { label: string; path: string; Page: ComponentType }` and `NAV_ITEMS: readonly NavItem[]` with exactly five entries in this order: Home `/`, Quote `/quote`, Policy `/policy`, Underwriter `/underwriter`, Claims `/claims`. Every `path` is unique and starts with `/`. Home maps to the `Home` page; the other four map to `Placeholder` with the label as `areaName` (pages created in T012 and T017 to T018; import them here)
- [X] T012 [P] Create a temporary stub `frontend/src/pages/Home.tsx` exporting a component that renders `<h1>InsurAgent</h1>` only (replaced in US1)
- [X] T013 [P] Create `frontend/src/components/Sidebar.tsx`: a `<nav aria-label="Main navigation">` containing a `<ul>` of `NavLink`s from `NAV_ITEMS`, `end` set when `path === "/"`, `className` function using `isActive` to apply the brand-active background; Tailwind classes for a 220 px wide panel on `md:` and above, stacked full-width below
- [X] T014 [P] Create `frontend/src/components/Layout.tsx`: a flex container (`flex-col md:flex-row min-h-screen`) rendering `<Sidebar />` and `<main className="flex-1 p-8"><Outlet /></main>`
- [X] T015 Create `frontend/src/App.tsx` exporting `App`, rendering `<Routes>` with a parent `<Route element={<Layout />}>` whose children are one `<Route path={path} element={<Page />}>` per `NAV_ITEMS` entry and a `<Route path="*" element={<NotFound />}>` (NotFound stub: `<h1>Page not found</h1>` in `frontend/src/pages/NotFound.tsx`, replaced in US2). `App` must not include a router so tests can wrap it in `MemoryRouter` (depends on T011, T013, T014)
- [X] T016 Create `frontend/src/main.tsx` mounting `<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>` into `#root` and importing `./index.css`; then run `npm run check` and `npm run dev` and confirm the shell renders at `http://localhost:5173` (depends on T015)

**Checkpoint**: Shell renders with a sidebar and an empty content area. User stories can begin.

---

## Phase 3: User Story 1 - See the Home Page (Priority: P1) ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â°ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¸ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â½ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¯ MVP

**Goal**: The root address shows the product name, a short introduction, the demo statement and
a "Get a quote" action that opens the Quote area.

**Independent Test**: Open `/`; confirm the heading "InsurAgent", the introduction, the sentence
"This is a demonstration. No real customer data is used." and a "Get a quote" link; click it and
confirm the address becomes `/quote` with Quote highlighted.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T017 [US1] Create `frontend/tests/home.test.tsx` rendering `<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>` and asserting: a level-1 heading with text "InsurAgent"; the text "This is a demonstration. No real customer data is used."; a link with accessible name "Get a quote" whose `href` is `/quote`; after `userEvent.click` on that link, a heading "Quote" is shown and the sidebar link "Quote" has `aria-current="page"` (contract: contracts/routes.md, FR-002)

### Implementation for User Story 1

- [X] T018 [US1] Replace the stub in `frontend/src/pages/Home.tsx` with: `<h1>InsurAgent</h1>`; an introduction of at most three sentences describing a demonstration of AI-assisted car insurance; a paragraph with exactly "This is a demonstration. No real customer data is used."; a `<Link to="/quote">` styled as a primary button with text "Get a quote" (FR-002)
- [X] T019 [US1] Run `npm test` and `npm run check`; both must pass before this story is complete

**Checkpoint**: User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Navigate Between Areas (Priority: P2)

**Goal**: The sidebar lists the five areas in order, highlights exactly the current one, Quote,
Policy, Underwriter and Claims show placeholders, unknown addresses show "Page not found" with the
sidebar still visible, and the sidebar is keyboard operable.

**Independent Test**: Click each sidebar item and confirm the matching page opens with that item
alone highlighted; open `/underwriter` directly and refresh; open `/nothing-here`; tab through the
sidebar and press Enter on Claims.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T020 [P] [US2] Create `frontend/tests/navigation.test.tsx` asserting, with `MemoryRouter`: the `navigation` landmark with accessible name "Main navigation" exists; its links read exactly "Home", "Quote", "Policy", "Underwriter", "Claims" in that order; with `initialEntries={["/policy"]}` only the "Policy" link has `aria-current="page"`; with `initialEntries={["/"]}` only "Home" has it; after clicking "Claims" then calling `history.back()` via `initialEntries={["/", "/claims"]}` and `initialIndex`, the highlighted link follows the address (FR-003, FR-004, FR-006)
- [X] T021 [P] [US2] Create `frontend/tests/placeholders.test.tsx` asserting, for each of `/quote`, `/policy`, `/underwriter`, `/claims`: a level-1 heading with the area name and the text "The {Area} area is not yet available."; and for `/nothing-here`: a level-1 heading "Page not found", a link "Go to Home" with `href` `/`, the navigation landmark still present, and no link with `aria-current` (FR-005, FR-007)
- [X] T022 [P] [US2] Add to `frontend/tests/navigation.test.tsx` a keyboard test: `userEvent.tab()` repeatedly reaches each sidebar link in order, and `userEvent.keyboard("{Enter}")` on "Claims" shows the Claims heading (FR-008)

### Implementation for User Story 2

- [X] T023 [P] [US2] Create `frontend/src/pages/Placeholder.tsx` taking `{ areaName: string }` and rendering `<h1>{areaName}</h1>` and `<p>The {areaName} area is not yet available.</p>` (data-model.md: Placeholder page props)
- [X] T024 [P] [US2] Replace the stub in `frontend/src/pages/NotFound.tsx` with `<h1>Page not found</h1>` and a `<Link to="/">Go to Home</Link>`
- [X] T025 [US2] Update `frontend/src/nav.ts` so Quote, Policy, Underwriter and Claims map to `Placeholder` with their label as `areaName` (depends on T023)
- [X] T026 [US2] Finalise `frontend/src/components/Sidebar.tsx`: brand title "InsurAgent" above the list, active link background `bg-brand-active text-white`, hover state, `focus-visible` ring so keyboard focus is visible, and confirm `NavLink` emits `aria-current="page"` (FR-004, FR-008)
- [X] T027 [US2] Confirm responsive behaviour in `frontend/src/components/Layout.tsx` and `Sidebar.tsx`: at 375 px the sidebar stacks above the content with no horizontal scroll; at 768 px and above it sits on the left at 220 px (FR-009, contract: navigation panel)
- [X] T028 [US2] Run `npm test` and `npm run check`; all tests pass

**Checkpoint**: Both user stories work independently. Every route in contracts/routes.md renders
its required content.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, build verification and the manual validation pass.

- [X] T029 [P] Update `README.md`: replace the first paragraph to describe InsurAgent as an AI-assisted car insurance demo with a React frontend and a LangGraph agent; add a "Frontend" section with the commands from `specs/001-app-shell/quickstart.md`; add activity log entries for the Spec Kit feature 001 steps; tick 4.1 to 4.6 in the Spec Kit section as applicable; fix the "iOpen" typo in the To Do list
- [X] T030 [P] Run `npm run build` in `frontend/` and confirm `frontend/dist/` is produced with no warnings about unsupported config (research.md R3: Vite 8 bundler change)
- [X] T031 Run the manual scenarios 1 to 8 in `specs/001-app-shell/quickstart.md` against `npm run dev` and record the result in the README activity log
- [X] T032 Record the Node.js runtime deviation for a later `/speckit-constitution` PATCH amendment: add a one-line note under the README's Spec Kit section stating the constitution's runtime line should name Node.js 24 alongside Python 3.13 (plan.md Complexity Tracking)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. T002 to T008 run in parallel after T001; T009 needs T001 and T003; T010 is independent.
- **Foundational (Phase 2)**: Depends on Setup. T012, T013, T014 run in parallel after T011; T015 needs T011, T013, T014; T016 needs T015. Blocks both user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational. T017 before T018; T019 last.
- **User Story 2 (Phase 4)**: Depends on Foundational. Independent of US1 (only `nav.ts` is shared, and US2 edits a different part of it). T020 to T022 in parallel, then T023 and T024 in parallel, then T025, T026, T027, T028.
- **Polish (Phase 5)**: Depends on both stories. T029 and T030 in parallel; T031 after T030; T032 with T029.

### User Story Dependencies

- **User Story 1 (P1)**: Needs only the Foundational shell.
- **User Story 2 (P2)**: Needs only the Foundational shell. The "Get a quote" test in US1 relies on the Quote route existing, which the Foundational stub already provides.

### Parallel Opportunities

- Phase 1: T002, T003, T004, T005, T006, T007, T008 together.
- Phase 2: T012, T013, T014 together.
- Phase 4: T020, T021, T022 together; T023, T024 together.
- Phase 5: T029, T030 together.
- After Phase 2, US1 and US2 can be worked on by two people at once.

---

## Parallel Example: User Story 2

```text
# Write all three test files together:
Task: "Create frontend/tests/navigation.test.tsx"
Task: "Create frontend/tests/placeholders.test.tsx"
Task: "Add keyboard test to frontend/tests/navigation.test.tsx"   # same file as the first: run after it

# Then both page components together:
Task: "Create frontend/src/pages/Placeholder.tsx"
Task: "Replace stub in frontend/src/pages/NotFound.tsx"
```

(T022 shares a file with T020, so in practice write T020 then T022; T021 is fully parallel.)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: `npm test`, `npm run check`, open `/` and click "Get a quote"
5. Demo the home page

### Incremental Delivery

1. Setup + Foundational ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ shell renders
2. User Story 1 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ home page with "Get a quote" (MVP)
3. User Story 2 ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ placeholders, not-found, highlighting, keyboard, responsive
4. Polish ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ README, production build, quickstart pass

---

## Notes

- [P] tasks = different files, no dependencies
- Tests must fail before their implementation task and pass after it
- No task may add a dependency not listed in research.md without updating plan.md's
  dependency justification table (Constitution V)
- Commit after each phase checkpoint
