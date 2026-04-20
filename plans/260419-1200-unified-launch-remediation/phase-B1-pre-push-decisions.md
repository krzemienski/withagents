# Phase B1 — Pre-Push Decisions (7 items)

**Owner:** User (Nick) + Sonnet coordinator (decision capture)
**Effort:** ~10h (decisions + documentation)
**Status:** pending
**Window:** Day -10 → Day -6
**Blocks:** B2 (pre-push infra — each decision flips an env var, DNS record, or runbook step)

## Context

R1 §2 Day -10 pre-push checklist surfaced 7 open decisions whose answers must be committed to git before B2 infra provisioning begins. Every one of these toggles a config value, a paid subscription, or a contingency branch in the daily runbook. Un-decided = B2 stalls.

Source inputs:
- `plans/260419-1200-unified-launch-remediation/research/R1-phase12-execution-mechanics.md` §2 (Day -10 decisions), §6 (open items 1–9)
- `plans/260419-0241-agentic-dog-brand-launch/synthesis/approval-package.md` §9/§12/§15
- `plans/260419-0241-agentic-dog-brand-launch/synthesis/calendar-45day.md`

Output of this phase: one markdown file `plans/260419-1200-unified-launch-remediation/DECISIONS-LOCKED.md` committed to git, one row per decision with value + rationale + date. B2 reads this file.

<mock_detection_protocol>
Before executing any task, check intent:
- Creating .test.*, _test.*, *Tests.*, test_* files → STOP
- Importing mock libraries (nock, sinon, jest.mock, unittest.mock) → STOP
- Creating in-memory databases (SQLite :memory:, H2) → STOP
- Adding TEST_MODE or NODE_ENV=test flags → STOP
- Stubbing API responses, fake DNS, mock DB drivers → STOP
Fix the REAL system instead. No exceptions.
</mock_detection_protocol>

## Decisions

### B1.1 — Day-of-week for Day 1 launch

**Constraint:** LinkedIn algorithm favors Tue/Wed for long-form Articles (verified via R1 §2 row 12, calendar-45day.md row 1 "Day 1 = flagship"). Mon dump + Fri tail-off documented. **Note (red-team reconciliation):** flagship Days 7 and 14 from a Tue launch fall on Mondays; C1.2 relaxes the Article-day preference to Mon–Thu (not Tue/Wed only) because otherwise the Day 7 / Day 14 flagships are un-schedulable as Articles. Day 1 launch-date itself remains Tue/Wed only.

**Options:** Tuesday `YYYY-MM-DD` · Wednesday `YYYY-MM-DD`. Reject Mon/Thu/Fri/Sat/Sun.

**Action:** User picks a specific calendar date that is a Tue or Wed, ≥10 calendar days from commit of this phase, and ≥5 days after Beehiiv domain propagation ETA.

**Capture:** `.launch-date` file at repo root — `echo "YYYY-MM-DD" > /Users/nick/Desktop/blog-series/.launch-date`. Runner.ts reads this.

**Verification:** `cat /Users/nick/Desktop/blog-series/.launch-date` returns an ISO date; `date -j -f "%Y-%m-%d" "$(cat .launch-date)" "+%u"` returns `2` (Tue) or `3` (Wed).

<validation_gate id="VG-1" blocking="true">
  <prerequisites>User has committed a Tue/Wed date to `/Users/nick/Desktop/blog-series/.launch-date` that is ≥10 days from today.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && mkdir -p evidence/phase-B1 && test -f .launch-date && cp .launch-date evidence/phase-B1/vg-1-launch-date-copy.txt && LAUNCH=$(cat .launch-date) && DOW=$(date -j -f "%Y-%m-%d" "$LAUNCH" "+%u") && echo "launch=$LAUNCH dow=$DOW" | tee evidence/phase-B1/vg-1-dow.log && python3 -c "from datetime import date; d=date.fromisoformat('$LAUNCH'); print('days_from_today=', (d - date.today()).days)" | tee evidence/phase-B1/vg-1-days-from-today.log</execute>
  <capture>evidence/phase-B1/vg-1-launch-date-copy.txt, vg-1-dow.log, vg-1-days-from-today.log</capture>
  <pass_criteria>`.launch-date` is ISO YYYY-MM-DD, day-of-week returns `2` (Tue) or `3` (Wed), AND ≥10 days from today. Assertion: `LAUNCH=$(cat .launch-date); DOW=$(date -j -f "%Y-%m-%d" "$LAUNCH" "+%u"); [ "$DOW" = "2" ] || [ "$DOW" = "3" ]` AND `python3 -c "from datetime import date; d=date.fromisoformat('$LAUNCH'); import sys; sys.exit(0 if (d - date.today()).days >= 10 else 1)"` exits 0. Also check format: `grep -E "^[0-9]{4}-[0-9]{2}-[0-9]{2}$" .launch-date`.</pass_criteria>
  <review>`cat evidence/phase-B1/vg-1-dow.log` — expect `dow=2` or `dow=3`. `cat evidence/phase-B1/vg-1-days-from-today.log` — expect `days_from_today= N` with N ≥ 10.</review>
  <verdict>PASS → next gate | FAIL → pick a Tue/Wed ≥10 days out; `echo "YYYY-MM-DD" > .launch-date`; commit → re-run</verdict>
  <mock_guard>IF tempted to pick Mon/Thu/Fri to fit the calendar → STOP → LinkedIn algorithm preference is load-bearing for Day-1 reach; flagship Day-7/Day-14 relaxation (Mon–Thu) only applies to downstream Articles, not to Day 1.</mock_guard>
