# Phase B4 — Kill-Switch (5 triggers + playbooks)

**Owner:** Sonnet executor (setup) + user (trigger decisions), automated daily checker
**Effort:** ~3h setup + passive monitoring across 45–60 day run
**Status:** pending
**Window:** Day -1 (install) → Day 60 (retire)
**Blocks:** nothing
**BlockedBy:** B1 (threshold decisions), B2 (Slack + Supabase), B5 (metrics feed for automated checks)

## Context

Approval-package §12 names kill-switch triggers qualitatively. B1.7 committed numeric thresholds. B4 builds the checker, the pause protocol, the notification path, and the post-mortem template.

Principle: automated detection for quantitative triggers (Supabase/Plausible feeds), manual flag for qualitative (LI sentiment, security). Pause is reversible. Every trigger writes a post-mortem before resume.

Source: approval-package §12, R1 §4 alert triggers, `DECISIONS-LOCKED.md` (B1.7).

## Triggers + Playbooks

### B4.1 — Trigger: negative LinkedIn sentiment >15%

**Detection:** manual. No LI comment-sentiment API at personal-profile tier. User reviews daily on each Article post.

**Threshold (from B1.7):** >15% of comments flagged "negative" (user judgment: hostile, dismissive, or correction-flagged) over any rolling 3-day window **AND min_comments ≥ 15 in that window** (noise floor — 4 total comments, 1 negative = 25% is noise not signal). Both conditions must hold; either alone does not fire.

**Response playbook:**
1. User flags in Slack `#launch`: `!kill-switch sentiment day-$N reason="<sample comment URLs>"`
2. Sonnet coordinator reviews linked comments within 1h
3. If confirmed: trigger pause (see B4.6)
4. Voice-review pass on next 3 flagship posts before resume (Opus model-different review — approval-package §12)
5. Post-mortem identifies theme (tone? claim? specific stat?); amend subsequent posts

**Resume condition:** 2 consecutive days of <5% negative comments after voice fix.

### B4.2 — Trigger: zero consultant inquiries ≥3 consecutive days after Day 10

**Detection:** automated daily.

**Threshold (B1.7):** `SELECT COUNT(*) FROM consultant_inquiries WHERE created_at > NOW() - INTERVAL '3 days'` returns 0, AND current day N ≥10.

**Response playbook:**
1. Automated Slack alert fires 11:00 PM PT: `⚠️ KILL-SWITCH: 0 inquiries Day-$N, 3-day window`
2. User acknowledges within 24h in Slack thread
3. Options:
   - **Content-quality review:** Opus voice review on Day N, N-1, N-2 posts → identify CTA weakness
   - **CTA boost:** add explicit "Book a call" line to Days N+1 → N+5
   - **Pause + pivot:** 24–48h pause; revise /work page copy; resume with new CTA
4. Choose within 48h, log decision in `plans/phase-12-retro/kill-switch-day-$N.md`

**Resume condition:** ≥1 inquiry in the following 3-day window OR explicit user override "continue regardless".

### B4.3 — Trigger: ValidationForge security finding (HIGH/CRITICAL)

**Detection:** manual + weekly `security-reviewer` agent sweep.

**Threshold (B1.7):** any HIGH or CRITICAL finding on `validationforge` OR `withagents-site` repos.

**Response playbook:**
1. Security issue reported (by user, external researcher, or agent sweep) → user flags in Slack with severity
2. HIGH: **pause publishing immediately**; patch within 48h; voice-review next post to acknowledge; resume after patch merged + deployed
3. CRITICAL: **pause + public disclosure** within 24h (security-disclosure post on blog + LinkedIn); rotate any exposed secrets (Vercel env vars per R3 §5 catastrophic row); resume only after full remediation + external review
4. Never silently patch — transparency is part of the brand thesis

**Resume condition:** patch merged + deployed + verification in `.audit/B4/security-<id>/remediation.md`.

### B4.4 — [DELETED — X channel removed in A1.1]

Original B4.4 was "X rate-limit / account flag" trigger. A1.1 removed the `postThread()` code path entirely; X is manual-or-Typefully-only. Account-flag detection remains a manual user concern — if Nick's x.com account is flagged, pause X channel via `.syndication-state.json` per-day `x_channel: disabled`. This is not a kill-switch that halts the arc — LI + README + blog continue regardless. No automated trigger to implement.

