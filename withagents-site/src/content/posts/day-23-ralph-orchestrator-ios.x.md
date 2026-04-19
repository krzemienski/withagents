# X thread — day-23-ralph-orchestrator-ios

**Thread length:** 11 tweets. Char counts annotated per tweet.

---

**1/11** (229 chars)
The overnight Ralph runs worked from my laptop.

The laptop was upstairs.

I was in Brooklyn, nowhere near it, at 11:40 PM on a train.

Telegram was a DM with no receiver. The orchestrator was asleep.

That is how iOS Ralph started.

---

**2/11** (229 chars)
Three problems, not one:

1. Wake the orchestrator on the laptop.
2. Get a short, disambiguated directive into the next hat's context.
3. See enough of the fleet's state to decide whether to intervene at all.

iOS Streaming Bridge handled #1. Two and three were mine.

---

**3/11** (226 chars)
The phone keyboard was the hostile environment that made everything else honest.

Half of my laptop "protocol" had been me remembering which hat was active and what the last three events meant.

I followed rules for the agent. I followed vibes for myself.

---

**4/11** (228 chars)
The phone did not let me follow vibes.

Every directive had to parse. Every transition had to fit in three columns of plaintext. Every intervention had to be ≤240 characters.

The things I had been doing implicitly had to become fields.

---

**5/11** (163 chars)
Command grammar small enough to thumb:

hat:<builder|reviewer|fixer|verifier|writer|planner>
scope:<files|tests|docs|all>
guidance:<≤240 chars>
priority:<low|normal|high>

---

**6/11** (193 chars)
Scan-to-decide loop for the operator:

14:08  builder   build.complete     3 files   → reviewer
14:12  reviewer  review.verdict     2 issues  → fixer
14:17  fixer     fix.complete       tokens.py → reviewer

---

**7/11** (219 chars)
When I scan this on the phone, I am not trying to understand the fleet. I am trying to decide whether to intervene.

Arrow points somewhere surprising? Intervene.
Arrow points where it should? Put the phone away.

That is the product. The code is plumbing.

---

**8/11** (226 chars)
Three breakages worth naming.

1. Network flap on the train killed the SSE channel mid-fix loop. Disk was the source of truth so nothing was lost, but the offline-buffer-and-reconcile UX is the part I am least sure about.

---

**9/11** (241 chars)
2. The 240-char cap is too tight for some real directives. Workaround: a `memo:` command that writes a longer note to .ralph/agent/decisions.md for the next hat to read from disk.

It works. It is not elegant.

---

**10/11** (228 chars)
3. Consent races.

If I send guidance:high from the phone and it races a review.verdict the laptop is about to commit, which wins?

Right now: last-write-wins on the event log. I have seen this lose a review once.

Wants to be a lock on the hat, not a race on the log.

---

**11/11** (187 chars)
Day 22 was the origin.
Day 24 is the RALPH protocol that emerged from these mistakes.

https://withagents.dev/writing/day-23-ralph-orchestrator-ios

A forcing function that made Ralph legible to anyone but me.
