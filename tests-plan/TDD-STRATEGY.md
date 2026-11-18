# TDD-STRATEGY.md — Offline Local Model Switchboard CLI

## The loop

Every phase runs the same red → green → refactor loop:

1. **Red.** Write the tests named in the phase file first. Run them. They must fail for the expected reason; a test that passes before implementation proves nothing.
2. **Green.** Implement the smallest complete version of the phase's deliverables that makes the tests pass.
3. **Refactor.** Clean up with the tests green. Refactoring that changes an interface defined by an earlier phase is a stop-and-ask event.

## Test types per phase

| Phase | Primary test type | Test requirement from the phase file |
|---|---|---|
| Phase 1 — Foundation | Unit + configuration checks (test runner, lint, build boot) | The test suite contains at least one passing test for the config loader defaults and the root command help output exits 0. |
| Phase 2 — Minimal end-to-end vertical slice | Integration (one real input travels the full slice) | An end-to-end test starts the gateway against a local stub endpoint and asserts the client receives the stub response body unchanged. |
| Phase 3 — Endpoint registry and health checks | Unit for module logic + integration at module seams | Tests register two endpoints, mark one unhealthy by pointing it at a closed port, and assert list output shows one healthy and one unhealthy endpoint. |
| Phase 4 — Routing profiles | Unit for module logic + integration at module seams | A test switches the active profile from drafting to review and asserts the next gateway request is forwarded to the review endpoint. |
| Phase 5 — Local usage logging | Unit for module logic + integration at module seams | A test sends three completed requests through the gateway and asserts the database contains exactly three rows with matching token counts. |
| Phase 6 — Integration | Integration + contract tests between modules | The integration test runs the full flow with two stub endpoints and asserts status output names the active profile and both endpoints. |
| Phase 7 — Hardening | Failure-path, security, and performance tests | Hardening tests send an unreachable endpoint request, a malformed request, and an oversized request and assert the expected status codes. |
| Phase 8 — Release verification and packaging | End-to-end regression + release verification | A release check script builds all three binaries, runs the full test suite, and asserts every CLI-REFERENCE command appears in the binary help output. |

## Mocking policy

Mocking inputs is fine: fixtures, fake timers, in-memory stand-ins for external services, and synthetic input data are all allowed. Mocking the logic under test is never fine, and neither is mocking the result of the logic under test. If a test would still pass with the real implementation deleted, the test is wrong and the phase fails.

## Definition of done for a phase

A phase is done only when every Pass condition in its Pass / Fail Criteria table is verified against real output — a command exit code, a test run, or an observable behavior — and a human has confirmed it. "The code looks right" is not a verification.

## Stack

Tests run on the stack pinned in `PROJECT-SPEC.yaml` (Go 1, Cobra 1, Viper 1, SQLite 3). Adding a test library not listed there is a stop-and-ask event.
