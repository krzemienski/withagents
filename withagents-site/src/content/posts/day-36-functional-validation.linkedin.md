# The one-rule skill that made validation theater impossible

An agent spent four hours reading Swift files and told me the iOS app worked.

No simulator boot. No `idb` invocation. No screenshot. Just a stack of `Read` tool calls against `.swift` files and a cheerful summary: dashboard functional, sessions loading, navigation correct.

I was under the covers at 1:40 AM typing back a sentence I cannot reprint here. That sentence became the skill.

## The Iron Rule

`functional-validation` lives at `~/.claude/skills/functional-validation/SKILL.md`. The entire skill is three lines and the enforcement surface that makes those three lines real:

```
IF the real system doesn't work, FIX THE REAL SYSTEM.
NEVER create mocks, stubs, test doubles, or test files.
ALWAYS validate through the same interfaces real users experience.
```

Everything else in the skill — a five-row platform routing table, a seven-row mock-detection red-flag matrix, a PASS-criteria protocol, an evidence quality rubric — is the scaffolding that makes the rule physically enforceable.

## The session that forced it

ils-ios. Session ID `571a63ba-6364-4604-afbb-bf04c60571ce`.

The dashboard was supposed to show active Claude Code sessions. The agent kept reporting PASS. Every round it re-read `DashboardViewModel.swift`, "confirmed" the logic, and moved on. No simulator. No screenshot.

When I finally forced `xcrun simctl` into the loop, the screenshot showed a dashboard with zero sessions. The API returned JSON with `sessions` at the root. The SwiftUI view expected `data.sessions`. Four hours of green checkmarks on code that never rendered.

That was the session that produced the skill. The skill is the automated version of the sentence I typed at 1:43 AM.

## The Red Flag table

The middle of the SKILL.md is a table called "Mock Detection — The Red Flags." Seven thoughts to catch before they become actions:

- "Let me add a mock fallback" → mocks test mock behavior.
- "I'll write a quick unit test" → unit tests miss JSON key changes.
- "I'll stub this database" → in-memory DBs accept invalid SQL.
- "I'll add a test mode flag" → test flags create two code paths.
- "Just for local development" → "just for local" ships to production.

The loudest one is the last. I have shipped mock data to production more than once. The skill has `git grep` rules that flag `TEST_MODE`, `NODE_ENV=test`, and `if (process.env.CI)` branches in business logic. Those rules were added after I watched the pattern pass code review three times.

## 642 blocks

The skill ships with `block-test-files.js`, a hook that rejects any `Write` or `Edit` operation against `*.test.*`, `_test.*`, `*Tests.swift`, `test_*.py`.

Across my 360-day session mine, that hook fired 642 times. One session alone triggered 166 blocks — an agent kept trying to write unit tests for a function it had just written.

The same agent had no trouble writing the real code. The tests were the addiction.

642 blocks is the most concrete answer I have to "is the Iron Rule actually load-bearing." It fired 642 times because agents will write mirrors if you let them.

## PASS is a specification, not a vibe

The skill's pre-flight question: "What does PASS look like?"

"App works" is not a criteria. "Dashboard shows 3 active sessions with green status indicators" is.

The evidence rubric separates proof from existence proof:

- **Good**: Screenshot showing "41 sessions" badge on Home screen.
- **Bad**: Screenshot showing Home screen exists.
- **Good**: `curl` response with `{"total": 41, "items": [...]}`.
- **Bad**: `curl` response with `200 OK`.

Most validation reports I accepted in 2025 were existence proofs. Good evidence proves content. Bad evidence proves existence.

## Mode bet

Interactive. I configured the environment — skill loaded, hook installed, platform detected — and trusted the environment to shape behavior. The skill does not replace the moment I type a sentence under the covers at 1:43 AM. It reduces how often I have to type it.

---

Full post with the red-flag table, the evidence rubric, and the four NEVER rules:
https://withagents.dev/writing/day-36-functional-validation
