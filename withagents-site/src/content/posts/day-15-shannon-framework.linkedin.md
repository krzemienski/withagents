# Shannon framework: 14 rules the agent knew, three it would not follow

I had 14 rules in my CLAUDE.md.

The agent followed 11 consistently.

The other three ("never create test files," "always compile after editing," "read the full file before modifying it") failed at rates that made them decorative.

47 test files created despite a clear prohibition. 112 edits to files the agent had not read. 63 premature "complete" declarations.

The agent *understands* every rule. It can explain why each one exists. Then 11 tool calls later, deep in a problem-solving loop, it creates `auth.test.ts` because that is what its training says a responsible developer does.

---

**The gap between understanding and compliance**

You cannot fix this by writing better instructions. I tried for weeks. Rephrasing, adding emphasis, bolding text, moving the instruction to different positions in the file. The violation rate barely moved.

The problem is structural: a single-layer system cannot maintain discipline across a long session.

By tool call 40, your six-line rule is competing with 30,000-plus tokens of accumulated context. The instruction does not disappear. It loses salience.

---

**The Shannon principle**

The framework is named after Claude Shannon for a reason. Shannon proved that reliable communication over a noisy channel requires redundant encoding.

An LLM context window is a noisy channel. Same rule needs to be encoded seven different ways:

1. Global constitution (`~/.claude/CLAUDE.md`)
2. Rules directory (focused 50-line files)
3. Hooks (PreToolUse blocks, PostToolUse reminders)
4. Skills (structured workflows with gates)
5. Agents (specialized roles with scoped instructions)
6. MCP tools (constraints via interface design)
7. Session start hooks (load governance before noise accumulates)

No single layer is sufficient. CLAUDE.md alone: 60% compliance. Hooks alone: 75%. Skills alone: 80%. All seven together: 95%-plus.

---

**Five hooks that survived production**

I built 23 hooks. Five survived.

- `block-test-files.js`: 23% to 0% violation rate
- `read-before-edit.js`: 31% to 4%
- `validation-not-compilation.js`: 41% to 9%
- `evidence-gate-reminder.js`: 34% quality improvement
- `skill-activation-check.js`: 1,370 skill invocations across the sessions

The 18 dead hooks taught the meta-rule: enforce safety invariants, not style preferences. If the violation cannot be detected from the tool input alone, it does not belong in a hook.

---

**Subagent inheritance**

The single most important lesson from the stack:

Governance must be automatic and inherited.

Subagents without constitution injection: 68% compliance.
Subagents with automatic injection: 95%.

A 27-point drop because the main agent forgot to pass the rules along.

Across 23,479 sessions: 3,756 Task + Agent spawns. 3,756 opportunities for governance to drop. The fix is a PreToolUse hook that injects core rules automatically, every time.

---

**The outcome**

Aggregate violation rate across the measured sessions dropped from 3.1 per session to 0.4. An 87% reduction. Hook overhead: 7ms per tool call, undetectable in practice.

The read-to-write ratio climbed from 4:1 to 9.6:1. A single hook changed the agent's entire approach to code modification. More reading means more context means fewer bugs.

---

**Ship it**

Shannon framework v5.6.0 at github.com/krzemienski/shannon-framework.

```bash
git clone https://github.com/krzemienski/shannon-framework
cp -r shannon-framework/hooks/  .claude/hooks/
cp -r shannon-framework/skills/ .claude/skills/
```

Start with three hooks. Measure for a week before adding more.

Shannon is not a document. It is a system. Treat it like one.

---

Full write-up on withagents.dev: https://withagents.dev/writing/day-15-shannon-framework
