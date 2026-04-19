# README patch — shannon-framework (not shannon-cc)

`shannon-cc` does not exist as a repository. This patch lives on the **shannon-framework** README as a footer section so that anyone searching the Shannon org for "shannon-cc" lands on a clear explanation rather than a 404.

Add to the bottom of `shannon-framework/README.md` under a new `## Shannon surface map` heading.

---

## Shannon surface map

| Surface | Status | Repo | What it runs |
|---|---|---|---|
| shannon-framework | Tier 1 | [krzemienski/shannon-framework](https://github.com/krzemienski/shannon-framework) | Inside Claude Code sessions |
| shannon-cli | Tier 1 | [krzemienski/shannon-cli](https://github.com/krzemienski/shannon-cli) | Headless, CI, cron |
| shannon-mcp | Tier 2 (reference) | [krzemienski/shannon-mcp](https://github.com/krzemienski/shannon-mcp) | Protocol boundary — last push 2025-11-14, architecture fights the protocol, see Day 17 post |
| shannon-cc | Not applicable | — | Fleet runtime. Repo does not exist. Pending a forcing event. |

### shannon-cc

Covered in [Shannon-CC: the repo that is not there yet](https://withagents.dev/writing/day-18-shannon-cc) (WithAgents, Day 18).

Short version: a fleet runtime for teams running Shannon across many Claude Code installs is in the concept space but has no live demand signal, no settled architecture, and no right name. Rather than ship a placeholder, this corner of the surface map is explicitly marked missing.

If your team has a real fleet-grade Shannon need, open an issue here with the label `shannon-cc-fleet`. That issue will be treated as the forcing event and will start the design work.

Three-month check-in: by August 2026, if no forcing event has landed, shannon-cc gets retired from the roadmap and the surface map drops to three tiers permanently.
