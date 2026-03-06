# Phase 6: Skill Packaging

**Priority:** Medium
**Effort:** L (Large)
**Status:** Pending
**Blocked By:** All prior phases

## Overview

Package the entire pipeline — session scanning, insight extraction, blog writing, example repo generation, visual asset creation, Stitch integration, and publishing workflow — into a single reusable Claude Code skill.

## Context

- Two existing skills: `stitch-loop` (autonomous frontend builder) and `devlog-publisher` (session mining + content pipeline)
- This new skill combines and extends both with: example repo generation, Stitch-integrated imagery, better technical writing, publishing workflow
- Skill location: `~/.claude/skills/devlog-pipeline/` (or user-chosen name)

## Requirements

### Functional
- Single invocation produces: blog post, companion repo, visual assets, social content
- Configurable: lookback window (default 180 days), number of posts, target topics
- Uses Stitch MCP for hero images, social cards, design exploration
- Generates working companion repos (not scaffolding)
- Produces publishing-ready content with social media copy
- Supports both full pipeline and targeted modes (single topic, visuals only, etc.)

### Non-Functional
- SKILL.md under 500 lines (concise, focused)
- Works standalone without requiring blog-series project structure
- Idempotent: re-running with same inputs produces consistent results
- Respects existing devlog-publisher and stitch-loop patterns (composition, not replacement)

## Architecture

```
~/.claude/skills/devlog-pipeline/
├── SKILL.md                    # Main skill definition
├── references/
│   ├── session-mining.md       # Session discovery + parsing protocol
│   ├── insight-scoring.md      # 7-dimension scoring formula
│   ├── blog-writing.md         # Post format, voice, structure
│   ├── repo-generation.md      # Companion repo scaffold + implementation
│   ├── visual-generation.md    # Stitch MCP + Mermaid + SVG patterns
│   ├── publishing-workflow.md  # Pre-publish checklist + social templates
│   └── traction-research.md    # Content performance analysis
└── templates/
    ├── post-frontmatter.md     # Standard frontmatter template
    ├── repo-readme.md          # Companion repo README template
    ├── twitter-thread.md       # X thread template
    ├── linkedin-post.md        # LinkedIn template
    └── newsletter.md           # Newsletter template
```

## Implementation Steps

1. **Design skill interface**
   - Invocation: `/devlog-pipeline [mode] [options]`
   - Modes:
     - `full` — Complete pipeline (scan → write → build repo → visuals → social)
     - `scan` — Session mining only (produces insight brief)
     - `write <topic>` — Write post from specific insight
     - `repo <topic>` — Generate companion repo only
     - `visuals <post-path>` — Generate visual assets for existing post
     - `social <post-path>` — Generate social content for existing post
     - `publish <post-path>` — Run pre-publish checklist
   - Options:
     - `--days N` — Lookback window (default 180)
     - `--count N` — Number of posts to generate (default 10)
     - `--project <path>` — Target project for companion repos
     - `--theme <design.md>` — Design system file for visuals

2. **Write SKILL.md**
   - Trigger patterns: "generate devlog", "scan sessions for blog", "create blog from sessions"
   - Core protocol: session discovery → insight scoring → content generation → visual assets → repo creation → publishing prep
   - Stitch MCP integration: when/how to call, project persistence
   - Teammate spawning pattern (from devlog-publisher): miner, writer, visual creator, social writers
   - Quality gates: traceability check, Mermaid validation, repo build verification

3. **Write reference files**
   - Extract and refine patterns from devlog-publisher and stitch-loop skills
   - Add new patterns: companion repo generation, Stitch-based hero images
   - Document scoring formula with examples
   - Document publishing workflow with checklists

4. **Write templates**
   - Post frontmatter with all required fields
   - Companion repo README with quick start, architecture, usage
   - Social media copy templates with platform-specific formatting rules

5. **Validate the skill**
   - Invoke `/devlog-pipeline scan --days 30` and verify insight brief generated
   - Invoke `/devlog-pipeline write <test-topic>` and verify post + repo created
   - Invoke `/devlog-pipeline visuals <post-path>` and verify Stitch MCP called
   - End-to-end: `/devlog-pipeline full --days 30 --count 1` produces complete output

## Success Criteria

- [ ] SKILL.md written and parseable by Claude Code
- [ ] All reference files provide sufficient context for each sub-workflow
- [ ] `full` mode produces: blog post, companion repo, visuals, social content
- [ ] `scan` mode produces scored insight brief from real sessions
- [ ] Stitch MCP integration generates hero images and social cards
- [ ] Companion repos build and run successfully
- [ ] Skill works independently of blog-series project structure
- [ ] All templates produce platform-compliant output

## Risk Assessment

- **Skill complexity:** Combining 6+ sub-workflows into one skill could make SKILL.md unwieldy. Mitigation: heavy use of reference files, keep SKILL.md as orchestrator only.
- **Stitch MCP availability:** Skill must gracefully handle Stitch being unavailable. Mitigation: fallback to HTML+CSS hero generation without Stitch.
- **Session access:** Skill needs read access to `~/.claude/projects/`. Mitigation: document required permissions, fail with clear error if inaccessible.
- **Scope creep:** Risk of trying to automate everything. Mitigation: start with core pipeline, add modes incrementally based on actual usage.
