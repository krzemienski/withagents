# README patch (Day 19 / claude-mem-architecture)

## Suggested insertion (top of README)

**Featured in:** [withagents.dev, *Teaching AI to remember: cross-session memory*](https://withagents.dev/posts/day-19-claude-mem-architecture)

The post walks the full system: 331-line SQLite observation store with WAL, TF-IDF semantic search in pure Python (no numpy, no vector DB), MCP memory server with a three-layer retrieval workflow that keeps retrieval cost around 500 tokens instead of tens of thousands.

Production numbers after 42 days:

- 14,391 observations stored
- 3.2x resolution speedup on known issues
- 23 recurring mistake categories surfaced by the pattern analyzer
- 73% precedent coverage across encountered problems
- <50ms search latency at scale
- 159 `episodic_memory_search` calls tracked

Honest scope: memory is not understanding. The agent retrieves prior observations. It does not generalize from them. The human still writes the rule. The memory system provides the evidence. The post closes on that limitation on purpose.

Repo contents referenced in the post:

- `observation_store.py` (the 331-line append-only store)
- `search.py` (zero-dependency TF-IDF + cosine similarity)
- `mcp_server.py` (three-layer retrieval surface)
- `observer/` (concurrent observer process)
- `examples/compaction.py` (session-start injection with 2,000-token budget)
