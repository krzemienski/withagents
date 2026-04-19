# One React Native line cost me a week

```typescript
const reader = response.body.getReader();
const { value } = await reader.read(); // never resolves
```

That is the single line that forced `claude-mobile-expo` to exist as its own binary instead of shipping as a web wrapper around a tunnel.

React Native's `fetch()` does not support `ReadableStream.getReader()`. The SSE stream Claude Code uses to push agent output is exactly the case `getReader()` was designed for. The combination is a soft lock — no error, no timeout, just a promise that never resolves.

I spent five sessions convinced it was a polyfill problem. It was not. The fix is XMLHttpRequest with `onreadystatechange`:

```typescript
xhr.onreadystatechange = () => {
  if (xhr.readyState === 3) { // LOADING — partial chunks arrive here
    processResponseText(xhr.responseText);
  }
};
```

Ugly. Works. Ships against a real Claude Code CLI on every gate.

---

The reason this product exists as a real binary (and not a tunnel config like Day 44's opencode-mobile) is the mode-bet.

Claude Code on mobile is Interactive-mode: a skill library, an MCP config, a session state you want to resume across devices, a set of hooks firing on every tool call. The surface area is the product.

Punting to a web wrapper loses the parts of the product that matter most — offline skill browsing, push notifications when an agent stalls, a first-class file picker for attaching context to a session.

So the v2.0 binary ships:

- React Native frontend, Python FastAPI backend, OpenAI-compatible API for the Claude Code CLI.
- 22/22 frontend, 40/40 backend, 22/22 integration tests — against a real booted backend and a real CLI subprocess.
- Five hard gates (P1, F1, F2, I1, I2). All required.
- Flat-black theme matched to Hyper-Black + Ultraviolet so the mobile surface reads coherent with withagents.dev.

The tests are not mocks. A mock test of the SSE client would have reported green while the real device hung forever. That is the entire reason I will not ship a mock gate again.

---

The honest figure on the README is **84/99 tests (84.8%) — all gates passed.** Both halves matter:

- The 84 passing tests gate the binary. Any fail = no TestFlight.
- The 15 non-passing tests require infrastructure I have not finished wiring (multi-device push, background audio, iCloud session sync). None block normal use.

84/99 with hard gates beats 99/99 on a mock harness every time.

---

What is still gross: `readyState === 3` gives you the whole buffered body on every chunk. For a 45-minute session with tool calls, you re-tokenize a multi-megabyte string on every tick. The current fix keeps a parse offset. I have not stress-tested it against the worst real session I have on disk (the 657MB sessionforge arc).

If that breaks at scale, the answer is a TurboModule in native code. I have avoided that. I do not have a clean answer yet.

The rule: build against the real wire. Fail on the real wire. That is the whole series.

---

Canonical: https://withagents.dev/posts/day-45-claude-mobile-expo
Repo: https://github.com/krzemienski/claude-mobile-expo
