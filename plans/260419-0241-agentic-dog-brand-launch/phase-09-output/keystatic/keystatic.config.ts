import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' }, // Phase 11 swaps to { kind: 'github', repo: 'krzemienski/withagents' }

  ui: {
    brand: { name: 'WithAgents' },
  },

  collections: {
    // ─── Projects ───────────────────────────────────────────────────────────────
    // Covers all three categories: product pillars (Runbooks, Memory Layer,
    // Operator UI), open-source repos (agent-contracts, trace-timeline,
    // context-layers), and internal/future entries.
    projects: collection({
      label: 'Projects',
      slugField: 'slug',
      path: 'src/content/projects/*',
      format: { contentField: 'readmeMarkdown' },
      columns: ['name', 'status', 'kind', 'lastUpdated'],
      schema: {
        name: fields.text({
          label: 'Name',
          validation: { isRequired: true },
        }),
        slug: fields.slug({
          name: {
            label: 'Slug',
            description: 'Kebab-case URL slug. Auto-generated from name.',
          },
        }),
        tagline: fields.text({
          label: 'Tagline',
          description: 'One-liner shown in cards. Max 80 characters.',
          validation: { isRequired: true, length: { max: 80 } },
        }),
        description: fields.mdx({
          label: 'Description',
          description: 'Short markdown intro shown on index page.',
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Stable', value: 'stable' },
            { label: 'Beta', value: 'beta' },
            { label: 'Experimental', value: 'experimental' },
            { label: 'Planned', value: 'planned' },
          ],
          defaultValue: 'stable',
        }),
        kind: fields.select({
          label: 'Kind',
          options: [
            { label: 'Product', value: 'product' },
            { label: 'Open Source', value: 'open-source' },
            { label: 'Internal', value: 'internal' },
          ],
          defaultValue: 'product',
        }),
        techChips: fields.array(
          fields.text({ label: 'Technology' }),
          {
            label: 'Tech chips',
            description: 'Short labels shown as pills in product cards.',
            itemLabel: (props) => props.fields.value.value ?? 'Technology',
          }
        ),
        githubUrl: fields.url({
          label: 'GitHub URL',
          description: 'https://github.com/krzemienski/…',
        }),
        docsUrl: fields.url({
          label: 'Docs URL',
          description: 'External docs or README link.',
        }),
        readmeMarkdown: fields.mdx({
          label: 'README',
          description: 'Full README body rendered on /projects/[slug].',
        }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        stars: fields.integer({
          label: 'GitHub stars (cached)',
          description: 'Cached star count. Refresh manually or via Phase 11 GitHub Action.',
        }),
        version: fields.text({
          label: 'Version',
          description: 'e.g. v2.0.0 — shown in "Active Deployments" strip on home page.',
        }),
        lastUpdated: fields.date({
          label: 'Last updated',
          description: 'ISO date of most recent meaningful change.',
        }),
      },
    }),

    // ─── Posts ───────────────────────────────────────────────────────────────────
    // Three kinds: essay (long-form), field-note (short observation),
    // production-analysis (data-backed deep dive).
    posts: collection({
      label: 'Posts',
      slugField: 'slug',
      path: 'src/content/posts/*',
      format: { contentField: 'body' },
      columns: ['title', 'date', 'kind'],
      schema: {
        title: fields.text({
          label: 'Title',
          validation: { isRequired: true },
        }),
        subtitle: fields.text({
          label: 'Subtitle',
          description: 'Optional deck text shown below the title.',
        }),
        slug: fields.slug({
          name: { label: 'Slug' },
        }),
        date: fields.date({
          label: 'Date',
          validation: { isRequired: true },
        }),
        author: fields.text({
          label: 'Author',
          defaultValue: 'Nick Krzemienski',
        }),
        kind: fields.select({
          label: 'Kind',
          options: [
            { label: 'Essay', value: 'essay' },
            { label: 'Field Note', value: 'field-note' },
            { label: 'Production Analysis', value: 'production-analysis' },
          ],
          defaultValue: 'essay',
        }),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: (props) => props.fields.value.value ?? 'Tag',
          }
        ),
        body: fields.mdx({
          label: 'Body',
          description: 'Full article content.',
        }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/posts',
          publicPath: '/images/posts/',
        }),
        relatedProjectSlugs: fields.array(
          fields.text({ label: 'Project slug' }),
          {
            label: 'Related projects',
            description: 'Slugs of projects referenced in this post.',
            itemLabel: (props) => props.fields.value.value ?? 'Slug',
          }
        ),
        seriesSlug: fields.text({
          label: 'Series slug',
          description: 'Parent series if this post belongs to one.',
        }),
        readTime: fields.integer({
          label: 'Read time (minutes)',
        }),
        excerpt: fields.text({
          label: 'Excerpt',
          description: 'Plain-text summary shown in cards and OG. Max 240 chars.',
          multiline: true,
          validation: { length: { max: 240 } },
        }),
      },
    }),

    // ─── Series ───────────────────────────────────────────────────────────────────
    series: collection({
      label: 'Series',
      slugField: 'slug',
      path: 'src/content/series/*',
      format: { contentField: 'description' },
      columns: ['title', 'slug'],
      schema: {
        title: fields.text({
          label: 'Title',
          validation: { isRequired: true },
        }),
        slug: fields.slug({
          name: { label: 'Slug' },
        }),
        description: fields.mdx({
          label: 'Description',
        }),
        postSlugs: fields.array(
          fields.text({ label: 'Post slug' }),
          {
            label: 'Posts (ordered)',
            description: 'Ordered list of post slugs that belong to this series.',
            itemLabel: (props) => props.fields.value.value ?? 'Slug',
          }
        ),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/series',
          publicPath: '/images/series/',
        }),
      },
    }),

    // ─── Insights ─────────────────────────────────────────────────────────────────
    // Reusable claim + evidence blocks drawn from 23,479-session evidence base.
    // Used in pull-quotes, the Insights page, and manifesto sections.
    insights: collection({
      label: 'Insights',
      slugField: 'claim',
      path: 'src/content/insights/*',
      format: { contentField: 'evidence' },
      columns: ['claim', 'strength'],
      schema: {
        claim: fields.slug({
          name: {
            label: 'Claim',
            description: 'One-line thesis. This becomes the URL slug.',
          },
        }),
        evidence: fields.mdx({
          label: 'Evidence',
          description: 'Backing data, quotes, metrics from session mining.',
        }),
        strength: fields.select({
          label: 'Strength',
          options: [
            { label: 'Strong', value: 'strong' },
            { label: 'Medium', value: 'medium' },
            { label: 'Weak', value: 'weak' },
          ],
          defaultValue: 'strong',
        }),
        sources: fields.array(
          fields.text({ label: 'Source' }),
          {
            label: 'Sources',
            description: 'Session paths, repo links, post references.',
            itemLabel: (props) => props.fields.value.value ?? 'Source',
          }
        ),
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          {
            label: 'Tags',
            itemLabel: (props) => props.fields.value.value ?? 'Tag',
          }
        ),
      },
    }),

    // ─── Diagrams ─────────────────────────────────────────────────────────────────
    // Mermaid, Excalidraw, and raw SVG diagrams.
    // altText is REQUIRED — enforced by validation below (BRIEF §16, DESIGN.md §6).
    diagrams: collection({
      label: 'Diagrams',
      slugField: 'slug',
      path: 'src/content/diagrams/*',
      format: { contentField: 'altText' },
      columns: ['title', 'kind', 'theme'],
      schema: {
        title: fields.text({
          label: 'Title',
          validation: { isRequired: true },
        }),
        slug: fields.slug({
          name: { label: 'Slug' },
        }),
        kind: fields.select({
          label: 'Diagram kind',
          options: [
            { label: 'Flowchart', value: 'flowchart' },
            { label: 'Sequence', value: 'sequence' },
            { label: 'Class', value: 'class' },
            { label: 'State', value: 'state' },
            { label: 'ER', value: 'er' },
            { label: 'Gantt', value: 'gantt' },
            { label: 'Excalidraw', value: 'excalidraw' },
            { label: 'Custom SVG', value: 'custom-svg' },
          ],
          defaultValue: 'flowchart',
        }),
        mermaidSource: fields.text({
          label: 'Mermaid source',
          description: 'Full Mermaid v11 diagram source. Leave empty for Excalidraw/SVG kinds.',
          multiline: true,
        }),
        excalidrawJson: fields.text({
          label: 'Excalidraw JSON',
          description: 'Raw Excalidraw scene JSON. Leave empty for Mermaid/SVG kinds.',
          multiline: true,
        }),
        svgMarkup: fields.text({
          label: 'SVG markup',
          description: 'Raw inline SVG for custom diagrams.',
          multiline: true,
        }),
        // REQUIRED — every diagram must describe itself for screen readers.
        altText: fields.text({
          label: 'Alt text (required)',
          description: 'Accessibility description. Required per BRIEF §16 and DESIGN.md §6. Must describe what the diagram communicates, not just its visual appearance.',
          multiline: true,
          validation: { isRequired: true },
        }),
        theme: fields.select({
          label: 'Accent theme',
          options: [
            { label: 'Hyper-black + Ultraviolet (default)', value: 'hyper-black-default' },
            { label: 'Hyper-black + Magenta', value: 'hyper-black-magenta' },
            { label: 'Hyper-black + Lime Signal', value: 'hyper-black-lime-signal' },
            { label: 'Hyper-black + Orchid', value: 'hyper-black-orchid' },
            { label: 'Hyper-black + Plasma', value: 'hyper-black-plasma' },
            { label: 'Hyper-black + Mono', value: 'hyper-black-mono' },
          ],
          defaultValue: 'hyper-black-default',
        }),
      },
    }),
  },
});
