# 35 worktrees, 12 agents, zero merge conflicts

Twelve AI agents. Thirty-five git worktrees. One codebase modified in thirty-five places at once. The merge took ninety seconds. Zero conflicts.

That was the second attempt. The first? Twenty-three conflicts. Three hours of manual untangling.

Parallelism gets agents working at the same time. **Choreography** is what keeps their work from eating itself alive when they finish.

---

## The three-hour merge from hell

Twelve agents. Each in its own worktree. Four hours of coding. Every worktree compiled in isolation.

Then I started merging.

Twenty-three conflicts across shared files:
- `package.json` modified by six agents adding dependencies
- `types.ts` extended by four agents adding interfaces
- `routes/index.ts` touched by three agents registering endpoints

During manual resolution I introduced two regressions by picking the wrong side of conflicts in files I had not fully read. One cost twenty minutes to find. The other cost longer.

Merge conflicts are a coordination problem, not a coding problem.

---

## File ownership as the core primitive

Before any agent writes anything, every file gets assigned to exactly one agent via glob patterns:

```
agent-auth-api    : src/api/auth/**, src/models/user.py
agent-ios         : Sources/**/*.swift
agent-web         : src/web/**/*.tsx
agent-integrator  : package.json, src/types/index.ts, src/routes/index.ts
```

The `agent-integrator` role is what makes it hold together. Every multi-agent project has shared files no feature agent should own. The integrator runs last, reads feature outputs (dependency manifests, type declarations, route definitions), and assembles the shared files.

Validation fires at **task-assignment time**, not merge time. `OwnershipViolation` before the agent writes anything is worth twenty "you have a merge conflict" warnings after.

---

## Conflict prediction

With 35 worktrees, that's 595 pair-wise diff comparisons. It runs in under two seconds because it only compares `git diff --name-only`, not contents.

On the thirty-five-worktree build, the predictor caught two issues:
- A shared utility modified in two worktrees (glob pattern too broad)
- A type rename in one worktree that broke imports in another

Both fixed in minutes by adjusting ownership. Buried in conflict markers during merge, they would have cost an hour each.

---

## Topological merge ordering

File ownership prevents conflicts. Even without conflicts, merge order matters.

Five-step algorithm: build dependency graph → compute in-degree → queue zero-degree branches → merge and decrement → detect cycles at the end.

One build hit a cycle: Agent 5 depended on Agent 8, Agent 8 depended on Agent 5. The fix was a foundation branch owned by a third agent. The topological sort caught this at planning time, not mid-merge when neither branch could compile.

---

## What ownership can't catch

Honest limits.

- **Implicit runtime coupling.** Agent A adds a global event listener. Agent B adds another. Neither imports the other's code. They interact at runtime through the event bus. The ownership validator cannot see this. I haven't found a way to catch it statically.
- **Spec imprecision.** The `expires_at` bug: three agents modified three different files, zero ownership violation, code that broke at the protocol level because "date-time" is not a contract. Ownership handles mechanics. Only precise specs handle semantics.
- **Branch drift.** 35 worktrees worked because every task was scoped under ninety minutes. Four-hour tasks accumulate drift that produces integration failures even with clean ownership.

---

## The numbers

35-worktree merge: 150 minutes sequential → 32 minutes parallel. 4.7x speedup.
Three-platform auth build: four days → fourteen hours.

Across 23,479 sessions: 128 TeamCreate + 1,720 SendMessage + 2,182 TaskCreate calls. The merge orchestrator is what makes those parallelism numbers safe.

---

## The mental model

Thirty minutes drawing ownership boundaries up front beats three hours of conflict resolution later. The Python implementation is under 400 lines.

Multi-agent parallel development is not "give everyone the codebase and merge at the end." It is "partition the codebase, enforce the partitions, order the integration, verify at every step."

Ninety seconds versus three hours. Zero conflicts versus twenty-three.

Repo: github.com/krzemienski/multi-agent-merge-orchestrator
Full post: https://withagents.dev/writing/day-26-multi-agent-merge
