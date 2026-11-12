# InsurAgent Constitution

## Core Principles

### I. LangGraph Is the Orchestration Layer

Every agent workflow MUST be expressed as a LangGraph `StateGraph` with typed state, named nodes
and explicit edges. Routing decisions (for example, sending a high-risk application to a human
underwriter) MUST be conditional edges in the graph, not branching hidden inside a node or a
prompt. Multi-step workflows MUST use a checkpointer so state can be inspected and resumed.

Rationale: the graph is the single place where control flow can be read, traced and tested.

### II. Deterministic Code Owns Decisions About Money

Premiums, limits, fees and any other monetary figure MUST be calculated by deterministic,
unit-tested Python code. The LLM MAY extract information, retrieve rules, summarise and
recommend, but it MUST NOT compute or alter a price. The same inputs MUST always produce the
same quote.

Rationale: a quote has to be reproducible and explainable; model output is neither.

### III. Human in the Loop for High-Risk Outcomes

Any application the underwriting rules classify as high risk, and any case where the agent lacks
required information, MUST be referred to a human underwriter through a graph interrupt. The
agent MUST NOT decline, bind or issue a policy on such an application by itself. Every referral
MUST record the reason and the rules that triggered it.

Rationale: automated underwriting is only acceptable when the risky cases reach a person.

### IV. Tests Run Without the Network

Every feature MUST ship with pytest tests that pass with no API keys and no network access. LLM
and external tool calls MUST be mocked or faked in tests. Deterministic components (rating
engine, rule evaluation, routing functions) MUST have direct unit tests. Agent behaviour that
depends on a live model MUST be covered by a separate evaluation set, kept apart from the unit
tests.

Rationale: tests that need paid, non-deterministic services do not get run.

### V. Typed, Simple and Observable

All Python code MUST carry type hints and pass mypy. Structured data crossing a boundary (LLM
output, tool input, API payload) MUST be validated with a schema. Every agent run MUST be
traceable: tool calls, routing decisions and state transitions are logged or traced. New
dependencies and abstractions MUST be justified by a current requirement, not a possible future
one.

Rationale: agent systems fail in ways that are only diagnosable with types and traces.

## Security and Data Constraints

- Secrets MUST be read from environment variables loaded from `.env`; `.env` MUST NOT be
  committed, and every required key MUST be listed in `.env.example`.
- Payments MUST use a sandbox or test mode only. Real payment credentials MUST NOT be used.
- Demo and test data MUST be synthetic. Real personal or business data MUST NOT be stored in
  the repository.
- Secrets and personal data MUST NOT be written to logs or traces.
- Runtime is Python 3.13 on Windows; dependencies are pinned in `requirements.txt`.

## Development Workflow

- Features follow the Spec Kit flow: `/speckit-specify`, `/speckit-clarify`, `/speckit-plan`,
  `/speckit-tasks`, `/speckit-implement`, each on its own feature branch.
- A feature is complete only when its tests pass, mypy is clean, and it can be run from the
  commands documented in `README.md`.
- Each completed step is recorded in the `README.md` activity log.
- Plans MUST include a Constitution Check; any deviation from a principle MUST be written down
  with its justification in the plan.

## Governance

This constitution takes precedence over other project practices. Amendments are made by editing
this file through `/speckit-constitution`, with the change and its reason recorded in the commit
message. Versioning follows semantic versioning: MAJOR for removing or redefining a principle,
MINOR for adding a principle or section, PATCH for clarifications. Compliance is checked at the
plan stage (Constitution Check) and again before a feature branch is merged.

**Version**: 1.0.0 | **Ratified**: 2026-11-12 | **Last Amended**: 2026-11-12
