**Session 4,200.**

I watched a Claude Code agent rewrite a database migration that session 3,800 had already solved. Same table. Same foreign key constraint. Same solution it was about to spend twenty minutes rediscovering.

I could not do anything except sit there, because the agent had no idea session 3,800 ever happened.

**Every session is session 1**

Across 23,479 sessions the agent is not learning. It is performing. And it performs the same mistakes with the same confidence, over and over.

The human workaround is `CLAUDE.md`. Project-level instructions that persist across sessions. But `CLAUDE.md` is manual. I have to notice a repeated mistake, write down the lesson, maintain the file as the project evolves. Over 23,479 sessions across 27 projects, the lessons worth capturing dwarf what any human can curate.

The system needed to build its own memory.

**The architecture**

Three components:

1. **Observer.** A separate Claude instance watching tool executions in real-time. Corpus grew to 14,119 files, 421,577 lines, 2.8GB.
2. **SQLite observation store.** Append-only, WAL mode, pre-tokenized for TF-IDF search. 331 lines of working Python, not scaffolding.
3. **MCP memory server.** Exposes three-layer search to new sessions.

Four observation types cover the territory: `discovery`, `error`, `decision`, `pattern`. I started with six. Dropped `bugfix` and `refactor` because the distinction was not worth the overhead.

**Three-layer retrieval**

Searching 14,391 observations and returning full content would eat the entire context window. So the MCP exposes three layers:

- Layer 1 (search): 50-100 token snippets per result
- Layer 2 (timeline): session context around the anchor
- Layer 3 (get_observations): full content only for filtered IDs

Total retrieval cost: a few hundred tokens instead of tens of thousands. The agent spends its budget reading the answer, not the index.

**What the numbers reveal**

After 42 days:
- 14,391 observations stored
- 3.2x resolution speedup on known issues
- 23 recurring mistake categories surfaced by the pattern analyzer
- 73% precedent coverage (three-quarters of problems have a relevant prior observation)
- <50ms search latency at scale
- 159 `episodic_memory_search` calls tracked across all sessions

The number I care about most: 23 recurring mistake categories. Each represents a class of mistake no amount of one-off `CLAUDE.md` entries would catch, because you would need to anticipate the category, not just the instance.

**The honest limitation**

Memory is not understanding. The agent retrieves prior observations. It cannot generalize from "this migration failed because of a foreign key constraint" to "all migrations in this project should check foreign keys first."

But here is what shifted. Instead of needing to remember a pattern exists, I only need to recognize the pattern when memory surfaces it. "Here are 7 observations about foreign key failures in this project." That is a prompt for generalization no human would generate from 421,577 lines of raw logs.

The memory system converts an impossible curation task into a manageable review task.

The agent still does not truly learn. But it remembers. And remembering turns out to be most of what learning looks like in practice.

Full writeup + working Python: https://withagents.dev/posts/day-19-claude-mem-architecture
