# Phase C2 — X (Twitter) Threads

**Owner:** Nick (posting) + Sonnet helper (thread asset gen, Typefully setup if flipped)
**Effort:** ~30h over 45d
**Status:** pending
**Blocks:** none — runs concurrent with Track B
**Blocked by:** B2 (UTM helper, day-NN.x.md assets from Phase 12 pipeline)

## Context

X API Basic tier ($200/mo) was rejected (locked decision #1). Runner.ts X path is removed in A1.1. This phase is **100% manual or Typefully-scheduled**. 45 threads over 45 days — one per post, drawn from `posts/post-NN/day-NN.x.md`.

X is discovery-primary, low-conversion. Role: surface flagship content to `#buildinpublic` / `#ClaudeCode` communities and drive profile follows that trickle to LinkedIn + newsletter. Source: R2 §2.

**Locked default:** manual posting. **Flip trigger:** if Nick misses ≥5 threads by Day 14 retro, migrate to Typefully free tier (10 scheduled posts/month) or paid ($12.50/mo) for remainder.

<mock_detection_protocol>
Before executing any task, check intent:
- Creating .test.*, _test.*, *Tests.*, test_* files → STOP
- Importing mock libraries (nock, sinon, jest.mock, unittest.mock) → STOP
- Creating in-memory databases (SQLite :memory:, H2) → STOP
- Adding TEST_MODE or NODE_ENV=test flags → STOP
- Stubbing API responses, fake analytics data, mock DB drivers → STOP
Fix the REAL system instead. No exceptions.
</mock_detection_protocol>

## Work items

### C2.1 — Manual posting cadence (45 threads / 45 days)

**Fix:** Each morning `day-NN.x.md` (Phase 12 output) contains a pre-written thread: 5–12 tweets, 240 chars each (leave buffer for edits), explicit `Tweet N/N` markers. Nick posts between 09:30–11:00 AM ET (tech-audience peak, R2 §2.1), immediately after LinkedIn post.

**Thread template:**
```
Tweet 1/N — hook (question or counterintuitive claim), NO link
Tweet 2/N — setup
Tweet 3..N-1 — body (1 idea per tweet, 1 line break)
Tweet N/N — CTA: "Full essay: https://withagents.dev/writing/<slug>/?utm_source=x&utm_medium=social&utm_campaign=day<NN>"
```

**Posting mechanics:**
1. Compose Tweet 1 from `day-NN.x.md` line 1
2. Reply-to-self for each subsequent tweet
3. No auto-schedule in X native composer — post live so the thread lands contiguous in the follower timeline
4. First tweet pinned to profile for 24h (C2.3)

**Verification:** `posts/post-NN/evidence/x-thread-NN-url.txt` contains the Tweet 1 URL, captured manually by Nick into the daily checklist. Plausible logs `utm_source=x` sessions day-of-post.

<validation_gate id="VG-1" blocking="true">
  <prerequisites>`posts/post-NN/evidence/x-thread-NN-url.txt` exists and is non-empty; x.com reachable over HTTPS.</prerequisites>
  <execute>url=$(cat posts/post-NN/evidence/x-thread-NN-url.txt | tr -d '[:space:]'); echo "URL=$url"; curl -sS -o /dev/null -w "%{http_code}\n" -L -A "Mozilla/5.0 (compatible; withagents/1.0)" "$url"</execute>
  <capture>url=$(cat posts/post-NN/evidence/x-thread-NN-url.txt | tr -d '[:space:]'); curl -sS -L -D evidence/phase-C2/vg-1-day-NN-headers.txt -A "Mozilla/5.0 (compatible; withagents/1.0)" "$url" -o evidence/phase-C2/vg-1-day-NN-body.html; echo "$url" > evidence/phase-C2/vg-1-day-NN-url.txt</capture>
  <pass_criteria>URL matches regex `^https://(x|twitter)\.com/[^/]+/status/[0-9]+$`. `curl -w %{http_code}` returns 200 (or 200 after a 302 redirect). Response body is non-empty. Body contains `og:title` or equivalent meta indicating a real tweet page (grep for `<meta property="og:` hits at least 1).</pass_criteria>
  <review>grep -E 'HTTP/[12](\.[01])? 200' evidence/phase-C2/vg-1-day-NN-headers.txt; wc -c < evidence/phase-C2/vg-1-day-NN-body.html — should be > 1000 bytes; grep -c 'og:' evidence/phase-C2/vg-1-day-NN-body.html ≥ 1.</review>
  <verdict>PASS → thread live | FAIL → URL wrong, thread deleted, or x.com blocking the UA — post correct URL or re-post thread → re-run</verdict>
  <mock_guard>IF tempted to accept a 404/410 as "close enough" or write the URL into the .txt without confirming via curl that the tweet exists → STOP → evidence must be a 200 response from the live tweet URL.</mock_guard>
</validation_gate>

### C2.2 — Typefully flip protocol (contingency)

**Fix:** Decision gate at Day 14 retro. If `find posts/post-*/evidence/x-thread-*-url.txt | wc -l < 9`, flip to Typefully.

**Migration steps (Typefully free tier):**
1. Sign up at typefully.com (free = 10 scheduled drafts; $12.50/mo unlimited)
2. Connect X account via OAuth
3. Batch-load remaining `day-NN.x.md` as drafts on Sunday evening for the upcoming week
4. Schedule for 09:30 AM ET daily
5. Enable Typefully's auto-retweet-top-tweet feature at +24h

**Verification:** Post-flip, `curl -s https://api.typefully.com/v1/drafts/scheduled -H "X-API-KEY: $TYPEFULLY_API_KEY" | jq '. | length'` ≥ 7 at any point.

<validation_gate id="VG-2" blocking="true">
  <prerequisites>Day 14 retro reached AND flip trigger condition evaluated; if flipped: `TYPEFULLY_API_KEY` env set, typefully.com OAuth to X complete.</prerequisites>
  <execute>posted=$(find posts/post-*/evidence/x-thread-*-url.txt 2>/dev/null | wc -l); echo "posted=$posted"; if [ "$posted" -lt 9 ]; then echo "FLIP_REQUIRED"; curl -sS -H "X-API-KEY: $TYPEFULLY_API_KEY" "https://api.typefully.com/v1/drafts/scheduled" | tee evidence/phase-C2/vg-2-typefully-scheduled.json | jq 'length'; else echo "NO_FLIP posted=$posted"; fi</execute>
  <capture>evidence/phase-C2/vg-2-typefully-scheduled.json (if flipped); echo "posted=$posted flip_decision=<YES|NO>" > evidence/phase-C2/vg-2-decision.txt</capture>
  <pass_criteria>If `posted >= 9`: no flip required, decision logged as NO_FLIP, gate PASS. If `posted < 9`: flip executed, `jq 'length'` on Typefully scheduled endpoint returns ≥ 7, HTTP 200, response is valid JSON array.</pass_criteria>
  <review>cat evidence/phase-C2/vg-2-decision.txt; if flipped: jq 'length' evidence/phase-C2/vg-2-typefully-scheduled.json — must be ≥ 7; jq -e '.[0].scheduled_date' — confirms real scheduled drafts (dates are future ISO timestamps).</review>
  <verdict>PASS → posting strategy stable for remainder of run | FAIL → flip config broken (OAuth expired, API key wrong) → fix real Typefully integration → re-run</verdict>
  <mock_guard>IF tempted to skip the flip by manually touching url.txt files to raise posted count → STOP → posted count must reflect real published threads.</mock_guard>
</validation_gate>

### C2.3 — Pin rotation weekly

**Fix:** Pinned tweet shifts weekly to the prior week's highest-performing thread (most retweets + replies combined). Nick checks X Analytics → "Top Tweets" every Sunday during C6 digest prep, re-pins the winner for the coming week.

**Flagship pin override:** Day 1 (series launch) pinned for 48h regardless; Day 22 (Ralph) and Day 50 (manifesto) each pinned for 7d.

**Verification:** `scripts/syndication/x-pin-log.md` has 1 entry per ISO week. Each entry: `Week NN — pinned: <tweet URL> — reason: <metric>`.

### C2.4 — Reply-guy authority-account strategy

**Fix:** Before posting own thread each day, spend 10 min replying substantively to 3–5 "authority" accounts (builders/researchers with 10k+ followers in agentic AI). Replies must add signal — not "great thread 🚀". This raises visibility of Nick's profile to that audience's algorithmic neighborhood.

**Target list:** `scripts/syndication/x-authority-accounts.txt` — curated 20–30 handles. Seed: `@simonw`, `@swyx`, `@jeremyphoward`, `@latentspacepod`, others from R2 §2.4. Rotate: engage each account ≤2×/week to avoid stalker optics.

**Verification:** Weekly manual scan — reply history shows ≥15 authority-account replies per ISO week.

### C2.5 — UTM tagging (buildUtmUrl helper)

**Fix:** Every CTA tweet uses `buildUtmUrl({ source: 'x', medium: 'social', campaign: \`day${NN}\` })` output. For multi-day arc links (C2.7), add `content` param: `content='thread-of-thread'`.

**Ops:** Phase 12 runner pre-fills the URL with correct UTM in `day-NN.x.md` — Nick should never hand-edit the query string.

**Verification:** `grep -h 'utm_source=x' posts/post-*/day-*.x.md | wc -l` ≥ 45. `grep -h 'utm_source=twitter' posts/post-*/day-*.x.md | wc -l` = 0 (no legacy tag).

### C2.6 — Community hashtag discipline

**Fix:** Only 2 community hashtags per thread, always in final CTA tweet (not Tweet 1 — hashtags in Tweet 1 depress reach per R2 §2.5). Primary + secondary:

```
Primary:   #buildinpublic   (rotate with #ClaudeCode)
Secondary: #AgenticDev     (rotate with #AIEngineering, #DevTools)
```

No `#AI`, `#LLM` — too broad, spam heuristic.

**Verification:** `grep -c '#' posts/post-*/day-*.x.md` per-file ≤2. Tweet 1 has zero hashtags.

### C2.7 — Thread-of-thread linking (multi-day arcs)

**Fix:** When a post extends a prior post's argument (e.g., Day 6 parallel-worktrees follows Day 2 multi-agent-consensus), Tweet 2 references the prior thread:

```
Tweet 2/N — "Context: this builds on Day 2's consensus work → <URL to Day 2 Tweet 1>"
```

This routes returning readers through the archive and raises session depth.

**Mapping:** `scripts/syndication/x-arc-map.json` keys post slug → list of prior-thread URLs. Updated as threads land.

**Verification:** `jq 'keys | length' scripts/syndication/x-arc-map.json` ≥ 8 by Day 45 (rough target: 1 arc link per 5–6 posts).

### C2.8 — X List curation

**Fix:** Create public X List `agentic-dev-field-report` on Day 1. Add:
- Every authority account from C2.4 (seed)
- Every commenter on Days 1/7/14/22 who replied substantively
- Other series-adjacent builders discovered via reply-guy sprint

Pin the List URL on profile bio alongside withagents.dev link. Lists surface in X's recommendation graph and drive follows.

**Verification:** `curl -s https://api.x.com/2/lists/$LIST_ID/members -H "Authorization: Bearer $X_BEARER"` returns ≥40 members by Day 30 (Bearer token is read-only, no posting — allowed without Basic tier).

### C2.9 — Spaces — deferred

**Fix:** Hosting an X Space is NOT part of Track C. Revisit at Day 30 retro. Decision criteria: if follower count ≥ +500 net new AND ≥3 authority accounts DM engage, plan a Day 45 Space co-hosted with one of them. Otherwise defer indefinitely.

**Verification:** Day 30 retro doc records yes/no decision with metric basis.

## File ownership

| File | Owner | Conflict |
|---|---|---|
| `scripts/syndication/x-pin-log.md` (NEW) | C2 | none |
| `scripts/syndication/x-authority-accounts.txt` (NEW) | C2 | none |
| `scripts/syndication/x-arc-map.json` (NEW) | C2 | none |
| `posts/post-NN/evidence/x-thread-NN-url.txt` (NEW per post) | C2 | none |
| `posts/post-NN/day-NN.x.md` | B2 | read-only from C2 |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Nick misses threads (no scheduler until Typefully flip) | HIGH | MED | C2.2 flip trigger at Day 14; Sunday batch-drafts |
| Thread shadowbanned due to link in Tweet 1 | LOW | HIGH | link strictly in final tweet per C2.1 |
| Authority accounts don't reciprocate | MED | LOW | strategy is one-way signal; LinkedIn + newsletter backstop conversion |
| Typefully rate-limits free tier mid-week | MED | LOW | upgrade to $12.50 paid immediately if scheduled-drafts count drops |
| X algorithm change demotes threads in favor of Notes | MED | MED | monitor engagement delta weekly; migrate flagship essays to Notes if reach halves |

## Acceptance criteria

- [ ] 45 threads posted, ≤3 missed days across Day 1–45
- [ ] Zero threads have hashtags in Tweet 1
- [ ] 100% of CTA tweets use `utm_source=x` UTM URL
- [ ] Weekly pin rotation logged Week 1–6
- [ ] ≥15 authority-account replies per ISO week (Weeks 2–6)
- [ ] X List has ≥40 members by Day 30
- [ ] Follower count delta +500 net new by Day 45 (aspirational)

## Verification steps

```bash
# Thread inventory audit
ls posts/post-*/evidence/x-thread-*-url.txt | wc -l  # expect ≥42 by Day 45

# UTM correctness
grep -h 'utm_source=' posts/post-*/day-*.x.md | grep -v 'utm_source=x' && echo "BAD UTM" || echo "ok"

# Tweet 1 hashtag check
for f in posts/post-*/day-*.x.md; do
  head -1 "$f" | grep -q '#' && echo "HASHTAG IN TWEET1: $f"
done

# Pin log
wc -l scripts/syndication/x-pin-log.md  # ≥6 entries by Week 6

# Plausible X UTM sessions
curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" \
  "https://plausible.io/api/v1/stats/aggregate?site_id=withagents.dev&filters=utm_source==x&period=45d"
```

## Rollback

Missed thread = feed gap, no cascade. If Typefully flip destabilizes (API outage, auth expired), fall back to manual same day — threads are pre-written, fallback is copy-paste. Delete mis-posted threads within 5 min per X best practice (deletion within 5 min avoids algorithmic penalty).
