# LinkedIn — Post 6

Two Claude agents had been working on the same codebase for twenty minutes. Agent A refactored the storage module. Agent B added caching to the storage module. Neither knew the other existed.

I stared at the merge conflicts and stopped thinking of agents as developers. Started thinking of them as concurrent processes that need isolation guarantees.

**Conflicts as a Structural Impossibility**

Better prompts wouldn't fix this. Smarter conflict resolution wouldn't fix this. Making conflicts structurally impossible would.

Each agent gets its own git worktree. Separate directory, separate branch, same object store. For a 500MB repo, 194 full clones would eat 97GB. 194 worktrees are a fraction of that.

Each spec declares `files_in_scope` up front. Two specs with overlapping scopes? The orchestrator rejects the second at task creation time, not at merge time. Prevention, not resolution. The filesystem enforces what prompts can't.

**The Five-Stage Pipeline**

Ideate to Spec to Worktree Factory to QA to Priority Merge Queue. No step is optional.

Awesome List stress test: 194 tasks ideated, 91 specs generated, 71 worktrees executed. 3,066 sessions consumed. QA first-pass rejection rate: 22%. After auto-fix: 95% approval. Merge conflicts across 90 branches: zero.

QA agents must be separate from execution agents. The same biases that lead an agent to write buggy code lead it to overlook those bugs in review. A fresh agent with no memory of the implementation catches what the builder rationalized away.

Specs are the bottleneck, not execution. A precise spec passes QA first attempt. A vague spec fails, gets sent back, burns two extra sessions. That 22% rejection rate? Almost entirely traceable to specs that weren't specific enough about edge cases.

**The Ripple Rebase That Didn't Happen**

Session `0ea2a1c3` pushed this to its limit. 21 active worktrees simultaneously, 9 PRs merged in sequence, roughly 180 rebase operations across the run. Any one could've surfaced a conflict that didn't exist when the branch was created.

Zero surfaced conflicts across those 180 rebases. Not because I got lucky. Because file scope was declared up front. Branch A owns `src/auth/**`. Branch B owns `src/cache/**`. When A merges and B rebases, the rebase is a no-op. The scope boundaries guarantee non-overlapping changes.

Where this breaks: tightly coupled changes. Shared state, database migrations, API contracts. Two agents build working code in isolation, then it fails combined because they made incompatible assumptions about a schema. File scope catches file conflicts. It can't catch semantic ones. I still don't have a great answer for that.

The merge queue uses topological sort with priority weighting. Foundation tasks first. Dry-run conflict check with `git merge --no-commit --no-ff` detects conflicts without applying changes. Small focused tasks before broad refactors. When conflicts pop up, the task re-enters the execution pipeline with updated main as its base. More expensive than a clean merge. Way cheaper than a human resolving a three-way diff between two agents' competing visions.

363 total worktrees across four projects. Peak of 35 simultaneous. Zero merge conflicts.

Full post + code in the comments.
