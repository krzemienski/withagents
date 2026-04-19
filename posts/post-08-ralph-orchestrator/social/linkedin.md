# LinkedIn — Post 8

1:47 AM on a Wednesday. I typed `/guidance Wrap the existing code, don't replace it` from under the covers, rolled over, and went back to sleep. By morning, 28 of 30 tasks were complete.

The agent hadn't stopped working. It didn't need to. Every task was scoped to a single hat, every hat terminated after emitting one event, and the orchestrator spawned the next hat automatically.

**One Hat, One Event, Then Stop**

Three hours into an API migration, the context window filled. I started a new session, and the agent re-implemented the first endpoint. The one it had finished two hours ago. Zero memory of the previous work.

Hat-scoped sessions with 40K tokens of focused context: 94% task completion, 2% contradiction rate. Monolithic sessions with 150K tokens accumulated: 67% completion, 34% contradictions.

One in three monolithic sessions contained the agent arguing with itself. Approving code that violated a rule it wrote. Refactoring a function it just marked final. Hat-scoping nearly eliminated this.

**Filesystem as Memory**

Builder writes code. Cannot review. Reviewer critiques. Cannot edit files. Fixer applies targeted patches. Cannot add features. Each hat emits a single event and terminates. The orchestrator reads the event and decides what comes next.

State lives entirely on the filesystem. `.ralph/events/` for append-only JSON log, `.ralph/tasks/` for lifecycle tracking, `.ralph/agent/` for scratchpad and decisions. Nothing critical in the context window.

Agents call the CLI 200+ times per session to check task status. At 3ms per call, invisible. At 100ms, agents would cache state in context and diverge from reality. Startup time matters because it changes agent behavior.

Two agents wrote to the task list at the same moment. Text file corrupted. Three tasks disappeared. 45 minutes reconstructing state. Fix: `flock()` on every state transition. The boulder never stops, but it needs a single writer.

**What 28 Completed Tasks Cost**

Longest Ralph loop I recorded: smart-deer worktree, 14 iterations out of a max 100. Debugging an SSE race condition where the fix introduced a new timing issue. Average across 10 worktrees: 10.2 iterations per session.

Mixed-model routing cuts costs 40% versus running Opus everywhere. Planner at ~$0.05. Builder at ~$0.02. Reviewer at ~$0.05. Writer at ~$0.005. The 28-task overnight run: $4.20 total. $0.15 per completed task, running autonomously for 7 hours.

Ralplan runs 3-agent consensus before Ralph begins execution. Planner, Critic, Architect iterate until the Critic approves. Maximum 5 iterations. A plan that survived adversarial review before a single line of code gets written. Three agents for 2-3 minutes costs nothing compared to 45 minutes executing a flawed plan and starting over.

The six tenets govern how Ralph loops operate. The boulder never stops. The plan is disposable (a new plan costs ~$0.05; fighting a bad plan for 20 minutes costs $0.60). Telegram as control plane. QA is non-negotiable. Fresh context beats accumulated context. `tools.denied` is a safety net for operations that should never happen at 3 AM.

Left to its own judgment, an agent stops when it believes the work is done. With Ralph, it stops when the filesystem proves it.

Full post + code in the comments.
