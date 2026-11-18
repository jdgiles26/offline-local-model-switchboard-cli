# Phase 8 — Release verification and packaging

**Tag:** `[OLMS: PHASE 8]`
**Goal:** Verify the release binary on Linux, macOS, and Windows, package it, and confirm the CLI reference matches the shipped commands.
**Depends on:** Phase 7

## Prompt to AI

```
[OLMS: PHASE 8]
- Build static binaries for linux/amd64, darwin/arm64, and windows/amd64 with goreleaser and record their SHA-256 checksums
- Run the full test suite and the integration test against the linux/amd64 release binary
- Verify every command, flag, and exit code in CLI-REFERENCE against the release binary help output and behavior
- Test Requirement: A release check script builds all three binaries, runs the full test suite, and asserts every CLI-REFERENCE command appears in the binary help output.
- Output the complete, functional file(s) listed under Deliverables.

Do not build anything assigned to a later phase, and do not cross the non-goals boundary in AGENTS.md. Stop and wait for confirmation.
```

## Deliverables

- CLI-REFERENCE (+ its test, per the phase's Test Requirement)
- README.md (+ its test, per the phase's Test Requirement)
- scripts/release-check.sh (+ its test, per the phase's Test Requirement)
- goreleaser.yaml (+ its test, per the phase's Test Requirement)

## Pass / Fail Criteria

| Result | Condition |
|---|---|
| **Pass** | All three binaries build and the full test suite passes against the linux/amd64 binary |
| **Pass** | Every command and flag in CLI-REFERENCE matches the release binary |
| **Fail** | Faked or mocked the logic under test, or presented a placeholder as a working capability |
| **Fail** | Any target binary fails to build |
| **Fail** | Any CLI-REFERENCE command or flag is missing from the release binary |

## Notes

This phase delivers infrastructure or hardening that the feature phases depend on; it adds no user-facing feature of its own. Cross-reference `ARCHITECTURE.md` for module boundaries and the package's reference document for contracts before writing code. Project non-goals that bind this phase: Hosting or running model inference itself; the tool only fronts endpoints that already run locally; Proxying to cloud model providers or performing cloud billing and metering; Providing a graphical user interface or web dashboard; Fine-tuning, training, or evaluating models; Multi-user authentication, single sign-on, or team access control.
