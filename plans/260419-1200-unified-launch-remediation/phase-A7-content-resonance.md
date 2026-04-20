# Phase A7 — Pre-Publish Content Resonance Gate

**Owner:** Nick (recruiter) + 5 external readers + Opus copywriter (synthesis)
**Effort:** 8h
**Status:** pending
**Window:** Day -10 → Day -4
**Blocks:** B3 daily runbook (cannot start until 3 flagships pass resonance gate)
**BlockedBy:** A5 (Wave-1b polish landed), A2 (audit spot-verify filed)

## Context

Red-team critic #5: **zero phases validate whether 45 pre-written posts work with real readers before Day 1.** MEMORY.md records the Wave-1 voice-drift restart precedent — a gate-less launch repeats that history at 45× scale. A7 adds the resonance gate. Three flagships (Day 1 launch, Day 22 Ralph, Day 50 manifesto) receive structured 5-reader feedback BEFORE launch. Full arc gets expanded `/ckm:write:audit` spot-verification (45 posts vs the prior 5-post sample).

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

### A7.1 — Recruit 5 readers

**Fix:** Nick identifies 5 readers from:
- 2 senior/staff engineers (target ICP for consulting inquiries)
- 1 AI tooling founder (peer ecosystem)
- 1 technical writer (voice/clarity)
- 1 skeptical engineer unfamiliar with Claude Code (cold-read proxy)

Each commits to ≤60 min per flagship (3 flagships × 60 min = 3h per reader, self-paced Day -10 → Day -4).

**Capture:** `plans/phase-12-prelaunch/A7-readers.md` — names, roles, estimated read window.

<validation_gate id="VG-1" blocking="true">
  <prerequisites>Nick has identified and confirmed 5 readers (names + roles).</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && mkdir -p evidence/phase-A7 && test -f plans/phase-12-prelaunch/A7-readers.md && cp plans/phase-12-prelaunch/A7-readers.md evidence/phase-A7/vg-1-readers-roster.md && grep -c "^- " plans/phase-12-prelaunch/A7-readers.md | tee evidence/phase-A7/vg-1-reader-count.txt && grep -iE "staff|senior|founder|writer|skeptical" plans/phase-12-prelaunch/A7-readers.md | tee evidence/phase-A7/vg-1-role-coverage.log</execute>
  <capture>evidence/phase-A7/vg-1-readers-roster.md, vg-1-reader-count.txt, vg-1-role-coverage.log</capture>
  <pass_criteria>File exists with exactly 5 reader bullet rows AND covers the 4 prescribed ICPs. Assertion: `test "$(cat evidence/phase-A7/vg-1-reader-count.txt)" = "5"` AND `grep -cEi "staff|senior" evidence/phase-A7/vg-1-role-coverage.log` ≥ 2 AND `grep -ciE "founder" evidence/phase-A7/vg-1-role-coverage.log` ≥ 1 AND `grep -ciE "writer" evidence/phase-A7/vg-1-role-coverage.log` ≥ 1 AND `grep -ciE "skeptical|cold-read" evidence/phase-A7/vg-1-role-coverage.log` ≥ 1.</pass_criteria>
  <review>`cat evidence/phase-A7/vg-1-readers-roster.md` — 5 named readers; ICP distribution matches A7.1 targets.</review>
  <verdict>PASS → next gate | FAIL → recruit additional reader to fill the missing ICP slot → re-run</verdict>
  <mock_guard>IF tempted to list placeholder names ("Reader 1", "TBD") → STOP → real commitment must be confirmed before launch week.</mock_guard>
</validation_gate>

### A7.2 — Feedback form (one per flagship per reader)

**Fix:** create `plans/phase-12-prelaunch/A7-feedback-template.md`. Structured sections:

