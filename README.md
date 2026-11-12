# searchAgent

A LangGraph research agent: a GPT-3.5 LLM node that calls a Tavily web-search tool in a loop until it can answer.

## Setup

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env   # then fill in OPENAI_API_KEY and TAVILY_API_KEY
python agent.py
```

## Activity log

1. Created virtual environment: `python -m venv venv`.
2. Activated it: `.\venv\Scripts\Activate.ps1`.
3. Installed: `python-dotenv langgraph langchain-core langchain-openai langchain-community tavily-python ipython`.
   (pip printed an "upgrade pip" notice on stderr, which PowerShell showed as an error; the install itself succeeded.)
4. Froze dependencies: `pip freeze > requirements.txt` (75 lines).
5. Created `.env.example` listing the required API keys.
6. Created this `README.md` with setup steps and this log.

## GitHub Spec Kit

Steps to add [GitHub Spec Kit](https://github.com/github/spec-kit) to this project. Each step is ticked once it has been done.

### 1. Prerequisites

- [x] 1.1 Install uv (Spec Kit's `specify` CLI is distributed through it): `winget install astral-sh.uv`.
      Already installed (uv 0.13.7). Restart VS Code / the terminal so `uv` is found on PATH.
- [x] 1.2 Initialise git: `git init -b main`, and add a `.gitignore` covering `venv/`, `.env`, `.mypy_cache/`, `__pycache__/` and `graph.png`.
- [x] 1.3 Baseline commit of `agent.py`, `README.md`, `requirements.txt`, `.env.example` and `.gitignore`.

### 2. Install Spec Kit

- [ ] 2.1 Install the CLI: `uv tool install specify-cli --from git+https://github.com/github/spec-kit.git`.
- [ ] 2.2 Initialise in this folder for Claude Code with PowerShell scripts: `specify init --here --ai claude --script ps`.
- [ ] 2.3 Verify: `specify check`.

### 3. Bootstrap the project

- [ ] 3.1 Run `/speckit.constitution` to set the project principles.
- [ ] 3.2 Commit the Spec Kit scaffolding and the constitution.

### 4. First feature

- [ ] 4.1 `/speckit.specify <what and why>` creates `specs/001-<name>/spec.md` and a feature branch.
- [ ] 4.2 `/speckit.clarify` resolves ambiguities in the spec.
- [ ] 4.3 `/speckit.plan <tech choices>` creates `plan.md`, research and data model.
- [ ] 4.4 `/speckit.tasks` creates `tasks.md` with ordered tasks.
- [ ] 4.5 `/speckit.analyze` (optional) checks spec, plan and tasks for consistency.
- [ ] 4.6 `/speckit.implement` executes the tasks.
