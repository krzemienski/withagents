# X Thread — Day 27 — Playwright Validation Pipeline

Format: 10 tweets. All under 280 chars.

---

**1/10** (191 chars)
A build that compiles is not a feature that works.

block-test-files.js fired 642 times in my session dataset. 642 attempts by agents to write tests that would rubber-stamp their own code.

Every fire was a reminder.

**2/10** (241 chars)
Unit-testable and usable are two different specs.

Playwright Validation Pipeline is what ran on the other side of that hook. The harness that exercised the real UI and decided whether the button clicked, the page rendered, the form submitted.

**3/10** (248 chars)
It is not a Playwright wrapper. It is a contract.

Every journey gets a directory.
Every directory gets an evidence-inventory.txt.
Every step gets a numbered file.

No PASS unless every file in the inventory is non-empty and the console log is readable.

**4/10** (199 chars)
Example inventory for one journey:

step-01-navigate-to-login.png
step-02-submit-credentials.json
step-03-dashboard-loaded.png
step-04-console-errors.txt

Every verdict cites a path a reviewer can open.

**5/10** (234 chars)
Four bug categories a unit test cannot catch when the same model writes both code and test:

1. Visual rendering (button off-screen)
2. Integration boundary (200 with wrong schema)
3. State on second interaction
4. Platform-specific layout clip

**6/10** (183 chars)
All four get caught by a browser playing back the journey.

None get caught by a test the author also wrote.

That is the entire argument for this harness sitting next to the unit tests.

**7/10** (213 chars)
Why it lives next to ValidationForge, not inside it:

VF is the plugin. Iron Rule compiled into hooks and skills.

Playwright Validation Pipeline is the web-specific engine the rule runs on. iOS has its own. API has its own.

**8/10** (245 chars)
Every platform gets a dedicated runner. The surface determines the evidence format; the Iron Rule stays constant.

A screenshot that shows a blank page is not evidence of a rendered page. A 200 with an empty body is not evidence of a feature.

**9/10** (228 chars)
Every evidence directory writes:

- Screenshots at every state transition
- DOM snapshots after each interaction
- Console logs with timestamps
- Network logs at API boundaries
- Response bodies + headers, not just status codes

**10/10** (186 chars)
Every PASS the pipeline has returned this year is backed by a file I can open.

That is the spec. That is what the repo ships.

https://withagents.dev/writing/day-27-playwright-validation-pipeline
