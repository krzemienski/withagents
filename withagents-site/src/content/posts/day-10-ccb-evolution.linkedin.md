# Eighteen generations of an agent builder, and what they cost before Claude Code absorbed them

I have thirteen directories on my Mac that start with "ccb."

ccb. ccb-0612. ccb-0614. ccb-final (the name is a lie — it was not final). ccb-m0. ccb-mem0. ccbios. ccbios-enhanced. claude-code-builder. claude-code-builder-0614. claude-code-builder-agents-sdk. autonomous-claude-code-builder. ccb-ui.

Each one is a version of the same idea: a builder that takes a feature request and produces working code without me in the loop. The canonical one, claude-code-builder, has 21 stars, which is more than anything else in my GitHub account by a factor of seven.

The first version was 47 lines of bash. It ran one phase, piped the output to the next, checked an exit code. It worked once. Then it ran overnight and produced a $47 API bill and an infinite loop.

The three lines that came out of that morning are still in every orchestrator I've shipped since. Maximum three fix attempts per phase, then escalate to a human. Bounded loops. That rule came out of rage, not theory.

Lessons, one per generation, compressed:

Gen 1 (ccb): bounded retries, and the "NO MOCKS, NO TESTS, only functional validation" principle in ccb-ai-instructions.md. That file still exists, unchanged, ten months later.

Gen 2 (ccb-0612): state persistence. If a phase fails, resume from that phase, not from scratch.

Gen 3 (ccb-0614): dual model routing. Opus for reasoning, Sonnet for boilerplate. Cut project costs by 82% with three rules, no classifier.

Gen 4 (ccb-final): do not rewrite in a better language while also improving. You can only do one of those things at a time.

Gen 5 and 6 (ccb-m0, ccb-mem0): cross-session memory is its own product, not a side feature of a builder. I did not understand this at the time.

Gen 7 and 8 (ccbios, ccbios-enhanced): mobile clients are not desktop clients with a smaller screen. The /guidance command came from bus-stop corrections limited to 90 characters. That constraint produced cleaner guidance than my desktop keyboard ever has.

Gen 9 (claude-code-builder — 21 stars): the README has one line that explains what the repo learned, not what the repo does. That is why it got starred.

Gen 10 (claude-code-builder-0614): fixed a bug where --allowedTools was passed as a single string. Commit message just says "we have always been at war with eastasia." I do not remember why.

Gen 11 (claude-code-builder-agents-sdk): ported to TypeScript. Both versions still exist. Neither is the winner. The decision framework for SDK vs CLI is a whole separate post.

Gen 12 (autonomous-claude-code-builder): letting the agent pick its own phases produces work that looks thorough rather than work that ships.

Gen 13 (ccb-ui): 19 Zustand stores, 329 IPC handlers, 596 channels. I needed four parallel exploration agents to map an architecture I had built three weeks earlier. That is when I stopped building wrappers.

Gen 14–17: the compression. Claude Code itself absorbed --print, --mcp-config, --allowedTools, --max-turns, skills, hooks. The 955-line bash script from Gen 1 is now a single claude -p call.

Gen 18: no builder at all. Most of my feature work is one line. The builder has disappeared into the tool.

If I had to do it again, I would cut ccb-final, autonomous-claude-code-builder, and one of the two memory experiments. I would keep ccb-ai-instructions.md from Gen 1 unchanged, because every principle in those 389 lines has survived eighteen generations.

The best builder is the one you do not have to build.

Repo: github.com/krzemienski/claude-code-builder
Full generation-by-generation walkthrough with the bash, the Electron mess, and the compression story: https://withagents.dev/writing/day-10-ccb-evolution
