# X thread — day-07-ralph-loop-teaser (withagents.dev-scoped)

**Thread length:** 10 tweets. Char counts annotated per tweet.

---

**1/10** (216 chars)
1:47 AM, Wednesday.

I typed `/guidance Wrap the existing code, don't replace it` from under the covers, rolled over, and went back to sleep.

By morning, 28 of 30 tasks were complete.

The agent had not stopped working overnight.

---

**2/10** (263 chars)
It did not need to.

Every task was scoped to a single hat.
Every hat terminated after emitting one event.
The orchestrator spawned the next hat automatically.

No human in the loop except six-word course corrections sent from bed.

This is Ralph. Short version below.

---

**3/10** (233 chars)
The problem it solved had cost me weeks.

Three hours into an API migration, the context window filled. New session. Agent re-implemented the first endpoint — the one it had finished two hours ago.

The 150K context window is not a luxury. It is a trap.

---

**4/10** (229 chars)
Across `ralph-orchestrator` (336 MB, 926 files, 64-day arc), the split was consistent:

- Hat-scoped (40K tokens): 94% completion, 2% contradiction
- Monolithic (150K tokens): 67% completion, 34% contradiction

1 in 3 agents argued with itself.

---

**5/10** (228 chars)
Six tenets, arrived at through failure:

1. The Boulder Never Stops
2. The Plan Is Disposable
3. Telegram as Control Plane
4. QA Is Non-Negotiable
5. Fresh Context Beats Accumulated Context
6. tools.denied is a Safety Net

Each one was a bug first.

---

**6/10** (246 chars)
The overnight cost broke down like this:

~5 Planner invocations
~30 Builder invocations
~28 Reviewer invocations
24 clean first-pass, 4 Fixer cycles, 2 failures (bad task specs)

~$4.20 for 28 tasks.
$0.15 per task.
7 hours of autonomous work while I slept.

---

**7/10** (270 chars)
Why post it as a teaser?

Because the full 64-day arc is three posts, not one.

Day 22: origin. Why ralph-orchestrator started 2026-01-21, what it replaced, the hat system in full.

Day 23: iOS. How I communicated with Ralph from the phone.

Day 24: the RALPH protocol.

---

**8/10** (205 chars)
Every flagship in the catalog after March 2026 adopted some version of this:

- hat-scoped context
- disk-first state
- convergence-driven termination
- Telegram (or equivalent) for mid-run steering

---

**9/10** (207 chars)
Library is pip-installable.

```
pip install -e .
ralph-loop simulate "Build REST API for blog posts" --pattern builder-writer-reviewer
```

github.com/krzemienski/ralph-loop-patterns

An agent that does one thing well, then stops.

---

**10/10** (169 chars)
Full teaser with the six tenets and the 94%/2% vs 67%/34% data:

https://withagents.dev/writing/day-07-ralph-loop-teaser

The boulder never stops. But it does reach the top.
