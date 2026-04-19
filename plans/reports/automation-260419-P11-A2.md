# Phase 11 / Agent P11-A2 — X Thread Adapter Implementation Report

**Date:** 2026-04-19
**Agent:** fullstack-developer (a0223823ad375676a)
**Phase:** 11 — Automation Infra (X API v2 thread adapter)
**Status:** COMPLETED

---

## Files Created

| File | Lines | Purpose |
|---|---|---|
| `scripts/syndication/x/types.ts` | 84 | All TypeScript types: `Tweet`, `XThread`, `PostedThread`, `RateLimitState`, `XClientConfig`, `XEnv`, `UtmParams` |
| `scripts/syndication/x/parser.ts` | 202 | `.x.md` parser — frontmatter, tweet header extraction, char validation, UTM URL builder |
| `scripts/syndication/x/rate-limiter.ts` | 155 | Token-bucket limiter with exponential 429 backoff |
| `scripts/syndication/x/thread.ts` | 175 | Orchestrator: env validation → parse → inject UTM → post chain → return `PostedThread` |
| `scripts/syndication/x/README.md` | 143 | Invocation docs, env contract, format spec, integration points |
| `scripts/syndication/x/tsconfig.json` | 16 | `NodeNext` strict tsconfig pointing at site's `twitter-api-v2` types |

---

## Tasks Completed

- [x] `types.ts` — `Tweet`, `XThread` (daySlug nullable), `PostedThread`, rate-limit and config types
- [x] `parser.ts` — full `.x.md` format spec defined + enforced; dual filename patterns (`day-NN-{slug}.x.md` and `{slug}.x.md`); fail-fast collects all errors before returning; Unicode-aware char counting
- [x] `rate-limiter.ts` — token bucket, 24h refill, 429 backoff (exponential + API reset header), 5 retries, token return on 429
- [x] `thread.ts` — env validation at boundary, fail-fast pre-flight validation, UTM injection on tweet 1 with post-injection ≤280 check, 500ms inter-tweet pause, `postThread()` + `validateThreadFile()` public API
- [x] `README.md` — env contract, format spec, CLI invocation, rate-limit behavior, Phase 11 integration points
- [x] TypeScript strict mode clean (zero errors)

---

## Tests Status

- Type check: **PASS** (zero errors, `tsc --noEmit --strict` via site's TypeScript 5.x)
- Unit tests: N/A — Phase 11 = code only, no live API calls per constraints. Functional validation deferred to Phase 12 with real credentials.
- Integration tests: deferred (requires `X_API_KEY` / `X_API_SECRET` credentials — approved just-in-time at Phase 11 kickoff per plan decision 8)

---

## Design Decisions

**Dual filename support.** Plan spec says `day-NN-{slug}.x.md`; the existing LinkedIn adapter uses `{slug}.linkedin-short.md`. Parser accepts both — `daySlug` is `string | null`, null when no `day-NN` prefix. This keeps Phase 10 content generation flexible without breaking the scheduler's calendar-driven lookup.

**Fail-fast validation.** `parseThreadFile()` collects ALL errors (char counts, frontmatter, ordering, length bounds) before returning. No orphaned threads from mid-chain failures caused by input problems.

**UTM injection.** Parser returns the raw tweet text; `thread.ts` injects the UTM URL at post time (not in the source file). Tweet 1 body validated ≤257 chars to accommodate the 23-char t.co URL. If tweet 1 already contains a URL, injection is skipped.

**Token return on 429.** The rate limiter returns the consumed token when a 429 fires so the bucket count stays accurate across retries.

**Inter-tweet pause (500ms).** Added between sequential posts as a courtesy to the API, not part of the rate limit. Prevents burst-rejection edge cases on the Basic tier.

---

## Issues / Discrepancies Found

**Tier pricing discrepancy.** The plan references X API paid tier at $100/mo. The `x-twitter-workflow.md` skill file documents Basic tier at **$200/mo** (50 tweets/day). Documented in `README.md` with a verification note. The `X_DAILY_TWEET_CAPACITY` env var defaults to 50 (Basic tier cap) and is overridable. Decision whether to upgrade to Basic ($200/mo) or stay manual remains with the user per plan decision 9.

**`twitter-api-v2` package location.** No `node_modules` in `scripts/`. The package lives at `site/node_modules/twitter-api-v2`. The `tsconfig.json` paths alias resolves types from there. Runtime invocation (via `pnpm tsx`) will need the same resolution — either install `twitter-api-v2` in a `scripts/package.json` or invoke from `site/` context. Noted in README Phase 11 integration points.

---

## Next Steps

- Phase 10 content generation should produce `.x.md` sidecar files following the spec in `parser.ts` (frontmatter + `<!-- Tweet N [NN chars] -->` blocks)
- Phase 11/A3 (Supabase): wire `PostedThread` results into `syndication_log` table (schema already exists at `scripts/syndication/supabase/schema.sql`)
- Phase 11 runner: instantiate one `RateLimiter` per process, offset thread post +6h from blog publish (per phase-05 cadence rule)
- Install `twitter-api-v2` in scripts context: `pnpm add twitter-api-v2` from `scripts/` or root

---

**Status:** DONE
**Summary:** X thread adapter implemented in 5 TypeScript files, strict typecheck clean. Parses `.x.md` sidecar files, validates all tweets pre-post, posts as reply chain via `twitter-api-v2`, rate-limits with token bucket + 429 backoff.
**Concerns:** Tier pricing discrepancy ($100/mo in plan vs $200/mo actual) — flagged in README, not blocking code correctness.
