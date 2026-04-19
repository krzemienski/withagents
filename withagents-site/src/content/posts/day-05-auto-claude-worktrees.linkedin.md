# 194 parallel agents, zero merge conflicts

Two agents worked on the same codebase for twenty minutes. Agent A refactored the storage module. Agent B added caching to the storage module. Neither knew the other existed.

The merge diff was a disaster.

That was the moment I stopped thinking about AI agents as "faster developers" and started thinking about them as concurrent processes that need isolation guarantees. Better prompts would not fix this. Smarter conflict resolution would not fix this. Making conflicts structurally impossible would fix this.

---

## The mechanism

Every agent task gets a spec. Every spec declares exactly which files that agent is allowed to touch, in glob form: `src/auth/**`, `categories/ai-tools/**`, `README.md`. The orchestrator validates those scopes at task creation. If two specs overlap, the second one is rejected before any agent starts working.

Then every spec lands in its own git worktree. Same repository, different physical working directory, different branch, shared object store.

```
git worktree add ../worktrees/feature-auth -b auto/auth-oauth
```

Eight agents can now run in eight worktrees. Each one sees only its spec, its branch, its scoped files. It cannot modify anything outside. The filesystem enforces the isolation that prompts alone cannot guarantee.

---

## The five-stage pipeline

1. **Ideate** — an Opus agent reads the full codebase and proposes tasks. Over-generate on purpose. 194 task descriptions cost less than executing one.
2. **Spec** — each task becomes objective + files_in_scope + steps + acceptance criteria + risks. The bottleneck is here, not in execution. Vague specs fail QA.
3. **Worktree factory** — eight parallel workers, each running a Claude agent in its own scoped directory.
4. **QA** — a separate agent reviews. Never the builder. Fresh eyes catch what the writer rationalizes away. 22% first-pass rejection. 95% second-pass approval after targeted remediation.
5. **Merge queue** — topological sort by dependency, priority weighting, dry-run conflict check before every real merge.

---

## The stress test

One pipeline run across the Awesome List project:

- 194 tasks ideated
- 91 specs generated
- 71 worktrees provisioned
- 71 QA reports produced
- 90 git branches created
- 3,066 sessions consumed
- 470 MB of conversation data
- Zero merge conflicts

Session `0ea2a1c3` pushed it further: 21 active worktrees, 9 PRs merged in sequence, roughly 180 rebase operations triggered as each merge rippled through the open branches. Every one of those rebases applied cleanly.

Why? Because every branch had already declared which files it owned. A rebase onto a freshly merged main is a no-op for any branch whose scope did not touch the merged files. Scope declarations turn the ripple rebase from a minefield into a formality.

---

## Where worktrees are the wrong answer

I want to be honest about the limits.

- **Tight coupling**: two agents can build internally consistent code in isolation that breaks at the boundary. Ownership catches file-level conflicts. It does not catch semantic conflicts like a shared DB schema change. I still don't have a great answer for that.
- **Small changes**: if you are editing fewer than three files, a single branch is simpler and faster.
- **Forced parallelism**: if two tasks share more than two files, they should be one task in one worktree.
- **Natural boundaries**: the pattern works because each list category, each iOS subsystem, each service layer had clear domain separation. Force the parallelism onto a monolithic module and the ownership matrix becomes fiction.

---

## The counterintuitive numbers

Across 23,479 total sessions, 18,945 were agent-spawned. Every one of those needed filesystem isolation. The team coordination layer fired 128 TeamCreate calls, 1,720 SendMessage calls, 2,182 TaskCreate calls.

Declaring scope and running the five-stage pipeline costs less than resolving a single merge conflict in a 194-branch system. One unresolved conflict cascades through every subsequent merge. Prevention costs minutes. Resolution costs hours.

---

## Running it

```
pip install auto-claude-worktrees
auto-claude full --repo ./my-project --workers 8
```

Start with 3 worktrees. Scale to 8. Then 20. The guarantees hold at any count because the filesystem is doing the work.

Not because I got lucky. Because conflicts were structurally impossible.

Repo: github.com/krzemienski/auto-claude-worktrees
Full post: https://withagents.dev/writing/day-05-auto-claude-worktrees
