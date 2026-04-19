# X Thread — Post 4

**Tweet 1:** I wanted one thing: Claude streaming into a SwiftUI view, token by token.

Four failed architectures. A five-layer bridge with ten network hops per token. 7,985 iOS MCP tool calls. That's what it took to get tokens on an iPhone screen.

**Tweet 2:** Attempt 1 — direct API calls from Swift.

```
anthropic.AuthenticationError: No API key provided
```

Claude Code uses OAuth session tokens the CLI manages internally. There's no API key to put in your keychain.

Dead end before I wrote a parser.

**Tweet 3:** Attempt 2 — Node subprocess from Swift.

Subprocess launched. SDK authenticated. Then silence.

SwiftNIO event loops don't pump RunLoop. Two correct runtimes that become incorrect when composed. Hung on first async operation.

**Tweet 4:** Attempt 3 — Swift SDK wrapper in Vapor.

```
FileHandle.readabilityHandler needs RunLoop which NIO doesn't provide
```

Foundation's FileHandle requires RunLoop. Vapor's SwiftNIO provides EventLoop. Callbacks register, never fire.

**Tweet 5:** Attempt 4 — direct CLI invocation.

```
Error: Claude Code cannot run inside another Claude Code instance
```

The CLI checks `CLAUDECODE=1`. The parent environment poisoned the child. Silent failure, exit code 1.

**Tweet 6:** The architecture that shipped: SwiftUI → Vapor (Swift/NIO) → Python bridge → Claude CLI → Anthropic API.

Ten hops per token. Five layers. Every layer exists because removing it broke the system.

Counterintuitive lesson: more layers meant fewer failure modes.

**Tweet 7:** Bug that cost me hours: Python stdout is block-buffered by default.

```python
sys.stdout.write(line + "\n")
sys.stdout.flush()  # without this, streaming looks broken
```

No tokens for 3 seconds, then half a paragraph instantly. I almost rewrote the bridge in Go before finding this.

**Tweet 8:** The text duplication trap.

`assistant` events contain the full accumulated text. `streamEvent` deltas contain only new characters.

Same data shape. Opposite semantics. `+=` on one, `=` on the other. Get it wrong and "Hello" renders as "HHeHelHello."

**Tweet 9:** Environment variable contamination lives five layers deep.

`CLAUDE*` vars from the parent shell propagate through Vapor → Actor → Python → CLI. The CLI refuses to start.

Fix: strip `CLAUDE*` twice — in the shell AND in Process.environment. Belt and suspenders.

**Tweet 10:** Warm path per-token latency overhead: under 5ms above API latency (~45-50ms).

Cold start: 12 seconds. Python interp + SDK import + CLI auth.

Five layers of overhead, under 10% of total latency in steady state. Simpler than every "simpler" alternative I tried.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
