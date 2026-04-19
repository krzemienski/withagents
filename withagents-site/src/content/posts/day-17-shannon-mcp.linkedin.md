# Shannon-MCP: a repo that stopped, and what its last commit still teaches

shannon-mcp has not had a push since November 14, 2025.

Two open issues, neither responded to. 27.7MB of Python on main. The GitHub description reads "a comprehensive Model Context Protocol server."

It is not comprehensive.

It is a five-month-old snapshot of where one part of Shannon's experiment stopped making sense. I am writing it up this way because pretending otherwise would break the only rule this series is here to defend: the real system or nothing.

---

**What it was trying to be**

The framework enforces discipline inside Claude Code.

The CLI enforces the same discipline headless.

Shannon-MCP was going to complete the matrix: the same enforcement exposed as an MCP server so any MCP-compatible client could call it.

Tool definitions for `shannon_validate`, `shannon_plan`, `shannon_enforce`. A collaborative multi-agent architecture where every request ran three internal agents and returned a consolidated verdict.

The last commit landed. Nothing came after.

---

**Why it stopped**

Three reasons, in the order they showed up.

1. **MCP clients do not want opinionated middleware.** An MCP server is, by design, one layer. Clients that wanted a validator wanted one call, one response. Shannon wanted to hold a plan in memory and gate across its whole trajectory. Different products. The protocol did not have the shape for what Shannon needed to express.

2. **The enforcement was already where it needed to be.** Every Claude Code user who would reach for shannon-mcp already had shannon-framework. Every non-Claude-Code user who needed headless enforcement had shannon-cli. The middle wedge — "MCP-compatible client that is not Claude Code and needs full Shannon enforcement" — was an empty set during the window when the repo could have shipped.

3. **The multi-agent internals were overkill for the surface.** Running three agents inside one MCP tool call added latency and token cost to a request the caller treated as synchronous. The framework can afford three agents because it runs across a whole session. The CLI can afford them because it runs in a batch window. An MCP tool call cannot. The architecture fought the protocol.

---

**What survived on disk**

- The tool-definition JSON schemas ported into shannon-cli's pipeline stages almost unchanged.
- The collaborative handler is the clearest statement of how the three-role pattern from multi-agent-consensus was meant to generalize beyond consensus gates.
- The two open issues are structural reports that the architecture is fighting the protocol. They are not bugs.

---

**The lifecycle lesson**

Every active withagents.dev product exists because a shorter version of this story did not happen to it.

Shannon-MCP got five months of attention, then lost the next six to products that found live users. That is not failure. That is how a portfolio decides what to keep.

I am writing this down, with the exact pushed_at timestamp, because the alternative is the version of this post that pretends shannon-mcp is humming along. That version would invalidate every other post in this series.

---

**New Shannon surface map, three tiers not a flat list**

- Tier 1 (active): shannon-framework, shannon-cli
- Tier 2 (reference on disk): shannon-mcp
- Tier 3 (open question): shannon-cc — the repo that does not exist yet (covered in the next post)

If you run an MCP client outside Claude Code and need Shannon-grade enforcement, open an issue on shannon-mcp. That is the forcing event the repo has been waiting for.

---

Repo: github.com/krzemienski/shannon-mcp
Full write-up: https://withagents.dev/writing/day-17-shannon-mcp

The repos that rest say something about the live ones.
