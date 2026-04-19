# Phase 10 — Content Agent Assignment Matrix

**Status:** Staged, ready to fire after P09 gate re-verified.
**Source:** `synthesis/calendar-45day.md` R4 (45 posts) + CHECKPOINT.md parallelization map.
**Dispatch model:** 9 agents × 5 posts each = 45 posts. Strict file ownership per post-slug. No overlap.
**Writer model:** Opus for copywriter/narrative agents (every agent in this phase = copywriter). Sonnet rejected (voice drift incident 2026-04-18).
**Review protocol:** every draft reviewed by a *different* model before publish. Reviewer = Sonnet. Logs to `reports/voice-review-{slug}.md`.
**Voice guard:** em-dash ≤5 per 1000 words. Banlist from `synthesis/voice-spec.md`. Cite a real 23,261-session JSONL for every claim; zero fabrication.
**Content output path:** `/Users/nick/Desktop/blog-series/withagents-site/src/content/posts/` (Keystatic schema). Companion artifacts (LinkedIn article body, X thread, README patch) under `src/content/posts/{slug}/` or sibling files.

---

## Wave 1a — 9 parallel agents

### P10-C1 — Flagship quintet (highest narrative risk, all Opus)
**Est:** 40h (~8h per flagship + 1 overflow insight)
**Posts:**
1. **Day 01 — ValidationForge GA** (net-new 1,800w + LinkedIn Article 1,200w + X thread + README)
2. **Day 10 — CCB Evolution: eighteen generations of an agent builder** (net-new 2,200w flagship + LinkedIn + X + README)
3. **Day 22 — Ralph Orchestrator origin** (net-new 2,000w flagship — 64-day arc narrative + LinkedIn + X + README)
4. **Day 35 — withagents-skills package launch + meta-post** (net-new 2,000w + LinkedIn + X + README)
5. **Day 50 — SessionForge + Code Stories + closing manifesto** (3-part 2,400w + manifesto-only LinkedIn + 45-day arc X thread + multi-repo README patches)

**Evidence requirement:** every flagship cites ≥3 real JSONL session lines with transcript quotes. Voice spec example set (H-audit.md) is the target.

### P10-C2 — Shannon ecosystem + fill
**Est:** 20h
**Posts:**
1. Day 15 Shannon Framework (light-edit existing post-07)
2. Day 16 Shannon CLI (net-new 1,000w)
3. Day 17 Shannon MCP (net-new 1,200w — verify repo state first)
4. Day 18 Shannon CC (net-new 1,000w — verify repo state)
5. Day 02 Multi-Agent Consensus (light-edit existing post-02)

### P10-C3 — Ralph arc remainder + fills
**Est:** 20h
**Posts:**
1. Day 23 Ralph Orchestrator iOS (net-new 1,400w)
2. Day 24 RALPH Protocol (net-new 1,300w)
3. Day 07 Ralph Loop teaser (light-edit post-08 + withagents-scoped X)
4. Day 04 Orchestration Topology meta-post (net-new 1,400w)
5. Day 51 "Validation across 6 products" meta-post (net-new 1,400w)

### P10-C4 — 6 skill-of-the-week posts
**Est:** 24h
**Posts:**
1. Day 34 devlog-publisher
2. Day 36 functional-validation
3. Day 37 ck-plan
4. Day 38 visual-explainer
5. Day 39 deepen-prompt-plan
(Day 40 ai-dev-operating-system goes to P10-C5 for balance)

### P10-C5 — Core product posts + 1 skill
**Est:** 20h
**Posts:**
1. Day 05 Auto-Claude Worktrees (light-edit post-06)
2. Day 09 iOS Streaming Bridge (light-edit post-04 + header fix)
3. Day 12 Claude SDK Bridge (light-edit + reframe)
4. Day 26 Multi-Agent Merge (light-edit post-14 + repo URL fix)
5. Day 40 ai-dev-operating-system skill

### P10-C6 — New-surface product posts
**Est:** 20h
**Posts:**
1. Day 11 CCBios / ccbios-enhanced (net-new 1,200w)
2. Day 13 ClaudeCodeSDK (net-new 1,100w)
3. Day 14 Claude Prompt Stack (light-edit post-07-companion)
4. Day 42 cc-setup (net-new 1,000w)
5. Day 43 Autonomous Coder (net-new 1,100w)

### P10-C7 — Mobile + audio product posts
**Est:** 20h
**Posts:**
1. Day 44 opencode-mobile (net-new 1,100w)
2. Day 45 claude-mobile-expo (net-new 1,000w)
3. Day 46 claude-code-prd-creator (net-new 1,000w)
4. Day 47 live-mermaid-editor (net-new 900w)
5. Day 49 github-to-audio pipeline (net-new 1,200w)

