# X thread — Day 35 withagents-skills Package Launch

---

**Tweet 1/11** (262 chars)

1,293.

That is how many times agents called Skill across the 360-day session mine.

Smaller than Read (88,560) or Bash (75,658) — but every Skill call is an agent choosing not to write a new prompt. An agent choosing to load a protocol I already wrote.

Every call is a contract. 🧵

---

**Tweet 2/11** (267 chars)

I'm shipping 10 of those protocols as a single package today.

withagents-skills.

Not every skill in my .claude/skills/ — I have 217 of those. The ten that earned their slot across 90 days of shipping real products.

The cull was harsh. I started with 40. I cut thirty.

---

**Tweet 3/11** (279 chars)

A skill is not a prompt.

A prompt is a one-shot instruction.

A skill is a contract the agent re-loads whenever the trigger fires. It's a name + a trigger description + a protocol body + guardrails.

Prompts drift session-to-session. Files on disk do not. That's why skills scale.

---

**Tweet 4/11** (275 chars)

The ten:

1. functional-validation
2. create-validation-plan
3. preflight
4. verdict-writer
5. devlog-publisher
6. ck-plan
7. visual-explainer
8. deepen-prompt-plan
9. ai-dev-operating-system
10. skill-creator

Every one has a session-JSONL history I can point at.

---

**Tweet 5/11** (249 chars)

Cut criteria, in order:

1. Fires >30 times in the last 90 days
2. Non-trivial body (if a CLAUDE.md bullet could replace it, it wasn't a skill)
3. Crosses multiple projects (≥3 directories)
4. No overlap with other skills
5. Documented failure modes

---

**Tweet 6/11** (267 chars)

What got cut:

Three drafts of a "code-reviewer" skill that kept rubber-stamping its own builder. Ralph's Reviewer hat already does this better.

A "git-helper" skill that was just aliases. Belongs in .zshrc, not .claude/skills/.

A "mcp-debugger" that only fired in one project.

---

**Tweet 7/11** (240 chars)

Design rules I keep repeating when writing a new skill:

Trigger description owns the outcome. Half your authoring time belongs there.

Body should be short enough to load, long enough to close the loop. My skills average ~80 lines.

Document what it does NOT do.

---

**Tweet 8/11** (264 chars)

Mode-bet: Interactive.

Skills are the canonical Interactive-mode product. You invest upfront in the protocol. The agent loads it every session thereafter and behaves differently than an agent without it.

Trade-off: a determined agent can route around a trigger. Rarely happens.

---

**Tweet 9/11** (263 chars)

The one I find myself using most is devlog-publisher.

It is the skill that mined its own history to produce the devlog post that inspired the skill.

A tool that can ingest the record of its own use and produce something publishable from it feels like the right kind of weird.

---

**Tweet 10/11** (260 chars)

Limitation I want to admit: devlog-publisher only works on projects where the session JSONL has been preserved.

If your agent runs are ephemeral — containerized, torn down on completion — the skill has nothing to operate on. The skill is downstream of a discipline: keep logs.

---

**Tweet 11/11** (257 chars)

Install: claude plugin install withagents-skills

Days 36-40 cover one skill per week, in order.

Repo: github.com/krzemienski/withagents-skills

Full launch post with full 10-skill detail and selection criteria: withagents.dev/writing/day-35-withagents-skills-package
