# X thread: Day 43 autonomous-coder

**1/ (263 chars)**
Four phases. Four agents. One live TUI dashboard.

autonomous-coder is the Python Agent SDK counterpart to CCB, the headless multi-agent orchestrator I reach for when the task is "build this feature while I go to lunch."

Textual + Agent SDK. Watch it happen. 🧵

**2/ (273 chars)**
The pipeline runs 4 named phases in sequence:

1. Research, web-search tools, libraries, patterns
2. Explore, semantic codebase analysis (Serena MCP)
3. Plan, dependency-aware implementation plan
4. Code, iterative implementation with per-task review

Each a separate query() call.

**3/ (274 chars)**
None of the phases share context.

The handoff is a file on disk:
• research-findings.md
• codebase-map.md
• implementation-plan.md

Agents cannot share memory. They can share files.

The filesystem is the coordination protocol that scales past two agents.

Every flagship in the series converged on it.

**4/ (252 chars)**
Two modes:

TUI (default):
```
pip install -e .
autonomous-coder "Add JWT auth"
```
Full Textual dashboard.

CLI (everywhere that isn't my laptop):
```
autonomous-coder --cli "Add JWT auth" --project /path
```
Same orchestrator, no UI.

**5/ (266 chars)**
The one-orchestrator-two-presentations architecture is what I wanted from the start.

First version had the orchestrator deeply coupled to the Textual app.

Three refactors to unwind.

Lesson: if your TUI and your CLI don't share a backend interface, you don't have two modes, you have two products.

**6/ (271 chars)**
Why the dashboard exists:

CCB used to run for 40 minutes without producing any output I could verify WHILE IT WAS HAPPENING.

I'd come back. See "done." Spend 15 more minutes figuring out whether the thing it had shipped actually worked.

The dashboard collapses that tail.

**7/ (258 chars)**
What the dashboard gives you:

• See the failing Edit the moment it happens
• See cost tick up in real time; kill if headed past budget
• See which agent is stuck on which task; pause the pipeline
• Tab between phases to inspect agent output

No log-tailing required.

**8/ (267 chars)**
Real phase durations on real runs:

Research: ~5 min
Explore: ~8 min
Plan: ~3 min
Code: 20+ min (depends on task count)

If the only signal you have is "process still running," you cannot distinguish a working run from a loop.

Dashboard turns it into a legible process.

**9/ (276 chars)**
How this differs from CCB:

CCB parallelizes aggressively, multiple sub-agents per phase, worktree isolation, merge resolution.

autonomous-coder runs tasks serially.

Target user: "solo dev who wants to watch what happens."

Not "coordination system for 12 concurrent workstreams."

**10/ (253 chars)**
Other difference: imports `claude-agent-sdk` directly instead of wrapping the `claude` CLI as a subprocess.

Typed errors.
Built-in cost tracking.
First-class session resumption.

Everything CCB re-implemented, the SDK gives you for free.

**11/ (265 chars)**
Honest limitations:

Serena MCP is a dependency I want to get rid of. Without it, Explore falls back to grep and the results are markedly worse.

Cost tracking is approximate, cache hits sometimes undercount by cents. For budgeting, trust the Anthropic console.

**12/ (258 chars)**
Mode-bet: SDK.

Agent steered entirely by Python code. User types a task string; every subsequent decision, model, tools, files, order, is orchestrator code.

Dashboard is not an interactive surface for the agent. It's an inspection surface for the human.

**13/ (237 chars)**
Full post: https://withagents.dev/writing/day-43-autonomous-coder

Repo: github.com/krzemienski/autonomous-coder

Pairs with yesterday's cc-setup (Day 42) as the SDK-mode complement to an Interactive-mode environment.

Part of WithAgents /45.

---

_13 tweets. 237-276 chars. Day 43 of WithAgents launch push._