### B4.5 — Trigger: Plausible floor <10 unique visitors/day ≥2 consecutive days after Day 7

**Detection:** automated daily via Plausible API.

**Threshold (B1.7):** Plausible aggregate `visitors < 10` for 2 consecutive days, current day ≥7.

**Response playbook:**
1. Automated Slack alert: `⚠️ KILL-SWITCH: Plausible floor breach Day-$N`
2. Check immediate causes:
   - DNS regression? `dig withagents.dev A`
   - Plausible script broken? `curl -s https://withagents.dev/ | grep plausible`
   - SSL cert expired? `curl -sI https://withagents.dev/` status
3. If site healthy: distribution problem
   - Review LI reach (are posts appearing in followers' feeds?)
   - Review X impressions (shadowban check: `curl -sI "https://x.com/<handle>/status/<id>"` and post visibility test from logged-out browser)
4. Pause if distribution is dead; resume after diagnosis fix

**Resume condition:** ≥50 uniques/day for 2 consecutive days OR explicit override.

## B4.6 — Pause / resume protocol

**Pause:**
```bash
cd /Users/nick/Desktop/blog-series
# 1. Disable cron
crontab -l | sed 's|^\(.*syndication.*\)$|# PAUSED \1|' | crontab -
# 2. Write pause sentinel (runner checks this)
echo "paused_at=$(date -u +%FT%TZ)
reason=<reason>
triggered_by=<B4.N>" > .syndication-paused
# 3. Slack broadcast
source ~/.syndication.env
curl -sS -X POST -H 'Content-Type: application/json' \
  -d "{\"text\":\"🛑 LAUNCH PAUSED — reason: <reason>\"}" "$SLACK_WEBHOOK_URL"
```

**Resume:**
```bash
# 1. Post-mortem completed (gate)
test -s plans/phase-12-retro/kill-switch-day-$N.md || { echo "post-mortem missing"; exit 1; }
# 2. Remove sentinel
rm .syndication-paused
# 3. Re-enable cron
crontab -l | sed 's|^# PAUSED \(.*\)$|\1|' | crontab -
# 4. Slack broadcast
curl -sS -X POST -H 'Content-Type: application/json' \
  -d "{\"text\":\"✅ LAUNCH RESUMED Day-$N\"}" "$SLACK_WEBHOOK_URL"
# 5. Recalculate schedule: shift remaining days by pause duration
pnpm tsx scripts/syndication/scheduler/runner.ts --today --dry-run
```

Runner already reads `.syndication-paused` — **add check** (see B4.7 implementation).

## B4.7 — Automated checker implementation

**New file:** `scripts/metrics/kill-switch-check.ts` (~80 lines). Runs 23:00 PT daily via cron. Queries Supabase + Plausible, evaluates automated triggers, posts to Slack on breach.

Config (reads `DECISIONS-LOCKED.md` B1.7): `zero_inquiries_days=3`, `zero_inquiries_min_day=10`, `plausible_floor=10`, `plausible_floor_days=2`, `plausible_floor_min_day=7`.

Logic:
- Compute `today = currentLaunchDay()` from `.launch-date`; exit 0 if <7
- B4.2: if `today >= 10`, count `consultant_inquiries` in last 3 days; if 0 → notify
- B4.5: Plausible aggregate `visitors` period=2d; if `< floor * floor_days` → notify
- Notify: POST to `$SLACK_WEBHOOK_URL` with `{"text":"⚠️ KILL-SWITCH: <trigger> Day-<N>"}`

Cron entry appended to `scripts/syndication/scheduler/cron.schedule`:
```
0 23 * * * cd /Users/nick/Desktop/blog-series && source ~/.syndication.env && pnpm tsx scripts/metrics/kill-switch-check.ts >> ~/Library/Logs/kill-switch.log 2>&1
```

Runner integration — prepend to `runner.ts main()`:
```ts
if (existsSync('.syndication-paused')) { console.log('Launch paused'); process.exit(0); }
```

## B4.8 — Post-mortem template

File: `plans/phase-12-retro/kill-switch-day-$N.md`

```markdown
# Kill-switch post-mortem — Day N

**Trigger:** B4.X (<name>)
**Fired:** YYYY-MM-DD HH:MM PT
**Paused:** YYYY-MM-DD HH:MM PT
**Resumed:** YYYY-MM-DD HH:MM PT (or "pending")

## Evidence
- Slack alert: <permalink>
- Supabase query result: <row count>
- Plausible snapshot: <path>
- Sample comments / failure URLs: <list>

## Root cause
<1–3 sentences>

## Remediation
- [ ] action 1
- [ ] action 2

## Resume gate
<specific numeric condition to meet before resume>

## Lessons
<what do we change in remaining days>
```

## File ownership

| File | Owner | Conflict |
|---|---|---|
| `scripts/metrics/kill-switch-check.ts` (NEW) | B4 | none |
| `scripts/syndication/scheduler/cron.schedule` | A1/B2 created, B4 appends | append-only edit |
| `scripts/syndication/scheduler/runner.ts` | A1 owns; B4 adds pause-check prelude | coordinated via A1 merge |
| `.syndication-paused` (sentinel, ephemeral) | B4 | runtime only |
| `plans/phase-12-retro/kill-switch-day-*.md` | B4 | one per trigger event |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| False positive pause → lost momentum | MED | MED | thresholds conservative (B1.7); user override `--suppress-trigger` CLI flag |
| Missed negative sentiment (no automated detection) | HIGH | MED | weekly manual review gate; flagship days get Opus voice review |
| Kill-switch script fails silently (Slack down) | LOW | HIGH | `kill-switch.log` tailed; weekly check for 0-byte logs |
| Cron doesn't fire at 23:00 (laptop closed) | MED | MED | fail-safe: B3.1 9am dry-run also runs check; doubles as backstop |
| Resume without post-mortem | LOW | MED | resume script hard-checks `test -s` on retro file |
| Threshold drift (B1.7 values too loose mid-run) | MED | LOW | update `DECISIONS-LOCKED.md` + log reason; checker re-reads on each run |

## Acceptance criteria

- [ ] `scripts/metrics/kill-switch-check.ts` compiles (`pnpm tsc --noEmit`)
- [ ] Cron entry added and `crontab -l` shows kill-switch line
- [ ] Test run with synthetic data (insert 0 rows in staging) → Slack receives alert
- [ ] Runner pause-check prelude: `echo "test" > .syndication-paused && pnpm tsx scripts/syndication/scheduler/runner.ts --day 1` exits 0 with "Launch paused" message
- [ ] Resume script: `rm .syndication-paused && pnpm tsx scripts/syndication/scheduler/runner.ts --day 1 --dry-run` proceeds normally
- [ ] Post-mortem template in place at `plans/phase-12-retro/TEMPLATE.md`
- [ ] Kill-switch thresholds match `DECISIONS-LOCKED.md` (B1.7) values exactly

## Verification steps

```bash
# 1. Compile
cd /Users/nick/Desktop/blog-series
pnpm tsc --noEmit scripts/metrics/kill-switch-check.ts

# 2. Dry-run checker (today, outside trigger windows)
source ~/.syndication.env
pnpm tsx scripts/metrics/kill-switch-check.ts
# expect: exit 0, no Slack post

# 3. Inject test trigger (staging Supabase)
psql "$SUPABASE_STAGING_URL" -c "DELETE FROM consultant_inquiries WHERE created_at > NOW() - INTERVAL '3 days';"
SUPABASE_URL=$SUPABASE_STAGING_URL pnpm tsx scripts/metrics/kill-switch-check.ts
# expect: Slack posts "⚠️ KILL-SWITCH: B4.2 zero_inquiries Day-N"

# 4. Pause / resume cycle
echo "reason=test" > .syndication-paused
pnpm tsx scripts/syndication/scheduler/runner.ts --day 1 2>&1 | grep "Launch paused"
rm .syndication-paused
pnpm tsx scripts/syndication/scheduler/runner.ts --day 1 --dry-run | grep -v paused

# 5. Cron verify
crontab -l | grep kill-switch-check
```

## Rollback

- Remove cron: `crontab -l | grep -v kill-switch-check | crontab -`
- Revert runner.ts pause-check prelude; delete `.syndication-paused` if stuck; delete `kill-switch-check.ts` to fully disable. Manual trigger (B4.6) persists regardless.
