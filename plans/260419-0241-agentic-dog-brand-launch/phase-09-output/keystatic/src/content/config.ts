import { defineCollection, z } from 'astro:content';

// ─── Projects ────────────────────────────────────────────────────────────────
// Mirrors keystatic.config.ts `projects` collection.
// Covers product pillars (Runbooks, Memory Layer, Operator UI) and
// open-source repos (agent-contracts, trace-timeline, context-layers).
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tagline: z.string().max(80),
    // description is the MDX body — rendered via entry.render()
    status: z.enum(['stable', 'beta', 'experimental', 'planned']),
    kind: z.enum(['product', 'open-source', 'internal']),
    techChips: z.array(z.string()).default([]),
    githubUrl: z.string().url().optional(),
    docsUrl: z.string().url().optional(),
    // readmeMarkdown is the MDX content field — rendered via entry.render()
    coverImage: z.string().optional(),
    stars: z.number().int().nonnegative().optional(),
    version: z.string().optional(),
    lastUpdated: z.string().optional(), // ISO date YYYY-MM-DD
  }),
});

// ─── Posts ───────────────────────────────────────────────────────────────────
// Mirrors keystatic.config.ts `posts` collection.
const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    slug: z.string(),
    date: z.string(), // ISO date YYYY-MM-DD
    author: z.string().default('Nick Krzemienski'),
    kind: z.enum(['essay', 'field-note', 'production-analysis']),
    tags: z.array(z.string()).default([]),
    // body is the MDX content field — rendered via entry.render()
    coverImage: z.string().optional(),
    relatedProjectSlugs: z.array(z.string()).default([]),
    seriesSlug: z.string().optional(),
    readTime: z.number().int().positive().optional(),
    excerpt: z.string().max(240).optional(),
  }),
});

// ─── Series ──────────────────────────────────────────────────────────────────
const series = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    // description is the MDX content field
    postSlugs: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
  }),
});

// ─── Insights ────────────────────────────────────────────────────────────────
// Claim-plus-evidence blocks sourced from 23,479-session evidence base.
const insights = defineCollection({
  type: 'content',
  schema: z.object({
    claim: z.string(),
    // evidence is the MDX content field
    strength: z.enum(['strong', 'medium', 'weak']),
    sources: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

// ─── Diagrams ────────────────────────────────────────────────────────────────
// altText is non-optional — enforced here and in keystatic.config.ts.
// BRIEF §16 + DESIGN.md §6 mandate accessibility descriptions on all diagrams.
const diagrams = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    kind: z.enum([
      'flowchart',
      'sequence',
      'class',
      'state',
      'er',
      'gantt',
      'excalidraw',
      'custom-svg',
    ]),
    mermaidSource: z.string().optional(),
    excalidrawJson: z.string().optional(),
    svgMarkup: z.string().optional(),
    altText: z.string(), // Required — no .optional()
    theme: z
      .enum([
        'hyper-black-default',
        'hyper-black-magenta',
        'hyper-black-lime-signal',
        'hyper-black-orchid',
        'hyper-black-plasma',
        'hyper-black-mono',
      ])
      .default('hyper-black-default'),
  }),
});

export const collections = {
  projects,
  posts,
  series,
  insights,
  diagrams,
};
