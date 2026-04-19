# README patch — claude-code-skills-factory

Paste target: `claude-code-skills-factory/README.md`, "Featured in" section (append if exists, create if absent).

---

### Featured in

**[Day 34 — The skill that reads your session logs so you don't have to](https://withagents.dev/writing/day-34-devlog-publisher)** (2026-05-22)

A walkthrough of `devlog-publisher`, the skill this factory ships as a canonical example of session-mining-as-content-pipeline. The post traces the six-dimension scoring rubric (3x weights on Novel Problem-Solving, Tool/Pattern Discovery, and Failure + Recovery), documents the 2026-03-06 run that corrected a public subtitle from "4,500 sessions" to 23,479, and cites `~/.claude/skills/devlog-publisher/SKILL.md` as the source of truth for the teammate orchestration pattern. Output artifacts from that run are preserved at `scripts/output/mine-360d-data.json` in the `blog-series` repo — 1,676 Agent spawns, 88,560 Read calls, 10,140 Write calls, a 9.6:1 read-to-write ratio across 42 days.

The skill runs entirely against the local filesystem (`~/.claude/projects/**/*.jsonl`) and writes outputs to `outputs/devlog-publisher/{YYYY-MM-DD}/`. No network calls. No external indexing. Two afternoons of setup; fifty minutes per run.

If you are building a session-mining skill against your own Claude Code history, the `devlog-publisher` SKILL.md under `skills/` is the reference implementation.
