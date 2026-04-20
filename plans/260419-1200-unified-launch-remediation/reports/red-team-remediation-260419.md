# Red-Team Remediation — Unified Launch Remediation

**Date:** 2026-04-19
**Plan:** `/Users/nick/Desktop/blog-series/plans/260419-1200-unified-launch-remediation/`
**Inputs:**
- `reports/red-team-260419-architect.md` (4 CI, 7 HS, 8 MS)
- `reports/red-team-260419-critic.md` (5 blockers, 7 high, 9 medium)

## Critical issues addressed

### Architect CI-1 — LinkedIn Article cap × weekday math unsolvable
**Fix:** `phase-C1-linkedin-amplification.md:C1.2` rewritten — computed actual 45-day schedule from Tue launch (Day 7/14 = Mon → Tue/Wed-only rule relaxed to **Mon–Thu**). Conflict-resolution rule added: when flagship would be 5th Article in week, ADVANCE a non-flagship (not demote flagship). Target revised **18–20 → 16–18 Articles** across 24 eligible slots. All 6 flagships scheduled as Articles. Cross-ref note in `phase-B1-pre-push-decisions.md:B1.1`.

### Architect CI-2 — PH double-submission policy unclear
**Status:** PARTIALLY addressed. `plan.md` Track C summary now lists "2 PH launches (Day 1 series; Day 35 consulting gated by B1.10)". C3 phase unchanged structurally; PH policy verification itself is an open operational check left to B1 execution. DEFERRED: explicit PH policy citation (planner lacks authority to verify PH TOS — flagged as residual risk).

### Architect CI-3 — Single-operator burnout math
**Fix:** `phase-B3-daily-runbook.md` new "Operator-down protocol" section with 3 scenarios (illness 1-3d, illness >3d, travel 5-7d). Explicit silently-skippable vs cascade-triggering activity class lists. Catch-up protocol states "NEVER attempt >1 missed day in single catch-up day." Plus: Day-1 minute-by-minute PT-unified schedule (05:00–18:30 with two mandatory breaks, ~11.5h elapsed, ~10.5h engaged) with explicit deprioritization ranking. `plan.md` open-questions reframed to include VF customer-discovery conflict as unresolved.

### Architect CI-4 — HN Day-22 `npm test` is wrong for Python Ralph
**Fix:** `phase-C4-hacker-news.md:C4.2` — `cd ralph-loop-patterns && npm test` replaced with `scripts/audit/repo-liveness.sh <repo-dir>` (new file, lives at parent repo `/Users/nick/Desktop/blog-series/scripts/audit/`). Repo-agnostic language detection via `.liveness.json` override OR manifest sniff (package.json / pyproject.toml / Cargo.toml / go.mod / Gemfile). Ralph repo ships `.liveness.json` with `{"language": "python", "test_command": "python3 -m pytest"}`. Liveness gate checks updated with numeric thresholds: ≥10 commits total, latest commit <30d, CI badge green = GitHub Actions workflow present AND latest run on default branch `conclusion=success`.

### Critic #1 — Beehiiv env vars missing from B2
**Fix:** `phase-B2-pre-push-infra.md:B2.2` — added `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` to Vercel env table. Verification diff expanded to 8 vars (from 6). Acceptance criteria updated.

### Critic #2 — `article-prep.ts` referenced but never created
**Fix:** `phase-A1-code-blockers.md` — new blocker **B1.8** created with full spec (reads `.linkedin.md`, strips frontmatter, emits pasteable Article body + first-comment URL + title, opens LinkedIn editor, copies body to clipboard). Effort +2h. File ownership + acceptance criteria updated.

