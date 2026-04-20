# Phase A5 — Wave 1b Polish

**Owner:** Opus copywriter (content edits), Sonnet executor (script + doc patches)
**Effort:** 4–6h
**Status:** pending
**Blocks:** B1 (pre-push decisions)

## Context

Wave 1b (2026-04-19) landed voice/tone corrections across the 21-day MDX arc but deferred six non-blocker polish items. This phase closes them before Track A hands off to Track B. Content edits must honor `voice-spec.md` (first person, concrete, no hype).

Source files:
- `plans/reports/remediation-260419-1146-final-push.md` (Wave 1b deferrals section)
- `plans/260419-0241-agentic-dog-brand-launch/synthesis/voice-spec.md`
- `withagents-site/src/content/posts/day-14-*.mdx`
- `withagents-site/src/content/posts/day-15-*.mdx`
- `withagents-site/src/content/posts/day-20-*.mdx`
- `scripts/syndication/staging/*.ts` (P10 staging doc + date helper)

<mock_detection_protocol>
Before executing any task, check intent:
- Creating .test.*, _test.*, *Tests.*, test_* files → STOP
- Importing mock libraries (nock, sinon, jest.mock, unittest.mock) → STOP
- Creating in-memory databases (SQLite :memory:, H2) → STOP
- Adding TEST_MODE or NODE_ENV=test flags → STOP
- Stubbing API responses, fake DNS, mock DB drivers → STOP
Fix the REAL system instead. No exceptions.
</mock_detection_protocol>

## Work items

### A5.1 — LinkedIn CTAs missing across arc

**Defect:** Wave 1b audit flagged N posts shipping without a terminal LinkedIn CTA. Voice spec requires every essay end with one concrete ask (comment, share, subscribe, or reply).

**Fix:** append a single-sentence CTA to each affected MDX file. Pattern:
> "If this resonated, tell me where your team is on [topic] — I'm collecting signal for day N+1."
Vary the verb and the topic per post. No emoji, no "thoughts?" filler.

**Verification:** `rg -L "reply|tell me|share|comment" withagents-site/src/content/posts/*.mdx` returns zero files.

<validation_gate id="VG-1" blocking="true">
  <prerequisites>`withagents-site/src/content/posts/` populated with 21 day-*.mdx files; ripgrep (`rg`) installed.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && mkdir -p evidence/phase-A5 && rg -L "reply|tell me|share|comment|subscribe" withagents-site/src/content/posts/day-*.mdx | tee evidence/phase-A5/vg-1-cta-presence.log</execute>
  <capture>evidence/phase-A5/vg-1-cta-presence.log (list of files lacking CTA phrase — must be empty)</capture>
  <pass_criteria>Output file is zero bytes / contains zero filenames. Negative assertion: `wc -l < evidence/phase-A5/vg-1-cta-presence.log` returns `0`.</pass_criteria>
  <review>`wc -l evidence/phase-A5/vg-1-cta-presence.log` must print `0`; `cat` the log — expect no output.</review>
  <verdict>PASS → next gate | FAIL → append CTA to each listed MDX → re-run from prerequisites</verdict>
  <mock_guard>IF tempted to weaken regex or add a synthetic "CTA present" sentinel to silence the gate → STOP → write a real CTA sentence in the MDX body.</mock_guard>
</validation_gate>

### A5.2 — Keyword not in first 100 words

**Defect:** SEO audit shows several posts bury the primary keyword past the 100-word mark. Hurts snippet ranking.

**Fix:** rewrite the opening 1–2 sentences of each flagged post so the primary keyword (from frontmatter `keywords[0]`) appears by word 80. Preserve voice — no stuffing.

**Verification:**
```bash
pnpm tsx scripts/audit/keyword-position.ts --max-position 100
# expect: all posts PASS
```

<validation_gate id="VG-2" blocking="true">
  <prerequisites>`scripts/audit/keyword-position.ts` exists and compiles; all 21 MDX files have `keywords:` frontmatter array.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && pnpm tsx scripts/audit/keyword-position.ts --max-position 100 | tee evidence/phase-A5/vg-2-keyword-position.log</execute>
  <capture>evidence/phase-A5/vg-2-keyword-position.log (per-post PASS/FAIL report)</capture>
  <pass_criteria>Every post row reads PASS; zero FAIL lines. Assertion: `grep -c "FAIL" evidence/phase-A5/vg-2-keyword-position.log` returns `0`.</pass_criteria>
  <review>`grep -c "FAIL" evidence/phase-A5/vg-2-keyword-position.log` = 0 AND `grep -c "PASS" ...` ≥ 21.</review>
  <verdict>PASS → next gate | FAIL → rewrite opening of each FAIL post so primary keyword lands by word 80 → re-run</verdict>
  <mock_guard>IF tempted to change `--max-position` threshold or edit the audit script to always return PASS → STOP → rewrite the opening sentences in the MDX instead.</mock_guard>
