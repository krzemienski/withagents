# Miner 3: Parallel Worktrees & Merge Orchestration Evidence

Session source: `~/.claude/projects/-Users-nick-Desktop-awesome-list-site/0ea2a1c3-6f59-4bfa-acc4-fc16c1330fe3.jsonl` (10.8MB, 5461 lines)
Date: Feb 6, 2026 | Session slug: gleaming-beaming-lark | Model: claude-opus-4-6

---

## Post 6: Parallel Worktree Evidence

### Worktree Census (from Claude project directories)

| Project | Worktree Count | Naming Convention |
|---------|---------------|-------------------|
| awesome-list-site | 194 | `tasks-NNN-kebab-description` |
| code-story-platform | 90 | `tasks-NNN-kebab-description` |
| ils-ios | 61 | `tasks-NNN-kebab-description` |
| ralph-orchestrator | 18 | `adjective-noun` (named worktrees) |
| **TOTAL** | **363** | Two conventions |

### Two Naming Conventions Discovered

**Convention 1: Numbered Task Worktrees** (345 total)
Format: `tasks-{NNN}-{kebab-case-description}`
Used by: auto-claude automated coding system
Examples from awesome-list-site:
- `tasks-001-add-tags-admin-manager`
- `tasks-021-reduce-excessive-any-type-usage-for-improved-type-`
- `tasks-073-split-storage-ts-into-domain-based-repository-modu`
- `tasks-109-modularize-routes-and-storage-layers`

Note: Directory names truncated at ~80 chars — causes matching issues requiring glob patterns.

