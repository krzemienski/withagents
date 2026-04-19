# LinkedIn — Post 4

I wanted one thing: Claude streaming into a SwiftUI view, token by token. Four failed architectures, a five-layer bridge with ten network hops per token, and 7,985 iOS MCP tool calls later, I had something that worked. 4,241 session files on the ils-ios project. 1.5 million lines of session data. 128 `xcode_build` invocations.

Each failure taught me something I couldn't have learned from reading docs.

**Four Dead Ends**

Attempt 1: direct API calls from Swift. `anthropic.AuthenticationError: No API key provided`. Claude Code uses OAuth session tokens the CLI manages internally. There's no API key for your keychain.

Attempt 2: Node subprocess from Swift. SDK authenticated. Then silence. SwiftNIO event loops don't pump RunLoop. Two correct runtimes that become incorrect when composed.

Attempt 3: Swift SDK in Vapor. `FileHandle.readabilityHandler needs RunLoop which NIO doesn't provide`. Callbacks registered, never fired. Two Swift frameworks architecturally incompatible.

Attempt 4: direct CLI invocation. `Error: Claude Code cannot run inside another Claude Code instance`. The CLI checks `CLAUDECODE=1`. The parent environment poisoned the child. Silent failure, exit code 1. Ambient environment contamination is the worst kind of bug because no error message points at the cause.

**More Layers, Fewer Failure Modes**

The architecture that shipped: SwiftUI to Vapor to Python bridge to Claude CLI to Anthropic API. Ten hops per token. Five files, each with a single job.

Every layer exists because I tried to remove it and the system broke. Remove Python and Swift can't authenticate. Remove Vapor and the app can't maintain SSE to a subprocess. Remove the type layer and snake_case JSON from Python crashes the Swift decoder.

Counterintuitive lesson: more layers meant fewer failure modes. Each layer does exactly one translation. When a bug shows up, it lives in exactly one layer, and the layer boundaries tell you which one.

**Bugs That Hide in Streams**

Python stdout is block-buffered by default. No tokens for three seconds, then half a paragraph appearing instantly, then silence. I almost rewrote the bridge in Go before finding `sys.stdout.flush()` was missing. One line.

The text duplication trap: `assistant` events contain full accumulated text. `streamEvent` deltas contain only new characters. Same data shape, opposite semantics. `=` on one, `+=` on the other. Get it wrong and "Hello" renders as "HHeHelHello."

Environment contamination lives five layers deep. `CLAUDE*` vars from the parent shell propagate through Vapor, Actor, Python, CLI. Strip them twice: in the shell AND in `Process.environment`. Belt and suspenders.

Swift's `Process.waitUntilExit()` has a deadlock trap hiding in it. If the subprocess writes more than 64KB to stdout before you drain it, the pipe buffer fills. The process blocks waiting for the pipe to drain. Your code blocks on `waitUntilExit()` waiting for the process to finish. Drain the pipe first, then wait for exit, then read termination status. This ordering is non-negotiable. Miss either constraint and the bridge fails intermittently under load.

Warm path per-token overhead: under 5ms above the API's ~45-50ms latency. Cold start: 12 seconds. Five layers of overhead, under 10% of total latency in steady state. Simpler than every "simpler" alternative I tried.

Full post + code in the comments.
