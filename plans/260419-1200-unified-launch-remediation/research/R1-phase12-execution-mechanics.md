# R1 — Phase 12 Execution Mechanics

**Report ID:** researcher-260419-1202-phase12-execution-mechanics
**Scope:** Day-by-day runbook for Phase 12 (45–60 day push).
**Sources verified:** syndication/scheduler + linkedin + x + readme-patcher + supabase, synthesis/approval-package.md §9/§12/§13, synthesis/calendar-45day.md, withagents-site/src/pages/work.astro + api/consult.ts.
**Missing:** No `phase-12-launch-execution.md` exists. No `ckm-audit-cohort{1,2,3}` reports exist. `.launch-date` not created. `.syndication-state.json` not initialized.

---

## 1. What exists vs. what's missing

### Exists (verified, code-level)
- `scripts/syndication/scheduler/runner.ts` — `--day N` / `--today` / `--dry-run` / `--channel {linkedin|x|readme}` / `--launch-date`. Re-entrant via `.syndication-state.json`. Dispatches 3 channels: linkedin (manual paste), x (content-readiness check only, queue-backed), readme (gh clone + inject + push).
- `scripts/syndication/scheduler/cron.schedule` — `0 8 * * *` daily, `npx --yes tsx ... --today`, logs to `~/Library/Logs/syndication-runner.log`. Requires `~/.syndication.env` + `.launch-date` + `gh auth login`.
- `scripts/syndication/linkedin/article-prep.ts` — reads `posts/<slug>/<slug>.linkedin.md`, writes `.linkedin-article-prep.md`, opens browser to `linkedin.com/pulse/new-article/?title=...`. MDX/JSX/mermaid stripped.
- `scripts/syndication/linkedin/share.ts` + `oauth.ts` — short feed posts ARE scriptable (UGC API) but **calendar-45day.md row 17 removes LinkedIn Shorts**. `share.ts` unused for 45-day push.
- `scripts/syndication/x/thread.ts` + `parser.ts` + `rate-limiter.ts` — OAuth 1.0a, parses `day-NN-{slug}.x.md` (7–12 tweets with `<!-- Tweet N [NN chars] -->` markers + YAML frontmatter `canonical_url`/`utm_campaign`), posts reply chain, returns `rootTweetUrl`.
- `scripts/syndication/readme-patcher/patcher.ts` — `gh repo clone <owner>/<repo> --depth 1`, idempotent marker-block `<!-- withagents-featured-start -->...-end -->`, commits `docs: add withagents.dev "Featured in" section`, pushes default branch.
- `scripts/syndication/supabase/schema.sql` — `syndication_log(slug, channel, status, posted_at, response_url, error_message, retry_count)`. Channel check: `linkedin_short|linkedin_article|x_thread|readme_patch`. **BUG:** runner.ts line 387–395 inserts raw channel names `linkedin|x|readme` — violates CHECK constraint. Fix pre-push.
- `withagents-site/src/pages/work.astro` — server-side UTM capture (`utm_source`/`utm_medium`/`utm_campaign`), surfaces `?error=...` query.
- `withagents-site/src/pages/api/consult.ts` — POST form → zod validate → Supabase `consultant_inquiries` insert → Resend email → 303 Calendly redirect. **Required env:** `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`, `NICK_INQUIRY_EMAIL`, `CALENDLY_URL`.

### Missing / gaps
- No `phase-12-launch-execution.md` — Phase 12 spec lives scattered across approval-package §9/§12/§13 and calendar-45day.md.
- No `ckm-audit-cohort{1,2,3}-260419.md` reports in repo. Referenced in the prompt but not present.
- No `consultant_inquiries` table in any schema — must be created alongside `syndication_log`.
- No Plausible install marker in any Astro file (grep clean).
- No OG-image smoke test; `PHASE-08-GATE.md` and `PHASE-09-GATE.md` exist in phase outputs but not read.
- No `companion-repo` directory mapping — runner resolves `repoReadme` from the calendar cell directly. Verify cell values match real GitHub repo slugs under `krzemienski/`.
- `runner.ts` X channel is **readiness-only** (line 254–304). It does NOT call `postThread()`. The actual X post is expected to fire via "publish-scheduled.js Supabase queue" — that file is **not in the syndication tree**. Either wire `runner.ts` to call `postThread()` directly, or build the queue publisher before Day 1. **BLOCKER.**
- `runner.ts` LinkedIn path prints article body to stdout but doesn't invoke `article-prep.ts` (doesn't open browser, doesn't write prep file). Either wire them or run `article-prep.ts` separately each day. **Friction item.**
- `calendar-loader.ts` reads markdown table, but calendar-45day.md has **multiple tables** and annotations between rows — loader line 123 explicitly does NOT break on non-pipe lines. Risk of parsing garbage. **Smoke-test required Day -2.**

