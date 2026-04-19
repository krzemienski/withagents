# A PRD is a contract between a sentence and a session

Hand a build-agent a one-sentence idea: you get sprawl. The agent wanders, picks a framework, scaffolds six files that might matter, asks for clarification forty minutes in after it has already made three decisions it cannot unmake.

Hand the same build-agent a four-document PRD: you get a system.

`claude-code-prd-creator` is the thing between those two states.

Not a better prompt. Not a meta-agent. A pre-code-access session that turns a sentence into a structured contract the build-agent can execute against.

---

One text input. One structured interview. Four documents out:

1. **Main PRD** — executive summary, features with specs, architecture, DB schema, API contracts, acceptance criteria with measurable outcomes.
2. **AI Custom Instructions** — MCP server config, research protocols, git workflow, testing approach (production-only).
3. **Design System** — frontend stack (shadcn + Tailwind v4), dark palette, typography, ASCII wireframes for every screen.
4. **Task Breakdown** — 200+ granular tasks, dependencies, time estimates, git branch suggestions.

The split is load-bearing. A single giant PRD fails two ways: the agent skips sections and the human stops reading after section two. Four documents each with a specific audience survive both.

---

It ships **before** the code-access session, not inside it.

I tried making it an MCP tool inside a normal Claude Code session first. Worse in three specific ways:

- **Context pollution** — the first 40K tokens were spec-gathering, not build state.
- **Premature file creation** — the agent scaffolded `package.json` before I had answered whether the project even had a frontend.
- **Interview drift** — with full tool access, the agent kept offering to "just check" GitHub. Every check polluted context, none tightened the spec.

Running it as a standalone pre-session fixes all three. No write tools. One chat transcript that terminates in four markdown files. The build session starts clean, PRD loaded as read-only context.

---

Two interview questions rule the whole PRD quality:

**"What is your deployment target?"** — Docker Compose on a VPS, serverless on Vercel, and a native desktop app produce three entirely different PRDs. Wrong answer here = internally coherent, externally useless scaffolding.

**"Is there a human in the loop for any step?"** — If yes, AI Custom Instructions includes explicit human-review checkpoints. If no, explicit abort-on-doubt clauses so the agent stops rather than ships a low-confidence decision.

Every other question is downstream of those two.

---

The Task Breakdown ends up with 200+ items. Sample slice from a real run:

- `[ ] Set up PostgreSQL connection pool (asyncpg, pool_size=10, max_overflow=20)`
- `[ ] Write /api/projects POST endpoint with pydantic v2 request validation`
- `[ ] Add rate limiter middleware (100 req/min per session) before route registration`

Every task names the artifact. Every task picks the dependency (`asyncpg`, `pydantic v2`) that forces the right tool before the agent writes code.

The alternative is `[ ] Build the backend` and an agent that ships vibes.

---

What I keep getting wrong: acceptance criteria too generous.

"System handles concurrent users without performance degradation" is not a criterion. It is an aspiration.

The PRDs that lead to working builds have criteria like "/api/projects POST returns < 200ms p95 at 50 concurrent sessions on a 2-vCPU Fly machine." I have not automated the tightness check — still a human read.

The quality of the PRD is the ceiling on the quality of the build. Agents can keep contracts they can read. They cannot keep contracts that live only in a user's head.

---

Canonical: https://withagents.dev/posts/day-46-claude-code-prd-creator
Repo: https://github.com/krzemienski/claude-code-prd-creator
