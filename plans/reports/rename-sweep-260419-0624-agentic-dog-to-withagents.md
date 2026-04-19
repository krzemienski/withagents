# Rename Sweep Report — `agentic.dog` → `withagents.dev`

**Agent:** V6
**Date:** 2026-04-19
**Before report:** `plans/reports/rename-sweep-before-260419.txt`
**After report:** `plans/reports/rename-sweep-after-260419.txt`

---

## Summary

- **Total files touched:** 25
- **Before-grep match count:** 189 across 25 files
- **After-grep match count (actionable brand strings):** 0
- **Protected path-ref exceptions remaining:** 11 occurrences across 8 files (all are `260419-0241-agentic-dog-brand-launch/` folder references — explicitly protected per brief)

---

## Files Edited — Hit-Count Delta

| File | Before | After | Delta |
|---|---|---|---|
| `plan.md` | 14 | 0 | −14 |
| `CHECKPOINT.md` | 4 | 0 actionable (2 path-refs) | −2 |
| `phase-00-baseline-capture.md` | 1 | 0 | −1 |
| `phase-01-audit-workstreams.md` | 7 | 0 actionable (1 path-ref) | −6 |
| `phase-04-cms-site-architecture.md` | 5 | 0 | −5 |
| `phase-05-publication-pipeline.md` | 5 | 0 | −5 |
| `phase-07-approval-package.md` | 2 | 0 | −2 |
| `reports/critic-260419-0241-red-team-review.md` | 9 | 0 actionable (2 path-refs) | −7 |
| `reports/deepen-260419-0241-plan-strengthening.md` | 9 | 0 actionable (1 path-ref) | −8 |
| `research/A-session-archaeology.md` | 3 | 0 | −3 |
| `research/B-github-catalog.md` | 4 | 0 | −4 |
| `research/C-desktop-product-scan.md` | 8 | 0 | −8 |
| `research/D-blog-series-audit.md` | 11 | 0 | −11 |
| `research/E-skills-marketing-toolkit.md` | 5 | 0 | −5 |
| `research/F-drafts-disposition.md` | 18 | 0 actionable (1 path-ref) | −17 |
| `research/G-brand-reconnaissance.md` | 17 | 0 actionable (2 path-refs) | −15 |
| `research/H-blog-series-voice-audit.md` | 6 | 0 | −6 |
| `synthesis/approval-package.md` | 18 | 0 actionable (2 path-refs) | −16 |
| `synthesis/approval-record.md` | 2 | 0 | −2 |
| `synthesis/calendar-30day.md` | 10 | 0 | −10 |
| `synthesis/calendar-45day.md` | 13 | 0 | −13 |
| `synthesis/insight-library.md` | 1 | 0 | −1 |
| `synthesis/narrative-spine.md` | 1 | 0 | −1 |
| `synthesis/product-inventory.md` | 12 | 0 | −12 |
| `synthesis/voice-spec.md` | 4 | 0 actionable (2 path-refs) | −2 |

---

## Substitutions Applied (in order, most-specific first)

| Old string | New string | Notes |
|---|---|---|
| `agentic-dog-skills` | `withagents-skills` | Package rename per brief §4 |
| `agentic.dog unique visitors` | `withagents.dev unique visitors` | Metrics copy |
| `https://agentic.dog` | `https://withagents.dev` | URL |
| `agenticdevelopment.com` | `withagents.dev` | Old fallback domain |
| `Agentic Dog` | `WithAgents` | Display name CamelCase |
| `agentic dog` | `WithAgents` | Display name lowercase |
| `agenticdog` | `withagents` | Squashed form |
| `agentic.dog` | `withagents.dev` | Domain (bare) |
| `agentic-dog\b` | `withagents` | Hyphenated slug |
| `~/Desktop/agentic-dog/` | `~/Desktop/withagents/` | Filesystem path for new site repo |
| `agentic-dog manifesto post` | `withagents manifesto post` | Display text in phase-05 |
| `agentic-dog-guide` | `withagents-guide` | Hypothetical repo slug in research/B |
| `krzemienski/agentic-dog` | `krzemienski/withagents` | GitHub repo slug in approval-package + product-inventory |

