---
phase: 06
name: 30-day-calendar
status: pending
blockedBy: [phase-02-synthesis, phase-05-publication-pipeline]
---

# Phase 06 — 30-Day Content Calendar

## Purpose

Concrete day-by-day schedule that turns Phase 02's product inventory + insight library into the 30-day hard push. Gated on products' launch-readiness (from Phase 02), NOT aspirational.

## Calendar Template

Rows = days 1-30, columns per platform. Filled after Phase 02 grades each product's readiness.

## Day-Type Mix (target, not rigid)

| Day type | Count / 30 days | What runs |
|---|---|---|
| Flagship launch | 3 | New blog + LinkedIn article + Substack + Medium + X thread + repo announcement |
| Product post | 8-10 | Same shape, smaller product |
| Insight post | 6-8 | Insight library item → blog + LinkedIn short + X thread |
| Devlog | 6-8 | Short update on the push itself (weekly theme retros, behind-the-scenes) |
| Engagement-only | 3-5 | No new content, reply to inbound, comment on peers' posts |

## Early-Launch Anchors (high confidence from 30d mine)

Day 1 of the push — likely lead:
- **validationforge GA** — 257 30d agent spawns, PRD v2.0.0, strongest readiness signal → big flagship day
- Companion post: "Why I built ValidationForge: 4,500 sessions that broke test mocking"

Day 4-5 secondary:
- **Code Stories platform debut at codestories.platform** — narrated repos + whatever `code-tales` + `code-story-platform` are ready to ship
- Post: "Repos as audio: the Code Stories platform"

Day 8-10 tertiary:
- **SessionForge shipping milestone** (consistently active 30d)
- Post: "SessionForge: every Claude Code session turned into a productive tool"

Day 15-17:
- **iOS story** — ils-ios + remodex + claude-ios-streaming-bridge arc
- Post: "Why iOS needed its own Claude Code client"

Day 22+:
- **Orchestration pattern deep-dive** — ralph-loop-patterns + multi-agent-consensus + auto-claude-worktrees
- Post: "Three orchestration patterns that beat single-agent plans"

Final day:
- **Manifesto / throughline** from `synthesis/narrative-spine.md`
- Post: "The pattern behind 23,479 Claude Code sessions"

## Fills (determined in Phase 02)

Remaining 15-20 slots filled from:
- Other active-30d products (autonomous-coder, shannon-framework, auto-claude-worktrees, claude-prompt-stack, etc.)
- Insight library items
- Drafts from Workstream F (publish-as-is candidates)

## Acceptance Criteria

- [ ] 30-row table completed with realistic readiness grading (no aspirational "launch on day 2" if product needs 3 more weeks)
- [ ] Flagship anchor days have all 6 channels assigned (blog + LinkedIn article + LinkedIn short + Substack + Medium + X + repo update)
- [ ] No day has >2 platform-critical deliverables (scheduler overloads kill humans)
- [ ] User signs off on calendar order at Phase 07

## Risks + Mitigations (revised 2026-04-19 per strengthening package)

- **Product not actually ready** — calendar written from 30d mine activity density. Mitigation: Phase 02 grades readiness honestly; Day 4-5 anchor (Code Stories) **gated on codestories-product-domain decision + code-tales readiness grade ≥near** — do not hard-anchor until both confirmed.
- **Energy collapse at day 14-18** is the classic mid-push failure mode. **Revised mitigation:** streaming-publish rhythm, not pre-draft-everything (see `publish_rhythm` below).
- **Health / miss-day fallback** — 3 off-days distributed across weeks, 2 pre-drafted emergency insight posts in reserve, missed deliverable = 24h pause never double-up.

## Streaming Publish Rhythm (replaces "pre-draft everything")

```xml
<pre_push_minimum_drafts required_by="day -3">
  <flagship_posts>3 of 3 fully drafted, voice-reviewed, assets cut (~24h total)</flagship_posts>
  <product_posts>5 of 8-10 drafted to ≥80% body + hero/diagram outlined (~20h)</product_posts>
  <linkedin_long_form>3 flagship articles manual-UI-ready (~6h)</linkedin_long_form>
  <reserve_emergency_insights>2 pre-drafted safety posts (~4h)</reserve_emergency_insights>
  <total_pre_push_hours>~54h</total_pre_push_hours>
</pre_push_minimum_drafts>
<during_push_cadence>
  <week_1>flagship 1 (validationforge) + 3-4 posts. ~25h.</week_1>
  <week_2>flagship 2 (Code Stories, GATED) + 2-3 posts. ~22h.</week_2>
  <week_3>rest week: 2-3 posts, no flagship. ~15h.</week_3>
  <week_4>flagship 3 (manifesto) + 2-3 posts. ~22h.</week_4>
</during_push_cadence>
<buffer_rule>3 declared off-days non-negotiable. Missed deliverable = 24h pause, never double-up.</buffer_rule>
```

## Day 4-5 Hard Gate (added 2026-04-19)

Do not schedule Code Stories debut on Day 4-5 unless **both** confirmed by end of Phase 07:
1. Code Stories product domain (codetails.app or alternative) **decided and DNS wired**
2. `code-tales` / `code-story-platform` / `code-tales-ios` readiness grade ≥ "near" in Phase 02 product-inventory.md

If either fails: slide Code Stories flagship to Week 3 slot; insert a product post in Day 4-5.
