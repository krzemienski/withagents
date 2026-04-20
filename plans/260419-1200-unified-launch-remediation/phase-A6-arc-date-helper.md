# Phase A6 — Single-Source Arc-Date Helper

**Owner:** Sonnet executor
**Effort:** 2h
**Status:** pending
**Blocks:** A5 (A5.5 currently hardcodes `ARC_START_MS`), B1 (B1.1 writes `.launch-date` that this helper reads)
**BlockedBy:** none

## Context

Red-team critic #3/#4 and architect cross-cut findings: two separate arc-date formulas existed. `phase-A2.md:2.2` read `.launch-date` at runtime; `phase-A5.md:5.5` hardcoded `ARC_START_MS = Date.parse('2026-04-19T00:00:00Z')`. These diverge as soon as `.launch-date` ≠ 2026-04-19, and 2026-04-19 is a Sunday — which violates B1.1's Tue/Wed constraint. Plus: A2.2 formula + A5.5 formula + runner.ts + B3/B4 pulls = four drift surfaces.

**Fix:** one canonical helper at `scripts/syndication/shared/arc-date.ts`. Every caller imports. `.launch-date` is the sole truth source.

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

### A6.1 — Create canonical helper

**New file:** `scripts/syndication/shared/arc-date.ts`

```ts
// Canonical arc-date helper. Sole source of truth for launch-relative dates.
// Reads /Users/nick/Desktop/blog-series/.launch-date (ISO YYYY-MM-DD).
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const REPO_ROOT = resolve(fileURLToPath(new URL('../../../', import.meta.url)));
const LAUNCH_DATE_FILE = resolve(REPO_ROOT, '.launch-date');

let _cached: string | null = null;

export function getLaunchDate(): string {
  if (_cached) return _cached;
  if (!existsSync(LAUNCH_DATE_FILE)) {
    throw new Error(
      `[.launch-date] missing at ${LAUNCH_DATE_FILE}. ` +
      `B1.1 must commit it before any runner/staging call.`
    );
  }
  const raw = readFileSync(LAUNCH_DATE_FILE, 'utf8').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    throw new Error(`[.launch-date] invalid format: "${raw}" (expected YYYY-MM-DD)`);
  }
  _cached = raw;
  return raw;
}

export function launchMs(): number {
  return Date.parse(`${getLaunchDate()}T00:00:00Z`);
}

export function expectedDateISO(dayN: number): string {
  if (!Number.isInteger(dayN) || dayN < 1) {
    throw new Error(`dayN out of range: ${dayN}`);
  }
  return new Date(launchMs() + (dayN - 1) * 86_400_000).toISOString();
}

export function currentLaunchDay(now: Date = new Date()): number {
  const diffMs = now.getTime() - launchMs();
  return Math.floor(diffMs / 86_400_000) + 1; // Day 1 on launch date
}
```

**Verification:**
```bash
echo "2026-04-21" > /Users/nick/Desktop/blog-series/.launch-date   # Tue
pnpm tsx -e "import {expectedDateISO, currentLaunchDay} from './scripts/syndication/shared/arc-date'; \
  console.log(expectedDateISO(1), expectedDateISO(45));"
# expect: 2026-04-21T00:00:00.000Z  2026-06-04T00:00:00.000Z
```

