# Shannon-CC: the repo that is not there yet

The Shannon ecosystem was supposed to be four surfaces.

The first three are real:

- **shannon-framework** — v5.6.0, pushed 2026-03-10. Inside Claude Code sessions.
- **shannon-cli** — pushed 2026-03-25. Headless, CI-safe.
- **shannon-mcp** — pushed 2025-11-14 (Tier-2 reference, yesterday's post).

The fourth is supposed to be shannon-cc.

Today, `gh repo view krzemienski/shannon-cc` returns 404.

This post is about the absence. Not an announcement. Not a teaser. An honest inventory of the gap.

---

**What it was supposed to be**

A Shannon surface that runs the same enforcement stack across multiple Claude Code installs simultaneously.

Plural machines. Plural `.claude/` directories. Plural sessions sharing a constitution but not session state.

Fleet runtime for team deployments: one central Shannon config that rolls out to every engineer's install, with drift detection and enforcement audit trails across the fleet.

In my head, that is a square: framework (local) + CLI (headless) + MCP (protocol boundary) + CC (fleet).

Today the square has a missing corner.

---

**Why it does not exist yet**

Three reasons, none of them good.

1. **No forcing event.** Every Shannon repo that shipped did so because a real session pressed against a problem. The framework shipped because 14 rules were decorative. The CLI shipped because a CI pipeline needed enforcement outside the harness. Shannon-CC has no equivalent. Demand signal is zero.

2. **Architecture question unresolved.** Push config from a central server to each install, or pull from a central config on session start? Push needs a daemon on every install. Pull tangles with the CLI's explicit avoidance of session state. I have not done the design work.

3. **The name is borrowed.** "Cross-compiled" came from a voice note. It is not the right name. The name being wrong is a sign the concept is not crisp enough to ship.

---

**Why this post instead of a placeholder**

The alternative would be publishing a nominal shannon-cc repo with a README and no code. That would do three kinds of damage:

- Break the "real system or nothing" thesis on the surface the thesis is supposed to protect.
- Dilute the Shannon org with a placeholder.
- Pre-commit to the wrong name.

Shipping a portfolio honestly means labeling the holes.

---

**What happens next**

Three-month check-in.

- If by August 2026 no forcing event has landed, shannon-cc gets retired from the roadmap. The surface map drops to three tiers permanently.
- If a forcing event lands, the first commit goes on whichever architecture branch the first user actually needs. Push vs pull decided by the use case, not a design doc.

If your team has a real fleet-grade Shannon need, open an issue on shannon-framework labeled `shannon-cc-fleet`. I will take that as the forcing event.

---

**The Shannon surface map, unchanged**

- shannon-framework — Tier 1, local
- shannon-cli — Tier 1, headless
- shannon-mcp — Tier 2, reference
- shannon-cc — not applicable, pending a forcing event

The repo will exist when the need does.

---

Full write-up: https://withagents.dev/writing/day-18-shannon-cc
Open a forcing-event issue: github.com/krzemienski/shannon-framework/issues
