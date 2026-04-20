# Phase C6 — Newsletter Scheduling (Beehiiv weekly digest)

**Owner:** Nick (editor) + Sonnet helper (digest drafts, segmentation queries)
**Effort:** ~50h over 60d (setup 10h, weekly ops 5h × 8 weeks)
**Status:** pending
**Blocks:** none
**Blocked by:** B2 (withagents.dev live with RSS feed emitting per A1.7)

## Context

Beehiiv adopted (parent plan.md #45). RSS-auto-import + manual curation hybrid. Weekly digest every **Sunday 10:00 AM PT** summarizes the week's posts plus 1 editor-note. Substack and Medium disabled per locked decision — no crossposting.

**Locked constraints (parent plan.md #45, #51–53):**
- Beehiiv **only** — no Substack, no Medium
- Cadence: weekly (Sundays 10am PT)
- RSS import + manual editor curation hybrid
- Target: 300+ subs by Day 60

Source: R2 §6.

<mock_detection_protocol>
Before executing any task, check intent:
- Creating .test.*, _test.*, *Tests.*, test_* files → STOP
- Importing mock libraries (nock, sinon, jest.mock, unittest.mock) → STOP
- Creating in-memory databases (SQLite :memory:, H2) → STOP
- Adding TEST_MODE or NODE_ENV=test flags → STOP
- Fabricating social-platform screenshots, fake analytics → STOP
Fix the REAL system instead. No exceptions.
</mock_detection_protocol>

## Work items

### C6.1 — Beehiiv publication setup (Day -4)

**Fix:** Create Beehiiv publication. Free tier viable for <2500 subs; upgrade if growth warrants.

**Setup checklist:**
1. Publication name: `withagents.dev — field report`
2. From address: `nick@withagents.dev` (requires DNS setup — add DKIM/SPF records per Beehiiv instructions, commit to `withagents-site/deploy/dns-records.md` for reference)
3. Custom domain (optional): `newsletter.withagents.dev` — defer until Day 30 if not trivial
4. Enable RSS-to-Email: paste `https://withagents.dev/rss.xml` as the feed source
5. Disable auto-send on RSS updates (curated-digest model, not per-post blast)
6. Theme: match Midnight Observatory palette — upload custom logo, set accent `#6366f1`, background `#0f172a`
7. Footer: include withagents.dev link + consulting CTA (swap in at Day 30)

**Verification:** `dig TXT nick@withagents.dev.dkim.beehiiv.com +short` returns non-empty (DKIM propagated). Test send to Nick's own email → arrives in inbox, not spam.

### C6.2 — Subscriber acquisition surfaces (Day 0 onward)

**Fix:** 3 always-on signup surfaces:

1. **withagents.dev footer form** — already in `BaseLayout.astro` per A1. POST to Beehiiv Embed API. Confirm rendering in A3 smoke.
2. **LinkedIn CTA** — periodic (~every 5th feed post) includes `newsletter.withagents.dev` short link
3. **X pinned bio** — one line in profile bio: `newsletter → withagents.dev/subscribe`

**One-shot burst surfaces (launch-day only):**
- Day 1 PH submission — newsletter signup is the non-upvote CTA per C3.4
- Day 22 HN thread — post Ralph launch includes a single mention in author comment: "these are written up in the series, archived at withagents.dev, with a weekly digest if that's your preference"

**Verification:** `curl -sL https://withagents.dev/ | grep -q 'newsletter.withagents.dev\|/subscribe'` returns match. Beehiiv dashboard shows subscribers attributed to ≥3 distinct `utm_source` values.

### C6.3 — Weekly digest editorial format

**Fix:** Every Sunday 10am PT send. Template:

```
Subject: Week N — <theme>

Hey — this week's field report from withagents.dev:

📌 Day NN: <post title> — <1-sentence hook>
📌 Day NN: <post title> — <1-sentence hook>
...

Editor's note: <2–3 sentence human commentary — what I actually thought
about the week, what broke, what surprised me. This is the glue.>

Full archive: https://withagents.dev/writing/

— Nick
```

**Rules:**
- Subject line ≤ 45 chars (mobile preview cutoff)
- One emoji max in the subject, zero in body — voice-spec bans emoji-heavy copy
- Editor's note is mandatory and written fresh weekly (not auto-generated)
- Links: always UTM-tagged `?utm_source=newsletter&utm_medium=email&utm_campaign=week<N>`

**Weekly themes (anchor; adjust based on actual post content):**
| Week | Theme | Posts |
|---|---|---|
| 1 | Launch | Day 1 series, Day 2 consensus, Days 3–7 |
| 2 | Validation + iOS bridge | Day 3 functional-val, Day 4 iOS streaming |
| 3 | Worktrees + prompting | Day 6 parallel, Day 7 prompt stack |
| 4 | Orchestration | Day 8 Ralph, Day 9 session mining |
| 5 | Design systems | Day 10 Stitch, Day 11 specs |
| 6 | Memory + debugging | Day 12 mem, Day 13 sequential |
| 7 | Merge + skills | Day 14 merge, Day 15 skills |
| 8 | Plugins + SDK | Day 16 hooks, Day 17 CCB, Day 18 SDK/CLI |

**Verification:** `beehiiv.com/dashboard/posts` shows 8 scheduled sends by Day 56. Each draft reviewed before send — `plans/reports/newsletter-weekly-log.md` records subject line and send time per week.

### C6.4 — Segmentation (new vs engaged vs dormant)

**Fix:** Enable 3 Beehiiv segments:
- `new` — subscribed < 14d ago
- `engaged` — opened ≥ 50% of last 4 sends
- `dormant` — zero opens in last 6 sends

**Use cases (rollout at Day 30):**
- `new` gets a welcome email (single auto-send Day 0 of their subscription): "Welcome — here's the 3 essays people keep coming back to" with 3 evergreen links
- `engaged` gets launch-day broadcast for PH and flagship days (C3, C4)
- `dormant` gets one reactivation email at Day 55: "Series wraps next week — catch up or unsubscribe, no hard feelings"

**Do NOT** email `engaged` daily — cadence remains weekly for everyone. Segmentation informs broadcast targeting, not frequency.

**Verification:** Beehiiv segments count ≥ 3 by Day 30. Welcome auto-send enabled (test by creating a fresh sub, confirm welcome email lands within 10 min).

### C6.5 — Subject-line A/B testing

**Fix:** Beehiiv supports subject-line A/B on paid tiers. On free tier, manual A/B: send half the list (A variant) at 10:00 PT, the other half (B variant) at 10:10 PT. Track open rates per variant in `plans/reports/newsletter-ab-log.md`.

**Cadence:** A/B test every week Weeks 2–7. Week 1 baseline, no test. Patterns to test:
- Question vs statement subject
- Emoji vs none
- Number vs word ("Week 3" vs "Three weeks in")

**Goal:** identify a subject pattern that consistently wins. Adopt it Week 8+.

**Verification:** `plans/reports/newsletter-ab-log.md` has 6 entries by Week 7. Each entry lists both variants, open rate, winner.

### C6.6 — Growth targets and referral

**Fix:** Target 300+ subs by Day 60. Weekly growth checkpoint in Sunday digest prep:

| Week | Target | Action if below |
|---|---|---|
| 1 | 50 | push LinkedIn CTA harder — pin `subscribe` URL in a Day 5 feed post |
| 2 | 100 | add signup form to every post's footer (check `BaseLayout.astro`) |
| 3 | 150 | tripwire — one-time "catch-up" LinkedIn post linking to newsletter |
| 4 | 200 | enable Beehiiv Boosts (see C6.7) |
| 6 | 275 | reassess — if <250, newsletter is not the right acquisition surface; reduce effort |
| 8 | 300 | target hit |

**Verification:** `plans/reports/newsletter-weekly-log.md` includes `subs_count` column per week.

### C6.7 — Beehiiv Boosts evaluation (Day 28 decision)

**Fix:** Beehiiv Boosts = paid swap — other Beehiiv publications recommend yours in exchange for reciprocity (~$1–3 per sub acquired). Evaluate at Day 28:

**Evaluation criteria:**
- Subs ≥ 150 (C6.6 Week 4 target) → eligible; enable Boosts with cap at $200 total spend
- Subs < 150 → skip Boosts; root problem is content not distribution
- Audience overlap check: only accept Boost swaps from Beehiiv publications in dev-tools / AI-engineering category (not "SaaS growth hacking")

**Verification:** Day 28 retro records Boosts decision + cap. If enabled, `plans/reports/newsletter-boosts-log.md` tracks each swap partner.

### C6.8 — Crosspost disabled rails

**Fix:** Explicit guardrail — do NOT crosspost newsletter content to Substack or Medium. Parent plan.md #52–53 lock this decision.

**Rationale:** Substack/Medium fragment attribution, dilute SEO canonical, and cannibalize direct withagents.dev traffic. Newsletter is a companion product, not a distribution mirror.

**Implementation:** zero code — this is a "do-not-do" rule. Add to `scripts/syndication/DAILY-RUNBOOK.md` a "never cross-post" line for safety.

**Verification:** `grep -r 'substack\|medium\.com' withagents-site/src/ scripts/syndication/` returns zero matches.

### C6.9 — RSS-curation safety net

**Fix:** Even though auto-RSS-import is enabled, the curated digest (C6.3) is the only outgoing email. Disable Beehiiv's "send to all subscribers on RSS update" toggle. Individual post imports are visible in Beehiiv web archive but not emailed.

**Why:** prevents accidental daily blast. If the runner ever inserts 5 posts in a day (edit backfill), subscribers don't get 5 emails.

**Verification:** Beehiiv publication settings screenshot at Day -2 showing RSS auto-send disabled. `plans/reports/newsletter-config-state.png`.

## File ownership

| File | Owner | Conflict |
|---|---|---|
| `plans/reports/newsletter-weekly-log.md` (NEW) | C6 | none |
| `plans/reports/newsletter-ab-log.md` (NEW) | C6 | none |
| `plans/reports/newsletter-boosts-log.md` (NEW, conditional) | C6 | none |
| `plans/reports/newsletter-config-state.png` (NEW) | C6 | none |
| `withagents-site/deploy/dns-records.md` (NEW) | C6 | none |
| `withagents-site/src/components/Newsletter.astro` | B2 | read-only from C6 |
| `withagents-site/src/layouts/BaseLayout.astro` | A1 | read-only from C6 |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| DKIM/SPF misconfigured → emails land in spam | MED | HIGH | C6.1 DNS verification + test send to Nick + gmail + outlook; mail-tester.com score ≥ 9/10 |
| RSS auto-send fires accidentally and spams subscribers | MED | HIGH | C6.9 explicit disable + screenshot audit |
| Subs growth stalls below 150 by Day 28 | MED | MED | C6.7 evaluation gate — reduce effort, don't fight it |
| Beehiiv free tier limits hit (2500 sub cap) | LOW | LOW | upgrade is cheap and fast ($34/mo starter) |
| Subject-line A/B noise dominates signal (<50 sample) | HIGH (early) | LOW | A/B only after Week 2 when list ≥ 100; accept noise as data |
| Welcome email auto-send loops (mis-trigger) | LOW | MED | test with disposable email Day -2; cap welcome to 1 per subscriber |

## Acceptance criteria

- [ ] Beehiiv publication live by Day -2 with DKIM verified
- [ ] RSS auto-email disabled (only curated weekly digest sends)
- [ ] 8 weekly digests sent Weeks 1–8 (Sundays 10am PT, ≤2 missed)
- [ ] Subject-line A/B tests logged Weeks 2–7
- [ ] 3 segments (`new`, `engaged`, `dormant`) configured by Day 30
- [ ] Welcome auto-email fires on new subscription (tested)
- [ ] ≥ 300 subscribers by Day 60 (aspirational target; soft floor 250)
- [ ] Zero Substack or Medium crossposts
- [ ] Every outbound link UTM-tagged `utm_source=newsletter`

## Verification steps

```bash
# DKIM check
dig TXT withagents.dev.dkim.beehiiv.com +short  # expect non-empty TXT

# DNS state
cat withagents-site/deploy/dns-records.md  # should list DKIM + SPF + (optional) CNAME

# RSS endpoint sanity (pre-req for Beehiiv import)
curl -sI https://withagents.dev/rss.xml | grep -i 'content-type.*xml'
xmllint --noout <(curl -s https://withagents.dev/rss.xml) && echo "valid RSS"

# Crosspost guardrail
grep -ri 'substack\|medium\.com' withagents-site/src/ scripts/syndication/ \
  && echo "VIOLATION" || echo "clean"

# Weekly-send inventory
grep -c '^## Week ' plans/reports/newsletter-weekly-log.md  # expect ≥8 by Day 60

# Plausible newsletter UTM
curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" \
  "https://plausible.io/api/v1/stats/aggregate?site_id=withagents.dev&filters=utm_source==newsletter&period=60d"

# Mail-tester score (run Day -2 before live)
# Send a test email to the address provided by mail-tester.com; score ≥ 9/10
```

## Rollback

Weekly digest send is atomic. If a wrong-draft goes out, Beehiiv supports a "retract" action (removes from web archive and sends a correction). Correction protocol:
1. Within 15 min: send follow-up email with subject `Correction — Week N` and 1-sentence explanation
2. Edit the web archive version (not the sent email — immutable)
3. Log incident in `plans/reports/newsletter-weekly-log.md` under that week's row

Never bulk-resend. One outgoing email per week, full stop. If a week is entirely missed, skip it — do not double up next Sunday.
