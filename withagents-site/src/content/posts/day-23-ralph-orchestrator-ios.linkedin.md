# Ralph, but on the phone

The overnight runs worked from the laptop. The laptop was upstairs.

I was on a train to Brooklyn at 11:40 PM, holding a six-inch phone.

The directive I needed to send the agent was three lines. Telegram was a DM with no receiver — the laptop's orchestrator was asleep, and sending words into a chat with nothing reading them is not a control plane.

---

iOS Ralph started as three problems, not one:

1. Wake the orchestrator on the laptop.
2. Get a short, disambiguated directive into the next hat's context.
3. See enough of what the fleet was doing to decide whether to intervene at all.

The iOS Streaming Bridge handled #1. The other two were mine to build on the train.

---

The phone keyboard was the hostile environment that made everything else honest.

Half of my laptop-side "protocol" had been me remembering which hat was active, which task was live, and what the last three events meant. I followed rules for the agent and vibes for myself.

The phone did not let me follow vibes. Every directive had to parse. Every hat transition had to fit in three columns of plaintext. Every intervention had to be ≤240 characters.

The things I had been doing implicitly had to become fields.

---

What came out was a command grammar small enough to thumb in:

```
hat:<builder|reviewer|fixer|verifier|writer|planner>
scope:<files|tests|docs|all>
guidance:<short string, ≤240 chars>
priority:<low|normal|high>
```

And a scan-to-decide loop for the operator:

```
14:08  builder   build.complete     src/auth/*.py (3 files)    → reviewer
14:12  reviewer  review.verdict     2 issues                    → fixer
14:17  fixer     fix.complete       src/auth/tokens.py           → reviewer
```

Three columns, time-sorted, routes-arrow at the end.

When I scan this on the phone, I am not trying to understand the fleet. I am trying to decide whether to intervene. If the arrow points somewhere surprising, I intervene. If not, I put the phone away.

That scan-to-decide loop is the actual product iOS Ralph ships. The code underneath is plumbing.

---

Three things broke that are worth naming.

**Network flap on the train killed the SSE channel mid-fix loop.** The orchestrator kept running; the phone lost visibility for 18 minutes. When the channel came back, the verifier had already passed a fix I had not seen the fixer output for. Disk was the source of truth, so nothing was actually lost — but the offline-buffer-and-reconcile UX is the part I am least sure about.

**The 240-character cap is too tight for some real directives.** "The reviewer is flagging the same issue as last cycle; skip review this iteration and route fixer → verifier directly" is 270 characters. My workaround is a `memo:` command that writes a longer note to disk and lets the next hat read it. It works. It is not elegant.

**I still do not have a good answer for consent.** If I send `guidance:high` from the phone and it races a legitimate `review.verdict` the laptop is about to commit, which one wins? Right now, last-write-wins on the event log. I have seen this lose a review once. I think it wants to be a lock on the active hat, not a race on the log.

If you have built this pattern somewhere else, I would genuinely want to hear how.

---

The middle of the 64-day Ralph arc:

Day 22 — origin (why the loop exists).
Day 23 — this one (iOS forcing function).
Day 24 — the RALPH protocol (what came out the other side).

Canonical post → https://withagents.dev/writing/day-23-ralph-orchestrator-ios

From a six-inch phone, on a train, at 11:40 PM, I was not shipping Ralph-for-iOS. I was shipping a forcing function that finally made Ralph legible to anyone but me.