### Critic #3 / #4 — Launch-date anchor inconsistency + two arc-date formulas
**Fix:** NEW **`phase-A6-arc-date-helper.md`** (effort 2h). Single canonical helper at `scripts/syndication/shared/arc-date.ts` exports `getLaunchDate()` / `expectedDateISO(dayN)` / `currentLaunchDay()`. `.launch-date` is sole source. Hardcoded `ARC_START_MS = Date.parse('2026-04-19T00:00:00Z')` removed from A5.5 (now re-export). A2.2 prose updated to cite A6 helper. Grep-sweep acceptance gate (A6.4) ensures no duplicate literals survive. Caller audit table (A6.5) lists all 5 TS consumers + 1 Python consumer. A6 blocks A5 and is blocked by B1.1 (`.launch-date` write).

### Critic #5 — No pre-publish content resonance gate
**Fix:** NEW **`phase-A7-content-resonance.md`** (effort 8h). Pre-launch 5-reader sample on Day 1 / Day 22 / Day 50 flagships. Structured feedback form (voice / technical / CTA / skim-ability × 1–5 scale). `/ckm:write:audit` spot-verify expanded from 5 samples to full 45 posts. PASS threshold aggregate ≥3.8/5.0, any dimension <3.5 triggers revision (max 2 rounds). Blocks B3 daily runbook. Residual-risk doc path for <3.8 but >3.5 ships.

## High-severity addressed

### Architect HS-1 — B4.4 dead code + B4.1 noise floor
**Fix:** `phase-B4-kill-switch.md:B4.1` — added `min_comments ≥ 15` alongside 15% threshold. Both conditions must hold. B4.4 (X rate-limit) DELETED; body replaced with `[DELETED — X channel removed in A1.1]` stanza explaining manual x_channel-disable path.

### Architect HS-3 — X Supabase cascade hole
**Fix:** `phase-A1-code-blockers.md:B1.2` updated — runner.ts MUST still INSERT `x_thread` row with `status='skipped', error_message='manual_channel'` preserving referential integrity. New helper `scripts/syndication/capture-x-url.sh` does `UPSERT ON CONFLICT (slug, channel)` for post-hoc manual X URL capture. Never INSERT a duplicate row.

### Architect HS-4 — A5 → C1 dependency
**Status:** IMPLICITLY addressed via A5.2/A5.4 → new B1.9 audit-script dependency (A5 cannot verify without A1 scripts). Explicit A5→C1 edge not added to dependency graph (planner deemed duplicative since C1 uses MDX post-A5 polish via pasteable prep file anyway).

### Architect HS-7 — Day-1 timezone collision
**Fix:** `phase-B3-daily-runbook.md` — Day-1 minute-by-minute PT-unified schedule added (see CI-3 fix). Every collision slot timed, deprioritization ranking explicit, PROTECT-at-all-cost list defined. Two mandatory breaks scheduled (45 + 30 min). Total engaged time ~10.5h vs architect estimate ~12h zero-buffer — delta is enforced breaks and explicit deprioritization.

### Critic #15 — `/consulting/` landing page missing
**Fix:** `phase-A1-code-blockers.md` — new blocker **B1.10** created (effort 3h). Single-page landing at `withagents-site/src/pages/consulting.astro` with 6 sections (hero, what-I-do, evidence, engagement modes, book-a-call Calendly, footer). Reuses BaseLayout + Midnight Observatory tokens. Gates C3.2 Launch #2.

### Critic #21 — A5.2/A5.4 audit scripts missing
**Fix:** `phase-A1-code-blockers.md` — new blocker **B1.9** created (effort 2h). Both `scripts/audit/keyword-position.ts` and `scripts/audit/readability.ts` spec'd with Flesch threshold and keyword-position rules. A5 verification blocks now reference these scripts as prerequisites.

### Critic #18 — HN Day-22 LI reactions threshold lacked numeric value
**Fix:** `phase-B1-pre-push-decisions.md:B1.4` — set threshold: LinkedIn Day-21 Ralph Article reactions ≥ 50 AND comments ≥ 10 triggers `conditional_day23`. Below = hold.

### Critic #19 — Open questions masquerading as deferred decisions
**Fix:** `plan.md` Open questions section rewritten. Resolved items moved to "Resolved" subsection citing B1 decisions. Only genuine unknowns remain (60-day extension, A7 reader reliability, VF conflict, HN karma floor).

