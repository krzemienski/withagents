# The skill that stress-tests your plan before it stress-tests you

I handed the skill a 1,400-word plan I was already happy with.

Three days of work. A validation spec, a phased rollout, a dependencies section, even a risk table. I ran `/deepen-prompt-plan` expecting a courteous pat on the back.

The skill came back with a scoring table. Three of my sections had confidence gap scores of 4 out of 6.

The plan I had been admiring was held together by optimism.

## Where it lives

`~/.claude/skills/deepen-prompt-plan/SKILL.md`.

Its own objective block describes it as "a second-pass confidence check — not a rewrite from scratch." The skill refuses to:
- Rewrite documents from scratch.
- Add implementation code.
- Invent requirements or change scope silently.

It takes an existing plan and stress-tests it.

## The confidence scoring formula

```
gap_score = trigger_count + risk_bonus + critical_section_bonus
```

- `trigger_count`: checklist problems that apply (from `references/confidence-scoring.md`).
- `risk_bonus`: +1 if the topic is high-risk AND the section is materially relevant.
- `critical_section_bonus`: +1 for Key Decisions, Tasks, Risks, Validation, or Workflows.

Sections at ≥ 2 become candidates. The skill picks the top 2-5 and presents the scoring table before proceeding.

## The session that rewrote my plan

2026-04-16. Phase 05 publication pipeline planning. Astro + Keystatic + Tailwind v4 + Vercel + Plausible. The plan had already survived `/ck:plan --hard` with red team and validate.

Phase 0 classified it: Implementation Plan, risk profile **high** (production deployment + Keystatic admin auth + Plausible API integration).

Phase 2 flagged three sections at score 4:

**Key Decisions** — "We'll use Astro 5 + Keystatic" with no alternatives considered. Skill ran web research, came back with tradeoff analysis (Astro 5 vs Next.js 15 for MDX, Keystatic vs Payload for Git-backed content). The decision did not change; the justification did.

**Validation** — one line saying "run Vercel preview and verify." Skill injected five gates with specific criteria. Gate VG-2 verbatim: "`curl https://preview-{sha}.vercel.app/api/og/day-34.png | file -` returns `image/png`; open the URL in Chrome; verify font rendering matches Space Grotesk + Inter subset."

**Risks** — four risks, no mitigations. Skill flagged the missing Keystatic admin-access decision. Content editing on a public domain needed auth; the plan did not say how. Became an explicit open question, resolved three days later by GitHub OAuth.

The deepened plan: ~1,700 words. Under 30% growth. Three sections stronger.

## Iron Rule injection

Phase 4 applies to documents that will be built and run. If the plan has no validation gates, the skill injects a `<mock_detection_protocol>` block at the top, then a `<validation_gate>` block after each task with a `<mock_guard>` field: "IF tempted to mock → STOP → fix real system."

The skill does not debate the Iron Rule. It injects it.

## Size budget

From the SKILL.md:
- Under 500 words: up to 3x growth acceptable.
- 500-1500 words: aim for under 2x.
- Over 1500 words: aim for under 30%.

The rule behind the rule: "Deepening increases justified confidence. It does not make the document longer for its own sake."

## What it cannot do

It cannot deepen a plan that has no plan. Three bullet points get "recommend moving to execution."

It cannot replace domain knowledge. If your decision rests on something only three people in the world have made and none of them blogged about it, the skill will surface the gap as an open question. Closing the question is still your job.

## Mode bet

Interactive. The skill reads the plan, spawns research subagents for weak sections, writes the deepened plan back to disk. Research steps are SDK-adjacent. Output is a single markdown file.

The honest test: hand it a plan you're already proud of. Watch it flag three sections at score 4. Realize you were about to ship a plan held together by optimism.

That is the reason the skill exists.

---

Full post with the scoring rubric, the XML injection patterns, and the 2026-04-16 session:
https://withagents.dev/writing/day-39-deepen-prompt-plan
