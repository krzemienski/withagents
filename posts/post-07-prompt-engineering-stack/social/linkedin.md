# LinkedIn — Post 7

I had 14 rules in my CLAUDE.md. The agent followed 11 consistently. The other three ("never create test files," "always compile after editing," "read the full file before modifying it") failed at rates that made them decorative. 47 test files created despite a clear prohibition. 112 edits to files the agent hadn't read. 63 premature "complete" declarations where the agent claimed a task was done without building the code.

The agent understands every rule. Can explain why each exists. Then 11 tool calls later, deep in a problem-solving loop, it creates `auth.test.ts` because that's what its training says a responsible developer does.

**Why Better Rules Don't Fix This**

I spent weeks rewriting CLAUDE.md. Rephrased instructions, added emphasis, bolded text, moved rules to different positions. The violation rate barely moved. A single-layer system can't maintain discipline across a long session.

The fix borrows from Claude Shannon: reliable communication over a noisy channel requires redundant encoding. Say the same thing seven different ways through seven different mechanisms, and the message gets through.

Seven layers: CLAUDE.md constitution, rules directory, hooks, skills, agents, MCP tools, session start hooks. Each one reinforces the same rules through a different mechanism.

**Hooks Are Where Rules Become Enforceable**

I built 23 hooks. Five survived production. The 18 failures taught me more than the five successes.

Every survivor is a regex or simple conditional. `block-test-files.js` drove violation rate from 23% to 0%. `read-before-edit.js`: 31% to 4%. `validation-not-compilation.js`: 41% to 9%.

Every dead hook required judgment. `function-length` needed to decide if 52 lines was too many. Subjective. The agent spent tokens reorganizing imports, and the reorganized imports were sometimes wrong. Net negative.

The meta-rule: hooks should enforce safety invariants, not style preferences. If you can't define the violation in a regex, it belongs in a skill, not a hook.

**Position Matters in a Long File. Not in Separate Files.**

A single 800-line CLAUDE.md produced 72% compliance on rules in the bottom half. The same rules split into focused files: 89% compliance. The agent follows top-of-file rules more than bottom-of-file ones. Position in a separate file doesn't matter because each file starts at line 1.

Subagent inheritance is the gap that breaks everything. 68% compliance for subagents without constitution injection. 95% with it. 2,827 Task spawns and 929 Agent calls across 23,479 sessions is 3,756 opportunities for governance to drop. A PreToolUse hook on the Agent tool auto-injects the constitution. No relying on memory.

Something strange happened with `validation-not-compilation.js` after hundreds of sessions. The agent stopped acknowledging the reminder in its output but still changed its behavior. Learned compliance. The behavioral shift persists even when the agent stops visibly responding. I'm still not sure why that happens.

Combined results after deploying all seven layers: violation rate dropped from 3.1 per session to 0.4. 87% reduction. 7ms hook overhead per tool call. CLAUDE.md alone gets you to 60% compliance. All seven layers together: 95%+. That's the difference between an agent that creates work and one that saves it.

Full post + code in the comments.
