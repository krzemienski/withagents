# X thread: Day 11 CCBios

**1/ (272 chars)**
First time CCBios built an iOS app for me, I was on the couch with the laptop closed.

Agent on the Mac.
Screenshot back on my phone.
Six minutes.
Four retries.
One working prototype.

One file has the whole story: 1,789 lines of orchestration.

Here's what it taught me. 🧵

**2/ (268 chars)**
CCBios is a scoped fork of my claude-code-builder (21⭐).

Generic CCB had a recurring failure: "build" the iOS feature, claim DONE, skip running the simulator.

3 out of 4 times what it had built wouldn't boot.

Agent said DONE.
App said `dyld: symbol not found`.

**3/ (271 chars)**
The iOS-scoped fork removes the choice.

Orchestrator can only exit when:

• `idb launch` returns the bundle ID
• `idb screenshot` produces a PNG over 40 KB

Not "the build compiled."
Not "tests pass."

A real screen, captured, on disk, over a threshold that rules out blank screens.

**4/ (246 chars)**
That is the entire trick.

The agent cannot claim completion through compilation alone because the completion gate is a screenshot byte count.

Hook it downstream of the thing it can fabricate.

Now it has to produce the thing it cannot.

**5/ (264 chars)**
After three iterations I could no longer read the debug logs.

Claude Agent SDK streams messages as nested JSON.
A 20-minute build = ~4,000 lines.

I was grep-ing for "error" to know whether to intervene.

So I wrote `sdk_message_visualizer.py`. 352 lines. Rich tree.

**6/ (253 chars)**
The visualizer made two things obvious that the logs hid:

1. Model spent 11% of tool budget on repeat reads of the same Swift file
2. Every time a build failed, next message was an Edit, not a Read

It wasn't re-reading before patching.

That's how I found the bug.

**7/ (276 chars)**
That observation became `read-before-edit.js` two weeks later in claude-prompt-stack.

The visualizer's value wasn't the pretty UI.

It was finally being able to see what the agent was doing under load.

If you can't see what it's doing, you can't tell it to stop doing that.

**8/ (280 chars)**
Mode-bet: SDK.

7-phase state machine:
1. Read Xcode project
2. Plan as task list on disk
3. Execute with scoped tool budget
4. Build after each task
5. Simulator + screenshot every 3 tasks
6. Complete only when screenshot clears threshold
7. Resume from session_state_*.json

**9/ (262 chars)**
Checkpoint resume turned this from a toy into something I actually used.

Kill the process at lunch.
Load the checkpoint at dinner.
Agent re-reads the two files it last touched.
Carries on.

That's the only way an SDK orchestrator survives a multi-hour build.

**10/ (259 chars)**
Honest caveat: ccbios-enhanced is not on GitHub.

Too specific to my simulator setup.

What travels is the lesson:

If your agent builder keeps claiming DONE on broken iOS builds, the fix isn't a better prompt.

It's a completion gate the agent cannot fabricate.

**11/ (225 chars)**
Full write-up: https://withagents.dev/writing/day-11-ccbios-enhanced

Tomorrow: the Swift SDK that made me realize the iOS bridge and the Python orchestrator should have been speaking a shared protocol the entire time.

Part of /45.

---

_Thread char counts tight (225-280). 11 tweets. Day 11 of WithAgents 45-day push._
