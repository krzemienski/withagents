# X Thread — Post 9

**Tweet 1:** I thought I had 4,597 session files. I built an entire scoring algorithm around that number.

Then I ran the full mine across every project directory. Real count: 23,479.

The series subtitle said "4,500 sessions." Every post I'd drafted was citing the wrong denominator.

**Tweet 2:** First version of the pipeline used natural language extraction. Feed session text to a summarizer, cluster summaries by topic similarity.

It worked terribly. "Fixing a build error" and "resolving a compilation issue" landed in different clusters. Synonyms killed the clustering.

**Tweet 3:** The breakthrough: tool call sequences are a session's fingerprint.

`Read → Read → Read → Grep → Edit → Bash` is a targeted fix.
`Bash(git) → Bash(git) → Bash(git) → Write` is a git operation.

Tools are ground truth. Natural language summaries lie. Session says "investigated" when the agent ran `npm install` three times.

**Tweet 4:** K-means on tool signature vectors: 94% stability across re-runs.

Same sessions, same clusters, regardless of initialization. NLP-based clustering on session summaries: 71%.

Twenty archetypes emerged. Build-fix loops. Multi-file refactors. iOS simulator work. Same twenty across all 27 projects.

**Tweet 5:** Seven-dimension scoring:

Novelty 0.20
Technical depth 0.18
Reproducibility 0.15
Failure richness 0.15
Cross-project 0.12
Narrative potential 0.10
Metric density 0.10

Heuristic signal detection, not LLM calls. Scoring 23,479 sessions through an LLM would cost hundreds of dollars. Heuristic runs in seconds.

**Tweet 6:** Sessions that fail, investigate, pivot, succeed score high on narrative potential.

A session that fails and stays failed is a bug report. A session that succeeds without struggle is a tutorial. The conflict-investigation-resolution arc is the story.

Roughly 10% of sessions produced high-value insights.

**Tweet 7:** The aggregate picture surprised me more than any individual insight.

Agents read 9.6x more than they write. 87,152 reads vs 9,066 writes. The best AI coding sessions aren't the ones that write the most code. They're the ones that read the right files before writing anything.

**Tweet 8:** Each human session spawns 4.2 agent sessions.

Of 23,479 total, only 4,534 started from a human prompt. The rest spawned from other agents. That "4,500 sessions" number only counted the human layer. The actual work was five times larger.

**Tweet 9:** Three-zone sampling cut processing time 48% with under 3% insight loss.

First 50 lines (setup) + 3 random 30-line windows (middle) + last 50 lines (conclusion). 190 lines sampled per session vs reading 1,000+.

Where the 3% loss comes from: narrow breakthrough moments between sampling windows.

**Tweet 10:** The most useful tool I built during this entire series wasn't a multi-agent orchestrator or a validation framework.

It was a script that reads my own session logs and tells me what I actually did versus what I thought I did.

The bottleneck isn't generation. It's comprehension.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
