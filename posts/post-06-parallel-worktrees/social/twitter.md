# X Thread — Post 6

**Tweet 1:** Two Claude agents had been working on the same codebase for twenty minutes. Agent A refactored storage. Agent B added caching to storage.

Neither knew the other existed. I stared at the merge conflicts and stopped thinking of agents as developers.

**Tweet 2:** Started thinking of them as concurrent processes that need isolation guarantees.

Better prompts wouldn't fix this. Smarter conflict resolution wouldn't fix this. Making conflicts structurally impossible would.

The filesystem enforces what prompts can't.

**Tweet 3:** Each agent gets its own git worktree.

```bash
git worktree add ../worktrees/feature-auth -b auto/auth
```

Separate directory, separate branch, same object store. For a 500MB repo, 194 full clones would eat 97GB. 194 worktrees are a fraction of that.

**Tweet 4:** Awesome List stress test, real numbers:

Tasks ideated: 194
Specs generated: 91
Worktrees created: 71
QA first-pass rejection rate: 22%
QA second-pass approval rate: 95%
Total sessions consumed: 3,066
Merge conflicts: 0

**Tweet 5:** Five-stage pipeline. No step is optional.

Ideate → Spec → Worktree Factory → QA → Priority Merge Queue.

The spec declares `files_in_scope` up front. Two specs with overlapping scopes? Orchestrator rejects the second at task creation time. Not at merge time.

**Tweet 6:** QA agents must be separate from execution agents.

The same biases that lead an agent to write buggy code lead it to overlook the bugs in review. A fresh agent with no memory of the implementation catches what the builder rationalized away.

22% first-pass rejection. 95% approval after auto-fix.

**Tweet 7:** Specs are the bottleneck, not execution.

A precise spec passes QA first attempt. A vague spec fails, gets sent back, burns two extra sessions. That 22% rejection rate? Almost entirely traceable to specs that weren't specific enough about edge cases.

**Tweet 8:** Session `0ea2a1c3`: 21 active worktrees simultaneously, 9 PRs in sequence, roughly 180 rebase operations across the run.

Zero surfaced conflicts across those rebases.

Why? File scope declared up front. Branch A owns `src/auth/**`, Branch B owns `src/cache/**`. When A merges, B's rebase is a no-op.

**Tweet 9:** Where this breaks: tightly coupled changes.

Shared state, database migrations, API contract changes. Two agents build working code in isolation, then it fails when combined because they made incompatible assumptions about a schema.

File scope catches file conflicts. Can't catch semantic conflicts.

**Tweet 10:** 363 total worktrees across four projects. Peak of 35 simultaneous. Zero merge conflicts.

Not luck. Conflicts were structurally impossible.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