</validation_gate>

### A5.3 — Day 14 / Day 15 duplicated openings

**Defect:** both posts open with the same "I ran the loop again at 2 AM…" cadence. Reads as template drift.

**Fix:**
- Day 14 keeps the 2 AM framing (it's the load-bearing one).
- Day 15 rewrites the lede to start from the post's actual lesson (cross-session memory). Target 2–3 sentences, new imagery, same voice.

**Verification:** diff first 200 chars of each — no shared 6-word phrase. Read aloud test: distinct voice per post.

<validation_gate id="VG-3" blocking="true">
  <prerequisites>`day-14-*.mdx` and `day-15-*.mdx` exist under `withagents-site/src/content/posts/`.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && head -c 400 withagents-site/src/content/posts/day-14-*.mdx > evidence/phase-A5/vg-3-d14-head.txt && head -c 400 withagents-site/src/content/posts/day-15-*.mdx > evidence/phase-A5/vg-3-d15-head.txt && diff evidence/phase-A5/vg-3-d14-head.txt evidence/phase-A5/vg-3-d15-head.txt | tee evidence/phase-A5/vg-3-opening-diff.log</execute>
  <capture>evidence/phase-A5/vg-3-d14-head.txt, vg-3-d15-head.txt, vg-3-opening-diff.log</capture>
  <pass_criteria>No shared 6-word phrase between the two openings. Assertion: extract 6-grams from both heads; intersection must be empty. Shell check: `comm -12 <(tr '[:space:]' '\n' < evidence/phase-A5/vg-3-d14-head.txt | tr -d '[:punct:]' | awk 'NR<=60{for(i=NR;i<NR+6 && i<=55;i++) a[i]=a[i]" "$0; if(NR>=6) print a[NR-5]}' | sort -u) <(...same for d15...) | wc -l` returns `0`. Pragmatic shell assertion: `diff` log is non-empty AND `grep -c "^<" evidence/phase-A5/vg-3-opening-diff.log` ≥ 3 (substantive difference across multiple lines).</pass_criteria>
  <review>`cat evidence/phase-A5/vg-3-opening-diff.log` — expect multi-line divergence, not a 1-word tweak. Read both heads aloud; distinct voice.</review>
  <verdict>PASS → next gate | FAIL → rewrite Day 15 opening per lesson-first framing → re-run</verdict>
  <mock_guard>IF tempted to add 1-word changes to technically pass the diff → STOP → rewrite Day 15 from its actual lesson (cross-session memory).</mock_guard>
</validation_gate>

### A5.4 — Day 20 readability (Flesch < 50)

**Defect:** day 20 scores Flesch 42; dense run-on sentences, three subclauses deep in spots.

**Fix:** split sentences >30 words. Replace 3+ polysyllabic chain ("instrumentation observability telemetry") with one concrete term + example. No content cuts; target Flesch ≥ 55 without losing technical specifics.

**Verification:**
```bash
pnpm tsx scripts/audit/readability.ts withagents-site/src/content/posts/day-20-*.mdx
# expect: Flesch ≥ 55
```

<validation_gate id="VG-4" blocking="true">
  <prerequisites>`scripts/audit/readability.ts` exists and compiles; `day-20-*.mdx` present.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && pnpm tsx scripts/audit/readability.ts withagents-site/src/content/posts/day-20-*.mdx | tee evidence/phase-A5/vg-4-day20-readability.json</execute>
  <capture>evidence/phase-A5/vg-4-day20-readability.json (Flesch score + sentence stats)</capture>
  <pass_criteria>Flesch score ≥ 55. Assertion: `grep -oE "flesch[^0-9]*[0-9]+(\\.[0-9]+)?" evidence/phase-A5/vg-4-day20-readability.json | grep -oE "[0-9]+(\\.[0-9]+)?" | awk '$1 >= 55 {print "PASS"; exit 0} {print "FAIL"; exit 1}'` exits 0.</pass_criteria>
  <review>`cat evidence/phase-A5/vg-4-day20-readability.json` — confirm Flesch ≥ 55 AND technical content preserved (spot-check the MDX file for retained specifics).</review>
  <verdict>PASS → next gate | FAIL → split >30-word sentences; simplify polysyllabic chains without cutting technical detail → re-run</verdict>
  <mock_guard>IF tempted to replace technical terms with generic filler to game Flesch → STOP → split sentence structure instead; keep the nouns.</mock_guard>
</validation_gate>

### A5.5 — P10 staging doc missing arc-date formula

**Defect:** `scripts/syndication/staging/` docs reference "expected publish date" without defining the formula. Runner and staging drift possible.

**Fix:** patch the staging doc + any helper to declare:
```ts
// Canonical arc date formula
export const ARC_START_MS = Date.parse('2026-04-19T00:00:00Z'); // day 1
export function expectedDateISO(dayN: number): string {
  if (dayN < 1 || dayN > 21) throw new Error(`dayN out of range: ${dayN}`);
  return new Date(ARC_START_MS + (dayN - 1) * 86_400_000).toISOString();
}
```
Update `scripts/syndication/staging/README.md` (or create) with the formula and worked examples for day 1, day 7, day 21.

**Verification:** `pnpm tsx -e "import {expectedDateISO} from './scripts/syndication/staging/arc-date'; console.log(expectedDateISO(21))"` → `2026-05-09T00:00:00.000Z`.

<validation_gate id="VG-5" blocking="true">
  <prerequisites>`.launch-date` committed at repo root containing `2026-04-19` (or per B1.1 decision); `scripts/syndication/staging/arc-date.ts` exports `expectedDateISO` (may re-export from shared helper per A6). Requires A6 shared helper if in effect.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && pnpm tsx -e "import {expectedDateISO} from './scripts/syndication/staging/arc-date'; console.log(JSON.stringify({day1: expectedDateISO(1), day7: expectedDateISO(7), day21: expectedDateISO(21)}))" | tee evidence/phase-A5/vg-5-arc-date-formula.json</execute>
  <capture>evidence/phase-A5/vg-5-arc-date-formula.json (exact ISO timestamps for day 1, 7, 21)</capture>
  <pass_criteria>Exact ISO strings in output. With `.launch-date=2026-04-19`: `day1` == `"2026-04-19T00:00:00.000Z"` AND `day21` == `"2026-05-09T00:00:00.000Z"`. Assertion: `jq -e '.day1 == "2026-04-19T00:00:00.000Z" and .day21 == "2026-05-09T00:00:00.000Z"' evidence/phase-A5/vg-5-arc-date-formula.json` exits 0. Also verify staging README cites the formula: `grep -F "expectedDateISO" withagents-site/../scripts/syndication/staging/README.md || grep -F "expectedDateISO" scripts/syndication/staging/README.md`.</pass_criteria>
  <review>`jq . evidence/phase-A5/vg-5-arc-date-formula.json` — confirm exact timestamps match expected. `cat scripts/syndication/staging/README.md | grep -A2 "day 1\|day 7\|day 21"` — confirm 3 worked examples documented.</review>
  <verdict>PASS → next gate | FAIL → fix formula in `arc-date.ts` (off-by-one is the usual culprit: day 1 must map to `.launch-date`, not `.launch-date + 1`) → re-run</verdict>
  <mock_guard>IF tempted to hardcode a string match or mock `Date.parse` → STOP → the formula must derive from `.launch-date` at runtime.</mock_guard>
</validation_gate>

### A5.6 — ckm:write audit spot-verify report

**Defect:** no evidence record that Wave 1b edits actually landed the voice fixes. Future consensus review will re-open the question.

**Fix:** run `ckm:write` spot verification across 5 random Wave-1b-touched posts. File report to `plans/reports/ckm-260419-wave1b-spot-verify.md` with per-post PASS/FAIL against the voice-spec checklist (first-person %, hype-phrase count, concrete-claim ratio, CTA presence).

**Verification:** report exists, 5 posts cited by filename, each row has a verdict + 1-line rationale, aggregate verdict stated at top.

<validation_gate id="VG-6" blocking="true">
  <prerequisites>Wave-1b edits (VG-1..VG-4) landed; `ckm:write:audit` skill available; 5 Wave-1b-touched posts identified.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && test -f plans/reports/ckm-260419-wave1b-spot-verify.md && cp plans/reports/ckm-260419-wave1b-spot-verify.md evidence/phase-A5/vg-6-spot-verify-copy.md && grep -c "^| day-" plans/reports/ckm-260419-wave1b-spot-verify.md | tee evidence/phase-A5/vg-6-row-count.txt && grep -iE "^aggregate verdict:|^## aggregate" plans/reports/ckm-260419-wave1b-spot-verify.md | tee evidence/phase-A5/vg-6-aggregate.txt</execute>
  <capture>evidence/phase-A5/vg-6-spot-verify-copy.md, vg-6-row-count.txt, vg-6-aggregate.txt</capture>
  <pass_criteria>Report exists; exactly 5 `| day-` rows; aggregate verdict line exists at top; each row has a verdict token (PASS/FAIL) AND a rationale column. Assertion: `test "$(cat evidence/phase-A5/vg-6-row-count.txt)" = "5"` AND `test -s evidence/phase-A5/vg-6-aggregate.txt` AND `grep -cE "\\| (PASS\\|FAIL)|\\| PASS \\||\\| FAIL \\|" plans/reports/ckm-260419-wave1b-spot-verify.md` ≥ 5.</pass_criteria>
  <review>`cat plans/reports/ckm-260419-wave1b-spot-verify.md` — read the 5 rows. Each row cites a specific filename AND has ≥1 sentence of rationale referencing a specific MDX line/phrase. Aggregate verdict stated at top.</review>
  <verdict>PASS → phase complete | FAIL → re-run `ckm:write:audit` per post, fill in missing rationale → re-verify</verdict>
  <mock_guard>IF tempted to auto-generate rubber-stamp "PASS — looks good" rationales → STOP → rationale must cite a specific line of the MDX.</mock_guard>
</validation_gate>

## File ownership

| File | Owner | Conflict |
|---|---|---|
| `withagents-site/src/content/posts/day-*.mdx` (Wave 1b flagged) | A5 copywriter | none within Track A (A3 reads, does not edit) |
| `withagents-site/src/content/posts/day-14-*.mdx` | A5 copywriter | none |
| `withagents-site/src/content/posts/day-15-*.mdx` | A5 copywriter | none |
| `withagents-site/src/content/posts/day-20-*.mdx` | A5 copywriter | none |
| `scripts/syndication/staging/arc-date.ts` (NEW or existing) | A5 Sonnet | none |
| `scripts/syndication/staging/README.md` | A5 Sonnet | none |
| `plans/reports/ckm-260419-wave1b-spot-verify.md` (NEW) | A5 Sonnet | none |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Sonnet copy edits drift from voice-spec | MED | HIGH | force `model: "opus"` for all copywriter Agent spawns (per global feedback rule) |
| Keyword insertion feels stuffed | MED | MED | copywriter rewrites the sentence, does not inject — reject drafts that read robotic |
| Day 15 rewrite loses continuity with day 14 callback | LOW | MED | preserve any explicit cross-references; only the opening changes |
| Date formula off-by-one (day 1 vs day 0) | LOW | HIGH | unit-verify day 1 → 2026-04-19, day 21 → 2026-05-09 before committing |
| ckm:write report becomes rubber-stamp | LOW | MED | require 1-line rationale per row citing specific MDX line |

## Acceptance criteria

- [ ] Every Wave-1b-touched post has a concrete LinkedIn CTA in the final paragraph
- [ ] `scripts/audit/keyword-position.ts --max-position 100` passes for all 21 posts
- [ ] Day 14 and Day 15 openings share no 6-word phrase; both read distinct aloud
- [ ] Day 20 Flesch ≥ 55 without losing technical content
- [ ] `expectedDateISO(1)` = `2026-04-19T00:00:00.000Z`, `expectedDateISO(21)` = `2026-05-09T00:00:00.000Z`
- [ ] Staging README documents the formula with 3 worked examples
- [ ] `plans/reports/ckm-260419-wave1b-spot-verify.md` exists with 5 post verdicts + aggregate

## Verification steps

```bash
cd /Users/nick/Desktop/blog-series

# 1. CTA presence
rg -L "reply|tell me|share|comment|subscribe" withagents-site/src/content/posts/day-*.mdx

# 2. Keyword position audit
pnpm tsx scripts/audit/keyword-position.ts --max-position 100

# 3. Day 14/15 opening divergence
head -c 400 withagents-site/src/content/posts/day-14-*.mdx > /tmp/d14.txt
head -c 400 withagents-site/src/content/posts/day-15-*.mdx > /tmp/d15.txt
diff /tmp/d14.txt /tmp/d15.txt  # expect: substantive difference

# 4. Day 20 readability
pnpm tsx scripts/audit/readability.ts withagents-site/src/content/posts/day-20-*.mdx

# 5. Arc date formula
pnpm tsx -e "import {expectedDateISO} from './scripts/syndication/staging/arc-date'; \
  console.log(expectedDateISO(1), expectedDateISO(21))"
# expect: 2026-04-19T00:00:00.000Z 2026-05-09T00:00:00.000Z

# 6. Spot-verify report
test -f plans/reports/ckm-260419-wave1b-spot-verify.md && \
  grep -c "^| day-" plans/reports/ckm-260419-wave1b-spot-verify.md  # expect: 5
```

## Rollback

Per-file atomic. Content edits and script patches are independent commits. If a copy edit lands that breaks voice, `git revert <sha>` for that single post; others stand. The arc-date helper is additive — reverting it restores prior staging behavior with no data loss.

<gate_manifest>
  <total_gates>6</total_gates>
  <sequence>VG-1 → VG-2 → VG-3 → VG-4 → VG-5 → VG-6</sequence>
  <policy>All gates BLOCKING.</policy>
  <evidence_dir>evidence/phase-A5/</evidence_dir>
  <regression>On FAIL: re-run from failed gate after real-system fix. No skipping, no mocking — patch the MDX or script and re-execute the gate command.</regression>
</gate_manifest>
