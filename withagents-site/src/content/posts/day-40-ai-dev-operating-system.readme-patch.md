# README patch — ai-dev-operating-system

Paste under the "Featured in" / "Used by" section of `github.com/krzemienski/ai-dev-operating-system`.

---

## Featured in the WithAgents 45-day launch series

**Day 40 — Skill of the week: ai-dev-operating-system.** This repo closes the six-post skill-of-the-week track (Days 34, 36, 37, 38, 39, 40). It is shipped under the skill-of-the-week shape because the shape of a well-designed skill, scaled up, converges on exactly this topology: six subsystems (OMC kernel, Ralph Loop, Specum pipeline, RALPLAN, GSD lifecycle, Team Pipeline) that behave like skills when you squint. The post walks the Ralph + stop-hook persistence pattern as the single most portable piece, documents real costs ($1.50–$4.00 per feature cycle), and calls out the limits honestly (routing table not classifier, opinionated CLI, hook-interface drift risk).

Read the full post: [withagents.dev/writing/day-40-ai-dev-operating-system](https://withagents.dev/writing/day-40-ai-dev-operating-system)

Related WithAgents posts:
- Day 34 — devlog-publisher (skill of the week #1)
- Day 36 — functional-validation (skill of the week #2)
- Day 37 — ck-plan (skill of the week #3)
- Day 38 — visual-explainer (skill of the week #4)
- Day 39 — deepen-prompt-plan (skill of the week #5)
- Day 22 — Ralph Orchestrator origin (the loop pattern this framework depends on)
- Day 35 — withagents-skills package launch (meta-post on skill design)

---

**Install:** `pip install ai-dev-os`
**License:** MIT
**Mode-bet:** Mixed (Interactive + Non-Interactive + SDK across layers)
**Entry point for new users:** `ai-dev-os ralph start --task "..."` — smallest useful subsystem; other subsystems build on it
