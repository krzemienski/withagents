# Post 10: "21 AI Screens, Zero Figma: Design to Code"

## Metadata
- Target word count: 2,000
- Source posts: 10, 20, 41
- Companion repo: `claude-mobile-expo`
- New content needed: Yes — reframe around Stitch MCP as primary workflow, add Midnight Observatory as running case study, update companion repo references from stitch-design-to-code to claude-mobile-expo

## Opening (hook — 2 sentences max)
I described 21 screens in plain English and got a production design system — 47 tokens, 5 component primitives, zero Figma files. Then screen 15 said "Awesome Video Dashboard" instead of "Awesome Lists," and I didn't notice until screen 22.

## Narrative Arc

1. **The Branding Bug** — Post 10's most instructive failure. By the 15th Stitch MCP `generate_screen_from_text` call, the AI started producing "Awesome Video Dashboard" instead of "Awesome Lists" — 8 screens with the wrong name before caught. Root cause: context window drift in sequential generation. Fix: 3 lines of bash grep. The deeper lesson: the full design system must be in every prompt, every time. Not "see previous specs." Verbatim. ~300 words

2. **The Stitch MCP Workflow** — How `generate_screen_from_text` replaces Figma. The ai-digest project: 17 screens generated. The awesome-site project: 15 screens generated. The blog-series Midnight Observatory design system (project ID 5577890677756270199) as running example. The prompt structure: device type, design system tokens, component primitives, screen description. Why each call needs the complete token set — the AI has no memory between calls. ~350 words

3. **One Token File, Three Platforms** — Post 20's core insight. "The iOS button was 2 pixels taller. Nobody noticed for three weeks." Single YAML source generates platform-specific constants — developers never type a hex code. 47 tokens across 5 categories (color, spacing, typography, elevation, animation). The adapter pattern: CSS adapter converts px to rem, Swift adapter maps weight integers to Font.Weight enums. Adding a platform = writing one adapter class. The W3C DTCG format regret: "Starting with that format would have saved a rewrite." Post 20's line: "Design tokens are not a design tool. They are a build system concern." ~300 words

4. **Token Propagation Pipeline** — Post 10's chain: `tokens.json -> tailwind-preset.js -> Tailwind CSS utilities -> Component classes -> 21 screens`. "Change that to `#00ff88` and every screen switches from hot pink to neon green." The borderRadius: all 0px — "The components do not need to know they are brutalist. They just are." The Puppeteer validation: `bg === 'rgb(0, 0, 0)'` — "Not 'dark enough.' Not 'looks black.' Computationally verified pure black." Post 20's visual regression pipeline catching 3 legitimate issues in 368 sessions — all adapter bugs, not token bugs. ~300 words

5. **Runtime Theming at Scale** — Post 41's war story: 214 hardcoded colors in ILS iOS, agent built the entire theme engine in 4 hours. Three failed SwiftUI approaches: (1) UserDefaults + NotificationCenter polling — 400ms lag, (2) ObservableObject singleton — view update storms with 200+ views, (3) Combine pipeline — 850ms propagation delay. The winner: `@Environment` with `EnvironmentKey` — zero-lag propagation because SwiftUI's environment system does the diffing. 13 themes shipping in production. Accessibility contrast checker enforcing WCAG AA 4.5:1 ratio before saving custom themes. ~350 words

6. **Closing: Token-Driven Development** — Post 10's midway experiment: swapping the primary color caught 2 hardcoded hex values. Post 20's insight: "The single-source constraint that makes Figma-to-code handoffs tedious is exactly what makes AI-to-code handoffs reliable." The Stitch prompt block generated as a build artifact — "the prompt was a build artifact." ~150 words

## Key Code Blocks to Include
- The borderRadius tokens (all 0px) from post 10 — the most distinctive design decision
- The branding grep one-liner from post 10
- The YAML token source with cross-references from post 20
- The CSS + SwiftUI adapter outputs from post 20 (same token, two platform formats)
- The `@Environment` ThemeKey SwiftUI pattern from post 41 (~10 lines)

## Real Data Points
- 21 screens, 47 tokens, 5 component primitives, zero Figma (post 10)
- 8 screens with wrong branding before caught (post 10)
- 3 lines of bash grep as the branding safeguard (post 10)
- ai-digest: 17 generate_screen_from_text calls; awesome-site: 15 calls (session evidence)
- Stitch project ID 5577890677756270199 for blog-series Midnight Observatory (session evidence)
- iOS button 2 pixels taller, unnoticed for 3 weeks (post 20)
- 3 visual regression catches in 368 sessions — all adapter bugs (post 20)
- 214 hardcoded colors converted to 47 semantic tokens (post 41)
- 400ms lag (UserDefaults), 850ms (Combine), 0ms (@Environment) (post 41)
- 13 runtime themes shipping in ILS iOS (post 41)

## Material to NOT Include
- Post 10's full tokens.json listing (use excerpts)
- Post 10's full tailwind-preset.js listing
- Post 10's full Puppeteer validation runner code
- Post 20's full Kotlin output block (point is made with CSS + Swift)
- Post 20's three failed taxonomy discussion (too granular)
- Post 41's full ThemeManager implementation
- Post 41's "why theming matters" introductory section (filler)
- Content pipeline details from post 19 (belongs in post 9)
- Session mining details from post 29 (belongs in post 9)
- Vision model labeling details from post 22 (moved to debugging post or cut)

## Companion Repo Tie-in
The `claude-mobile-expo` repo demonstrates the Stitch MCP design-to-code workflow with token YAML sources, platform adapters, and prompt templates. Reader can modify a single color token and watch it propagate across generated screens, or run `generate_screen_from_text` with their own design system to produce screens from plain English descriptions.
