# Phase 4 — Routing profiles

**Tag:** `[OLMS: PHASE 4]`
**Goal:** Deliver named routing profiles and profile switching without restarting the gateway or changing client configuration.
**Depends on:** Phase 3

## Prompt to AI

```
[OLMS: PHASE 4]
- Define profiles in the config file mapping request kinds to endpoint names, with at least a drafting profile and a review profile
- Implement ProfileRouter so profile use switches the active profile and the next request uses the new profile within 1 second
- Persist the active profile name to the config file so a gateway restart keeps the last active profile
- Test Requirement: A test switches the active profile from drafting to review and asserts the next gateway request is forwarded to the review endpoint.
- Output the complete, functional file(s) listed under Deliverables.

Do not build anything assigned to a later phase, and do not cross the non-goals boundary in AGENTS.md. Stop and wait for confirmation.
```

## Deliverables

- internal/router/router.go (+ its test, per the phase's Test Requirement)
- internal/router/router_test.go (+ its test, per the phase's Test Requirement)
- cmd/switchboard/profile.go (+ its test, per the phase's Test Requirement)

## Pass / Fail Criteria

| Result | Condition |
|---|---|
| **Pass** | After profile use review, the next request reaches the review endpoint within 1 second |
| **Pass** | The active profile survives a gateway restart |
| **Fail** | Faked or mocked the logic under test, or presented a placeholder as a working capability |
| **Fail** | A request after a profile switch still reaches the previous endpoint |
| **Fail** | The active profile reverts to the default after a restart |

## Notes

Features delivered in this phase (from `PROJECT-SPEC.yaml`): Lane: offline local AI — The CLI runs the gateway entirely self-hosted and keeps routing and usage tracking local, so local tools keep working and stay auditable when offline.; Routing profiles for drafting and review — Named routing profiles map request kinds to endpoints, for example a small local model for drafting and a larger local model for review, and switching the active profile with one command takes effect within 1 second without editing any client configuration.. Cross-reference `ARCHITECTURE.md` for module boundaries and the package's reference document for contracts before writing code. Project non-goals that bind this phase: Hosting or running model inference itself; the tool only fronts endpoints that already run locally; Proxying to cloud model providers or performing cloud billing and metering; Providing a graphical user interface or web dashboard; Fine-tuning, training, or evaluating models; Multi-user authentication, single sign-on, or team access control.
