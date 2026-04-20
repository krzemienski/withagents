# Phase A2 — Content Verification + P10 Date-Anomaly Root-Cause

**Owner:** Sonnet executor
**Effort:** 2–4h
**Status:** pending
**Blocks:** B3 daily runbook (can't dispatch misdated posts)

## Context

- `plans/reports/ckm-audit-cohort{1,2,3}-260419.md` filed. User flagged audit-agent outputs need spot-verification — cohort agents may have claimed fixes they never made.
- `plans/reports/remediation-260419-1146-final-push.md` identifies 11 P10 date frontmatter anomalies (5 days at +7, 5 placeholders at today, 1 at +7 in week 8). Mechanical fix landed but root-cause (phase-10 agent assignment doc) still carries the bad formula.

<mock_detection_protocol>
Before executing any task, check intent:
- Creating .test.*, _test.*, *Tests.*, test_* files → STOP
- Importing mock libraries (nock, sinon, jest.mock, unittest.mock) → STOP
- Creating in-memory databases (SQLite :memory:, H2) → STOP
- Adding TEST_MODE or NODE_ENV=test flags → STOP
- Stubbing API responses, fake DNS, mock DB drivers → STOP
Fix the REAL system instead. No exceptions.
</mock_detection_protocol>

## Tasks

### A2.1 Audit-agent spot-verify (90 min)

Goal: for each cohort, sample 1 finding → confirm against real file state. If agent claim matches file, flag cohort PASS. If not, re-run the cohort.

Cohort 1 sample (Cohort 1 flagged 5 critical defects):
```bash
grep -n '/posts/day-03' withagents-site/src/content/posts/day-03-read-to-write-ratio.linkedin.md
# If 0 matches → fix landed. If matches → cohort-1 claim false.

grep -n 'Day 58' withagents-site/src/content/posts/day-10-ccb-evolution.mdx
# If 0 matches → fix landed.
```

Cohort 2 sample (day-31 TODO placeholder):
```bash
grep -c 'TODO(day-31-metrics)' withagents-site/src/content/posts/day-31-week-4-retro-devlog.mdx
# Expect 0 or placeholder rewritten.
```

Cohort 3 sample (day-50 X tweet 5/14 char count):
```bash
# Tweet 5 must be ≤280 chars after trim
python3 -c "
import re, sys
text = open('withagents-site/src/content/posts/day-50-sessionforge-codestories-manifesto.x.md').read()
tweets = re.findall(r'<!-- Tweet (\d+) \[(\d+) chars\] -->', text)
for n, c in tweets:
    if int(n) == 5: print(f'Tweet 5: {c} chars', 'OK' if int(c) <= 280 else 'FAIL')
"
```

Write findings inline into `plans/reports/planner-260419-1208-audit-spotverify.md` (one table: cohort, sampled-claim, file-truth, verdict PASS/REDO).

<validation_gate id="VG-1" blocking="true">
  <prerequisites>Audit cohort reports at `plans/reports/ckm-audit-cohort{1,2,3}-260419.md` exist; three target post files committed (`day-03-read-to-write-ratio.linkedin.md`, `day-10-ccb-evolution.mdx`, `day-31-week-4-retro-devlog.mdx`, `day-50-sessionforge-codestories-manifesto.x.md`); Python 3 available.</prerequisites>
  <execute>mkdir -p evidence/phase-A2 && grep -cE '/posts/day-03' withagents-site/src/content/posts/day-03-read-to-write-ratio.linkedin.md > evidence/phase-A2/vg-1-c1-day03-hits.txt && grep -cE 'Day 58' withagents-site/src/content/posts/day-10-ccb-evolution.mdx > evidence/phase-A2/vg-1-c1-day10-hits.txt && grep -c 'TODO(day-31-metrics)' withagents-site/src/content/posts/day-31-week-4-retro-devlog.mdx > evidence/phase-A2/vg-1-c2-day31-hits.txt && python3 -c "
import re
text = open('withagents-site/src/content/posts/day-50-sessionforge-codestories-manifesto.x.md').read()
for n, c in re.findall(r'<!-- Tweet (\d+) \[(\d+) chars\] -->', text):
    if int(n) == 5:
        print(f'Tweet 5: {c} chars ' + ('OK' if int(c) <= 280 else 'FAIL'))
" > evidence/phase-A2/vg-1-c3-tweet5.txt && { echo "# Spot-verify"; echo "cohort,sampled-claim,file-truth,verdict"; echo "C1,day03-old-path-removed,$(cat evidence/phase-A2/vg-1-c1-day03-hits.txt),$([ $(cat evidence/phase-A2/vg-1-c1-day03-hits.txt) -eq 0 ] && echo PASS || echo REDO)"; echo "C1,day10-day58-ref-removed,$(cat evidence/phase-A2/vg-1-c1-day10-hits.txt),$([ $(cat evidence/phase-A2/vg-1-c1-day10-hits.txt) -eq 0 ] && echo PASS || echo REDO)"; echo "C2,day31-todo-cleared,$(cat evidence/phase-A2/vg-1-c2-day31-hits.txt),$([ $(cat evidence/phase-A2/vg-1-c2-day31-hits.txt) -eq 0 ] && echo PASS || echo REDO)"; echo "C3,day50-tweet5-<=280,$(cat evidence/phase-A2/vg-1-c3-tweet5.txt),$(grep -q OK evidence/phase-A2/vg-1-c3-tweet5.txt && echo PASS || echo REDO)"; } | tee plans/reports/planner-260419-1208-audit-spotverify.md</execute>
  <capture>evidence/phase-A2/vg-1-c1-day03-hits.txt, evidence/phase-A2/vg-1-c1-day10-hits.txt, evidence/phase-A2/vg-1-c2-day31-hits.txt, evidence/phase-A2/vg-1-c3-tweet5.txt, plans/reports/planner-260419-1208-audit-spotverify.md</capture>
  <pass_criteria>`cat evidence/phase-A2/vg-1-c1-day03-hits.txt` = 0 AND `cat evidence/phase-A2/vg-1-c1-day10-hits.txt` = 0 AND `cat evidence/phase-A2/vg-1-c2-day31-hits.txt` = 0 AND `grep -c 'OK' evidence/phase-A2/vg-1-c3-tweet5.txt` = 1; report file contains 4 rows and zero `REDO` verdicts.</pass_criteria>
  <review>`cat plans/reports/planner-260419-1208-audit-spotverify.md` — confirm all rows PASS; `cat evidence/phase-A2/vg-1-c3-tweet5.txt` shows `OK`.</review>
  <verdict>PASS → proceed to VG-2 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to mark a cohort PASS without opening the actual file → STOP → re-run the grep against the real file path.</mock_guard>
</validation_gate>

### A2.2 P10 arc-date formula patch (60 min)

**Root cause:** phase-10 agent assignment docs didn't specify the formula `date = launch_date + (day_n - 1)`. Each cohort agent invented their own mapping:
- C9 cohort: used 2026-04-26 as anchor (+7 days)
- C7 cohort: used today's date as placeholder

**Fix:** edit `plans/260419-0241-agentic-dog-brand-launch/staging/phase-10-agent-assignments.md`:
- Add at top of "Frontmatter invariants" section:
  ```
  ## Date formula (CANONICAL)

  frontmatter.date = LAUNCH_DATE + (day_n - 1)

  LAUNCH_DATE is read from `.launch-date` at repo root (YYYY-MM-DD).
  For pre-Day-1 drafting, use launch_date = 2026-04-19 as placeholder; correct via mechanical rewrite once `.launch-date` is set.
  Off-days (6, 30, 32, 33) still receive a date — the frontmatter governs sort order regardless of publish status.
  ```
- Add smoke-check recipe at bottom:
  ```bash
  # Verify every post's frontmatter date == launch + (day-1)
  python3 scripts/verify-post-dates.py --launch-date "$(cat .launch-date)"
  ```

<validation_gate id="VG-2" blocking="true">
  <prerequisites>`plans/260419-0241-agentic-dog-brand-launch/staging/phase-10-agent-assignments.md` exists and is writable; formula patch committed.</prerequisites>
  <execute>mkdir -p evidence/phase-A2 && grep -cE 'frontmatter\.date = LAUNCH_DATE \+ \(day_n - 1\)' plans/260419-0241-agentic-dog-brand-launch/staging/phase-10-agent-assignments.md > evidence/phase-A2/vg-2-formula-hits.txt && grep -cE 'verify-post-dates\.py' plans/260419-0241-agentic-dog-brand-launch/staging/phase-10-agent-assignments.md > evidence/phase-A2/vg-2-smoke-recipe-hits.txt && grep -cE 'Date formula \(CANONICAL\)' plans/260419-0241-agentic-dog-brand-launch/staging/phase-10-agent-assignments.md > evidence/phase-A2/vg-2-canonical-heading-hits.txt</execute>
  <capture>evidence/phase-A2/vg-2-formula-hits.txt, evidence/phase-A2/vg-2-smoke-recipe-hits.txt, evidence/phase-A2/vg-2-canonical-heading-hits.txt</capture>
  <pass_criteria>`cat evidence/phase-A2/vg-2-formula-hits.txt` >= 1 AND `cat evidence/phase-A2/vg-2-smoke-recipe-hits.txt` >= 1 AND `cat evidence/phase-A2/vg-2-canonical-heading-hits.txt` >= 1.</pass_criteria>
  <review>`grep -nE 'CANONICAL|LAUNCH_DATE|verify-post-dates' plans/260419-0241-agentic-dog-brand-launch/staging/phase-10-agent-assignments.md`.</review>
  <verdict>PASS → proceed to VG-3 | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to duplicate the formula into a separate new file rather than patching the canonical assignment doc → STOP → edit the real source.</mock_guard>
</validation_gate>

### A2.3 Create `scripts/verify-post-dates.py` (60 min)

New script, 30–50 lines. Reads every `day-NN-*.mdx` frontmatter, computes expected date, prints mismatches.
```python
#!/usr/bin/env python3
"""Verify every post's frontmatter.date matches launch_date + (day_n - 1)."""
import argparse, datetime as dt, pathlib, re, sys

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--launch-date', required=True)
    ap.add_argument('--posts-dir', default='withagents-site/src/content/posts')
    args = ap.parse_args()

    launch = dt.date.fromisoformat(args.launch_date)
    posts = sorted(pathlib.Path(args.posts_dir).glob('day-*.mdx'))
    fails = 0
    for p in posts:
        m = re.match(r'day-(\d+)-', p.name)
        if not m: continue
        day_n = int(m.group(1))
        expected = launch + dt.timedelta(days=day_n - 1)
        body = p.read_text()
        dm = re.search(r'^date:\s*["\']?(\d{4}-\d{2}-\d{2})', body, re.M)
        if not dm:
            print(f'FAIL {p.name}: no date frontmatter'); fails += 1; continue
        actual = dt.date.fromisoformat(dm.group(1))
        if actual != expected:
            print(f'FAIL {p.name}: expected {expected}, got {actual} (delta={(actual-expected).days}d)')
            fails += 1
    print(f'{len(posts)} posts checked, {fails} failures')
    sys.exit(1 if fails else 0)

if __name__ == '__main__':
    main()
```

## File ownership

| File | Owner |
|---|---|
| `plans/reports/planner-260419-1208-audit-spotverify.md` (NEW) | A2 |
| `plans/260419-0241-agentic-dog-brand-launch/staging/phase-10-agent-assignments.md` | A2 |
| `scripts/verify-post-dates.py` (NEW) | A2 |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Spot-verify reveals cohort-N fixes never landed | MED | HIGH | re-run that cohort's fixes in A5 polish pass; block B3 until re-verified |
| `.launch-date` not yet committed → formula needs placeholder | HIGH | LOW | script defaults `--launch-date 2026-04-19` for drafting; re-run Day −2 after lock |
| Off-day date drift | LOW | LOW | script treats off-days identically (formula-driven) |

## Acceptance criteria

- [ ] 1 sampled finding per cohort verified against file state; spot-verify report filed
- [ ] phase-10-agent-assignments.md contains canonical date formula + smoke-check recipe
- [ ] `scripts/verify-post-dates.py --launch-date 2026-04-19` exits 0 (all 45 posts match formula)
- [ ] CI-ready: script returns non-zero on any mismatch (verified by mutation test)

## Verification

```bash
python3 scripts/verify-post-dates.py --launch-date 2026-04-19
# Expect: "45 posts checked, 0 failures", exit 0

# Mutation test — temporarily bad-date one post
sed -i.bak 's/^date: "2026-04-19"/date: "2026-01-01"/' withagents-site/src/content/posts/day-01-validationforge-ga.mdx
python3 scripts/verify-post-dates.py --launch-date 2026-04-19
# Expect: "FAIL day-01-*: expected 2026-04-19, got 2026-01-01", exit 1
mv withagents-site/src/content/posts/day-01-validationforge-ga.mdx.bak withagents-site/src/content/posts/day-01-validationforge-ga.mdx
```

<validation_gate id="VG-3" blocking="true">
  <prerequisites>`scripts/verify-post-dates.py` committed and `chmod +x`; `withagents-site/src/content/posts/day-01-validationforge-ga.mdx` exists; Python 3 available; 45 `day-*.mdx` files present (`ls withagents-site/src/content/posts/day-*.mdx | wc -l` >= 45).</prerequisites>
  <execute>mkdir -p evidence/phase-A2 && python3 scripts/verify-post-dates.py --launch-date 2026-04-19 2>&1 | tee evidence/phase-A2/vg-3-happy-path.log; echo "happy_exit=$?" >> evidence/phase-A2/vg-3-happy-path.log && cp withagents-site/src/content/posts/day-01-validationforge-ga.mdx evidence/phase-A2/vg-3-day01.bak && sed -i.tmp 's/^date: "2026-04-19"/date: "2026-01-01"/' withagents-site/src/content/posts/day-01-validationforge-ga.mdx && python3 scripts/verify-post-dates.py --launch-date 2026-04-19 2>&1 | tee evidence/phase-A2/vg-3-mutation.log; echo "mutation_exit=$?" >> evidence/phase-A2/vg-3-mutation.log; cp evidence/phase-A2/vg-3-day01.bak withagents-site/src/content/posts/day-01-validationforge-ga.mdx; rm -f withagents-site/src/content/posts/day-01-validationforge-ga.mdx.tmp</execute>
  <capture>evidence/phase-A2/vg-3-happy-path.log, evidence/phase-A2/vg-3-mutation.log, evidence/phase-A2/vg-3-day01.bak</capture>
  <pass_criteria>Happy-path log contains `0 failures` AND `happy_exit=0`; mutation log contains `FAIL day-01` AND `expected 2026-04-19, got 2026-01-01` AND `mutation_exit=1`; original file restored (`diff evidence/phase-A2/vg-3-day01.bak withagents-site/src/content/posts/day-01-validationforge-ga.mdx` empty).</pass_criteria>
  <review>`tail -3 evidence/phase-A2/vg-3-happy-path.log evidence/phase-A2/vg-3-mutation.log` and confirm the mutation test tripped the detector.</review>
  <verdict>PASS → proceed to VG-gate-manifest | FAIL → fix REAL system (do not patch the test) → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to hardcode `45 posts checked, 0 failures` into the script output rather than actually reading every MDX frontmatter → STOP → iterate files at runtime.</mock_guard>
</validation_gate>

<gate_manifest>
  <total_gates>3</total_gates>
  <sequence>VG-1 → VG-2 → VG-3</sequence>
  <policy>All gates BLOCKING. No advancement on FAIL.</policy>
  <evidence_dir>evidence/phase-A2/</evidence_dir>
  <regression>If ANY gate FAILS: fix real system → re-run from failed gate → do NOT skip forward.</regression>
</gate_manifest>
