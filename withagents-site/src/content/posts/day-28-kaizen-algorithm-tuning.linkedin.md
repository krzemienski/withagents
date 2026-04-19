# Five Whys on a failed agent run, and the PDCA loop that followed

The YouTube Shorts detector regressed overnight and I spent two hours theorizing about why.

No prints, no traces, no frame dumps. Just reading `motion_analyzer.py` top to bottom and arguing with myself about which branch produced the wrong boundary.

By the time I gave up and added a five-line TRACE_APPEND instrumentation, the fix took ten minutes. The root cause was three functions away from the one I had been staring at.

That session is the reason `kaizen-algorithm-tuning` exists.

## The repo

Four Kaizen primitives, installed as Claude Code skills, pointed at the threshold-tuning problem that kept eating my week:

1. **Five Whys.** Name the symptom, then ask why five times. Each answer has to be a measurable claim, not a theory. The fifth why is the change you make.

2. **Fishbone analysis.** Six categories — input data, preprocessing, model, postprocessing, environment, review. You cannot touch code until every bucket has at least one populated candidate cause.

3. **PDCA (Plan → Do → Check → Act).** Every experiment writes a hypothesis before the change, runs the change, reads the result, and decides whether the change stays. The Check phase is a file, not a vibe.

4. **A3 one-pager.** Problem, target state, root cause, countermeasures, results, follow-up. The artifact you hand to the next session when the current one times out.

None of this is new. Kaizen is a 1980s Toyota manufacturing discipline. The move here is binding it to the way Claude Code agents already want to behave: checklist-driven, file-first, step-numbered. The skills do not teach the discipline — they make it the path of least resistance.

## The one-change rule

Before the repo existed, a regression would trigger three parallel edits. Lower the threshold here, add a guard there, tighten a filter somewhere else. The regression would go away and I would not know which edit fixed it. Six days later the same regression because two of the three "fixes" were band-aids over each other.

After the repo, the PDCA skill enforces one edit per cycle. Run the regression suite. Write the hypothesis. Make one change. Run the suite again. The Check file captures the diff in behavior. The Act decision — keep, revert, escalate — is a field the skill will not let you leave blank.

Two failed PDCA cycles on the same hypothesis stops the loop. The skill will not let you retry the same theory a third time.

That is the whole methodology. No ML. No classifier. A contract that says *one hypothesis, one change, one measurement.*

## Where the discipline pays off

The first regression is always solved by whoever was paying attention. The second, three weeks later, is where the A3 matters — someone (usually me) picks up a `failed-approaches.md` file from the first round and reads what did not work before touching code.

The skill bundle ships with a pre-populated template. Five headings: approach, evidence it failed, why it failed (with a link to the data), what would have made it work, what to try next. The skill refuses to let you add an entry without filling every heading.

## Why this sits in the methodology cluster

Kaizen is upstream of validation.

Playwright Validation Pipeline tells you *the button does not render*. Agent Constitution Framework tells you *here is the rule the agent must not break*. ValidationForge tells you *the build passed but the feature did not*. Kaizen tells you *here is the discipline for investigating why.*

Same idea in four registers: make the shortcut physically unavailable. Validation theater survives because an agent can skip the frame inspection and go straight to threshold tuning. The Five Whys skill is the hook that forces frame inspection before theorizing.

---

Full post with the `failed-approaches.md` template and the one-change rule: https://withagents.dev/writing/day-28-kaizen-algorithm-tuning
