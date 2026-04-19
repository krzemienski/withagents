# Post 14: Multi-Agent Merge Orchestration

## Metadata
- Target word count: 2,200
- Source posts: old 16 (35 worktrees, zero conflicts), old 18 (three-platform full-stack orchestration)
- Companion repo: `multi-agent-merge-orchestrator/`
- New content needed: No — two strong source posts cover the full scope

## Opening (hook — 2 sentences max)
12 AI agents. 35 git worktrees. The merge took 90 seconds with zero conflicts — after the first attempt produced 23 conflicts and cost three hours to untangle.

## Narrative Arc

1. **The Catastrophic First Merge** (~400 words, from post 16)
   - 23 conflicts across shared files on the first multi-agent attempt
   - Three hours to resolve by hand
   - Root cause: merge conflicts are a coordination problem, not a coding problem
   - "The agents were not writing bad code. They were writing good code in the same files."

2. **File Ownership as the Core Primitive** (~500 words, from post 16 + post 18)
   - File ownership matrix with glob patterns — each agent owns distinct files
   - `validate_ownership()` running at task-assignment time, not merge time
   - The `package.json` rule: no agent touches it directly; dependency additions go through a manifest file
   - Post 18's cross-platform variant: OpenAPI spec distributes ownership by platform (Python agent owns `src/api/`, Swift agent owns `Sources/`, TypeScript agent owns `src/web/`)
   - The "integrator" agent pattern for shared files that no single agent should own

3. **The `expires_at` War Story** (~400 words, from post 18)
   - ISO 8601 fractional seconds inconsistency: 3 bugs across 2 platforms, 6 hours debugging, 4-minute fix
   - The OpenAPI spec with `expires_at` field: "RFC 3339 with mandatory fractional seconds" as constraint, not documentation
   - Cross-platform model generation from spec eliminates the entire category of serialization bugs
   - Swift Codable decoder vs TypeScript Zod runtime validation — same schema, different enforcement
   - "Every multi-platform team has a version of this story"

4. **Merge Strategy: Topological Sort + Build Verify** (~500 words, from post 16 + post 18)
   - Conflict prediction pass using `git diff` against merge base for each worktree pair
   - Topological sort on dependency graph determines merge order
   - `run_build_check()` after each merge — caught 2 integration issues during the 35-worktree merge
   - Post 18's synchronized validation: identical scenarios across all 3 platforms, `all_schemas_match()` catches structural differences
   - Net time comparison: 32 min parallel vs 150 min sequential (4.7x speedup)
   - 4 days -> 14 hours for 3-platform auth implementation

5. **What Breaks This Pattern** (~200 words, synthesis from both posts)
   - Shared config files that don't lend themselves to ownership splitting
   - Implicit dependencies (runtime coupling not visible in imports)
   - Late-discovered scope expansion (agent needs files outside its ownership)
   - Branch drift when task cycles exceed hours
   - Specs that lie (post 18) — "the contract is only as good as its precision"

## Key Code Blocks to Include
- The ownership dictionary with glob patterns from post 16
- `validate_ownership()` function from post 16 (~15 lines)
- The OpenAPI spec fragment showing `expires_at` with RFC 3339 constraint from post 18
- The merge loop with `topological_sort` and `run_build_check()` from post 16 (~20 lines)

## Real Data Points
- 23 conflicts on first attempt, 0 after ownership system (post 16)
- 35 worktrees merged in 90 seconds (post 16)
- 32 min parallel vs 150 min sequential — 4.7x speedup (post 16)
- 3 bugs from `expires_at` fractional seconds across 2 platforms (post 18)
- 6 hours debugging, 4-minute fix for serialization inconsistency (post 18)
- 4 days -> 14 hours for 3-platform auth implementation (post 18)
- Zero cross-platform serialization bugs in production after contract-first (post 18)
- 55 TaskUpdate orchestration calls in a single session (post 18)

## Material to NOT Include
- Post 16's explanation of git merge basics (audience knows)
- Post 16's "short task cycles" discussion — partially overlaps with worktrees post 6
- Post 18's full three-platform model generation outputs (CSS + Swift + Kotlin) — show 2 max
- Post 18's platform-specific system prompt details (Keychain for iOS, httpOnly for web) — belongs in iOS patterns post or prompt engineering post
- Post 16's upfront investment list — too prescriptive for a narrative post

## Companion Repo Tie-in
The repo provides the merge orchestrator: ownership validator, conflict predictor, topological merge sorter, and build verifier. Post ends with: "The repo includes a 5-worktree demo with intentional ownership violations. Run it to see the validator catch conflicts before any code is written."