<validation_gate id="VG-1" blocking="true">
  <prerequisites>`pnpm` installed; `tsx` available; repo root at `/Users/nick/Desktop/blog-series`. Creates `.launch-date` as part of execute block (test seed).</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && mkdir -p evidence/phase-A6 && echo "2026-04-21" > .launch-date && test -f scripts/syndication/shared/arc-date.ts && pnpm tsx -e "import {expectedDateISO, currentLaunchDay, getLaunchDate} from './scripts/syndication/shared/arc-date'; console.log(JSON.stringify({launch: getLaunchDate(), day1: expectedDateISO(1), day45: expectedDateISO(45)}))" | tee evidence/phase-A6/vg-1-helper-round-trip.json</execute>
  <capture>evidence/phase-A6/vg-1-helper-round-trip.json</capture>
  <pass_criteria>Helper file exists; round-trip emits exact ISO strings. Assertion: `jq -e '.launch == "2026-04-21" and .day1 == "2026-04-21T00:00:00.000Z" and .day45 == "2026-06-04T00:00:00.000Z"' evidence/phase-A6/vg-1-helper-round-trip.json` exits 0.</pass_criteria>
  <review>`jq . evidence/phase-A6/vg-1-helper-round-trip.json` — day 1 maps to launch-date, day 45 is 44 days later.</review>
  <verdict>PASS → next gate | FAIL → fix off-by-one in `expectedDateISO` (dayN=1 ⇒ launchMs, not launchMs+86400000) → re-run</verdict>
  <mock_guard>IF tempted to hardcode `2026-04-21` inside the helper → STOP → the helper must read `.launch-date` at runtime.</mock_guard>
</validation_gate>

### A6.2 — Delete hardcoded ARC_START_MS in A5.5

**Fix:** remove hardcoded `ARC_START_MS = Date.parse('2026-04-19T00:00:00Z')` from `scripts/syndication/staging/arc-date.ts` (if exists) or from the P10 staging helper. Replace body with a re-export:

```ts
// scripts/syndication/staging/arc-date.ts (if exists) — re-export only.
export { expectedDateISO, getLaunchDate } from '../shared/arc-date';
```

Update `phase-A5-wave1b-polish.md:A5.5` to reference the shared helper and drop the hardcoded literal. The staging README worked examples now read from `.launch-date` (state that launch-date MUST be committed per B1.1 before the examples can be run).

<validation_gate id="VG-2" blocking="true">
  <prerequisites>VG-1 PASS (shared helper exists).</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && if [ -f scripts/syndication/staging/arc-date.ts ]; then cp scripts/syndication/staging/arc-date.ts evidence/phase-A6/vg-2-staging-arc-date.ts; grep -nE "Date\.parse|ARC_START_MS" scripts/syndication/staging/arc-date.ts | tee evidence/phase-A6/vg-2-hardcoded-sweep.log; else echo "staging/arc-date.ts not present — nothing to patch" | tee evidence/phase-A6/vg-2-hardcoded-sweep.log; fi</execute>
  <capture>evidence/phase-A6/vg-2-staging-arc-date.ts, vg-2-hardcoded-sweep.log</capture>
  <pass_criteria>If `scripts/syndication/staging/arc-date.ts` exists, it contains zero hardcoded `Date.parse('2026-04-` occurrences AND zero `ARC_START_MS =` assignments. Assertion: `grep -cE "Date\\.parse\\('2026-04-|ARC_START_MS =" scripts/syndication/staging/arc-date.ts 2>/dev/null || echo 0` returns `0`. File must only re-export from `../shared/arc-date`: `grep -E "from '\\.\\./shared/arc-date'" scripts/syndication/staging/arc-date.ts` returns ≥1 line.</pass_criteria>
  <review>`cat scripts/syndication/staging/arc-date.ts` — body should be a single `export { ... } from '../shared/arc-date'` line. No inline formula.</review>
  <verdict>PASS → next gate | FAIL → delete hardcoded literals and replace with `export { expectedDateISO, getLaunchDate } from '../shared/arc-date'` → re-run</verdict>
  <mock_guard>IF tempted to leave the inline formula as a "fallback" → STOP → there is one source of truth; duplicate formulas drift.</mock_guard>
</validation_gate>

### A6.3 — Delete inline formula in A2.2 / A2.3

**Fix:** `scripts/verify-post-dates.py` (A2.3) already reads `.launch-date` via `--launch-date` CLI arg. A2 is consistent. The A2.2 document patch references the formula in prose — update that prose to cite A6 helper:

