# X thread — Day 21

**1/11** (233 chars)
I started 4,534 Claude Code sessions with my keyboard.

The agents I started spawned 18,945 more without my input.

The published number is 23,479. The real ratio is 19% human / 81% agent-initiated.

I did not design that behavior. It emerged.

**2/11** (220 chars)
Shape of a typical chain:

Human → planner
  ├ researcher-A → grep-scout
  ├ researcher-B
  ├ executor → type-check + build
  └ code-reviewer → diff-auditor

I typed 1 prompt. 8 agents ran. 4 spawned their own children.

**3/11** (232 chars)
From my 360d mine:
• 1,676 Agent invocations logged as top-level delegation events
• Each one = parent handing a scoped prompt to a child with its own 200K context
• 18,945 includes the recursive spawns those parents triggered

**4/11** (238 chars)
Four enforcement layers pushed me toward delegation:

1. Context decay at 10+ messages
2. Read-to-Write 9.6:1 (Read is parallelizable)
3. Evidence gates rejecting DONE without build/test/screenshot
4. Hat-scoped workflows at 94% vs 67% completion

**5/11** (224 chars)
None of those individually says "spawn an agent."

Together they make not-spawning the mistake.

The planner decides it needs researchers. The executor decides it needs type-checkers. The tree grows because every layer is cheaper to delegate than to stuff.

**6/11** (237 chars)
What 81% changes for product design:

Design move 1: your agents should expect to be invoked by other agents.

Prompt scaffolding assuming a human reader ("I'll help you with...") creates friction agent-to-agent.

Typed contracts. Declared inputs + outputs.

**7/11** (239 chars)
Design move 2: observability shows the tree, not the session.

A session list is useless at 81% agent-initiated.

You need a trace viewer collapsing the tree into parent-child structure with per-node cost, duration, verdict.

`trace-timeline` exists for this.

**8/11** (232 chars)
Design move 3: cost attribution flows up.

A child session cost $0.40. Parent cost $0.02.

The parent is the thing you charge, budget, and optimize.

81% of your spend is on the 19% of sessions users actually own.

**9/11** (242 chars)
The job change:

I stopped being the agent and became the orchestrator.

My hour went from "write code" to "read 8 agent reports, approve 6, reject 2, respawn 1 with tighter constraints."

Not a quality-of-life improvement. A different job entirely.

**10/11** (231 chars)
If you are building an agent product and your cost model assumes users drive sessions, you are pricing the 19% and losing money on the 81%.

The user is not the primary API caller anymore.

Another agent is.

**11/11** (227 chars)
The 1,676 Agent invocations make 23,479 sessions possible.

Without the Task primitive: I type 23,479 prompts.
With it: I type 4,534 prompts and review 18,945 results.

Full writeup: https://withagents.dev/posts/day-21-agents-spawning-agents
