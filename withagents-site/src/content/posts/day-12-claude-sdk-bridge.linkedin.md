# Four failure modes, one bridge

Thirty hours of debugging across four approaches. One bridge file that survived.

Every time I wired Claude Code into a non-terminal surface — iOS, Vapor, a Python service, Node tooling — I hit the same four walls in the same order. Each failure cost a day. The working bridge fits in eight lines of Python plus a Swift executor.

Here is the map so you can skip the walls.

---

## Why there isn't a drop-in SDK

1. Claude Code uses OAuth, not `ANTHROPIC_API_KEY`. The CLI owns the token.
2. Claude Code's `CLAUDECODE=1` nesting detection kills child processes silently.
3. The Swift SDK expects `RunLoop`. Server frameworks run on SwiftNIO `EventLoop`. They share a process and never share a thread.

The "SDK" you want is a four-layer workaround on top of the CLI, because the CLI is the only OAuth-authenticated entry point Anthropic supports.

---

## Failure 1 — direct API (4 hours)

```python
client = anthropic.Anthropic()
```

→ `AuthenticationError: No API key provided`

Claude Code auth is OAuth, not a key. There is no consumer-side workaround. Flow through the CLI or do not ship.

---

## Failure 2 — Swift SDK in Vapor (14 hours)

The `for try await` never yielded. No error. No timeout. Silence.

The Swift SDK's `FileHandle.readabilityHandler` dispatches via `RunLoop`. Vapor runs on NIO `EventLoop` threads that never pump `RunLoop`. Data entered one paradigm and disappeared into the scheduling gap between the two.

Three workarounds all failed (manual RunLoop pump, DispatchQueue.main.async, dedicated RunLoop thread). This is an architectural incompatibility, not a bug. The SDK was built for UIKit apps where RunLoop is always available. It does not document the assumption.

**The silence was the hardest part.** A clear error would have been a thirty-minute fix.

---

## Failure 3 — JavaScript SDK (2 hours)

Same OAuth wall. Different language. Should have been zero hours — authentication is a model-level constraint, not a language-level one. I should have seen the boundary from Failure 1 before writing a line of code.

Adding Node as a runtime dependency to a Swift backend adds operational overhead for zero capability gain.

---

## Failure 4 — direct CLI subprocess (10 hours)

Works from a terminal. Silent zero-byte response inside Claude Code.

`ProcessInfo.processInfo.environment` inherited `CLAUDECODE=1` from the parent. The child CLI saw it, assumed recursive invocation, and exited silently to prevent infinite loops.

Three-line fix. Ten hours to find.

```swift
var env = ProcessInfo.processInfo.environment
env.removeValue(forKey: "CLAUDECODE")
for key in env.keys where key.hasPrefix("CLAUDE_CODE_") {
    env.removeValue(forKey: key)
}
```

---

## The bridge that survived

Eight lines of Python:

```python
async def main(config):
    async for message in query(prompt=config["prompt"], options=config.get("options", {})):
        sys.stdout.write(json.dumps(message) + "\n")
        sys.stdout.flush()
```

A Swift executor that strips the environment, spawns the bridge, and reads NDJSON in this exact order:

1. Drain the pipe
2. `waitUntilExit()`
3. Read `terminationStatus`

Deviate from that ordering and you get either an `NSInvalidArgumentException` crash (read status early) or a deadlock (wait before drain on >64KB buffer).

---

## Four rules for any polyglot Claude Code integration

1. Flow through the CLI. Not around it.
2. Strip `CLAUDE*` variables. Every subprocess, every time.
3. Avoid RunLoop-dependent frameworks on the server (Combine, `FileHandle.readabilityHandler`).
4. Drain pipes before waiting for exit.

---

Repo: github.com/krzemienski/claude-sdk-bridge
License: MIT
Failed attempts included with real code in `failed-attempts/`. Each file actually produces the documented error.

Full post: https://withagents.dev/writing/day-12-claude-sdk-bridge

Four failure modes. One bridge. Eight lines of Python.
