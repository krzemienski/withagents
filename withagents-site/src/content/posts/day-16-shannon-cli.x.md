# X thread — day-16-shannon-cli

**Tweet 1 (276 chars)**

Shannon ran inside Claude Code.

hooks fired on every tool call. skills activated from prompts. seven layers held 23,479 sessions on-rails.

then the job became: run Shannon outside the session. no harness. no UserPromptSubmit. no tool broker.

what survives?

---

**Tweet 2 (248 chars)**

six of seven Shannon layers relied on events only the harness emits.

no harness = no Layer 3 hooks, no Layer 4 skill triggers, no Layer 7 session-start.

the stack collapses from seven layers to two: constitution + rules dir.

both are now just text no runtime is reading.

---

**Tweet 3 (268 chars)**

shannon-cli reconstructs the missing layers as explicit pipeline stages.

no event bus. every enforcement point is a python function called in order from main():

• load_constitution()
• load_rules()
• validate_preflight()
• plan_phase()
• enforce_invariants()
• record_evidence()

---

**Tweet 4 (226 chars)**

the piece the harness never had: record_evidence().

inside Claude Code, evidence lives in the transcript. outside, the transcript does not exist.

evidence = what you wrote to disk. screenshots, output, JSON. empty files = automatic FAIL.

---

**Tweet 5 (267 chars)**

three open issues i don't have clean answers for:

1. skill activation without UserPromptSubmit (explicit flag? keyword match? planning-phase LLM call?)
2. subagent governance inheritance without a PreToolUse on Agent
3. watch mode without reintroducing session state

---

**Tweet 6 (239 chars)**

two things ported cleanly:

1. constitution + rules files — same `.claude/CLAUDE.md` text Claude Code already loads
2. evidence gate — the 5-point checklist from evidence-gate-reminder.js. 34% quality lift replicated within a factor of 2 on CLI runs.

---

**Tweet 7 (251 chars)**

decision tree:

• inside Claude Code w/ human supervision → framework version, 7 layers, 95%+ compliance
• on CI / cron / headless → shannon-cli, fewer false negatives because nobody's there to override a block
• hybrid → both, sharing the same constitution file

---

**Tweet 8 (212 chars)**

```bash
pip install shannon-cli
shannon-cli run --target ./your-project --task "audit streaming module"
```

output: e2e-evidence/{slug}/step-NN-*.

one star. 4.3MB of python. small on purpose.

github.com/krzemienski/shannon-cli

---

**Tweet 9 (188 chars)**

full write-up w/ the 3 open issues, the pipeline sketch, and what survived the move:

withagents.dev/writing/day-16-shannon-cli

next: shannon-mcp, and what that repo's lifecycle taught.
