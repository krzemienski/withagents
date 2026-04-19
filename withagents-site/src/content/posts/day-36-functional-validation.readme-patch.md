# README patch — claude-code-skills-factory

Paste target: `claude-code-skills-factory/README.md`, "Featured in" section (append if exists, create if absent).

---

### Featured in

**[Day 36 — The one-rule skill that made validation theater impossible](https://withagents.dev/writing/day-36-functional-validation)** (2026-05-24)

A walkthrough of `functional-validation`, the canonical Iron Rule skill this factory ships. The post documents the ils-ios session (`571a63ba-6364-4604-afbb-bf04c60571ce.jsonl`) that forced the skill into existence — four hours of agent reports claiming a working iOS dashboard without a single simulator boot or screenshot. When the first `xcrun simctl` capture ran, the dashboard was showing zero sessions because the API returned `{ sessions: [] }` and the SwiftUI view expected `{ data: { sessions }}`.

The post covers:
- The 3-line Iron Rule at the top of `~/.claude/skills/functional-validation/SKILL.md`.
- The platform routing table (iOS / CLI / API / Web / Full-Stack) with explicit "do not load the other references" instruction.
- The Mock Detection Red Flag table (7 thoughts to catch before they become actions).
- The PASS/FAIL evidence quality rubric ("41 sessions badge" vs "Home screen exists").
- The `block-test-files.js` hook and its 642 fires across the 360-day session mine.

If you are building a validation skill that needs to be physically enforceable rather than aspirationally documented, this is the reference implementation in this factory.
