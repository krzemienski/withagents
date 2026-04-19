# Keystatic + Astro Content Schemas — WithAgents

Phase 09 deliverable. Drop these files into the Astro project that Agent P09-A1 scaffolds.

---

## File map

```
phase-09-output/keystatic/
├── keystatic.config.ts                    # Keystatic v2 collection config (copy to project root)
├── src/
│   ├── content/
│   │   ├── config.ts                      # Astro content collection Zod schemas
│   │   └── seed/
│   │       ├── projects/
│   │       │   ├── runbooks.mdx
│   │       │   ├── memory-layer.mdx
│   │       │   ├── operator-ui.mdx
│   │       │   ├── agent-contracts.mdx
│   │       │   ├── trace-timeline.mdx
│   │       │   └── context-layers.mdx
│   │       ├── posts/
│   │       │   ├── agent-workflows-operating-systems.mdx
│   │       │   └── real-product-work-in-the-layer.mdx
│   │       └── insights/
│   │           └── iron-rule.mdx
│   └── pages/
│       └── keystatic/
│           └── [...params].astro          # Keystatic admin UI route
└── README.md                              # This file
```

---

## How to install

### 1. Copy files into the Astro project

```bash
# From project root (P09-A1's withagents-site/)
cp phase-09-output/keystatic/keystatic.config.ts .
cp -r phase-09-output/keystatic/src/content/config.ts src/content/
cp -r phase-09-output/keystatic/src/content/seed/* src/content/
cp phase-09-output/keystatic/src/pages/keystatic/[...params].astro src/pages/keystatic/
```

### 2. Install dependencies

```bash
pnpm add @keystatic/core @keystatic/astro @astrojs/react
```

### 3. Wire up the Astro integration

In `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

export default defineConfig({
  output: 'hybrid', // required — Keystatic admin route needs SSR
  integrations: [react(), keystatic()],
});
```

### 4. Run the dev server

```bash
pnpm dev
```

Open `http://localhost:4321/keystatic` to access the admin UI.

---

## How to use the admin UI

The admin UI at `/keystatic` lets you create and edit content in all five collections without touching MDX files directly.

- **Projects** — add product pillar cards and open-source repo entries
- **Posts** — write essays, field notes, and production analysis
- **Series** — group posts into ordered series
- **Insights** — manage claim-plus-evidence blocks for pull-quotes and the manifesto
- **Diagrams** — store Mermaid, Excalidraw, and raw SVG diagrams with mandatory alt text

All edits write directly to the local file system in `src/content/`. Commit the results as normal.

---

## Switching to GitHub storage in Phase 11

Phase 11 wires Keystatic to GitHub so the admin UI can commit content without local file access (useful for headless CMS workflows and non-technical contributors).

Change one block in `keystatic.config.ts`:

```ts
// Before (Phase 09 — local dev)
storage: { kind: 'local' },

// After (Phase 11 — GitHub)
storage: {
  kind: 'github',
  repo: 'krzemienski/withagents',   // your GitHub repo
  branchPrefix: 'keystatic/',       // optional — creates feature branches per edit
},
```

You will also need a GitHub OAuth app and the `KEYSTATIC_GITHUB_CLIENT_ID` / `KEYSTATIC_GITHUB_CLIENT_SECRET` env vars. Phase 11 handles credential setup — do not add them now.

---

## How to add a new collection

1. Add the collection to `keystatic.config.ts` inside the `collections` object.
2. Add a matching `defineCollection` entry with a Zod schema to `src/content/config.ts`.
3. Create a `src/content/<collection-name>/` directory.
4. Restart the dev server — Astro's content layer and Keystatic both pick up new collections automatically.

Keep field names in sync between the two files. If `keystatic.config.ts` defines a field that `config.ts` does not, the Astro build will silently drop it at runtime. If `config.ts` marks a field as required but `keystatic.config.ts` makes it optional, the admin UI will allow saving invalid content.

---

## Key constraints

- `altText` on the `diagrams` collection is non-optional in both Keystatic and Zod. This enforces BRIEF §16 and DESIGN.md §6. Do not make it optional.
- The `excerpts` field on `posts` has a 240-character max. The Keystatic UI enforces this at edit time; the Zod schema enforces it at build time.
- The `tagline` field on `projects` has an 80-character max for the same reason.
- Seed MDX files live in `src/content/seed/`. Move them to `src/content/<collection>/` when copying into the live project — Astro's content layer reads from the collection directory, not `seed/`.

---

## Reference

- BRIEF.md §10 — content direction (product pillars, writing themes, open-source repos)
- BRIEF.md §16 — hard rules (no lorem ipsum, alt text required, no consultancy language)
- DESIGN.md §6 — diagram accessibility requirements
- Keystatic docs: https://keystatic.com/docs
- Astro content collections: https://docs.astro.build/en/guides/content-collections/
