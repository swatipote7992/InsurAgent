# Quickstart: Application Shell and Home Page

How to run the shell and prove the spec's success criteria. Implementation detail lives in
`tasks.md`; the exact page content is in [contracts/routes.md](contracts/routes.md).

## Prerequisites

- Node.js 24 and npm 11 (check with `node --version` and `npm --version`).
- No API keys and no network are needed after `npm install`.

## Setup

```powershell
cd frontend
npm install
```

## Run

```powershell
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`).

## Check and test (no network)

```powershell
npm run check   # tsc --noEmit
npm test        # vitest run
npm run build   # production bundle into frontend/dist
```

All three must pass before the feature is complete (constitution: Development Workflow).

## Validation scenarios

| # | Steps | Expected | Proves |
|---|-------|----------|--------|
| 1 | Open `/`. | Heading "InsurAgent", short intro, the demo statement, a "Get a quote" action. Home is highlighted in the sidebar. | FR-001, FR-002, SC-004 |
| 2 | Click "Get a quote". | Address becomes `/quote`; placeholder text for Quote; Quote alone is highlighted. | FR-002, FR-004, FR-005 |
| 3 | Click each sidebar item in turn. | Each area opens, its item alone is highlighted, the sidebar order is Home, Quote, Policy, Underwriter, Claims. | FR-003, FR-004, SC-001 |
| 4 | Open `/underwriter` directly in a new tab, then press refresh. | Placeholder for Underwriter both times, Underwriter highlighted. | FR-006 |
| 5 | Press the browser back button after step 3. | Previous area reopens with its item highlighted. | FR-004 |
| 6 | Open `/nothing-here`. | "Page not found" with a "Go to Home" link; sidebar still visible; no item highlighted. | FR-007, SC-003 |
| 7 | Press Tab from the page top and Enter on "Claims". | Focus moves through the sidebar links; Claims opens. | FR-008, SC-005 |
| 8 | Narrow the window to 375 px. | Sidebar and content readable, no horizontal scrollbar. | FR-009 |
| 9 | Run `npm test`. | Automated versions of scenarios 1 to 7 pass with the network disabled. | Constitution IV |
