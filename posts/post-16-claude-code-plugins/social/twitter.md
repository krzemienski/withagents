# X Thread — Post 16

**Tweet 1:** I put "NEVER create test files" in CLAUDE.md. Bold, all-caps, triple emphasis.

The agents created test files anyway.

Then I wrote a 72-line JavaScript hook that blocks Write calls to any file matching test patterns. Violation rate: zero.

That's the difference between a suggestion and a hard stop.

**Tweet 2:** Across 23,479 sessions:

Skill tool fired 1,370 times.
Read: 87,152. Bash: 82,552. Edit: 19,979.

For every skill invocation, 63 Reads and 60 Bash calls happened without skill guidance.

Skills are opt-in. Hooks are mandatory. Every tool call passes through them.

**Tweet 3:** validation-not-compilation.js fires after every Bash command. Watches for build success. Injects a reminder that "it compiled" is not "it works."

Agent ran `pnpm build`, got "Compiled successfully," started drafting completion. Hook fired. Agent spun up dev server, found a server action returning 500.

**Tweet 4:** Hook API in three calls:

```javascript
process.exit(0)           // silent allow
process.stderr.write(msg) // inject context
process.exit(2)           // block or warn
```

No registration. No manifest parsing. No framework overhead. Drop a file in `.claude/hooks/`, add an entry to settings.json.

**Tweet 5:** block-test-files.js: violation rate non-zero → zero.
read-before-edit.js: Read-to-Edit ratio went from 2:1 to 4.4:1. Didn't just warn — changed how agents sequence work.

evidence-gate-reminder.js injects a five-question checklist on TaskUpdate. Stops subagents from rubber-stamping broken features.

**Tweet 6:** The 4-layer enforcement pyramid:

Layer 1: CLAUDE.md. ~60% compliance. Agents forget.
Layer 2: Hooks. ~100% on targeted behaviors. Can't handle nuance.
Layer 3: Skills. Provide workflows. Require invocation.
Layer 4: Commands. User-driven safety net.

Each layer catches what the previous one misses.

**Tweet 7:** The hook that cried wolf is worse than no hook.

Too many warnings train the agent to ignore them all. I had an import-order hook that fired on 40% of file writes. Agent spent tokens reorganizing imports, sometimes wrong. Net negative.

Deleted it. Didn't replace it.

**Tweet 8:** State management gotcha: the `read-before-edit.js` hook tracks state in a module-level Set.

Works because Claude Code loads hooks once per session and keeps them in memory. Restart the session, the Set is empty.

Don't rely on hook state across sessions. Use the filesystem or an MCP server.

**Tweet 9:** Every 19,979 Edit call passed through read-before-edit.js. Every 82,552 Bash call triggered validation-not-compilation.js.

The agent didn't choose to comply. The enforcement layer checked automatically.

That's what a plugin system is for. Not adding features. Adding discipline.

**Tweet 10:** I thought hooks alone would be enough. I was wrong.

An agent blocked from creating test files doesn't know what to do instead. It sits there, confused.

Blocking without providing an alternative is only half the solution. Skills redirect the agent to a workflow that works.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
