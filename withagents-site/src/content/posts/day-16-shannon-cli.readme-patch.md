# README patch — shannon-cli

Add to top of `README.md` after the project description, before the installation section.

---

## Featured in

**[Shannon-CLI: the same stack, no Claude Code session](https://withagents.dev/writing/day-16-shannon-cli)** (WithAgents, Day 16)

The Shannon framework ran inside Claude Code. Hooks fired on every tool call. Then the job became "run Shannon outside the session" — no harness, no UserPromptSubmit, no tool broker.

Six of the seven Shannon layers relied on events only Claude Code emits. The stack collapsed from seven layers to two.

This CLI reconstructs the missing layers as explicit pipeline stages: `load_constitution`, `load_rules`, `validate_preflight`, `plan_phase`, `enforce_invariants`, `record_evidence`.

The write-up covers:

- What the harness was quietly doing for the framework version
- What Shannon-CLI adds back, in order, from `main()`
- Three open issues (skill activation, subagent inheritance, watch mode) and why none has a clean answer yet
- What ported cleanly (constitution + rules files, the evidence gate) and why
- When to use the framework vs the CLI vs both

```bash
pip install shannon-cli
shannon-cli run --target ./your-project --task "audit streaming module"
```

Small on purpose. The constitution is the contract. The runtime is the negotiable part.
