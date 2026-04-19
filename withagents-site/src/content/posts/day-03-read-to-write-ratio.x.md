# X thread — Day 03

**1/10** (240 chars)
88,560 Reads.
10,140 Writes.

360 days of Claude Code session mining across 72 projects.

The Read-to-Write ratio is 9.6 to 1.

Agents are readers that occasionally write. Every orchestration decision in my stack flows from that.

**2/10** (232 chars)
The demo loop hides this.

Product demos show the Write. File appears. Commit lands. PR opens.

The Read is invisible. File opens, grep scans, directory walks, symbol lookups.

The Write is one line of the session log. The Read is most of the session.

**3/10** (244 chars)
Full tool leaderboard from the 360d mine:

Read: 88,560
Bash: 75,658
Grep: 22,463
Edit: 19,979
Glob: 11,773
Write: 10,140

Understanding tools (Read + Grep + Glob): 122,796
Production tools (Write + Edit): 30,119

4.1 to 1 even with Edit counted as output.

**4/10** (238 chars)
Consequence 1: context curation is the bottleneck, not generation.

A 200K window burned on irrelevant files is worse than 40K on the right five.

Hat-scoped sessions hit 94% completion / 2% contradiction.
Monolithic sessions hit 67% / 34% on the same budget.

**5/10** (228 chars)
Consequence 2: filesystem beats shared state.

Agents cannot share memory. They can share files.

When 90% of the work is Read, the only coordination primitive that scales past 2 agents is disk. Plans as files. Task lists as files. Build results as JSON events.

**6/10** (241 chars)
Consequence 3: evidence before output.

A session that writes 10 files after reading 1 is flying blind.

The tool sequence reveals what the reasoning prose hides. An agent can narrate confidence. The Read-to-Edit ratio cannot lie.

**7/10** (227 chars)
The inverse pattern is the tell.

Sessions with Read-to-Edit below 2:1 produce edits that get reverted next session ~3x more often than sessions above 4:1.

This is not detected by a language model. It is visible in the raw tool log.

**8/10** (232 chars)
47 Reads before 1 Edit = exploration session.

12 Edits with 0 preceding Reads = blind generation.

Both shapes are visible in the session log. No classifier needed.

That is why I built `completion-claim-validator.js` as a hook, not a prompt.

**9/10** (224 chars)
Agent products that optimize for Write volume optimize for the wrong axis.

The axis that matters: quality of the Read that preceded the Write, measured by whether the Write survives the next session.

Speed was never the problem. Grounding was.

**10/10** (232 chars)
If you are designing agent systems, stop asking "how fast can it generate?"

Start asking: what is the shape of the Read that has to happen before this Write is safe?

9.6 to 1. That is the thesis.

Full writeup: https://withagents.dev/posts/day-03-read-to-write-ratio
