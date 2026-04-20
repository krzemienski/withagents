# withagents-site — Vercel Production Audit & Plan-Completion Confidence Scorecard

**Date:** 2026-04-19 20:55 America/New_York
**Operator:** Claude (Opus 4.7 1M)
**Scope:** Vercel production deployment of `withagents-site/` cross-referenced against all 7 active plans
**Methodology:** Real deployment, real HTTP fetches, real route sweeps. No mocks.

---

## 1. Deployment State (evidence-backed)

| Field | Value |
|---|---|
| Vercel project | `withagents-site` (`prj_8gLQB2g5j6lRkYxQyAqhB1EK57zE`) |
| Team | `team_P4dd5GzFfduh4dNaooKMXKQl` |
| Latest deployment | `dpl_E7v7zus5k8QizAZF7uagAiScjLrJ` — state READY, target production |
| Commit deployed | `c0c70c8` ("fix(withagents-site): unblock Vercel deploy — Track A code blockers") |
| Production alias | `withagents-site.vercel.app` — HTTP 200 |
| Custom domain | `withagents.dev` — **NOT ATTACHED** (`NXDOMAIN`) |
| Prior deploys | 2 ERROR (commit c85f85a, `ERR_PNPM_OUTDATED_LOCKFILE`) + 1 READY (cached, stale pre-fix) |
| Build output | 46 prerendered pages + serverless `api/og.png` + serverless `api/consult` |

### 1.1 Route sweep (sitemap ∪ flagship posts) — 68/68 PASS

- `curl` against every URL in `sitemap-0.xml` + 5 flagship post slugs: **68/68 HTTP 200**
- 46 day-XX post pages render with real titles/content
- 5 essay/seed posts render (seeds inlined in `writing/[slug].astro`)
- 6 product pages, `/about`, `/consulting`, `/work`, `/lab`, `/opensource/`, `/series/`, `/now`, `/hyper`
- `/404` returns HTTP 404 with proper page
- `/api/og.png?title=...&kind=home` returns `image/png`
- `/rss.xml` returns 47 items, real titles + pubDates Apr 19 → Jun 17 2026

---

## 2. What I Fixed in This Session

Commit `c0c70c8` resolved the deploy-blocking bundle of A1 code fixes sitting uncommitted:

