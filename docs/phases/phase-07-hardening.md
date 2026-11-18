# Phase 7 — Hardening

**Tag:** `[OLMS: PHASE 7]`
**Goal:** Handle failure paths, invalid input, and endpoint outages without crashing or losing usage records.
**Depends on:** Phase 6

## Prompt to AI

```
[OLMS: PHASE 7]
- Return HTTP 502 when the selected endpoint is unreachable and HTTP 503 when no healthy endpoint exists for the active profile
- Reject requests with a missing model field or malformed JSON with HTTP 400 and write no usage row for rejected requests
- Cap request bodies at 10 MB and cap the gateway at 100 concurrent requests, returning HTTP 429 above that limit
- Test Requirement: Hardening tests send an unreachable endpoint request, a malformed request, and an oversized request and assert the expected status codes.
- Output the complete, functional file(s) listed under Deliverables.

Do not build anything assigned to a later phase, and do not cross the non-goals boundary in AGENTS.md. Stop and wait for confirmation.
```

## Deliverables

- internal/gateway/limits.go (+ its test, per the phase's Test Requirement)
- internal/gateway/errors.go (+ its test, per the phase's Test Requirement)
- test/hardening_test.go (+ its test, per the phase's Test Requirement)

## Pass / Fail Criteria

| Result | Condition |
|---|---|
| **Pass** | Unreachable endpoint returns 502, malformed JSON returns 400, and a body over 10 MB returns 413 |
| **Pass** | The gateway stays running after all three failure cases |
| **Fail** | Faked or mocked the logic under test, or presented a placeholder as a working capability |
| **Fail** | Any failure case crashes the gateway process |
| **Fail** | A rejected request writes a usage row |

## Notes

This phase delivers infrastructure or hardening that the feature phases depend on; it adds no user-facing feature of its own. Cross-reference `ARCHITECTURE.md` for module boundaries and the package's reference document for contracts before writing code. Project non-goals that bind this phase: Hosting or running model inference itself; the tool only fronts endpoints that already run locally; Proxying to cloud model providers or performing cloud billing and metering; Providing a graphical user interface or web dashboard; Fine-tuning, training, or evaluating models; Multi-user authentication, single sign-on, or team access control.
