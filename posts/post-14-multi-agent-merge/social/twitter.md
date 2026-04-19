# X Thread — Post 14

**Tweet 1:** Twelve AI agents. Thirty-five git worktrees. One codebase modified in thirty-five places at once.

The merge took ninety seconds. Zero conflicts.

That was the second attempt. The first? 23 conflicts. Three hours of manual untangling.

**Tweet 2:** Post 6 covered getting 194 parallel agents to work without stepping on each other during execution.

This is what happens after they all finish. Parallelism gets agents working at the same time. Choreography is what keeps their work from eating itself alive when they're done.

**Tweet 3:** First attempt: twelve agents, twelve worktrees. Every worktree compiled in isolation. Every feature worked.

Then I started merging.

`package.json` modified by six agents. `types.ts` extended by four. Route index touched by three. Code clean. Coordination wasn't.

**Tweet 4:** File ownership as the core primitive. Before any agent writes anything, every file assigned to exactly one agent:

```json
{
  "agent-auth-api": ["src/api/auth/**"],
  "agent-integrator": ["package.json", "src/types/index.ts"]
}
```

The integrator owns shared files. No feature agent touches package.json directly.

**Tweet 5:** Validation fires before the agent writes anything.

Not "you have a merge conflict" but "you're about to create one." Prevention beats detection by hours.

Conflict prediction compares `git diff --name-only` across all worktree pairs. 35 worktrees = 595 pairs. Runs in under 2 seconds.

**Tweet 6:** Topological sort for merge order. Kahn's algorithm. Dependencies first.

Database schema merges before auth. Auth before platform clients. Integrator last.

The cycle check isn't optional. One build had Agent 5 depend on Agent 8, and 8 on 5. Caught at planning time. Fix: extract shared interface to a third agent.

**Tweet 7:** `run_build_check()` after every merge. Not optional.

If the auth service breaks the build, the media service shouldn't merge on top of a broken foundation. Each merge step produces a working codebase or rolls back with the exact component that caused the failure.

**Tweet 8:** The `expires_at` war story.

API returned ISO 8601 with fractional seconds. iOS `ISO8601DateFormatter` doesn't handle them. Zod rejected timestamps without them.

Three bugs. Two platforms. Six hours of debugging. Four-minute fix: add pattern to OpenAPI spec mandating `.\d{3}Z`.

**Tweet 9:** File ownership catches mechanical conflicts. Can't catch semantic ones.

Three agents modifying three different files. No overlap. No merge conflict. No ownership violation. Code that broke at the protocol level.

Ownership handles mechanics. Only precise specs handle semantics.

**Tweet 10:** 150 minutes sequential → 32 minutes parallel with orchestrated merging. 4.7x speedup.

Three-platform auth build: four days → fourteen hours.

Thirty minutes drawing ownership boundaries beats three hours of conflict resolution. Choreography is what makes the parallelism safe.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