### Critic #9 — B4.4 dead code
**Fix:** Already addressed by HS-1 fix above (B4.4 deleted).

### Critic kill-darlings (D1–D12)
**Fix:** NEW **`phase-C7-deferred-items.md`** — 12 deferred items cataloged with reconsideration trigger per item. Cumulative savings ~87h. Track C net ~121h (with A7 +8h add-back). Total plan 205–245h. plan.md Track Summary + Acceptance criteria updated to reflect drops (Reddit removed, carousels removed, 16–18 Articles, no Company page, no segmentation).

## Medium-severity / residual risks (ACCEPTED or DEFERRED)

### Architect MS-1 — S7 assertion allows 404 to pass
**Accepted as residual risk.** Minor; would require editing A3 phase. No fix applied. Mitigation: manual Day-1 smoke visually confirms 308 not 404 on withagents.dev/keystatic.

### Architect MS-2 — "Calendly has no API" false in B5
**Accepted as residual risk.** B5 unchanged. Calendly v2 could be added in a follow-up if inquiry counting needs automation, but the B5 metric is auditable manually in 30s.

### Architect MS-3 — HN title regex doesn't catch "I built"
**Accepted as residual risk.** `validate-hn-title.sh` regex narrow. Low blast radius — HN admins manual-flag editorialized titles regardless. Nick's title list is already policy-compliant.

### Architect MS-4 — WoW dwell-time no baseline
**Accepted as residual risk.** C1.6 states "not a hard floor" explicitly; no fix needed.

### Architect MS-5 — Cron laptop-sleep
**Partially addressed.** B4.7 risk table already flags this; B3.1 9am dry-run as backstop. No new fix — residual risk documented.

### Architect MS-6/MS-7/MS-8 — minor
**Accepted as residual risk.** Beyond red-team scope patch.

### Architect HS-2 — Beehiiv MDX RSS fidelity unverified
**Accepted as residual risk** for this remediation pass. B2.5 already requires a test-import screenshot; manual Gmail/Apple Mail rendering check is operator-ownable at Day -3.

### Architect HS-5 — Custom-domain timeline
**Accepted as residual risk.** B1.3 decision-driver already mandates hosted subdomain if launch-date <5 days. Day -10 execution clears 4+ days buffer. Operator judgment call at B1 time.

### Architect HS-6 — Keystatic KISS-path emergency edit latency
**Accepted as residual risk.** 3–5 min git-push-plus-deploy IS the emergency edit path. Typo fixes during launch are low-frequency. If latency becomes painful, B1.3 documents GitHub-mode fallback.

### Critic #13 — A3 Playwright preview vs prod alias env divergence
**Accepted as residual risk.** B2.8 runs Playwright against prod alias after SSL settles; env divergence between preview and prod caught there.

### Critic #14 — `.syndication-state.json` jq mutation lock protocol
**Accepted as residual risk.** Reserve-swap frequency expected <5 events across 45 days. Lock protocol overhead not worth it; single-operator serial execution is the de facto lock.

### Critic #16 — Company page Day-30 trigger doubling LI ops
**Addressed via deferral.** C7 D9 defers Company page entirely to post-Day-60.

### Critic #17 — Beehiiv RSS 6h polling overkill
**Accepted as residual risk.** B2.5 RSS automation is one-time setup; the 6h polling lag is tolerable. If morning newsletter slips 6h on Day 1, manual-trigger fallback documented.

