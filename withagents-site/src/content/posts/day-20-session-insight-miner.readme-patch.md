## Featured in: Day 20 of the WithAgents launch

**session-insight-miner** is the small companion under SessionForge — the on-demand Python script that produces the JSONL-derived numbers behind every post in the WithAgents 45-day launch.

Canonical script: `scripts/deep-mine.py`
Canonical outputs: `mine-30d-data.json`, `mine-360d-data.json`, `full-mine-data.json`

If a number appears in a WithAgents post, it was produced by a mode of this script (full-mine, window-mine, or project-mine) against the live `~/.claude/projects/` tree at publish time. The 23,479-session headline figure, the 87,152 Read invocations, the 81% agent-spawned ratio — all of it is traceable back to a file this repo wrote.

Full write-up on how the mining discipline became the receipt layer under every WithAgents claim: https://withagents.dev/writing/day-20-session-insight-miner

Pairs with: `sessionforge` (the productized version of the same discipline), `code-tales` (the ElevenLabs-driven narration layer on top of the mine outputs).
