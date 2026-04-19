# X Thread — Post 15

**Tweet 1:** I was copy-pasting the same 200-line prompt block into sessions. Every single time.

The prompt worked. I didn't.

The fix isn't writing a better prompt. It's treating prompts as programs, not disposable text.

**Tweet 2:** Across 23,479 sessions, I invoked skills 1,370 times.

Not system prompts that load on every conversation. Programs that load on demand, scoped to a workflow, composable with other programs.

A SKILL.md file is a prompt program with inputs, control flow, and return values.

**Tweet 3:** Every skill has six structural elements:

- Inputs (parsed via intake)
- Namespace (unique name)
- Invocation (description triggers activation)
- Control flow (routing table)
- Execution (numbered steps with gates)
- Return value (success criteria)

Miss any one and the skill breaks in a specific way.

**Tweet 4:** The description isn't documentation. It's the trigger surface.

I had a deployment skill described as "helps deploy applications." Never activated because I always asked "push this to staging."

Changed the description to include those exact phrases. Started activating immediately.

**Tweet 5:** The intake section prevents the most common failure: charging ahead with assumptions.

```
1. Receive brain dump
2. Mine sessions  
3. Expand outline
4. Revise draft

Wait for response before proceeding.
```

Four words — "Wait for response" — save hours of wasted context window.

**Tweet 6:** Devlog-pipeline has 8 routing options: full, scan, write, repo, visuals, social, publish, expand.

Without routing, I'd say "run the pipeline" and it would try to scan, write, create repos, and generate visuals in one pass. Context window exhausted by step 3.

With routing, each invocation does one thing.

**Tweet 7:** 1-2 posts per agent. 3+ exceeds context and the later posts come out thin.

Not sure why quality degrades so sharply between 2 and 3. Not just a token count issue. The agent loses focus on what makes each post distinct.

Empirical observation, not theory.

**Tweet 8:** Five failure patterns across skills I abandoned:

1. Trigger description too vague
2. No intake step
3. No routing table
4. Missing success criteria
5. Monolithic SKILL.md over 400 lines

Sweet spot: 150-400 lines. Below 150, a CLAUDE.md rule will do. Above 400, decompose.

**Tweet 9:** My first blog-writing skill produced posts that compiled but had no frontmatter, no word count check, and LLM filler phrases throughout.

Added success criteria: "1,500-2,500 words. Frontmatter complete. No filler. All code from real sessions."

Fixed the output in one iteration.

**Tweet 10:** 1,370 skill invocations taught me one thing: the value of a skill isn't what it does. It's what it prevents.

Forgotten steps. Assumed inputs. Wrong routing. Premature completion claims.

Every section of a SKILL.md exists to prevent a specific failure I hit at least once.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