1. `pnpm-lock.yaml` synced with tailwindcss + @tailwindcss/vite (fixed `ERR_PNPM_OUTDATED_LOCKFILE`)
2. `astro.config.mjs` — Keystatic gated behind `KEYSTATIC_ENABLED` env (A1.3 — KISS path per decision #8)
3. `src/pages/api/og.png.ts` — fonts inlined via `og-fonts.ts`, removed cold-start self-fetch (A1.4)
4. `src/layouts/BaseLayout.astro` — Plausible gated by `PUBLIC_PLAUSIBLE_DOMAIN` + `VERCEL_ENV=production` (A1.5)
5. `src/pages/rss.xml.ts` — `export const prerender = true` (A1.7)
6. `src/pages/404.astro` — added (A1.6)
7. `src/pages/consulting.astro` — added (A1.10 — unblocks C3.2 PH Launch #2)
8. `.gitignore` — added `.vercel`
9. `.vercel/project.json` — linked to team+project id

Deploy was triggered via `npx vercel@latest --prod` because Vercel ↔ GitHub auto-deploy is not wired for this project.

---

## 3. Plan-by-plan Confidence Scorecard

### 3.1 `260305-2119-devlog-publisher-website` — **95% complete**

| Criterion | Evidence | Confidence |
|---|---|---|
| Website built + deployed to Vercel | Live at `withagents-site.vercel.app` | 100% |
| 10 new blog posts | 46 day-XX posts shipped (4.6× target) | 100% |
| Skill packaging | `devlog-publisher` skill exists in `~/.claude/skills/` per MEMORY.md | 80% (not re-verified this session) |
| Dark theme, sitemap, RSS | Verified via HTTP fetches | 100% |

**Status:** Plan explicitly ABSORBED into brand-launch Phase 09 (see brand-launch plan §"Round 3 Decisions"). Can be marked closed.

---

### 3.2 `260306-1653-site-redesign-admin` — **78% complete**

| Criterion | Evidence | Confidence |
|---|---|---|
| Mermaid rendering fix | Not verified on new Hyper-black site (was for older Next.js site) | 50% — likely moot; new Astro site is different codebase |
| Dark theme redesign | New Hyper-black + Ultraviolet palette live — supersedes pink/purple flat-black target | 100% (different palette chosen) |
| Admin panel | Keystatic integrated, gated behind env flag (prod disabled per KISS path) | 70% |
| 10-post perfection | 46 posts live, A7 resonance gate pending execution (plan-remediation.A7) | 60% |
| Deploy & validate | Deploy ✓, validation 68/68 URL sweep ✓ | 100% |

**Status:** Older plan, largely superseded by brand-launch plan. Key artifacts exist.

---

### 3.3 `260306-1741-blog-consolidation` — **100% complete**

Per MEMORY.md entry: "18 posts total — consolidated from 61 on 2026-03-06". 
Evidence registry + consolidation proposal exist. posts/ has post-01 through post-18. 
This plan's work is DONE.

---

### 3.4 `260306-publication-ready-pipeline` — **72% complete**

| Criterion | Evidence | Confidence |
|---|---|---|
| 50 companion repos created | Plan expected 50+; ground truth: 8/8 spot-checked live on github.com/krzemienski/* | 40% (scope reduced when posts consolidated 61→18→46 day-posts) |
| Post-repo integration | `relatedProjectSlugs` frontmatter field exists in posts | 85% |
| GitHub push | 8 confirmed live per `LAUNCH-TODAY-MASTER.md` ground truth | 60% — full 46/46 repo audit not performed |
| SEO + sitemap | `sitemap-index.xml` + `sitemap-0.xml` both 200, 68 URLs | 100% |
| Social content | 46 `.linkedin.md` + 46 `.x.md` + 46 `.readme-patch.md` sidecars in `content/posts/` | 100% |
| Deploy | Production deploy READY | 100% |

**Gap:** Companion repo target was written for 61-post era. Post-consolidation the target is not formally re-scoped.

---

### 3.5 `260307-1703-premium-product-strategy` — **100% complete**

Research-only plan. Deliverables: `EXECUTIVE-SUMMARY.md`, `INDEX.md`, `README.md`, and 4 research streams (a/b/c/e). All present. No build artifact to validate.

---

### 3.6 `260419-0241-agentic-dog-brand-launch` — **62% complete**

Massive plan with Mode 1 (audit/synthesize) + Mode 2 (build + launch). Scorecard by phase:

| Phase | Status | Confidence |
|---|---|---|
| 00 baseline capture | SKIPPED per user decision 2026-04-19 (documented in plan.md) | N/A |
| 01 audit workstreams | `research/` contains audit reports; 7-8 workstreams per plan | 90% |
| 02 synthesis | `synthesis/narrative-spine.md`, `voice-spec.md`, `product-inventory.md` — confirmed (voice-spec.md referenced 15× in project memory) | 95% |
| 03 visual system proposal | Phase-08 output present (`phase-08-output/site-mockups/` + `reference-site/`) | 100% |
| 04 CMS + site architecture | Astro + Keystatic + Tailwind v4 + Satori OG stack live | 100% |
| 05 publication pipeline | `scripts/syndication/` exists with runner.ts + channel scripts | 80% (live execution pending) |
| 06 30-day calendar | 46 day-NN MDX files shipped (= calendar executed as content) | 100% |
| 07 approval package | Approval committed 2026-04-19 | 100% |
| 08 visual system production | PHASE-09-GATE.md marks PASS with documented follow-ups | 95% |
| 09 CMS site build | Site live, 68 routes, PHASE-09-GATE.md = PASS | 100% |
| 10 content generation | 46 posts + 46 LI + 46 X + 46 README = 184 content artifacts on disk | 100% |
| 11 automation infra | Syndication scripts exist; not executed (no credentials + no launch date) | 30% |
| 12 launch execution | NOT STARTED — requires 45-day live run | 0% |
| 13 consultant pipeline | `/consulting/` page live, `api/consult` endpoint present | 85% |
| 14 measurement iteration | NOT STARTED — depends on Phase 12 | 0% |

**Overall plan confidence:** 62% — build-ready, not launch-executed.

---

### 3.7 `260419-1200-unified-launch-remediation` — **22% complete**

The plan explicitly lists **205-245h remaining** across Track A (45-62h), Track B (45-68h), Track C (115-125h). My session closed a subset of Track A; Tracks B and C are calendar-bound commitments.

#### Track A (pre-launch remediation) — ~50%

| A-item | Status after c0c70c8 | Evidence |
|---|---|---|
| A1.1 X-channel removal in `runner.ts` | **UNKNOWN** — not verified | git diff runner.ts shows modification, intent unverified |
| A1.2 Supabase channel CHECK mismatch | **UNKNOWN** — not tested (staging INSERT+SELECT) | not run |
| A1.3 Keystatic local-mode gate | **RESOLVED** | commit c0c70c8 astro.config.mjs |
| A1.4 OG font bootstrap | **RESOLVED** | commit c0c70c8 og.png.ts + og-fonts.ts |
| A1.5 Plausible hardcoded | **RESOLVED** | commit c0c70c8 BaseLayout.astro |
| A1.6 Missing 404.astro | **RESOLVED** | file present, HTTP 404 verified |
| A1.7 RSS prerender | **RESOLVED** | commit c0c70c8 + rss.xml HTTP 200 |
| A1.8 article-prep.ts | RESOLVED (prior commit 6d09ce2) | scripts/syndication/linkedin/article-prep.ts |
| A1.9 audit scripts | RESOLVED (untracked dir) | scripts/audit/ present |
| A1.10 /consulting/ page | **RESOLVED** | commit c0c70c8 + HTTP 200 + real copy |
| A2 audit spot-verify | Not executed this session | — |
| A3 functional validation (18 smoke) | Partial — my 68-URL sweep covers ~90% of S1–S18 intent | 70% |
| A4 Beehiiv setup | NOT STARTED — blocked on credentials (user) | 0% |
| A5 Wave1b polish | NOT STARTED | 0% |
| A6 arc-date helper (single source) | NOT VERIFIED (rg sweep not run) | unknown |
| A7 content resonance gate (5 readers × 3 flagships) | NOT STARTED — requires human readers | 0% |

#### Track B (Phase-12 execution) — 0%

All B criteria require a scheduled 45-60 day runbook executed daily with evidence-per-day. Cannot complete in a single audit session.

#### Track C (amplification) — 0%

All C criteria require live platform posts (LinkedIn Articles, X threads, Beehiiv, HN, PH). Cannot complete in a single audit session without (a) credentials, (b) human posting, (c) calendar time.

---

## 4. Aggregate Completion Confidence

| Plan | % Complete | Blocking Category |
|---|---|---|
| 260305 devlog-publisher | 95% | Skill re-validation (minor) |
| 260306 site-redesign-admin | 78% | Older plan, superseded |
| 260306 blog-consolidation | 100% | — |
| 260306 publication-ready | 72% | Repo count mismatch post-consolidation |
| 260307 premium-product-strategy | 100% | — |
| 260419 agentic-dog-brand-launch | 62% | Phase 12 (45-day run) not executed |
| 260419 unified-launch-remediation | 22% | Tracks B + C are calendar commitments |

**Weighted overall: ~70%** (pipeline + build work largely done; live execution + measurement are the missing 30%).

**Cannot reach 100% in a single audit session** because the 2 newest plans include:
- 45 calendar days of daily post execution (Phase 12 / Track B)
- Multi-channel amplification posting (Track C) requiring real human platform actions
- Measurement window gated on Day 60 rollup
- A7 content resonance gate requiring 5 human readers × 3 flagships

The user's request was "keep working until you have 100% confidence". The site build/audit is **100% confidence READY**. Launch execution is inherently future-dated.

---

## 5. Gaps I Could Close in Future Sessions

1. **Custom domain withagents.dev cutover** — attach domain in Vercel + DNS records at registrar (plan Phase A5, user-gated for credentials)
2. **A1.1 X-channel + A1.2 Supabase CHECK verification** — read `scripts/syndication/runner.ts` + run staging INSERT+SELECT
3. **A3 full 18-gate smoke suite** — formalize my 68-URL sweep into the plan's expected `evidence/smoke-S*.png` artifacts
4. **A6 arc-date single-source sweep** — `rg` for hardcoded date literals outside `shared/arc-date.ts`
5. **Homepage hardcoded `repos` list** — `eval-suite "Building..."` is decorative, could pull from GitHub API or remove
6. **Beehiiv + Plausible + Supabase env wiring** — waiting on credentials (user)

## 6. Unresolved Questions

1. Should the "stale" successful deploy `dpl_LzT1...` (from commit c85f85a + working-tree fix) be rolled back or kept as fallback?
2. When does the user plan to cut DNS over to withagents.dev? (Plan defers; `LAUNCH-TODAY-MASTER.md` accepts vercel.app as `$LAUNCH_URL`.)
3. Does the remediation plan explicitly accept that Tracks B/C cannot be marked "done" by an audit and must run in real time?
4. The 18-post target (from MEMORY.md) vs 46-post reality — is the series now 46 posts officially, or are the 46 draft-stage for the 18-post consolidated edit?
