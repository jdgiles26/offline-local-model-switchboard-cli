# Phase 2 — Minimal end-to-end vertical slice

**Tag:** `[OLMS: PHASE 2]`
**Goal:** Serve one OpenAI-compatible chat completion request through the gateway to one hardcoded local endpoint.
**Depends on:** Phase 1

## Prompt to AI

```
[OLMS: PHASE 2]
- Implement GatewayServer with a POST /v1/chat/completions handler that forwards the request body to one local endpoint URL from config
- Return the endpoint response status and body unchanged to the client, including streaming responses
- Implement serve so it listens on the configured address and shuts down cleanly on SIGINT within 5 seconds
- Test Requirement: An end-to-end test starts the gateway against a local stub endpoint and asserts the client receives the stub response body unchanged.
- Output the complete, functional file(s) listed under Deliverables.

Do not build anything assigned to a later phase, and do not cross the non-goals boundary in AGENTS.md. Stop and wait for confirmation.
```

## Deliverables

- internal/gateway/server.go (+ its test, per the phase's Test Requirement)
- internal/gateway/server_test.go (+ its test, per the phase's Test Requirement)
- cmd/switchboard/serve.go (+ its test, per the phase's Test Requirement)

## Pass / Fail Criteria

| Result | Condition |
|---|---|
| **Pass** | The end-to-end test passes and the gateway returns the stub response with the same HTTP status code |
| **Pass** | serve stops within 5 seconds of SIGINT |
| **Fail** | Faked or mocked the logic under test, or presented a placeholder as a working capability |
| **Fail** | The gateway alters the response body or status code |
| **Fail** | serve does not stop within 5 seconds of SIGINT |

## Notes

Features delivered in this phase (from `PROJECT-SPEC.yaml`): Single OpenAI-compatible gateway address — The CLI starts one HTTP gateway on a fixed local address that accepts OpenAI-compatible chat completion requests and forwards them to a registered local endpoint, so IDEs and scripts point at one address regardless of which local model serves the request.. Cross-reference `ARCHITECTURE.md` for module boundaries and the package's reference document for contracts before writing code. Project non-goals that bind this phase: Hosting or running model inference itself; the tool only fronts endpoints that already run locally; Proxying to cloud model providers or performing cloud billing and metering; Providing a graphical user interface or web dashboard; Fine-tuning, training, or evaluating models; Multi-user authentication, single sign-on, or team access control.
