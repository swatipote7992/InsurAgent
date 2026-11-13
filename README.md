# InsurAgent

An AI-assisted car insurance demo. A React frontend in `frontend/` provides the application shell (left navigation and home page). `agent.py` is the LangGraph starting point, a GPT-3.5 LLM node that calls a Tavily web-search tool in a loop, which later features will turn into the underwriting agent.

## Setup

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env   # then fill in OPENAI_API_KEY and TAVILY_API_KEY
python agent.py
```

## GitHub Spec Kit

Steps to add [GitHub Spec Kit](https://github.com/github/spec-kit) to this project. Each step is ticked once it has been done.

### 1. Prerequisites

- [x] 1.1 Install uv (Spec Kit's `specify` CLI is distributed through it): `winget install astral-sh.uv`.
      Already installed (uv 0.13.7). Restart VS Code / the terminal so `uv` is found on PATH.
- [x] 1.2 Initialise git: `git init -b main`, and add a `.gitignore` covering `venv/`, `.env`, `.mypy_cache/`, `__pycache__/` and `graph.png`.
- [x] 1.3 Baseline commit of `agent.py`, `README.md`, `requirements.txt`, `.env.example` and `.gitignore`.

### 2. Install Spec Kit

- [x] 2.1 Install the CLI: `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git`
      (installed specify-cli 1.4.1.dev0), then `uv tool update-shell` to put `specify` on PATH.
- [x] 2.2 Initialise in this folder for speckit with ai model- Claude Code with PowerShell scripts:
      `specify init --here --force --non-interactive --integration claude --script ps --extension git`.
      (`--ai` was renamed to `--integration`; the `git` extension adds feature branches and auto-commit hooks.)
      Created `.specify/` (templates, scripts, constitution) and the `/speckit-*` skills in `.claude/skills/`.
- [x] 2.3 Verify specify check and list generated files: `specify check`.

### 3. Bootstrap the project

- [x] 3.1 Run `/speckit-constitution` to set the project principles.
      Wrote `.specify/memory/constitution.md` v1.0.0 with five principles: LangGraph orchestration,
      deterministic code for money, human in the loop for high risk, offline tests, typed and observable.
- [x] 3.2 Commit the Spec Kit scaffolding and the constitution.

### 4. First feature

- [x] 4.1 `/speckit-specify <what and why>` creates `specs/001-<name>/spec.md` and a feature branch.
      Created `specs/001-app-shell/spec.md` on branch `001-app-shell` (renamed from `001-quote-creation-form` after rescoping).
- [x] 4.2 `/speckit-clarify` resolves ambiguities in the spec.
      Three questions answered for the car quote draft (UK/GBP, no AI in v1, six referral rules); none needed for the shell spec.
- [x] 4.3 `/speckit-plan <tech choices>` creates `plan.md`, research and data model.
      Chose Vite + React + TypeScript + React Router + Tailwind; `research.md` records migration notes for the new majors.
- [x] 4.4 `/speckit-tasks` creates `tasks.md` with ordered tasks.
      32 tasks across setup, foundational, two user stories and polish, tests before code.
- [ ] 4.5 `/speckit-analyze` (optional) checks spec, plan and tasks for consistency. Skipped this time.
- [x] 4.6 `/speckit-implement` executes the tasks.
      Built `frontend/`; all tasks ticked in `specs/001-app-shell/tasks.md`.

### 5. Pending constitution amendment

- [ ] 5.1 The constitution's runtime line names only Python 3.13. Feature 001 added Node.js 24 for the frontend (pinned by `frontend/package-lock.json`).
      Run `/speckit-constitution` to make a PATCH amendment naming both runtimes (see `specs/001-app-shell/plan.md`, Complexity Tracking).

## Backend

A Python API in `backend/` that will serve quotes, underwriting decisions and policies to the frontend.
It is at an early stage: two sample endpoints and a file of sample data.

### Tech stack

- Python 3.13
- FastAPI (web framework) and uvicorn (development server)

### Prerequisites

- Python 3.13 on your PATH (`python --version`)

### Install

```powershell
cd backend
python -m venv .venv                # create the virtual environment (once)
.\.venv\Scripts\Activate.ps1        # activate it; the prompt then starts with (.venv)
pip install fastapi uvicorn         # install dependencies (once)
```

Activate the virtual environment in every new terminal before running the backend. `deactivate` leaves it.

If PowerShell refuses to run `Activate.ps1`, allow local scripts once with
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, then activate again.
From Command Prompt use `.venv\Scripts\activate.bat`; from Git Bash use `source .venv/Scripts/activate`.

### Run

```powershell
uvicorn app:app --reload
```

The API runs at http://127.0.0.1:8000 and reloads when a file changes.
Interactive API documentation is generated at http://127.0.0.1:8000/docs.

### API endpoints

| Method | Path | Returns |
|---|---|---|
| GET | `/` | A hello-world message |
| GET | `/quotes` | A placeholder list of three quote names (not yet read from `data/quotes.json`) |

### Sample data

`backend/data/quotes.json` holds 10 synthetic UK car insurance quotes: 2 `New`, 3 `InProgress`, 3 `Referred` to an underwriter and 2 `ReadyForPolicy`.
The home page grid shows the status as a colour-coded badge (blue New, amber In Progress, red Referred, green Ready for policy).
Each record has a reference, status, policyholder, vehicle, cover selection, named drivers, premium breakdown and referral reasons.
The fields follow the parked quote spec in `specs/drafts/car-insurance-quote-spec.md`. No real customer data is used.

### Project structure

```text
backend/
├── app.py            # FastAPI application and routes
├── data/
│   └── quotes.json   # 10 synthetic sample quotes
└── .venv/            # virtual environment (not committed)
```

### Tests

None yet.

## Frontend

A single-page web application in `frontend/` that provides the application shell: a left navigation, the home page and placeholder pages for the areas still to be built.
It makes no backend calls yet and needs no sign-in.

### Tech stack

- React 19 and TypeScript 7
- Vite 8 (development server and build)
- React Router 8 (routing)
- Tailwind CSS 4 (styling)
- Vitest 5 and Testing Library (tests)

### Prerequisites

- Node.js 24 and npm 11

### Install

```powershell
cd frontend
npm install
```

No API keys are needed, and no network access is needed after install.

### Run

```powershell
npm run dev
```

The app runs at http://localhost:5173.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run check` | Type-checks with `tsc --noEmit` |
| `npm test` | Runs the test suite once with Vitest |
| `npm run build` | Type-checks, then builds the production bundle into `frontend/dist` |
| `npm run preview` | Serves the production bundle locally |

