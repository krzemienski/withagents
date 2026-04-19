# X thread — day-15-shannon-framework

**Tweet 1 (272 chars)**

14 rules in my CLAUDE.md.

the agent followed 11.

the other three (no test files, compile after editing, read the full file first) failed at rates that made them decorative.

47 test files created despite a clear prohibition.

writing rules is easy. getting an agent to follow them is not.

---

**Tweet 2 (244 chars)**

the agent UNDERSTANDS every rule.

it can explain why each one exists. it'll recite them back if you ask.

then 11 tool calls later, deep in a problem-solving loop, it creates auth.test.ts because that's what its training says a responsible dev does.

---

**Tweet 3 (232 chars)**

you cannot fix this by writing better instructions.

i tried for weeks. rephrased. bolded. moved the rule to the top of the file. the violation rate barely moved.

the problem is structural. a single-layer system cannot hold discipline across a long session.

---

**Tweet 4 (284 chars)**

Shannon's framework: reliable communication over a noisy channel needs redundant encoding.

LLM context windows ARE noisy channels.

same rule, seven different encodings:

1 constitution
2 rules dir
3 hooks
4 skills
5 agents
6 MCP tools
7 session start hooks

no single layer is enough.

---

**Tweet 5 (261 chars)**

the compliance curve:

• CLAUDE.md alone: 60%
• Hooks alone: 75%
• Skills alone: 80%
• All seven: 95%+

the remaining 5% is why you still review output.

the difference between 60% and 95% is an agent that creates work vs an agent that saves it.

---

**Tweet 6 (257 chars)**

5 hooks that survived production:

• block-test-files.js — 23% -> 0%
• read-before-edit.js — 31% -> 4%
• validation-not-compilation.js — 41% -> 9%
• evidence-gate-reminder.js — 34% quality lift
• skill-activation-check.js — 1,370 skill invocations

5 survivors out of 23 built.

---

**Tweet 7 (241 chars)**

meta-rule from the 18 dead hooks:

enforce safety invariants, not style preferences.

"don't commit API keys" = safety invariant, regex works
"functions under 50 lines" = style pref, too many legit exceptions

if the violation isn't detectable from tool input alone, it's not a hook

---

**Tweet 8 (273 chars)**

the hardest lesson:

governance must be AUTOMATIC and INHERITED.

subagents without constitution injection: 68% compliance.
subagents with automatic injection: 95%.

3,756 Task + Agent spawns in the dataset. 3,756 chances for governance to drop.

auto-inject. don't rely on memory.

---

**Tweet 9 (218 chars)**

overall result:

aggregate violation rate 3.1/session -> 0.4. 87% reduction.
hook overhead: 7ms/tool call. undetectable.
read-to-write ratio: 4:1 -> 9.6:1.

one hook changed the agent's entire approach to editing.

---

**Tweet 10 (204 chars)**

```bash
git clone https://github.com/krzemienski/shannon-framework
cp -r shannon-framework/hooks/ .claude/hooks/
```

start with three hooks. measure for a week. add more.

Shannon v5.6.0 ships on github.com/krzemienski/shannon-framework

---

**Tweet 11 (189 chars)**

full write-up on withagents.dev with the 7-layer diagram, the 5 surviving hooks, and the subagent inheritance fix:

withagents.dev/writing/day-15-shannon-framework

next: shannon-cli, same stack, no Claude Code session.