---

## 2. Day -10 to Day -1 pre-push checklist

Two classes: **user-only** (U) and **agent-executable** (A).

### Day -10 (decisions due)
- [ ] **U — CCB canon decision.** Pick one of `claude-code-builder` (21⭐) / `autonomous-claude-code-builder` / `claude-code-builder-agents-sdk`. Calendar row 10 assumes `claude-code-builder`.
- [ ] **U — withagents-skills 10-skill list** for Day 35 package. Calendar rows 34/36/37/38/39/40 assume: devlog-publisher, functional-validation, ck-plan, visual-explainer, deepen-prompt-plan, ai-dev-operating-system + 4 unnamed.
- [ ] **U — X API tier activation.** Approval-package §15 says $100/mo; x/README.md says Basic is **$200/mo** (conflict — verify at developer.x.com). Required for any X posting. `X_DAILY_TWEET_CAPACITY=50` default is Basic.

### Day -7 (repo liveness)
- [ ] **U — Ralph-orchestrator liveness.** Confirm `github.com/krzemienski/ralph-orchestrator` live. Calendar row 22 blocks if not.
- [ ] **A — Repo-slug dry-run audit.** For every calendar row with `repoReadme` set, run `gh repo view krzemienski/<slug> --json name,visibility` — list 404s. (~30 slugs.)
- [ ] **A — Shannon ecosystem verify.** `shannon-framework`, `shannon-cli`, `shannon-mcp`, `shannon-cc` — row 15–18. shannon-mcp flagged abandoned in R3, re-scoped active in R4.
- [ ] **U — blog-series NO-REMOTE fix.** Push `blog-series` to GitHub target repo. Decision still open (§15).

### Day -5 (content gate)
- [ ] **A — Flagship quintet voice-reviewed.** Days 1, 10, 22, 35, 50 must have Opus model-different review logged to `reports/voice-review-day-{NN}-{slug}.md`.
- [ ] **A — 3 reserve insight posts drafted.** Reserve A (Insight 1 9.6:1), B (Insight 11 $47 bill), C (Insight 13 phone-to-desktop).
- [ ] **A — Sidecar audit.** For days 1–14 confirm `withagents-site/src/content/posts/day-NN-*.linkedin.md`, `.x.md`, `.readme-patch.md` all present. runner.ts line 218–229 silently `skipped` on missing files.

### Day -3 (infra smoke)
- [ ] **A — `calendar-loader.ts` smoke test.** `pnpm tsx scripts/syndication/scheduler/runner.ts --day 1 --dry-run` and `--day 60 --dry-run`. Confirm all 54 content days parse without error.
- [ ] **A — `patcher.ts` dry-run** on Day 1's target (validationforge). Confirms `gh auth`, marker injection output.
- [ ] **A — `article-prep.ts` smoke** for day-01 slug with `NO_BROWSER=1`. Confirms MDX strip + file written.
- [ ] **A — Fix `syndication_log` channel-name bug** in `runner.ts:387`. Map `linkedin`→`linkedin_article`, `x`→`x_thread`, `readme`→`readme_patch`, and `ok`→`posted`. Schema will reject otherwise.
- [ ] **A — Decide X dispatch path.** Either (a) replace `runner.ts:254–304` body with `import { postThread } from "../x/thread.js"` call, or (b) stand up the missing queue publisher. Option (a) is simpler. **Recommended.**

