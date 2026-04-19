# Newsletter Blurb — Post 12

**Subject:** 321 screenshots, zero manual effort — how to validate UIs at scale

Hey —

Our iOS app had over 100 screen states, and manual screenshot testing was taking 3 days. Worse, we were still missing bugs — edge cases in form validation, dark mode inconsistencies, layout breaks on smaller screens that nobody thought to check.

So I built an automated pipeline that treats UI validation like a state machine traversal. Navigate to a state, tap with idb_tap, screenshot, tag with metadata, move to the next state. 235+ taps in a single session. Fully unattended.

In this week's Agentic Development post, I cover:

- How to model your app's UI as a navigable state graph (the foundation that makes automation possible)
- The idb_tap orchestration loop that drives 321 screenshots in 24 hours
- Why metadata tagging turns a pile of screenshots into a searchable evidence database
- The 12 rendering bugs we found that we'd been shipping for weeks

The results: 100% state coverage (up from ~60%), 3-day process compressed to 24 hours, and a repeatable pipeline that runs before every release.

Full post: [link to blog post]

The companion repo has the complete implementation — Python orchestrator, state tracker, screenshot collector, and HTML report generator:
github.com/krzemienski/ui-validation-at-scale

— Nick
