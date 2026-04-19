# README patch (Day 21)

_Insight-scale post. Patch applies to any repo that exposes or consumes the Task/Agent delegation primitive (auto-claude-worktrees, ralph-loop-patterns, shannon-framework, sessionforge)._

## Suggested insertion

**Featured in:** [withagents.dev, *81% of my AI coding sessions were agents spawning other agents*](https://withagents.dev/posts/day-21-agents-spawning-agents)

The post unpacks the ratio that makes this repo relevant: 4,534 human-initiated sessions against 18,945 agent-initiated sessions across 42 days, a 1:4.2 delegation multiplier. The 360-day mine logs 1,676 Agent invocations as top-level delegations.

Three design consequences covered in depth:

1. Agents should expect agent callers. Typed contracts replace human-reader prompt scaffolding.
2. Observability surfaces the tree, not the session. Default log views break past two layers.
3. Cost attribution flows up. The parent is the thing you charge and optimize.

If this repo is an orchestrator, the post names the emergent behavior it produces. If it is a trace viewer or a memory layer, it explains why those tools are the actual API surface at 81% agent-initiated traffic.

Data: `scripts/output/mine-360d-data.json` plus `MEMORY.md`.
