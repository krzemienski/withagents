# README patch — claude-sdk-bridge

Paste under the "Featured in" / "Used by" section of `github.com/krzemienski/claude-sdk-bridge`.

Replace any existing "Part 2" series header — the canonical framing is the WithAgents 45-day launch series, Day 12.

---

## Featured in the WithAgents 45-day launch series

**Day 12 — Four failure modes, one bridge.** This repo is the reference implementation of the CLI-wrapping pattern that survived thirty hours of debugging across four different architectures. The post walks each failure mode with real code from `failed-attempts/`:

1. Direct Anthropic API → OAuth wall
2. Swift ClaudeCodeSDK in Vapor → RunLoop/NIO scheduling gap
3. JavaScript SDK → same OAuth wall, added Node dependency for zero capability
4. Direct CLI subprocess → CLAUDECODE environment inheritance, silent exit

Every attempt in `failed-attempts/` is real compilable/runnable code that actually produces the documented error. Clone the repo, run each file, watch it fail, then run `working-bridge/` and watch it work.

The post also covers the non-negotiable process lifecycle ordering (drain → wait → status) that avoids both the `NSInvalidArgumentException` race and the 64KB pipe deadlock.

Read the full post: [withagents.dev/writing/day-12-claude-sdk-bridge](https://withagents.dev/writing/day-12-claude-sdk-bridge)

Related WithAgents posts:
- Day 09 — iOS Streaming Bridge (where this pattern was first extracted)
- Day 13 — ClaudeCodeSDK (TypeScript reusable package on the same pattern)
- Day 14 — Claude Prompt Stack (what sits on top of this bridge)

---

**Install:** `pip install -e working-bridge/`
**License:** MIT
**Mode-bet:** SDK (programmatic control via typed bridge)
**Languages:** Python 3.10+, Swift 5.10+
