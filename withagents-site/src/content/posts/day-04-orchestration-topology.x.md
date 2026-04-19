# X thread — day-04-orchestration-topology

**Thread length:** 9 tweets. Char counts annotated per tweet.

---

**1/9** (248 chars)
4,534 of my Claude Code sessions were started by a human.
18,945 were started by other agents.

Once the ratio crossed 4:1, the thing I was actually shipping stopped being prompts.

It became the shape those agents coordinate through.

---

**2/9** (233 chars)
360-day mine, 72 projects, the invocation counts:

Agent spawns: 1,676
TaskUpdate: 4,237
TaskCreate: 1,634
SendMessage: 1,743
Skill: 1,293
ExitPlanMode: 111

Each one is an edge. Agents are nodes. The topology is what you feel.

---

**3/9** (270 chars)
Three shapes showed up enough to name.

Star: one lead, N workers. Multi-agent merge: 12 agents, 35 worktrees, one reconciler.

Wave: dependencies by depth. ValidationForge: DB → API → Web/iOS.

Loop: one agent, N hats through fresh context. Ralph: 926 files, .ralph/events/.

---

**4/9** (261 chars)
I used to pick topology like a dropdown. That was wrong.

The shape gets chosen by where state already lives.

State on disk → any topology works.
State in one agent's context → you have a star whether you wanted one or not.
State in a running process → you need an Operator UI.

---

**5/9** (219 chars)
Closer: Read = 88,560. Write = 10,140. 9.6:1.

Agents are readers that occasionally write.

Most agent work is inspection, not production. Topology is a cache hierarchy once you see it. Every edge is a cheap read or an expensive one.

---

**6/9** (244 chars)
1,743 SendMessage calls vs 4,237 TaskUpdate calls.

The fleet is already biased toward disk. Agents figured out that talking is expensive and writing is cheap, before I did.

111 ExitPlanMode calls = planning is its own node, not a mode you flip into.

---

**7/9** (256 chars)
What I do not know yet: when a wave should collapse into a loop, or when a loop should have been a wave.

I have watched both failure modes eat hours. I suspect it is about state stability — does the upstream output change on re-read? — but I have not measured it.

---

**8/9** (201 chars)
trace-timeline (OSS) draws the real topology from a session log.

Ran it on the 45-day push. The shape surprised me.

Wave outer layer.
Star inner layer.
Three loops nested in two of the wave's nodes.

---

**9/9** (178 chars)
Topology is the product. Everything else is plumbing.

Full write-up with the nested-topology diagram and the 9.6:1 read-to-write breakdown:

https://withagents.dev/writing/day-04-orchestration-topology