### Day -2 (ops infra)
- [ ] **U — `~/.syndication.env`** populated: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`, `GH_OWNER=krzemienski`. `chmod 600`.
- [ ] **U — `.launch-date`** file in repo root: `echo "YYYY-MM-DD" > /Users/nick/Desktop/blog-series/.launch-date`.
- [ ] **A — Crontab installed** per `cron.schedule`. Confirm `REPO_ROOT=/Users/nick/Desktop/blog-series`.
- [ ] **A — Supabase schema apply.** `psql "$DATABASE_URL" -f scripts/syndication/supabase/schema.sql` + `consultant_inquiries` table DDL (**gap — does not exist in repo**).
- [ ] **A — Plausible `<script>` tag** added to `withagents-site/src/layouts/BaseLayout.astro`. Verify DNS goal tracking for `/work` form submit.
- [ ] **A — `/api/consult` env vars wired on Vercel.** Submit test inquiry from prod URL → verify Supabase row + Resend email + Calendly redirect.

### Day -1 (go/no-go)
- [ ] **A — DNS live** for `withagents.dev`; all 60 post routes resolve 200 (`curl -I`).
- [ ] **A — OG image renders** for 3 random slugs (Satori + 1MB Edge bundle check).
- [ ] **A — Day-1 flagship (validationforge) README retitle pushed.**
- [ ] **U — Final go/no-go** — confirms push starts 08:00 tomorrow.

---

## 3. Day-by-day execution playbook

**Invocation model (unattended):** cron fires runner.ts `--today` at 08:00. Runner dispatches readme + writes LinkedIn body to stdout (logged). User then runs `pnpm tsx scripts/syndication/linkedin/article-prep.ts day-NN-<slug>` which opens browser for manual paste (~5 min). X channel fires `postThread()` automatically **after runner.ts:254 patch** (see Day -3 gap). Time to publish: ~5 min user attention per day.

**Per-day verification (all days):**
1. `curl -I https://withagents.dev/writing/day-NN-<slug>` → 200
2. Capture LinkedIn Article URL manually into `.syndication-state.json` extension (recommend add `response_url` field to state).
3. Capture X root tweet URL from `postThread()` return → auto-logged to Supabase if channel patch applied.
4. `gh api repos/krzemienski/<slug>` → confirm commit SHA matches patcher output.
5. Plausible: daily visitor delta captured into `reports/metrics-day-NN.json` via `gh api` nightly job (missing — **gap**).

### Days 1–7 (Week 1: VF + mode-axis setup)

| Day | Publish | Dispatch | Pre-fire check | Post-fire verify | Kill-switch |
|---|---|---|---|---|---|
| 1 | ValidationForge GA (FLAGSHIP, `day-01-validationforge-ga`) | `runner --day 1` + `article-prep day-01-...` | Day -1 gate passed; `validationforge` repo retitled | blog 200; LI Article URL; X root URL; `validationforge` commit SHA | — |
| 2 | Multi-Agent Consensus | `runner --day 2` | `multi-agent-consensus` repo live | 4-URL capture | — |
| 3 | Insight 5 "9.6:1 read-to-write" | `runner --day 3` | no repo README (insight day) | blog + LI + X URLs | — |
| 4 | Orchestration Topology (meta) | `runner --day 4` | no repo | blog + LI + X URLs | — |
| 5 | Auto-Claude Worktrees | `runner --day 5` | `auto-claude-worktrees` repo live | 4-URL capture | — |
| 6 | OFF-DAY | none (runner short-circuits `isOff`) | — | reply to comments only | — |
| 7 | Ralph teaser | `runner --day 7` | `ralph-loop-patterns` repo live | 4-URL capture | — |

**End-of-week-1 metric capture target:** cumulative visitors (Plausible), LinkedIn delta, X delta, flagship stars (VF).

### Days 8–14 (Week 2: CCB flagship arc)

| Day | Publish | Pre-fire check |
|---|---|---|
| 8 | Insight 6 "consensus caught P2" | — |
| 9 | iOS Streaming Bridge | `claude-ios-streaming-bridge` live |
| **10** | **CCB Evolution FLAGSHIP** | CCB canon pick pushed; retitled; 21⭐ intact |
| 11 | CCBios iOS CCB | `ccbios` or `ccbios-enhanced` live (Day -5 decision) |
| 12 | Claude SDK Bridge | `claude-sdk-bridge` live |
| 13 | ClaudeCodeSDK | `ClaudeCodeSDK` live (case-sensitive repo slug — verify) |
| 14 | Claude Prompt Stack | `claude-prompt-stack` live |

**Day 10 kill-switch check:** approval-package §12 → `inquiries=0 AND LinkedIn<+5% AND flagship_stars<+10` → **24h pause + content-quality review + cut remaining calendar 40%** OR pivot. Gate runs EOD Day 10 against Plausible + manual LI/X follower count + `gh api repos/<flagships> --jq .stargazers_count` sum.

