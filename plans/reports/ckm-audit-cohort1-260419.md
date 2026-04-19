# CKM Write Audit — Cohort 1 (Days 01–22)
**Date:** 2026-04-19
**Auditor:** aa8051fac2dfdc833 (Ralph US-006 / Content Auditor)
**Scope:** 15 slugs × 3 file formats (MDX + LinkedIn + X) = 45 files
**Constraint:** READ-ONLY — no inline edits. Findings only.
**Framework:** ck:ckm:write:audit — Copywriting 40% / SEO 30% / Platform 20% / Brand Voice 10%

---

## Verdict Table

| Slug | MDX | LinkedIn | X | Top Findings |
|------|-----|----------|---|-------------|
| day-01-validationforge-ga | SHIP | SHIP | SHIP | MDX: bare URL (no https://). All else clean. |
| day-02-multi-agent-consensus | SHIP | SHIP | SHIP | Excellent evidence chain. Real gate JSON cited. |
| day-03-read-to-write-ratio | SHIP | LIGHT-EDIT | LIGHT-EDIT | LI + X: wrong URL pattern (`/posts/` not `/writing/`). |
| day-04-orchestration-topology | SHIP | SHIP | SHIP | Strong data hook, trace-timeline OSS ref. Clean. |
| day-05-auto-claude-worktrees | SHIP | SHIP | SHIP | Merge disaster hook lands well. Real metrics throughout. |
| day-07-ralph-loop-teaser | SHIP | SHIP | SHIP | 1:47 AM opener is the series' best hook. Dual CTAs on LI work. |
| day-08-three-agents-one-reviewer | LIGHT-EDIT | LIGHT-EDIT | LIGHT-EDIT | MDX: content overlap with day-02 (same += bug, same $0.15 cost). LI + X: wrong URL pattern. |
| day-09-ios-streaming-bridge | SHIP | SHIP | SHIP | 7,985 MCP calls cited. State machine diagrams. Voice at em-dash cap (5/1k) — fine. |
| day-10-ccb-evolution | LIGHT-EDIT | SHIP | SHIP | MDX: forward-reference "Day 58" — series ends at Day 45. Fix to correct day number. |
| day-11-ccbios-enhanced | SHIP | SHIP | SHIP | Honest repo-not-public caveat done right. Lesson stated clearly. |
| day-12-claude-sdk-bridge | SHIP | SHIP | SHIP | Time totals self-consistent (4+14+2+10=30h). Clean. |
| day-13-claude-code-sdk | SHIP | SHIP | SHIP | Fork attribution explicit (jamesrochabrun). iOS removal explained honestly. |
| day-14-claude-prompt-stack | LIGHT-EDIT | SHIP | SHIP | MDX: near-duplicate intro with day-15 — both open with "14 rules / 11 followed" + identical failure counts. |
| day-15-shannon-framework | LIGHT-EDIT | LIGHT-EDIT | LIGHT-EDIT | MDX: shared verbatim intro with day-14. LI: first 4 lines verbatim from day-14 LI opener. X: lowercase casual ("i tried for weeks") breaks series tone. |
| day-22-ralph-orchestrator-origin | SHIP | SHIP | SHIP | Jan 21 date hook strong. Naming disambiguation tweet (tweet 2) unusual but necessary. |

---

## Critical Defects

These require a fix before publication. Listed with file path, line reference, and specific correction.

---

### 1. Broken canonical URL pattern — day-03 LinkedIn

**File:** `withagents-site/src/content/posts/day-03-read-to-write-ratio.linkedin.md`
**Location:** CTA line (bottom of post)
**Defect:** `https://withagents.dev/posts/day-03-read-to-write-ratio`
**Fix:** Replace `/posts/` with `/writing/` → `https://withagents.dev/writing/day-03-read-to-write-ratio`

---

### 2. Broken canonical URL pattern — day-03 X thread

**File:** `withagents-site/src/content/posts/day-03-read-to-write-ratio.x.md`
**Location:** Final tweet URL
**Defect:** `https://withagents.dev/posts/day-03-read-to-write-ratio`
**Fix:** Replace `/posts/` with `/writing/` → `https://withagents.dev/writing/day-03-read-to-write-ratio`

---

### 3. Broken canonical URL pattern — day-08 LinkedIn

**File:** `withagents-site/src/content/posts/day-08-three-agents-one-reviewer.linkedin.md`
**Location:** CTA line (bottom of post)
**Defect:** `https://withagents.dev/posts/day-08-three-agents-one-reviewer`
**Fix:** Replace `/posts/` with `/writing/` → `https://withagents.dev/writing/day-08-three-agents-one-reviewer`

---

### 4. Broken canonical URL pattern — day-08 X thread

**File:** `withagents-site/src/content/posts/day-08-three-agents-one-reviewer.x.md`
**Location:** Final tweet URL
**Defect:** `https://withagents.dev/posts/day-08-three-agents-one-reviewer`
**Fix:** Replace `/posts/` with `/writing/` → `https://withagents.dev/writing/day-08-three-agents-one-reviewer`

---

### 5. Out-of-range day reference — day-10 MDX

**File:** `withagents-site/src/content/posts/day-10-ccb-evolution.mdx`
**Location:** Line 114 (approximately)
**Defect:** `"...which I'll cover on Day 58"` — series ends at Day 45; Day 58 does not exist.
**Fix:** Identify the correct day number for the SDK vs CLI post (likely Day 17 or 18 based on the companion repo mapping) and replace "Day 58" with that number.

---

## Moderate Issues

These do not block publication but degrade content quality. Address before wide distribution.

---

### 6. Content overlap — day-08 MDX duplicates day-02 anecdote

**File:** `withagents-site/src/content/posts/day-08-three-agents-one-reviewer.mdx`
**Defect:** The `+=` bug story, the `$0.15/task` cost figure, the `lines.append(line)` fix, and the `line 926` citation all appear in both day-02 and day-08 MDX posts. A reader who encounters both on the same day sees what reads as a retelling. Day-08's intended angle (field-note format, three-agent architecture specifics) is buried under the recycled anecdote.
**Recommendation:** Cut the shared anecdote from day-08 to a single-sentence callback ("the += bug I covered in day-02"), then expand the three-agent architecture mechanics that day-08 uniquely owns.

---

### 7. Near-duplicate introduction — day-14 and day-15 MDX

**Files:**
- `withagents-site/src/content/posts/day-14-claude-prompt-stack.mdx`
- `withagents-site/src/content/posts/day-15-shannon-framework.mdx`

**Defect:** Both posts open with the identical framing: "14 rules in my CLAUDE.md / agent followed 11 / 47 test files / 112 unread edits / 63 premature DONE declarations." The failure counts, the hook phrasing, and the layer-count intro are near-verbatim in both MDX files and in the day-14 and day-15 LinkedIn posts.

Day-14 owns: the 7-layer stack architecture, hook engineering data (23→0%, 31→4%, 41→9%), subagent injection.
Day-15 owns: enforcement severity spectrum (Block/Warn/Remind), CLAUDE.md inheritance chain, the 18 dead hooks list, Shannon plugin productization.

**Recommendation:** Day-14 opens with the current shared hook (it arrived first). Day-15 must open differently — lead with the Shannon naming story or the "18 hooks that died" count, then reference day-14 as the diagnostic that revealed the need for a formal plugin.

---

### 8. Voice inconsistency — day-15 X thread

**File:** `withagents-site/src/content/posts/day-15-shannon-framework.x.md`
**Defect:** Lowercase casual register throughout ("the agent UNDERSTANDS every rule", "i tried for weeks", "something weird:") diverges from every other X thread in the cohort, which use sentence-case professional tone with first-person present tense. This reads as a different author.
**Recommendation:** Standardize capitalization to match series norm. "i tried for weeks" → "I spent four weeks on this." "something weird:" → "Something I didn't expect:". Preserve the content — only the register needs correction.

---

### 9. Near-duplicate LinkedIn opener — day-15

**File:** `withagents-site/src/content/posts/day-15-shannon-framework.linkedin.md`
**Defect:** The first four lines are verbatim from the day-14 LinkedIn post. Any reader who saw both posts in the same week will immediately recognize the copy. On LinkedIn where posts surface via algorithm (not chronological), the risk of same-user duplicate is real.
**Recommendation:** Rewrite the day-15 LI opener to lead with Shannon's unique angle (productizing the stack into a formal Claude Code plugin), not with the shared CLAUDE.md failure framing.

---

## Global Patterns

**What works across the cohort:**
- The specific-number opening formula is consistently executed. "23,479 sessions," "7,985 MCP tool calls," "194 tasks, zero conflicts" — these land every time.
- Failure-before-success arc is present in the strongest posts (day-01, day-05, day-07, day-09, day-11, day-22). Posts that skip it (day-04, day-08) feel flatter.
- Honest-limitation sections appear in day-11 (repo not public), day-13 (iOS removed), day-05 (single-machine scope) — these are credibility assets, not weaknesses. More posts should add them.
- The withagents.dev URL pattern is correct in 11 of 15 slugs across all three formats. Days 03 and 08 are the two exceptions.

**What to watch in subsequent cohorts:**
- URL pattern drift (2 of 15 slugs affected). Suggest a URL-lint pass as part of the pre-publish checklist.
- Day-reference accuracy in forward pointers (day-10 "Day 58" defect). Any post that references a future day number needs verification against the actual publication schedule.
- Content overlap between adjacent posts. Days 08/02 and 14/15 both share primary material. At 45 posts published in 45 days, the overlap risk increases in the later cohorts covering the same tooling stack. Each post needs a differentiating angle stated in the first paragraph.
- Voice register consistency on X. The lowercase-casual style in day-15 is the only outlier in this cohort. Flag it in copy review before the X post is scheduled.

---

## Scoring Summary (Cohort 1 Aggregate)

| Dimension | Cohort Avg | Notes |
|-----------|-----------|-------|
| Copywriting (40%) | 8.1/10 | Hook quality high; CTA clarity strong; day-08 and day-15 pull score down |
| SEO (30%) | 7.8/10 | MDX metadata complete; H2/H3 structure consistent; internal links sparse |
| Platform Compliance (20%) | 7.2/10 | 4 URL defects across 2 slugs; X char counts within range; LI truncation hooks present |
| Brand Voice (10%) | 8.4/10 | Em-dash cap respected throughout; 1 register outlier (day-15 X); no banlist violations found |
| **Weighted Total** | **7.9/10** | |

**Cohort status: 10 of 15 slugs SHIP-ready. 5 require LIGHT-EDIT before scheduling.**

---

## File-Level Notes (Reference)

### day-01-validationforge-ga

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | SHIP | Bottom URL is bare (no `https://`) — cosmetic only. Strong 3-number opener. Evidence traceable throughout. |
| .linkedin.md | SHIP | Single CTA, correct URL. Clean. |
| .x.md | SHIP | Numbers in tweet 1. 10 tweets. Correct URL. |

---

### day-02-multi-agent-consensus

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | SHIP | Best evidence chain in the cohort. Gate JSON output cited inline. Mermaid diagram present. |
| .linkedin.md | SHIP | Hook converts the gate mechanic into a business pain. Correct URL. |
| .x.md | SHIP | Thesis numbers in tweet 1. 11 tweets. Correct URL. |

---

### day-03-read-to-write-ratio

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | SHIP | Evidence pointer to local session-log file. Data post reads clean. |
| .linkedin.md | LIGHT-EDIT | **CRITICAL:** URL uses `/posts/` not `/writing/`. See Critical Defect #1. |
| .x.md | LIGHT-EDIT | **CRITICAL:** URL uses `/posts/` not `/writing/`. See Critical Defect #2. |

---

### day-04-orchestration-topology

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | SHIP | Specific data hook (194 tasks, zero conflicts). OSS trace-timeline ref. |
| .linkedin.md | SHIP | Correct URL. |
| .x.md | SHIP | Correct URL. |

---

### day-05-auto-claude-worktrees

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | SHIP | Merge disaster hook is vivid. Real metrics (194 tasks, zero conflicts). Honest limits section. |
| .linkedin.md | SHIP | Correct URL. |
| .x.md | SHIP | Acceptable emoji (👇). Correct URL. |

---

### day-07-ralph-loop-teaser

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | SHIP | 1:47 AM hook is the cohort's strongest opener. $0.15/task cost data. Teaser-to-full arc pointer. |
| .linkedin.md | SHIP | Dual CTAs (post + library) work for LI audience. Correct URL. |
| .x.md | SHIP | Thesis in tweet 1. Correct URL. |

---

### day-08-three-agents-one-reviewer

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | LIGHT-EDIT | Content overlap with day-02. See Moderate Issue #6. |
| .linkedin.md | LIGHT-EDIT | **CRITICAL:** URL uses `/posts/` not `/writing/`. See Critical Defect #3. |
| .x.md | LIGHT-EDIT | **CRITICAL:** URL uses `/posts/` not `/writing/`. See Critical Defect #4. |

---

### day-09-ios-streaming-bridge

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | SHIP | 7,985 MCP tool calls cited. Specific idb counts. State machine diagrams. Em-dash at 5/1k cap — within spec. |
| .linkedin.md | SHIP | Correct URL. |
| .x.md | SHIP | 14 tweets. Acceptable emoji. Correct URL. |

---

### day-10-ccb-evolution

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | LIGHT-EDIT | **CRITICAL:** "Day 58" forward-reference out of range. See Critical Defect #5. |
| .linkedin.md | SHIP | Correct URL. |
| .x.md | SHIP | Correct URL. |

---

### day-11-ccbios-enhanced

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | SHIP | Honest "repo not public" caveat handled well. Lesson generalized correctly for non-public code. Em-dash at 5/1k. |
| .linkedin.md | SHIP | Correct URL. |
| .x.md | SHIP | Acceptable emoji. Correct URL. |

---

### day-12-claude-sdk-bridge

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | SHIP | Time totals consistent (4+14+2+10=30h). Failure-mode mapping thorough. |
| .linkedin.md | SHIP | Correct URL. |
| .x.md | SHIP | Correct URL. |

---

### day-13-claude-code-sdk

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | SHIP | Fork attribution explicit (jamesrochabrun). iOS removal explained honestly — "correcting the manifest was honesty, not regression" is a strong line. Em-dash 4.6/1k. |
| .linkedin.md | SHIP | Correct URL. |
| .x.md | SHIP | Correct URL. |

---

### day-14-claude-prompt-stack

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | LIGHT-EDIT | Near-duplicate intro with day-15. See Moderate Issue #7. Hook, failure counts, and 7-layer intro appear in both. |
| .linkedin.md | SHIP | Correct URL. |
| .x.md | SHIP | Correct URL. |

---

### day-15-shannon-framework

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | LIGHT-EDIT | Near-duplicate intro with day-14. See Moderate Issue #7. Day-15's unique content (severity spectrum, inheritance chain, 18 dead hooks) is distinguishing but buried under shared opener. |
| .linkedin.md | LIGHT-EDIT | First 4 lines verbatim from day-14 LI. See Moderate Issue #9. |
| .x.md | LIGHT-EDIT | Lowercase register inconsistency. See Moderate Issue #8. |

---

### day-22-ralph-orchestrator-origin

| File | Verdict | Notes |
|------|---------|-------|
| .mdx | SHIP | Specific date hook (Jan 21, 2026). Stop-hook code shown inline. 1:47 AM story consistent with day-07 callback. Zero em-dashes. |
| .linkedin.md | SHIP | Correct URL. |
| .x.md | SHIP | Naming disambiguation tweet (tweet 2) is non-standard but necessary given "Ralph" ambiguity. Correct URL. |

---

## Status Footer

```
Auditor:       aa8051fac2dfdc833 (Ralph US-006 / Cohort 1)
Files audited: 45 (15 slugs × 3 formats)
SHIP:          30 files
LIGHT-EDIT:    15 files
REWRITE:       0 files
Critical defects: 5 (4 broken URLs, 1 out-of-range day reference)
Moderate issues:  4 (2 content overlaps, 1 voice inconsistency, 1 duplicate LI opener)
Cohort score:  7.9/10
Report path:   plans/reports/ckm-audit-cohort1-260419.md
Completed:     2026-04-19
```
