# One hat, one event, then stop

1:47 AM on a Wednesday.

I typed `/guidance Wrap the existing code, don't replace it` from under the covers, rolled over, and went back to sleep.

By morning, 28 of 30 tasks were complete.

---

The agent hadn't stopped working overnight. It didn't need to. Every task was scoped to a single hat, every hat terminated after emitting one event, and the orchestrator spawned the next hat automatically.

That overnight run wasn't an accident. It solved a problem that had cost me weeks: agents that forget their own plans.

Three hours into an API migration weeks earlier, the context window filled. I started a new session, and the agent re-implemented the first endpoint. The one it had finished two hours ago.

The 150,000-token context window is not a luxury. It is a trap.

---

The data held every time I re-checked it across the `ralph-orchestrator` project (336 MB, 926 files, 64-day arc):

- Hat-scoped sessions (40K tokens focused): 94% task completion, 2% contradiction rate
- Monolithic sessions (150K tokens accumulated): 67% completion, 34% contradictions

One in three monolithic sessions contained the agent arguing with itself. Approving code that violated a rule it had written 40 minutes earlier. Refactoring a function it had just marked final.

Fresh context beats accumulated context. Everything else in Ralph enforces this.

---

Six tenets, compressed:

1. **The Boulder Never Stops.** The stop hook fires at the end of every session. If tasks remain, the orchestrator spawns the next hat.

2. **The Plan Is Disposable.** A new plan costs ~$0.05. An agent fighting a bad plan for 20+ minutes costs $0.45–$0.60.

3. **Telegram as Control Plane.** `/guidance` injects a directive into the agent's next hat session. Steer without interrupting.

4. **QA Is Non-Negotiable.** Every Builder output passes through a Reviewer. Confidence and correctness don't correlate.

5. **Fresh Context Beats Accumulated Context.** 40K scoped → consistent. 150K accumulated → contradictions.

6. **`tools.denied` Is a Safety Net.** An agent in a Fixer hat at 3 AM shouldn't be able to force-push to main.

---

The overnight cost broke down like this:

- ~5 Planner invocations
- ~30 Builder invocations
- ~28 Reviewer invocations (24 clean-first-pass, 4 Fixer cycles, 2 task-spec failures)
- Total: ~$4.20 for 28 completed tasks

$0.15 per task, running autonomously for 7 hours while I slept.

---

This is the teaser. The full 64-day arc lands across three posts on withagents.dev:

- **Day 22** — origin. Why `ralph-orchestrator` started 2026-01-21 and what it replaced.
- **Day 23** — iOS. Communicating with Ralph from the phone.
- **Day 24** — the RALPH protocol. The canonical shape after iOS forced it to be expressible.

An agent that does one thing well, then stops, is more reliable than an agent that tries to do everything at once.

The boulder never stops. But it does reach the top.

---

Canonical post → https://withagents.dev/writing/day-07-ralph-loop-teaser

Library (pip-installable) → https://github.com/krzemienski/ralph-loop-patterns
