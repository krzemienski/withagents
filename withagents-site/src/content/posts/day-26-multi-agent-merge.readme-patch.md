# README patch — multi-agent-merge-orchestrator

Paste under the "Featured in" / "Used by" section of `github.com/krzemienski/multi-agent-merge-orchestrator`.

**Also fixes:** the prior repo URL in Post 14's newsletter pointed at `spec-driven-implementation` (wrong repo). Remove that reference and link to `multi-agent-merge-orchestrator` directly. The WithAgents Day 26 post is the canonical launch framing.

---

## Featured in the WithAgents 45-day launch series

**Day 26 — 35 worktrees, 12 agents, zero merge conflicts.** This repo is the choreography layer that turned the three-hour merge disaster into a ninety-second operation. The post walks the full ownership-matrix → conflict-prediction → topological-sort → build-verify pipeline, with real code from `OwnershipMatrix`, `predict_conflicts`, `topological_sort`, and `execute_merge_choreography`.

It also documents what ownership *cannot* catch: implicit runtime coupling, spec imprecision (the `expires_at` bug), and branch drift when agent tasks run longer than ninety minutes.

Read the full post: [withagents.dev/writing/day-26-multi-agent-merge](https://withagents.dev/writing/day-26-multi-agent-merge)

Related WithAgents posts:
- Day 05 — Auto-Claude Worktrees (parallel execution layer; this repo is its choreography counterpart)
- Day 25 — Sequential-Thinking Debugging (what to do when a merge still fails semantically)
- Day 27 — Playwright Validation Pipeline (validation lane that fires after a clean merge)

---

**Install:** `pip install multi-agent-merge-orchestrator`
**CLI:** `merge-orchestrator auto-ownership | validate-ownership | plan | merge`
**License:** MIT
**Mode-bet:** Non-Interactive (automated choreography pipeline)
**Example project:** included, with four agents and intentional ownership violations to exercise the validator
