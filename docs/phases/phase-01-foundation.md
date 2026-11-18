# Phase 1 — Foundation

**Tag:** `[OLMS: PHASE 1]`
**Goal:** Create the Go module, CLI skeleton, configuration loader stub, and test runner with no feature code.
**Depends on:** none

## Prompt to AI

```
[OLMS: PHASE 1]
- Initialize the Go module offline-local-model-switchboard-cli and add Cobra and Viper as dependencies
- Create the root Cobra command with serve, endpoint, profile, usage, and status subcommand stubs that print not implemented and exit 1
- Wire the Makefile test target to run go test ./... and go vet ./...
- Test Requirement: The test suite contains at least one passing test for the config loader defaults and the root command help output exits 0.
- Output the complete, functional file(s) listed under Deliverables.

Do not build anything assigned to a later phase, and do not cross the non-goals boundary in AGENTS.md. Stop and wait for confirmation.
```

## Deliverables

- go.mod (+ its test, per the phase's Test Requirement)
- cmd/switchboard/main.go (+ its test, per the phase's Test Requirement)
- internal/config/config.go (+ its test, per the phase's Test Requirement)
- Makefile (+ its test, per the phase's Test Requirement)

## Pass / Fail Criteria

| Result | Condition |
|---|---|
| **Pass** | go test ./... passes with zero failures |
| **Pass** | switchboard --help exits 0 and lists all five subcommands |
| **Fail** | Faked or mocked the logic under test, or presented a placeholder as a working capability |
| **Fail** | go test ./... reports any failure |
| **Fail** | switchboard --help exits non-zero or omits any subcommand |

## Notes

This phase delivers infrastructure or hardening that the feature phases depend on; it adds no user-facing feature of its own. Cross-reference `ARCHITECTURE.md` for module boundaries and the package's reference document for contracts before writing code. Project non-goals that bind this phase: Hosting or running model inference itself; the tool only fronts endpoints that already run locally; Proxying to cloud model providers or performing cloud billing and metering; Providing a graphical user interface or web dashboard; Fine-tuning, training, or evaluating models; Multi-user authentication, single sign-on, or team access control.
