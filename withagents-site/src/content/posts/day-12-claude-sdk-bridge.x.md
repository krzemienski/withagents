# X thread — Day 12: Claude SDK Bridge

---

**Tweet 1 (236 chars)**
Thirty hours of debugging across four different approaches to one problem: call Claude Code from a native app.

Every polyglot Claude Code integration I've shipped broke the same four ways first.

Map of the walls so you can skip them. 👇

---

**Tweet 2 (273 chars)**
Why there is no drop-in SDK:

1. Claude Code uses OAuth, not ANTHROPIC_API_KEY
2. The CLI has CLAUDECODE=1 nesting detection that kills child processes silently
3. The Swift SDK expects RunLoop; servers run on SwiftNIO EventLoop

The CLI is the only supported auth entry point.

---

**Tweet 3 (268 chars)**
Failure 1 — direct Anthropic API from Python or JS:

`AuthenticationError: No API key provided`

Claude Code auth is OAuth, not a key. The CLI owns the token and never exposes it.

No consumer-side workaround exists. Flow through the CLI or do not ship.

**Time lost: 4 hours.**

---

**Tweet 4 (279 chars)**
Failure 2 — Swift ClaudeCodeSDK in Vapor:

`for try await` never yielded. No error. No timeout. Silence.

The SDK's FileHandle dispatches via RunLoop. Vapor runs on NIO EventLoop threads that never pump RunLoop.

Data enters one paradigm and vanishes into the gap between the two.

---

**Tweet 5 (265 chars)**
Three workarounds for Failure 2:

• Manual RunLoop pump → deadlock
• DispatchQueue.main.async → no main RunLoop on a server
• Dedicated RunLoop thread → 40% of events dropped, non-deterministic

Architectural incompatibility, not a bug. The SDK was built for UIKit.

**Time lost: 14 hours.** The silence was the hardest part.

---

**Tweet 6 (244 chars)**
Failure 3 — JavaScript SDK:

Same OAuth wall. Different language.

Should have been zero hours. Authentication is a model-level constraint, not a language-level one.

Pattern-recognition failure on my part. I should have seen it from Failure 1.

**Time lost: 2 hours.**

---

**Tweet 7 (277 chars)**
Failure 4 — direct CLI subprocess from Swift:

Works from terminal. Silent zero-byte response inside Claude Code.

The child inherited `CLAUDECODE=1` from the parent. CLI assumed recursive invocation and exited silently.

Reasonable safety design. Brutal to debug.

**Time lost: 10 hours.**

---

**Tweet 8 (259 chars)**
Failure 4 fix — three lines:

```
var env = ProcessInfo.processInfo.environment
env.removeValue(forKey: "CLAUDECODE")
for key in env.keys where key.hasPrefix("CLAUDE_CODE_") {
    env.removeValue(forKey: key)
}
```

Belt and suspenders: strip in the shell AND in Process.environment.

---

**Tweet 9 (256 chars)**
The bridge that survived:

```
async def main(config):
  async for msg in query(
    prompt=config["prompt"],
    options=config.get("options", {})):
    sys.stdout.write(json.dumps(msg) + "\n")
    sys.stdout.flush()
```

Eight lines. Handles all four failure modes.

---

**Tweet 10 (271 chars)**
The process lifecycle rule — non-negotiable:

1. Drain the pipe
2. waitUntilExit()
3. Read terminationStatus

Reverse 1 and 2 → deadlock on any >64KB stdout buffer.
Read status before exit → NSInvalidArgumentException crash.

Wrong order, intermittent failures in production only.

---

**Tweet 11 (252 chars)**
Every failure falls into one of two classes:

• Auth boundary — Attempts 1 and 3. The tool owns tokens. No consumer-side fix.
• Runtime composition — Attempts 2 and 4. Two correct runtimes compose into an incorrect system.

Failure mode in class 2 is always silence.

---

**Tweet 12 (245 chars)**
Four rules for any polyglot Claude Code integration:

1. Flow through the CLI
2. Strip CLAUDE* variables every time
3. Avoid RunLoop-dependent frameworks on the server
4. Drain pipes before waiting for exit

Do all four and the bridge works.

---

**Tweet 13 (230 chars)**
Repo: github.com/krzemienski/claude-sdk-bridge

Includes `failed-attempts/` with real code for each of the 4 failures. Each file actually produces the documented error. Clone, run, see the failure, then run the working bridge.

---

**Tweet 14 (178 chars)**
Full post:
withagents.dev/writing/day-12-claude-sdk-bridge

Four failure modes.
One bridge.
Eight lines of Python.

Day 13 tomorrow: ClaudeCodeSDK as a reusable TypeScript package.