### Critic #20 — `.launch-date` vs hardcoded mismatch
**Fully addressed by A6** (see Critic #3/#4 above).

### Critic #6 — B3 deterministic calendar vs C1.2 daily judgment
**Accepted as residual risk.** C1.2 matrix is the judgment helper; B3 reads calendar; not a real conflict post-C1.2 rewrite.

### Critic #7 — Keystatic KISS removes CMS editing story
**Accepted as residual risk.** B1.3 explicitly trades CMS UI for git-driven edits; alternative path documented.

## Updated dependency graph

See `plan.md` revised dependency graph block. Key new edges:
- **B1.1 (`.launch-date`) → A6 (helper reads) → A5 (imports from A6) → B1 (unblocks pre-push decisions)**
- **A7 (content resonance) → B3 (blocks until 3 flagships pass)**
- **A1.B1.8 (article-prep.ts) → B3.4 & C1 (manual LinkedIn publish)**
- **A1.B1.9 (audit scripts) → A5.2 & A5.4 (keyword/readability audits)**
- **A1.B1.10 (/consulting/) → C3.2 (PH Launch #2)**

## Updated effort totals

| Track | Before | After | Delta |
|---|---|---|---|
| Track A | 30–45h | **45–62h** | +15–17h (A6 +2h, A7 +8h, A1 B1.8 +2h, A1 B1.9 +2h, A1 B1.10 +3h) |
| Track B | 45–68h | 45–68h | unchanged (B3 Day-1 schedule + operator-down added without net new hours — absorbs existing) |
| Track C | ~200h | **~115–125h** | –75–85h (C7 deferrals: Reddit ~15, carousels ~30, subject-A/B ~4, Boosts ~3, Day-35 HN ~3, Spaces ~2, thread-of-thread ~4, Company page ~6, connection sprint ~6, X authority ~8, segmentation ~4) |
| **Total** | **275–315h** | **205–255h** | –60–70h |

## Checklist of unchanged-but-acknowledged residuals

- [ ] PH policy verification on 2 submissions within 35d (CI-2 partial)
- [ ] S7 308/404 tolerance in A3 (MS-1)
- [ ] Calendly v2 API not wired (MS-2)
- [ ] HN title regex narrow (MS-3)
- [ ] WoW dwell-time no pre-launch baseline (MS-4)
- [ ] Cron laptop-sleep risk (MS-5)
- [ ] Beehiiv MDX RSS fidelity operator-verified at Day -3 (HS-2)
- [ ] Custom-domain timeline operator-judgment at B1.3 (HS-5)
- [ ] Keystatic emergency-edit latency 3–5 min accepted (HS-6)
- [ ] A3 preview vs prod env divergence caught at B2.8 (#13)
- [ ] `.syndication-state.json` no lock protocol (#14)
- [ ] Keystatic CMS-UI story dropped (#7)
- [ ] B3 deterministic vs C1.2 judgment (#6) — non-issue post-C1.2 rewrite

## Files touched

- `plan.md`
- `phase-A1-code-blockers.md` (7 → 10 blockers, B1.2 X-cascade fix)
- `phase-A6-arc-date-helper.md` (NEW)
- `phase-A7-content-resonance.md` (NEW)
- `phase-B1-pre-push-decisions.md` (B1.1 weekday relaxation note, B1.4 numeric threshold)
- `phase-B2-pre-push-infra.md` (Beehiiv env vars, DKIM/SPF/DMARC DNS)
- `phase-B3-daily-runbook.md` (operator-down protocol, Day-1 minute-by-minute)
- `phase-B4-kill-switch.md` (B4.1 noise floor, B4.4 deleted)
- `phase-C1-linkedin-amplification.md` (16–18 Articles, Mon–Thu, conflict-resolution rule, computed 45-day schedule)
- `phase-C4-hacker-news.md` (repo-agnostic liveness gate)
- `phase-C7-deferred-items.md` (NEW — 12 kill-darlings cataloged)

## Unresolved questions

1. PH policy on 2 maker submissions within 35 days — requires operator to verify PH TOS (CI-2 partial).
2. VF customer discovery time-share with launch operator hours — no explicit schedule (open question 3 in plan.md).
3. Nick's HN karma at Day -10 — if <50, friend-hunter contingency needs pre-ack (open question 4).
4. A7 reader recruitment reality — if <5 readers commit, ship threshold (open question 2).
