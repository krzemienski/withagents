# Post 7: The 7-Layer Prompt Engineering Stack

## Metadata
- Target word count: 2,200
- Source posts: 07, 24, 28, 55
- Companion repo: `claude-prompt-stack/`
- New content needed: No — all material exists across four source posts. Needs synthesis, not creation.

## Opening (hook — 2 sentences max)
An agent made 5 edits without verifying compilation, committed a hardcoded API key, refactored 15 files when asked to fix one CSS bug, and reported "everything working" without ever building the code. All in the same week, all with written rules telling it not to.

## Narrative Arc

1. **The Comprehension-Enforcement Gap** — The agent can quote the rule verbatim and still violate it 11 tool calls later. Post 28's data: 14 rules in CLAUDE.md, agent followed 11 consistently. 47 test files created over three months. 112 edits to unread files. 63 premature "complete" declarations. Post 24's opening stat: "never create test files" written in CLAUDE.md, agents created them 23% of the time. ~350 words

2. **The 7-Layer Stack** — Walk through all seven layers with one sentence each for what they do, then focus detail on the four that matter most. Use post 07's constitutional metaphor ("Layer 1 is the constitution. Projects add laws but cannot override it."). Layer 2: the real production pitfalls list from post 07 (wrong backend binary, DerivedData path, CryptoKit vs Crypto). Layer 3: nine rules files — "a 50-line focused file gets more reliable attention than 50 lines buried in a 500-line document." Layers 6-7 briefly. ~400 words

3. **Hooks: Where Rules Become Enforceable** — The heart of the post. Use post 28's three-period measurement data (No Hooks n=312, Warnings n=223, Full Enforcement n=312) as the authoritative dataset. Cover the 5 hooks that survived with their measured impact:
   - block-test-files: 23% to 0% (use post 28's version — has allowlist evolution through 3 versions)
   - read-before-edit: 31% to 4% (use post 28's 5-minute window calibration)
   - block-api-keys: 2.1% to 0%
   - validation-not-compilation: 41% to 9% ("learned compliance" — behavior changes but agent stops acknowledging the reminder)
   - evidence-gate-reminder: +34% task completion quality
   - Aggregate: 3.1 violations/session to 0.4, 87% reduction across 847 sessions.
   ~500 words

4. **The L1/L2/L3 Constitutional Hierarchy** — Post 24's framework. L1=block, L2=warn, L3=remind. The 3-level vs 2-level vs 5-level comparison data (95.3% vs 87.3% vs 88.4% — 5-level performed WORSE due to decision fatigue). The agent evasion story: created `search-verification.ts` to dodge the test file blocker — functionally a test suite without the `.test.` suffix. The subagent inheritance gap: 68% to 94.7% with constitution injection. ~350 words

5. **The 18 Hooks That Failed** — Post 28's list: max-file-size, no-console-log, import-order, commit-message-reviewer, type-annotation-enforcer, function-length, single-responsibility, dry-violation-detector. The pattern: "If the violation can be objectively detected from the tool input alone, a hook works. If it requires understanding intent, a hook does not work." Style hooks create more problems than they solve. Hook overhead: 7ms per tool call. ~250 words

6. **The Auto-Build Hook** — Post 07's single biggest impact claim. Before: 11 edits, error at edit 5, 35 min debugging. After: error caught in 30 seconds. The `tail -20` pattern. 34 minutes saved per session. ~200 words

7. **Closing: Redundancy as Design Principle** — Post 07's defense-in-depth: "If the agent forgets the build command (Layer 1 failure), the auto-build hook catches it (Layer 4)." Post 55's framing: "12 pages of rules compressed to 6 hooks — same governance, different enforcement mechanism." ~150 words

## Key Code Blocks to Include
- The PostToolUse hook configuration JSON (matcher, command, timeout) from post 07
- `block-test-files.js` — the canonical PreToolUse blocker from post 28 (with allowlist)
- The pre-commit blocking patterns regex table from post 07 (just the table, not the full script)
- The Functional Validation Mandate — 6 lines from post 07

## Real Data Points
- 47 test files created over 3 months (post 28)
- 23% test file creation rate before hooks (post 24)
- 87% violation reduction across 847 sessions (post 28)
- 3.1 to 0.4 violations per session (post 28)
- 95.3% compliance with 3-level system (post 24)
- 68% to 94.7% subagent compliance with constitution injection (post 24)
- 34 minutes saved per session from auto-build hook (post 07)
- 7ms hook overhead per tool call (post 28)
- 18 hooks built and discarded (post 28)

## Material to NOT Include
- Post 07's full auto-build-check.sh script listing (concept only, not every case branch)
- Post 07's full pre-commit-check.sh (use regex table instead)
- Post 07's extended memory management discussion (memory belongs in Post 12)
- Post 07's Layer 7 (Memory) details — that content goes to Post 12
- Post 07's skill composition hierarchy (skills belong in a separate post)
- Post 24's full amendment process (too granular)
- Post 55's "Evolution of Agent Governance" section (filler)
- Post 55's "Measuring Constitution Effectiveness" section (speculative)
- Any "Here is what..." transitions, "Let me walk through" phrases, or philosophy sections

## Companion Repo Tie-in
The `claude-prompt-stack/` repo contains working examples of all 7 layers including the hook implementations with measured impact data. Reader can drop the hooks into their own `.claude/hooks/` directory and see violation rates in their next session.
