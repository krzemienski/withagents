# Newsletter Blurb — Post 14

**Subject:** I submitted a YAML file and got 6 working API endpoints 47 minutes later

Hey —

I had been running parallel AI agents for months, but every session started the same way: me reading requirements, manually decomposing them into tasks, assigning file ownership, kicking things off. That 20-30 minute preamble happened every single time. Across 894 sessions, the cognitive overhead was enormous.

So I built a pipeline called ralph-specum where the specification itself manages the agents. You write a YAML file describing your API — paths, auth, request bodies, validations, error cases — and a 5-stage pipeline does the rest.

In this week's Agentic Development post, I cover:

- The spec format that captures everything an agent needs to implement an endpoint correctly
- The 5-stage pipeline: RequirementElaborator, DesignGenerator, TaskFactory, AgentRouter, Validator
- How acceptance tests are mechanically derived from the spec (not hand-written)
- The 47-minute session that produced 6 endpoints, auth middleware, and 100% test pass rate with zero human intervention

The most interesting part is the RequirementElaborator. Terse specs are ambiguous — "workspace_id must exist in workspaces table" is underspecified. Does that check happen before or after auth? What's the error if auth fails but the workspace also doesn't exist? The elaborator makes these decisions explicit before any implementation happens, which prevents the most downstream failures.

The validator is what closes the loop. It auto-generates test cases from the spec, runs them against the implementation, and if anything fails, sends remediation tasks back through the pipeline. No human in the loop deciding whether the output is correct. The spec defines correctness.

Full post: [link to blog post]

Pipeline code, spec format, and example outputs:
github.com/krzemienski/spec-driven-implementation

— Nick
