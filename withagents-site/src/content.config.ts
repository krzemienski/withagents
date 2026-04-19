import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ─── Projects ────────────────────────────────────────────────────────────────
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    tagline: z.string().max(80),
    status: z.enum(['stable', 'beta', 'experimental', 'planned']),
    kind: z.enum(['product', 'open-source', 'internal']),
    techChips: z.array(z.string()).default([]),
    githubUrl: z.string().url().optional(),
    docsUrl: z.string().url().optional(),
    coverImage: z.string().optional(),
    stars: z.number().int().nonnegative().optional(),
    version: z.string().optional(),
    lastUpdated: z.string().optional(),
  }),
});

// ─── Posts ───────────────────────────────────────────────────────────────────
const posts = defineCollection({
  // Canonicals are *.mdx; companion syndication payloads (.linkedin.md, .x.md,
  // .readme-patch.md) sit beside them and MUST be excluded from the content
  // collection — they don't match the posts schema. Phase 10 dispatch (2026-04-19).
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    slug: z.string(),
    date: z.string(),
    author: z.string().default('Nick Krzemienski'),
    kind: z.enum(['essay', 'field-note', 'production-analysis']),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    relatedProjectSlugs: z.array(z.string()).default([]),
    seriesSlug: z.string().optional(),
    readTime: z.number().int().positive().optional(),
    excerpt: z.string().max(240).optional(),
  }),
});

// ─── Series ──────────────────────────────────────────────────────────────────
const series = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    postSlugs: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
  }),
});

// ─── Insights ────────────────────────────────────────────────────────────────
const insights = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/insights' }),
  schema: z.object({
    claim: z.string(),
    strength: z.enum(['strong', 'medium', 'weak']),
    sources: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
  }),
});

// ─── Diagrams ────────────────────────────────────────────────────────────────
const diagrams = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/diagrams' }),
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
    altText: z.string(),
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
