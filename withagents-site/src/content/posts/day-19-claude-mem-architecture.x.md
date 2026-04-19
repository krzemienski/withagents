# X thread — Day 19

**1/10** (237 chars)
Session 4,200.

I watched an agent rewrite a database migration that session 3,800 had already solved. Same table, same constraint, same fix, same twenty-minute rediscovery.

The agent had no idea session 3,800 ever happened.

So I built the memory layer.

**2/10** (241 chars)
Across 23,479 sessions, the agent is not learning. It is performing.

Every session is session 1. Same mistakes, same confidence.

Session 12,100 tries the same 3 failed SwiftUI layouts session 11,900 already killed. Session 19,400 breaks auth the same way 3 times.

**3/10** (232 chars)
`CLAUDE.md` is the manual workaround. I have to notice the pattern, write the lesson, maintain the file.

Over 23,479 sessions across 27 projects, the lessons dwarf what any human can curate.

The system needed to build its own memory.

**4/10** (228 chars)
Architecture:

1. Observer process (a separate Claude watching tool calls in real-time)
2. SQLite observation store (append-only, WAL, pre-tokenized)
3. MCP memory server (three-layer retrieval)

4 observation types: `discovery`, `error`, `decision`, `pattern`.

**5/10** (232 chars)
Why 4 types? I started with 6.

Dropped `bugfix` and `refactor` because the distinction from `error`-with-resolution and `decision` was not worth the overhead.

Clean boundaries beat exhaustive taxonomies when the agent has to pick one at write time.

**6/10** (233 chars)
The three retrieval layers exist because dumping 14,391 observations eats the context window:

L1 search: 50-100 token snippets
L2 timeline: session context around anchor
L3 get_observations: full content for filtered IDs

Total: ~500 tokens instead of ~50,000.

**7/10** (238 chars)
The timeline layer is the callout.

In isolation: "migration X failed because of foreign key constraint Y."

With timeline: "agent tried approaches A and B first, both failed differently, then found the constraint, the fix was Z."

The causal chain is what matters.

**8/10** (237 chars)
Numbers after 42 days:

14,391 observations stored
3.2x speedup on known issues
23 recurring mistake categories surfaced by pattern analyzer
73% precedent coverage
<50ms search latency
159 `episodic_memory_search` calls tracked

**9/10** (232 chars)
Honest limitation: memory is not understanding.

Agent retrieves. It does not generalize. "Foreign key failed" does not become "check foreign keys first."

But it surfaces 7 related observations. That is a prompt for generalization no human generates from raw logs.

**10/10** (226 chars)
The agent still does not truly learn.

But it remembers.

And remembering turns out to be most of what learning looks like in practice.

Repo: github.com/krzemienski/claude-mem-architecture
Full post: https://withagents.dev/posts/day-19-claude-mem-architecture
