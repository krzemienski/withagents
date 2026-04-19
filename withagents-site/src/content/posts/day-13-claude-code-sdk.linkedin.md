# ClaudeCodeSDK: the Swift wrapper that forced me to pick a backend

Two backends, one protocol surface, a platform decision that removed iOS from the package.

The boring version: the `Process` API doesn't exist in the iOS sandbox, so a Swift SDK that spawns the Claude CLI as a subprocess physically cannot work there.

The honest version: I spent four weeks pretending it could before I gave up.

## What it is

[ClaudeCodeSDK](https://github.com/krzemienski/ClaudeCodeSDK) is the Swift SDK I use to drive Claude Code from macOS apps. 245 KB of Swift. Swift 6.0+. macOS 13+ only.

One client. One `runSinglePrompt` call. A typed result. Under the hood, either of two backends is doing the work.

```swift
import ClaudeCodeSDK

let client = ClaudeCodeClient(debug: true)

let result = try await client.runSinglePrompt(
    prompt: "Write a function to calculate Fibonacci numbers",
    outputFormat: .text,
    options: nil
)
```

## Dual-backend architecture

**Backend 1: Headless mode.** Spawn `claude` (the CLI) as a subprocess, stream stream-json output, parse back into typed Swift. Reliable, ships today, needs `npm install -g @anthropic/claude-code`.

**Backend 2: Agent SDK mode.** Spawn a Node.js bridge that imports `@anthropic-ai/claude-agent-sdk`, wire the SDK's event stream over stdio back to Swift. More expressive (tool permissions, memory, session resumption), needs `npm install -g @anthropic-ai/claude-agent-sdk`.

Auto-detection prefers the Agent SDK backend when available. You can force a backend.

That auto-detection was a fight I lost three times before I got it right. The first two versions looked for a binary on PATH and assumed the rest. Users had both installed in half-broken states, and I was selecting the backend that couldn't actually execute. The shipped version runs a one-shot `--version` probe for each backend on first client construction and caches the result. Slow on cold start. Reliable after.

## Why iOS was removed

v2.0.0 dropped iOS from `Package.swift`. macOS 13+ only.

iOS apps run in a sandbox that does not allow spawning external processes. `Process` is available at the source level but throws at runtime. You can link against it, you can construct it, you cannot launch it.

A Swift SDK that wraps the Claude Code CLI cannot work on iOS, because there is no CLI to wrap.

The right architecture for iOS is not "port the subprocess SDK", it's [claude-ios-streaming-bridge](https://github.com/krzemienski/claude-ios-streaming-bridge), where the Mac runs the CLI and the iPhone talks to it over SSE. Different machine, different runtime, same protocol surface. The mistake was letting the original `Package.swift` advertise iOS support when the runtime behavior was "everything crashes the first time you call `runSinglePrompt`."

## What the SDK gets right

Three things most CLI-wrapping SDKs miss:

1. **Typed error surface.** Every failure path has a named error case with a retry hint. Transient faults get `shouldRetry: true`. Rate limits get `retryAfter`. Auth failures get `shouldRetry: false`. No error-string parsing required.

2. **Token bucket rate limiter** built into the client. Built-in, not bolted on. I blew past the Anthropic rate limit exactly once on a parallel-spawn script, that's where this came from.

3. **AbortController support.** Cancelling a long query is a structured operation. The bridge drains the stream, cleans up the subprocess, surfaces tokens consumed so far.

## Honest limitation

This SDK is Swift. If you're building an Electron app or a Python tool, use the Node.js Agent SDK or the Python SDK directly. The dual-backend architecture answers a macOS-specific constraint.

The cross-language lesson is smaller than the code: pick one client API, allow more than one backend, auto-detect, let the caller override.

---

Part of the WithAgents launch. Day 13 of 45. Tomorrow: the seven-layer prompt stack that explains why one SDK layer is never enough.

Full post: https://withagents.dev/writing/day-13-claude-code-sdk
