# Publication-Ready Pipeline: From 61 Posts to Full Launch

**Date:** 2026-03-06
**Status:** Planning
**Goal:** Take 61 written posts from draft state to fully publication-ready with functional companion repos, post-repo integration, SEO optimization, social content, and publishing schedule.

## Current State

| Asset | Posts 1-11 | Posts 12-21 | Posts 22-61 |
|-------|-----------|-------------|-------------|
| post.md (6k+ words) | Done | Done | Done |
| Companion repo (local) | 10 exist | 0 exist | 0 exist |
| Companion repo (GitHub) | 0 pushed | 0 pushed | 0 pushed |
| Hero card HTML | Done | Done | Done |
| Social content | Done (generic) | Done (generic) | Done (generic) |
| Post-repo code links | None | None | None |
| SEO internal links | None | None | None |

**Bottom line:** 50 companion repos need to be created, all 61 need GitHub push, all 61 posts need repo code integration and SEO polish, social content needs rewrite.

## Phases

1. [Phase 1: Companion Repo Creation](./phase-01-repo-creation.md) — Create 50 repos
2. [Phase 2: Post-Repo Integration](./phase-02-post-repo-integration.md) — Link posts to repo code
3. [Phase 3: GitHub Push](./phase-03-github-push.md) — Push all 61 repos
4. [Phase 4: SEO & Site Updates](./phase-04-seo-site.md) — Internal links, meta, schedule page
5. [Phase 5: Social Content Rewrite](./phase-05-social-rewrite.md) — Post-specific social
6. [Phase 6: Build, Validate, Deploy](./phase-06-deploy.md) — Final verification

## Execution Strategy

- Phases 1-2 are the critical path (largest scope)
- Phase 1 uses parallel agents batched by language
- Phase 3 is a mechanical script (sequential GitHub API calls)
- Phases 4-5 can run in parallel after Phase 3
- Phase 6 is sequential (build → verify → deploy)

## Repo Inventory (50 repos to create)

### Python (28 repos)
12: ui-validation-at-scale, 13: kaizen-algorithm-tuning, 14: spec-driven-implementation,
15: claude-mem-architecture, 16: multi-agent-merge-orchestrator, 17: sequential-thinking-debugging,
18: full-stack-orchestrator, 19: github-to-audio-pipeline, 20: design-token-automation,
21: session-observability, 22: vision-ground-truth-labeler, 24: agent-constitution-framework,
27: playwright-validation-pipeline, 28: claude-code-discipline-hooks, 29: session-insight-miner,
30: multi-simulator-orchestrator, 35: hat-event-orchestrator, 38: auto-claude-task-factory,
42: three-layer-validation-stack, 43: multi-agent-dev-teams, 45: agent-sdk-podcast-gen,
48: automated-app-auditor, 49: session-observer-framework, 50: api-limit-recovery,
52: checkmark-progress-tracker, 53: admin-e2e-validator, 55: constitution-enforcer,
58: gap-analysis-tool

### TypeScript/Node.js (10 repos)
26: electron-to-native-specgen, 31: build-cache-guardian, 41: runtime-theme-engine,
44: live-mermaid-editor, 46: supabase-auth-migration, 47: cdp-automation-toolkit,
51: ai-terminal-ui, 54: spec-rebuild-framework, 59: gsd-framework, 61: docs-lookup-pipeline

### Swift/iOS (5 repos)
23: pbxproj-agent-toolkit, 32: swiftui-state-patterns, 33: ios-ssh-terminal,
34: ios-icloud-sync-agent, 39: ios-perf-optimizer, 40: ios-keychain-patterns

### Rust (3 repos)
25: spec-driven-implementation (note: conflicts with post 14 name — needs dedup),
36: ralph-cli-toolkit, 37: named-worktree-factory

### Python + CLI (4 repos)
56: ralph-loop-patterns, 57: orchestrated-tdd, 60: ralplan-consensus

## Success Criteria

- [ ] All 61 companion repos exist locally with README + LICENSE + working src/
- [ ] All 61 repos pushed to github.com/krzemienski/{name}
- [ ] All 61 posts reference repo code with GitHub hyperlinks
- [ ] All 61 posts have post-specific social content (not templates)
- [ ] Site builds with 68+ static pages
- [ ] SEO: internal cross-links, meta descriptions, structured data
- [ ] Publishing schedule page on site
- [ ] Deployed to Vercel production
