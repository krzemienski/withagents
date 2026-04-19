# LinkedIn — Post 17

I woke up to a $47 bill and an infinite loop.

The script had run all night. A type error in phase 7 of 12. Retry logic had no ceiling. Claude kept attempting the same fix, each retry consuming another API call. By 7 AM, 200+ API calls on a single phase and code that still didn't compile.

I'd built a system that failed expensively instead of failing fast.

**The Three-Line Fix That Survived Everything**

```bash
MAX_RETRIES=3
if [ "$retry_count" -ge "$MAX_RETRIES" ]; then
    echo "Escalating to human."
    exit 1
fi
```

Bounded loops became foundational across 23,479 sessions. The $47 paid for itself the first week. Ten months later, across four generations of builders, I haven't changed that rule.

Generation 1 was `ccb`, a bash script that grew from 47 lines to 955. Twelve sequential phases. `ccb-ai-instructions.md` at 389 lines established rules I still follow: NO UNIT TESTS, NO TEST FRAMEWORKS, NO MOCKS, only functional validation. That instruction file was born from rage, not philosophy. Agents kept writing tests that passed while the actual CLI was broken.

**The Electron Trap and the Spec Generation Pivot**

Generation 2 was an Electron app with 19 Zustand stores, 329 `ipcMain.handle()` registrations, and 596 IPC channel definitions. Understanding the architecture required 4 parallel exploration agents just to map it. If understanding the system requires multiple agents, building on it will too.

Generation 3 stopped wrapping tools and started generating specs. Two parallel `claude-opus-4-6` agents produced 8,695 lines across 4 documents: a 2,870-line React Native spec, a 5,117-line SwiftUI spec, a 635-line API gateway design, and a channel mapping doc. Systematic analysis in hours that would take a human architect weeks.

The builder stopped being a program. It became a process: analyze, generate competing approaches, compare, select.

**The Capability Absorbed the Wrapper**

Generation 4 is the CLI itself. `hat-rotation.sh` in the companion repo is the ccb bash script distilled. Four phases, four `claude -p` calls, piped between phases. The 955-line Gen 1 script compressed to 75 lines of shell.

`worktree-parallel.sh` at 75 lines replaced the Python worktree factory. Same pattern that powered 194 parallel agents. Create worktree. Spawn Claude session. Background it. Wait. Report.

My current environment: 217 skills, 94 installed plugins, 31 hook files. Every artifact exists because a previous builder taught me something that needed to be formalized. NO MOCKS became a PreToolUse hook that blocks test file creation. Bounded retries became `--max-turns`. Dual model routing became explicit `model` parameters on Task calls.

The complexity migrated from application code into platform infrastructure. The best builder isn't a bigger builder. It's a tool that has absorbed what the builder taught.

The `ccb-ai-instructions.md` file still sits in the original repo. Written May 2025. 389 lines. Every principle I've spent 23,479 sessions validating: no mocks, no test frameworks, functional validation only, bounded retries, state persistence between phases.

Ten months. Four generations. Zero rules changed. I've only found better ways to enforce them. The $47 infinite loop taught me more than any successful build that followed.

Full post + code in the comments.
