# X thread — Day 09: iOS Streaming Bridge

---

**Tweet 1 (249 chars)**
I wanted one thing: Claude streaming into a SwiftUI view, token by token.

Four failed architectures.
A five-layer bridge with ten hops per token.
7,985 iOS MCP tool calls.

The "complicated" solution turned out to be the only simple one.

Here's what broke. 👇

---

**Tweet 2 (273 chars)**
Attempt 1: Direct Anthropic API from Swift.

AuthenticationError: No API key.

Claude Code uses OAuth session tokens that refresh inside the CLI. There is no `ANTHROPIC_API_KEY`. The auth boundary is fundamentally different from what every iOS dev expects.

Dead end at hop 0.

---

**Tweet 3 (260 chars)**
Attempt 2: Node subprocess + official JS SDK.

Process launched. SDK authenticated. Then silence.

SwiftNIO and Node's event loop are independent scheduling systems. Neither yields to the other. The subprocess hung on its first async op.

Two correct runtimes. Incorrect composition.

---

**Tweet 4 (277 chars)**
Attempt 3: Swift ClaudeCodeSDK inside Vapor.

`FileHandle.readabilityHandler` requires a `RunLoop`. SwiftNIO provides `EventLoop`. Callbacks register, never fire.

Two Swift frameworks that are individually correct, architecturally incompatible.

This one took two days to diagnose.

---

**Tweet 5 (282 chars)**
Attempt 4: Just shell out to the `claude` CLI.

"Error: Claude Code cannot run inside another Claude Code instance."

The child inherited `CLAUDECODE=1` from the parent. The CLI assumed it was being invoked recursively and refused.

Ambient environment contamination. Five layers deep.

---

**Tweet 6 (259 chars)**
Each failure lived at a different boundary:
- Attempt 1 → authentication
- Attempt 2 → event loop
- Attempt 3 → concurrency model
- Attempt 4 → environment

The solution was to make each boundary explicit. One dedicated layer per translation.

Five layers total.

---

**Tweet 7 (272 chars)**
Five files, one job each:

1. SSEClient.swift — transport + heartbeat
2. ClaudeExecutorService.swift — process spawn, env strip
3. StreamingTypes.swift — accumulated vs incremental
4. sdk-wrapper.py — NDJSON emission + flush
5. ChatViewModel.swift — high-water mark, dedup

---

**Tweet 8 (268 chars)**
The bug that cost me a full day:

`assistant` events contain ACCUMULATED text.
`streamEvent` deltas contain INCREMENTAL text.

Same JSON shape. Opposite semantics.

Use `=` for accumulated, `+=` for deltas.
Mix them and every message gets doubled.

"HelloHello, how can I help?"

---

**Tweet 9 (271 chars)**
The one-line fix that took hours to find:

Python subprocess stdout is block-buffered by default.

```
sys.stdout.flush()
```

after every NDJSON line. Without it, the buffer holds 4KB, then dumps.

I almost rewrote the bridge in Go before realizing it was a missing function call.

---

**Tweet 10 (266 chars)**
The process lifecycle rule:

1. Drain the pipe
2. waitUntilExit()
3. Read terminationStatus

In that order.

Read status early → NSInvalidArgumentException crash.
waitUntilExit early with >64KB in pipe → deadlock, neither side proceeds.

Ordering is non-negotiable.

---

**Tweet 11 (251 chars)**
Performance impact of 10 hops per token:

Cold start: ~12s
Warm request: ~2-3s
Per-token overhead: <5ms above ~45ms API latency
Bridge is <10% of total latency

Architectural overhead matters at connection time, not streaming time. Users forgive slow connects.

---

**Tweet 12 (237 chars)**
The ils-ios project logged:
- 2,620 idb_tap actions
- 2,165 simulator_screenshot captures
- 1,239 idb_describe queries

4:1 verification-to-code ratio.

iOS development with agents is not "generate and ship." It's "generate, build, tap, screenshot, find, fix."

---

**Tweet 13 (209 chars)**
github.com/krzemienski/claude-ios-streaming-bridge

Swift Package. SPM-ready. Real working code for a problem I wasted two weeks pretending was simple.

Full post:
withagents.dev/writing/day-09-ios-streaming-bridge

---

**Tweet 14 (159 chars)**
Five layers.
Ten hops per token.
Simpler than every "simpler" alternative I tried.

Day 10 tomorrow: eighteen generations of an agent builder that ran on this bridge.
