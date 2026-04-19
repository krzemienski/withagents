# X Thread — Post 7

**Tweet 1:** I had 14 rules in my CLAUDE.md. The agent followed 11 of them consistently.

The other three failed enough to be decorative.

47 test files created despite a clear prohibition. 112 edits to files the agent hadn't read. 63 premature "complete" declarations.

**Tweet 2:** The agent understands every rule. Can explain why each exists. Will recite them if asked.

Then 11 tool calls later, deep in a problem-solving loop, it creates `auth.test.ts` because that's what its training says a responsible developer does.

Writing better rules didn't help. I tried for weeks.

**Tweet 3:** The fix borrows from Claude Shannon: reliable communication requires redundant encoding.

Seven layers. Each one reinforces the same rule through a different mechanism.

CLAUDE.md → rules directory → hooks → skills → agents → MCP tools → session start hooks.

**Tweet 4:** Layer 3 is where rules become enforceable: hooks.

23 hooks built. 5 survived production.

The 18 failures shared one property: they required judgment. `function-length` needs to decide if 52 lines is too many. Subjective. Wrong enough to train the agent to ignore it.

**Tweet 5:** block-test-files.js: violation rate 23% → 0%.
read-before-edit.js: 31% → 4%.
validation-not-compilation.js: 41% → 9%.

Every survivor is a regex or simple conditional. Safety invariant, not style preference.

If you can't define it in a regex, it belongs in a skill, not a hook.

**Tweet 6:** Something strange happened with validation-not-compilation.js after hundreds of sessions.

The agent stopped acknowledging the reminder in its output but still changed its behavior. Learned compliance.

Behavioral shift persists even when the agent stops visibly responding. Not sure why.

**Tweet 7:** Single 800-line CLAUDE.md: 72% compliance on rules in the bottom half.
Same rules split across focused files: 89% compliance.

Position in a long file matters. Position in separate files doesn't. Each file starts at line 1.

The agent follows top-of-file rules more than bottom-of-file ones. Wild.

**Tweet 8:** Subagent inheritance: 68% compliance without constitution injection, 95% with it.

2,827 Task spawns and 929 Agent calls across 23,479 sessions = 3,756 opportunities for governance to drop.

A PreToolUse hook on the Agent tool auto-injects the constitution. No relying on memory.

**Tweet 9:** Combined results after the full stack:

Aggregate violation rate: 3.1 per session → 0.4.
87% reduction. 7ms hook overhead per tool call.

Read-to-Write ratio shifted from 4:1 to 9.6:1. The read-before-edit hook didn't just prevent blind edits — it changed how agents approach code modification.

**Tweet 10:** CLAUDE.md alone: 60% compliance. Hooks alone: 75%. Skills alone: 80%. All seven layers together: 95%+.

The remaining 5% is why you still review the output. The difference between 60% and 95% is the difference between an agent that creates work and an agent that saves it.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