</validation_gate>

### B1.2 — Product Hunt maker team composition

**Constraint:** PH Day-1 surge (approval-package §9) benefits from ≥2 makers on launch post. Solo launch viable but forfeits multiplier.

**Options:** (a) Solo (Nick only) · (b) +1 co-maker (named person) · (c) +2 co-makers.

**Decision gates:** If (b) or (c): co-maker(s) must have PH accounts ≥30 days old, must commit to comment-thread presence 9am-9pm PT on Day 1, and must be named here before B2.

**Capture:** `DECISIONS-LOCKED.md` row `ph_makers: [nick, <name2>, <name3>]` (omit 2/3 if solo).

**Verification:** For each listed maker, `curl -sI https://www.producthunt.com/@<handle>` returns 200 and profile creation date confirmed ≥30 days old via manual UI check.

### B1.3 — Beehiiv: custom domain vs hosted subdomain

**Constraint:** Beehiiv offers `newsletter.withagents.dev` (custom, requires DNS CNAME + ≥48h prop) or `<slug>.beehiiv.com` (hosted, zero-config, weaker branding). Custom domain is the default for paid plans ≥$49/mo.

**Options:** (a) Custom `newsletter.withagents.dev` · (b) Hosted `<slug>.beehiiv.com`.

**Decision driver:** if launch-date is <5 days from this decision, (b) is mandatory — DNS propagation risk too high. Otherwise (a) preferred for brand consistency.

**Capture:** `DECISIONS-LOCKED.md` row `beehiiv_domain: newsletter.withagents.dev | <slug>.beehiiv.com`.

**Verification:** choice matches B2 DNS plan (§B2.1 will add the CNAME if custom).

### B1.4 — HN Day-22 Ralph contingency plan

**Constraint:** Calendar row 22 is Ralph-Orchestrator flagship; approval-package §12 lists HN submission as optional amplifier. Risk: HN front-page rejection or rate-limit flags account.

**Options:** (a) Submit as primary (Ralph + CCB stories) at 9am ET Day 22 · (b) Hold HN, publish only on LI/X/Beehiiv · (c) Submit Day 23 if Day 22 LI traction exceeds a numeric floor. **Numeric thresholds (defaults):** conditional_day23 trigger = LinkedIn Day-21 Ralph Article reactions ≥ 50 AND comments ≥ 10 by end of Day 22. Below that, hold. Hold default = option (b).

**Reject:** multi-account HN submission (shadowban risk).

**Capture:** `DECISIONS-LOCKED.md` row `hn_day22_strategy: {primary|hold|conditional_day23}` + trigger threshold (reactions count).

**Verification:** B3 runbook Day-22 section references this decision by key name.

### B1.5 — X posting: Typefully default vs manual

**Constraint:** Locked decision #1 removed X API ($200/mo Basic). Threads still publish; question is tool.

**Options:** (a) Typefully Pro $15/mo — queue + analytics, multi-device · (b) Manual paste to x.com web UI — $0, higher daily friction.

**Decision driver:** 45–60 day push with ~42 threads. Typefully saves ~3 min/thread = ~2h total labor. Break-even ≈$30. If user prefers no new subscription, accept manual.

**Capture:** `DECISIONS-LOCKED.md` row `x_tool: typefully_pro | manual` + (if Typefully) account handle and billing cycle start date.

**Verification:** B3 runbook X-step references this decision; B2 adds Typefully to `~/.syndication.env` as `TYPEFULLY_API_KEY` only if `x_tool=typefully_pro`.

### B1.6 — Slack / Discord notification routing

**Constraint:** B4 kill-switch + B3 runbook both require a fanout channel for: 9am sanity alerts, kill-switch triggers, Supabase error rows, metric thresholds.

**Options:** (a) Slack workspace `withagents.slack.com` channel `#launch` · (b) Discord server + channel · (c) Email-only to `krzemienski@gmail.com` (no chat fanout).

**Decision driver:** (a) preferred — webhook integration with Vercel + Supabase is first-class. (c) acceptable for solo-operator mode.

**Capture:** `DECISIONS-LOCKED.md` rows `notify_primary: {slack|discord|email}` + `slack_webhook_url: <url>` (secret, NOT committed — reference only).

