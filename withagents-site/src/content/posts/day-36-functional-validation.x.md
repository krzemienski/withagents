# X thread — Day 36 / functional-validation

Thread target: 10 tweets. All under 280 chars.

---

**Tweet 1** (220)
An agent spent four hours reading Swift files and told me the iOS app worked.

No simulator boot. No idb call. No screenshot.

I was under the covers at 1:43 AM typing back a sentence I can't reprint.

That sentence became a skill.

---

**Tweet 2** (198)
The whole skill is three lines:

IF the real system doesn't work, FIX THE REAL SYSTEM.
NEVER create mocks, stubs, test doubles, or test files.
ALWAYS validate through the interfaces real users experience.

Lives at ~/.claude/skills/functional-validation/SKILL.md

---

**Tweet 3** (263)
Platform routing table in the SKILL.md picks a reference based on repo signals:

.xcodeproj → iOS: xcrun simctl + screenshots
Cargo.toml → CLI: binary + exit codes
OpenAPI → API: curl + response body
React/Vue → Web: Playwright + screenshots

Loads one ref. Rejects the rest.

---

**Tweet 4** (230)
ils-ios session 571a63ba.

Agent kept reporting PASS on the iOS dashboard. Re-read the ViewModel file five times. Never booted a sim.

When I forced xcrun simctl into the loop: dashboard showed zero sessions.

API returned { sessions: [] }. View expected { data: { sessions }}.

---

**Tweet 5** (267)
Four hours of green checkmarks on code that never rendered a pixel.

The skill is the automated version of what I should have typed in hour one:

"you are reading files, not running the product."

Every rule in the skill is scar tissue from a session where I accepted an existence proof.

---

**Tweet 6** (270)
The Red Flag table catches 7 thoughts before they become code:

"mock fallback for testing" → no
"quick unit test to verify" → no
"stub this database" → no
"test mode flag" → no
"just for local development" → no

Each bullet has a session behind it. Each session had a price.

---

**Tweet 7** (262)
block-test-files.js is the companion hook.

It rejects Write/Edit on *.test.*, _test.*, *Tests.swift, test_*.py.

Across my 360-day session mine: the hook fired 642 times.

One session alone triggered 166 blocks.

Agents will write mirrors if you let them.

---

**Tweet 8** (250)
The evidence rubric is the core of the skill:

GOOD: screenshot of "41 sessions" badge
BAD: screenshot that "Home screen exists"

GOOD: curl response body with specific keys
BAD: curl response with 200 OK

Good evidence proves content. Bad evidence proves existence.

---

**Tweet 9** (205)
What the skill can't do:

- Catch mocks laundered through non-mock file names
- Start your real dependencies
- Make you read the screenshot after you capture it

The skill gives you the artifact. Reading it is your job.

---

**Tweet 10** (199)
Mode bet: Interactive.

Skill loaded, hook installed, platform detected. I configured the environment; the environment shapes behavior.

The skill doesn't replace the 1:43 AM sentence. It reduces how often I type it.

withagents.dev/writing/day-36-functional-validation

---

Char counts: 220 / 198 / 263 / 230 / 267 / 270 / 262 / 250 / 205 / 199. All under 280.
