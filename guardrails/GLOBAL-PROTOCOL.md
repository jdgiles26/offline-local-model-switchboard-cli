# GLOBAL-PROTOCOL.md — Offline Local Model Switchboard CLI

Every rule in `AGENTS.md`, expanded with the reason it exists for this project and how it is enforced. These guardrails apply to all eight phases without exception.

## Zero-Mock Mandate

**Rule:** Never present simulated, stubbed, or placeholder logic as a working capability. Mocking inputs and external boundaries in tests is allowed; mocking the logic under test is a phase failure.

**Why:** A mocked core capability presented as working is the most expensive failure in an agentic build. The faked version passes shallow review and the gap surfaces only when a later phase builds on it.

**Enforcement:** The phase reviewer checks this rule against the phase's delivered files and test output before signing the Pass / Fail table. A violation fails the phase regardless of other criteria, and the phase is redone, not patched over.

## TDD First

**Rule:** A failing test precedes every implementation. Tests are never weakened, skipped, or deleted to make a phase pass.

**Why:** Without a failing test written first, the agent grades its own homework and every later phase inherits unverified behavior.

**Enforcement:** The phase reviewer checks this rule against the phase's delivered files and test output before signing the Pass / Fail table. A violation fails the phase regardless of other criteria, and the phase is redone, not patched over.

## No hallucinated APIs or packages

**Rule:** Use only the libraries named in PROJECT-SPEC.yaml and ARCHITECTURE.md. If a needed API or package is not listed there, stop and ask instead of inventing it.

**Why:** An invented library or method compiles the same as one that exists in the agent's head; it only fails when a human runs the code.

**Enforcement:** The phase reviewer checks this rule against the phase's delivered files and test output before signing the Pass / Fail table. A violation fails the phase regardless of other criteria, and the phase is redone, not patched over.

## Sequential locking

**Rule:** Build one phase at a time, in order. Stop and wait for human confirmation after every phase; never start phase N+1 on your own.

**Why:** Phases consume earlier phases' interfaces. Building ahead on an unverified interface multiplies the rework when that interface changes.

**Enforcement:** The phase reviewer checks this rule against the phase's delivered files and test output before signing the Pass / Fail table. A violation fails the phase regardless of other criteria, and the phase is redone, not patched over.

## Complete files, no TODOs on critical logic

**Rule:** Every file you output is complete and functional. No TODO, TBD, or placeholder text on any logic a test covers.

**Why:** A TODO on critical logic is a silent non-goal: the file looks complete, the phase looks done, and the missing behavior is discovered by a user.

**Enforcement:** The phase reviewer checks this rule against the phase's delivered files and test output before signing the Pass / Fail table. A violation fails the phase regardless of other criteria, and the phase is redone, not patched over.

## Conflict resolution

**Rule:** On ambiguity, conflicting requirements, or any decision with security, privacy, or compliance weight, stop and ask. Never resolve it by assumption.

**Why:** Two plausible readings of the spec lead to two different products. Guessing picks one at random and hides the decision from the human who owns it.

**Enforcement:** The phase reviewer checks this rule against the phase's delivered files and test output before signing the Pass / Fail table. A violation fails the phase regardless of other criteria, and the phase is redone, not patched over.

## Scope boundary

**Rule:** Never build anything in the non-goals list, restated verbatim from PROJECT-SPEC.yaml: "Hosting or running model inference itself; the tool only fronts endpoints that already run locally"; "Proxying to cloud model providers or performing cloud billing and metering"; "Providing a graphical user interface or web dashboard"; "Fine-tuning, training, or evaluating models"; "Multi-user authentication, single sign-on, or team access control". If a request appears to push past this boundary, stop and ask.

**Why:** Scope decided implicitly during a phase is scope the human never approved; it arrives unreviewed and usually untested.

**Enforcement:** The phase reviewer checks this rule against the phase's delivered files and test output before signing the Pass / Fail table. A violation fails the phase regardless of other criteria, and the phase is redone, not patched over.
