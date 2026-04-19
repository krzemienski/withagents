**Agents are readers that occasionally write.**

88,560 Reads. 10,140 Writes. That is the tool leaderboard from 360 days of Claude Code session mining across 72 projects, 2.76 million lines of JSONL, 8.15 GB on disk.

The ratio is 9.6 to 1.

Every demo loop hides this. A product demo surfaces the Write. The user sees the file appear, the commit land, the PR open. The Read stays invisible. File opens, directory walks, grep scans, symbol lookups. The Write is one line of the session log. The Read is most of the session.

Three design consequences from the ratio.

**1. Context curation is the bottleneck, not generation capacity.** A 200K-token window burned on irrelevant files is worse than 40K burned on the five files that matter. Hat-scoped sessions in my data hit 94% task completion with 2% contradiction rate. Monolithic sessions spending the same tokens hit 67% with 34% contradiction. The Read budget is the agent's real working memory.

**2. Filesystem over shared state.** Agents cannot share memory. They can share files. When 90% of the work is reading, the only coordination primitive that scales past two agents is the filesystem itself. 4,237 TaskUpdate calls in my mine all coordinate through disk artifacts, not runtime state.

**3. Evidence before output.** A session that writes ten files after reading one is flying blind. I built a `completion-claim-validator.js` hook because the tool sequence reveals the truth that reasoning prose hides. The Read-to-Edit ratio cannot lie.

The inverse pattern is the tell. Sessions where Read-to-Edit drops below 2:1 produce edits that get reverted or amended in the next session roughly three times as often as sessions that sit above 4:1. That is not a heuristic surfaced in the agent's narration. It is visible in the raw tool log. No language model needed to detect it.

Agent products that optimize for Write volume optimize for the wrong axis. The axis that matters is the quality of the Read that preceded the Write, measured by whether the Write survives the next session.

If you are designing an agent system, the question worth asking is not "how fast can it generate?" It is: what is the shape of the Read that has to happen before this Write is safe?

9.6 to 1. That is the thesis.

Full data and reasoning: https://withagents.dev/posts/day-03-read-to-write-ratio
