# X thread: Day 13 ClaudeCodeSDK

**1/ (260 chars)**
Two backends, one protocol surface, a platform decision that removed iOS from the package.

Boring version: the Process API doesn't exist in the iOS sandbox, so a Swift SDK that spawns the Claude CLI can't work there.

Honest version: I spent 4 weeks pretending it could. 🧵

**2/ (266 chars)**
ClaudeCodeSDK is the Swift SDK I use to drive Claude Code from macOS apps.

245 KB of Swift.
Swift 6.0+.
macOS 13+ only.

One client. One runSinglePrompt call. Typed result.

Under the hood, one of two backends is doing the work.

github.com/krzemienski/ClaudeCodeSDK

**3/ (273 chars)**
Dual-backend architecture:

Backend 1. Headless: spawn the `claude` CLI as a subprocess, stream-json output, parse back to typed Swift.

Backend 2. Agent SDK: spawn a Node bridge that imports @anthropic-ai/claude-agent-sdk, wire the event stream over stdio back to Swift.

**4/ (277 chars)**
The auto-detection fight I lost three times:

v1: looked for a binary on PATH, assumed the rest. Broke when users had half-installs.

v2: same thing, just more `if` statements.

v3: one-shot `--version` probe per backend on first construction, cached. Slow cold start. Reliable after.

**5/ (268 chars)**
v2.0.0 dropped iOS from Package.swift.

iOS apps run in a sandbox. The sandbox does not allow spawning external processes.

Process is available at the source level, throws at runtime.

You can link against it.
You can construct it.
You cannot launch it.

**6/ (279 chars)**
A Swift SDK that wraps the Claude Code CLI cannot work on iOS, because there is no CLI to wrap.

The right architecture for iOS is claude-ios-streaming-bridge. Mac runs the CLI, iPhone talks to it over SSE.

Different machine. Different runtime. Same protocol surface on the client.

**7/ (240 chars)**
The mistake was letting Package.swift advertise iOS support when the runtime behavior was:

"everything crashes the first time you call runSinglePrompt."

Correcting the manifest was honesty, not regression.

If it can't launch, don't declare it a platform.

**8/ (253 chars)**
Three things this SDK gets right that most CLI-wrappers miss:

• Typed error surface with retry hint field (shouldRetry, retryAfter)
• Token bucket rate limiter built in (not bolted on)
• AbortController support that actually drains the subprocess

**9/ (249 chars)**
The token bucket story:

I blew past the Anthropic rate limit exactly once on a script that spawned 30 parallel prompts.

That's where the built-in rate limiter came from.

Don't bolt on rate-limiting after the incident. Ship it in the client from day one.

**10/ (272 chars)**
Honest limitation: this SDK is Swift.

Electron app? Use the Node.js Agent SDK.
Python tool? Use the Python SDK.

The dual-backend architecture answers a macOS-specific constraint.

The cross-language lesson is smaller than the code:
pick one client API, allow multiple backends.

**11/ (224 chars)**
Full post: https://withagents.dev/writing/day-13-claude-code-sdk

Part of WithAgents launch. Day 13 of 45.

Tomorrow: the seven-layer prompt stack that explains why one SDK layer is never enough in production.

---

_11 tweets. 224-279 chars each. Day 13 of WithAgents 45-day push._