```markdown
# A7 reader feedback — <reader-name> — <flagship: day-01|day-22|day-50>

## Voice drift (1–5, 5 = perfectly on voice)
- First-person used concretely, not throat-clearing: [score]
- Zero hype phrases ("game-changer", "unlock", "10x"): [score]
- Claims backed by specific evidence (numbers, URLs, session refs): [score]
- Reads like Nick, not like an LLM: [score]

## Technical accuracy (1–5)
- Code snippets are plausible real outputs: [score]
- No fabricated tools, flags, or metrics: [score]
- Claims I can verify against my own experience hold up: [score]

## CTA clarity (1–5)
- The ask at the end is specific (not "thoughts?"): [score]
- I know what action to take if interested: [score]
- Consulting-practice relevance is clear without being salesy: [score]

## Skim-ability (1–5)
- Opening 100 words hook without hyperbole: [score]
- Section headers tell the story alone: [score]
- I can return after interruption and re-orient in <15s: [score]

## Open text
- One sentence that felt off: <quote>
- One sentence that landed: <quote>
- Would you share this with a peer? why/why not: <free text>
```

**Threshold for PASS:** aggregate score ≥ 3.8/5.0 across all 4 dimensions × 5 readers (n=20 samples per flagship). Any single dimension < 3.5 triggers revision.

<validation_gate id="VG-2" blocking="true">
  <prerequisites>VG-1 PASS. Template directory exists at `plans/phase-12-prelaunch/`.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && test -f plans/phase-12-prelaunch/A7-feedback-template.md && cp plans/phase-12-prelaunch/A7-feedback-template.md evidence/phase-A7/vg-2-template-copy.md && grep -cE "^## (Voice drift|Technical accuracy|CTA clarity|Skim-ability)" plans/phase-12-prelaunch/A7-feedback-template.md | tee evidence/phase-A7/vg-2-dimension-count.txt</execute>
  <capture>evidence/phase-A7/vg-2-template-copy.md, vg-2-dimension-count.txt</capture>
  <pass_criteria>Template exists with all 4 scoring dimensions (Voice drift, Technical accuracy, CTA clarity, Skim-ability) AND an Open text section. Assertion: `test "$(cat evidence/phase-A7/vg-2-dimension-count.txt)" = "4"` AND `grep -cE "^## Open text" plans/phase-12-prelaunch/A7-feedback-template.md` ≥ 1.</pass_criteria>
  <review>`cat plans/phase-12-prelaunch/A7-feedback-template.md` — 4 dimensions × 3 sub-items each, 1-5 scale cited per row, Open text section included.</review>
  <verdict>PASS → next gate | FAIL → add missing dimension headers or Open text section → re-run</verdict>
  <mock_guard>IF tempted to reduce dimensions from 4 to 2 to speed up reader time → STOP → 4 dimensions is load-bearing for the 3.8/3.5 threshold math.</mock_guard>
</validation_gate>

### A7.3 — Flagship resonance pass

**Fix:** send each flagship MDX (rendered via `pnpm dev` preview URL) + feedback template to each reader. Collect responses in `plans/phase-12-prelaunch/A7-feedback-day{01,22,50}-<reader>.md`.

Opus copywriter synthesizes per-flagship: aggregate score, top 3 revise-candidates (quoted lines), proposed edits. Writes `plans/phase-12-prelaunch/A7-synthesis-day{01,22,50}.md`.

**If score ≥ 3.8 on every dimension:** flagship PASS, unlocks B3 for that flagship day.
**If any dimension < 3.5:** Opus drafts revision; Nick reviews; re-test with 2 original readers (delta-check). Max 2 revision rounds — after that, ship with recorded residual risk.

