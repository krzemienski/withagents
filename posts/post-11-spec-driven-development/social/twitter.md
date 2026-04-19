# X Thread — Post 11

**Tweet 1:** For the first three months, I gave agents instructions the same way I'd talk to a junior engineer. Natural language. "Build me an API that handles user sessions."

It was a disaster. Without a shared contract, agents coordinated through hope.

Hope is not a coordination protocol.

**Tweet 2:** Three agents in parallel:
- Agent A: session manager returning `{state: "active"}`
- Agent B: message router expecting `session.status` enum
- Agent C: dashboard reading `session.is_active` boolean

Each internally consistent. Three incompatible implementations.

**Tweet 3:** Tell a human "build a session manager" and they ask clarifying questions. Tell an agent the same thing and it makes assumptions.

Three agents, three assumptions. The task gets updated 2.2x on average. Most updates are corrections: "actually, I meant this format."

**Tweet 4:** The fix: YAML as executable contract. Not documentation. Not a README.

```yaml
api-service:
  depends_on: [shared-models]
  acceptance_criteria:
    - type: integration
      command: curl -sf http://localhost:8000/health
```

Every component declares language, type, dependencies, commands, and acceptance criteria.

**Tweet 5:** Kahn's algorithm on the spec produces parallel build layers automatically.

Layer 0: shared-models (no dependencies)
Layer 1: api-service (depends on layer 0)
Layer 2: web-frontend (depends on layer 1)

Agents in the same layer run in parallel. Bottleneck is dependency depth, not component count.

**Tweet 6:** Four gate types, ordered cheapest to most expensive:

1. Type-check: mypy, tsc, swift build. Seconds.
2. Contract: serialization round-trips, schema validation.
3. Integration: health checks, real service calls.
4. Functional: end-to-end user flows.

No point running functional if type-check fails.

**Tweet 7:** The full rebuild test: I wrote a spec for the ILS iOS app from scratch. 47 screens, 12 models, 8 API integrations. Didn't look at the existing codebase.

First pass: 91% feature parity.

The 9% gap wasn't bugs. It was undocumented behavior.

**Tweet 8:** The rebuild reveals what your documentation is missing.

A retry dialog that pops up after exactly 3 failed attempts. A loading spinner with a different animation on iPad because a designer made that call in a Figma comment.

If it's not in the spec, the rebuild won't produce it. Forced decision.

**Tweet 9:** My first specs were 400+ lines for a 3-component app.

Agents followed the spec faithfully and produced bloated, over-engineered code. Overspecification killed velocity.

Spec the contracts and acceptance criteria, not the implementation. Tell the agent what "done" looks like, not how to get there.

**Tweet 10:** Human cost of a multi-component build: collapsed from days of coordination to an hour of spec writing.

Eight agents don't need a standup. They need a schema.

The spec is the product. Everything else is automation.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
