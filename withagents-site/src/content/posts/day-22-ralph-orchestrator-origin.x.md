# X thread — Day 22 Ralph Orchestrator Origin

---

**Tweet 1/11** (273 chars)

January 21, 2026. I opened an empty directory called ralph-orchestrator and wrote one file.

README.md. Nine words.

"Why can agents plan but not finish what they planned?"

Two months later: 926 files. 336MB of session JSONL. An agent that ran 28 of 30 tasks while I slept.

🧵

---

**Tweet 2/11** (248 chars)

Clarification: Ralph Orchestrator under krzemienski on GitHub is MY code.

There is an external project with a similar name. Earlier inventories confused the two.

This post is partly the correction.

64 days. 336MB. All sourced.

---

**Tweet 3/11** (275 chars)

The question was: why can agents plan but not finish what they planned?

The industry answer is bigger context.

My data said that was wrong:
40K hat-scoped context → 94% completion / 2% contradiction
150K monolithic context → 67% completion / 34% contradiction

27 points. Architecture, not prompt.

---

**Tweet 4/11** (260 chars)

First wrong answer (day 3): one long-lived agent with a serialized state object.

The agent would receive the plan, acknowledge it, re-describe it in its own words, and the plan would become whatever the agent had just said.

Killed on day 9.

---

**Tweet 5/11** (253 chars)

Second wrong answer (day 10): multiple agents, shared dict as blackboard.

Race conditions. Silent state corruption. Lost three tasks to a dict mutation.

I fixed it with a lock, then realized the lock meant I was using the dict as a file.

---

**Tweet 6/11** (261 chars)

Day 14: agents cannot share memory. They can share files. The filesystem is the only coordination protocol that scales past two agents.

It is not clever. It is not novel. It is what UNIX has been doing since 1971.

And it was the answer.

---

**Tweet 7/11** (270 chars)

Every agent decision worth remembering became a JSON event.

.ralph/
  agent/scratchpad.md
  agent/decisions.md
  events/001-plan.json (append-only)
  events/002-build.json
  tasks/task-001.json (state machine)

Three weeks later when a run fails, you read the log chronologically.

---

**Tweet 8/11** (267 chars)

The stop hook fixed what state models could not.

An agent, left to its own judgment, stops when it BELIEVES the work is done. Not when the work is done.

on-stop.sh reads .ralph/tasks/*.json. If any tasks are ready/pending: exit 1. Block termination.

30 fires per session on average.

---

**Tweet 9/11** (266 chars)

1:47 AM on a Wednesday. I typed from bed:

/guidance Wrap the existing code, don't replace it

By morning, 28 of 30 tasks were done.

Six-word message. Saved 90 minutes of dead-end rewriting. Worked because by day 42, every piece of state the agent needed already lived on disk.

---

**Tweet 10/11** (238 chars)

I cannot automate the six-word correction.

A Critic agent can flag "this plan has issues." It cannot write "wrap the existing code."

The loop works because the guidance comes from someone who has already watched this failure mode happen.

---

**Tweet 11/11** (230 chars)

What I would cut: the first two wrong answers.

Skip to the filesystem.

Repo: github.com/krzemienski/ralph-orchestrator

Full origin post with event-log evidence and the 27-point completion data: withagents.dev/writing/day-22-ralph-orchestrator-origin

---