<validation_gate id="VG-3" blocking="true">
  <prerequisites>VG-1 + VG-2 PASS. Reader feedback collected for all 3 flagships (Day 1, Day 22, Day 50); per-flagship synthesis docs drafted by Opus copywriter.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && for f in day01 day22 day50; do count=$(ls plans/phase-12-prelaunch/A7-feedback-$f-*.md 2>/dev/null | wc -l | tr -d ' '); echo "$f feedback files: $count" >> evidence/phase-A7/vg-3-feedback-counts.log; test -f plans/phase-12-prelaunch/A7-synthesis-$f.md && cp plans/phase-12-prelaunch/A7-synthesis-$f.md evidence/phase-A7/vg-3-synthesis-$f.md; grep -E "aggregate: (3\.[8-9]|4\.[0-9]|5\.0)" plans/phase-12-prelaunch/A7-synthesis-$f.md >> evidence/phase-A7/vg-3-aggregate-lines.log || echo "$f below-threshold or missing aggregate line" >> evidence/phase-A7/vg-3-aggregate-lines.log; grep -iE "min.?dimension|min[_ ]?dim|lowest dimension" plans/phase-12-prelaunch/A7-synthesis-$f.md | grep -E "3\.[5-9]|4\.[0-9]|5\.0" >> evidence/phase-A7/vg-3-min-dim-lines.log || echo "$f min-dimension below 3.5 or missing" >> evidence/phase-A7/vg-3-min-dim-lines.log; done</execute>
  <capture>evidence/phase-A7/vg-3-feedback-counts.log, vg-3-synthesis-day01.md, vg-3-synthesis-day22.md, vg-3-synthesis-day50.md, vg-3-aggregate-lines.log, vg-3-min-dim-lines.log</capture>
  <pass_criteria>For EACH flagship (day01, day22, day50): (1) ≥4 reader feedback files exist, (2) synthesis doc exists, (3) aggregate score ≥ 3.8 across all 4 dimensions, (4) no single dimension < 3.5. Assertion: aggregate ≥3.8 across all 4 dimensions with no single dimension <3.5, verified by: `grep -cE "below-threshold or missing" evidence/phase-A7/vg-3-aggregate-lines.log` returns `0` AND `grep -cE "below 3\\.5 or missing" evidence/phase-A7/vg-3-min-dim-lines.log` returns `0` AND for each flagship `awk -F: '/feedback files:/ {if($2+0 < 4) exit 1}' evidence/phase-A7/vg-3-feedback-counts.log` exits 0.</pass_criteria>
  <review>`cat evidence/phase-A7/vg-3-synthesis-day01.md` (repeat for day22, day50) — confirm explicit line reading `aggregate: <N>` with N ≥ 3.8 AND per-dimension breakdown showing no dimension below 3.5. Read the top-3 revision-candidate quotes and the proposed edits.</review>
  <verdict>PASS → next gate | FAIL → Opus drafts revision for the flagship with the failing dimension; Nick reviews; re-test with 2 original readers (delta-check); max 2 revision rounds; if still FAIL, escalate to residual-risk doc (VG-5) → re-run</verdict>
  <mock_guard>IF tempted to inflate scores or drop a dimension to make the aggregate math work → STOP → the gate exists to catch voice drift; gaming it reproduces the Wave-1 restart at 45× scale.</mock_guard>
</validation_gate>

### A7.4 — Expanded `/ckm:write:audit` spot-verify (5 → 45 posts)

**Fix:** extend A5.6 spot-verify from 5-sample to all 45 posts. Run `/ckm:write:audit` (Opus model per memory rule) per-post. Output one-row-per-post verdict:

```
| day-NN | voice: PASS|FAIL | hype: count | cta: present | concrete-claims: N | verdict |
```

