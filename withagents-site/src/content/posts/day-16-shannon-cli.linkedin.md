# Shannon-CLI: the same stack, no Claude Code session

Shannon ran inside Claude Code.

Hooks fired on every tool call. Skills activated from user prompts. Seven layers of redundant encoding kept 23,479 sessions on-rails.

Then the job became "run Shannon outside the session." No interactive harness. No UserPromptSubmit. No tool broker in the middle.

That is shannon-cli. Small on purpose. The point was not another framework. The point was to figure out which parts of Shannon survive when the harness leaves.

---

**What the harness was doing**

Six of the seven Shannon layers relied on events only Claude Code emits.

Layer 3 hooks ran because the harness invoked them between the model decision and the tool execution.

Layer 4 skills activated because the session matched a trigger keyword against a registry.

Layer 7 session-start hooks ran because there was a session at all.

Take that away and the stack collapsed from seven layers to two: the constitution and the rules directory.

Both are now just text files no runtime is reading.

---

**What Shannon-CLI adds back**

No magic event bus. Every enforcement point is a Python function you call, in order, from `main()`:

- `load_constitution()` and `load_rules()` port the two surviving layers directly
- `validate_preflight()` substitutes for session-start hooks
- `plan_phase()` adds the gate that skills used to enforce
- `enforce_invariants()` runs after plan generation, before execution — same filename patterns as `block-test-files.js`, different lifecycle slot
- `record_evidence()` writes to `e2e-evidence/{slug}/`. Empty files automatic FAIL.

---

**The three open issues I don't have clean answers for**

1. Skill activation without UserPromptSubmit. Explicit flag or keyword match on the task string, neither feels as tight as the harness version.
2. Subagent governance inheritance without a PreToolUse on Agent. Has to become a wrapper around every outbound model call, and survive library updates.
3. Watch mode. A daemon that reruns on file change or post-commit reintroduces session state, which the stateless design was trying to avoid.

The repo is honest about these. Three open issues, tagged.

---

**What ported cleanly**

Two things.

1. The constitution and rules files. A `.claude/CLAUDE.md` written for a Claude Code project is the same text Shannon-CLI loads on preflight. No translation.
2. Evidence discipline. The five-point gate from `evidence-gate-reminder.js` became the CLI's completion gate, and the 34% quality improvement measured inside Claude Code replicated within a factor of two.

Six of seven layers needed a rewrite. The two that did not are the two that were always just files.

---

**Where it fits**

- Inside Claude Code with human supervision → use the framework version. Seven layers, 95%-plus compliance.
- On CI, a cron, or a headless run → use Shannon-CLI. Two survived layers plus three reconstructed ones. Fewer false negatives, because nobody is there to override a block.
- Hybrid (human kicks off headless work) → both share the same constitution file. That configuration is what the three open issues are currently chasing.

---

```bash
pip install shannon-cli
shannon-cli run --target ./your-project --task "audit streaming module"
```

Repo: github.com/krzemienski/shannon-cli
Full write-up: https://withagents.dev/writing/day-16-shannon-cli

The constitution is the contract. The runtime is the negotiable part.
