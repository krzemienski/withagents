# The miner that reads 11.6 gigabytes of JSONL and returns a sentence you can publish

I could not keep saying 23,479 sessions unless I could grep them.

That is the only reason session-insight-miner exists. It is the small companion under SessionForge — the Python script I ran against every project directory before I was allowed to write a blog post with a number in it.

## The shape of the problem

The mine covers 42 days, 27 projects, 3,474,754 lines of interaction data, 11.6 GB on disk. Every session is a line-delimited JSON file under `~/.claude/projects/`.

The top-level tool counts from that slice:

- Read: 87,152 invocations
- Bash: 82,552
- Grep: 21,821
- Edit: 19,979
- Glob: 11,769

You cannot see those numbers without reading every file. And the second time you run a naive grep, you miscount — one project double-counts agent-spawned sessions, a Task invocation generates a fresh JSONL your counter treats as a new user session, a Bash piped into jq produces what looks like a bonus Bash call inside an assistant response.

The only fix is a small program you trust more than your own re-reads.

## What the script actually does

The canonical file is `scripts/deep-mine.py`. The outputs it writes — `mine-30d-data.json`, `mine-360d-data.json`, `full-mine-data.json` — are the only numbers I cite in the 45-day launch. If a number is not in one of those files, it does not go into a post.

Three views, built in one pass:

1. **Tool leaderboard.** Every `tool_use` block, aggregated by tool name. That is where 87,152 Read and 82,552 Bash come from.

2. **Agent-spawn graph.** Every Agent invocation cross-referenced with a child session file. The ratio this produces is the reason the series subtitle says 18,945 agent-spawned sessions — roughly 4x the 4,534 human-started count.

3. **Project weight.** Per-project totals — files, lines, bytes, first and last session timestamps. Every row in the product inventory backing this launch was measured, not remembered.

The hard part is not writing any of those three. The hard part is trusting the third one when your hands want to round a 3,596-file iOS project down to "about 3,500."

## The receipt discipline

The reason I keep the mine script in a repo instead of deleting it after each content sprint: every claim in every post has to survive the question — *where did this number come from?*

The script has three modes: full-mine, window-mine (last N days), project-mine (one directory). Every post cites which mode produced its number. SessionForge is the productized version of the same move — a web app that does the mining instead of a Python file invoked by hand.

Neither tool lets me publish a number I have not re-derived on the current dataset. That is the whole value proposition.

## What I do not know yet

Whether the 81% agent-spawned ratio holds across a longer push. Whether the ratio is stable project-to-project or whether ils-ios alone is pulling the average up. Those are the open questions for the Day 21 insight post — and the only reason that post can answer them at all is that the miner runs on-demand against whatever window I ask for.

A script that takes 11.6 GB of transcripts and hands back a single line you can put under a blog title. That is the receipt layer under every claim WithAgents makes this launch.

session-insight-miner is the small one. SessionForge is the big one. Both start with the same move: read the logs before you write the claim.

---

Full post with `scripts/deep-mine.py` structure and the `mine-*.json` schema: https://withagents.dev/writing/day-20-session-insight-miner