Target: ≥42/45 PASS on voice. FAILs trigger targeted revision — NOT full rewrite. Cap revision budget at 3h total (don't blow the schedule chasing ≥44/45).

**Report:** `plans/reports/ckm-260419-a7-full-arc-audit.md` — table + aggregate + residual FAIL list with justifications.

<validation_gate id="VG-4" blocking="true">
  <prerequisites>VG-3 PASS for all 3 flagships. Full-arc `/ckm:write:audit` run per post (Opus model) with per-post row in the output report.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && test -f plans/reports/ckm-260419-a7-full-arc-audit.md && cp plans/reports/ckm-260419-a7-full-arc-audit.md evidence/phase-A7/vg-4-full-arc-audit-copy.md && awk -F'|' 'BEGIN{pass=0; total=0} /^\| day-/ {total++; for(i=1;i<=NF;i++) if($i ~ /PASS/) {pass++; break}} END{print "pass="pass" total="total}' plans/reports/ckm-260419-a7-full-arc-audit.md | tee evidence/phase-A7/vg-4-pass-count.txt && grep -cE "^\| day-" plans/reports/ckm-260419-a7-full-arc-audit.md | tee evidence/phase-A7/vg-4-row-count.txt</execute>
  <capture>evidence/phase-A7/vg-4-full-arc-audit-copy.md, vg-4-pass-count.txt, vg-4-row-count.txt</capture>
  <pass_criteria>Report exists; row count = 45; PASS count ≥ 42. Assertion: `test "$(cat evidence/phase-A7/vg-4-row-count.txt)" = "45"` AND `awk -F= '/pass=/ {p=$2+0} /total=/ {t=$2+0} END {exit (p>=42 && t==45) ? 0 : 1}' evidence/phase-A7/vg-4-pass-count.txt`. Any FAILs must be enumerated in a "residual FAIL list" section: `grep -iE "^## residual|^### residual|residual FAIL list" plans/reports/ckm-260419-a7-full-arc-audit.md` returns ≥1 line (only required if PASS<45).</pass_criteria>
  <review>`cat plans/reports/ckm-260419-a7-full-arc-audit.md` — 45 rows, aggregate line at top states total PASS, residual FAIL list justifies each FAIL (≤3 permitted).</review>
  <verdict>PASS → next gate | FAIL → run targeted revision on posts with FAIL voice verdicts (3h cap); re-run `ckm:write:audit` on revised posts; if still <42, escalate to VG-5 residual-risk doc → re-run</verdict>
  <mock_guard>IF tempted to auto-mark weak posts as PASS to hit 42/45 → STOP → FAILs must be real and either fixed or documented in residual-risk.</mock_guard>
</validation_gate>

### A7.5 — Residual-risk doc

**Fix:** if any flagship ships with a dimension 3.5–3.79 (below target but above abort threshold), document in `plans/phase-12-prelaunch/A7-residual-risk.md`:
- Which flagship, which dimension, which score
- What was NOT fixed and why (voice preserved vs clarity improved trade-off)
- Day-1/22/50 mitigation (e.g., "monitor sentiment triggers B4.1 more aggressively")

<validation_gate id="VG-5" blocking="true">
  <prerequisites>VG-3 complete. Required ONLY IF any flagship dimension is 3.5–3.79 OR VG-4 PASS count is 42–44 (not 45). If every flagship ≥3.8 on every dimension AND VG-4 = 45/45, this gate is NA (document "no residual risk — gate skipped" in evidence log).</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && if [ -f plans/phase-12-prelaunch/A7-residual-risk.md ]; then cp plans/phase-12-prelaunch/A7-residual-risk.md evidence/phase-A7/vg-5-residual-risk-copy.md; grep -cE "^## (Flagship|Day|Dimension|Score|Mitigation)" plans/phase-12-prelaunch/A7-residual-risk.md | tee evidence/phase-A7/vg-5-section-count.txt; grep -iE "day.?1|day.?22|day.?50" plans/phase-12-prelaunch/A7-residual-risk.md | tee evidence/phase-A7/vg-5-flagship-refs.log; else echo "NA: residual-risk doc not present — verify VG-3 all ≥3.8 and VG-4 = 45/45" | tee evidence/phase-A7/vg-5-na.log; fi</execute>
  <capture>evidence/phase-A7/vg-5-residual-risk-copy.md (if present), vg-5-section-count.txt, vg-5-flagship-refs.log, vg-5-na.log (alternative)</capture>
  <pass_criteria>EITHER (a) `vg-5-na.log` exists AND VG-3 all aggregates ≥3.8 AND VG-4 PASS=45, OR (b) `A7-residual-risk.md` exists AND cites which flagship + dimension + score + what was not fixed AND Day-1/22/50 mitigation line. Assertion for (b): `test -s evidence/phase-A7/vg-5-residual-risk-copy.md` AND `grep -cE "score|dimension|mitigation" evidence/phase-A7/vg-5-residual-risk-copy.md` ≥ 3 AND B3 runbook cites the doc: `grep -l "A7-residual-risk.md" plans/260419-1200-unified-launch-remediation/phase-B3-*.md` returns a filename.</pass_criteria>
  <review>If (b): `cat plans/phase-12-prelaunch/A7-residual-risk.md` — each residual item has flagship, dimension, exact score, explanation of what was NOT fixed (with voice-vs-clarity trade-off reasoning), and a concrete mitigation action mapped to a B4 kill-switch parameter.</review>
  <verdict>PASS → phase complete | FAIL → either (a) fix the residual item and drop the doc requirement, OR (b) write the missing sections and ensure B3 runbook references the doc → re-run</verdict>
  <mock_guard>IF tempted to write "no significant risk" and skip the doc when VG-3/VG-4 flagged issues → STOP → residual risk must be documented specifically, or the issue must be fixed.</mock_guard>
</validation_gate>

## File ownership

| File | Owner | Conflict |
|---|---|---|
| `plans/phase-12-prelaunch/A7-readers.md` (NEW) | A7 | none |
| `plans/phase-12-prelaunch/A7-feedback-template.md` (NEW) | A7 | none |
| `plans/phase-12-prelaunch/A7-feedback-day*-<reader>.md` (NEW ×15) | readers via A7 | none |
| `plans/phase-12-prelaunch/A7-synthesis-day{01,22,50}.md` (NEW ×3) | Opus | none |
| `plans/reports/ckm-260419-a7-full-arc-audit.md` (NEW) | A7 | none |
| `plans/phase-12-prelaunch/A7-residual-risk.md` (NEW, conditional) | A7 | none |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Reader ghosts / drops out | MED | MED | recruit 7, expect 5 complete; 4/5 is acceptable if spread across ICPs |
| Feedback surfaces structural voice issue (not line-level fix) | MED | HIGH | Opus assesses; if >3 flagships affected, block B3 until A5 reopens; escalate to +1 week slip |
| Readers accidentally leak pre-launch content | LOW | MED | NDA-lite: personal ask, no public repo until Day 1 |
| Scoring rubric is gameable / inflated | MED | LOW | Opus synthesis flags outliers; any single reader outside ±1σ gets soft-weighted |
| A7.4 full-arc audit surfaces 10+ FAILs | MED | HIGH | 3h revision budget cap; document uncorrected FAILs in residual-risk doc; ship |
| Revision rounds eat schedule | MED | MED | hard cap 2 rounds per flagship; after that, ship with residual risk |

## Acceptance criteria

- [ ] 5 readers confirmed (names + roles documented)
- [ ] Feedback template committed
- [ ] Each flagship (Day 1, Day 22, Day 50) has ≥4 reader responses collected
- [ ] Per-flagship synthesis doc exists with aggregate score
- [ ] Every flagship: all 4 dimensions ≥ 3.5 average, ≥3 of 4 dimensions ≥ 3.8
- [ ] `ckm:write:audit` full-arc report: ≥42/45 PASS OR residual-risk doc justifies any FAILs shipping
- [ ] If residual risk recorded: B3 runbook references the risk doc in Day-specific pre-flight

## Verification steps

```bash
cd /Users/nick/Desktop/blog-series
# 1. Readers recruited
test -f plans/phase-12-prelaunch/A7-readers.md
grep -c '^- ' plans/phase-12-prelaunch/A7-readers.md  # expect: 5

# 2. Per-flagship feedback
for f in day01 day22 day50; do
  count=$(ls plans/phase-12-prelaunch/A7-feedback-$f-*.md 2>/dev/null | wc -l)
  echo "$f feedback files: $count"
done
# expect: each count >= 4

# 3. Synthesis + aggregate pass
for f in day01 day22 day50; do
  test -f plans/phase-12-prelaunch/A7-synthesis-$f.md || echo "MISSING $f synthesis"
  grep -E "aggregate: (3\.[8-9]|4|5)" plans/phase-12-prelaunch/A7-synthesis-$f.md || echo "$f below threshold"
done

# 4. Full-arc audit
test -f plans/reports/ckm-260419-a7-full-arc-audit.md
awk -F'|' '$3 ~ /PASS/ {p++} END {print p" of 45 PASS"}' \
  plans/reports/ckm-260419-a7-full-arc-audit.md
# expect: >=42
```

## Rollback

A7 is evaluative — no source-code edits unless revision lands. If revision-round edit regresses voice, `git revert` per file. If resonance gate fails and cannot be closed in 2 rounds, escalate to user: slip launch by 1 week OR ship with residual-risk doc + expanded B4.1 sensitivity (e.g., negative-sentiment threshold 10% instead of 15% for first 7 days).

<gate_manifest>
  <total_gates>5</total_gates>
  <sequence>VG-1 → VG-2 → VG-3 → VG-4 → VG-5</sequence>
  <policy>All gates BLOCKING. VG-3 is the highest-stakes gate (45× scale voice-drift prevention).</policy>
  <evidence_dir>evidence/phase-A7/</evidence_dir>
  <regression>On FAIL: re-run from failed gate after real-system fix (reader recruitment, template update, MDX revision). VG-5 may be NA if VG-3 and VG-4 both clean-pass.</regression>
</gate_manifest>
