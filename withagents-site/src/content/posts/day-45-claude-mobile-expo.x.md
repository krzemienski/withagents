# X Thread — Day 45: claude-mobile-expo

**1/10 (256)**
One line of React Native cost me a week:

```
const reader = response.body.getReader();
const { value } = await reader.read(); // never resolves
```

RN's fetch() does not support ReadableStream.getReader(). Claude Code's SSE stream is exactly what getReader() was designed for.

Soft lock. No error. Just silence.

**2/10 (257)**
Five sessions convinced it was a polyfill problem.

It was not.

The fix is XMLHttpRequest with onreadystatechange:

```
xhr.onreadystatechange = () => {
  if (xhr.readyState === 3) {
    processResponseText(xhr.responseText);
  }
};
```

Ugly. Ships.

**3/10 (264)**
The bug is why claude-mobile-expo is a real binary instead of a tunnel config like Day 44's opencode-mobile.

Claude Code on mobile is Interactive-mode:
- skill library
- MCP config
- session state across devices
- hooks firing on every tool call

The surface area IS the product.

**4/10 (255)**
v2.0 binary:
- RN frontend, FastAPI backend, OpenAI-compatible API for Claude Code CLI
- 22/22 frontend, 40/40 backend, 22/22 integration tests
- Against a real booted backend + real CLI subprocess
- 5 hard gates: P1, F1, F2, I1, I2

The gates are not mocks.

**5/10 (248)**
Mock test of the SSE client = green.

Real device = hangs forever.

That delta is the entire reason I will not ship a mock gate again. The bug only exists on the wire. The wire is the only honest test.

**6/10 (268)**
README figure: 84/99 tests (84.8%), all gates passed.

Both halves matter:
- 84 passing gate the binary. Any fail = no TestFlight.
- 15 non-passing need infra I haven't wired (multi-device push, background audio, iCloud session sync). None block normal use.

**7/10 (216)**
84/99 with hard gates beats 99/99 on a mock harness every time.

**8/10 (276)**
What's still gross:

readyState === 3 gives you the whole buffered body every chunk. For a 45-minute session with tool calls, you re-tokenize a multi-megabyte string on every tick.

Current fix: parse offset. Not yet stress-tested against the 657MB sessionforge arc.

**9/10 (221)**
If the offset breaks at scale, the answer is a TurboModule in native code.

I have avoided that because of cross-platform maintenance burden. I do not have a clean answer yet.

**10/10 (165)**
Rule: build against the real wire. Fail on the real wire.

That is the whole series.

Full writeup + timed fix log:
https://withagents.dev/posts/day-45-claude-mobile-expo