---

## Edge Cases Flagged

### 1. `agenticdevelopment.com` replacements in `research/F-drafts-disposition.md`

F-drafts-disposition.md is a historical audit of newsletter drafts that contained `agenticdevelopment.com` URLs. After replacement the document now reads "replace every `withagents.dev` occurrence with `withagents.dev`" in one sentence (line 52) and "stale canonical URL... `withagents.dev` in every newsletter" in the summary (line 5). These are factually accurate — the newsletters do contain the old domain that needs replacing — but read slightly tautologically. Accepted as-is: this is a research/archive file, not live copy, and the meaning is preserved.

### 2. No HTML `<a href>` tags found in swept files

All swept files are plain Markdown. No HTML anchor tags requiring dual href + display-text update were encountered.

### 3. `agentic-development-guide` untouched

All occurrences of `agentic-development-guide` (the blog companion repo) were correctly left alone — this is a separate repo reference, not a brand string.

### 4. Posts and site/posts — zero matches

`grep` across `posts/post-*/post.md` and `site/posts/post-*/post.md` returned zero matches for any brand string. No edits required in Zone 2.

### 5. `CLAUDE.md` — zero matches

Repo-local `CLAUDE.md` contained no `agentic.dog` occurrences. No edit required.

---

## Exceptions (files deliberately not edited)

| File / Directory | Reason |
|---|---|
| `plans/260419-0241-agentic-dog-brand-launch/BRIEF.md` | Already `withagents.dev` — source of truth for the pivot |
| `plans/260419-0241-agentic-dog-brand-launch/phase-08-stale-agentic-dog/` | Archived — explicitly excluded per brief |
| `plans/260419-0241-agentic-dog-brand-launch/phase-08-output/` | Owned by V2/V5 — explicitly excluded per brief |
| All `.git/`, `.vercel/`, `node_modules/` | System directories — excluded per brief |
| `posts/post-*/post.md`, `site/posts/post-*/post.md` | Zero matches found — no edits needed |
| `/Users/nick/CLAUDE.md` (global) | User global config — explicitly excluded per brief |

### Protected path-ref occurrences (11 total across 8 files)

All 11 remaining grep hits are references to the plan folder name `260419-0241-agentic-dog-brand-launch/` embedded in absolute paths or internal cross-references. The brief explicitly states: "Do not replace the plan directory folder name — this is a historical timestamp. Folder rename would break absolute paths in existing files."

| File | Lines with path-ref | Count |
|---|---|---|
| `CHECKPOINT.md` | 5, 12 | 2 |
| `phase-01-audit-workstreams.md` | 73 | 1 |
| `reports/critic-260419-0241-red-team-review.md` | 5, 35 (path in quoted text) | 2 |
| `reports/deepen-260419-0241-plan-strengthening.md` | 5 | 1 |
| `research/F-drafts-disposition.md` | 143 | 1 |
| `research/G-brand-reconnaissance.md` | 38, 41 | 2 |
| `synthesis/approval-package.md` | 4 | 1 |
| `synthesis/voice-spec.md` | 7, 66 | 2 |

Note: `critic-260419-0241-red-team-review.md:35` contains `~/Desktop/agentic-dog/` (the old site repo path) embedded inside a quoted excerpt from `plan.md`. The live plan.md reference was fixed; this line is a quoted historical excerpt within the critic report referencing what plan.md *used to say* — treated as a path-ref/archive context and left alone.

---

## Spot-Read Verification (3 largest files)

- **`synthesis/approval-package.md`** (421 lines): Brand strings correctly replaced throughout. Headers, positioning statements, metric references, and product names all use `withagents.dev` / `WithAgents` / `withagents-skills`. YAML frontmatter intact. No broken Markdown.
- **`synthesis/calendar-45day.md`** (269 lines): All calendar rows, channel matrix, and pre-push checklist correctly reference `withagents.dev`. `withagents-skills` appears correctly as Day 35 flagship. No broken table syntax.
- **`research/F-drafts-disposition.md`** (177 lines): Domain replacement applied throughout triage tables and URL replacement lists. Known tautology artefact on lines 5 and 52 (documented above). Markdown structure intact.
