# Post 2: "Multi-Agent Consensus: Making AI Agents Agree"

## Metadata
- Target word count: 2,500
- Source posts: old 02, 43, 60
- Companion repo: `multi-agent-consensus/`
- New content needed: No -- post 02 has the best narrative material in the entire series; posts 43 and 60 add the team coordination and planning angles.

## Opening (hook -- 2 sentences max)
A single AI agent reviewed my streaming code and said "looks correct." Three agents found a P2 bug on line 926.

## Narrative Arc

1. **The bug story** -- From post 02. The bug: `message.text += textBlock.text` vs `message.text = textBlock.text`. One character. `+=` appended to already-accumulated content. The second root cause: stream-end handler reset `lastProcessedMessageIndex` to zero, replaying the entire buffer. The bug had been in the codebase for three days. A single agent reviewed it and missed it. ~400 words

2. **Why one agent is not enough** -- The epistemic argument from post 02: "When the same entity writes code and reviews it, the review has no epistemic value." From post 43: the Frankenstein merge story -- two agents edit the same file, the app served raw JWT verification internals as a REST endpoint. These failures drove the consensus model. ~300 words

3. **Three roles, not three copies** -- From post 02: Lead (architecture + consistency), Alpha (code + logic), Bravo (systems + functional verification). These are not three copies of the same prompt. They target different failure detection domains. From post 02: the `+= vs = PRINCIPLE` embedded in Alpha's system prompt as institutional knowledge -- encoding specific bug patterns as permanent review instructions. ~400 words

4. **The consensus gate framework** -- From post 02: Pydantic ConsensusGate model with ThreadPoolExecutor for parallel evaluation. Unanimous voting -- not majority. The YAML gate configuration. Show the core gate model (simplified). ~300 words

5. **Scaling consensus to planning** -- From post 60: RALPLAN's three-agent planning consensus (Planner, Architect, Critic). The war story: Planner decomposed auth migration into 14 tasks, Architect vetoed because Supabase RLS was incompatible with custom JWT tokens -- 7 of 14 tasks were invalid. 3.2x fewer implementation surprises across 89 projects. The Critic as deliberately adversarial: challenges every assumption. Maximum 5 rounds of iteration. ~400 words

6. **Scaling consensus to teams** -- From post 43: file ownership via glob patterns as the coordination primitive. 23 feature sprints with zero merge conflicts, zero edit races, 2.3x speedup. The lead agent as conflict resolver. "Humans notice when they're about to edit someone else's code. Agents don't. They need programmatic enforcement." ~300 words

7. **Cost and limits** -- From post 02: $0.15 per gate, $1.50 per project for 10 gates. From post 60: convergence protocol prevents infinite deliberation (max 5 rounds). When consensus adds overhead without value: tasks too small for disagreement, tasks too novel for any agent to have useful signal. ~200 words

## Key Code Blocks to Include
- The ConsensusGate Pydantic model with ThreadPoolExecutor (simplified, from post 02)
- The YAML gate configuration example (from post 02)
- The Alpha system prompt excerpt showing embedded `+= vs =` principle (from post 02)
- The file ownership glob pattern dictionary (from post 43) -- 5 lines max

## Real Data Points
- `+=` vs `=` bug: one character, three days in the codebase, P2 severity
- $0.15 per consensus gate, $1.50 per project for 10 gates
- Frankenstein merge: app served JWT internals as REST endpoint (from post 43)
- 23 feature sprints, zero merge conflicts, 2.3x speedup (from post 43)
- 3.2x fewer implementation surprises across 89 projects (from post 60)
- Supabase RLS incompatibility: 7 of 14 tasks invalidated by Architect review (from post 60)
- Max 5 rounds of consensus iteration (from post 60)

## Material to NOT Include
- The Click CLI interface details from post 02 (implementation detail)
- Companion repo pip install patterns (generic)
- The extended three-agent role comparison that repeats the bug from multiple angles (post 02)
- The git worktrees-for-team-isolation details from post 43 -- covered in Post 6
- The task claiming protocol from post 43 -- too granular for this post
- The deliberation modes (short vs deliberate) from post 60 -- too detailed
- The "Science of Group Decision Making" padding from post 60
- The TeamCoordinator full class from post 43 -- show the ownership concept, not the implementation

## Companion Repo Tie-in
The `multi-agent-consensus/` repo implements the three-agent unanimous gate voting system in Python. Readers can run `consensus-gate evaluate --files changed_files.txt` to see the three-agent review process on their own code.
