# Post 12: "Teaching AI to Remember: Cross-Session Memory"

## Metadata
- Target word count: 2,000
- Source posts: 15, 21, 49
- Companion repo: `shannon-mcp`
- New content needed: Yes — reframe around MCP memory server architecture, add episodic memory search tool as practical example, connect to the Amnesia failure mode from post 11

## Opening (hook — 2 sentences max)
Same mistake at session 500 as session 5. Every Claude Code session starts with total amnesia — no memory of what worked, what failed, or what you decided yesterday.

## Narrative Arc

1. **The Amnesia Problem** — The concrete failure. Session 4,200: agent rewrites a database migration that session 3,800 already solved. Session 5,100: agent tries the same three failed approaches to a SwiftUI layout bug that session 4,900 exhaustively eliminated. Without memory, every session is session 1. The cost: not just wasted tokens, but wasted human attention re-explaining context. Post 15's framing: "The agent is not learning. It is performing. And it performs the same mistakes with the same confidence every time." ~300 words

2. **The SQLite Observation Store** — Post 15's architecture. Every session produces observations: decisions made, errors encountered, solutions found, files modified. The store schema: observation_id, session_id, timestamp, observation_type (decision, error, solution, pattern), content, embedding vector. Why SQLite over Postgres: the memory system runs locally alongside Claude Code, no network latency, no deployment. The write path: PostToolUse hooks capture observations automatically — the developer does not manually log anything. Post 15's numbers: 8,200 topic signals and 5,572 errors captured from the claude-mem-observer corpus (2,673 files, 367K lines, 2.1GB). ~350 words

3. **Semantic Search Over Past Sessions** — The retrieval problem. Keyword search fails because the same concept appears as "race condition," "concurrent access," "thread safety," and "data corruption" across different sessions. Vector embeddings solve this: embed the query, find nearest observations, return with session context. The episodic memory search tool: single string for semantic search, or array of 2-5 concepts for precise AND matching. The ranking: results scored by relevance, recency, and project affinity. Post 15's insight: "The memory system does not need to be perfect. It needs to surface the right observation 80% of the time — the developer validates the rest." ~300 words

4. **Session Telemetry Collection** — Post 21's framework. What to capture beyond code: tool call sequences (which tools, in what order, how often), error patterns (same error across sessions = systemic issue), timing data (how long each phase takes), file access patterns (which files are read together = implicit coupling). The telemetry pipeline: raw events -> aggregation -> pattern detection -> observation generation. Post 21's finding: tool call sequences are more predictive of session outcome than natural language content — "the tools don't lie about what actually happened." Post 49's scale: real-time observer processing sessions as they happen, not batch processing after the fact. ~350 words

5. **The MCP Memory Server** — Post 49's production architecture. The memory system exposed as an MCP server so Claude Code can query its own past. The search tool integrated into the conversation flow: agent hits a problem, searches memory, finds a prior solution, applies it. The three-layer workflow: search (get index with IDs), timeline (get context around results), get_observations (fetch full details for filtered IDs). Why the three-layer design: token efficiency — searching 8,200 observations returns 50-100 token summaries, not full content. Only fetch details for the 3-5 relevant hits. Post 49's real-time aspect: observations written during the current session are immediately searchable by the next query in the same session. ~350 words

6. **Closing: Memory Changes Everything** — The before/after. Without memory: every session reinvents. With memory: the agent asks "have I seen this before?" and acts on the answer. The compound effect over 4,500 sessions: patterns that took 5 sessions to discover now surface in 1. The limitation to acknowledge: memory is not understanding — the agent retrieves, it does not truly learn. ~150 words

## Key Code Blocks to Include
- The observation store SQLite schema from post 15 (~10 lines)
- The episodic memory search call showing single-string and array-of-concepts modes (~8 lines)
- The three-layer MCP workflow from post 49: search -> timeline -> get_observations (~12 lines)
- The PostToolUse hook that captures observations automatically from post 21 (~10 lines)

## Real Data Points
- 2,673 files, 367K lines, 2.1GB in the claude-mem-observer corpus (session evidence)
- 8,200 topic signals extracted (session evidence)
- 5,572 errors captured (session evidence)
- 50-100 tokens per search result in the index layer (post 49)
- Tool call sequences more predictive than NLP content (post 21)
- 4,500 total sessions as the dataset scale (series-wide metric)

## Material to NOT Include
- Post 15's full embedding pipeline implementation (too detailed)
- Post 15's comparison of embedding models (tangential)
- Post 21's full analytics dashboard UI code (tangential)
- Post 21's Grafana/Prometheus integration details (infrastructure, not insight)
- Post 49's full WebSocket real-time streaming implementation (too detailed)
- Post 49's deployment and scaling considerations (filler)
- Content pipeline details (post 9 material)
- Ralph loop state management (post 8 material)
- Spec-driven patterns (post 11 material)

## Companion Repo Tie-in
The `shannon-mcp` repo provides a working MCP server with cross-session memory: SQLite observation store, semantic search with vector embeddings, and the three-layer retrieval workflow. Reader can install it as an MCP server for Claude Code, run a few sessions, then query "what errors have I seen in this project?" to see memory in action. Includes the PostToolUse hooks for automatic observation capture.
