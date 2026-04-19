---
phase: 01
name: audit-workstreams
status: pending
parallel: true
agent_count: 7
---

# Phase 01 — Parallel Audit Workstreams

## Purpose

Produce seven concrete, grounded audit reports in `research/` that feed every downstream synthesis + planning step. Replace guesswork with evidence.

## Input Artifacts Already Gathered

- `scripts/output/full-mine-data.json` — 2026-03-06 mine, 23,479 files, 27 projects, 12.4GB (stale but wide)
- `scripts/output/mine-30d-data.json` — 2026-04-19 fresh mine, 2,671 files, **59 projects**, 2.39GB (recent, narrow)
- `/tmp/gh-repos-raw.json` — 300 GitHub repos for krzemienski
- `~/Desktop/` — 438 top-level entries
- `~/.claude/skills/devlog-publisher/` — reusable mining skill

## Workstream Assignments

Each workstream = 1 agent, reports to `research/{letter}-{slug}.md`. File ownership strict — no overlap.

### A. Session Archaeology Deep-Read (`research/A-session-archaeology.md`)
- Inputs: `mine-30d-data.json` + `full-mine-data.json` + selected full JSONL transcripts for top-5 projects by agent-density
- Output: per-product narrative (triggering problem, techniques invented, breakthroughs, failure→recovery arcs)
- Sampling rule: top-N sessions by agent_spawns per flagship product, NOT full 23K read
- **Narrative-weight filter (added 2026-04-19):** sessions with ≥20 distinct tool calls AND ≥2 user-message exchanges. Exclude test-run patterns (single-prompt + automation-exit). Agent-spawn count alone is a volume proxy, not a narrative proxy.
- Flagship sampling priority: validationforge (257 agents), remodex (180), sessionforge (67), ils-ios (94), yt-shorts-detector (199)

### B. GitHub 300-Repo Catalog (`research/B-github-catalog.md`)
- Inputs: `/tmp/gh-repos-raw.json` + `gh api` for READMEs on flagship repos
- Output: repo→product mapping, activity age, star counts, launch-readiness tag (ready/near/draft/archive), companion-repo flag
- Call out the 61 "Agentic Development #N" companion repos and their current reachability

### C. Desktop Product Scan (`research/C-desktop-product-scan.md`)
- Inputs: `ls ~/Desktop/` (438 entries) + `find` for README + `git log -1` per repo
- Output: local-disk inventory cross-referenced against GitHub list (what's pushed, what's local-only, what's abandoned)
- Tag each: active / stale / abandoned / archived

### D. blog-series Audit (`research/D-blog-series-audit.md`)
- Inputs: `/Users/nick/Desktop/blog-series/posts/`, `site/`, `plans/260305-2119-devlog-publisher-website/`, deployed site-rho-pied.vercel.app status
- Output: current post count, deployment status, asset inventory, what migrates to agentic.dog, what retires, overlap with Phase 09 scope
- Decide disposition of in-progress `devlog-publisher-website` plan (merge into agentic.dog build? complete separately first?)

### E. Skills + Marketing Toolkit Inventory (`research/E-skills-marketing-toolkit.md`)
- Inputs: `~/.claude/skills/` (200+ skills in available list), `.claude/skills/` (project-local), `scripts/`, `.omc/`
- **Required output format (added 2026-04-19):** matrix — `{Mode 2 need} → {1 primary skill, 1 fallback skill, gap flag}`. No raw skill dumps. Mode 2 needs to cover minimally: content gen, OG image render, syndication (LinkedIn share, X thread), analytics install, CTA capture form, voice-spec generation/review, social card render, series index render.
- Gap list: what does agentic.dog need that no skill covers? Name explicitly.

### F. Draft Content Disposition Audit (`research/F-drafts-disposition.md`)
- Inputs: `posts/REVIEW-POSTS-*.md`, `posts/INDEX.md`, any Substack/Medium/LinkedIn drafts on disk, content-hub/marketing-dashboard output
- Output: per-draft triage (publish as-is / edit / merge / retire) aligned to agentic.dog positioning
- Flag anything with legacy "open to full-time" / "Agentic League" language for removal

### G. Brand Reference Reconnaissance (`research/G-brand-reconnaissance.md`)
- Inputs: existing mentions across any repo, README, or bio; social-handle availability checks
- Output: **social-handle availability** (@agenticdog, @hackski, @codestories) + **trademark exposure** + any current public references to these names
- **DNS availability portion dropped (added 2026-04-19):** domains purchased per Decision #1; Workstream G trimmed to handles + trademarks only.

### H. Blog-Series Content Voice Audit (`research/H-blog-series-voice-audit.md`) — **ADDED 2026-04-19**
- Inputs: existing 18 blog-series posts at `/Users/nick/Desktop/blog-series/posts/post-*/post.md`, draft `voice-spec.md` from Phase 02 synthesis, MEMORY.md record of 2026-04-18 Sonnet voice-drift restart
- Output: per-post QA — em-dash count, AI-tell patterns (generic empathy openers, "it's not just X, it's Y", corporate transitions), verdict (publish-as-is / light-edit / rewrite / retire)
- Flags which posts need voice rework before migration into agentic.dog CMS (Phase 09 content seed)
- Rationale: MEMORY.md records Sonnet-drafted-self-reviewed content passing its own review and failing public launch standard. Adding independent voice QA before migration to prevent repeat.

## Orchestration Rules

- All 7 agents spawn in **one message, parallel Agent tool calls**
- Each agent prompt includes: work context `/Users/nick/Desktop/blog-series`, output path `plans/260419-0241-agentic-dog-brand-launch/research/{letter}-*.md`, strict file ownership (its own file only), no cross-agent DMs
- Model selection: `sonnet` default. `opus` only for Workstream A (narrative extraction benefits from deeper reasoning)
- Response cap: 300-word agent summary back + full report in the file

## Acceptance Criteria

- [ ] 8 files in `research/` (A-H) with non-trivial evidence (no "N/A" fields)
- [ ] Each report cites specific JSONL paths, repo URLs, or file paths (not summaries of summaries)
- [ ] Workstream B lists all 59 active-30d projects + their GitHub counterparts
- [ ] Workstream G flags social-handle availability + trademark concerns as open questions for user
- [ ] Workstream E output is a matrix (Mode 2 need → primary + fallback skill), not a skill dump
- [ ] Workstream A excludes test-run sessions via the narrative-weight filter
- [ ] Workstream H reports voice-rework queue for existing 18 posts

## Risks

- **Context saturation in Workstream A** if agent tries to read full JSONL files. Mitigation: agent reads only `mine-30d-data.json` + at most 3 sample JSONL files per flagship (top-spawn sessions).
- **GitHub rate limits** in Workstream B. Mitigation: one `gh repo list` call already cached at `/tmp/gh-repos-raw.json`; only fetch additional READMEs for ~15 flagship repos.
