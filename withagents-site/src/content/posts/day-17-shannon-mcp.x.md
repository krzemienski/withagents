# X thread — day-17-shannon-mcp

**Tweet 1 (269 chars)**

shannon-mcp has not had a push since November 14, 2025.

two open issues, neither responded to. 27.7MB of python on main.

the description says "comprehensive MCP server." it is not comprehensive.

it's a 5-month snapshot of where one part of Shannon's experiment stopped making sense.

---

**Tweet 2 (232 chars)**

i'm writing this as a lifecycle post because the alternative would break the only rule this series defends:

the real system or nothing.

the real shannon-mcp has been idle since November. pretending otherwise would invalidate every other post here.

---

**Tweet 3 (265 chars)**

what it was trying to be:

framework enforces discipline inside Claude Code.
CLI enforces it headless.
MCP server was going to expose the same enforcement so any MCP-compatible client could call it.

pitch was clean. tool definitions shipped. architecture fought the protocol.

---

**Tweet 4 (276 chars)**

why it stopped, reason 1:

MCP clients do not want opinionated middleware.

clients that wanted a validator wanted one call, one response. Shannon wanted to hold a plan in memory and gate across its whole trajectory.

different products. the protocol didn't have the shape.

---

**Tweet 5 (258 chars)**

reason 2:

the enforcement was already where it needed to be.

framework users already had the hooks. CLI users already had the pipeline.

the middle wedge — "MCP client that is not Claude Code and needs full Shannon" — was an empty set during the window when the repo could have shipped.

---

**Tweet 6 (243 chars)**

reason 3:

multi-agent internals were overkill for the surface.

3 internal agents per MCP tool call = latency + token cost on a request the caller treated as synchronous.

framework runs across a session. CLI runs a batch. MCP can't. architecture fought the protocol.

---

**Tweet 7 (219 chars)**

what survived on disk:

• tool-definition JSON schemas ported into shannon-cli unchanged
• the collaborative handler is the clearest statement of how 3-role consensus generalizes
• the 2 open issues are structural reports, not bugs

---

**Tweet 8 (264 chars)**

new Shannon surface map. three tiers, not a flat list:

• Tier 1 (active): shannon-framework, shannon-cli
• Tier 2 (reference on disk): shannon-mcp
• Tier 3 (open question): shannon-cc — the repo that does not exist yet

pretending shannon-mcp is Tier 1 is the failure mode i'm refusing.

---

**Tweet 9 (214 chars)**

every active withagents.dev product exists because a shorter version of this story did not happen to it.

shannon-mcp got 5 months of attention. then it lost 6 to products that found live users.

not failure. portfolio math.

---

**Tweet 10 (198 chars)**

full write-up with the 3 reasons, what ported into shannon-cli, and the 3-tier surface map:

withagents.dev/writing/day-17-shannon-mcp
github.com/krzemienski/shannon-mcp

next: the repo that isn't there yet.
