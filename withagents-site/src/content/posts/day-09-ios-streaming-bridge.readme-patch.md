# README patch — claude-ios-streaming-bridge

Paste under the "Featured in" / "Used by" section of `github.com/krzemienski/claude-ios-streaming-bridge`.

Replace any existing "Part 1" / "Part 2" series header — the canonical framing is the WithAgents 45-day launch series, Day 09.

---

## Featured in the WithAgents 45-day launch series

**Day 09 — The five-layer streaming bridge.** This repo is the Swift Package extracted from ils-ios that finally made Claude stream into a SwiftUI view, token by token. The post walks the four failed architectures (direct API, Node subprocess, Swift SDK in Vapor, direct CLI), the three load-bearing bug classes (block-buffered stdout, accumulated vs incremental text semantics, environment variable contamination), and the process-lifecycle ordering that avoids both the `NSInvalidArgumentException` race and the 64KB pipe deadlock.

The bridge was the wire. Day 10 picks up with CCB — the agent builder that ran on top of it across eighteen generations.

Read the full post: [withagents.dev/writing/day-09-ios-streaming-bridge](https://withagents.dev/writing/day-09-ios-streaming-bridge)

Related WithAgents posts:
- Day 10 — CCB Evolution (the builder that used this bridge first)
- Day 11 — CCBios / ccbios-enhanced (the iOS version of CCB, same bridge pattern)
- Day 12 — Claude SDK Bridge (the polyglot generalization)

---

**Install:** SPM, add `https://github.com/krzemienski/claude-ios-streaming-bridge`
**License:** MIT
**Mode-bet:** SDK (programmatic control via typed protocol layer)
