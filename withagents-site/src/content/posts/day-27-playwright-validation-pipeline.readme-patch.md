## Featured in: Day 27 of the WithAgents launch

**Playwright Validation Pipeline** is the web-specific harness that enforces the ValidationForge Iron Rule on browser UI. Every journey produces a directory of numbered evidence files; no PASS verdict fires unless every file in the inventory is non-empty and the console log is readable.

The split between this repo and `validationforge` is deliberate. VF ships the Iron Rule as hooks and skills. This pipeline is the first dedicated engine that runs against a real browser. iOS has its own harness under `ils-ios`; the API layer runs its own script library. Every surface gets a dedicated runner — the evidence format differs, the rule does not.

Full write-up on the evidence contract and the four-category failure taxonomy: https://withagents.dev/writing/day-27-playwright-validation-pipeline

Pairs with: `validationforge` (the plugin compiling the Iron Rule), `ils-ios` (the iOS equivalent harness).
