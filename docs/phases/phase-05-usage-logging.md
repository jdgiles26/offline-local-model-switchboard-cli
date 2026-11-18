# Phase 5 — Local usage logging

**Tag:** `[OLMS: PHASE 5]`
**Goal:** Record every completed request in the local SQLite database and report token totals per model and day.
**Depends on:** Phase 4

## Prompt to AI

```
[OLMS: PHASE 5]
- Create the usage table with timestamp, profile, endpoint, model, prompt tokens, completion tokens, and elapsed milliseconds
- Write one row per completed request from GatewayServer through UsageStore and skip rows for requests that fail before completion
- Implement usage today and usage --days N to print totals grouped by model from the local database
- Test Requirement: A test sends three completed requests through the gateway and asserts the database contains exactly three rows with matching token counts.
- Output the complete, functional file(s) listed under Deliverables.

Do not build anything assigned to a later phase, and do not cross the non-goals boundary in AGENTS.md. Stop and wait for confirmation.
```

## Deliverables

- internal/usage/store.go (+ its test, per the phase's Test Requirement)
- internal/usage/store_test.go (+ its test, per the phase's Test Requirement)
- cmd/switchboard/usage.go (+ its test, per the phase's Test Requirement)

## Pass / Fail Criteria

| Result | Condition |
|---|---|
| **Pass** | Three completed requests produce exactly three database rows with correct token counts |
| **Pass** | usage today prints the summed totals matching the database |
| **Fail** | Faked or mocked the logic under test, or presented a placeholder as a working capability |
| **Fail** | The row count differs from the number of completed requests |
| **Fail** | usage totals differ from the database sums by any amount |

## Notes

Features delivered in this phase (from `PROJECT-SPEC.yaml`): Local usage logging — Every completed request writes one row to the local SQLite database with timestamp, profile, endpoint, model, prompt tokens, completion tokens, and elapsed milliseconds, and a CLI command prints daily totals per model.. Cross-reference `ARCHITECTURE.md` for module boundaries and the package's reference document for contracts before writing code. Project non-goals that bind this phase: Hosting or running model inference itself; the tool only fronts endpoints that already run locally; Proxying to cloud model providers or performing cloud billing and metering; Providing a graphical user interface or web dashboard; Fine-tuning, training, or evaluating models; Multi-user authentication, single sign-on, or team access control.
