# X Thread — Day 46: claude-code-prd-creator

**1/10 (266)**
Hand a build-agent a one-sentence idea: sprawl.

Agent wanders. Picks a framework. Scaffolds six files that might matter. Asks for clarification 40 minutes in after 3 unmakable decisions.

Hand the same agent a four-document PRD: a buildable system.

claude-code-prd-creator sits between those states.

**2/10 (259)**
One input. One interview. Four documents out:

1. Main PRD — features + architecture + acceptance criteria
2. AI Custom Instructions — MCP config + workflow + testing
3. Design System — shadcn + Tailwind v4, ASCII wireframes per screen
4. Task Breakdown — 200+ granular tasks

The split is load-bearing.

**3/10 (260)**
A single giant PRD fails two ways:
- the agent skips sections
- the human stops reading after section two

Four documents each with a specific audience survive both. Build-agent reads AI Custom Instructions first. Human reviewer reads Main PRD. Designer reads Design System. Each is complete without the others.

**4/10 (265)**
It ships BEFORE the code-access session, not inside it.

I tried the MCP-tool-inside-Claude-Code version first. Worse in 3 ways:

- Context pollution (40K tokens of spec-gathering pushed out build state)
- Premature file creation (package.json before I said "frontend")
- Interview drift ("let me just check this repo")

**5/10 (232)**
Standalone pre-session fixes all three.

No write tools. No code access. One transcript that terminates in 4 markdown files.

Build session starts clean. PRD loaded as read-only context. First tool call is a real file write.

**6/10 (275)**
Two interview questions rule the whole PRD quality:

Q1: "What is your deployment target?"
Docker/VPS, serverless, desktop = 3 different PRDs. Wrong answer = coherent but useless scaffolding.

Q2: "Is there a human in the loop?"
Yes = explicit review checkpoints. No = explicit abort-on-doubt clauses.

**7/10 (238)**
Every other interview question is downstream of those two.

The question-generation prompt weights them first.

**8/10 (279)**
Sample Task Breakdown slice from a real run:

[ ] Set up PostgreSQL connection pool (asyncpg, pool_size=10)
[ ] Write /api/projects POST with pydantic v2 validation
[ ] Add rate limiter middleware (100 req/min) before route registration

Every task names the artifact AND picks the dependency. Agent can't ship vibes.

**9/10 (268)**
What I keep getting wrong: acceptance criteria too generous.

"Handles concurrent users without degradation" = aspiration, not criterion.

PRDs that lead to working builds have criteria like:
"POST returns < 200ms p95 at 50 concurrent sessions on 2-vCPU Fly machine."

Still a human read. Not automated yet.

**10/10 (189)**
Quality of the PRD = ceiling on quality of the build.

Agents can keep contracts they can read.
They cannot keep contracts that live only in a user's head.

Full writeup:
https://withagents.dev/posts/day-46-claude-code-prd-creator
