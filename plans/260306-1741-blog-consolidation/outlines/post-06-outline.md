# Post 6: "194 Parallel Agents, Zero Merge Conflicts"

## Metadata
- Target word count: 2,200
- Source posts: old 06 (parallel worktrees -- longest original at 15,424 words), old 16 (merge orchestration, 1,874 words), old 37 (named worktrees, 6,318 words)
- Companion repo: `autonomous-claude-code-builder` (Python, 2 stars)
- New content needed: No -- post 06 alone has 15,424 words of material. The challenge is cutting, not writing.

## Opening (hook -- 2 sentences max)
194 agents ran in parallel across the same codebase. Zero merge conflicts.

## Narrative Arc

1. **The problem: agents editing the same file** -- The default mode of AI coding is one agent, one branch, one context window. But real projects need parallel work -- feature A and feature B developed simultaneously. The moment two agents touch the same file, you get merge conflicts that neither agent understands. The naive solution (just use branches) fails because branches still share a working directory. Git worktrees solve this: each agent gets its own physical copy of the repository with its own working tree, all sharing the same .git history. ~300 words

2. **The worktree factory** -- From post 06. The `auto-claude-worktrees` system that provisions isolated environments. Each worktree gets: its own branch, its own working directory, its own Claude Code session, and a task.yaml defining what it should do. The factory pattern: `create_worktree(task_name, base_branch) -> WorktreeContext` returns an isolated context with pre-configured environment variables, file ownership boundaries, and a cleanup hook. The 194-worktree run: code-story-platform project, 90 worktrees for feature work plus worktrees for validation and integration. ~400 words

3. **Named conventions that prevent chaos** -- From post 37. When you have 194 worktrees, names like `worktree-1` through `worktree-194` are useless. The naming convention system: `feature/auth-oauth-flow`, `fix/memory-leak-image-cache`, `experiment/alt-streaming-parser`. Three prefixes (feature/, fix/, experiment/) with kebab-case descriptors. The rule: if you cannot understand what the worktree does from its name in `git worktree list` output, the name is wrong. Real example from ralph-orchestrator: 10+ named worktrees visible in a single `git worktree list` output, each immediately comprehensible. ~350 words

4. **The merge orchestrator** -- From post 16. 194 worktrees producing 194 branches that all need to merge back to main. The orchestration pattern: topological sort by dependency, merge in waves, validate after each wave. Wave 1: independent features (no shared files). Wave 2: features that depend on Wave 1. Wave 3: integration and cross-cutting concerns. The key insight: file ownership declarations in task.yaml prevent conflicts at creation time rather than resolving them at merge time. If two tasks declare overlapping file ownership, the orchestrator rejects the second task before it starts. ~400 words

5. **The task.yaml batch executor** -- From post 06. The declarative task specification that drives the factory. Each task.yaml declares: the objective, file ownership (glob patterns), the base branch, dependencies on other tasks, and success criteria. The batch executor reads a directory of task.yaml files, topologically sorts them, provisions worktrees, launches agents, monitors completion, and triggers merges. Real task.yaml example showing a compact 10-line spec that produces a fully isolated agent session. ~350 words

6. **When worktrees are not the answer** -- The honest section. Worktrees add overhead: disk space (each is a full working copy), cognitive load (tracking 194 parallel streams), and merge complexity. For small changes (< 3 files), a single branch is simpler. For tightly coupled changes (shared state, database migrations), worktrees create the illusion of independence. The rule of thumb: if two tasks share more than 2 files, they should be one task in one worktree. ~250 words

## Key Code Blocks to Include
- The `create_worktree()` factory function signature -- from post 06
- A compact task.yaml example (10 lines) -- from post 06
- `git worktree list` output showing named conventions -- from post 37
- The file ownership conflict check (pseudocode) -- from post 16

## Real Data Points
- 194 parallel worktrees, zero merge conflicts (post 06)
- code-story-platform: 90 worktrees for feature work (post 06)
- ralph-orchestrator: 10+ named worktrees (post 37)
- ils-ios: .auto-claude/worktrees/ directory structure (session evidence)
- Topological merge in waves: independent first, dependent second (post 16)
- File ownership declarations prevent conflicts at creation time (post 16)

## Material to NOT Include
- Merge strategy implementation details (that's post 14)
- Ralph loop patterns and hat-based orchestration (that's post 8)
- The full WorktreeManager class from post 06 (too long at 15,424 words of source)
- The monitoring dashboard from post 06
- The worktree cleanup/garbage collection system from post 06
- The full merge conflict resolution algorithm from post 16
- Post 37's complete naming taxonomy with all prefix types
- Post 06's benchmarking section comparing worktree vs branch performance

## Companion Repo Tie-in
The `autonomous-claude-code-builder` repo contains the worktree factory, task.yaml batch executor, and merge orchestrator. "Drop a directory of task.yaml files in, run the executor, and watch 194 agents work in parallel without stepping on each other. Start with 3 worktrees to understand the pattern before scaling up."
