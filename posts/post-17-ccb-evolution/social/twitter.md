# X Thread — Post 17

**Tweet 1:** I woke up to a $47 bill and an infinite loop.

The script had run all night. Type error in phase 7 of 12. Retry logic had no ceiling. By 7 AM, 200+ API calls on a single phase and code that still didn't compile.

I'd built a system that failed expensively instead of failing fast.

**Tweet 2:** The three-line fix that survived every generation after:

```bash
MAX_RETRIES=3
if [ "$retry_count" -ge "$MAX_RETRIES" ]; then
    echo "Escalating to human."
    exit 1
fi
```

Bounded loops became foundational across 23,479 sessions. The $47 paid for itself the first week.

**Tweet 3:** Four generations of Claude Code Builder:

Gen 1: Bash script, 47 lines → 955 lines. 12 sequential phases.
Gen 2: Electron app, 19 Zustand stores, 329 IPC handlers.
Gen 3: Mobile specs, 8,695 lines across 4 docs.
Gen 4: CLI native. The builder became the tool.

**Tweet 4:** Gen 1 introduced the NO MOCKS principle in May 2025. Born from rage, not philosophy.

Agents kept writing tests that passed while the CLI was broken. I got tired of shipping "100% test coverage" that crashed on launch.

That instruction file (389 lines) still exists. Ten months later, I haven't changed a rule.

**Tweet 5:** Gen 2's numbers broke my brain:

19 Zustand stores
329 `ipcMain.handle()` registrations
596 IPC channel definitions
XState machines everywhere

Understanding the architecture required 4 parallel exploration agents. If understanding needs multiple agents, building will too.

**Tweet 6:** Gen 3 stopped wrapping tools and started generating specs.

Two parallel claude-opus-4-6 agents produced:
- spec-a-react-native: 2,870 lines
- spec-b-swiftui-native: 5,117 lines
- api-gateway-design: 635 lines

Systematic analysis in hours that would take a human architect weeks.

**Tweet 7:** The realization in Gen 4: stop wrapping the tool. Use it.

`hat-rotation.sh` is the ccb bash script distilled. Four phases, four `claude -p` calls, piped between phases. The 955-line bash script compressed to 75 lines of shell.

The capability absorbed the wrapper.

**Tweet 8:** `worktree-parallel.sh` at 75 lines replaced the Python worktree factory. Same pattern that powered 194 parallel agents in Post 6.

Create worktree. Spawn Claude session. Background it. Wait. Report.

The complexity migrated from application code into platform infrastructure.

**Tweet 9:** Current environment: 217 skills, 94 installed plugins, 31 hook files.

Every artifact exists because a previous builder taught me something that needed to be formalized. NO MOCKS became a PreToolUse hook. Bounded retries became `--max-turns`. Dual model routing became explicit `model` parameters.

**Tweet 10:** Ten months. Four generations. Zero rules changed.

I've only found better ways to enforce them.

The best builder isn't a bigger builder. It's a tool that has absorbed what the builder taught.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