### Pages

| Path | Page |
|---|---|
| `/` | Home: the InsurAgent heading, a short description of the demo, a notice that no real customer data is used, and a "Get a quote" button that goes to `/quote` |
| `/quote`, `/policy`, `/underwriter`, `/claims` | Placeholder: "The <area> area is not yet available." |
| anything else | Not found, shown inside the same shell |

The left navigation links to Home, Quote, Policy, Underwriter and Claims and highlights the current area. On narrow screens it moves to the top of the page.
The sidebar links and the routes both come from one list, `NAV_ITEMS` in `frontend/src/nav.ts`, so adding an area means adding one entry there.

### Project structure

```text
frontend/
├── index.html
├── src/
│   ├── main.tsx          # entry point; supplies the router
│   ├── App.tsx           # routes
│   ├── nav.ts            # NAV_ITEMS: sidebar links and routes
│   ├── components/       # Layout, Sidebar
│   └── pages/            # Home, Placeholder, NotFound
└── tests/                # Vitest tests for home, navigation and placeholders
```

### Tests

```powershell
npm test
```

Manual validation scenarios are in `specs/001-app-shell/quickstart.md`.

## To DO
1. Create an insurance application
2. Enter business details and select coverage.
3. Show AI underwriting
4. Show the agent extracting information and retrieving underwriting rules.
5. Demonstrate a referral
6. Show LangGraph routing a high-risk application to the underwriter.
7. Generate a quote
8. Show the deterministic rating engine calculating the premium.
9. Issue a policy
10. Accept the quote, confirm sandbox payment and generate the policy document.
11. Show the technical implementation
12. Open LangGraph traces, agent tool calls, checkpointed state and evaluation results.