# Spec-Driven Development: Why YAML Beats Verbal Instructions for AI Agents

If you lead engineering teams, you already know meetings and tickets are coordination overhead, not work. The same is true for AI agents — and the fix is shorter than the meeting would have been.

For the first three months, I gave agents instructions the same way I'd talk to a junior engineer. Natural language. "Build me an API that handles user sessions." "Add a message router that queues when paused." Conversational. Contextual. Human.

It was a disaster.

Agent 3 would ask "what format does the user object use?" and Agent 5 would answer differently than Agent 1 had already built. Without a shared contract, agents coordinated through hope. Across 23,479 sessions, I can tell you: hope is not a coordination protocol.

The fix was embarrassingly obvious. Stop talking to agents. Start writing specs.

---

## Natural Language Breaks Down Fast

Here's the failure mode I hit over and over. I'd spin up three agents in parallel:

- Agent A: "Build a session manager that creates and tracks user sessions"
- Agent B: "Build a message router that sends messages to active sessions"
- Agent C: "Build a dashboard that displays session status"

Each agent produced working code. Each agent's code was internally consistent. The three codebases were completely incompatible. Agent A returns sessions as dictionaries with a `state` field. Agent B expects session objects with a `status` enum. Agent C renders a `session.is_active` boolean that neither A nor B provides.

Natural language is ambiguous. Each agent resolves ambiguity on its own. Tell a human "build a session manager" and they ask clarifying questions. Tell an agent the same thing and it makes assumptions. Three agents, three assumptions, three incompatible implementations.

The numbers back this up. 2,182 `TaskCreate` calls and 4,852 `TaskUpdate` calls across my sessions. That 2.2x ratio means every task gets updated more than twice on average. Most of those updates are corrections: "actually, I meant this format." 111 `ExitPlanMode` calls confirm planning is a distinct phase agents don't skip when forced through it.

So how do you kill the ambiguity before agents start building?

---

## YAML as Executable Contract

A YAML specification file. Not documentation. Not a README. An executable contract that defines every component, every interface, every dependency, and every acceptance criterion in machine-readable format.

Here's a real spec from the [RepoNexus](https://github.com/krzemienski/reponexus) companion repo, a task-tracker application defined in 60 lines:

```yaml
name: "task-tracker"
version: "1.0.0"
description: "A simple task tracking app"

components:
  shared-models:
    language: python
    type: library
    entry_point: "src/shared_models/__init__.py"
    build_command: "cd shared-models && pip install -e ."
    acceptance_criteria:
      - type: type-check
        description: "Type checking passes"
        command: "cd shared-models && python -m mypy src/"
      - type: contract
        description: "Model serialization round-trips"
        command: "cd shared-models && python -c 'from shared_models import Task; t = Task(title=\"test\"); assert t.to_dict()[\"title\"] == \"test\"'"

  api-service:
    language: python
    type: service
    depends_on: [shared-models]
    entry_point: "src/api_service/app.py"
    run_command: "cd api-service && python -m uvicorn api_service.app:app --port 8000"
    acceptance_criteria:
      - type: type-check
        description: "Type checking passes"
        command: "cd api-service && python -m mypy src/"
      - type: integration
        description: "API health check responds 200"
        command: "curl -sf http://localhost:8000/health"
      - type: functional
        description: "Can create and retrieve a task"
        command: "curl -sf -X POST http://localhost:8000/tasks -d '{\"title\": \"Test\"}'"

  web-frontend:
    language: typescript
    type: app
    depends_on: [api-service]
    build_command: "cd web-frontend && npm install && npm run build"
    acceptance_criteria:
      - type: type-check
        description: "TypeScript compilation succeeds"
        command: "cd web-frontend && npx tsc --noEmit"
      - type: functional
        description: "App loads without console errors"
        command: "echo 'Requires Playwright MCP validation'"
```

