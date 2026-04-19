# LinkedIn — Post 11

For the first three months, I gave agents instructions the same way I'd talk to a junior engineer. Natural language. "Build me an API that handles user sessions." Conversational. Contextual. Human.

It was a disaster.

**Hope Is Not a Coordination Protocol**

Three agents in parallel: Agent A built a session manager returning `{state: "active"}`. Agent B built a message router expecting `session.status` enum. Agent C built a dashboard reading `session.is_active` boolean. Each agent's code was internally consistent. The three codebases were completely incompatible.

Natural language is ambiguous. Each agent resolves ambiguity on its own. Tell a human "build a session manager" and they ask clarifying questions. Tell an agent the same thing and it makes assumptions. Three agents, three assumptions, three incompatible implementations.

Every `TaskUpdate` gets updated 2.2x on average. Most of those updates are corrections: "actually, I meant this format."

**YAML as Executable Contract**

Not documentation. Not a README. An executable contract that defines every component, every interface, every dependency, and every acceptance criterion in machine-readable format.

Every component declares language, type, dependencies, build commands, and acceptance criteria. The agent building `api-service` doesn't ask the agent building `shared-models` what interface to code against. The spec says it. Code against it.

Kahn's algorithm on the spec produces parallel build layers automatically. Layer 0 has no dependencies. Layer 1 depends on Layer 0. Agents in the same layer run in parallel. The bottleneck is dependency depth, not component count.

Four gate types ordered cheapest to most expensive: type-check, contract, integration, functional. No point running functional validation if the code doesn't compile. The ordering exists because I spent weeks debugging functional failures that turned out to be type errors three layers down.

**The Full Rebuild Test**

I wrote a YAML spec for the ILS iOS app from scratch. Forty-seven screens, 12 data models, 8 API integrations. Didn't look at the existing codebase. Fed it to the multi-agent builder.

First-pass result: 91% feature parity.

The 9% gap wasn't bugs. It was undocumented behavior. A retry dialog that pops up after exactly 3 failed attempts. A loading spinner with a different animation on iPad because a designer made that call in a Figma comment. A date formatter that handles Korean locale differently because a user filed a bug six months ago and someone fixed it without updating any spec.

If it's not in the spec, the rebuild won't produce it. That forces a decision. Was this behavior important enough to document, or was it accidental complexity?

My first specs were 400+ lines for a 3-component app. Agents followed them faithfully and produced bloated, over-engineered code. Overspecification kills velocity. Spec the contracts and acceptance criteria, not the implementation details. Tell the agent what "done" looks like, not how to get there.

Eight agents don't need a standup. They need a schema. Human cost of a multi-component build collapsed from days of coordination to an hour of spec writing. The spec is the product. Everything else is automation.

Full post + code in the comments.
