**I started 4,534 Claude Code sessions with my keyboard.**

**The agents I started spawned 18,945 more without my input.**

The published number for this series is 23,479 total sessions over 42 days. That figure is technically accurate and directionally misleading.

The real ratio: **4,534 human-initiated / 18,945 agent-initiated.** 81% of my AI coding work was agents spawning other agents.

I did not design that behavior. It emerged.

**The shape of a typical chain**

```
Human session (planner)
  ├─ Agent: researcher-A
  │    └─ Agent: grep-scout
  ├─ Agent: researcher-B
  ├─ Agent: executor
  │    ├─ Agent: type-check-runner
  │    └─ Agent: build-runner
  └─ Agent: code-reviewer
       └─ Agent: diff-auditor
```

I typed one prompt. 8 agents ran. 4 of those 8 spawned their own children.

**Why it emerged**

Four enforcement layers pushed me toward delegation:

1. **Context decay** at 10+ messages makes over-stuffing a session worse than spawning a fresh child with a narrow prompt.

2. **The 9.6:1 Read-to-Write ratio** makes the Read phase parallelizable. 5 scouts in parallel beat 1 session doing breadth-first walks.

3. **Evidence gates** (my `completion-claim-validator.js` hook) reject DONE without build/test/screenshot. Parents delegate to children that run those.

4. **Hat-scoped workflows** hit 94% completion / 2% contradiction vs 67% / 34% monolithic. Once the orchestration layer is built, it spawns children whether or not I told it to.

None of these individually says "spawn an agent." Together they make not-spawning the mistake.

**What 81% changes**

Three design moves fall out of this:

**1. Your agents should expect to be invoked by other agents.** Prompt scaffolding that assumes a human reader produces friction in agent-to-agent invocations. Typed contracts, declared inputs, declared outputs. The child exits with structured results the parent can parse.

**2. Your observability surface has to show the tree, not the session.** A session list is useless at 81% agent-initiated. You need a trace viewer that collapses the tree into a legible parent-child structure with per-node cost, duration, verdict.

**3. Your cost attribution has to flow up.** A child session that cost $0.40 was invoked by a parent that cost $0.02. The parent is the thing you charge, budget, and optimize.

**The job change**

I stopped being the agent and became the orchestrator. My hour went from "write code" to "read 8 agent reports, approve 6, reject 2, respawn 1 with tighter constraints."

That ratio is not a quality-of-life improvement. It is a different job.

If you are building an agent product and your cost model assumes users drive sessions, you are pricing the 19% and losing money on the 81%. The user is not the primary API caller anymore. Another agent is.

Full writeup + data: https://withagents.dev/posts/day-21-agents-spawning-agents