- Replace `frontmatter.date = LAUNCH_DATE + (day_n - 1)` prose with: "Canonical formula lives in `scripts/syndication/shared/arc-date.ts` (A6). All TS callers import `expectedDateISO(dayN)`. Python callers shell out to `cat .launch-date` and compute the same ISO date."

<validation_gate id="VG-3" blocking="true">
  <prerequisites>A6.3 prose edit landed in A2 phase file.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && grep -nE "scripts/syndication/shared/arc-date" plans/260419-1200-unified-launch-remediation/phase-A2-*.md | tee evidence/phase-A6/vg-3-a2-cross-reference.log; grep -nE "LAUNCH_DATE \+ \(day_n - 1\)" plans/260419-1200-unified-launch-remediation/phase-A2-*.md | tee evidence/phase-A6/vg-3-a2-legacy-formula.log</execute>
  <capture>evidence/phase-A6/vg-3-a2-cross-reference.log, vg-3-a2-legacy-formula.log</capture>
  <pass_criteria>A2 phase prose cites the shared helper (`vg-3-a2-cross-reference.log` non-empty) AND no longer carries the inline formula (`vg-3-a2-legacy-formula.log` is empty). Assertion: `test -s evidence/phase-A6/vg-3-a2-cross-reference.log && test ! -s evidence/phase-A6/vg-3-a2-legacy-formula.log`.</pass_criteria>
  <review>`cat evidence/phase-A6/vg-3-a2-cross-reference.log` — see the A2 file reference the shared helper. `wc -l evidence/phase-A6/vg-3-a2-legacy-formula.log` = 0.</review>
  <verdict>PASS → next gate | FAIL → re-edit A2 phase file prose to cite `scripts/syndication/shared/arc-date.ts` → re-run</verdict>
  <mock_guard>IF tempted to leave the old formula in prose "for clarity" → STOP → readers follow citations; duplication becomes drift.</mock_guard>
</validation_gate>

### A6.4 — Grep-sweep to eliminate duplicate literals

**Fix:** after migration, no file outside `scripts/syndication/shared/arc-date.ts` may contain:
- `Date.parse('2026-04-`
- `'2026-04-19T00:00:00Z'` as a literal (acceptable in docs/comments if explicitly labelled "example only")
- Any other launch-date arithmetic inline.

**Verification:**
```bash
cd /Users/nick/Desktop/blog-series
# Expect: only shared/arc-date.ts emits launch-date math
rg -n "Date\.parse\('2026-04-" --glob '!plans/**' --glob '!**/arc-date.ts'
# expect: 0 matches
rg -n "ARC_START_MS" --glob '!plans/**' --glob '!**/arc-date.ts'
# expect: 0 matches
rg -n "launch_date \+ \(day_n - 1\)" --glob '!plans/**' --glob '!scripts/verify-post-dates.py'
# expect: 0 matches
```

<validation_gate id="VG-4" blocking="true">
  <prerequisites>VG-1..VG-3 PASS. Shared helper canonical; staging/arc-date.ts is re-export only.</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && rg -n "Date\.parse\('2026-04-" --glob '!plans/**' --glob '!**/shared/arc-date.ts' --glob '!evidence/**' | tee evidence/phase-A6/vg-4-date-parse-sweep.log; rg -n "ARC_START_MS" --glob '!plans/**' --glob '!**/shared/arc-date.ts' --glob '!evidence/**' | tee evidence/phase-A6/vg-4-arc-start-ms-sweep.log; rg -n "launch_date \+ \(day_n - 1\)" --glob '!plans/**' --glob '!scripts/verify-post-dates.py' --glob '!evidence/**' | tee evidence/phase-A6/vg-4-py-formula-sweep.log</execute>
  <capture>evidence/phase-A6/vg-4-date-parse-sweep.log, vg-4-arc-start-ms-sweep.log, vg-4-py-formula-sweep.log</capture>
  <pass_criteria>All three sweep logs are zero bytes (0-match assertion for duplicate literals). Assertion: `for f in evidence/phase-A6/vg-4-date-parse-sweep.log evidence/phase-A6/vg-4-arc-start-ms-sweep.log evidence/phase-A6/vg-4-py-formula-sweep.log; do [ ! -s "$f" ] || { echo "FAIL: $f non-empty"; exit 1; }; done; echo PASS`.</pass_criteria>
  <review>`wc -l evidence/phase-A6/vg-4-*.log` — all must be 0. `cat` each to confirm empty.</review>
  <verdict>PASS → next gate | FAIL → delete duplicate literals in each offending file; replace with import from `scripts/syndication/shared/arc-date.ts` → re-run</verdict>
  <mock_guard>IF tempted to add an exclusion glob to silence a match → STOP → the match is a duplicate literal and must be removed from source.</mock_guard>
