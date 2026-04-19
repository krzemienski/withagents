# LinkedIn — Post 15

I was copy-pasting the same 200-line prompt block into sessions. Every single time. "Scan my episodic memory. Extract insights. Group by theme. Write a blog post for each theme. Generate companion repos. Create social media cards."

Every time I started a new content batch, I'd forget a step. The companion repos sometimes had READMEs. The social cards matched the design system half the time. The other half? Off-brand garbage.

The prompt worked. I didn't.

**Prompts as Programs, Not Text**

A SKILL.md file has inputs (parsed via intake), namespace (unique name), invocation (description triggers activation), control flow (routing table), execution (numbered steps with gates), and return values (success criteria). Miss any one and the skill breaks in a specific way.

Across 23,479 sessions, I invoked skills 1,370 times. Not system prompts that load on every conversation. Programs that load on demand, scoped to a specific workflow, composable with other programs.

CLAUDE.md files load on every session, eating context whether you need it or not. Skills load only when their trigger pattern matches. That's the difference between a skill that's worth building and a rule that belongs in CLAUDE.md.

**The Description Is the Trigger Surface**

I had a deployment skill described as "helps deploy applications." Never activated because I always asked "push this to staging." Changed the description to include those exact phrases. Started activating immediately.

Your skill's description has to match how you actually talk, not how you'd formally describe the capability. The words you use when asking for help are completely different from the words you'd put in documentation.

The intake section prevents the most common failure: charging ahead with assumptions. Four words, "Wait for response," save hours of wasted context window. Without them, the agent reads your skill invocation, guesses what you want, and starts executing.

**Five Failure Patterns**

Skills I abandoned clustered around five issues. Trigger description too vague. No intake step. No routing table. Missing success criteria. Monolithic SKILL.md over 400 lines.

Sweet spot for a SKILL.md is 150-400 lines. Below 150, you don't need a skill. A CLAUDE.md rule will do. Above 400, decompose into the three-layer model: SKILL.md for routing logic, reference files for domain knowledge loaded on demand, workflow files loaded per route.

Devlog-pipeline has 8 routing options. Without routing, I'd tell Claude "run the content pipeline" and it would try to scan sessions, write posts, create repos, and generate visuals all in one pass. Context window exhausted by step 3. With routing, each invocation does one thing. Composable, predictable, debuggable.

1-2 posts per agent. 3+ exceeds context and the later posts come out thin. Not sure why quality degrades so sharply between 2 and 3. It's not just a token count issue. The agent loses focus on what makes each post distinct. Empirical observation, not theory.

1,370 skill invocations taught me one thing: the value of a skill isn't what it does. It's what it prevents. Forgotten steps. Assumed inputs. Wrong routing. Premature completion claims. Every section of a SKILL.md exists to prevent a specific failure I hit at least once before adding it.

Full post + code in the comments.
