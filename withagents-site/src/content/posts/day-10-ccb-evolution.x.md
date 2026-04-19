# X thread — Day 10 CCB Evolution (21⭐ flagship)

---

**Tweet 1/12** (280 chars)

I have 13 directories on this Mac that start with "ccb."

ccb. ccb-0612. ccb-0614. ccb-final (lie). ccb-m0. ccb-mem0. ccbios. ccbios-enhanced. claude-code-builder. claude-code-builder-0614. claude-code-builder-agents-sdk. autonomous-claude-code-builder. ccb-ui.

Eighteen generations.

🧵

---

**Tweet 2/12** (238 chars)

The canonical one — claude-code-builder — is 21 stars.

More traction than anything else in my GitHub by a factor of seven.

The first version was 47 lines of bash.

The most recent is a single claude -p call with no orchestration at all.

---

**Tweet 3/12** (252 chars)

Gen 1 ended with a $47 API bill and an infinite loop.

The three lines that came out of that morning are still in every orchestrator I have shipped since:

MAX_RETRIES=3
if retries >= MAX: escalate to human.

Bounded loops came from rage, not theory.

---

**Tweet 4/12** (271 chars)

Gen 1 also produced ccb-ai-instructions.md. 389 lines. Written in frustration after shipping tests that passed while the product was broken.

NO UNIT TESTS
NO MOCKS
Only functional validation

That file exists today, unchanged. Ten months, four generations, zero edits.

---

**Tweet 5/12** (240 chars)

Gen 2 — ccb-0612: state persistence. Resume from failed phase, not phase 1.

Gen 3 — ccb-0614: dual model routing. Opus for architecture, Sonnet for boilerplate.

Three rules, no classifier. 82% cost drop on the same benchmark.

---

**Tweet 6/12** (265 chars)

Gen 4 — ccb-final (not final): I tried to rewrite the bash in Python to get better logging.

Nine days. Lost two working features. Abandoned.

Lesson: port the interfaces, not the implementation. Do not rewrite in a "better language" while also improving. Pick one.

---

**Tweet 7/12** (238 chars)

Gen 5 and 6: ccb-m0 and ccb-mem0.

Memory experiments. Neither shipped.

Lesson: cross-session memory is its own product. You cannot bolt it on as a builder side-feature.

That lesson turned into claude-mem-architecture years later.

---

**Tweet 8/12** (276 chars)

Gen 7 and 8 — ccbios and ccbios-enhanced (the iOS versions): mobile clients are not desktop clients with a smaller screen.

The /guidance command came from the bus, constrained to 90 characters.

That constraint produced cleaner guidance than my desktop keyboard ever has.

---

**Tweet 9/12** (230 chars)

Gen 9 — claude-code-builder (21⭐): the README has one line.

"A bash script for multi-phase Claude Code builds, with bounded retries, state persistence, and dual-model routing. The $47 bill that produced max-retries is in the commit history."

---

**Tweet 10/12** (252 chars)

Gen 13 — ccb-ui: 19 Zustand stores. 329 IPC handlers. 596 channel definitions.

I had to deploy 4 parallel exploration agents just to map an architecture I had built 3 weeks earlier.

If your codebase needs multi-agent exploration to be legible, stop.

---

**Tweet 11/12** (243 chars)

Gen 14–17: the compression.

Claude Code absorbed --print, --mcp-config, --allowedTools, --max-turns, skills, hooks, MCP.

The 955-line bash script from Gen 1 collapsed into one line of CLI. The builder disappeared into the tool.

---

**Tweet 12/12** (232 chars)

Gen 18: no builder at all.

Most of my feature work is now one claude -p call.

The best builder is the one you do not have to build.

Repo: github.com/krzemienski/claude-code-builder

Full post: withagents.dev/writing/day-10-ccb-evolution

---
