# The five-layer streaming bridge

I wanted one thing: Claude streaming into a SwiftUI view, token by token.

Four failed architectures, a five-layer bridge with ten network hops per token, and 7,985 iOS MCP tool calls later, I had something that actually worked.

Here is what broke, why, and why the "complicated" solution turned out to be the only simple one.

---

## Four architectures that failed

**Direct API from Swift.** Auth error. Claude Code uses an OAuth session token, not `ANTHROPIC_API_KEY`. There is no way to extract the token for third-party SDK consumption. Dead end at the auth boundary.

**Node subprocess + JS SDK.** Process launched, authenticated, then hung silently. SwiftNIO and Node's event loop are independent scheduling systems. Neither yielded to the other. Two correct runtimes, incorrect composition.

**Swift ClaudeCodeSDK in Vapor.** `FileHandle.readabilityHandler` needs a `RunLoop` that SwiftNIO never creates. Callbacks register, never fire. Two Swift frameworks, architecturally incompatible.

**Direct CLI invocation.** "Claude Code cannot run inside another Claude Code instance." The child process inherited `CLAUDECODE=1` from the parent. Ambient environment contamination.

Each failure lived at a different boundary: authentication, event loop, concurrency model, environment.

---

## The architecture that survived

Five layers. Ten hops per token.

1. **SSEClient.swift** — transport, heartbeat watchdog, reconnection
2. **ClaudeExecutorService.swift** — actor, GCD stdout reader, env sanitization
3. **StreamingTypes.swift** — `StreamMessage` enum, accumulated vs incremental
4. **sdk-wrapper.py** — Claude Agent SDK async iteration, NDJSON emission, **flush control**
5. **ChatViewModel.swift** — `@Observable`, high-water mark, text dedup

Every layer exists because I tried to remove it and the system broke. More layers meant fewer failure modes. Each layer does exactly one translation. When a bug shows up, it lives in exactly one layer, and the layer boundaries tell you which one.

---

## The bugs that hide in streams

**Block-buffered stdout.** Python held NDJSON events in a 4KB buffer. Users saw three-second pauses followed by bursts. The fix was `sys.stdout.flush()` after every line. One missing function call, hours of debugging.

**Text duplication.** `assistant` events contain **accumulated** text. `streamEvent` deltas contain **incremental** text. Same JSON shape, opposite semantics. Use `=` for one and `+=` for the other. Mixing them doubles every message.

**Environment contamination.** Five layers deep, the parent's `CLAUDECODE=1` still poisoned the innermost child. The fix was belt-and-suspenders: strip `CLAUDE*` variables in both the shell command AND `Process.environment`. Miss either and the bridge fails silently on the last hop.

---

## The process lifecycle trap

Read pipe, wait for exit, read termination status. In that order.

Read `process.terminationStatus` before the process has actually exited → `NSInvalidArgumentException`, runtime crash.

Call `waitUntilExit()` before draining a pipe buffer >64KB → deadlock. Neither side can proceed.

Drain first. Wait second. Read status third. The ordering is non-negotiable.

---

## Performance

| Metric | Value |
|--------|-------|
| Cold start | ~12s |
| Warm request | ~2-3s |
| Per-token overhead | <5ms |
| API token latency | ~45-50ms |
| Bridge overhead | <10% |

Architectural overhead matters at connection time, not at streaming time. Users tolerate a slow initial connection if the subsequent streaming feels instantaneous.

---

## What 7,985 simulator interactions taught me

The ils-ios project accumulated 2,620 `idb_tap` actions, 2,165 `simulator_screenshot` captures, 1,239 `idb_describe` calls, 479 gestures. The ratio of verification actions to code-writing actions is roughly 4:1.

iOS development with AI agents is not "generate code and ship." It is "generate code, build, launch, screenshot, tap, screenshot, find the bug in the screenshot, fix, build again." The simulator is the second screen.

---

## Seven rules for any SSE bridge

1. Flush stdout explicitly.
2. Distinguish accumulated from incremental at the type level.
3. Strip inherited environment variables. Belt and suspenders.
4. Drain pipes before waiting for exit.
5. Use two-tier timeouts (no-output vs total duration).
6. Cancel SSE connections on iOS backgrounding.
7. Use `OSAllocatedUnfairLock` on hot paths; skip actor hops.

---

Repo: github.com/krzemienski/claude-ios-streaming-bridge (Swift Package, SPM-ready)
Full post: https://withagents.dev/writing/day-09-ios-streaming-bridge

Five layers. Ten hops per token. Simpler than every "simpler" alternative I tried.
