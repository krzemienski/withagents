# LinkedIn — Post 2

A single AI agent reviewed my iOS streaming code and said "looks correct." Three agents found a P2 bug on line 926 that'd been hiding for three days. One character: `message.text += textBlock.text` where it should have been `=`. Every streamed message was doubling itself. "Hello" rendered as "HHeHelHello" in under a second of streaming.

**Three Roles, Not Three Copies**

Same prompt three times gives you three copies of the same blind spot. That doesn't work. Each agent gets a different review mandate targeting different failure domains.

Alpha does line-by-line logic. Found the `+=` because the API docs say each block is cumulative. Bravo thinks about runtime. Found the stream-end handler resetting the index to zero, replaying every message. Lead does architecture. Noticed both SDK and CLI paths shared the same flaw.

Three reasoning paths, same conclusion. None would've been enough alone. The second root cause was subtler: the stream-end handler reset `lastProcessedMessageIndex` to zero on the next event. Combined with `+=`, messages grew exponentially. A five-sentence response turned into an unreadable wall of duplicated text. Three days sitting in the codebase.

Alpha's 47 patterns now cover streaming semantics, off-by-one errors, async race conditions. Each one is a scar from a real incident. When a bug gets caught, I extract the detection heuristic and encode it as six lines in the agent's prompt. After 200 gates, the prompts compound.

**The Frankenstein Merge**

Solo review's other failure mode isn't subtle. Two agents worked on the same backend service. Agent A built JWT verification internals. Agent B built the REST endpoint layer. Neither knew the other existed.

The merge compiled clean. TypeScript passed. Linter passed. The application served raw JWT signature validation state as a public REST endpoint. Unauthenticated. A security vulnerability that passed every static check because each agent's contribution was individually correct.

File ownership maps with glob patterns fixed it. `auth-agent` owns `src/auth/*`. `api-agent` owns `src/routes/*`. Two agents literally cannot edit the same file. The filesystem enforces what prompts can't.

**The Asymmetry That Makes It Work**

Unanimous voting. Any agent raises a concern, the gate blocks. Cost: $0.15 per gate, about $0.60 for a four-phase pipeline. False positive rate runs around 8%.

False positive cost: five minutes of re-review. False negative cost: three days of corrupted messages and trust you can't buy back. Every design choice leans toward the first failure mode.

One iOS audit session ran 75 TaskCreate operations across a 10-gate consensus pipeline. Alpha ran 18 cURL tests while Bravo captured 23 screenshots and Lead cross-checked SDK and CLI paths. All parallel. Wall-clock time equals the slowest agent.

Ralplan extended this to planning. A Supabase auth migration came back from the Planner with 14 clean tasks. The Architect vetoed 7. Supabase Row Level Security policies use `auth.uid()`, not custom JWT claims. The tasks would've compiled, would've passed type checks, would've silently leaked user data at runtime. Three rounds of adversarial review cost under $2. Shipping a silent auth bypass cost whatever a data breach costs.

Full post + code in the comments.
