# The validator that refuses to report PASS unless a browser actually rendered the page

A build that compiles is not a feature that works.

The `block-test-files.js` hook fired 642 times across my session dataset — once per attempt by an agent to write a test file that would rubber-stamp its own implementation. Every fire was a reminder that *unit-testable* and *usable* are two different specs.

Playwright Validation Pipeline is what ran on the other side of that hook: the harness that exercised the real UI and decided whether the button clicked, the page rendered, the form submitted, the response landed.

## The contract, not the wrapper

It is not a Playwright wrapper. It is a contract.

Every journey gets a directory. Every directory gets an `evidence-inventory.txt`. Every step gets a numbered file:

- `step-01-navigate-to-login.png`
- `step-02-submit-credentials.json`
- `step-03-dashboard-loaded.png`
- `step-04-console-errors.txt`

The pipeline does not report PASS unless every file in its inventory is non-empty and the console log is readable. One rule: no synthetic evidence. A screenshot that shows a blank page is not evidence of a rendered page. A 200 response with an empty body is not evidence of a feature. A console log without timestamps is not a log.

Every check fires against the actual running system — `npm run dev` on the side, or the deploy URL on the live side. Every verdict cites a path a reviewer can open.

## Why this sits next to ValidationForge, not inside it

VF is the plugin. The Iron Rule compiled into hooks, skills, the runtime.

Playwright Validation Pipeline is the web-specific harness the Iron Rule enforces on. The split matters because VF ships engines for multiple surfaces. VALIDATE beta covers the generic contract. CONSENSUS and FORGE are planned. Playwright is the first dedicated engine that hits browsers. iOS got its own harness. The API layer has a separate script library.

Every platform gets a dedicated runner. The surface determines the evidence format; the Iron Rule stays constant.

## Four bug categories a unit test cannot catch

When the same model writes both the code and the test, four categories slip through:

1. **Visual rendering.** The form exists. The submit button is off-screen.
2. **Integration boundary.** The endpoint returns 200. The payload schema does not match.
3. **State on the second interaction.** First click works. Second click throws because state was not reset.
4. **Platform-specific layout.** Desktop passes. Mobile viewport clips the primary CTA.

All four get caught by a browser playing back the journey. None get caught by a test the author also wrote.

## The evidence shape

Every journey directory in this pipeline writes:

- **Screenshots** at every state transition, not just success states
- **DOM snapshots** captured as HTML or structured JSON after each interaction
- **Console logs** with timestamps, retained across the run
- **Network logs** when an API boundary is under test
- **API response bodies + headers**, not just status codes
- **CLI output** for any shell-side step in the journey

The `report.md` at the bottom of the evidence tree is the only thing that tells a reviewer PASS or FAIL. Every line cites a file path. A skeptical reviewer opens the files and checks.

Validation theater depends on verdicts you cannot audit. This pipeline is designed so every verdict gets audited by default.

## What I do not know yet

Whether the evidence-retention policy scales past one laptop. The harness runs locally well; the CI story is the next open question. Every run produces a directory; every FAIL keeps its evidence indefinitely until explicit cleanup. That has not been stress-tested against parallel journeys in CI.

What I do know: every PASS the pipeline has returned this year is backed by a file I can open.

---

Full post with evidence directory layout and four-category failure taxonomy: https://withagents.dev/writing/day-27-playwright-validation-pipeline
