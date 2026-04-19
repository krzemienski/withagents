# CCBios: the iPhone became a build machine before the laptop did

The first time CCBios built an iOS app for me, I was on the couch with the laptop closed. The agent was on the Mac. The screenshot came back on my phone. Six minutes. Four retries. One working prototype I could hand a TestFlight link for.

One file has the whole story: `claude-code-ios-builder-enhanced.py`, 1,789 lines of orchestration that built iOS apps by pointing an agent builder at an Xcode project until the simulator rendered the right screen.

## Why a fork?

CCBios is a scoped-down variant of my [claude-code-builder](https://github.com/krzemienski/claude-code-builder) project (21 stars, the canonical agent builder). The generic CCB had a recurring failure: it would "build" the iOS feature, claim DONE, and skip running the simulator. Three out of four times, what it had built wouldn't boot. The agent said DONE. The app said `dyld: symbol not found`.

The iOS-scoped fork removes the choice.

The orchestrator can only exit when:
1. `idb launch` returns the bundle ID.
2. `idb screenshot` produces a PNG over 40 KB.

Not "the build compiled." Not "tests pass." A real screen, captured, on disk, over the size threshold that distinguishes a blank launch screen from actual UI.

That is the entire trick. The agent cannot claim completion through compilation alone because the completion gate is a screenshot byte count.

## The visualizer nobody asked for

After three iterations, I could no longer read the debug logs. The Claude Agent SDK streams messages as nested JSON, assistant text, tool calls, tool results, interleaved. A 20-minute build produced about 4,000 lines of stringified events. I was grep-ing for the word "error" to know whether to intervene.

So I wrote `sdk_message_visualizer.py`, 352 lines. It renders the same stream as a live tree: thinking in one color, tool calls in another, results inline, active phase pinned to the top. Run the builder with `--visualizer` and it takes over the terminal.

It made two things obvious that the logs hid:
- The model was spending 11% of its tool budget on repeated reads of the same Swift file.
- Every time a build failed, the agent's next message was an `Edit`, not a `Read`. It wasn't re-reading before patching.

That second observation is what made me add `read-before-edit.js` to the hook stack in [claude-prompt-stack](https://github.com/krzemienski/claude-prompt-stack) two weeks later. The visualizer's value wasn't the pretty UI. It was finally being able to see what the agent was doing under load.

## Mode-bet: SDK

CCBios is steered by Python code, not an interactive session. The orchestrator constructs `query()` calls per phase, passes explicit tool allowlists, and reads the result stream into a state machine. Phases:

1. Read Xcode project state.
2. Plan feature work as a task list on disk.
3. Execute one task at a time with a scoped tool budget.
4. Build after each task.
5. Simulator + screenshot after every three tasks.
6. Complete only when the screenshot clears the threshold.
7. Resume from `session_state_*.json` if the process dies.

Checkpoint resume was the feature that turned this from a toy into something I actually used.

## Honest caveat

CCBios-enhanced is not on GitHub. Too specific to my simulator setup and iCloud pairings. What travels is the lesson: if your agent builder keeps claiming DONE on broken iOS builds, the fix isn't a better prompt. It's a completion gate downstream of the simulator, a PNG, an app launch, a non-empty view hierarchy. Something the agent cannot fabricate from the build output alone.

---

Part of the WithAgents launch push. Day 11 of 45. Next up: the Swift SDK that made me realize the iOS bridge and the Python orchestrator should have been speaking a shared protocol the entire time.

Full write-up: https://withagents.dev/writing/day-11-ccbios-enhanced
