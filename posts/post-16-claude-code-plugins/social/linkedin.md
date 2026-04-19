# LinkedIn — Post 16

I put "NEVER create test files" in CLAUDE.md. Bold formatting. Triple emphasis. All-caps warnings. The agents created test files anyway.

Then I wrote a 72-line JavaScript hook that blocks Write calls to any file matching test patterns. Violation rate: zero.

That's the difference between a suggestion and a hard stop.

**Skills Are Opt-In. Hooks Are Mandatory.**

Across 23,479 sessions, the Skill tool fired 1,370 times. Read fired 87,152 times. Bash fired 82,552. Edit fired 19,979. For every skill invocation, 63 Read calls and 60 Bash calls happened without any skill guidance.

Every Edit call passed through my PreToolUse hooks. Every Bash call triggered my PostToolUse hooks. The agent doesn't choose to comply. The enforcement layer checks automatically, on every tool call.

`validation-not-compilation.js` fires after every Bash command. Watches for build success. Injects a reminder that "it compiled" is not "it works." Agent ran `pnpm build`, got "Compiled successfully," started drafting a completion message. Hook fired. Agent spun up the dev server and found a server action returning 500. Build green. Feature broken. Hook caught it 20 minutes before it would've surfaced in production.

**The Whole API in Three Calls**

```javascript
process.exit(0)           // silent allow
process.stderr.write(msg) // inject context
process.exit(2)           // block or warn
```

No registration. No manifest parsing. No framework overhead. Drop a file in `.claude/hooks/`, add an entry to `settings.json`.

`block-test-files.js` drove violation rate from non-zero to zero. `read-before-edit.js` shifted the Read-to-Edit ratio from 2:1 to 4.4:1. It didn't just warn. It changed how agents sequence their work.

`evidence-gate-reminder.js` fires on TaskUpdate when a subagent marks something complete. Injects a five-question checklist before the orchestrator can rubber-stamp the claim. Stops subagents from marking features done after a clean build while the feature is broken.

**The 4-Layer Enforcement Pyramid**

Layer 1 CLAUDE.md: ~60% compliance. Agents forget. Layer 2 hooks: near 100% on targeted behaviors. Can't handle nuance. Layer 3 skills: provide structured workflows. Require invocation. Layer 4 commands: user-driven safety net. Combined: 95%+.

The hook that cried wolf is worse than no hook. Too many warnings train the agent to ignore them all. I had an `import-order` hook that fired on 40% of file writes. Agent spent tokens reorganizing imports, and the reorganized imports were sometimes wrong. Net negative. Deleted it.

I thought hooks alone would be enough when I first built this. I was wrong. An agent blocked from creating test files doesn't know what to do instead. It sits there, confused. The skill layer exists because blocking bad behavior without providing an alternative is only half the solution.

Every 19,979 Edit call passed through `read-before-edit.js`. Every 82,552 Bash call triggered `validation-not-compilation.js`. Every single call, without me watching, without the agent choosing to comply.

A state management gotcha worth knowing: `read-before-edit.js` tracks state in a module-level Set. Works because Claude Code loads hooks once per session and keeps them in memory. Restart the session, the Set is empty. Don't rely on hook state across sessions. Use the filesystem or an MCP server.

That's what a plugin system is for. Not adding features. Adding discipline.

Full post + code in the comments.