### Days 15–21 (Week 3: Shannon + memory/mining)

Days 15–18 Shannon ecosystem (framework/cli/mcp/cc). Day 19 claude-mem. Day 20 session-insight-miner. Day 21 Insight 4 "81%". All standard 4-channel dispatch. Row-21 no-repo.

**Pre-week gate:** shannon-mcp GitHub state verified Day -7 (flagged abandoned R3).

### Days 22–29 (Week 4: Ralph arc + methodology — heavy, 45h)

| Day | Publish | Pre-fire |
|---|---|---|
| **22** | **Ralph Orchestrator origin FLAGSHIP** | `ralph-orchestrator` live (Day -7 verify) |
| 23 | Ralph Orchestrator iOS | `ralph-orchestrator-ios` exists as SEPARATE repo OR post-23 folds into post-24 |
| 24 | RALPH Protocol | `ralph-loop-patterns` canonical |
| 25 | Sequential-Thinking Debug | `sequential-thinking-debugging` live (post-13 em-dash trim committed) |
| 26 | Multi-Agent Merge | `multi-agent-merge-orchestrator` live |
| 27 | Playwright Validation | `playwright-validation-pipeline` exists? — verify Day -5 |
| 28 | Kaizen | `kaizen-algorithm-tuning` exists? — verify Day -5 |
| 29 | Agent Constitution | `agent-constitution-framework` exists — already in Desktop untracked |

**Day 20 kill-switch check:** `inquiries<2 AND flat engagement` → finish current-week, skip 3rd flagship if manifesto not drafted, redirect to inbound follow-up. Gate runs EOD Day 20.

### Days 30–33 (REST WEEK)

| Day | Action |
|---|---|
| 30 | OFF (runner short-circuits) |
| 31 | Devlog only — `runner --day 31 --channel linkedin` + manual X thread "mid-push shipping diary" |
| 32 | OFF |
| 33 | OFF |

**Runner note:** Day 31 `dayType=Devlog`, calendar cells `repoReadme="—"`, so readme channel returns `skipped`. Only LI + X fire.

### Days 34–40 (Week 5: Skills + Day 35 flagship)

Day 34 devlog-publisher skill. Day 35 **withagents-skills package FLAGSHIP** (requires `withagents-skills` repo created + first release tagged pre-Day 30; R4 §12 risk gate: "if not ≥80% by Day 30, manifesto-only fallback"). Days 36–40 remaining skill spotlights.

**Risk:** readme-patcher points at `claude-code-skills-factory` for rows 34/36-39 and `ai-dev-operating-system` for row 40, and **`withagents-skills` only** for row 35. If the package repo isn't created, runner returns `error` on row 35 — blocks state file but does NOT halt the cron. Re-run manual after repo exists.

### Days 41–49 (Week 6: product cluster)

Row-by-row product posts. Each requires companion repo existence (Day -5 slug audit). Row 48 combines `ai-digest` + `ai-digest-apps-worker` (two README patches — **patcher.ts only handles one repo per patch file**. Fix: two patch files per day OR extend calendar cell parser — **gap**). Same issue row 49 (`github-to-audio-pipeline` + `agent-sdk-podcast-gen`), row 41 (three awesome-list repos).

**Workaround:** pre-stage `day-NN-*-1.readme-patch.md` and `day-NN-*-2.readme-patch.md` + run `patcher.ts --patch <file>` twice manually. Runner resolves only the first match (`resolvePatchFile` line 169–180 uses `find`).

### Day 50 (FLAGSHIP finale)

3-in-1 day: SessionForge milestone + Code Stories dual-SKU + closing manifesto. Blog post is 3-part (2,400w). LinkedIn Article = manifesto-only. X thread = 45-day arc synthesis. 3 READMEs to patch (`sessionforge`, `code-tales`, `code-tales-platform`).

**Risk (calendar §Risk Gates):** if Day 48 voice review flags overload → split SF to Day 49, Code Stories to Day 51, manifesto-only Day 50.

### Days 51–60 (Week 8 optional extension)

Existing-post light-edits (days 53–55, 58–59). Row 56 ILS-iOS **conditional** on Day 54 pickup — otherwise Reserve C swap-in. Row 57 Remodex conditional on naming — otherwise Reserve B. Row 60 retro devlog.

