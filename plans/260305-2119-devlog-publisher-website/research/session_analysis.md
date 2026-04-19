# Session Mining Analysis Report

**Date**: 2026-03-05
**Period scanned**: ~180 days (2025-09 through 2026-03-05)
**Actual file date range**: 2025-11-16 to 2026-03-05 (Claude projects: 2026-01-19 to 2026-03-05; Superpowers: broader range)

## Scan Summary

| Metric | Value |
|--------|-------|
| Claude Projects JSONL files | 23,721 |
| Superpowers Archive JSONL files | 119,854 |
| Claude Projects total size | 884 MB |
| Superpowers Archive total size | 1.8 GB |
| Combined total | ~2.7 GB |
| Unique project directories | 30+ |
| Sessions deeply sampled | 16 |

## Major Projects Discovered

| Project | Claude Size | SP Size | Sessions | Primary Domain |
|---------|-----------|---------|----------|----------------|
| ils-ios | 4.7 GB | 3.0 GB | 4,053 | SwiftUI iOS + Vapor backend |
| yt-transition-shorts-detector | 1.4 GB | 679 MB | 1,263 | Python video analysis |
| ralph-orchestrator | 982 MB | 576 MB | 894 | Rust orchestration platform |
| claude-mem-observer | 681 MB | 2.1 GB | 14,391 | Memory/observation system |
| sessionforge | 629 MB | 492 MB | 581 | Next.js content platform |
| awesome-site | 282 MB | 172 MB | 368 | Next.js website rebuild |
| ai-digest | 248 MB | 191 MB | 279 | AI pipeline (categorize/score/summarize) |
| awesome-list-site | 50 MB | 623 MB | 147 | Next.js + auto-claude worktrees |
| code-tales-ios | 53 MB | 542 MB | 62 | SwiftUI audio story app |
| code-story-platform | N/A | 323 MB | 8 | Multi-platform content platform |
| shannon-cli | N/A | 82 MB | 81 | AI framework (predecessor) |
| Auto-Claude | small | small | ~10 | Electron desktop app |
| code-story-ralph-validation | N/A | 86 MB | ~50 | Multi-platform validation |

## Tool Usage Patterns Across Sampled Sessions

### Most Common Tool Profiles

1. **Heavy Bash + Read + Edit** — Standard development sessions (all projects)
2. **Simulator-heavy** — iOS validation (idb_tap: 235, screenshot: 321 in one session)
3. **Playwright-heavy** — Web validation (browser_click: 77, screenshot: 53, navigate: 51)
4. **Sequential Thinking-heavy** — Algorithm tuning (84 uses in one session)
5. **Task/TaskUpdate-heavy** — Multi-agent orchestration (55 TaskUpdate, 40 Task in one session)
6. **Stitch MCP** — Design generation (26 generate_screen_from_text in one session)

### Orchestration Patterns Observed

- **Ralph Loop**: Self-referential iteration (2-100 iterations) with stop hooks
- **Ralph-specum**: Spec-driven development (new → requirements → design → tasks → implement)
- **Team mode**: Multiple parallel agents with TaskCreate/TaskUpdate
- **Ultrawork**: Maximum parallelism mode
- **Autopilot**: Full autonomous execution
- **PDCA (Kaizen)**: Plan-Do-Check-Act cycles for algorithm tuning
- **Claude-Mem Observer**: Parallel session recording observations

### Key Session Archetypes

1. **Deep debugging** — Error investigation chains with sequential thinking
2. **Multi-agent builds** — 4-12 parallel agents with file ownership
3. **UI validation marathons** — 300+ screenshot/tap cycles
4. **Algorithm precision tuning** — Ground truth comparison with drift analysis
5. **Full-stack orchestration** — Backend + iOS + web in single session
6. **Spec-driven autonomous** — Requirements → design → tasks → implement pipeline
7. **Merge conflict resolution** — 35 worktree management + conflict resolution

## Score Distribution Summary

Using the 7-dimension weighted formula (max 75):
- Candidates scoring >55: 3
- Candidates scoring 45-55: 4
- Candidates scoring 40-45: 3
- Below threshold (<40): Remaining insights excluded

Top scoring themes:
1. Autonomous UI validation at scale (321 screenshots)
2. PDCA algorithm precision tuning with ground truth
3. Spec-driven development pipeline (ralph-specum)
4. Cross-session memory architecture (Claude-Mem)
5. Auto-Claude worktree management at scale
