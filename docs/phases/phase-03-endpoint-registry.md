# Phase 3 — Endpoint registry and health checks

**Tag:** `[OLMS: PHASE 3]`
**Goal:** Register, list, remove, and health-check local endpoints, and refuse to route to unhealthy endpoints.
**Depends on:** Phase 2

## Prompt to AI

```
[OLMS: PHASE 3]
- Store endpoints by name with base URL and model identifier in the config file and load them through ConfigLoader
- Probe each endpoint every 30 seconds with a GET request to its base URL and record healthy or unhealthy with the probe timestamp
- Make endpoint add, endpoint list, and endpoint remove operate on the stored endpoints and print health state in list output
- Test Requirement: Tests register two endpoints, mark one unhealthy by pointing it at a closed port, and assert list output shows one healthy and one unhealthy endpoint.
- Output the complete, functional file(s) listed under Deliverables.

Do not build anything assigned to a later phase, and do not cross the non-goals boundary in AGENTS.md. Stop and wait for confirmation.
```

## Deliverables

- internal/registry/registry.go (+ its test, per the phase's Test Requirement)
- internal/registry/health.go (+ its test, per the phase's Test Requirement)
- cmd/switchboard/endpoint.go (+ its test, per the phase's Test Requirement)

## Pass / Fail Criteria

| Result | Condition |
|---|---|
| **Pass** | endpoint list shows the correct health state for both endpoints |
| **Pass** | Routing to the unhealthy endpoint is refused with HTTP 503 |
| **Fail** | Faked or mocked the logic under test, or presented a placeholder as a working capability |
| **Fail** | An unhealthy endpoint is still selected for routing |
| **Fail** | endpoint list shows a stale health state older than 60 seconds |

## Notes

Features delivered in this phase (from `PROJECT-SPEC.yaml`): Local endpoint registration and health checks — Operators register local model endpoints by name, base URL, and model identifier, and the CLI probes each endpoint every 30 seconds, marking it healthy or unhealthy and refusing to route to unhealthy endpoints.. Cross-reference `ARCHITECTURE.md` for module boundaries and the package's reference document for contracts before writing code. Project non-goals that bind this phase: Hosting or running model inference itself; the tool only fronts endpoints that already run locally; Proxying to cloud model providers or performing cloud billing and metering; Providing a graphical user interface or web dashboard; Fine-tuning, training, or evaluating models; Multi-user authentication, single sign-on, or team access control.
