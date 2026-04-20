# Phase C4 — Hacker News (3 submissions)

**Owner:** Nick (submitter + commenter)
**Effort:** ~10h across 3 submissions
**Status:** pending
**Blocks:** none
**Blocked by:** B2 (site live), A3 (functional validation), Day -7 repo-liveness audit (for Day 22 decision)

## Context

HN = highest-quality tech-audience surface, zero-tolerance for promo language. Title editorialization, emoji, or "I built" often flags as self-promo and drops to `[dead]`. Three submissions only — HN account karma depletes fast with low-quality posts, and each miss degrades future reach.

**Locked decisions (parent plan.md #46, #54):**
1. **Day 1:** `Show HN: withagents.dev — 45-day agentic development field report`
2. **Day 22:** Ralph repo (`Show HN: Ralph — hat-based execution loops for Claude Code`) — **conditional** on repo liveness check passing Day -7
3. **Day 50:** Manifesto essay (`The case for functional validation over unit tests in agentic workflows`) — text submission, `Show HN:` NOT used

Skip Day 22 if repo dead. Optional Day 35 skills-package backstop only if Day 22 was skipped AND Day 30 retro shows HN-referral traffic gap. Source: R2 §4.

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

### C4.1 — Submission #1: Day 1 Show HN

**Fix:** Submit between **Tuesday–Thursday, 08:00–10:00 AM PT** for front-page window. Day 1 of the series is Wednesday (TBD per final calendar) — if Day 1 falls on Sat/Sun/Mon, shift HN submission to next Tue-Thu while keeping Day 1 content publishing on the canonical date (i.e., HN submission and Day 1 don't have to collide).

**Title (exactly — HN rules forbid editorializing, clickbait, year tags):**
```
Show HN: withagents.dev – 45-day agentic development field report
```

Use en-dash `–` not em-dash. No year. No emoji. No `(2026)`.

**URL submitted:** `https://withagents.dev/` (NOT a specific post — the site is the "product" per Show HN rules).

**First comment (author note, posted by Nick within 60 seconds of submission):**
```
Author here. withagents.dev is a 45-day trace of actual Claude Code sessions —
~23,000 across 42 days — distilled into 45 essays plus 14 companion repos.
Every code snippet is from a real run, no fabrications.

Why I made this: I wanted to see what falls out of agentic dev workflows
when you run them at saturation. Happy to answer implementation questions
or dig into any specific post. Archive: https://withagents.dev/writing/
```

**Verification:** submission URL captured to `posts/post-01/evidence/hn-submission-day1.txt`. Monitor `news.ycombinator.com/submitted?id=<nick-hn-handle>` for the listing.

<validation_gate id="VG-1" blocking="true">
  <prerequisites>withagents.dev returns 200; Nick's HN account karma checked (≥50); Tue–Thu 08:00–10:00 PT window active; first-comment draft saved</prerequisites>
  <execute>HN_ID=$(cat posts/post-01/evidence/hn-submission-day1.txt | grep -oE 'id=[0-9]+' | head -1); curl -sI "https://news.ycombinator.com/item?${HN_ID}" && curl -s "https://news.ycombinator.com/submitted?id=$NICK_HN_HANDLE" | grep -c "withagents.dev"; START_TS=$(date +%s); COMMENT_TS=$(stat -f %m posts/post-01/evidence/hn-first-comment-day1.txt 2>/dev/null || stat -c %Y posts/post-01/evidence/hn-first-comment-day1.txt); echo "comment_latency=$((COMMENT_TS - START_TS))s"</execute>
  <capture>evidence/phase-C4/vg-1-hn-day1-submission.log</capture>
  <pass_criteria>Submission URL returns HTTP 200; handle's `/submitted` page contains "withagents.dev" (grep count ≥1); first-comment file exists AND comment latency ≤ 60s of submission; title validated by `validate-hn-title.sh` (exit 0); zero "upvote|emoji|newsletter" hits in first-comment grep</pass_criteria>
  <review>READ vg-1-hn-day1-submission.log: verify HN item 200, handle profile shows submission, comment timestamp within 60s window</review>
  <verdict>PASS → proceed | FAIL → fix real system (if flagged, invoke C4.6 mod-email path; never auto-resubmit) → re-run</verdict>
  <mock_guard>IF tempted to claim "Show HN posted" based on an HN ID alone without curl-verifying it shows on the handle's submitted page → STOP → verify visibility</mock_guard>
</validation_gate>

### C4.2 — Submission #2: Day 22 Ralph (CONDITIONAL)

**Fix:** Gate at Day -7: run repo-liveness audit on `ralph-loop-patterns/` (or the canonical Ralph repo name per CLAUDE.md).

**Liveness checks (ALL must pass, evaluated by `scripts/audit/repo-liveness.sh <repo-dir>`):**
- [ ] README has install + quickstart that runs on a fresh clone (manual read — script cannot judge)
- [ ] Repo has ≥1 commit within last **30 days**; latest commit on default branch < 30d old
- [ ] License present in repo root (MIT or Apache-2.0) — `LICENSE` file parseable
- [ ] Language-appropriate test suite exits 0 on fresh clone (see repo-liveness.sh detection below)
- [ ] **CI badge green** = GitHub Actions workflow exists in `.github/workflows/` AND the latest workflow run on the default branch reports `conclusion=success` (per `gh run list --branch <default> --limit 1 --json conclusion`)
- [ ] **≥10 commits total** on default branch (`git rev-list --count <default>`)

**`scripts/audit/repo-liveness.sh <repo-dir>` (NEW, parent repo `/Users/nick/Desktop/blog-series/scripts/audit/`):**

```bash
#!/usr/bin/env bash
# Usage: repo-liveness.sh <repo-dir>
# Detects language (via .liveness.json override OR manifest sniff) and runs
# the appropriate test command. Exits 0 on all-pass, non-zero otherwise.
set -euo pipefail
REPO="$1"
cd "$REPO"

# 1. Language detection — explicit override wins
if [ -f .liveness.json ]; then
  LANG=$(jq -r '.language' .liveness.json)
  TEST_CMD=$(jq -r '.test_command // empty' .liveness.json)
elif [ -f package.json ]; then
  LANG=node; TEST_CMD="${TEST_CMD:-npm test}"
elif [ -f pyproject.toml ] || [ -f setup.py ] || [ -f requirements.txt ]; then
  LANG=python; TEST_CMD="${TEST_CMD:-pytest}"
elif [ -f Cargo.toml ]; then
  LANG=rust; TEST_CMD="${TEST_CMD:-cargo test}"
elif [ -f go.mod ]; then
  LANG=go; TEST_CMD="${TEST_CMD:-go test ./...}"
elif [ -f Gemfile ]; then
  LANG=ruby; TEST_CMD="${TEST_CMD:-bundle exec rspec}"
else
  echo "FAIL: cannot detect language"; exit 2
fi

# 2. Commit recency (< 30d)
LAST_DAYS=$(( ($(date +%s) - $(git log -1 --format=%ct)) / 86400 ))
[ "$LAST_DAYS" -lt 30 ] || { echo "FAIL: last commit $LAST_DAYS d ago"; exit 3; }

# 3. Commit count (>= 10)
DEFAULT=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's|origin/||' || echo main)
COMMITS=$(git rev-list --count "$DEFAULT")
[ "$COMMITS" -ge 10 ] || { echo "FAIL: only $COMMITS commits on $DEFAULT"; exit 4; }

# 4. License present
[ -f LICENSE ] || [ -f LICENSE.md ] || { echo "FAIL: no LICENSE"; exit 5; }

# 5. CI badge green (GitHub Actions)
if [ -d .github/workflows ]; then
  CONCLUSION=$(gh run list --branch "$DEFAULT" --limit 1 --json conclusion -q '.[0].conclusion' || echo missing)
  [ "$CONCLUSION" = "success" ] || { echo "FAIL: latest CI on $DEFAULT = $CONCLUSION"; exit 6; }
else
  echo "FAIL: no .github/workflows (CI badge cannot be green)"; exit 7
fi

# 6. Tests pass
echo "Running: $TEST_CMD (lang=$LANG)"
eval "$TEST_CMD" || { echo "FAIL: $TEST_CMD exit $?"; exit 8; }

echo "PASS: $REPO (lang=$LANG, commits=$COMMITS, last=$LAST_DAYS d)"
```

Each companion repo may include `.liveness.json` at root to override detection:
```json
{"language": "python", "test_command": "python3 -m pytest tests/"}
```

Ralph specifically: per CLAUDE.md Ralph is Python. `ralph-loop-patterns/` should ship `.liveness.json` with `{"language": "python", "test_command": "python3 -m pytest"}` to eliminate detection ambiguity.

**If ALL pass:** submit Day 22 (Tue-Thu 08:00–10:00 PT) with title:
```
Show HN: Ralph – hat-based execution loops for Claude Code agents
```

**If ANY fail:** skip. Log skip reason to `plans/reports/hn-submissions.md`. Do NOT substitute with another repo on that day.

**First comment (if submitted):**
```
Author here. Ralph is the loop pattern I ended up with after trying hat-based
agent orchestration — one agent adopts a role via a "hat" prompt, runs a
bounded loop, reports, switches hats. Code: <repo URL>. Happy to walk through
the 3 patterns that actually held up in production and the 2 that didn't.
```

**Verification:** `plans/reports/hn-submissions.md` records either submission URL or skip reason + liveness-check results. Screenshot of repo CI badge green captured to `posts/post-08/evidence/ralph-ci-green.png`.

<validation_gate id="VG-2" blocking="true">
  <prerequisites>Day -7 reached; `scripts/audit/repo-liveness.sh` deployed; Ralph repo cloned locally</prerequisites>
  <execute>scripts/audit/repo-liveness.sh ./ralph-loop-patterns; LIVENESS_EXIT=$?; if [ $LIVENESS_EXIT -eq 0 ]; then HN_URL=$(grep -oE 'news.ycombinator.com/item[^ ]+' plans/reports/hn-submissions.md | head -1); curl -sI "$HN_URL" && curl -s "https://news.ycombinator.com/submitted?id=$NICK_HN_HANDLE" | grep -ciE 'ralph|loop'; else grep -E "Day 22.*(SKIP|skipped)" plans/reports/hn-submissions.md; fi</execute>
  <capture>evidence/phase-C4/vg-2-hn-day22-ralph.log</capture>
  <pass_criteria>Either (a) repo-liveness.sh exit 0 (all 6 checks passed) AND HN item URL 200 AND handle's submitted page shows ralph/loop string AND CI-green screenshot >0 bytes; OR (b) liveness failed → skip row recorded with exit code + failing check name cited</pass_criteria>
  <review>READ vg-2-hn-day22-ralph.log: confirm PASS-branch or SKIP-branch resolved with evidence; no "TBD" or empty entry</review>
  <verdict>PASS → proceed | FAIL → fix real system (either fix repo to pass liveness or record skip with documented failure) → re-run</verdict>
  <mock_guard>IF tempted to submit Ralph to HN without repo-liveness.sh passing → STOP → a dead-repo Show HN burns account karma and kills Day 50</mock_guard>
</validation_gate>

### C4.3 — Submission #3: Day 50 Manifesto

**Fix:** Submit the manifesto essay as a **text submission** (not `Show HN:`). Manifestos aren't products. Use the essay's title verbatim.

**Title:**
```
The case for functional validation over unit tests in agentic workflows
```

**URL submitted:** `https://withagents.dev/writing/<manifesto-slug>/`

**First comment:**
```
Author here. After ~23k Claude Code sessions I stopped writing unit tests
entirely and validated everything functionally — running the real system,
capturing evidence. This essay is the long-form case for that shift.
Curious if anyone's seen agentic workflows where unit tests still earn
their keep.
```

**Timing:** Tue-Thu 08:00–10:00 PT. Day 50 should already fall in that window if calendar is sensibly aligned; if not, shift submission only (essay still publishes Day 50 on withagents.dev).

**Verification:** submission URL in `plans/reports/hn-submissions.md`. `posts/post-45/evidence/hn-submission-day50.txt` has the URL.

<validation_gate id="VG-3" blocking="true">
  <prerequisites>Manifesto essay published at withagents.dev/writing/<slug>/ (returns 200); Day 50 Tue–Thu window; first-comment draft</prerequisites>
  <execute>MANIFESTO_URL=$(grep -oE 'https://withagents.dev/writing/[^ ]+' posts/post-45/evidence/hn-submission-day50.txt | head -1); curl -o /dev/null -s -w "%{http_code}\n" "$MANIFESTO_URL"; HN_ITEM=$(grep -oE 'news.ycombinator.com/item\?id=[0-9]+' posts/post-45/evidence/hn-submission-day50.txt); curl -sI "https://$HN_ITEM"; curl -s "https://news.ycombinator.com/submitted?id=$NICK_HN_HANDLE" | grep -c "functional validation"; grep -c "^Show HN:" posts/post-45/evidence/hn-submission-day50.txt</execute>
  <capture>evidence/phase-C4/vg-3-hn-day50-manifesto.log</capture>
  <pass_criteria>Essay URL returns 200; HN item URL returns 200; handle's submitted page contains "functional validation"; title does NOT start with "Show HN:" (count = 0); first-comment latency ≤60s</pass_criteria>
  <review>READ vg-3-hn-day50-manifesto.log: confirm all curl returns + zero Show-HN prefix (manifestos are text submissions, not products)</review>
  <verdict>PASS → proceed | FAIL → fix real system (re-title, re-submit only if flag-dead protocol allows) → re-run</verdict>
  <mock_guard>IF tempted to prefix manifesto with "Show HN:" because it worked Day 1 → STOP → Show HN is products only; manifestos flagged as editorial-promo</mock_guard>
</validation_gate>

### C4.4 — Title crafting rules

**Fix:** HN title guidelines enforce:
- Max 80 chars (hard)
- No "the best X", no "how I…", no "I made"
- No emoji
- En-dash `–` for subtitle, not colon or em-dash
- No year, version number, or "(2026)"
- `Show HN:` prefix only when submitting a thing you built (site, repo, tool) — not for essays

**Validation script:**
```bash
# scripts/syndication/validate-hn-title.sh "<title>"
title="$1"
[ ${#title} -le 80 ] || { echo "FAIL: >80 chars"; exit 1; }
echo "$title" | grep -qE '(best|how I|I made|🚀|🎉|\([0-9]{4}\))' && { echo "FAIL: editorialized"; exit 1; }
echo "ok"
```

**Verification:** run the script on all 3 titles before each submission. `scripts/syndication/hn-titles-approved.md` lists the exact strings.

<validation_gate id="VG-4" blocking="true">
  <prerequisites>`scripts/syndication/validate-hn-title.sh` exists and is executable; all 3 titles drafted in `hn-titles-approved.md`</prerequisites>
  <execute>for t in "Show HN: withagents.dev – 45-day agentic development field report" "Show HN: Ralph – hat-based execution loops for Claude Code agents" "The case for functional validation over unit tests in agentic workflows"; do scripts/syndication/validate-hn-title.sh "$t" || echo "FAIL: $t"; done; grep -cE '^- ' scripts/syndication/hn-titles-approved.md</execute>
  <capture>evidence/phase-C4/vg-4-title-validation.log</capture>
  <pass_criteria>All 3 titles output "ok" (exit 0); `hn-titles-approved.md` has ≥3 bullet entries; no emoji/year/editorialization detected</pass_criteria>
  <review>READ vg-4-title-validation.log: three "ok" lines, zero "FAIL:" lines</review>
  <verdict>PASS → proceed | FAIL → fix real system (rewrite titles, re-run validator) → re-run</verdict>
  <mock_guard>IF tempted to skip title validation because "the script says ok already" without re-running → STOP → titles are immutable post-submission; re-run every time</mock_guard>
</validation_gate>

### C4.5 — First-comment author protocol

**Fix:** Every submission gets Nick's author comment within 60s (not at submission time — HN auto-flags simultaneous URL+comment as spam per R2 §4.3). Comment must:
- Identify self as author in line 1
- State what the thing is in ≤2 sentences
- Explain motivation in ≤2 sentences
- End with a question or "happy to answer Xs"

**No's:** no marketing copy, no "please upvote", no links beyond the one already submitted, no CTAs to newsletter.

**Verification:** grep check — each `posts/post-*/evidence/hn-first-comment-*.txt` has these 4 elements and fails if it contains `upvote`, `subscribe`, `newsletter`, `📣`, or any emoji.

<validation_gate id="VG-5" blocking="true">
  <prerequisites>First-comment text files drafted at `posts/post-*/evidence/hn-first-comment-*.txt` per submission</prerequisites>
  <execute>for f in posts/post-*/evidence/hn-first-comment-*.txt; do echo "=== $f ==="; grep -iE '(upvote|subscribe|newsletter|🚀|🎉|📣)' "$f" && echo "BAD: $f" || echo "CLEAN: $f"; grep -cE '^(Author here|I am the author|I made)' "$f"; wc -l "$f"; done</execute>
  <capture>evidence/phase-C4/vg-5-first-comment-audit.log</capture>
  <pass_criteria>Zero "BAD:" lines across all first-comment files; each file has author-identifier on line 1 (count ≥1 per file); each file contains question mark or "happy to answer" phrase (proxy for engagement invite)</pass_criteria>
  <review>READ vg-5-first-comment-audit.log: every file shows CLEAN + author-id count ≥1</review>
  <verdict>PASS → proceed | FAIL → fix real system (rewrite comment, remove banned tokens) → re-run</verdict>
  <mock_guard>IF tempted to add "Subscribe to the newsletter" in author comment "just this once" → STOP → HN auto-flags marketing in first comment</mock_guard>
</validation_gate>

### C4.6 — Flag-for-dead recovery protocol

**Fix:** If submission reaches `[flagged]` or `[dead]` within first 30 min:
1. Do NOT re-submit (auto-dead propagates to second submission within 24h)
2. Do NOT ask in the comments for unflagging
3. Email `hn@ycombinator.com` once, politely, subject: `Show HN flag review: <title>`. Body: 3 sentences, cite authorship, link submission.
4. Wait 48h. If unflagged, thread is preserved. If not, accept the L, document in `hn-submissions.md`, and do not resubmit for 60d.

**Anti-pattern:** asking friends to "vouch" via private DM — this pattern is detectable and burns karma further.

**Verification:** any `[dead]` event logged with timestamp, email-to-mods record, and final disposition.

<validation_gate id="VG-6" blocking="false">
  <prerequisites>Only triggered if any submission reaches [dead] or [flagged] within first 30 min (check via `curl -s 'https://news.ycombinator.com/item?id=<ID>' | grep -c '\[dead\]\|\[flagged\]'`)</prerequisites>
  <execute>grep -E '\[dead\]|\[flagged\]|mod-email' plans/reports/hn-submissions.md; grep -c 'resubmit' plans/reports/hn-submissions.md; ls plans/reports/hn-mod-email-*.txt 2>/dev/null</execute>
  <capture>evidence/phase-C4/vg-6-flag-recovery.log</capture>
  <pass_criteria>If any dead/flagged event recorded: mod-email file exists with subject "Show HN flag review"; zero resubmit attempts within 60d (resubmit count = 0); final disposition noted (unflagged / accepted-L)</pass_criteria>
  <review>READ vg-6-flag-recovery.log: confirm mod-email artifact + zero resubmit + disposition recorded; if no flag events, gate auto-passes with "N/A: no flag events"</review>
  <verdict>PASS → proceed | FAIL → fix real system (follow mod-email protocol, do NOT resubmit) → re-run</verdict>
  <mock_guard>IF tempted to resubmit a flagged HN post from a different account → STOP → HN shadow-ban heuristics detect this and kill all future submissions</mock_guard>
</validation_gate>

### C4.7 — Author-only engagement (no sockpuppets)

**Fix:** Nick responds to every top-level comment within 15 min for the first 4h of the thread. No secondary HN accounts. No coordinated replies from friends. HN's shadow-ban heuristics catch coordination fast.

**Target engagement volume:** 20+ author replies on a front-page thread (Day 1 flagship); 10+ on Day 22 and Day 50.

**Verification:** HN thread URL → screenshot captured at +6h showing author-reply density. `posts/post-NN/evidence/hn-thread-NN.png`.

<validation_gate id="VG-7" blocking="true">
  <prerequisites>Submission live; +6h post-submission mark reached</prerequisites>
  <execute>for post in post-01 post-08 post-45; do SCREENSHOT="posts/$post/evidence/hn-thread-*.png"; ls -la $SCREENSHOT 2>/dev/null; HN_ID=$(grep -oE 'id=[0-9]+' posts/$post/evidence/hn-submission-*.txt 2>/dev/null | head -1); if [ -n "$HN_ID" ]; then curl -s "https://news.ycombinator.com/item?$HN_ID" | grep -c "user=$NICK_HN_HANDLE"; fi; done</execute>
  <capture>evidence/phase-C4/vg-7-author-engagement.log</capture>
  <pass_criteria>For Day 1 thread: author-reply count ≥20 (Nick's handle appears ≥20 times in item HTML); for Day 22/50 threads: ≥10 each; screenshot files exist and >0 bytes; zero secondary handles appear co-replying</pass_criteria>
  <review>READ vg-7-author-engagement.log: count handle occurrences per thread, verify screenshots exist</review>
  <verdict>PASS → proceed | FAIL → fix real system (more replies before +6h) → re-run</verdict>
  <mock_guard>IF tempted to ask a friend to post a supporting reply under their HN account → STOP → coordination is detectable and burns karma</mock_guard>
</validation_gate>

### C4.8 — Day 35 skills-package backstop (conditional fallback)

**Fix:** ONLY IF Day 22 Ralph submission was skipped (C4.2) AND Day 30 retro shows HN-referral sessions < 200 total, THEN consider a Day 35 submission of `claude-code-skills-factory` as `Show HN: A factory for Claude Code skills and agents`.

**Decision gate:** Day 30 retro explicitly evaluates the two conditions. Default is to SKIP — 3 HN submissions in 50 days is already heavy. 4 is the hard ceiling.

**Verification:** Day 30 retro doc has yes/no decision on Day 35 HN with metric basis. If yes, Day 35 follows C4.4/C4.5 protocol.

<validation_gate id="VG-8" blocking="false">
  <prerequisites>Day 30 retro reached; Day 22 outcome recorded (submitted OR skipped); HN-referral Plausible metric captured</prerequisites>
  <execute>grep -E 'Day 22.*(skip|submitted)' plans/reports/hn-submissions.md; curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" "https://plausible.io/api/v1/stats/aggregate?site_id=withagents.dev&filters=source==HackerNews&period=30d" | jq -r '.results.visitors.value'; grep -E "Day 35 HN: (yes|no)" plans/phase-12-retro/day-30-retro.md</execute>
  <capture>evidence/phase-C4/vg-8-day35-backstop-decision.log</capture>
  <pass_criteria>Retro doc contains explicit "Day 35 HN: yes" or "Day 35 HN: no" with numeric metric basis (HN sessions count cited); if yes → Day 22 was skipped AND HN sessions <200 both confirmed; default is no</pass_criteria>
  <review>READ vg-8-day35-backstop-decision.log: confirm decision recorded with metric; never silent skip</review>
  <verdict>PASS → proceed | FAIL → fix real system (record retro decision with data) → re-run</verdict>
  <mock_guard>IF tempted to fire a 4th HN submission "for safety" without meeting both trigger conditions → STOP → 4 submissions in 50d burns account karma</mock_guard>
</validation_gate>

## File ownership

| File | Owner | Conflict |
|---|---|---|
| `plans/reports/hn-submissions.md` (NEW) | C4 | none |
| `scripts/syndication/validate-hn-title.sh` (NEW) | C4 | none |
| `scripts/audit/repo-liveness.sh` (NEW, lives in parent repo) | C4 | reused by any future repo-liveness gate |
| `<companion-repo>/.liveness.json` (OPTIONAL per repo) | companion-repo owner | none |
| `scripts/syndication/hn-titles-approved.md` (NEW) | C4 | none |
| `posts/post-01/evidence/hn-*.{txt,png}` (NEW) | C4 | none |
| `posts/post-08/evidence/ralph-ci-green.png` (NEW, conditional) | C4 | none |
| `posts/post-45/evidence/hn-*.{txt,png}` (NEW) | C4 | none |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Day 1 submission goes `[dead]` | MED | HIGH | C4.6 polite mod-email; no resubmit; accept L |
| Ralph repo fails liveness check | MED | MED | C4.2 skip — don't force a weak submission |
| Nick's HN account has low karma (< 50) | LOW | MED | check karma Day -10; if low, an older-account friend submits with Nick as first-comment author (rare but allowed — HN guidelines permit hunters) |
| Manifesto essay doesn't land (niche topic) | MED | LOW | text submissions often underperform — set expectations, no launch-day marketing noise |
| Simultaneous HN + LinkedIn + X on Day 1 overwhelms Nick's response bandwidth | MED | MED | dedicate 09:00–13:00 PT to HN (highest-value audience), auto-reply window for LI/X after 13:00 |

## Acceptance criteria

- [ ] Day 1 submission posted Tue-Thu 08:00–10:00 PT, first comment within 60s
- [ ] Day 22 submission either posted (if liveness passed) or skipped with documented reason
- [ ] Day 50 manifesto submission posted as text (not Show HN:)
- [ ] All titles pass `validate-hn-title.sh` before submission
- [ ] Zero occurrences of "upvote", emoji, or marketing copy in any first comment (grep audit)
- [ ] Author-reply density ≥ 20 on Day 1 thread, ≥ 10 on Day 22/50 threads
- [ ] `hn-submissions.md` records all 3 submission URLs (or skip reasons)

## Verification steps

```bash
# Title validation
for t in "Show HN: withagents.dev – 45-day agentic development field report" \
         "Show HN: Ralph – hat-based execution loops for Claude Code agents" \
         "The case for functional validation over unit tests in agentic workflows"; do
  scripts/syndication/validate-hn-title.sh "$t"
done

# First-comment cleanliness
for f in posts/post-*/evidence/hn-first-comment-*.txt; do
  grep -iE '(upvote|subscribe|newsletter|🚀|🎉)' "$f" && echo "BAD: $f"
done

# Submission inventory
grep -c '^- ' plans/reports/hn-submissions.md  # expect 2 or 3

# Ralph liveness (Day -7) — language-agnostic
/Users/nick/Desktop/blog-series/scripts/audit/repo-liveness.sh \
  /Users/nick/Desktop/blog-series/ralph-loop-patterns
# Expect: exit 0 with "PASS: ... (lang=python, commits=N, last=<30d)"
# Non-zero exit → document reason in hn-submissions.md and skip Day 22

# HN-referral Plausible audit (Day 30)
curl -s -H "Authorization: Bearer $PLAUSIBLE_API_KEY" \
  "https://plausible.io/api/v1/stats/aggregate?site_id=withagents.dev&filters=source==HackerNews&period=30d"
```

## Rollback

HN submissions cannot be deleted or edited by the submitter. If a submission is flagged-dead, it stays in the author's submission history permanently. Only rollback path is the mod-email process in C4.6. Treat each submission as one-shot; do not submit without full C4.4 + C4.5 readiness.

<gate_manifest>
  <total_gates>8</total_gates>
  <sequence>VG-1 → VG-2 → VG-3 → VG-4 → VG-5 → VG-6 → VG-7 → VG-8</sequence>
  <policy>All gates BLOCKING unless explicitly marked blocking="false" (VG-6 flag-recovery and VG-8 Day-35 backstop are conditional review-points).</policy>
  <evidence_dir>evidence/phase-C4/</evidence_dir>
  <regression>On FAIL: fix real system → re-run; deferrals document in plans/phase-12-retro/ with trigger date.</regression>
</gate_manifest>
