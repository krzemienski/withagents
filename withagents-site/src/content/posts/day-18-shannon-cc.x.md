# X thread — day-18-shannon-cc

**Tweet 1 (272 chars)**

the Shannon ecosystem was supposed to be four surfaces.

framework, CLI, MCP, CC.

three are real. the fourth, shannon-cc, returns 404 on GitHub today.

this thread is about the absence. not a teaser. not an announcement. an honest inventory of the gap.

---

**Tweet 2 (259 chars)**

what shannon-cc was supposed to be:

a Shannon surface that runs the same enforcement stack across multiple Claude Code installs simultaneously.

plural machines. plural .claude/ dirs. shared constitution. separate sessions.

fleet runtime for team deployments.

---

**Tweet 3 (266 chars)**

in my head that's a square:

• framework (local)
• CLI (headless)
• MCP (protocol boundary)
• CC (fleet)

four corners, four deployment shapes.

today, the square has a missing corner. the honest move is to label it missing, not to ship a placeholder.

---

**Tweet 4 (240 chars)**

why it doesn't exist yet, reason 1:

no forcing event.

every Shannon repo that shipped did so because a real session pressed against a problem.

the framework shipped because 14 rules were decorative. the CLI shipped because a CI pipeline needed enforcement.

CC has no analog.

---

**Tweet 5 (249 chars)**

reason 2:

the architecture question is unresolved.

push config from a central server to every install, or pull on session start?

push needs a daemon everywhere. pull tangles with shannon-cli's explicit avoidance of session state.

neither is obviously right.

---

**Tweet 6 (245 chars)**

reason 3:

the name is borrowed.

"cross-compiled" came from a voice note. it's not the right name.

"cross-compiled" means something specific about build targets in every other software context, and that's not what this would do.

the name being wrong = the concept isn't crisp.

---

**Tweet 7 (251 chars)**

why this thread instead of a placeholder repo:

a nominal shannon-cc with a README and no code would:

• break the "real system or nothing" thesis
• dilute the Shannon org with vapor
• pre-commit to the wrong name

shipping a portfolio honestly means labeling the holes.

---

**Tweet 8 (238 chars)**

what happens next:

• three-month check-in.
• by August 2026, if no forcing event has landed, shannon-cc gets retired from the roadmap.
• if a team with a real fleet-grade Shannon need opens an issue, the first commit goes on whichever branch they need.

---

**Tweet 9 (217 chars)**

the Shannon surface map, unchanged:

• framework — Tier 1, local
• CLI — Tier 1, headless
• MCP — Tier 2, reference
• CC — n/a, pending a forcing event

github.com/krzemienski/shannon-framework/issues is where the forcing event starts.

---

**Tweet 10 (189 chars)**

full write-up:

withagents.dev/writing/day-18-shannon-cc

the repo will exist when the need does. that's the only time it should.

next: claude-mem architecture. what four surfaces would disagree about if they all existed at once.
