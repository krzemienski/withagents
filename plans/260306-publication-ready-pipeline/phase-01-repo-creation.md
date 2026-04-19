# Phase 1: Companion Repo Creation (50 repos)

**Priority:** CRITICAL — blocks all other phases
**Status:** Not started

## Strategy

Each repo follows this structure:
```
{repo-name}/
├── README.md          # Quick start, architecture, usage
├── LICENSE            # MIT
├── pyproject.toml     # or package.json / Cargo.toml / Package.swift
├── src/               # Implementation code
│   └── {module}/      # Main module
├── examples/          # Usage examples
└── .gitignore
```

### Repo Creation Rules

1. **Code must match the post** — Read the post, extract the core technique, implement it
2. **Real implementation** — Not scaffolding. The tool/library must actually do what the post describes
3. **200-500 LOC typical** — Focused, single-purpose tools
4. **Build on clean clone** — `git clone && cd repo && pip install -e .` (or equivalent) must work
5. **CLI entry point** — Where applicable, provide a `cli.py` or bin script for immediate use

## Batch Assignment (5 parallel agents)

### Batch A: Python Core Tools (Posts 12-21) — 10 repos
| Post | Repo Name | Core Deliverable |
|------|-----------|-----------------|
| 12 | ui-validation-at-scale | idb_tap automation framework for 321-screenshot validation |
| 13 | kaizen-algorithm-tuning | PDCA cycle runner for iterative precision improvement |
| 14 | spec-driven-implementation | YAML spec parser → multi-agent task dispatcher |
| 15 | claude-mem-architecture | SQLite observation store with cross-session search |
| 16 | multi-agent-merge-orchestrator | 35-worktree conflict-free merge coordinator |
| 17 | sequential-thinking-debugging | Step-by-step root cause analysis framework |
| 18 | full-stack-orchestrator | 3-platform (Python+Swift+TS) build coordinator |
| 19 | github-to-audio-pipeline | 5-stage markdown→audio transformation |
| 20 | design-token-automation | Cross-platform design token propagation |
| 21 | session-observability | Telemetry framework + analytics dashboard |

### Batch B: Python Advanced (Posts 22-31) — 10 repos
| Post | Repo Name | Core Deliverable |
|------|-----------|-----------------|
| 22 | vision-ground-truth-labeler | Vision model ground truth labeling at scale |
| 24 | agent-constitution-framework | YAML constitution → enforcement engine |
| 27 | playwright-validation-pipeline | Browser automation validation pipeline |
| 28 | claude-code-discipline-hooks | Pre/post tool-use hook enforcement system |
| 29 | session-insight-miner | JSONL session file miner + insight scorer |
| 30 | multi-simulator-orchestrator | Parallel iOS simulator test runner |
| 25 | spec-driven-execution | YAML spec → execution loop (Rust+Python) |
| 26 | electron-to-native-specgen | Platform spec generator from Electron apps |
| 31 | build-cache-guardian | Stale build cache detection + cleanup |
| 23 | pbxproj-agent-toolkit | Xcode pbxproj file parser + modifier |

### Batch C: Python + Mixed (Posts 32-41) — 10 repos
| Post | Repo Name | Core Deliverable |
|------|-----------|-----------------|
| 32 | swiftui-state-patterns | SwiftUI state management reference patterns |
| 33 | ios-ssh-terminal | iOS SSH terminal implementation |
| 34 | ios-icloud-sync-agent | iCloud sync agent for iOS apps |
| 35 | hat-event-orchestrator | Hat-based event routing for agent coordination |
| 36 | ralph-cli-toolkit | CLI toolkit for ralph orchestrator |
| 37 | named-worktree-factory | Named git worktree creation + management |
| 38 | auto-claude-task-factory | Automated Claude Code task spawner |
| 39 | ios-perf-optimizer | iOS performance profiling + optimization |
| 40 | ios-keychain-patterns | iOS Keychain credential storage patterns |
| 41 | runtime-theme-engine | Runtime theme switching engine (TS) |

### Batch D: TypeScript + Tools (Posts 42-51) — 10 repos
| Post | Repo Name | Core Deliverable |
|------|-----------|-----------------|
| 42 | three-layer-validation-stack | 3-tier validation (compile→runtime→visual) |
| 43 | multi-agent-dev-teams | Agent team coordination framework |
| 44 | live-mermaid-editor | Real-time Mermaid diagram editor |
| 45 | agent-sdk-podcast-gen | Agent SDK podcast generation pipeline |
| 46 | supabase-auth-migration | Supabase auth migration toolkit |
| 47 | cdp-automation-toolkit | Chrome DevTools Protocol automation |
| 48 | automated-app-auditor | Automated application audit framework |
| 49 | session-observer-framework | Real-time session observation + alerts |
| 50 | api-limit-recovery | API rate limit detection + recovery |
| 51 | ai-terminal-ui | Terminal UI for AI agent interaction |

### Batch E: Remaining (Posts 52-61) — 10 repos
| Post | Repo Name | Core Deliverable |
|------|-----------|-----------------|
| 52 | checkmark-progress-tracker | Task progress tracking with visual checkmarks |
| 53 | admin-e2e-validator | Admin panel end-to-end validation |
| 54 | spec-rebuild-framework | Full app rebuild from specification |
| 55 | constitution-enforcer | Constitution rule enforcement engine |
| 56 | ralph-loop-patterns | Ralph loop execution patterns |
| 57 | orchestrated-tdd | TDD orchestration with agent loops |
| 58 | gap-analysis-tool | Codebase gap analysis + remediation |
| 59 | gsd-framework | Get Stuff Done execution framework |
| 60 | ralplan-consensus | Consensus-based planning with agents |
| 61 | docs-lookup-pipeline | Documentation lookup + caching pipeline |

## Per-Repo Agent Prompt Template

```
Create companion repo for blog post {N}: "{title}"

Read the post at: posts/post-{NN}-{slug}/post.md

Create the repo at: /Users/nick/Desktop/blog-series/{repo-name}/

Requirements:
1. Read the FULL post to understand the technique
2. Extract the core algorithm/pattern/tool described
3. Implement it as a working {language} package
4. Create README.md with: Quick Start, Architecture, Usage, Examples
5. Create MIT LICENSE (author: Nick Krzemienski, year: 2026)
6. Create .gitignore appropriate for {language}
7. Ensure `{install-cmd}` works from a clean clone
8. Code should be 200-500 lines, focused on the core technique
9. Include at least one working example in examples/

Quality gates:
- README has clear Quick Start section
- Source code implements the actual technique from the post
- .gitignore is appropriate
- No placeholder/TODO code — everything must work
```

## Verification

After all 5 batches complete:
```bash
# Verify all 50 repos exist with required files
for repo in $(cat repo-list.txt); do
  [ -f "$repo/README.md" ] && [ -f "$repo/LICENSE" ] && [ -d "$repo/src" ] || echo "FAIL: $repo"
done
```
