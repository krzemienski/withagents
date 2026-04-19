# Newsletter Blurb — Post 13

**Subject:** 78% to 97% accuracy — the manufacturing discipline that fixed my algorithm

Hey —

For three weeks, my video transition detection algorithm was stuck at 78%. I was doing what most people do with algorithm tuning: adjust a parameter, re-run the tests, look at the numbers, adjust another parameter. Sometimes 79.5%. Then back to 77.8%. Random walks through parameter space disguised as engineering.

The breakthrough was applying Kaizen PDCA cycles — a continuous improvement framework from manufacturing — to algorithm development. Twelve cycles. Eighty-four sequential thinking operations. One week. 78% to 97.1%.

In this week's Agentic Development post, I cover:

- Why treating accuracy as a single number (instead of a per-type failure vector) keeps you stuck
- How sequential thinking generates falsifiable hypotheses — not guesses — before each code change
- The sigmoid kernel insight that jumped dissolve detection from 62% to 95.3% (+33.3pp)
- Why automatic checkpoint-and-revert makes failed experiments cost 15 minutes instead of weeks

The most interesting finding was from sequential thinking step 47. The chain reasoned that real dissolves follow sigmoid opacity curves, not linear gradients — and predicted the specific failure mode (false positives from panning shots) before any code was written. That is not a guess. That is a mechanism with a predicted outcome. Cycle 7 implemented it: +8.2 percentage points on dissolves, zero regression on hard cuts or wipes.

The three rules — one change per cycle, automatic revert on regression, hypothesis before code — are the difference between iteration and random search. They generalize to any algorithm with a measurable metric and a ground truth dataset.

Full post: [link to blog post]

Companion repo with the PDCA cycle runner, ground truth format, and all 12 parameter sets:
github.com/krzemienski/kaizen-algorithm-tuning

— Nick
