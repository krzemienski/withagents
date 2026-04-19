# LinkedIn — Post 14

Twelve AI agents. Thirty-five git worktrees. One codebase modified in thirty-five places at once. The merge took ninety seconds. Zero conflicts.

That was the second attempt. The first? Twenty-three conflicts. Three hours of manual untangling.

**Parallelism Versus Choreography**

Post 6 covered getting 194 parallel agents to work without stepping on each other during execution. This is what happens after they all finish. Parallelism gets agents working at the same time. Choreography is what keeps their work from eating itself alive when they're done.

First attempt: twelve agents, twelve worktrees. Every worktree compiled in isolation. Every feature worked. Then I started merging. `package.json` modified by six agents. `types.ts` extended by four. Route index touched by three. Code clean. Coordination wasn't.

During manual resolution, I introduced two regressions by picking the wrong side of a conflict in a file I hadn't fully read. Merge conflicts are a coordination problem, not a coding problem.

**File Ownership as the Core Primitive**

Before any agent writes anything, every file in the project gets assigned to exactly one agent via glob patterns. `agent-auth-api` owns `src/api/auth/**`. `agent-integrator` owns `package.json`, `src/types/index.ts`, and the route registry.

The integrator role is the insight that makes this work. Every multi-agent project has shared files no feature agent should own. Those belong to a dedicated integration agent that runs last. No feature agent touches `package.json` directly. Dependency additions go through a manifest the integrator consumes.

Validation fires before the agent writes anything. Not "you have a merge conflict" but "you're about to create one." Prevention beats detection by hours. Conflict prediction compares `git diff --name-only` across all worktree pairs. 35 worktrees equals 595 pairs to check. Runs in under two seconds.

**Topological Sort Plus Build Verification**

Kahn's algorithm. Database schema merges before auth. Auth before platform clients. Integrator last. Each layer depends only on layers below it.

The cycle check isn't optional. One build had Agent 5 declare a dependency on Agent 8, and Agent 8 on Agent 5. Caught at planning time. Fix: extract the shared interface to a third agent.

`run_build_check()` after every merge. If the auth service breaks the build, the media service shouldn't merge on top of a broken foundation. Each merge step produces a working codebase or rolls back with the exact component that caused the failure.

The `expires_at` war story shows what file ownership can't catch. API returned ISO 8601 with fractional seconds sometimes, without them other times. iOS's `ISO8601DateFormatter` doesn't handle fractional seconds. Zod rejected timestamps without them. Three bugs. Two platforms. Six hours of debugging. Four-minute fix: add a regex pattern to the OpenAPI spec. Three agents modifying three different files. No overlap. No merge conflict. No ownership violation. Code that broke at the protocol level.

Ownership handles mechanics. Only precise specs handle semantics. 150 minutes sequential to 32 minutes parallel with orchestrated merging. 4.7x speedup. The three-platform auth build went from four days to fourteen hours. Thirty minutes drawing ownership boundaries beats three hours of conflict resolution every time.

Full post + code in the comments.
