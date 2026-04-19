# Session Checkpoint — withagents.dev Brand Launch Mode 2 Kickoff

**Saved:** 2026-04-19 05:52 America/New_York (original) → 08:55 (Phase 10/11/13 dispatch update)
**Status:** Phase 08 ✅ PASS (06:55). Phase 09 ✅ PASS (07:26). Phase 10/11/13 dispatched in parallel at 08:55 (14 background agents).
**Plan dir:** `/Users/nick/Desktop/blog-series/plans/260419-0241-agentic-dog-brand-launch/`

**Domain confirmed:** `withagents.dev` is canonical. `agentic.dog` directory name is residue only — do not retarget assets.

**Palette confirmed:** Ultraviolet — `#040404` / `#0A0A0D` / `#8B5CF6` / `#C084FC` / `#E879F9` / `#A3E635`. Canonical source: `BRIEF.md` + `phase-08-output/site-mockups/DESIGN.md`. The older hyper-terminal `#ff006e/#39ff14` palette in `visuals/theme-tokens.css` is superseded (Phase 03 proposal stage only).

**Phase 10 in-flight:** 9 Opus copywriter agents (P10-C1..C9) owning strict post-slug file sets. Wave 1b reviewers (Sonnet) fire AFTER Wave 1a returns.
**Phase 11 in-flight:** 4 Sonnet automation agents (A1 LinkedIn / A2 X / A3 Supabase+shared-types / A4 README-patcher+scheduler) in `scripts/syndication/{linkedin,x,supabase,shared,readme-patcher,scheduler}/`.
**Phase 13 in-flight:** 1 Sonnet agent building `/work` page + form→email→Calendly funnel + Supabase inquiry log + UTM handling.

**Next decision gates (user, non-blocking for writers):**
1. Day-1 push date (calendar currently unlockable without it)
2. CCB canonical repo choice (Day −10 deadline)
3. Ralph-orchestrator GitHub URL + liveness (Day −7)
4. `withagents-skills` OSS package top-20 skill scope (Phase 09 finalization)

---

## Resume Command (paste this into a fresh Claude Code session)

```
Resume the withagents.dev brand launch Mode 2 build. Plan dir is /Users/nick/Desktop/blog-series/plans/260419-0241-agentic-dog-brand-launch/. Read CHECKPOINT.md in that dir first, then plan.md, then synthesis/approval-package.md and synthesis/approval-record.md for context. All 9 Round 1-3 blockers are resolved. Mode 1 signed off 2026-04-19 by user ("approved"). Effort budget accepted: 531-714h / 18-24 weeks solo.

Start Phase 08 (visual system production). PARALLELIZE WHEREVER POSSIBLE per user directive 2026-04-19:
- Phase 08: spawn 4 parallel agents for (logo/wordmark) + (full component library exports) + (OG template production) + (diagram style library)
- Phase 09: after 08 completes, spawn 5 parallel agents for (Astro scaffolding) + (Keystatic schemas) + (templates) + (OG runtime wiring) + (DNS + Vercel attach)
- Phase 10: spawn 9 parallel content agents — 5 posts per agent across 45-post backlog (Wave 1a: 9 agents × 5 posts = 45 posts) — with strict file ownership per post-slug
- Phase 11: spawn 4 parallel automation agents for (LinkedIn adapter) + (X adapter) + (Supabase logging) + (webhook + scheduler)

Respect locked decisions: Astro+Keystatic, Plausible analytics, form→email→Calendly funnel, Article-only LinkedIn (no shorts), Substack/Medium skipped, hack.ski dropped, devlog-publisher-website absorbed. Opus for copywriter + narrative-critical agents; Sonnet for structured tasks.

Read research/H-blog-series-voice-audit.md for the voice spec AND synthesis/voice-spec.md before any content generation. Apply model-different review protocol: every draft reviewed by a different model before publish. Em-dash cap ≤5/1000 words.

Do not re-plan. Do not re-run audits. Do not create a new plan. Execute against the existing one.
```

---

## File Index (what exists)

