# LinkedIn — Post 12

Session 4,200. I'm watching a Claude Code agent rewrite a database migration that I know, I know, session 3,800 already solved. Same table. Same foreign key constraint. Same solution it's about to spend 20 minutes rediscovering.

The agent has no idea session 3,800 ever happened.

**Every Session Is Session 1**

Across 23,479 sessions, the agent isn't learning. It's performing. And it performs the same mistakes with the same confidence, over and over.

Session 12,100: agent tries three failed approaches to a SwiftUI layout bug that session 11,900 already eliminated. Session 19,400: agent confidently refactors an auth flow, unaware that three prior sessions proved that exact refactor breaks token refresh.

My workaround was CLAUDE.md files. But CLAUDE.md is manual. I have to notice a repeated mistake, write down the lesson, maintain the file as the project evolves. Over 23,479 sessions across 27 projects, I was spending more time maintaining CLAUDE.md files than writing actual code.

**SQLite Plus TF-IDF in Pure Python**

Every session produces observations: decisions made, errors hit, solutions found, patterns discovered. An observer process (a separate Claude instance) watches tool executions in real-time and records them as XML blocks.

Four observation types cover the territory: discovery, error, decision, pattern. I started with six and dropped `bugfix` and `refactor`. The distinction wasn't useful enough to justify the overhead.

14,391 observations stored. 14,119 observer session files. 2.8GB corpus, 421,577 lines of raw data. No human reads 421,577 lines to extract 14,391 observations. The observer does it continuously while sessions run. The human reviews patterns, not raw data.

Search uses TF-IDF in pure Python. No embedding APIs, no vector database. Sub-50ms latency at 14,391 observations. Cost: zero. Is it as good as transformers? No. But technical observations share specific vocabulary. Class names, error messages, library names. Exact-term overlap gives strong signal at roughly 80% accuracy.

**The Three-Layer Retrieval**

Layer 1 returns 50-100 token summaries. Layer 2 shows session context around interesting hits. Layer 3 fetches full content for 3-5 observations that actually matter. Total cost: a few hundred tokens instead of tens of thousands.

The timeline layer is where the causal chain lives. An observation alone says "migration X failed because of foreign key Y." The timeline says "tried A and B first, both failed for different reasons, then discovered Y." That chain tells the next session what NOT to try. More valuable than the observation itself.

Results after 42 days of production: 23 recurring mistake categories identified. 3.2x resolution speedup on known issues. 73% precedent coverage, meaning three-quarters of the problems an agent encounters have a relevant prior observation.

Across 23,479 sessions, I tracked 159 calls to `episodic_memory_search`. Each one a moment where the agent chose to consult its past instead of starting from scratch. Session-start compaction injects up to 2,000 tokens of relevant observations into every new session. The agent begins standing on its predecessors' shoulders instead of crawling out of the same hole.

Memory isn't understanding. The agent retrieves prior observations. It doesn't generalize from them. But remembering turns out to be most of what learning looks like in practice. Every new session starts a little less amnesia-stricken than the last.

Full post + code in the comments.
