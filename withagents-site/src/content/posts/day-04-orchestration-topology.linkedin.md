# Orchestration topology is the product

4,534 of my Claude Code sessions were started by a human. 18,945 were started by other agents.

Once that ratio crossed four-to-one, the thing I was actually shipping stopped being "prompts." It became the shape those agents coordinate through.

---

Across 360 days and 72 projects I mined the invocation counts. The graph is already there if you look:

- 1,676 Agent spawns
- 4,237 TaskUpdate calls
- 1,634 TaskCreate calls
- 1,743 SendMessage peer messages
- 1,293 Skill invocations (typed, contract-loaded)
- 111 ExitPlanMode calls

Each one is an edge. Agents are the nodes. The topology is what you feel when the fleet is running.

Three shapes kept showing up enough to name.

---

**Star.** One lead, N workers. Lead plans, dispatches, merges. Workers only talk to the lead.
Example: multi-agent merge orchestrator. 12 agents, 35 worktrees, one lead reconciling.

**Wave.** Dependencies grouped by depth. Wave 1 runs in parallel, must PASS, then Wave 2 runs against Wave 1's output.
Example: ValidationForge. DB before API before Web or iOS. Never skip an upstream PASS.

**Loop.** One agent, N rotations through different hats. Fresh 40K-token context each time. Hats talk to each other through disk, not memory.
Example: Ralph. 926 files of working tree. An append-only event log at .ralph/events/.

---

What I learned the hard way: I did not get to pick the shape. The shape got picked by where state already lived.

If state lives on disk, any topology works — pick for cost.

If state only lives in one agent's context window, you have a star whether you wanted one or not. The agent holding the context is the bottleneck. This is the failure `claude-mem-architecture` exists to fix: agents can share files; they cannot share memory. Build a topology that assumes shared memory and you built a star by accident.

If state is a running process — simulator, dev server, database — you either need an Operator UI that lets humans inspect mid-run, or a hook that freezes the process and dumps state to disk.

---

One number to close on.

Across the same 360-day mine:
- Read: 88,560
- Write: 10,140

A 9.6-to-1 read-to-write ratio. Agents are readers that occasionally write.

Most agent work is inspection, not production. Once you see that, topology stops being a deployment choice and starts being a cache hierarchy: every edge is either a cheap read (filesystem, disk event, JSON payload) or an expensive read (full context handoff, agent-to-agent negotiation).

1,743 SendMessage versus 4,237 TaskUpdate tells me the fleet is already biased toward disk. The agents figured out that talking is expensive and writing is cheap, before I did.

---

I still do not have a clean rule for when a wave should collapse into a loop, or when a loop should have been a wave. Both failure modes are real. Both cost hours. I suspect it is about state stability — does the upstream output change on re-read? — but I have not measured it.

The topology is the product. Everything else is plumbing.

---

Full post (with the nested-topology diagram from the 45-day push) → https://withagents.dev/writing/day-04-orchestration-topology
