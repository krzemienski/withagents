# X thread — Day 26: Multi-Agent Merge Orchestrator

---

**Tweet 1 (227 chars)**
Twelve AI agents.
Thirty-five git worktrees.
One codebase modified in thirty-five places at once.

The merge took ninety seconds. Zero conflicts.

That was the second attempt.

The first? Twenty-three conflicts. Three hours of manual untangling.

👇

---

**Tweet 2 (262 chars)**
First attempt:
- 6 agents touched package.json
- 4 agents touched types.ts
- 3 agents touched routes/index.ts

Every worktree compiled in isolation. Every feature worked independently.

Then I started merging.

Merge conflicts are a coordination problem, not a coding problem.

---

**Tweet 3 (258 chars)**
The fix: file ownership as the core primitive.

Before any agent writes anything, every file gets assigned to exactly one agent via glob patterns.

```
agent-auth-api: src/api/auth/**
agent-ios:      Sources/**/*.swift
agent-integrator: package.json, routes/index.ts
```

---

**Tweet 4 (272 chars)**
The `agent-integrator` role is the key.

Every multi-agent project has shared files NO feature agent should own: package.json, types index, route registry.

Those belong to a dedicated integration agent that runs last. Reads feature outputs. Assembles shared files.

No direct edits.

---

**Tweet 5 (260 chars)**
Validation fires at TASK-ASSIGNMENT time, not merge time.

```python
def validate_or_raise(agent_id, file_path):
    if not self.validate(agent_id, file_path):
        raise OwnershipViolation(...)
```

"You can't write this file" beats "you have a merge conflict" by hours.

---

**Tweet 6 (265 chars)**
Conflict prediction catches the leaks.

With 35 worktrees, that's 595 pair-wise diffs. Runs in under 2s because it only compares `git diff --name-only`, not contents.

The 35-worktree build caught:
- Shared utility modified in 2 worktrees (glob too broad)
- Type rename breaking imports

---

**Tweet 7 (272 chars)**
Topological merge ordering handles the other half.

5-step algorithm:
1. Build dependency graph
2. Compute in-degree per node
3. Queue zero-degree branches
4. Merge and decrement
5. Remaining nodes = cycle (error)

One build hit A→B and B→A. The sort caught it at planning time, not merge.

---

**Tweet 8 (274 chars)**
What ownership CAN'T catch:

The `expires_at` bug. Three agents modified three different files. Zero overlap. Zero ownership violation.

API sometimes returned .000Z, sometimes Z. Swift rejected one. Zod rejected the other.

6 hours to debug. 4-minute fix: tighten the OpenAPI regex.

---

**Tweet 9 (264 chars)**
Ownership handles mechanics.
Only precise specs handle semantics.

"date-time" is not a contract.
"RFC 3339 with mandatory fractional seconds matching pattern \d{4}-...\d{3}Z" is.

File ownership prevents mechanical conflicts. Specs prevent semantic ones. Different layer.

---

**Tweet 10 (252 chars)**
Other limits I hit:

• Implicit runtime coupling — event bus collisions aren't in the import graph
• Branch drift — >90min per task accumulates trouble
• Late-scope expansion — 1 in 5 builds needs manual reassignment

Thirty minutes up front still saves three hours of cleanup.

---

**Tweet 11 (249 chars)**
The numbers:

35-worktree merge: 150min sequential → 32min parallel. 4.7x speedup.
Three-platform auth: 4 days → 14 hours.

Across 23,479 sessions: 128 TeamCreate + 1,720 SendMessage + 2,182 TaskCreate. The merge orchestrator is what makes those numbers safe.

---

**Tweet 12 (238 chars)**
Multi-agent parallel development is NOT "give everyone the codebase and merge at the end."

It is "partition the codebase, enforce the partitions, order the integration, verify at every step."

The Python implementation is under 400 lines. Simple system.

---

**Tweet 13 (175 chars)**
Repo: github.com/krzemienski/multi-agent-merge-orchestrator

Full post:
withagents.dev/writing/day-26-multi-agent-merge

Ninety seconds versus three hours.
Zero conflicts versus twenty-three.
