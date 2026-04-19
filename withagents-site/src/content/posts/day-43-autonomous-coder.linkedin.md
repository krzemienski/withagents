# autonomous-coder: four agents, one task, a TUI that shows you what they're doing

Four phases. Four agents. One live TUI dashboard.

[autonomous-coder](https://github.com/krzemienski/autonomous-coder) is the Python Agent SDK counterpart to CCB, the headless multi-agent orchestrator I reach for when the task is "build this feature while I go to lunch."

474 KB of Python. Textual for the UI. Claude Agent SDK for the query layer.

## The pipeline

Four named phases in sequence, each a separate agent:

1. **Research**, web-search for relevant tools, libraries, patterns
2. **Explore**, semantic codebase analysis via Serena MCP
3. **Plan**, dependency-aware implementation plan
4. **Code**, iterative implementation with per-task review

Each phase is a separate `query()` call. None share context. The handoff is a file on disk, `research-findings.md`, `codebase-map.md`, `implementation-plan.md`.

Agents cannot share memory. They can share files. The filesystem is the coordination protocol that scales past two agents, and every flagship in this series has converged on it.

## Two modes: TUI and CLI

Default is TUI:

```bash
pip install -e .
autonomous-coder "Add user authentication with JWT tokens"
```

Textual dashboard takes over: live streaming per agent, progress per task, cost pinned to the header, tab between phases.

CLI mode exists for everywhere that isn't my laptop:

```bash
autonomous-coder --cli "Add JWT auth" --project /path/to/repo
```

Same orchestrator, no TUI dependency, stdout only. Friendly to CI, background jobs, SSH sessions.

That architecture, one orchestrator, two presentation layers, is what I wanted from the start. The first version had the orchestrator deeply coupled to the Textual app. Took three refactors to unwind.

## Why the dashboard exists

CCB used to run for 40 minutes without producing any output I could verify while it was happening. I'd come back, see "done," and then spend 15 minutes figuring out whether the thing had actually shipped.

The dashboard collapses that tail.

- See the failing `Edit` the moment it happens.
- See the cost tick up in real time and kill the run if it's headed past budget.
- See which agent is stuck on which task and pause the pipeline.

The reason agents run for 40 minutes is each phase genuinely takes that long. Research: 5 min. Explore: 8 min. Plan: 3 min. Code: 20+ min depending on task count. If the only signal you have is "the process is still running," you cannot tell a working run from a loop.

The dashboard turns the run into a legible process.

## How this is different from CCB

CCB parallelizes aggressively, multiple sub-agents per phase, worktree isolation, conflict resolution at merge.

autonomous-coder runs tasks serially. For most of what I build with it, serial is correct. The speed penalty is real but so is the coordination cost of parallel builds, and autonomous-coder's target user is "solo developer who wants to watch what happens," not "coordination system for twelve concurrent workstreams."

Other design difference: autonomous-coder imports `claude-agent-sdk` directly rather than wrapping the `claude` CLI as a subprocess. Typed errors. Built-in cost tracking. First-class session resumption. Everything CCB re-implemented, the SDK gives you.

## Honest limitations

The Serena MCP dependency is one I want to get rid of. Without Serena installed, Explore falls back to `grep`-based analysis and the results are markedly worse. Future work.

Cost tracking is approximate. Cache hits and tool-use tokens sometimes undercount by a few cents per run. For budgeting trust the Anthropic console. For debugging trust the dashboard.

## Mode-bet: SDK

autonomous-coder is steered entirely by Python code. User types a task string, and every subsequent decision, model, tools, files, order, is orchestrator code, not interactive prompting. The dashboard is not an interactive surface for the agent. It's an inspection surface for the human.

---

Part of WithAgents. Day 43 of 45. Pairs with [cc-setup](https://github.com/krzemienski/cc-setup) (Day 42) as the SDK-mode complement to yesterday's Interactive-mode environment.

Full post: https://withagents.dev/writing/day-43-autonomous-coder
