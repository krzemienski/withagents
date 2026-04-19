# X Thread — Post 3

**Tweet 1:** The agent said the feature was complete. Build passed. TypeScript: zero errors.

I merged the PR. Within minutes: "Login button doesn't do anything."

Structurally perfect. Functionally empty. That's when I banned unit tests for AI-generated code.

**Tweet 2:** The Delete Account button had the correct icon, correct dialog, correct loading spinner. The onClick called `deleteUserAccount()` with the right signature.

The function body:

```typescript
async function deleteUserAccount(userId: string) {
  // TODO: Implement
}
```

Every static check: green.

**Tweet 3:** When AI writes the code AND the tests, passing tests prove nothing.

Same assumptions on both sides of the mirror. The agent that writes `deleteUserAccount()` with a TODO body will write a test that mocks the deletion and asserts the function was called.

Mock passes. Feature broken.

**Tweet 4:** I built a PreToolUse hook that blocks every file Write matching test patterns. 13 regex patterns: `*.test.ts`, `*_test.py`, `mock_*`, the whole family.

Across 23,479 sessions, this hook fired 642 times. 642 blocked test files. Zero production regressions from shipping theater.

**Tweet 5:** One hook isn't enough. Three hooks form a closed loop:

1. block-test-files.js — can't create the mirror
2. validation-not-compilation.js — fires after builds, reminds that compile ≠ validate
3. completion-claim-validator.js — blocks "done" without evidence

Every escape route closed.

**Tweet 6:** Scale numbers from the real dataset:

2,620 iOS screen taps on real simulators
2,165 simulator screenshots as evidence
2,068 browser automation calls (Playwright + Puppeteer)
1,239 iOS accessibility tree queries

Every one a real interaction with a real running app.

**Tweet 7:** One SessionForge session ran 674 Playwright calls in a single validation pass.

262 clicks. 172 screenshots. 128 navigations. 64 accessibility snapshots.

It caught a stale `.next` cache bug that `next build` insisted didn't exist. Eleven build/restart cycles to fix.

**Tweet 8:** Three-layer validation stack:

Layer 1: Compilation. TypeScript strict, Swift compiler. Catches syntax.
Layer 2: Runtime. TCP connect + HTTP 200 + content marker. Catches "server responds but wrong app."
Layer 3: Functional. Navigate, click, screenshot. Catches everything else.

**Tweet 9:** Gap analysis across 12 projects: 14.7% of specified features were missing, incomplete, or implemented differently than the spec.

Continuous gap checks at phase gates dropped that to 2.1%.

Catching it while the agent's still working costs minutes. Catching it in QA costs days.

**Tweet 10:** After the three-layer stack + three-hook chain: 127 agent-generated PRs merged with zero "works on my machine" failures.

The cost is validation time per PR. The savings is zero post-merge incidents from features that compiled but didn't function.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
