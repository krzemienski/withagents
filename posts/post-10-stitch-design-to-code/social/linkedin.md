# LinkedIn — Post 10

Screen 22 is where I noticed it. The header said "Awesome Video Dashboard." My prompt said "Awesome Lists." Every single time. I scrolled back. Eight screens had the wrong name. The AI just drifted.

That branding bug changed how I think about every design prompt I've written since.

**Zero Figma Files**

I was building an iOS app, a web dashboard, and a blog series site across 23,479 sessions in 42 days. Not a pace where I could hire a designer or learn Figma well enough to produce professional-grade mockups.

Google's Stitch MCP collapsed the gap between design and code to a single generation step. Describe what I wanted in plain English. Get rendered HTML back with real components, real colors, real typography.

269 `generate_screen_from_text` calls. 87 `list_screens` calls. 20 `generate_variants`. 21 production screens. Zero Figma files opened. Zero lines of CSS written by hand.

**Why the Branding Drift Happened**

Each Stitch MCP call is stateless. The model doesn't remember previous calls. By call 15, my prompt's design system description was competing with the model's training data about what "awesome" dashboards look like. "Awesome Video Dashboard" is a more common pattern in training data than "Awesome Lists." The model defaulted to what felt familiar.

The fix wasn't better prompting. It was treating the product name as a design token, not free text. `tokens.brand.name` gets interpolated into every prompt programmatically. No memory required.

The full design system goes in every prompt, every time. Verbatim. Not "see previous specs." The entire token set, the exact product name, the component primitives, pasted into every generation call. I assumed the AI would maintain context across calls like a human collaborator. It can't. It won't.

**Hex Values Are Non-Negotiable**

Prompts for visual AI are nothing like prompts for text generation. "Make it look dark and modern" produces garbage. `#0a0a0a` background, `#ec4899` primary, 1px solid `#2a2a2a` borders produces consistency.

Every border radius in the token file is `0px`. All seven values. An instant visual litmus test. Any rounded corner in the rendered output means the token pipeline is broken. You can spot the failure from across the room.

Session length kills quality. Generating 21 screens in a single long session caused the later screens to degrade. Sweet spot: 5-7 screens per session, grouped by logical flow. Fresh session for each group. Same lesson as hat-scoped orchestration. Fresh context wins.

Validation goes past screenshots. A screenshot proves the UI rendered. It doesn't prove the right colors are applied. The Puppeteer suite runs 107 programmatic checks: `getComputedStyle(el).backgroundColor` must equal `rgb(17, 17, 17)`. Not "dark enough." Computationally verified.

I swapped the primary color across the entire token file. 21 screens turned pink. Two components had hardcoded hex values that didn't change. Token leaks show up the moment you try to rotate. Prompts aren't instructions. They're build artifacts.

The single-source constraint that makes Figma handoffs tedious is exactly what makes AI-to-code handoffs reliable. A human designer holds the system in their head, notices drift, fixes it intuitively. An AI can't do any of that. It needs the exact tokens in the exact prompt on every call.

Full post + code in the comments.
