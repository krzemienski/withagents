#!/bin/bash
# Push all companion repos to GitHub
# Usage: ./scripts/push-repos-to-github.sh [--dry-run]
# Compatible with bash 3.x (macOS default)

set -e

DRY_RUN=false
if [ "$1" = "--dry-run" ]; then
  DRY_RUN=true
  echo "[DRY RUN] No repos will be created or pushed."
fi

BASE="/Users/nick/Desktop/blog-series"
cd "$BASE"

# repo:post_num:description (pipe-delimited)
REPOS="
agentic-development-guide|01|Agentic Development Guide — Meta-repo organizing all series topics
multi-agent-consensus|02|Multi-Agent Consensus — 3-agent unanimous gate voting
functional-validation-framework|03|Functional Validation Framework — Evidence-based validation
claude-ios-streaming-bridge|04|Claude iOS Streaming Bridge — 5-layer SSE bridge
claude-sdk-bridge|05|Claude SDK Bridge — 4 failed + 1 working approach
auto-claude-worktrees|06|Auto Claude Worktrees — 194 parallel worktree factory
claude-prompt-stack|07|Claude Prompt Stack — 7-layer prompt engineering
ralph-orchestrator-guide|08|Ralph Orchestrator Guide — Hat-based agent coordination
code-tales|09|Code Tales — GitHub-to-audio pipeline
stitch-design-to-code|10|Stitch Design to Code — Design tokens + Stitch MCP
ai-dev-operating-system|11|AI Dev Operating System — Meta-system combining all subsystems
ui-validation-at-scale|12|UI Validation at Scale — idb_tap screenshot automation
kaizen-algorithm-tuning|13|Kaizen Algorithm Tuning — PDCA precision improvement loops
spec-driven-implementation|14|Spec-Driven Implementation — YAML spec to multi-agent build
claude-mem-architecture|15|Claude Memory Architecture — Cross-session observation store
multi-agent-merge-orchestrator|16|Multi-Agent Merge Orchestrator — 35-worktree conflict-free merging
sequential-thinking-debugging|17|Sequential Thinking Debugging — 84-step root cause analysis
full-stack-orchestrator|18|Full Stack Orchestrator — 3-platform coordination
github-to-audio-pipeline|19|GitHub to Audio Pipeline — 5-stage content transformation
design-token-automation|20|Design Token Automation — Cross-platform token propagation
session-observability|21|Session Observability — Telemetry framework + analytics dashboard
vision-ground-truth-labeler|22|Vision Ground Truth Labeler — Vision model labeling at scale
pbxproj-agent-toolkit|23|Pbxproj Agent Toolkit — Xcode project file parser
agent-constitution-framework|24|Agent Constitution Framework — YAML constitution enforcement
spec-driven-execution|25|Spec-Driven Execution — YAML spec execution loops
electron-to-native-specgen|26|Electron to Native Specgen — Platform spec generator
playwright-validation-pipeline|27|Playwright Validation Pipeline — Browser automation validation
claude-code-discipline-hooks|28|Claude Code Discipline Hooks — Tool-use hook enforcement
session-insight-miner|29|Session Insight Miner — JSONL session miner + scorer
multi-simulator-orchestrator|30|Multi-Simulator Orchestrator — Parallel iOS simulator testing
build-cache-guardian|31|Build Cache Guardian — Stale cache detection + cleanup
swiftui-state-patterns|32|SwiftUI State Patterns — State management reference patterns
ios-ssh-terminal|33|iOS SSH Terminal — SSH terminal client
ios-icloud-sync-agent|34|iOS iCloud Sync Agent — iCloud sync for iOS apps
hat-event-orchestrator|35|Hat Event Orchestrator — Hat-based event routing
ralph-cli-toolkit|36|Ralph CLI Toolkit — CLI for ralph orchestrator
named-worktree-factory|37|Named Worktree Factory — Named git worktree management
auto-claude-task-factory|38|Auto Claude Task Factory — Automated task spawner
ios-perf-optimizer|39|iOS Performance Optimizer — iOS performance profiling
ios-keychain-patterns|40|iOS Keychain Patterns — Keychain credential storage
runtime-theme-engine|41|Runtime Theme Engine — Runtime theme switching
three-layer-validation-stack|42|Three Layer Validation Stack — Compile/runtime/visual validation
multi-agent-dev-teams|43|Multi-Agent Dev Teams — Agent team coordination
live-mermaid-editor|44|Live Mermaid Editor — Real-time diagram editor
agent-sdk-podcast-gen|45|Agent SDK Podcast Gen — Podcast generation pipeline
supabase-auth-migration|46|Supabase Auth Migration — Auth migration toolkit
cdp-automation-toolkit|47|CDP Automation Toolkit — Chrome DevTools Protocol automation
automated-app-auditor|48|Automated App Auditor — Application audit framework
session-observer-framework|49|Session Observer Framework — Real-time session observation
api-limit-recovery|50|API Limit Recovery — Rate limit detection + recovery
ai-terminal-ui|51|AI Terminal UI — Terminal UI for AI agents
checkmark-progress-tracker|52|Checkmark Progress Tracker — Visual task progress tracking
admin-e2e-validator|53|Admin E2E Validator — Admin panel validation
spec-rebuild-framework|54|Spec Rebuild Framework — Full app rebuild from spec
constitution-enforcer|55|Constitution Enforcer — Rule enforcement engine
ralph-loop-patterns|56|Ralph Loop Patterns — Self-referential loop execution
orchestrated-tdd|57|Orchestrated TDD — Agent-driven test loops
gap-analysis-tool|58|Gap Analysis Tool — Codebase gap analysis
gsd-framework|59|GSD Framework — Get Stuff Done execution
ralplan-consensus|60|Ralplan Consensus — Multi-agent consensus planning
docs-lookup-pipeline|61|Documentation Lookup Pipeline — Doc lookup + caching
"

created=0
skipped=0
failed=0

echo "$REPOS" | grep -v '^$' | while IFS='|' read -r repo num desc; do
  # Check if repo dir exists locally
  if [ ! -d "$BASE/$repo" ]; then
    echo "SKIP (no dir): $repo"
    skipped=$((skipped+1))
    continue
  fi

  # Check if already on GitHub
  if gh repo view "krzemienski/$repo" --json url >/dev/null 2>&1; then
    echo "EXISTS: $repo"
    skipped=$((skipped+1))
    continue
  fi

  echo "CREATE: $repo — $desc"

  if [ "$DRY_RUN" = true ]; then
    continue
  fi

  cd "$BASE/$repo"

  # Init git if needed
  if [ ! -d ".git" ]; then
    git init -b main
    git add -A
    git commit -m "feat: companion repo for Agentic Development post $num

Part of the Agentic Development series: 61 Lessons from 8,481 AI Coding Sessions."
  else
    git add -A
    git diff --cached --quiet || git commit -m "feat: update companion repo for post $num"
  fi

  # Create and push
  if gh repo create "krzemienski/$repo" \
    --public \
    --description "$desc — Companion repo for Agentic Development #$num" \
    --source=. \
    --push 2>&1; then
    echo "  OK: https://github.com/krzemienski/$repo"
  else
    echo "  FAILED: $repo"
  fi

  cd "$BASE"
  sleep 2
done

echo ""
echo "=== Done ==="
