# README patch — shannon-mcp

Add at the TOP of `README.md`, before the existing description. This patch reframes the repo honestly as a reference/Tier-2 artifact, not an active product.

---

## Status (as of 2026-05-05)

This repo has not had a push since **November 14, 2025**. It is a five-month-old snapshot of a Shannon experiment that stopped making sense once the architecture met the MCP protocol.

- ✅ Tool-definition JSON schemas are accurate and ported into [shannon-cli](https://github.com/krzemienski/shannon-cli).
- ✅ The collaborative multi-agent handler is a reference for how the three-role consensus pattern generalizes.
- ⚠️ The server architecture runs three internal agents per MCP tool call. Latency and cost do not match the synchronous protocol expectation.
- ⚠️ Two open issues are structural reports that the architecture fights the protocol. Neither is a bug. Both are legitimate.

## Featured in

**[Shannon-MCP: a repo that stopped, and what its last commit still teaches](https://withagents.dev/writing/day-17-shannon-mcp)** (WithAgents, Day 17)

The write-up covers:

- Why `shannon-mcp` was going to complete the Shannon surface map (framework + CLI + MCP)
- Three reasons it stopped (protocol shape mismatch, empty user wedge, multi-agent overkill)
- What survived on disk and what got ported into shannon-cli
- The new three-tier Shannon surface map

## If you have a use case

Open an issue describing the MCP client and workload. That is the forcing event this repo has been waiting for. Until then: treat the code here as a reference, not an install target.