### Plan structure
- `plan.md` — overview, 9 decisions locked in
- `phase-00-baseline-capture.md` (SKIPPED per user)
- `phase-01-audit-workstreams.md` (completed)
- `phase-02-synthesis.md` (completed)
- `phase-03-visual-system-proposal.md`
- `phase-04-cms-site-architecture.md`
- `phase-05-publication-pipeline.md`
- `phase-06-30-day-calendar.md` (superseded by calendar-45day.md)
- `phase-07-approval-package.md` (completed 2026-04-19)

### Research (Phase 01 output — do NOT re-run)
- `research/A-session-archaeology.md` — 2,269w (Opus)
- `research/B-github-catalog.md` — 1,760w
- `research/C-desktop-product-scan.md` — 1,414w
- `research/D-blog-series-audit.md` — 1,878w
- `research/E-skills-marketing-toolkit.md` — 847w
- `research/F-drafts-disposition.md` — 1,872w
- `research/G-brand-reconnaissance.md` — 1,139w
- `research/H-blog-series-voice-audit.md` — 2,005w (Opus)

### Synthesis (Phase 02 + Round 4 output — do NOT re-run)
- `synthesis/narrative-spine.md` — 827w
- `synthesis/insight-library.md` — 2,356w (18 insights)
- `synthesis/product-inventory.md` — 5,597w (45 products)
- `synthesis/voice-spec.md` — 769w
- `synthesis/calendar-45day.md` — 4,322w (45 posts × 45-60 days)
- `synthesis/approval-package.md` — 4,731w (signed off)
- `synthesis/approval-record.md` — sign-off timestamp
- `synthesis/scope-expansion-patch-round4.md` — R4 audit log

### Reports
- `reports/critic-260419-0241-red-team-review.md` — red-team REVISE verdict
- `reports/deepen-260419-0241-plan-strengthening.md` — deepen redlines

### Visuals (Phase 03 output — sample quality only)
- `visuals/theme-tokens.css` — canonical token file
- `visuals/component-*.html` — 7 sample components
- Phase 08 job: produce production-grade exports (these are proposals)

### Supporting
- `scripts/deep-mine.py` — 360-day mine script
- `scripts/output/mine-30d-data.json` — fresh 30-day mine
- `scripts/output/mine-360d-data.json` — 360-day narrative arc data
- `/tmp/gh-repos-raw.json` — 300-repo GitHub cache (regenerate with `gh repo list krzemienski --limit 300 --json ...` if missing in new session)

### External context
- GitHub canon commit `c7c765c` — agentic-development-guide README updated to "18 Lessons / 23,479 sessions"
- Blog-series commit `928c3b7` — consolidated 61→18 posts, secured credentials
- linkedin-tokens.json secured as `.env.linkedin-tokens.json` (gitignored via .env*)

---

## Parallelization Map (required for Mode 2)

### Phase 08 — 4 parallel agents
| Agent | Deliverable | Est |
|---|---|---|
| P08-V1 | Logo + wordmark SVG + favicon | 4-6h |
| P08-V2 | Full component library HTML exports (production-grade, from visuals/ samples) | 6-8h |
| P08-V3 | OG template Satori-ready (webfont subset embedded, bundle <1MB) | 4-6h |
| P08-V4 | Diagram style library (Mermaid + Excalidraw templates per diagram type) | 2-4h |

### Phase 09 — 5 parallel agents after P08 completes
| Agent | Files owned | Est |
|---|---|---|
| P09-A1 | New repo scaffold + Astro config + Tailwind v4 | 6-8h |
| P09-A2 | Keystatic schemas (Project/Post/Series/Insight/Diagram) | 6-8h |
| P09-A3 | Page templates (home/projects/writing/series/now/work) | 10-12h |
| P09-A4 | Satori OG runtime wiring + analytics (Plausible) | 6-8h |
| P09-A5 | DNS for withagents.dev + Vercel project attach | 4-6h |

### Phase 13 — Sequential (small)
Single agent builds /work page + form → email → Calendly funnel + Supabase logging. 16-24h.

