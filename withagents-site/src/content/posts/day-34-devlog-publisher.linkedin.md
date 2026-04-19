# The skill that reads your session logs so you don't have to

My `~/.claude/projects/` directory was 11.6 GB of JSONL nobody would ever read.

3,474,754 lines across 27 projects. 23,479 sessions. Every build, every refactor, every dumb shortcut I talked an agent out of. All of it structured, all of it mine, all of it unreadable unless I opened the files one by one.

I kept meaning to write about it. I never did.

The gap between "I lived through this" and "I published it" is where most technical writing dies. I shipped for three months against that gap. Then I built a skill and the gap closed.

## What the skill does

`devlog-publisher` is a Claude Code skill that mines session JSONL across every project on your machine, scores each session on six weighted dimensions, and spawns four teammate writers against the top insights. The SKILL.md lives at `~/.claude/skills/devlog-publisher/SKILL.md`. The discovery step is a three-line shell command that walks the filesystem. No cloud, no indexing, no API.

The scoring weights: Novel Problem-Solving 3x. Tool/Pattern Discovery 3x. Failure + Recovery 3x. Before/After Transformation 2x. Reproducibility 1x. Scale/Performance 1x. The 3x weights are the reason the skill finds anything worth reading. I tried 2x on Novel Problem-Solving first. The output read like a corporate newsletter. I pushed it to 3x and the debugging war stories started surfacing.

## The session where it changed my output

2026-03-06. The subtitle on every post in my blog series said "11 Lessons from 4,500 AI Coding Sessions." I believed it. I had shipped it.

I ran `devlog-publisher` against my full 360-day history for a consolidation pass. The Session Miner returned a count: 23,479 sessions across 42 days. 3,474,754 lines. 5.2x higher than what I had claimed.

4,534 of those were sessions I had started by hand. 18,945 were spawned by other agents.

I had been wrong about my own output for weeks. The subtitle described one directory. The real number required twenty-seven. I updated every post, every social file, every memory entry. The edit took ten minutes. What took the real time was the audit — and the skill did the audit.

The output is still grep-able. `scripts/output/mine-360d-data.json` in the repo shows 1,676 `Agent` tool invocations, 88,560 `Read` calls, 10,140 `Write` calls. A 9.6:1 read-to-write ratio. Agents are readers that occasionally write. I could not have backed that claim without the miner.

## Why it runs locally

Every "AI content pipeline" product I have touched wanted me to upload my session data to their service. `devlog-publisher` opens the files on my disk, reads them, and writes outputs to a folder in my home directory. The data never leaves the machine.

That choice is the reason I use the skill twice a week. A cloud version would sit unused. The local version runs every Friday afternoon while I make coffee.

## What it is not

It does not produce ship-ready copy. It produces insight-dense drafts. I still edit every post for voice, for em-dash density, for the reversal at the top. The skill ranks sessions; I write the sentences.

It also does not scale past one machine. Teams with distributed session logs need a different design. The current skill is a solo-operator tool that admits it is a solo-operator tool.

## Mode bet

`devlog-publisher` is Interactive-mode work. I configure the environment once — skills loaded, teammate roster defined, output paths set — and after that the skill runs when I invoke it and produces artifacts I actually open. Not SDK. Not autonomous. The human presses go; the skill does the reading.

Session archaeology on my own dig site. Two afternoons of setup. Fifty minutes a run.

---

Full breakdown with the session pointers and the SKILL.md excerpts:
https://withagents.dev/writing/day-34-devlog-publisher
