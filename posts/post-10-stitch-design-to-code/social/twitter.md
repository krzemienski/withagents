# X Thread — Post 10

**Tweet 1:** Screen 22 is where I noticed it. The header said "Awesome Video Dashboard." My prompt said "Awesome Lists." Every single time.

I scrolled back. Eight screens had the wrong name. The AI just drifted.

That branding bug changed how I think about every design prompt since.

**Tweet 2:** 269 generate_screen_from_text calls. 87 list_screens. 20 generate_variants. 21 production screens.

Zero Figma files opened. Zero lines of CSS written by hand.

I never opened a design tool. Not once. The gap between "design" and "code" collapsed to a single generation step.

**Tweet 3:** By call 15, my design system description was competing with the model's training data about what "awesome" dashboards look like.

"Awesome Video Dashboard" is a more common pattern in training data than "Awesome Lists." The model defaulted to what felt familiar.

**Tweet 4:** Each Stitch MCP call is stateless. The model doesn't remember previous calls.

The fix wasn't better prompting. It was treating the product name as a design token:

```js
buildPrompt() {
  return `Design a ${tokens.brand.name} screen...`
}
```

Interpolated from the token file. No memory required.

**Tweet 5:** 47 design tokens in the source-of-truth JSON file. 7 categories: colors, typography, weights, line heights, spacing, radii, shadows.

Every border radius: `0px`. All seven. This is an instant visual litmus test. Any rounded corner in the rendered output means the token pipeline is broken.

**Tweet 6:** Prompts for visual AI are nothing like prompts for text generation.

"Make it look dark and modern" produces garbage.
`#0a0a0a background, #ec4899 primary, 1px solid #2a2a2a borders` produces consistency.

Hex values are non-negotiable. "Dark gray" means different things to different models.

**Tweet 7:** Session length kills quality. Generating 21 screens in a single long session caused the later ones to degrade.

Sweet spot: 5-7 screens per session. Grouped by logical flow (public, auth, user, admin, legal). Fresh session for each group.

Same lesson as hat-scoped orchestration. Fresh context wins.

**Tweet 8:** Validation goes past screenshots. A screenshot proves the UI rendered. It doesn't prove the right colors are applied.

```js
const bg = await page.$eval('.card', el =>
  getComputedStyle(el).backgroundColor
);
assert(bg === 'rgb(17, 17, 17)'); // token #111111
```

Not "dark enough." Computationally verified.

**Tweet 9:** The proof: I swapped the primary color across the entire token file. 21 screens turned pink.

But 2 components had hardcoded hex values that didn't change. Grep for hex codes outside config files. Zero matches = pipeline is clean.

Token leaks show up the moment you try to rotate.

**Tweet 10:** The single-source constraint that makes Figma handoffs tedious is exactly what makes AI-to-code handoffs reliable.

A designer holds the system in their head. An AI needs exact tokens in exact prompts on every call.

Prompts aren't instructions. They're build artifacts.

---

**Reply 1 (post link, UTM-tagged at publish):**
Full post + code: {{POST_URL}}
Companion repo: {{REPO_URL}}