**Convention 2: Named Worktrees** (18 total)
Format: `{adjective}-{noun}` (two-word botanical/animal names)
Used by: ralph-orchestrator (Claude Code's `--worktree` flag)
Complete list:
- brave-daisy, bright-maple, clean-mint, fair-fox
- fresh-cedar, happy-finch, jolly-pine, lucky-reed
- neat-elm, prime-badger, quick-lark, ready-iris
- sleek-sparrow, smart-deer, smooth-rose, snappy-eagle
- sunny-lotus, true-brook

### Maximum Simultaneous Worktrees

From the main session, the awesome-list-site project had **35 active worktrees simultaneously**:

> "Here's the current state of all 35 worktrees. Key columns:
> - **branch**: The git branch (some still on `main`, meaning no feature branch was created)
> - **dirty**: Number of uncommitted changes
> - **ahead**: Number of commits ahead of main"

28 of 35 had active work (commits ahead of main). 7 were abandoned (still on `main`).

### Worktree Status Breakdown (from session data)

Active branches with work (28 with commits ahead of main):
1. 003-add-bookmarks-export-feature | dirty=5 | ahead=5
2. 008-add-character-count-indicator | dirty=2 | ahead=4
3. 019-move-puppeteer-to-optional | dirty=1 | ahead=3
4. **021-reduce-excessive-any-type | dirty=13 | ahead=35** (largest)
5. 023-add-eslint-and-prettier | dirty=2 | ahead=9
6. 024-comprehensive-automated-test-suite | dirty=5 | ahead=28
7. 026-public-api-documentation | dirty=2 | ahead=15
8. 027-user-facing-link-health-indicators | dirty=0 | ahead=14
9. 043-add-component-props-documentation | dirty=2 | ahead=7
10. 046-add-security-practices-doc | dirty=6 | ahead=4
11. 047-create-testing-strategy-doc | dirty=1 | ahead=11
12. 053-remove-static-hierarchical-categories | dirty=2 | ahead=1
13. 054-create-centralized-api-error-handling | dirty=2 | ahead=15
14. 062-social-sharing-embeds | dirty=1 | ahead=18
15. 070-comprehensive-automated-test-suite | dirty=1 | ahead=28
16. **073-split-storage-ts | dirty=2 | ahead=20**
17. 083-move-puppeteer-to-optional | dirty=2 | ahead=5
18. 085-remove-static-hierarchical-categories | dirty=1 | ahead=1
19. 094-seo-optimization | dirty=2 | ahead=14
20. 096-content-health-monitoring | dirty=2 | ahead=22
21. 098-error-monitoring-logging | dirty=1 | ahead=21
22. 099-add-visual-navigation-affordance | dirty=2 | ahead=2
23. 101-add-breadcrumb-navigation | dirty=2 | ahead=2
24. 105-add-rounded-corners-to-textarea | dirty=3 | ahead=2
25. 107-add-visual-navigation-affordance | dirty=3 | ahead=1
26. 108-analytics-usage-dashboard | dirty=2 | ahead=13
27. 113-add-rounded-corners-to-select | dirty=2 | ahead=1
28. 115-add-rounded-corners-to-alert | dirty=2 | ahead=1

### Real Worktree Commands from Session

```bash
# Listing active worktrees
git worktree list | grep auto-claude | wc -l
git worktree list 2>/dev/null | grep auto-claude | sed 's|.*/tasks/||' | sed 's/ .*//'

# Removing worktrees after merge
git worktree remove .auto-claude/worktrees/tasks/023-add-eslint-and-prettier-configuration-for-consiste --force 2>&1
git worktree remove .auto-claude/worktrees/tasks/073-split-storage-ts-into-domain-based-repository-modu/ --force 2>&1

# Pruning stale worktree references
git worktree prune
```

### Worktree Directory Structure

```
awesome-list-site/
└── .auto-claude/
    └── worktrees/
        └── tasks/
            ├── 003-add-bookmarks-export-feature/
            ├── 008-add-character-count-indicator-to-form-fields-with-/
            ├── 021-reduce-excessive-any-type-usage-for-improved-type-/
            ├── 023-add-eslint-and-prettier-configuration-for-consiste/
            ├── 073-split-storage-ts-into-domain-based-repository-modu/
            └── ... (35 total active at peak)
```

### War Story: The 35-Worktree Cleanup Marathon

**Context:** An automated Claude coding system (auto-claude) spawned 119+ numbered task worktrees for awesome-list-site. By cleanup time, 35 remained active. The session `gleaming-beaming-lark` orchestrated the entire cleanup in a single 5461-line session.

**The Problem:**
- 35 active worktrees, each with a feature branch
- 28 had real commits (7 abandoned on `main`)
- 4 "foundation" branches touched 170+ files each, creating massive conflict zones
- Duplicate worktrees existed (019 duplicated by 083, 024 by 070, etc.)

**The 4-Phase Cleanup Plan:**

Phase 1 — Quick Wins:
- Delete 5 abandoned worktrees (057, 063, 075, 077, 080)
- Delete 6 duplicate worktrees (019, 024, 053, 056, 064, 107)
- Create PRs for 5 merge-ready branches (003, 027, 094, 099, 101)
- Script: `phase1-quick-wins.sh` with `--dry-run` support

Phase 2 — Foundation Sequence (sequential, dependency-ordered):
1. Fix TypeScript errors in 021 branch (custom `fix-021-types.sh`)
2. Merge 023-eslint-prettier first (least conflicts)
3. Rebase ALL remaining worktrees onto updated main
4. Merge 021-type-safety (35 commits, 170 files)
5. Rebase ALL remaining again
6. Merge 073-storage-split (20 commits, storage refactor)
7. Run `migrate-storage-imports.sh` on all remaining worktrees
8. Rebase ALL remaining again
9. Merge 054-error-handling

Phase 3 — Finish Incomplete (assess 9 branches: finish vs abandon)
Phase 4 — Final Cleanup (UI polish batch + report)

**Key Scripts Created:**
- `phase1-quick-wins.sh` — batch delete/PR creation
- `rebase-worktrees.sh` — rebase all active worktrees onto origin/main
- `fix-021-types.sh` — fix TypeScript errors in 021 branch
- `migrate-storage-imports.sh` — update storage imports after 073 merge
- `generate-pr-body.sh` — generate PR descriptions from branch diffs

**Worktree Count Progression:**
- Start: 35 active worktrees
- After Phase 1 deletions: 24 worktrees remaining
- After foundation merges: ~21 worktrees remaining

---

## Post 14: Merge Orchestration Evidence

### PR Statistics

- **9 unique PRs created** during the session: #8, #9, #10, #11, #12, #13, #14, #15, #16
- PRs created via: `gh pr create --base main --title "..." --body "..."`
- All merges via squash: `gh api repos/krzemienski/awesome-list-site/pulls/NUMBER/merge -X PUT -f merge_method=squash`

### The `gh pr merge` Bug Discovery

**Critical discovery:** `gh pr merge` fails in worktree setups because it tries to switch to `main` locally after merge — but `main` is already checked out in the main worktree.

Real session quote:
> "The `gh pr merge` is failing because it tries to switch to the `main` branch locally after merge, but `main` is already checked out in the main worktree. Let me use the `--admin` flag or merge via API instead."

**Solution:** Use GitHub API directly instead:
```bash
# Instead of (FAILS in worktrees):
gh pr merge 13 --squash --delete-branch

# Use (WORKS):
gh api repos/krzemienski/awesome-list-site/pulls/13/merge \
  -X PUT \
  -f merge_method=squash \
  -f commit_title="feat(config): add ESLint and Prettier configuration"
```

### Merge Conflict Resolution Strategy

The session documented explicit per-file conflict resolution rules:

```
CONFLICT RESOLUTION STRATEGY:
- .auto-claude-status, .claude_settings.json, .github/:
    git checkout --theirs <file> && git add <file>  (take main)
- package-lock.json:
    git checkout --ours <file> && git add <file>  (keep branch)
- package.json: merge carefully (keep both main entries + branch additions)
- server/storage.ts, server/routes.ts:
    git checkout --ours <file>  (take branch — that's the whole point)
- client files:
    git checkout --theirs <file>  (take main)
- After resolving: git add -A && git commit --no-edit
```

### Merge-then-Rebase-All Pattern

After each foundation branch merge, the pattern was:
1. Merge PR via GitHub API (squash)
2. Update main: `git fetch origin main && git reset --hard origin/main`
3. Cherry-pick local script commits from reflog
4. Remove merged worktree: `git worktree remove <path> --force`
5. Run `rebase-worktrees.sh` on ALL remaining worktrees
6. Log any rebase failures
7. Repeat for next foundation branch

This created a "ripple rebase" pattern — each merge triggered mass rebasing of all remaining branches.

### Foundation Branch Conflict Analysis

```
HIGH CONFLICT RISK:
| Branch | Files Modified | Conflict Zone |
|--------|---------------|---------------|
| 021-type-safety | 170 files | TypeScript types everywhere |
| 073-storage-split | 170 files | Monolithic → repository pattern |
| 054-error-handling | 50 files | All route files |
| 023-eslint-prettier | ~30 files | May reformat all touched files |

CRITICAL: These 4 branches fundamentally restructure the codebase:
- 021: Adds TypeScript types everywhere (170 files)
- 073: Splits monolithic storage.ts into repository pattern (170 files)
- 054: Migrates all routes to centralized error handling (50 route files)
- 023: Adds linting/formatting (may conflict with code style changes)
```

### Merge Sequence (Dependency-Ordered)

The agent determined the correct merge order through conflict analysis:

1. **023-eslint-prettier** (PR #13) — Merge FIRST because it's config-only, fewest conflicts
2. **021-type-safety** — Merge SECOND because types don't change logic, just annotations
3. **073-storage-split** — Merge THIRD because it restructures storage.ts
4. **054-error-handling** — Merge LAST because it depends on the storage structure from 073

Each merge required:
- Pre-merge rebase onto latest main
- Conflict resolution per the strategy above
- Build verification: `npm install && npm run build`
- Force push: `git push --force-with-lease -u origin <branch>`
- PR creation + squash merge via API
- Post-merge rebase of all remaining branches

### War Story: PR #13 Merge — The Worktree Git Lock Discovery

The merge of PR #13 (ESLint/Prettier config) revealed a key worktree limitation:

1. Created PR for 023 branch: `gh pr create --base main --title "feat(config): add ESLint and Prettier configuration"`
2. Attempted merge: `gh pr merge 13 --squash --delete-branch` — **FAILED**
3. Error: git tries to checkout main after merge, but main is locked by the main worktree
4. Pivoted to API: `gh api repos/krzemienski/awesome-list-site/pulls/13/merge -X PUT -f merge_method=squash -f commit_title="feat(config): add ESLint and Prettier configuration"`
5. **SUCCESS** — merged without local branch switching
6. Updated main manually: `cd /Users/nick/Desktop/awesome-list-site && git pull origin main`
7. Removed merged worktree: `git worktree remove .auto-claude/worktrees/tasks/023-... --force`
8. Ran `rebase-worktrees.sh` to rebase all 24 remaining worktrees

### Post-073-Merge Import Migration

After merging 073 (storage split), all remaining worktrees needed import path updates:

```bash
# For each remaining worktree:
bash scripts/migrate-storage-imports.sh <worktree-path>
# Then rebase:
bash scripts/rebase-worktrees.sh
```

This was necessary because 073 changed `import { ... } from './storage'` to `import { ... } from './repositories/...'` across the entire codebase.

---

## Cross-Post Evidence: Scale Metrics

### Total Worktree Activity Across All Projects

| Metric | Value |
|--------|-------|
| Total unique worktree project dirs | 363 |
| awesome-list-site worktrees | 194 (numbered 001-119, many duplicated across batches) |
| code-story-platform worktrees | 90 (numbered 001-090) |
| ils-ios worktrees | 61 (numbered 001-058, some duplicated) |
| ralph-orchestrator worktrees | 18 (named: adjective-noun) |
| Peak simultaneous active | 35 (awesome-list-site) |
| Worktrees with commits | 28 of 35 at peak |
| Largest single branch | 35 commits ahead (021-type-safety) |
| Files touched by foundation branches | 170+ each |
| PRs created in merge session | 9 (#8-#16) |
| Rebase mentions in session | 647 |
| Worktree mentions in session | 2,123 |
| gh pr mentions in session | 584 |
| Session size | 10.8MB, 5,461 lines |

### Task Categories Across Projects

**awesome-list-site** (119 unique task types):
- UI polish (rounded corners, breadcrumbs, navigation affordances)
- Performance (code splitting, virtualization, lazy loading, caching)
- Documentation (JSDocs, API docs, component props, database schema)
- Architecture (storage split, routes modularization, error handling)
- Features (search, bookmarks, collections, social sharing, SEO)
- Type safety (reduce `any` usage, Zod error handling)

**code-story-platform** (90 unique task types):
- Accessibility (ARIA labels, focus rings, touch targets, skeleton states)
- Performance (lazy loading, caching, memoization, SSR)
- Features (playlists, chapters, ratings, sharing, mobile app)
- Documentation (JSDocs, component docs, schema docs)
- Infrastructure (linting, type safety, route splitting)

**ils-ios** (58 unique task types):
- Views (dashboard, skills list, MCP servers, detail views)
- Infrastructure (iCloud sync, SSH, keychain, performance)
- UI patterns (search, swipe actions, status badges, skeletons)
- Documentation (README, SwiftDoc, API reference)

### Key Patterns for Blog Posts

**Post 6 — Parallel Worktrees:**
- Two naming conventions: numbered (`tasks-NNN-slug`) vs named (`adjective-noun`)
- `.auto-claude/worktrees/tasks/` directory structure
- Task YAML definitions drive worktree creation
- Peak of 35 simultaneous worktrees on one project
- Directory name truncation causes glob-pattern matching issues
- 363 total worktree project directories across 4 projects

**Post 14 — Merge Orchestration:**
- `gh pr merge` fails in worktree setups — must use `gh api` directly
- Dependency-ordered merge sequencing for conflicting foundation branches
- "Ripple rebase" pattern: merge one → rebase all remaining → repeat
- Per-file conflict resolution strategies (theirs vs ours rules)
- Custom scripts: `rebase-worktrees.sh`, `migrate-storage-imports.sh`
- 9 PRs created and merged in a single session
- 647 rebase operations referenced in the cleanup session