</validation_gate>

### A6.5 — Caller audit table

Every launch-date-consuming caller MUST import from `scripts/syndication/shared/arc-date.ts`:

| Caller | Path | Import |
|---|---|---|
| runner.ts (day → date resolution) | `scripts/syndication/scheduler/runner.ts` | `import { expectedDateISO, currentLaunchDay } from '../shared/arc-date'` |
| staging helper | `scripts/syndication/staging/arc-date.ts` | re-export only |
| kill-switch checker (B4.7) | `scripts/metrics/kill-switch-check.ts` | `import { currentLaunchDay } from '../syndication/shared/arc-date'` |
| daily metrics (B5) | `scripts/metrics/daily-capture.ts` | `import { expectedDateISO } from '../syndication/shared/arc-date'` |
| verify-post-dates.py (A2.3) | `scripts/verify-post-dates.py` | reads `.launch-date` file directly (Python side, same source) |

<validation_gate id="VG-5" blocking="true">
  <prerequisites>VG-1..VG-4 PASS. Callers listed in A6.5 table exist on disk (runner.ts, kill-switch-check.ts, daily-capture.ts).</prerequisites>
  <execute>cd /Users/nick/Desktop/blog-series && for f in scripts/syndication/scheduler/runner.ts scripts/metrics/kill-switch-check.ts scripts/metrics/daily-capture.ts; do echo "=== $f ===" >> evidence/phase-A6/vg-5-caller-imports.log; grep -nE "from '\\.\\./(shared|syndication/shared)/arc-date'" "$f" >> evidence/phase-A6/vg-5-caller-imports.log 2>/dev/null || echo "MISSING IMPORT: $f" >> evidence/phase-A6/vg-5-caller-imports.log; done; grep -nE "\\.launch-date" scripts/verify-post-dates.py >> evidence/phase-A6/vg-5-caller-imports.log 2>/dev/null || true; rm -f .launch-date && pnpm tsx -e "import {expectedDateISO} from './scripts/syndication/shared/arc-date'; try { expectedDateISO(1) } catch(e) { console.log('ERROR:', e.message) }" 2>&1 | tee evidence/phase-A6/vg-5-error-path.log; echo "2026-04-21" > .launch-date</execute>
  <capture>evidence/phase-A6/vg-5-caller-imports.log (one block per caller with import line), vg-5-error-path.log (descriptive error output)</capture>
  <pass_criteria>(1) Every caller in A6.5 table imports from shared helper — no `MISSING IMPORT` lines in `vg-5-caller-imports.log`. Assertion: `grep -c "^MISSING IMPORT:" evidence/phase-A6/vg-5-caller-imports.log` returns `0`. (2) Error-path: missing `.launch-date` raises an error naming `.launch-date` AND referencing B1.1. Assertion: `grep -E "\\[.launch-date\\] missing" evidence/phase-A6/vg-5-error-path.log && grep -E "B1\\.1" evidence/phase-A6/vg-5-error-path.log` both succeed.</pass_criteria>
  <review>`cat evidence/phase-A6/vg-5-caller-imports.log` — each caller section shows a real import line from `../shared/arc-date` or `../syndication/shared/arc-date`. `cat evidence/phase-A6/vg-5-error-path.log` — error includes `[.launch-date] missing at ...` and `B1.1`.</review>
  <verdict>PASS → phase complete | FAIL → add missing import to the flagged caller OR fix error message in shared helper to mention `.launch-date` and `B1.1` → re-run</verdict>
  <mock_guard>IF tempted to catch-and-swallow the missing-`.launch-date` error so callers succeed silently → STOP → the loud descriptive error is the feature; B1.1 depends on it.</mock_guard>