**Runner support:** none for reserve swap-in. Manual: overwrite `day-56-*.linkedin.md` etc. with reserve content, reset `.syndication-state.json` day-56 entry, re-run `--day 56`.

---

## 4. Monitoring dashboard requirements

**Metrics (daily 23:55 capture → `reports/metrics-day-NN.json`):**
- Plausible uniques + top pages (API — needs `PLAUSIBLE_API_KEY`).
- LinkedIn followers + per-Article reactions/comments (manual count; no API for personal-profile follower delta).
- X followers + thread impressions (API v2 `/users/by/username/:me` — Basic tier includes).
- Flagship repo stars delta: `gh api repos/krzemienski/{validationforge,claude-code-builder,ralph-orchestrator,withagents-skills,sessionforge,code-tales,code-tales-platform} --jq .stargazers_count`.
- Supabase: `consultant_inquiries` count where `created_at > day_start`.

**Capture script (missing — build Day -3):** `scripts/metrics/daily-capture.ts` → writes `reports/metrics-day-NN.json` + appends to `reports/metrics-rollup.csv`.

**Alert triggers (pause-condition automation):**
- Day 10: `inquiries=0 && LI_delta<5% && flagship_stars<+10` → post to console + block next cron run via state file sentinel.
- Day 20: `inquiries<2` → same.
- 2 consecutive missed publish days: detect via `syndication_log` where `status IN ('error', 'exhausted')` for consecutive days → 48h pause.
- Authenticity backlash: **manual** flag only (no automated detection).

---

## 5. Failure-mode playbook

| Failure | Detection | Rollback / Mitigation |
|---|---|---|
| Runner 08:00 cron fails (e.g. network) | Missing row in `syndication_log` for today | Manual `npx tsx runner.ts --today` anytime Day-of. Re-entrant. |
| LinkedIn Article publish UI changes / `?title=` query deprecated | Browser opens to blank/error editor | Fallback: copy title + body from `.linkedin-article-prep.md` manually; target URL in file footer. |
| X API 429 sustained | `rate-limiter.ts` exponential backoff 60→960s then throws after 5 retries | Runner logs `error`. Replay next day: `runner --day N --channel x`. At 50/day cap + ≤4 threads/day, sustained 429 is tier-change or suspension. |
| X API key revoked / account flagged | `postThread()` throws 401 | Halt X channel: `runner --channel linkedin,readme` (filter supports single channel — to dispatch 2, run twice). LI + README continue. Fix X out-of-band. |
| Patcher push rejected (branch protection / auth) | `git push` exit non-zero in `patcher.ts:238` | State records `error`. Patch file kept in `.readme-patch.md`. Manual: `cd /tmp/readme-patch-<slug>-*/ && git push` OR re-run after branch-protection fix. |
| Companion repo has no README | `resolveReadme` falls through → creates new README.md with only the Featured block | Acceptable — first-time launch. |
| `consultant_inquiries` form flooded / spam | Supabase insert spikes; Resend email flood | Add Cloudflare Turnstile to `ConsultForm.astro` (~30 min). Throttle Resend destination via email filter. Worst case: disable `/api/consult` route (Vercel env var `DISABLE_CONSULT=1` — **missing, add Day -3**). |
| Voice-drift backlash on specific post | Manual monitor | Retract: unpublish LI Article (manual UI), delete X thread, revert blog commit. 24h pause. Voice-guardrail patch before next publish. |
| Day-N publish mid-fire fails (network during `patchRepo`) | Partial state: LI `ok`, X `ok`, readme `error` | Next cron (or manual re-run) picks up readme only (re-entrancy: `"ok"` skipped). Idempotent marker injection = no duplicate. |
| Flagship repo rename mid-push | `patcher.ts` 404 on `gh repo clone` | Update calendar row's `repoReadme` cell + re-run `--day N`. Calendar is source of truth. |
| `.syndication-state.json` corrupted | `loadState` line 120 warns + starts fresh | Safe — next run rebuilds. But Days already-`ok` will re-dispatch → idempotent for readme, but LinkedIn/X will duplicate. **Backup state file daily to Supabase** (missing — recommend `state-backup.sql` hook). |
| CCB flagship canon wrong pick | Post ships with wrong repo Featured-in block | Revert block via `patcher.ts` targeting correct repo. Update blog post inline. Explain in Day 31 devlog. |

