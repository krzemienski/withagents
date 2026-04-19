# Ralph Orchestrator, origin: 64 days, 336 megabytes, 926 files — and a question I did not want to answer

January 21, 2026. I opened an empty directory called ralph-orchestrator and wrote one file: README.md, nine words long.

"Why can agents plan but not finish what they planned?"

Two months and six days later, on March 26, the repo had 926 files, 336 megabytes of session JSONL, and an agent that had just completed 28 of 30 tasks in seven hours of overnight execution while I slept.

The answer to the question was not a better agent. The answer was a filesystem.

A clarification up front: Ralph Orchestrator under my GitHub account is my code. There is an external project with a similar name, and earlier inventories confused the two. This is the correction. Everything below comes out of that 64-day arc I can cite by session file.

Every agent framework I'd tried by January had the same shape. Read-eval-print loop with a system prompt, maybe a reflection step, sometimes a tool loop. The agent would produce a perfectly reasonable plan ("Step 1, Step 2, Step 3") and then three hours later, deep in Step 1, forget Step 3 existed.

The industry answer to this problem is bigger context. Stronger model. More memory. I had already watched that answer fail on my own data: hat-scoped sessions (40K of focused context) hit 94% task completion with a 2% contradiction rate; monolithic sessions (150K of accumulated context) hit 67% with 34%.

That 27-point gap is not a prompt problem. It is an architectural problem. The agent is not forgetting because it is lazy. It is forgetting because it has no persistence layer that is not the context window.

My first wrong answer was a long-lived agent with a serialized state object. The agent would receive the plan, acknowledge it, and then re-describe it in its own words — at which point the plan became whatever the agent had just said. Killed on day 9.

My second wrong answer was a shared dict as a blackboard. Race conditions. Silent state corruption. I fixed it with a lock, realized the lock meant I was using the dict as a file, and accepted that if the dict was going to behave like a file, it should just be a file.

Day 14 I admitted the answer I did not want: agents cannot share memory. They can share files. The filesystem is the only coordination protocol that scales past two agents.

"The solution is a filesystem" is the kind of line that makes other engineers roll their eyes. It is not clever. It is not novel. It is what UNIX processes have been doing since 1971. And it was right.

The stop hook fixed what the state model could not. An agent, left to its own judgment, stops when it believes the work is done — not when the work is done. The hook reads .ralph/tasks/*.json, counts unfinished records, and refuses to let the agent terminate while any remain. Across the 926-file training set it fired an average of 30 times per session on runs that eventually converged.

The agent did not decide when to stop. The task list did.

The 1:47 AM moment — the overnight run that completed 28 of 30 tasks — is the story everyone remembers. What is easy to miss: it worked because by day 42, every piece of state the agent needed lived on disk. The /guidance Telegram message was six words of routing. The actual intelligence was in the files.

The six-word guidance ("Wrap the existing code, don't replace it") saved an estimated ninety minutes of dead-end work. I could not automate that correction. A Critic agent can flag "this plan has issues," but the specific fix required me to recognize a failure shape I had watched before. The loop works because the guidance primitive comes from someone who has already seen this mode fail.

What I would cut if I were doing this again:

Skip the first two wrong answers. I could not have skipped them in practice, but if you are starting Ralph today, go directly to the filesystem.

The convergence_threshold should be a function of task type, not a global integer. I have not solved this.

The event format is too minimal. A Fixer hat often needs to know why the Reviewer flagged an issue, not just that it did.

Repo: github.com/krzemienski/ralph-orchestrator
Full origin post with the stop-hook code, the 1:47 AM event log, and the 27-point completion-rate data: https://withagents.dev/writing/day-22-ralph-orchestrator-origin
