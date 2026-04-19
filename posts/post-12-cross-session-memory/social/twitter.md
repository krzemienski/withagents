# X Thread — Post 12

**Tweet 1:** Session 4,200. I'm watching a Claude Code agent rewrite a database migration that I know, I know, session 3,800 already solved.

Same table. Same foreign key constraint. Same solution it's about to spend 20 minutes rediscovering.

The agent has no idea session 3,800 ever happened.

**Tweet 2:** Across 23,479 sessions, the agent isn't learning. It's performing.

Same mistakes. Same confidence. Same eventual solution.

Session 12,100: agent tries three failed approaches to a SwiftUI layout bug that 11,900 already eliminated. No hedging. No "I think I've seen this." Just performance.

**Tweet 3:** CLAUDE.md files were my workaround. But they're manual.

Over 23,479 sessions across 27 projects, I was spending more time maintaining CLAUDE.md files than writing actual code.

At some point, the system needed to build its own memory.

**Tweet 4:** 14,391 observations stored. 14,119 observer session files. 2.8GB corpus, 421,577 lines of raw data.

No human reads 421,577 lines to extract 14,391 observations. The observer does it in real-time while sessions run. The human reviews patterns, not raw data.

**Tweet 5:** Four observation types cover everything:

discovery (new learnings)
error (failures worth remembering)
decision (architectural choices + rationale)
pattern (recurring behaviors)

I started with six. Dropped `bugfix` and `refactor` — distinction wasn't useful enough. Four clean boundaries.

**Tweet 6:** TF-IDF in pure Python. No embedding APIs. No vector DB. No numpy.

Search latency at 14,391 observations: under 50ms. Cost: zero.

Is it as good as transformers? No. Technical observations share specific vocabulary (class names, error messages). Exact-term overlap gives strong signal. 80% accuracy. Dev validates the rest.

**Tweet 7:** Three-layer retrieval: search, timeline, details.

Layer 1 returns 50-100 token summaries across 14,391 observations.
Layer 2 shows session context around interesting hits.
Layer 3 fetches full content for 3-5 observations that actually matter.

Total cost: hundreds of tokens, not tens of thousands.

**Tweet 8:** The timeline layer is where the causal chain lives.

An observation alone says "migration X failed because of foreign key Y."
The timeline says "tried A and B first, both failed for different reasons, then discovered Y."

That chain tells the next session what NOT to try. More valuable than the observation alone.

**Tweet 9:** Results from production after 42 days:

14,391 observations
23 recurring mistake categories identified
3.2x resolution speedup on known issues
73% precedent coverage
159 episodic_memory_search calls tracked

Three-quarters of problems had a prior observation. Most of an agent's work isn't novel. It's recurrence.

**Tweet 10:** Memory isn't understanding. The agent retrieves prior observations. It doesn't generalize from them.

But remembering turns out to be most of what learning looks like in practice. Every new session starts a little less amnesia-stricken than the last.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