---

## 6. Open items requiring user action

1. **Decisions still unresolved (approval-package §15 R4 open 3):** Day-1 real date, X API thread-count trigger, blog-series push-to-GitHub timing.
2. **CCB canon pick** (Day -10 hard gate).
3. **withagents-skills repo created + first release** (Day -10 → Day 30 gradual).
4. **Ralph-orchestrator liveness** (Day -7).
5. **Shannon ecosystem repo statuses** (Day -7).
6. **`~/.syndication.env` credential handoff** (Day -2).
7. **`.launch-date` file** (Day -2).
8. **Vercel env vars for `/api/consult`** (Day -2).
9. **X API tier activation + pricing conflict resolution** ($100/mo approval-package vs $200/mo x/README.md).

## 7. Gaps where Phase 11 code doesn't cover Phase 12 needs

1. **X dispatch not wired end-to-end.** `runner.ts:254–304` returns `ok` after merely confirming `.x.md` file exists. No `postThread()` call. Either wire in or stand up missing queue publisher. **BLOCKER.**
2. **Supabase channel-name CHECK mismatch.** `runner.ts:387–395` passes `"linkedin"|"x"|"readme"` against schema enum `"linkedin_article"|"x_thread"|"readme_patch"`. Every insert will fail. **BLOCKER.**
3. **Multi-repo patch days** (41, 48, 49, 50) not supported by runner. Calendar cells list 2–3 repos separated by `+`; `resolvePatchFile` returns single file. **Workaround documented; code fix preferred.**
4. **`consultant_inquiries` table DDL** missing from `scripts/syndication/supabase/schema.sql`. `/api/consult` will 500 on insert.
5. **No Plausible install** in Astro layout. Day -1 manual add.
6. **No `scripts/metrics/daily-capture.ts`.** Kill-switch gates (Day 10, 20) have no automated metric feed. Manual capture required.
7. **No state-file backup.** Corruption = silent re-dispatch. Recommend Supabase `syndication_state` mirror.
8. **`runner.ts` LinkedIn doesn't invoke `article-prep.ts`.** Prints body to stdout but doesn't open browser or write prep file. Manual second step per day.
9. **No audit-cohort reports** (`ckm-audit-cohort{1,2,3}-260419.md` referenced in prompt — not in repo). Implies audit workstream Day -N fixes list is also missing.
10. **No devlog-posting automation.** Days 31, 60 devlog rows have no specialized code path.

---

## Unresolved questions

1. Is the "publish-scheduled.js Supabase queue" (referenced in `runner.ts:251` and README) intended to exist, or should runner.ts absorb that responsibility? Recommending absorb.
2. Pricing conflict: X API v2 Basic tier $100 (approval-package) vs $200 (x/README.md). Verify at developer.x.com before commit.
3. `ckm-audit-cohort{1,2,3}-260419.md` source — where are these expected to come from? Not in repo. Unblockers may be un-captured.
4. For multi-repo rows (41, 48, 49, 50), prefer (a) per-repo patch files with numeric suffix + runner loop, or (b) calendar cell parser splitting on `+`?
5. Single-operator constraint: LinkedIn Article manual paste ~5 min × 42 days = 3.5h. Schedule-of-day: 08:00 cron → user confirms X root URL + runs `article-prep.ts` by 09:00. Acceptable?
6. Reserve-insight swap mechanic: overwrite sidecar filename? Add new calendar row? Clearest path for automation vs. hand-ops.
7. Should `PHASE-08-GATE.md` / `PHASE-09-GATE.md` pass-status be required Day -1 blockers? Not read in this research pass.

---

**Status:** DONE_WITH_CONCERNS
**Summary:** Day-by-day playbook delivered, grounded in real code. Phase 11 covers ~70% of Phase 12 needs; 10 specific gaps named. 2 BLOCKERs (X dispatch wiring, Supabase channel-name mismatch) must be resolved before Day 1 fires.
**Concerns:** (1) `ckm-audit-cohort` reports referenced but absent — some audit Day-N fixes may not be captured. (2) `consultant_inquiries` table DDL missing. (3) No automated metric capture for kill-switch gates. (4) Multi-repo patch days 41/48/49/50 need code or ops fix.