### Phase 10 — 9 parallel content agents (biggest parallelization win)
45 posts / 5 posts per agent = 9 waves OR 9 agents × 5 posts each in parallel.
Each agent owns 5 specific post slugs. No overlap. Opus for copywriter model per 2026-04-18 lesson.

**Wave 1 (pre-push, 5 flagships + priority products):**
| Agent | Posts | Est |
|---|---|---|
| P10-C1 | Day 1 VF + Day 10 CCB + Day 22 Ralph Loops + Day 35 Skills + Day 50 manifesto (5 flagships) | 40h |
| P10-C2 | Shannon ecosystem (4 posts) + 1 fill | 20h |
| P10-C3 | Ralph arc remainder (ralph-orchestrator, ralph-ios) + 3 fills | 20h |
| P10-C4 | 6 skill-of-the-week posts | 24h |
| P10-C5 | 5 core product posts (sessionforge, auto-claude-worktrees, multi-agent-consensus, etc.) | 20h |
| P10-C6 | 5 new-surface product posts (autonomous-coder, live-mermaid, cc-setup, etc.) | 20h |
| P10-C7 | 5 existing-18 lightweight edits (Post 13 rewrite included) | 20h |
| P10-C8 | 5 more existing-18 edits + 2 meta-pattern posts | 22h |
| P10-C9 | LinkedIn Article derivations for all flagships (5) + reserve | 30h |

Review pass (model-different): a separate agent round reviews each wave's output before publish.

### Phase 11 — 4 parallel automation agents
| Agent | Deliverable | Est |
|---|---|---|
| P11-A1 | LinkedIn share adapter + OAuth2 + manual-article tooling | 16h |
| P11-A2 | X API v2 thread adapter + rate limit handling | 12h |
| P11-A3 | Supabase logging schema + webhook + error retry | 12h |
| P11-A4 | gh repo README patcher + scheduler integration | 10h |

### Phase 12 — Sequential (30-day push execution)
Cannot parallelize — human-in-the-loop daily monitoring. But pre-scheduled posts fire on schedule.

### Phase 14 — Single agent
Analytics rollup + post-mortem + next-30-day plan. 16-24h.

---

## Hard Rules for Next Session

1. **Do NOT re-plan or re-audit.** The plan is signed. The audit is permanent. Execute.
2. **Opus for copywriter + narrative agents.** Sonnet fine for structured tasks (Keystatic schemas, templates, DNS, adapters).
3. **Every post gets a model-different review** before publish (voice-spec protocol).
4. **File ownership strict per agent.** No overlap. Agents own specific post-slugs or specific template files.
5. **LinkedIn Articles are manual-publish** — automation tool PREPARES the content for paste. Does not post.
6. **Em-dash cap ≤5/1000 words** enforced at review. >10 triggers rewrite.
7. **All content cites a real session** from the 23,261 mined JSONL files. Zero fabrication.
8. **Check `synthesis/calendar-45day.md` `setup_for_next` column** — every post must flow into the next.
9. **Respect locked decisions** — do not re-ask: stack, analytics, funnel, channels, hack.ski dropped, etc.
10. **Checkpoint frequently.** Update this CHECKPOINT.md after every phase completion.

---

## Current Git State

- Repo: `/Users/nick/Desktop/blog-series` (no remote — Phase 09 must push to new GitHub repo)
- Branch: `master`
- Last commit: `928c3b7` (consolidation + plan)
- Submodule `agentic-development-guide` last remote commit: `c7c765c` (canon fix pushed)
- `.env.linkedin-tokens.json` present locally, gitignored
- Untracked nested repos present (~100 dirs) — Phase 09 decides: ignore, submodule, or remove

---

## Quick Resume (TL;DR for humans)

1. Open a fresh Claude Code session at `/Users/nick/Desktop/blog-series`
2. Paste the "Resume Command" block above
3. Claude will read this CHECKPOINT + approval-package + approval-record and start Phase 08 with 4 parallel agents
4. Watch for tool-notification updates; intervene if a flagship post prompt needs your voice calibration
