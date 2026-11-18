# Phase 6 — Integration

**Tag:** `[OLMS: PHASE 6]`
**Goal:** Wire all modules together so serve, profile switching, health checks, and usage reporting work as one system with no cloud contact.
**Depends on:** Phase 5

## Prompt to AI

```
[OLMS: PHASE 6]
- Wire ConfigLoader, EndpointRegistry, ProfileRouter, UsageStore, and GatewayServer together in the serve command
- Implement status to print gateway state, active profile, endpoint health, and the last 24 hours of token totals from the local database
- Add an integration test that starts the gateway with two stub endpoints, switches profile, sends requests, and checks status output
- Test Requirement: The integration test runs the full flow with two stub endpoints and asserts status output names the active profile and both endpoints.
- Output the complete, functional file(s) listed under Deliverables.

Do not build anything assigned to a later phase, and do not cross the non-goals boundary in AGENTS.md. Stop and wait for confirmation.
```

## Deliverables

- internal/gateway/wiring.go (+ its test, per the phase's Test Requirement)
- cmd/switchboard/status.go (+ its test, per the phase's Test Requirement)
- test/integration_test.go (+ its test, per the phase's Test Requirement)

## Pass / Fail Criteria

| Result | Condition |
|---|---|
| **Pass** | The integration test passes with zero failures |
| **Pass** | status output lists the active profile, both endpoints, and 24-hour token totals |
| **Fail** | Faked or mocked the logic under test, or presented a placeholder as a working capability |
| **Fail** | status output omits the active profile or either endpoint |
| **Fail** | Any module is bypassed in the integration test path |

## Notes

Features delivered in this phase (from `PROJECT-SPEC.yaml`): Offline status and usage report — A status command reports gateway state, active profile, endpoint health, and the last 24 hours of token totals from the local database without contacting any remote service.. Cross-reference `ARCHITECTURE.md` for module boundaries and the package's reference document for contracts before writing code. Project non-goals that bind this phase: Hosting or running model inference itself; the tool only fronts endpoints that already run locally; Proxying to cloud model providers or performing cloud billing and metering; Providing a graphical user interface or web dashboard; Fine-tuning, training, or evaluating models; Multi-user authentication, single sign-on, or team access control.