### P10-C8 — Insight posts + remaining light-edits
**Est:** 22h
**Posts:**
1. Day 03 Insight 5 "9.6:1 read-to-write" (net-new 900w)
2. Day 08 Insight 6 "3 agents caught P2 bug" (net-new 800w)
3. Day 21 Insight 4 "81% agents-spawning-agents" (net-new 1,100w)
4. Day 19 claude-mem Architecture (light-edit post-12)
5. Day 25 Sequential-Thinking Debugging (light-edit post-13 — em-dash trim to ≤5/1k REQUIRED)

### P10-C9 — Tail products + finale supporting + devlogs
**Est:** 30h
**Posts:**
1. Day 20 session-insight-miner (net-new 900w)
2. Day 27 Playwright Validation Pipeline (net-new 900w)
3. Day 28 Kaizen (net-new 800w)
4. Day 29 Agent Constitution Framework (net-new 1,000w)
5. Day 31 + Day 60 retro devlogs (net-new 500w + 1,800w)

---

## File ownership locks (no agent may edit outside their list)

Each agent owns the content file at path `src/content/posts/day-NN-{slug}.mdx` for their assigned day numbers. Agents may READ:
- `BRIEF.md` (brand canon)
- `synthesis/voice-spec.md` (voice banlist, warmth calibration)
- `synthesis/narrative-spine.md` (thesis)
- `synthesis/insight-library.md` (evidence pointers)
- `synthesis/product-inventory.md` (product facts)
- `synthesis/calendar-45day.md` (setup_for_next column — MUST honor)
- `research/H-blog-series-voice-audit.md` (tone examples)
- existing posts in `posts/post-{01..18}-*/` (when light-editing)
- `scripts/output/mine-30d-data.json` + `mine-360d-data.json` (for evidence citations)

Agents may NOT edit:
- Any file under `phase-08-output/`
- Any file under `phase-09-output/`
- Any file under `synthesis/` or `research/`
- `astro.config.mjs`, `keystatic.config.ts`, or any template file in `withagents-site/src/components/` or `src/layouts/`
- Other agents' assigned post files

---

## Per-post deliverable spec

Every post delivers:
1. **Canonical MDX** at `withagents-site/src/content/posts/day-NN-{slug}.mdx` — frontmatter conforming to Keystatic `posts` schema + body.
2. **LinkedIn Article companion** at `withagents-site/src/content/posts/day-NN-{slug}.linkedin.md` (manual paste-ready, 800-1,500w, canonical URL at the foot).
3. **X thread** at `withagents-site/src/content/posts/day-NN-{slug}.x.md` (7-12 tweets, char-count annotated).
4. **README patch text** at `withagents-site/src/content/posts/day-NN-{slug}.readme-patch.md` (paragraph for the companion repo's README, "Featured in" style).
5. **Voice self-check** — trailing comment block listing: em-dash count, em-dash per 1k words (must be ≤5.0), banlist hit count (must be 0), opener formula match (specific detail → one-sentence paragraph → failure-before-success: pass/fail).

---

## Review pass spec (Wave 1b — after Wave 1a completes)

**Model:** Sonnet (different from writer's Opus — enforces model-different review protocol from voice-spec.md §review-protocol).
**One reviewer per writer agent** — reads the writer's 5 posts + voice-spec.md + H-audit.md, produces `reports/voice-review-day-NN-{slug}.md` per post. Format:
- Em-dash count / per 1k words
- Banlist hits (0 expected)
- Opener formula compliance
- Warmth beat present + tied to artifact (not audience)
- Rhetorical-aside count (≤1 total)
- Self-deprecating admission present (post-6 L355 / post-14 L434 template)
- Verdict: SHIP / MINOR-EDIT / REWRITE

**≥3 banlist hits = REWRITE** (no inline polish). REWRITE kicks back to writer agent with annotated diff.

---

## Risk gates (embedded from calendar-45day.md)

Writer agents must check these Day -N deadlines before drafting:
- CCB canonical repo (Day -10): user confirms which CCB repo
- Ralph arc repo liveness (Day -7): verify `ralph-orchestrator` GitHub state
- Shannon ecosystem repo states (Day -7)
- withagents-skills package build (Day -30 start, 80% by Day 30 push)

If a gate fails, fallback to Reserve A/B/C insight posts documented in calendar §Risk Gates.

---

## Summary
- 9 agents, 45 posts, ~216h total writer effort (per calendar-45day.md: 338h Phase 10 budget minus Wave 1b review + minus content-already-reused)
- Strict file ownership prevents merge conflicts
- Model-different review protocol non-negotiable
- Ship-ready when: 45 MDX files + 45 LinkedIn + 45 X + 30 READMEs committed to withagents-site/ and voice-review logs show 0 REWRITE verdicts