Every component declares its language, type, dependencies, build commands, and acceptance criteria. The agent building `api-service` doesn't need to ask the agent building `shared-models` what interface to code against. The spec says `api-service` depends on `shared-models`. The spec says `shared-models` is a Python library with a `Task` model that serializes via `to_dict()`. That's the contract. Code against it.

Here's what I learned the hard way: specs written for human readability are too vague for agents. But specs written as machine contracts? Still perfectly readable by humans. And agents can execute against them without guessing.

> **Diagram: The Spec-to-Build Pipeline** — A YAML spec is parsed and validated against a JSON Schema. The dependency graph is topologically sorted into layers. Layer 0 components (no dependencies) build in parallel, then Layer 1 (depends on Layer 0), then Layer N. After each component builds, gates evaluate in severity order: type-check, then contract, then integration, then functional. If all gates pass, ship. If gates fail, retry failed components (max 2 retries).

---

## The RepoNexus Framework

[RepoNexus](https://github.com/krzemienski/reponexus) is the framework I built to make this repeatable. Five components, each under 200 lines, each doing one thing.

**`SpecParser`** loads YAML files and validates them against a JSON Schema with `Draft7Validator`. The schema enforces structure: every component declares a `language` (python, typescript, swift, rust, go) and a `type` (library, service, cli, app, worker). Acceptance criteria are one of four types: `type-check`, `contract`, `integration`, or `functional`. If your spec is malformed, parsing fails before any agent starts building.

```python
from reponexus import SpecParser

parser = SpecParser()
spec = parser.parse_file("spec.yaml")
# Raises SpecValidationError with line-by-line messages
# if schema validation or dependency references fail
```

The parser also validates dependency references. If component `api-service` declares `depends_on: [shared-models]` but no component named `shared-models` exists in the spec, parsing fails immediately. No agent will ever start building against a phantom dependency.

**`DependencyGraph`** uses Kahn's algorithm (topological sort) to figure out build order and catch circular dependencies. But the real value is `parallel_layers()`, which groups components into layers that can build simultaneously:

```python
from reponexus import SpecParser, DependencyGraph

spec = SpecParser().parse_file("spec.yaml")
graph = DependencyGraph(spec)
layers = graph.parallel_layers()

# Layer 0: (shared-models,)        ← build first, no dependencies
# Layer 1: (api-service,)          ← depends on layer 0
# Layer 2: (web-frontend,)         ← depends on layer 1
```

In a real application with 8-12 components, layers 0 and 1 might contain 3-4 components each. Those 3-4 agents run in parallel. The sequential bottleneck is the depth of the dependency chain, not the total number of components. You're parallelizing the build across dependency layers automatically, without any explicit coordination between agents.

**`AgentScheduler`** assigns agents to components and runs them layer by layer with bounded parallelism. Failed dependencies cascade. If `shared-models` fails, `api-service` and `web-frontend` get skipped automatically with a clear error message rather than burning compute on code that can't work.

```python
scheduler = AgentScheduler(spec, max_parallel=4)
assignments = scheduler.plan_assignments()
# Returns AgentAssignment objects with component_name,
# role, language, layer_index, and dependencies

results = await scheduler.execute(my_worker_function)
print(scheduler.summary())
# {"total_components": 3, "passed": 3, "failed": 0,
#  "layer_count": 3, "total_duration_seconds": 42.7}
```

**`GateEvaluator`** runs acceptance criteria as subprocess commands and produces evidence-based reports. Each gate result includes the command output, not just a pass/fail boolean. When a `functional` gate fails, you see the curl response body or the error traceback. Not a mysterious red X.

```python
evaluator = GateEvaluator(working_dir="/path/to/project")
report = evaluator.evaluate_component(spec.components["api-service"])

print(report.summary())
# Gate Evaluation: api-service
#   Status: PASS
#   Gates: 3/3 passed
#   Duration: 4.21s
#     [PASS] [type-check] Type checking passes
#     [PASS] [integration] API health check responds 200
#     [PASS] [functional] Can create and retrieve a task
```

**`PhaseRunner`** is the GSD pipeline engine: five phases with entry checks, exit gates, and bounded retries. But I need to explain what GSD actually is first.

---

## The GSD Framework

GSD stands for Get Stuff Done. It's a five-phase state machine that wraps the multi-agent builder into a structured execution pipeline. Each phase has entry conditions, work to perform, exit gates, and (for Verify) rollback triggers.

> **Diagram: The GSD State Machine** — Five phases connected in sequence. Discover (map codebase, identify components) flows into Plan (parse spec, resolve dependencies, validate contracts). Plan flows into Execute (spawn agents, parallel build, collect results). Execute flows into Verify (type-checks, contract gates, integration gates, functional gates). Verify either advances to Ship (merge worktrees, final validation) on all-gates-pass, or loops back to Execute on gate failure (max 2 retries).

**Discover** maps the existing codebase and identifies components. For greenfield projects, this is trivial. For brownfield projects (and let's be honest, most real projects are brownfield) the Discover phase detects existing code, planning artifacts, and git state before generating anything. What already exists? What does the spec need to account for?

**Plan** parses the YAML spec, resolves the dependency graph, and validates that all contracts are consistent. This is where `SpecParser` and `DependencyGraph` do their work. The exit gate requires a valid build order. If the dependency graph has cycles, planning fails and execution never starts.

**Execute** spawns agents according to the dependency layers. Layer 0 components (no dependencies) launch immediately. Layer 1 components launch when layer 0 completes. Each agent gets the full spec as context but owns only its assigned component. Agents commit to worktree branches, each one working in isolation with zero file conflicts.

**Verify** runs every acceptance criterion for every component. The gate hierarchy matters: type-check gates run first (cheapest), then contract gates, then integration gates, then functional gates (most expensive). If type-checking fails, there's no point running functional validation. Why waste those cycles?

**Ship** merges worktree branches in dependency order and runs a final global validation pass.

The `Verify -> Execute` rollback is where GSD earns its keep. When verification fails, the framework doesn't restart from scratch. It identifies which specific components failed their acceptance criteria, spawns agents only for those components, and re-verifies. The retry loop is bounded: two retries max per phase. Three consecutive failures and the framework reports the failure rather than looping forever.

Here's how `PhaseRunner` handles that bounded retry logic:

```python
# From reponexus/phase_runner.py
for attempt in range(config.max_retries + 1):
    try:
        if config.work:
            artifacts = config.work(self._context)
            self._context.update(artifacts)

        if config.exit_gate:
            passed, gate_messages = config.exit_gate(self._context)
            if not passed:
                last_error = f"Exit gate failed: {'; '.join(gate_messages)}"
                if attempt < config.max_retries:
                    continue  # Retry — don't give up yet
                # Max retries exceeded — report failure
                return PhaseResult(
                    phase=phase, success=False,
                    duration_seconds=elapsed,
                    error=last_error, gate_results=gate_messages,
                )
```

No infinite loops. No "try again until it works." Bounded retries with evidence at every step.

---

## Why YAML Wins

I've tried every format. Markdown specs. JSON schemas. Natural language with structured headers. Plain English with numbered requirements. After running specs through thousands of agent sessions, YAML wins for three reasons.

**YAML is unambiguous about structure.** When you write "the session object has a status field that can be active, paused, or complete" in English, an agent interprets "status" as a string, an integer enum, or a boolean set. You don't know which one you'll get. In YAML:

```yaml
outputs:
  - name: session
    type: Session
    schema:
      status: enum[active, paused, complete]
```

One interpretation. The field is called `status`. It's an enum. The valid values are `active`, `paused`, and `complete`. No agent will implement this as a boolean.

**YAML specs are diffable and versionable.** When a spec changes, `git diff` shows exactly what changed. "Added `queued` to the status enum." "Changed `api-service` dependency from `shared-models` to `shared-models, auth-service`." You review spec changes in a pull request the same way you review code changes. Ever tried doing that with a meeting transcript?

**YAML specs compose across projects.** The ILS spec informed the awesome-site spec. The awesome-site spec informed the blog-series spec. Components from one spec become library references in the next. Acceptance criteria patterns get reused. The `type-check -> contract -> integration -> functional` gate hierarchy emerged from the ILS project and I've copy-pasted it into every spec since. That kind of institutional knowledge doesn't transfer through verbal instructions.

---

## The Four Gate Types

RepoNexus defines four types of acceptance criteria, ordered from cheapest to most expensive:

**Type-check gates** answer one question: does it compile? `mypy src/` for Python. `tsc --noEmit` for TypeScript. `swift build` for Swift. If your code doesn't pass static analysis, nothing else matters. These gates run in seconds.

**Contract gates** answer a different question: does the API match the spec? Serialization round-trips. Schema validation. If the spec says `Task.to_dict()` returns a dictionary with a `title` key, the contract gate verifies that claim. These catch interface mismatches before integration, which is the exact failure mode that natural language instructions produce.

**Integration gates** check wiring: do connected components talk to each other? Health checks. API calls between services. Database connection verification. These require running services, so they cost more than contract gates but catch real plumbing issues.

**Functional gates** answer the question that actually matters: does it work end-to-end? Can a user create a task through the web frontend, have it stored via the API, and see it persisted? These are the most expensive gates and the only ones users care about. Everything else is a prerequisite.

The `GateEvaluator` runs them in severity order:

```python
class GateType(Enum):
    TYPE_CHECK = "type-check"      # severity: 1
    CONTRACT = "contract"          # severity: 2
    INTEGRATION = "integration"    # severity: 3
    FUNCTIONAL = "functional"      # severity: 4
```

Higher severity means harder to pass and more expensive to run. The evaluator runs all gates and produces an `EvaluationReport` with pass/fail counts, duration, and the actual command output for failed gates. Not "gate failed." Instead: "gate failed because `curl -sf http://localhost:8000/health` returned HTTP 503 with body `{"error": "database connection refused"}`."

Evidence, not assertions.

---

## The Full Rebuild Test

Here's the ultimate validation of spec-driven development: take a production app, write the spec from scratch without looking at the existing codebase, feed it to the builder, and compare the output to the original.

I did this with the ILS iOS app. Forty-seven screens, 12 data models, 8 API integrations. I wrote the spec purely from product requirements, based on what the app should do, not how the current code does it. Fed it to the multi-agent builder.

First-pass result: 91% feature parity.

The 9% gap wasn't bugs. It was undocumented behavior. A retry dialog that pops up after exactly 3 failed attempts, but that rule lives nowhere in any product document. A loading spinner with a different animation on iPad because a designer made that call in a Figma comment. A date formatter that handles Korean locale differently because a user filed a bug six months ago and someone fixed it without updating any spec.

I honestly don't know how you'd capture all of that in advance. Some of it is institutional knowledge that lives in people's heads. Maybe there's a way to mine it out of git history, but I haven't cracked that yet.

But here's what the rebuild test does really well: it reveals everything your documentation is missing. If the behavior isn't in the spec, the rebuild won't produce it. That forces a decision. Was this behavior important enough to document, or was it accidental complexity that shouldn't be reproduced?

Every undocumented behavior I found went into the spec. The spec got more precise. The next rebuild got closer to parity. This is the compound effect: each project's spec captures lessons the previous spec missed.

---

## Specs as Coordination Protocol

The spec replaces meetings, tickets, and Slack threads. Eight agents don't need a standup. They need a schema.

The time savings come from eliminating coordination overhead, not from faster coding. Agents aren't writing code faster than I would. They're writing code without waiting for my context switches, my Slack responses, my "let me re-read this PR before I can answer your question" delays. The spec removes the need for those conversations entirely.

Here's the workflow I use now for every multi-agent build:

1. Write the YAML spec (30-60 minutes of focused human work)
2. Run `reponexus validate spec.yaml` to catch structural errors
3. Run `reponexus plan spec.yaml` to see the dependency layers
4. Feed the spec to the GSD pipeline
5. Review gate evaluation reports
6. Fix failed components and re-verify

Step 1 is the only step that requires sustained human attention. Steps 2-6 are automated. The human cost of a multi-component build collapsed from days of coordination to an hour of spec writing. That's it.

The `reponexus` CLI makes the operational loop tight:

```bash
# Validate spec structure and dependency references
reponexus validate spec.yaml

# Show build order with parallel layers
reponexus plan spec.yaml --json

# Run acceptance gates against a built project
reponexus evaluate spec.yaml --working-dir /path/to/project

# Evaluate a single component
reponexus evaluate spec.yaml --component api-service
```

---

## What I Got Wrong

I want to be upfront about what doesn't work.

**Specs can't capture taste.** The 9% gap in the rebuild test was mostly aesthetic and UX decisions. Animation timing. Color choices. The "feel" of a swipe gesture. These are human judgment calls that don't reduce to YAML fields. I stopped trying to spec them and just handle them in a manual review pass after the automated build.

**Overspecification kills velocity.** My first specs were 400+ lines for a 3-component app. Every field documented, every error case enumerated, every edge case anticipated. The agents followed the spec faithfully and produced bloated, over-engineered code. I learned to spec the contracts and acceptance criteria, not the implementation details. Tell the agent what "done" looks like, not how to get there. This was a hard lesson. I kept wanting to be thorough, and thoroughness was the enemy.

**Specs drift if you don't enforce them.** A spec is only useful if agents actually read it. In early experiments, agents would read the spec, start building, hit an obstacle, and improvise a solution that broke the contract. The fix: gate evaluation. If the spec says the health check returns 200 and the agent's code returns 204, the gate fails. The agent fixes it. The spec is the authority, not a suggestion.

---

## Practical Advice

If you're starting with spec-driven development, here's what I'd do differently knowing what I know now.

**Start with 3 components.** Not 12. Not 47. Three components with clear dependencies. `shared-models -> api-service -> web-frontend` is the canonical starter. Get the spec-parse-build-verify loop working with three components before scaling up.

**Write acceptance criteria as shell commands.** Not English descriptions. Not pseudocode. Actual commands that return exit code 0 on success and non-zero on failure. `curl -sf http://localhost:8000/health` is a better acceptance criterion than "the health endpoint should respond successfully." The first one is machine-executable. The second requires interpretation.

**Use the gate hierarchy.** Type-check gates are fast and cheap. Run them first. Don't waste time on functional validation if the code doesn't compile. The `type-check -> contract -> integration -> functional` ordering exists because I spent weeks debugging functional failures that turned out to be type errors three layers down. Weeks. I still get annoyed thinking about it.

**Version your specs in git.** Treat spec changes like code changes. Review them in pull requests. Diff them. When a build fails, `git log spec.yaml` tells you what changed and when. This sounds obvious in retrospect but I spent my first month with specs in Notion, which has no meaningful diff or version history. What was I thinking?

The [RepoNexus](https://github.com/krzemienski/reponexus) companion repo has the full framework: YAML spec parser with JSON Schema validation, dependency-aware agent scheduler with parallel layers, gate evaluator with evidence-based reports, and the GSD phase runner. Clone it, write a spec for a 3-component app, run `reponexus plan`, and watch the dependency graph resolve. Then wire up your own agent worker function and let the scheduler run it.

The spec is the product. Everything else is automation.

---

*Originally published at: https://site-rho-pied.vercel.app/posts/post-11-spec-driven-development*

*One of 18 essays in "Agentic Development: 18 Lessons from 23,479 AI Coding Sessions." Companion code: github.com/krzemienski/reponexus*
