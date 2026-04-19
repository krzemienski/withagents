# X Thread — Post 8

**Tweet 1:** 1:47 AM on a Wednesday. I typed `/guidance Wrap the existing code, don't replace it` from under the covers, rolled over, and went back to sleep.

By morning, 28 of 30 tasks were complete.

The agent hadn't stopped working. It didn't need to.

**Tweet 2:** Hat-scoped sessions (40K tokens of focused context): 94% task completion, 2% contradiction rate.

Monolithic sessions (150K tokens accumulated): 67% completion, 34% contradictions.

One in three monolithic sessions contained the agent arguing with itself. Hat-scoping nearly eliminated this.

**Tweet 3:** Six hat types. Each one does one thing then stops.

Planner reads the codebase, emits a task list, cannot write code.
Builder writes code, cannot review.
Reviewer critiques, cannot edit files.
Fixer applies targeted patches, cannot add features.

One hat, one event, then stop.

**Tweet 4:** The orchestrator doesn't trust the agent to know when it's done. It waits for the event.

```toml
[hat.exit]
emit_event = "build.complete"
max_tokens = 40000
```

Builder can't transition to Reviewer within the same session. It emits, terminates, and the orchestrator spawns a fresh Reviewer context.

**Tweet 5:** Longest recorded Ralph loop: smart-deer worktree, 14 iterations out of a max 100.

Debugging an SSE race condition where the fix introduced a new timing issue. Six cycles of reproducer/fixer/verifier.

Average across 10 worktrees: 10.2 iterations per session.

**Tweet 6:** State lives entirely on the filesystem. Nothing critical in the context window.

```
.ralph/
  events/   # append-only JSON log
  tasks/    # lifecycle tracking
  agent/    # scratchpad + decisions
```

Agents call the CLI 200+ times per session. At 3ms per call, invisible. At 100ms, agents would cache state and diverge from reality.

**Tweet 7:** Two agents wrote to the task list at the same moment. Text file corrupted. Three tasks disappeared. 45 minutes reconstructing state.

Fix: `flock()` on every state transition. No two agents modify the task file simultaneously.

The boulder never stops, but it needs a single writer.

**Tweet 8:** Mixed-model routing cuts costs 40% vs running Opus everywhere.

Planner (strong reasoning): ~$0.05
Builder (fast codegen): ~$0.02
Reviewer (analytical): ~$0.05
Writer (lightweight): ~$0.005

The 28-task overnight run: $4.20 total. $0.15 per completed task.

**Tweet 9:** Ralplan runs 3-agent consensus before Ralph begins. A plan that's survived adversarial review before a single line of code gets written.

Planner, Critic, Architect iterate until the Critic approves. Max 5 iterations.

3 agents for 2-3 minutes costs nothing vs 45 minutes executing a flawed plan.

**Tweet 10:** An agent that does one thing well then stops is more reliable than one trying to do everything at once.

Left to its own judgment, an agent stops when it believes the work is done. With Ralph, it stops when the filesystem proves it.

The boulder never stops. But it does reach the top.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