</validation_gate>

## File ownership

| File | Owner | Conflict |
|---|---|---|
| `scripts/syndication/shared/arc-date.ts` (NEW) | A6 | none |
| `scripts/syndication/staging/arc-date.ts` (now re-export) | A6 | A5 collaborates |
| Caller imports (runner.ts, kill-switch-check.ts, daily-capture.ts) | A6 | coordinated with A1, B4, B5 |

## Risk

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Missing `.launch-date` at dev-time crashes tsx imports | MED | LOW | helper throws descriptive error; pre-commit hook ensures `.launch-date` exists on master |
| Python/TS date arithmetic drift | LOW | MED | both compute `launch + (dayN-1)` days; unit test in A2.3 cross-checks |
| Cached `_cached` never invalidates after `.launch-date` edit | LOW | LOW | long-running processes rare; CLI tools re-import per invocation |
| Circular import (staging re-exports shared) | LOW | LOW | shared has zero imports from staging |

## Acceptance criteria

- [ ] `scripts/syndication/shared/arc-date.ts` exists, exports `getLaunchDate`, `expectedDateISO`, `currentLaunchDay`, `launchMs`
- [ ] Grep sweep (A6.4) returns 0 duplicate literals
- [ ] Every caller in A6.5 table imports from shared helper (no local copies)
- [ ] With `.launch-date=2026-04-21` (Tue), `expectedDateISO(1)` → `2026-04-21T00:00:00.000Z`
- [ ] Missing `.launch-date` raises a descriptive error naming B1.1 as the fix path
- [ ] A5.5 no longer hardcodes `ARC_START_MS` — references shared helper
- [ ] A2.2 prose cites `scripts/syndication/shared/arc-date.ts` as canonical source

## Verification steps

```bash
cd /Users/nick/Desktop/blog-series
# 1. Helper exists + compiles
test -f scripts/syndication/shared/arc-date.ts
pnpm tsc --noEmit scripts/syndication/shared/arc-date.ts

# 2. Duplicate-literal sweep
rg -n "Date\.parse\('2026-04-" --glob '!plans/**' --glob '!**/shared/arc-date.ts'
rg -n "ARC_START_MS =" --glob '!plans/**' --glob '!**/shared/arc-date.ts'

# 3. Round-trip
echo "2026-04-21" > .launch-date
pnpm tsx -e "import {expectedDateISO} from './scripts/syndication/shared/arc-date'; \
  console.log(expectedDateISO(1), expectedDateISO(22), expectedDateISO(45));"
# expect: 2026-04-21... 2026-05-12... 2026-06-04...

# 4. Error path
rm .launch-date
pnpm tsx -e "import {expectedDateISO} from './scripts/syndication/shared/arc-date'; \
  try { expectedDateISO(1) } catch(e) { console.log('OK:', e.message) }"
# expect: "OK: [.launch-date] missing..."
echo "2026-04-21" > .launch-date
```

## Rollback

Per-file atomic. If shared helper breaks a caller: `git revert` the import edit for that caller; caller reverts to prior inline formula. Helper file stays — it's additive.

<gate_manifest>
  <total_gates>5</total_gates>
  <sequence>VG-1 → VG-2 → VG-3 → VG-4 → VG-5</sequence>
  <policy>All gates BLOCKING.</policy>
  <evidence_dir>evidence/phase-A6/</evidence_dir>
  <regression>On FAIL: re-run from failed gate after real-system fix. Do NOT exclude files via glob to silence grep sweeps — remove the duplicate literal at the source.</regression>
</gate_manifest>
