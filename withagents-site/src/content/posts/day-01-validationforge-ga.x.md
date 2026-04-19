# X thread — Day 01 ValidationForge GA

---

**Tweet 1/10** (255 chars)

257 agent spawns in 10 days.
310 files.
16 A/B benchmark cells.
1 plugin.
1 rule.

ValidationForge ships today.

It exists because across my last 23,479 Claude Code sessions, one hook alone — block-test-files.js — fired 642 times.

Thread: 🧵

---

**Tweet 2/10** (278 chars)

Every fire caught an agent about to write a test-mirror.

Code that checks whether the agent's own function was called, not whether the feature works.

One session (ad5769ce) accounted for 166 of those fires by itself.

This is not a prompt bug. It is an incentive bug.

---

**Tweet 3/10** (246 chars)

The Iron Rule is in the PRD, where I can see it every time I open the repo:

IF the real system doesn't work, FIX THE REAL SYSTEM.
NEVER create mocks.
NEVER write unit tests.
NEVER use test frameworks.
Build the real thing. Run it. Capture evidence.

---

**Tweet 4/10** (271 chars)

Honest labels, because today is a validation launch:

VALIDATE engine — beta. Ships today.
CONSENSUS engine — planned. Scoped, not shipped.
FORGE engine — planned. Scoped, not shipped.

If you expected three engines under "GA," I would rather write this tweet than ship on a lie.

---

**Tweet 5/10** (263 chars)

What's actually in the box:

3 hooks (block-test-files, evidence-gate-reminder, completion-claim-validator)
4 skills (functional-validation, create-validation-plan, verdict-writer, preflight)
2 commands (/validate, /validate-sweep)
16 benchmark cells (WF, CI, BA, CLI, FS)

---

**Tweet 6/10** (279 chars)

The verdict-writer skill is the part I did not expect to matter.

Its only job: read every evidence file in a directory. Cite specific files for every PASS or FAIL. Refuse PASS if any evidence file is 0 bytes.

That single rule caught 14 would-be passing sessions during benchmarks.

---

**Tweet 7/10** (268 chars)

Control vs treatment finding I'll publish with the full benchmark data:

Treatment cells (VALIDATE loaded) produced 3.1x more evidence files on average than controls.

23% of control cells ended with an empty evidence-inventory.txt.

0% of treatment cells did.

Empty inventory was the bug.

---

**Tweet 8/10** (247 chars)

Mode-bet: Interactive.

VALIDATE wins by shaping the agent's environment, not by writing code that steers the agent (SDK) or running headless loops (Non-Interactive).

The failure I care about is semantic. The agent is not crashing. It is confidently wrong.

---

**Tweet 9/10** (234 chars)

What this does not solve:

If another team adopts VALIDATE they'll need to capture their own voice commands.

The rescue primitive has to come from your mouth, not mine.

A hook can catch a bad pattern. It cannot invent the correction for a team it has never met.

---

**Tweet 10/10** (241 chars)

Install: claude plugin install validationforge

Run: /validate-sweep

Repo + PRD + roadmap: github.com/krzemienski/validationforge

Full post with engineering spec + benchmark detail: withagents.dev/writing/day-01-validationforge-ga

Real system or nothing.
