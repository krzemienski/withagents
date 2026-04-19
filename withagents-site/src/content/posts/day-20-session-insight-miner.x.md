# X Thread — Day 20 — session-insight-miner

Format: 9 tweets. All under 280 chars. No hashtag noise. Canonical URL in final tweet.

---

**1/9** (204 chars)
I could not keep saying 23,479 sessions unless I could grep them.

That is the only reason session-insight-miner exists. A Python script I ran against every project directory before I was allowed to cite a number.

**2/9** (212 chars)
The mine covers 42 days. 27 projects. 3,474,754 lines of interaction data. 11.6 GB on disk.

Every session is a line-delimited JSON file sitting under ~/.claude/projects/. You cannot see the tool counts without reading every file.

**3/9** (176 chars)
Top 5 tools in that slice:

Read: 87,152
Bash: 82,552
Grep: 21,821
Edit: 19,979
Glob: 11,769

The first grep works. The second grep disagrees with the first.

**4/9** (265 chars)
Why the second grep disagrees:

- one project double-counts agent-spawned sessions
- a Task invocation spawns a child JSONL your counter treats as a new user session
- a Bash piped into jq produces what looks like a bonus Bash call inside an assistant response

**5/9** (212 chars)
Fix: a small program you trust more than your own re-reads.

Canonical file: scripts/deep-mine.py
Outputs: mine-30d-data.json, mine-360d-data.json, full-mine-data.json

If a number is not in one of those files, it does not go in a post.

**6/9** (262 chars)
The script builds three views in one pass:

1. Tool leaderboard — every tool_use block, aggregated.
2. Agent-spawn graph — every Agent invocation cross-referenced with its child session file.
3. Project weight — files, lines, bytes, first + last session timestamps.

**7/9** (226 chars)
View 2 is the important one.

The agent-spawn graph is why the series subtitle says 18,945 agent-spawned sessions — roughly 4x the 4,534 human-started count.

That ratio is not an estimate. It is a cross-reference on disk.

**8/9** (218 chars)
Three modes: full-mine, window-mine (last N days), project-mine (one directory).

Every post cites which mode produced its number. SessionForge is the productized version of the same discipline. This script is the raw form.

**9/9** (205 chars)
Read the logs before you write the claim.

That is the whole value proposition. A script that takes 11.6 GB of transcripts and hands back one line you can put under a blog title.

https://withagents.dev/writing/day-20-session-insight-miner
