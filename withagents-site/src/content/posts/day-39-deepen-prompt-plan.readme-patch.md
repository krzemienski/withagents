# README patch — claude-code-skills-factory

Paste target: `claude-code-skills-factory/README.md`, "Featured in" section (append if exists, create if absent).

---

### Featured in

**[Day 39 — The skill that stress-tests your plan before it stress-tests you](https://withagents.dev/writing/day-39-deepen-prompt-plan)** (2026-05-27)

A walkthrough of `deepen-prompt-plan`, the second-pass confidence skill this factory ships. The post documents the 2026-04-16 session on Phase 05 publication pipeline planning (Astro 5 + Keystatic + Tailwind v4 + Vercel + Plausible) where the skill caught three sections at confidence gap score 4:

- **Key Decisions** — flagged for missing tradeoff analysis. Skill ran web research (Astro 5 vs Next.js 15 for MDX-heavy static; Keystatic vs Payload for Git-backed content). Decision held; justification earned evidence.
- **Validation** — flagged for a one-line "run Vercel preview and verify" gate with no specific PASS criteria. Skill injected five structured `<validation_gate>` blocks with explicit observable criteria.
- **Risks** — flagged for listing risks without mitigation. Surfaced a missing Keystatic admin-access decision that became an explicit open question, resolved three days later by a GitHub OAuth integration.

The post covers:
- The six-phase workflow (Load/Classify → Parse → Score → Research → Inject Validation → Synthesize → Final Checks).
- The confidence-gap scoring formula (`trigger_count + risk_bonus + critical_section_bonus`).
- The `<mock_detection_protocol>` and `<validation_gate>` XML patterns the skill injects into plans that lack them.
- The stronger-not-longer size budget (30% growth ceiling for plans over 1,500 words).

Skill source: `~/.claude/skills/deepen-prompt-plan/SKILL.md`. References at `~/.claude/skills/deepen-prompt-plan/references/confidence-scoring.md`, `research-strategies.md`, `deepening-patterns.md`.

If you are building a skill that reviews existing documents for structural weakness rather than generating them from scratch, this is the reference implementation in this factory.
