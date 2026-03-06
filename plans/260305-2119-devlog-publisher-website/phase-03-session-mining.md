# Phase 3: Session Mining & Insight Extraction

**Priority:** High
**Effort:** L (Large)
**Status:** Pending
**Blocked By:** Phase 1
**Blocks:** Phase 4

## Overview

Scan 180 days of Claude Code session history across all projects, extract and rank technical insights, and produce an insight brief identifying the top 10 candidates for new blog posts.

## Context

- Session logs stored as JSONL files in `~/.claude/projects/` and `~/.config/superpowers/conversation-archive/`
- Each JSONL file: one line per message (role, content, timestamp, tools_used)
- Existing devlog-publisher skill scores insights on 7 dimensions (max 75 points)
- 180-day lookback = ~September 2025 to March 2026
- Must avoid duplicating topics already covered in the existing 11 posts

## Existing Post Topics (Exclusion List)

1. Series overview / methodology
2. Multi-agent consensus validation
3. Functional validation (no mocks)
4. iOS SSE streaming bridge
5. SDK bridge (5-layer API)
6. Parallel worktrees at scale
7. Prompt engineering stack (7-layer)
8. Ralph orchestrator (Rust platform)
9. Code-to-audio pipeline
10. Design-to-code with Stitch
11. AI development operating system

## Requirements

### Functional
- Discover all JSONL session files within 180-day window
- Parse and extract human-assistant conversation pairs
- Score each session using 7-dimension weighted formula from devlog-publisher skill
- Identify top 10 novel insights not covered by existing posts
- For each insight: extract real code snippets, terminal output, error messages
- Produce structured output: `session_analysis.md` + `insight_brief.md`

### Non-Functional
- Handle large JSONL files (some sessions are 100K+ lines) without memory issues
- Process in parallel where possible (multiple session files simultaneously)
- Preserve traceability: every insight links back to source session file + line range

## Scoring Formula (from devlog-publisher skill)

| Dimension | Weight | Score 1-5 |
|-----------|--------|-----------|
| Novel Problem-Solving | 3x | Creative approach, undocumented technique |
| Tool/Pattern Discovery | 3x | New MCP usage, agent orchestration, skill creation |
| Before/After Transformation | 2x | Measurable improvement (>10%) |
| Failure + Recovery | 3x | Deep debugging, surprising root cause |
| Reproducibility | 1x | Can another dev follow these steps? |
| Scale/Performance | 1x | Quantified metrics (time, throughput, etc.) |
| Visual Potential | 2x | Architecture diagrams, charts, before/after comparisons |

**Formula:** `(novel*3) + (tool*3) + (before_after*2) + (failure*3) + (reproduce*1) + (scale*1) + (visual*2)`

**Thresholds:** 55-75 exceptional, 40-54 strong, 28-39 moderate, <28 skip

## Implementation Steps

1. **Discover session files**
   - Scan `~/.claude/projects/` for `*.jsonl` files modified within 180 days
   - Scan `~/.config/superpowers/conversation-archive/` for additional archives
   - Filter out files already processed (from March 1 blog generation)
   - Log: total files found, date range covered, total size

2. **Parse and extract insights** (parallel — spawn 3-4 mining agents)
   - Each agent processes a batch of session files
   - Extract: problem description, tools used, errors encountered, resolution, code changes
   - Identify high-signal patterns: error→fix cycles, multi-tool orchestration, performance improvements
   - Flag sessions with 10+ exchanges, multiple tool types, file modifications

3. **Score and rank**
   - Apply 7-dimension scoring to each extracted insight
   - Filter against exclusion list (existing 11 post topics)
   - Rank by composite score
   - Select top 10 with best diversity (avoid clustering on one theme)

4. **Identify candidate topics** (potential new post themes)
   - MCP server creation and integration patterns
   - Custom skill development workflows
   - CI/CD pipeline integration with Claude Code
   - Database migration debugging stories
   - Performance optimization war stories
   - Multi-project orchestration patterns
   - Security audit and remediation workflows
   - API integration failure→success stories
   - Session management and context engineering
   - Plugin/hook development patterns

5. **Produce output artifacts**
   - `session_analysis.md` — Full scan results with session counts, score distributions
   - `insight_brief.md` — Top 10 insights with:
     - Title and angle
     - Source session reference (file path, date, line range)
     - Key code snippets and terminal output
     - Visual opportunity notes (what diagrams/charts would enhance)
     - Companion repo concept (what the example implementation would look like)
     - Estimated composite score

6. **Traction research** (parallel with mining)
   - What technical blog content is performing well right now?
   - Search HackerNews, Dev.to, X/Twitter, LinkedIn for trending AI dev topics
   - Identify gaps in current coverage that our sessions could fill
   - Produce `traction_report.md`

## Output Files

```
plans/260305-2119-devlog-publisher-website/research/
├── session_analysis.md      # Full scan results
├── insight_brief.md         # Top 10 ranked insights
└── traction_report.md       # Content performance research
```

## Success Criteria

- [ ] 180 days of sessions scanned (Sept 2025 – Mar 2026)
- [ ] Session analysis covers all project directories
- [ ] Top 10 insights identified with scores >40
- [ ] Each insight has source session traceability
- [ ] Each insight has code snippets and visual opportunity notes
- [ ] No overlap with existing 11 post topics
- [ ] Traction report identifies 5+ high-opportunity content gaps

## Risk Assessment

- **Volume:** 180 days of sessions across all projects could be massive. Mitigation: parallelize with batched agents, filter aggressively on session length and tool usage.
- **Quality variance:** Many sessions are trivial (single-file edits). Mitigation: pre-filter on minimum 10 exchanges and 3+ tool types before deep analysis.
- **Topic overlap:** Some insights may be variations of existing posts. Mitigation: explicit exclusion list + human review of final top 10.
