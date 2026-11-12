# Research: Application Shell and Home Page

Phase 0 output. Every unknown in the plan's Technical Context is resolved here. Versions were
read from the npm registry on 2026-11-12; migration notes were read from each project's own
documentation the same day.

## R1. Frontend framework

- **Decision**: Vite + React 19 + TypeScript, client-side only, in `frontend/`.
- **Rationale**: The user chose it at planning time. It is the most common React toolchain, has
  a typed component model the later quote form will need, and leaves the Python agent free to
  become an API behind it.
- **Alternatives considered**: Next.js (server rendering and file routing the shell does not
  need, and its server duplicates the planned Python backend); plain HTML/CSS/JS (no router or
  component model, so the quote form would force a migration anyway).

## R2. Routing

- **Decision**: React Router 8.5.x in declarative mode: `BrowserRouter`, `Routes`, `Route`,
  `Outlet`, `NavLink`, `Link`, all imported from the `react-router` package.
- **Rationale**: Gives each area a stable address (FR-006), not-found handling (FR-007) and
  active-link highlighting (FR-004). `NavLink` sets `aria-current="page"` automatically and
  accepts a `className` function receiving `isActive`, which is exactly the contract in
  [contracts/routes.md](contracts/routes.md).
- **Version notes (v8 vs v7)**: `react-router-dom` was removed as a package; import from
  `react-router`. Packages are ESM-only. Requires React 19.2.7+ and Node 22.22+. None of the
  declarative APIs above were renamed or removed. `future.v8_*` flags never applied to
  declarative mode.
- **Alternatives considered**: TanStack Router (typed routes, more setup than five static
  paths justify); hand-rolled `history` listener (would reimplement highlighting and 404).

## R3. Build tool

- **Decision**: Vite 8.3.x with `@vitejs/plugin-react` 6.x.
- **Rationale**: Standard React dev server and bundler; fastest path to `npm run dev`.
- **Version notes (v8 vs v7)**: Production builds use Rolldown instead of Rollup, and Oxc
  instead of esbuild for transforms and minification. A compatibility layer converts old
  `esbuild` and `rollupOptions` config, and this feature sets neither. `build.rollupOptions` is
  now `build.rolldownOptions`. Default browser targets moved to Chrome/Edge 111, Firefox 114,
  Safari 16.4, which still covers the evergreen browsers in the plan. Plugin-react 6 drops Babel
  and uses Oxc for React Refresh. Node 20.19+ or 22.12+; Node 24 satisfies it.
- **Alternatives considered**: Vite 7 (one major back, no benefit since no config is affected).

## R4. Language and type checking

- **Decision**: TypeScript 7.0.x, `tsc --noEmit` as the `npm run check` script.
- **Rationale**: Constitution V requires typed code; TypeScript strict mode is the frontend
  equivalent of mypy. TypeScript 7 is the native Go port of the compiler, about 10x faster, with
  the same `typescript` npm package and `tsc` command.
- **Version notes (7.0)**: `strict`, `module: esnext` and `types: []` are now defaults.
  `moduleResolution: "bundler"` is the recommended value and is what the plan uses. Hard errors
  now for `baseUrl`, `moduleResolution: node`, `esModuleInterop: false` and `target: es5`, none
  of which this feature sets. The 7.0 release does not ship a compiler API; Vite and Vitest do
  not use the TypeScript API (they transform with Oxc/esbuild and leave type checking to `tsc`),
  so this does not affect the toolchain. Tools that do need the API are pointed at the
  `@typescript/typescript6` package.
- **Fallback**: If `tsc` or editor tooling misbehaves, pin `typescript@6` with no other change;
  7.0 is documented as compatible with 6.0's type checking and command line.
- **Alternatives considered**: TypeScript 6.x (safe, slower; kept as the fallback).

## R5. Styling

- **Decision**: Tailwind CSS 4.3.x through `@tailwindcss/vite`, with a single
  `@import "tailwindcss";` in `src/index.css` and a few `@theme` tokens for the brand colours.
- **Rationale**: The user chose Tailwind at planning time. Version 4 needs no `tailwind.config`
  file or PostCSS setup when used through the Vite plugin.
- **Alternatives considered**: Plain CSS with custom properties (no dependency, fine for a
  sidebar, but the user prefers to learn Tailwind); MUI or Mantine (heavier, fixed look).

## R6. Testing

- **Decision**: Vitest 5.1.x with `environment: "jsdom"` (jsdom 31 installed explicitly),
  `@testing-library/react` 16.3.x, `@testing-library/jest-dom` 7.x loaded through `setupFiles`,
  run once with `vitest run`. Config lives in `vite.config.ts` under `test`.
- **Rationale**: Constitution IV: user-visible behaviour tested without the network. Testing
  Library queries by role and text match the UI contract directly.
- **Version notes (5.x)**: Requires Vite 6.4+ and Node 22.12+. `vite` is now a peer dependency,
  installed automatically by npm. `setupFiles` and `environment` unchanged. `clearMocks` now
  defaults to true. `toHaveTextContent` is strict equality; use `toMatchTextContent` for
  regex. Nothing in this feature uses mocks or snapshots.
- **Alternatives considered**: Playwright end-to-end (adds a browser download and startup time;
  worth adding when there is a real backend); Jest (needs extra transform setup with Vite).

## R7. Repository layout

- **Decision**: New `frontend/` folder at the repository root. `agent.py` and `requirements.txt`
  stay where they are.
- **Rationale**: Keeps this feature's diff to one new folder. Moving the Python code under
  `backend/` is deferred to the feature that first exposes an API.
- **Alternatives considered**: Move Python to `backend/` now (churn with no functional gain).

## R8. Second runtime (constitution deviation)

- **Decision**: Accept Node.js 24 alongside Python 3.13, pin via `package-lock.json`, and
  recommend a PATCH amendment to the constitution's runtime line.
- **Rationale**: A browser front end cannot be type-checked, bundled or tested without a
  JavaScript toolchain. The lock file gives the same reproducibility the constitution asks of
  `requirements.txt`.
- **Alternatives considered**: Serving static HTML from Python (rejected in R1).

## Pinned versions (npm registry, 2026-11-12)

| Package | Version |
|---------|---------|
| react, react-dom | 19.3.1 |
| react-router | 8.5.1 |
| vite | 8.3.8 |
| @vitejs/plugin-react | 6.3.0 |
| typescript | 7.0.2 |
| tailwindcss, @tailwindcss/vite | 4.3.5 |
| vitest | 5.1.0 |
| jsdom | 31.0.0 |
| @testing-library/react | 16.3.3 |
| @testing-library/jest-dom | 7.0.1 |

Install with caret ranges on these majors; `package-lock.json` records the exact resolution.
