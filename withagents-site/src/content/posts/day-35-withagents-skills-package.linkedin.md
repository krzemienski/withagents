# withagents-skills: ten skills that survived 1,293 invocations

1,293.

That is how many times agents called Skill across the 360-day session mine. Smaller than the heavy tools (Read at 88,560, Bash at 75,658, Grep at 22,463) but every Skill call is an agent choosing not to write a new prompt. An agent choosing to load a protocol I already wrote.

Every skill call is a contract.

Today I am shipping ten of those protocols as a single package: withagents-skills.

Not every skill in my .claude/skills/ directory — I have 217 of those. The ten that earned their slot across the last 90 days of shipping real products. The ones that fired enough times, got me out of enough holes, and proved stable enough across projects that I would paste them into a stranger's workflow without apology.

What a skill actually is, in case the term is getting fuzzy: a skill is a name the agent can invoke, a trigger description that tells the agent when to load it, a protocol body in markdown that tells the agent exactly what to do, and a set of guardrails that limit what "done" can mean.

A skill is not a prompt. A prompt is a one-shot instruction. A skill is a contract the agent re-loads whenever the trigger fires. Prompts drift. Files do not.

The ten in the package:

functional-validation — the Iron Rule compiled as a skill. Enforces real-system-or-nothing. Blocks mock creation. Requires evidence.

create-validation-plan — generates a journey-scoped validation plan with PASS criteria, evidence requirements, and an abort path.

preflight — runs environment checks that catch 80% of failures before they happen.

verdict-writer — reads every evidence file in a directory and emits PASS/FAIL with specific citations. Refuses PASS on empty evidence.

devlog-publisher — mines session JSONL across projects, groups by date/topic/metrics, produces publishable devlog drafts. Self-referential: the skill that helped write the series you are reading.

ck-plan — structured planning skill. Decomposes features into phases with context links, related files, implementation steps, success criteria, risks.

visual-explainer — generates a visual HTML explanation (ASCII + Mermaid + diagrams) for a topic, plan review, or diff.

deepen-prompt-plan — stress-tests a plan before execution. Probes for missing dependencies, ambiguous criteria, unhandled failure modes.

ai-dev-operating-system — the OS-level skill. Coordinates which other skills are active, which hooks are registered, which MCP servers are attached.

skill-creator — the meta-skill. Creates new skills with correct YAML, trigger descriptions, and protocol structure.

The cull was harsher than I wanted it to be. I started with 40 candidates and cut thirty.

Criteria, in order:

1. Fires more than 30 times in the last 90 days. If a skill isn't triggering, it isn't earning its slot. Novelty does not count.

2. Non-trivial body. A skill that is a three-line reminder isn't a skill, it's a comment. If I could replace it with a CLAUDE.md bullet, I did.

3. Crosses multiple projects. The ten all fire across at least three distinct project directories.

4. No overlap. If two skills do similar work, only the more mature ships.

5. Documented failure modes. Every skill in the package has a section that says "this skill does not do X, Y, Z."

Install: claude plugin install withagents-skills

Days 36-40 will cover one skill per week, in order, each one a surgical single-skill deep-dive.

Repo: github.com/krzemienski/withagents-skills
Full launch post with selection criteria and design rules: https://withagents.dev/writing/day-35-withagents-skills-package
