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

## Frontend

Requires Node.js 24 and npm 11. No API keys or network are needed after install.

```powershell
cd frontend
npm install      # once
npm run dev      # http://localhost:5173
npm run check    # tsc --noEmit
npm test         # vitest run
npm run build    # production bundle in frontend/dist
```

Validation scenarios are in `specs/001-app-shell/quickstart.md`.

## Activity log

1. Created virtual environment: `python -m venv venv`.
2. Activated it: `.\venv\Scripts\Activate.ps1`.
3. Installed: `python-dotenv langgraph langchain-core langchain-openai langchain-community tavily-python ipython`.
   (pip printed an "upgrade pip" notice on stderr, which PowerShell showed as an error; the install itself succeeded.)
4. Froze dependencies: `pip freeze > requirements.txt` (75 lines).
5. Created `.env.example` listing the required API keys.
6. Created this `README.md` with setup steps and this log.
7. Feature 001 on branch `001-app-shell`: ran `/speckit-specify`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks` and `/speckit-implement`.
   The first spec (a UK car insurance quote form) was rescoped to the application shell and home page only; the quote spec is parked in `specs/drafts/car-insurance-quote-spec.md` for a later feature.
8. Created `frontend/` with Vite 8, React 19, TypeScript 7, React Router 8, Tailwind CSS 4 and Vitest 5 (versions and migration notes in `specs/001-app-shell/research.md`).
   `npm test` 12 passing, `npm run check` clean, `npm run build` succeeds.
9. Quickstart validation (`specs/001-app-shell/quickstart.md`): scenarios 1 to 7 are covered by the automated tests; the dev server was confirmed to serve `/`, `/underwriter` and `/nothing-here` directly (direct open and refresh).
   Scenario 8 (375 px width, no horizontal scroll) was not checked in a browser this session and is still to be eyeballed.

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