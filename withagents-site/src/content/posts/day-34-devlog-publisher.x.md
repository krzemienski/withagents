# X thread — Day 34 / devlog-publisher

Thread target: 9 tweets. All under 280 chars.

---

**Tweet 1** (244)
My ~/.claude/projects/ directory was 11.6 GB of JSONL nobody would ever read.

3,474,754 lines. 27 projects. 23,479 sessions.

I kept meaning to write about it. I never did.

The skill that fixed the gap between "I lived through this" and "I published it":

---

**Tweet 2** (213)
`devlog-publisher` lives at ~/.claude/skills/devlog-publisher/SKILL.md

Discovery step is 3 lines of shell:

find ~/.claude/projects -name "*.jsonl"
find ~/.claude -name "session*"
find / -path "*/.claude/sessions*"

No cloud. No index. Just the filesystem.

---

**Tweet 3** (265)
It ranks sessions on 6 weighted dimensions:

Novel Problem-Solving 3x
Tool/Pattern Discovery 3x
Failure + Recovery 3x
Before/After 2x
Reproducibility 1x
Scale/Performance 1x

The 3x weights are the reason it finds anything worth reading. 2x gave me a corporate newsletter.

---

**Tweet 4** (249)
2026-03-06. My subtitle said "11 Lessons from 4,500 AI Coding Sessions."

I ran devlog-publisher for a consolidation pass.

The miner returned a count: 23,479 sessions. 3,474,754 lines. 5.2x higher than the subtitle.

I had been wrong about my own output for weeks.

---

**Tweet 5** (263)
4,534 sessions I started by hand.
18,945 sessions spawned by other agents.

81% of my AI coding activity was agents spawning other agents. I could not see that from one directory. I could see it from twenty-seven.

The skill did the audit. I did the 10-minute fix.

---

**Tweet 6** (233)
Receipts in the repo:

scripts/output/mine-360d-data.json

88,560 Read invocations
10,140 Write invocations
22,463 Grep invocations
1,676 Agent spawns

A 9.6:1 read-to-write ratio.

Agents are readers that occasionally write. The miner let me say that with a number.

---

**Tweet 7** (245)
Why it runs locally:

Every "AI content pipeline" product wanted me to upload session data to their service.

devlog-publisher opens files on my disk, reads them, writes outputs to my home folder.

The data never leaves. That choice is the whole reason I actually run it.

---

**Tweet 8** (238)
What it does NOT do:

- produce ship-ready copy (drafts only, I still edit)
- scale past one machine (filesystem walk is local)
- invent sessions that didn't happen (archaeology, not fabrication)

Session mining is not a content cheat code. It is archaeology on your own dig site.

---

**Tweet 9** (205)
Mode bet: Interactive.

Two afternoons of setup. Fifty minutes per run. Ranked insights, teammate-written drafts, four platforms, zero overlap.

The skill makes the reading possible. I still write the sentences.

Full post:
withagents.dev/writing/day-34-devlog-publisher

---

Char counts: 244 / 213 / 265 / 249 / 263 / 233 / 245 / 238 / 205. All under 280.
