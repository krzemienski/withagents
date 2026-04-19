# X thread — Day 05: Auto-Claude Worktrees

---

**Tweet 1 (238 chars)**
Two AI agents worked on the same codebase for 20 minutes.

Agent A refactored the storage module.
Agent B added caching to the storage module.
Neither knew the other existed.

The merge diff was a disaster.

Here's what finally worked. 👇

---

**Tweet 2 (275 chars)**
The fix wasn't a better prompt.

The fix was declaring file scope in the spec, before any agent starts working.

Every task gets a `files_in_scope` list. Two specs overlap? The orchestrator rejects the second one at task creation, not at merge time.

Prevention beats resolution.

---

**Tweet 3 (241 chars)**
Then every spec lands in its own git worktree.

```
git worktree add ../worktrees/feature-auth \
  -b auto/auth-oauth
```

Same repo. Different working directory. Different branch. Shared object store.

Two agents literally cannot edit the same file at the same time.

---

**Tweet 4 (264 chars)**
Five-stage pipeline:

1. Ideate — Opus agent proposes tasks
2. Spec — each task gets files_in_scope + acceptance criteria
3. Factory — 8 worktrees running in parallel
4. QA — a SEPARATE agent reviews. Never the builder.
5. Merge — topological sort, dependency-ordered.

---

**Tweet 5 (273 chars)**
One stress test. Awesome List project.

194 tasks ideated
91 specs generated
71 worktrees provisioned
90 git branches
3,066 sessions consumed
470 MB of conversation data
22% first-pass QA rejection
95% second-pass approval

Zero merge conflicts.

---

**Tweet 6 (276 chars)**
The QA rule that matters: QA agents must be separate from execution agents.

Same biases that lead an agent to write buggy code lead it to overlook those bugs in review.

A fresh agent with no memory of the implementation decisions catches what the builder rationalizes away.

---

**Tweet 7 (262 chars)**
Session 0ea2a1c3 pushed this further: 21 active worktrees, 9 PRs merged sequentially.

Each merge triggered ~20 rebases across still-open branches. Roughly 180 rebase operations total.

Every one applied cleanly.

Because no branch had ever touched another branch's files.

---

**Tweet 8 (281 chars)**
Where worktrees are the WRONG answer:

• Small changes (<3 files) — a single branch is simpler
• Tightly coupled work — shared schemas can fail semantically even with clean file ownership
• Forced parallelism — if two tasks share >2 files, they should be one task

I still don't have a clean answer for the semantic case.

---

**Tweet 9 (243 chars)**
The counterintuitive part:

Writing specs + declaring scopes + running the 5-stage pipeline costs LESS than resolving one merge conflict in a 194-branch system.

One unresolved conflict cascades through every subsequent merge.

Prevention: minutes.
Resolution: hours.

---

**Tweet 10 (232 chars)**
`pip install auto-claude-worktrees`

Start with 3 worktrees to understand the pattern. Scale to 8. Then 20. The guarantees hold at any count because the filesystem is doing the work.

Full post + log excerpts:
withagents.dev/writing/day-05-auto-claude-worktrees

---

**Tweet 11 (192 chars)**
363 total worktrees across four projects.
Peak of 35 simultaneous.
9 PRs merged in a single session.
Zero merge conflicts.

Not because I got lucky. Because conflicts were structurally impossible.
