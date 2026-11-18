# AGENTS.md — Offline Local Model Switchboard CLI

Rules for any coding agent building this project. Load this file as your persistent rules file before Phase 1 and keep it loaded for every phase.

## Non-negotiable rules

1. **Zero-Mock Mandate.** Never present simulated, stubbed, or placeholder logic as a working capability. Mocking inputs and external boundaries in tests is allowed; mocking the logic under test is a phase failure.
2. **TDD First.** A failing test precedes every implementation. Tests are never weakened, skipped, or deleted to make a phase pass.
3. **No hallucinated APIs or packages.** Use only the libraries named in PROJECT-SPEC.yaml and ARCHITECTURE.md. If a needed API or package is not listed there, stop and ask instead of inventing it.
4. **Sequential locking.** Build one phase at a time, in order. Stop and wait for human confirmation after every phase; never start phase N+1 on your own.
5. **Complete files, no TODOs on critical logic.** Every file you output is complete and functional. No TODO, TBD, or placeholder text on any logic a test covers.
6. **Conflict resolution.** On ambiguity, conflicting requirements, or any decision with security, privacy, or compliance weight, stop and ask. Never resolve it by assumption.
7. **Scope boundary.** Never build anything in the non-goals list, restated verbatim from PROJECT-SPEC.yaml: "Hosting or running model inference itself; the tool only fronts endpoints that already run locally"; "Proxying to cloud model providers or performing cloud billing and metering"; "Providing a graphical user interface or web dashboard"; "Fine-tuning, training, or evaluating models"; "Multi-user authentication, single sign-on, or team access control". If a request appears to push past this boundary, stop and ask.

## Tech stack strictness

Use exactly this stack, quoted from `PROJECT-SPEC.yaml`. Substituting a library, framework, or major version is a stop-and-ask event.

- Go 1 — Language and runtime for the CLI and the gateway server
- Cobra 1 — Command tree, subcommands, flags, and help output for the CLI
- Viper 1 — Configuration file, environment variable, and flag precedence handling
- SQLite 3 — Embedded local database for usage and token-count records

Runtime environment: Go 1.23 on Linux, macOS, and Windows as a single static binary with no runtime dependencies beyond the local model endpoints it fronts

## Working style

- Restate the phase goal in your own words before writing code.
- Write the phase's tests first, watch them fail, then implement until they pass.
- After implementing, self-check against the phase's Pass / Fail Criteria table and report the actual test output.
- Never weaken a test to make it pass.
- Flag uncertainty plainly instead of presenting a guess as fact.

## Scope boundary

Project type: cli-tool. Source idea: "Offline Local Model Switchboard CLI", derived from the starred repo QuantumNous/new-api. Anything outside the feature list in `PROJECT-SPEC.yaml` is out of scope until a human adds it to the spec.
