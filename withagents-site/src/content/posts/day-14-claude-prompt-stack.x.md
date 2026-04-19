# X thread: Day 14 Claude Prompt Stack

**1/ (272 chars)**
I had 14 rules in my CLAUDE.md. The agent followed 11.

The other 3 failed at rates that made them decorative:

47 test files created despite a clear prohibition.
112 edits to files the agent hadn't read.
63 premature "complete" declarations.

Writing rules is easy. 🧵

**2/ (264 chars)**
The agent *understands* every rule.

It can recite them back.

Then 11 tool calls later, deep in a loop, it creates auth.test.ts because that's what its training says a responsible developer does.

Getting compliance under pressure is a completely different problem.

**3/ (268 chars)**
The solution borrows from Claude Shannon's information theory:

Reliable communication over noisy channels requires redundant encoding.

Say the same thing 7 different ways, through 7 different mechanisms, and the message gets through.

One clone stands it up:
github.com/krzemienski/claude-prompt-stack

**4/ (275 chars)**
The 7 layers:

1. Global CLAUDE.md
2. Project CLAUDE.md
3. .claude/rules/*.md (focused files)
4. Hooks (code per tool call)
5. Skills (validation workflows)
6. MCP tools (external constraints)
7. Session-start hooks (context from turn 1)

Each layer reinforces through a different mechanism.

**5/ (243 chars)**
I built 23 hooks. 5 survived production.

The 18 that died taught me more than the 5 that lived.

The survivors all share two properties:

• Objective detection (regex on tool inputs works)
• Low false-positive rate after calibration

**6/ (253 chars)**
block-test-files.js, violation rate 23% → 0%

Pattern-matches filenames against test patterns, blocks on Write/Edit.

v1 blocked testimonials.tsx too. Oops.
v2 added exceptions (playwright, e2e).
v3 added content-pattern detection.

A test suite wearing a trench coat.

**7/ (271 chars)**
read-before-edit.js, 31% → 4%

Tracks which files were read this session. Warns when agent tries to edit an unread file.

Warn-not-block matters: agents legitimately create new files from scratch. Blocking breaks that workflow.

Result: read-to-write ratio went from 4:1 to 9.6:1.

**8/ (264 chars)**
validation-not-compilation.js, 41% → 9%

Agent runs `pnpm build`, sees "Build succeeded," declares feature complete.

Hook detects build-success patterns, injects reminder.

Something weird: after hundreds of sessions, agent stopped acknowledging the reminder but still changed behavior.

**9/ (251 chars)**
The meta-rule:

Hooks should enforce SAFETY INVARIANTS, not STYLE PREFERENCES.

"Don't commit API keys" → hook it.
"Functions should be under 50 lines" → don't.

Style hooks fire on 40% of writes, agent spends tokens fighting them, net negative value.

**10/ (273 chars)**
Subagent inheritance is where governance dies.

Main agent follows constitution. Spawns subagent via Task. Subagent starts with zero governance context.

Measured: 68% compliance without injection vs 95% with it.

27-point drop just because the rules didn't get passed along.

**11/ (236 chars)**
Fix: PreToolUse hook on Agent tool automatically injects core rules into every subagent prompt.

Main agent can't forget, the hook does it.

3,756 subagent spawns across the series dataset. Automatic injection eliminates the failure mode.

**12/ (262 chars)**
Aggregate numbers across 23,479 sessions:

• Violation rate: 3.1/session → 0.4 (87% drop)
• Hook overhead: 7ms per tool call
• CLAUDE.md alone: 60% compliance
• Hooks alone: 75%
• Skills alone: 80%
• All 7 together: 95%+

Difference between creating work and saving it.

**13/ (220 chars)**
Full post: https://withagents.dev/writing/day-14-claude-prompt-stack

Repo: github.com/krzemienski/claude-prompt-stack

Tomorrow: Shannon Framework, the 4-layer enforcement plugin that productized this pattern.

Part of WithAgents /45.

---

_13 tweets. 220-275 chars. Day 14 of WithAgents 45-day push._
