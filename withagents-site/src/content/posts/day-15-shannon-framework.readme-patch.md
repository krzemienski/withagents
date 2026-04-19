# README patch — shannon-framework

Add to top of `README.md` after the project description, before the installation section.

---

## Featured in

**[Shannon framework: 14 rules the agent knew, three it would not follow](https://withagents.dev/writing/day-15-shannon-framework)** (WithAgents, Day 15)

I had 14 rules in my CLAUDE.md. The agent followed 11. The other three failed at rates that made them decorative.

The write-up covers:

- Why single-layer governance breaks down in long sessions (the instruction does not disappear; it loses salience)
- The seven-layer stack: constitution → rules → hooks → skills → agents → MCP → session-start hooks
- The five hooks that survived production, and the eighteen that did not
- Subagent inheritance: 68% compliance without auto-injection, 95% with it
- Aggregate violation rate: 3.1/session → 0.4 (87% reduction)

The Shannon principle: reliable communication over a noisy channel requires redundant encoding. An LLM context window is a noisy channel.

This repo at version 5.6.0 is the working implementation — every hook, skill, and agent referenced in the post.

```bash
git clone https://github.com/krzemienski/shannon-framework
cp -r shannon-framework/hooks/ .claude/hooks/
```

Start with `block-test-files.js`, `read-before-edit.js`, and `validation-not-compilation.js`. Measure for a week before adding more.
