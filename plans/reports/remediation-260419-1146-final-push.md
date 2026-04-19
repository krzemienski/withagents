# Remediation Plan — Ralph Loop Iteration 3 / Final Push

**Created:** 2026-04-19 11:47
**Ralph iteration:** 3/100
**AC7 stance:** user accepts architect's Option 3 (filter-repo + force-push + rotate IAM key + 90-day GC wait). No nuke-recreate. No GitHub Support ticket.

## State Snapshot

| Track | Status | Evidence |
|---|---|---|
| Phase 08 visual system | PASS | phase-08-output/PHASE-08-GATE.md |
| Phase 09 site build | PASS | phase-09-output/PHASE-09-GATE.md |
| Phase 10 content (45 posts × 4 channels) | SHIPPED | 180 files in withagents-site/src/content/posts/ |
| Phase 11 syndication adapters (4) | SHIPPED + tsc clean | scripts/syndication/{linkedin,x,supabase,shared,readme-patcher,scheduler}/ |
| Phase 13 consultant pipeline | SHIPPED + functional | dist/client/work/ + .vercel/output/_functions/chunks/consult_*.mjs |
| Content-sanitation pass | DONE | em-dash, comments, excerpt, raw-< all fixed |
| Routing fix | DONE | 52 routes built, strict date-desc sort |
| ckm:write:audit (3 cohorts) | DONE | 45 MDX + 45 LinkedIn + 45 X audited, reports filed |
| Wave 1b content blocker fixes | APPARENTLY DONE | 9 target files modified 11:46-11:47, NO report written |
| GitHub push | DONE (partial AC7) | origin main = 16a9976, orphan 78ea27 in 90d GC |

## 11 Date-Frontmatter Anomalies (remediation below)

| Day | Actual | Expected (arc start 2026-04-19) | Delta |
|---|---|---|---|
| 20 | 2026-05-15 | 2026-05-08 | +7 |
| 27 | 2026-05-22 | 2026-05-15 | +7 |
| 28 | 2026-05-23 | 2026-05-16 | +7 |
| 29 | 2026-05-24 | 2026-05-17 | +7 |
| 31 | 2026-05-26 | 2026-05-19 | +7 |
| 44 | 2026-04-19 | 2026-06-01 | –43 (placeholder) |
| 45 | 2026-04-19 | 2026-06-02 | –44 (placeholder) |
| 46 | 2026-04-19 | 2026-06-03 | –45 (placeholder) |
| 47 | 2026-04-19 | 2026-06-04 | –46 (placeholder) |
| 49 | 2026-04-19 | 2026-06-06 | –48 (placeholder) |
| 60 | 2026-06-24 | 2026-06-17 | +7 |

**Pattern:** C9 cohort shifted +7 days (agent assumed Apr-26 start). C7 cohort used today's date as placeholder. Mechanical fix: compute expected = 2026-04-19 + (day_n - 1) and rewrite frontmatter.date.

## Remediation Steps (parallel where possible)

1. **Mechanical date-fix pass** — Python script rewrites 11 frontmatter dates. Rebuild to confirm sort order collapses to perfect day-ascending. **Blocks nothing.**
2. **Verify Wave 1b blocker fixes landed** — grep-check that day-50 X tweet 5/14 is ≤280ch, day-31 + day-60 TODOs replaced, day-03/08 URLs flipped. Write a synthetic wave1b verification report. **Parallel with #1.**
3. **Step 7.5 ai-slop-cleaner** — Skill tool invocation scoped to ralph-session files. **Depends on #1/#2.**
4. **Step 7.6 regression** — `pnpm run build` + verify /work + /writing routes + /api/consult still present. **Depends on #3.**
5. **Final commit + force-push** — one commit with all fixes: dates + Wave 1b content + deslop. **Depends on #4.**
6. **PRD close-out** — mark US-007 as DONE_WITH_CONCERNS citing architect Option 3, note IAM rotation + 90d GC window as user-owned residual risk. **Parallel with #5.**
7. **/oh-my-claudecode:cancel** — clean ralph state exit. **Final.**

## User-Owned Actions (outside this loop)

- [ ] Rotate `AKIA6OOPOBSI552BPY76` in AWS IAM console (renders exposed key useless; this is the REAL security control)
- [ ] (Optional) Grant `delete_repo` scope later and nuke-recreate repo if you want immediate orphan purge instead of 90d wait
- [ ] (Optional) File GitHub Support "sensitive data removal" ticket for repo `krzemienski/withagents` citing orphan SHA `78ea27581d5cd0b77b5bfa0281c006fa83c408c0`

## Non-Goals This Loop

- Wave 1b non-blocker polish (LinkedIn CTA additions, keyword-in-first-100w, day-14/15 duplicated openings, day-20 readability expansion) — deferred to a pre-Phase-12 polish pass
- Moving syndication companion files to a sibling directory (longer-term refactor)
- IAM key rotation (user-only action)
