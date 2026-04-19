# README patch — claude-code-skills-factory

Paste target: `claude-code-skills-factory/README.md`, "Featured in" section (append if exists, create if absent).

---

### Featured in

**[Day 37 — The planning skill that refuses to let you start coding](https://withagents.dev/writing/day-37-ck-plan)** (2026-05-25)

A walkthrough of `ck-plan`, the canonical planning skill this factory ships. The post documents three sessions where specific subcommands changed the outcome:

- The 2026-04-12 scope challenge that killed a watch-mode feature before a phase file was written ("nothing consumed the new insights file"). 5 of 8 scope-challenge runs in the last 90 days resulted in the plan being killed outright; 3 more were rescoped; 0 were regretted.
- The 2026-04-14 `/ck:plan red-team` pass on the `withagents-skills` package launch plan, which surfaced a 20-30h build-effort undercount and a missing Day -10 CCB canonical-repo decision gate. Both became explicit open questions before dispatch.
- The 2026-04-19 `/ck:plan validate` pass on the Phase 10 content agent plan (the same plan this post was produced under), which caught three gaps: no em-dash counter in the review protocol, no handoff contract between writer and reviewer agents, no failure mode for the REWRITE verdict branch.

The post covers the 5 workflow modes (`--fast`, `--hard`, `--deep`, `--parallel`, `--two`), the 9-step process flow (pre-creation check through task hydration), and the "cook command" handoff pattern that enforces execution in a fresh session so the planner context does not leak into the executor. All pulled from `~/.claude/skills/ck-plan/SKILL.md` and the `references/` files it loads.

If you are building a planning skill that needs to survive contact with real execution, this is the reference implementation in this factory.