**Verification:** B2.9 creates the channel or confirms the webhook responds `200 ok` to a test `curl -X POST -d '{"text":"B1 wiring test"}' $WEBHOOK`.

### B1.7 — Kill-switch threshold values (commit numbers)

**Constraint:** B4 needs concrete numeric triggers. Approval-package §12 names metrics qualitatively; this decision binds numbers.

**Locked values (recommended, user overrides in DECISIONS-LOCKED.md):**
- Negative LI sentiment: >15% of comments flagged negative across any rolling 3-day window
- Zero inquiries: 3 consecutive days after Day 10 with `consultant_inquiries.count = 0`
- Plausible floor: <10 unique visitors/day for 2 consecutive days after Day 7
- X rate-limit: any `postThread()` error matching `429` OR account-flag warning email from X
- Security: any `security-reviewer` agent HIGH/CRITICAL finding on `validationforge` or `withagents-site`

**Capture:** `DECISIONS-LOCKED.md` rows one per metric, `<metric>: <numeric_value>`.

**Verification:** B4 `kill-switch-triggers.json` deserializes from this file.

## File ownership

| File | Owner | Conflict |
|---|---|---|
| `plans/260419-1200-unified-launch-remediation/DECISIONS-LOCKED.md` (NEW) | B1 | none |
| `/Users/nick/Desktop/blog-series/.launch-date` (NEW) | B1 | read by runner.ts |
| `~/.syndication.env` (LOCAL ONLY, gitignored) | B2 | B1 writes decision only, B2 provisions |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| User defers a decision → B2 stalls | MED | HIGH | lead pushes back within 24h on each unanswered row; escalate at 48h |
| Launch date picked too close to Beehiiv custom-domain decision | MED | MED | B1.3 decision-driver forces hosted subdomain if <5 days |
| PH co-makers ghost Day 1 | LOW | MED | solo is acceptable fallback; only commit (b)/(c) if named human confirmed in writing |
| HN rate-limit / account flag if B1.4 chosen primary | LOW | MED | single submission from oldest account, no alt-account boosting |
| Kill-switch numbers too tight → false-positive pauses | MED | MED | B4 exposes override CLI flag `--suppress-trigger <name>` for a manual judgment call |

## Acceptance criteria

- [ ] `plans/260419-1200-unified-launch-remediation/DECISIONS-LOCKED.md` exists and has values for all 7 decisions (no TBD, no placeholder)
- [ ] `/Users/nick/Desktop/blog-series/.launch-date` exists, parses as ISO date, resolves to Tue or Wed
- [ ] Launch date ≥10 days from DECISIONS-LOCKED.md commit timestamp
- [ ] If `ph_makers` >1: each handle verified live on PH
- [ ] If `beehiiv_domain` custom: DNS plan in B2.1 includes the CNAME
- [ ] If `x_tool=typefully_pro`: billing confirmed active (screenshot or email in `.audit/B1/`)
- [ ] If `notify_primary=slack`: webhook URL responds 200 to test payload
- [ ] All 5 kill-switch numeric thresholds committed

## Verification steps

```bash
# 1. Decisions file exists and is populated
test -s /Users/nick/Desktop/blog-series/plans/260419-1200-unified-launch-remediation/DECISIONS-LOCKED.md
grep -E "^(launch_date|ph_makers|beehiiv_domain|hn_day22_strategy|x_tool|notify_primary):" \
  /Users/nick/Desktop/blog-series/plans/260419-1200-unified-launch-remediation/DECISIONS-LOCKED.md | wc -l
# expect: 6 (plus kill-switch rows below)

# 2. Launch date sanity
LAUNCH=$(cat /Users/nick/Desktop/blog-series/.launch-date)
date -j -f "%Y-%m-%d" "$LAUNCH" "+%u"  # expect 2 or 3
python3 -c "from datetime import date; d=date.fromisoformat('$LAUNCH'); print((d - date.today()).days)"
# expect: >=10

# 3. Kill-switch rows
grep -cE "^(negative_li_sentiment|zero_inquiries_days|plausible_floor|x_rate_limit|security_severity):" \
  /Users/nick/Desktop/blog-series/plans/260419-1200-unified-launch-remediation/DECISIONS-LOCKED.md
# expect: 5

# 4. Slack webhook live (if chosen)
curl -sS -X POST -H 'Content-Type: application/json' -d '{"text":"B1 webhook verification"}' "$SLACK_WEBHOOK_URL"
# expect: ok
```

## Rollback

Decision rows in `DECISIONS-LOCKED.md` are idempotent text — revert via `git revert` on the decisions commit. Launch date change: `date > .launch-date`, re-run runner smoke. If PH/Typefully/Beehiiv paid subscription activated against a reversed decision, cancel the paid plan within billing-cycle grace window (typically 7 days).
