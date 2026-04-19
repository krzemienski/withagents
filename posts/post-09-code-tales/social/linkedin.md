# LinkedIn — Post 9

I thought I had 4,597 session files. I built an entire scoring algorithm around that number. Then I ran the full mine across every project directory. Real count: 23,479.

The series subtitle said "4,500 AI coding sessions." Every post I'd drafted was citing the wrong denominator. The actual scope was more than five times what I thought.

**Tool Signatures Beat Natural Language**

First version of the mining pipeline used natural language extraction. Feed session text to a summarizer, cluster summaries by topic similarity. It worked terribly. Sessions about "fixing a build error" and "resolving a compilation issue" landed in different clusters despite being identical activities.

The breakthrough: tool call sequences are a session's fingerprint. `Read, Read, Read, Grep, Edit, Bash` is a targeted fix. `Bash(git), Bash(git), Bash(git), Write` is a git operation. Tool sequences don't lie about what the session actually did.

K-means clustering on tool signature vectors produced 94% stability across re-runs. NLP clustering on session summaries produced 71%. Twenty distinct session archetypes emerged, the same twenty across all 27 projects.

**Seven Dimensions, Heuristic Scoring**

Novelty at 0.20 weight. Technical depth 0.18. Reproducibility 0.15. Failure richness 0.15. Cross-project 0.12. Narrative potential 0.10. Metric density 0.10.

Heuristic signal detection, not LLM calls. Scoring 23,479 sessions through an LLM would cost hundreds of dollars. The heuristic runs in seconds.

Sessions with both failure signals and resolution signals score high on narrative potential. A session that fails and stays failed is a bug report. A session that succeeds without struggle is a tutorial. But a session that fails, investigates, pivots, and succeeds? That's a narrative.

Three-zone sampling (head, middle, tail) cut processing time 48% with under 3% insight loss. 190 lines sampled per session instead of reading 1,000+.

**What the Numbers Actually Revealed**

Agents read 9.6x more than they write. 87,152 reads versus 9,066 writes across all sessions. I assumed writing would dominate. It doesn't. The overwhelming majority of agent effort goes into understanding context.

Each human session spawns 4.2 agent sessions. Of 23,479 total, only 4,534 started from a human prompt. The rest spawned from agents doing research, building components, running validation. That "4,500 sessions" number only counted the human layer.

7,985 iOS simulator interactions. 2,068 browser automation calls. 327 sequential thinking invocations. 269 Stitch design generations. Invisible in the old metrics that only counted core tools.

The numbers I was publishing were wrong. Posts 1, 9, 12, 13, 16, 17, and 18 all cited "4,500 sessions." The real number is 23,479. Building a tool to analyze your own work is uncomfortable precisely because it produces findings you don't want. I would've preferred the old numbers to be correct. They weren't.

The most useful tool I built during this entire series wasn't a multi-agent orchestrator or a validation framework. It was a script that reads my own session logs and tells me what I actually did versus what I thought I did. The bottleneck isn't generation. It's comprehension. And you'd never know that without mining the data.

Full post + code in the comments.
