/* =====================================================================
   WITHAGENTS DESIGN SYSTEMS
   Five fully-articulated systems, all rooted in the WithAgents content
   (23,479 sessions · 19 posts · 6 products · evidence-first voice).

   Each system overrides ~36 tokens AND triggers a [data-system] attribute
   on <html> so component skins, diagram primitives, code blocks, cards,
   and text-content surfaces all shift together.

   Pick a winner. Or run them in branches and keep the strongest pieces.
   ===================================================================== */

window.WA_DESIGN_SYSTEMS = {

  /* ───────────────────────── FIELD JOURNAL ─────────────────────────
     The current site. Hyper-black editorial. Inter UI, Fraunces italic
     drops, JetBrains for everything mono. Reserved crimson accent.
     The "default" — what we ship until we choose a different winner. */
  journal: {
    name: 'Field Journal',
    tag: 'Editorial · Inter + Fraunces',
    desc: 'The current site. Inter UI, italic Fraunces drops, warm off-white ink. Reserved crimson, generous leading, hairline rules.',
    role: 'default · the running site',
    vars: {
      /* surface */
      '--bg':            '#08080a',
      '--bg-2':          '#0c0c0e',
      '--surface':       'rgba(255,255,255,0.025)',
      '--surface-2':     'rgba(255,255,255,0.04)',
      '--surface-3':     'rgba(255,255,255,0.06)',
      '--border':        'rgba(255,255,255,0.08)',
      '--border-strong': 'rgba(255,255,255,0.16)',
      '--hairline':      'rgba(255,255,255,0.06)',

      /* ink */
      '--text':   '#f4f3ee',
      '--text-2': 'rgba(244,243,238,0.72)',
      '--text-3': 'rgba(244,243,238,0.4)',
      '--text-4': 'rgba(244,243,238,0.28)',

      /* type */
      '--font-body':    "'Inter', system-ui, sans-serif",
      '--font-display': "'Fraunces', Georgia, serif",
      '--font-mono':    "'JetBrains Mono', ui-monospace, monospace",
      '--display-weight': '800',
      '--display-tracking': '-0.04em',
      '--display-leading':  '0.98',
      '--display-italic':   '1', /* uses italic Fraunces drops */
      '--body-leading':     '1.6',
      '--body-weight':      '400',
      '--eyebrow-tracking': '0.18em',
      '--mono-size-step':   '11px',
      '--mono-weight':      '600',

      /* shape */
      '--radius':       '12px',
      '--radius-sm':    '8px',
      '--radius-lg':    '16px',
      '--radius-pill':  '999px',
      '--border-w':     '1px',
      '--hairline-w':   '1px',

      /* shadow — the brand barely uses these; layered translucency does the work */
      '--shadow-sm':     '0 1px 2px rgba(0,0,0,0.3)',
      '--shadow':        '0 6px 24px -8px rgba(0,0,0,0.5)',
      '--shadow-lg':     '0 24px 60px -20px rgba(0,0,0,0.7)',
      '--shadow-accent': '0 0 0 1px color-mix(in srgb, var(--accent) 25%, transparent), 0 12px 36px -12px color-mix(in srgb, var(--accent) 40%, transparent)',
      '--shadow-glow':   '0 0 10px var(--accent)',

      /* atmosphere — radial accent gradients in two corners (the brand signature) */
      '--bg-atmosphere':
        'radial-gradient(ellipse 1000px 600px at 90% -10%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 60%),' +
        'radial-gradient(ellipse 900px 500px at -10% 120%, rgba(122,61,255,0.08), transparent 60%)',
      '--bg-atmosphere-size': 'auto',
      '--grain-opacity': '0.12',
      '--grain-blend':   'overlay',
    },
  },

  /* ───────────────────────── TERMINAL LOG ─────────────────────────
     Everything is mono. ASCII-chromed. Posts rendered as session logs.
     Square edges, scanlines, blinking carets. Accent only as glow.
     For: people who think the terminal IS the brand. */
  terminal: {
    name: 'Terminal Log',
    tag: 'CRT · IBM Plex Mono',
    desc: 'Mono-everything. ASCII boxes, > prefixes, bracketed labels, scanline overlay. The site reads like a session log rendered live.',
    role: 'session-log fidelity',
    vars: {
      '--bg':            '#000000',
      '--bg-2':          '#040404',
      '--surface':       'rgba(0,255,136,0.012)',
      '--surface-2':     'rgba(0,255,136,0.025)',
      '--surface-3':     'rgba(0,255,136,0.05)',
      '--border':        'rgba(232,232,224,0.18)',
      '--border-strong': 'rgba(232,232,224,0.36)',
      '--hairline':      'rgba(232,232,224,0.1)',

      '--text':   '#e8e8e0',
      '--text-2': 'rgba(232,232,224,0.62)',
      '--text-3': 'rgba(232,232,224,0.36)',
      '--text-4': 'rgba(232,232,224,0.22)',

      '--font-body':    "'IBM Plex Mono', ui-monospace, monospace",
      '--font-display': "'IBM Plex Mono', ui-monospace, monospace",
      '--font-mono':    "'IBM Plex Mono', ui-monospace, monospace",
      '--display-weight':   '600',
      '--display-tracking': '-0.01em',
      '--display-leading':  '1.08',
      '--display-italic':   '0',
      '--body-leading':     '1.55',
      '--body-weight':      '400',
      '--eyebrow-tracking': '0.2em',
      '--mono-size-step':   '12px',
      '--mono-weight':      '500',

      '--radius':      '0px',
      '--radius-sm':   '0px',
      '--radius-lg':   '0px',
      '--radius-pill': '0px',
      '--border-w':    '1px',
      '--hairline-w':  '1px',

      '--shadow-sm':     'none',
      '--shadow':        'none',
      '--shadow-lg':     '0 0 0 1px var(--accent), inset 0 0 60px color-mix(in srgb, var(--accent) 8%, transparent)',
      '--shadow-accent': '0 0 0 1px var(--accent), 0 0 24px color-mix(in srgb, var(--accent) 30%, transparent)',
      '--shadow-glow':   '0 0 14px color-mix(in srgb, var(--accent) 60%, transparent)',

      '--bg-atmosphere':
        'repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(255,255,255,0.022) 2px, rgba(255,255,255,0.022) 3px),' +
        'radial-gradient(ellipse 800px 600px at 50% 50%, color-mix(in srgb, var(--accent) 4%, transparent), transparent 70%)',
      '--bg-atmosphere-size': 'auto',
      '--grain-opacity': '0.32',
      '--grain-blend':   'overlay',
    },
  },

  /* ───────────────────────── RESEARCH PAPER ─────────────────────────
     The arXiv preprint vibe. IBM Plex Serif for body, Plex Sans for UI,
     Plex Mono for code. Numbered figures and theorems. Light hairline
     dividers. Restrained accent — used on figure numbers and citations.
     For: the "this is a peer-reviewed claim" feeling. */
  paper: {
    name: 'Research Paper',
    tag: 'Preprint · IBM Plex Serif',
    desc: 'arXiv-quality typography. Plex Serif body, numbered figures and theorems, hairline dividers, accent reserved for citations and Fig. tags.',
    role: 'long-form authority',
    vars: {
      '--bg':            '#0a0a0c',
      '--bg-2':          '#0f0f12',
      '--surface':       'rgba(248,247,242,0.018)',
      '--surface-2':     'rgba(248,247,242,0.04)',
      '--surface-3':     'rgba(248,247,242,0.07)',
      '--border':        'rgba(248,247,242,0.1)',
      '--border-strong': 'rgba(248,247,242,0.22)',
      '--hairline':      'rgba(248,247,242,0.07)',

      '--text':   '#f8f7f2',
      '--text-2': 'rgba(248,247,242,0.74)',
      '--text-3': 'rgba(248,247,242,0.46)',
      '--text-4': 'rgba(248,247,242,0.3)',

      '--font-body':    "'IBM Plex Serif', Georgia, serif",
      '--font-display': "'IBM Plex Serif', Georgia, serif",
      '--font-mono':    "'IBM Plex Mono', ui-monospace, monospace",
      '--display-weight':   '500',
      '--display-tracking': '-0.018em',
      '--display-leading':  '1.1',
      '--display-italic':   '0',
      '--body-leading':     '1.7',
      '--body-weight':      '400',
      '--eyebrow-tracking': '0.16em',
      '--mono-size-step':   '11.5px',
      '--mono-weight':      '500',

      '--radius':      '4px',
      '--radius-sm':   '2px',
      '--radius-lg':   '6px',
      '--radius-pill': '999px',
      '--border-w':    '1px',
      '--hairline-w':  '1px',

      '--shadow-sm':     'none',
      '--shadow':        '0 1px 0 rgba(0,0,0,0.4)',
      '--shadow-lg':     '0 24px 60px -24px rgba(0,0,0,0.5)',
      '--shadow-accent': '0 0 0 1px color-mix(in srgb, var(--accent) 60%, transparent)',
      '--shadow-glow':   '0 0 6px color-mix(in srgb, var(--accent) 40%, transparent)',

      '--bg-atmosphere': 'none',
      '--bg-atmosphere-size': 'auto',
      '--grain-opacity': '0.05',
      '--grain-blend':   'overlay',
    },
  },

  /* ───────────────────────── OPERATOR CONSOLE ─────────────────────────
     Utilitarian dashboard. Geist sans for UI, JetBrains for everything else.
     Tight 4px grid, sharp 4px corners, status traffic-light system.
     For: the 12-lane dispatch desk. */
  console: {
    name: 'Operator Console',
    tag: 'Cockpit · Geist + JetBrains',
    desc: 'Utilitarian dashboard. Tight 4px grid, status traffic-light pills, dense rows, no decorative weight. Built for supervising twelve agents at once.',
    role: 'dense product surface',
    vars: {
      '--bg':            '#000000',
      '--bg-2':          '#080808',
      '--surface':       'rgba(255,255,255,0.035)',
      '--surface-2':     'rgba(255,255,255,0.06)',
      '--surface-3':     'rgba(255,255,255,0.09)',
      '--border':        'rgba(255,255,255,0.1)',
      '--border-strong': 'rgba(255,255,255,0.2)',
      '--hairline':      'rgba(255,255,255,0.06)',

      '--text':   '#fafafa',
      '--text-2': 'rgba(250,250,250,0.66)',
      '--text-3': 'rgba(250,250,250,0.4)',
      '--text-4': 'rgba(250,250,250,0.24)',

      '--font-body':    "'Geist', 'Inter', system-ui, sans-serif",
      '--font-display': "'Geist', 'Inter', system-ui, sans-serif",
      '--font-mono':    "'JetBrains Mono', ui-monospace, monospace",
      '--display-weight':   '600',
      '--display-tracking': '-0.035em',
      '--display-leading':  '1.05',
      '--display-italic':   '0',
      '--body-leading':     '1.55',
      '--body-weight':      '400',
      '--eyebrow-tracking': '0.08em',
      '--mono-size-step':   '11px',
      '--mono-weight':      '500',

      '--radius':      '4px',
      '--radius-sm':   '3px',
      '--radius-lg':   '6px',
      '--radius-pill': '999px',
      '--border-w':    '1px',
      '--hairline-w':  '1px',

      '--shadow-sm':     '0 1px 2px rgba(0,0,0,0.4)',
      '--shadow':        '0 0 0 1px rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.5)',
      '--shadow-lg':     '0 0 0 1px rgba(255,255,255,0.06), 0 24px 56px rgba(0,0,0,0.55)',
      '--shadow-accent': '0 0 0 1px color-mix(in srgb, var(--accent) 50%, transparent), 0 0 32px color-mix(in srgb, var(--accent) 25%, transparent)',
      '--shadow-glow':   '0 0 8px color-mix(in srgb, var(--accent) 60%, transparent)',

      '--bg-atmosphere':
        'radial-gradient(ellipse 1200px 600px at 50% -20%, rgba(255,255,255,0.025), transparent 60%)',
      '--bg-atmosphere-size': 'auto',
      '--grain-opacity': '0',
      '--grain-blend':   'normal',
    },
  },

  /* ───────────────────────── BRUTALIST MANIFESTO ─────────────────────────
     Hard 2px borders. Offset shadows (4px 4px 0). No radius. Instrument
     Serif for monumental headlines, Space Grotesk for body, JetBrains
     for everything mono. Yells.
     For: the manifesto/op-ed treatment of the same content. */
  brutal: {
    name: 'Brutalist Manifesto',
    tag: 'Slab · Instrument Serif',
    desc: 'Hard 2px borders, offset shadows, monumental italic serif headlines. The same evidence, but stamped in concrete.',
    role: 'declarative · op-ed',
    vars: {
      '--bg':            '#000000',
      '--bg-2':          '#0a0a0a',
      '--surface':       'rgba(245,245,240,0.025)',
      '--surface-2':     'rgba(245,245,240,0.06)',
      '--surface-3':     'rgba(245,245,240,0.1)',
      '--border':        'rgba(245,245,240,0.85)',
      '--border-strong': 'rgba(245,245,240,1)',
      '--hairline':      'rgba(245,245,240,0.18)',

      '--text':   '#f5f5f0',
      '--text-2': 'rgba(245,245,240,0.7)',
      '--text-3': 'rgba(245,245,240,0.4)',
      '--text-4': 'rgba(245,245,240,0.22)',

      '--font-body':    "'Space Grotesk', system-ui, sans-serif",
      '--font-display': "'Instrument Serif', 'Times New Roman', serif",
      '--font-mono':    "'JetBrains Mono', ui-monospace, monospace",
      '--display-weight':   '400',
      '--display-tracking': '-0.045em',
      '--display-leading':  '0.92',
      '--display-italic':   '1',
      '--body-leading':     '1.5',
      '--body-weight':      '400',
      '--eyebrow-tracking': '0.24em',
      '--mono-size-step':   '11px',
      '--mono-weight':      '700',

      '--radius':      '0px',
      '--radius-sm':   '0px',
      '--radius-lg':   '0px',
      '--radius-pill': '0px',
      '--border-w':    '2px',
      '--hairline-w':  '1px',

      '--shadow-sm':     '2px 2px 0 0 var(--text)',
      '--shadow':        '4px 4px 0 0 var(--text)',
      '--shadow-lg':     '8px 8px 0 0 var(--text)',
      '--shadow-accent': '4px 4px 0 0 var(--accent)',
      '--shadow-glow':   '0 0 0 2px var(--accent)',

      '--bg-atmosphere': 'none',
      '--bg-atmosphere-size': 'auto',
      '--grain-opacity': '0.55',
      '--grain-blend':   'overlay',
    },
  },
};

/* Accent palette — the canonical 6 from the README plus a reference matrix green
   for terminal-system enthusiasts. Each system tones them differently. */
window.WA_ACCENTS = [
  { id: 'crimson',  name: 'Crimson',  primary: '#FF3D52', secondary: '#7A3DFF' },
  { id: 'magenta',  name: 'Magenta',  primary: '#EC4899', secondary: '#F472B6' },
  { id: 'violet',   name: 'Violet',   primary: '#B84DFF', secondary: '#7A3DFF' },
  { id: 'emerald',  name: 'Emerald',  primary: '#34D08C', secondary: '#5EE6B8' },
  { id: 'cyan',     name: 'Cyan',     primary: '#5EE6F2', secondary: '#7DD3FC' },
  { id: 'amber',    name: 'Amber',    primary: '#FFB84D', secondary: '#FFD86B' },
  { id: 'matrix',   name: 'Matrix',   primary: '#00FF88', secondary: '#39FF14' },
];

/* Smart accent default per system. */
window.WA_SYSTEM_DEFAULT_ACCENT = {
  journal:  'crimson',
  terminal: 'matrix',
  paper:    'crimson',
  console:  'cyan',
  brutal:   'amber',
};

/* Type scale — one canonical scale, expressed differently per system through
   --display-weight / --display-tracking. Sizes are pinned. */
window.WA_TYPE_SCALE = [
  { name: 'hero',     px: 96, label: 'Hero',     use: '23,479 · single moment' },
  { name: 'page',     px: 64, label: 'Page',     use: 'Post / product title'  },
  { name: 'section',  px: 44, label: 'Section',  use: 'Chapter break'         },
  { name: 'h2',       px: 32, label: 'H2',       use: 'Subsection'            },
  { name: 'h3',       px: 22, label: 'H3',       use: 'Card / row title'      },
  { name: 'body-lg',  px: 19, label: 'Body LG',  use: 'Lead paragraph'        },
  { name: 'body',     px: 17, label: 'Body',     use: 'Default prose'         },
  { name: 'small',    px: 14, label: 'Small',    use: 'Meta · captions'       },
  { name: 'mono',     px: 11, label: 'Mono',     use: 'Eyebrow · status · kbd' },
];

/* Spacing scale — 4px base. Same across all systems; what changes is how
   densely components apply it. */
window.WA_SPACE_SCALE = [
  { name: '0',  px: 0  },
  { name: '1',  px: 4  },
  { name: '2',  px: 8  },
  { name: '3',  px: 12 },
  { name: '4',  px: 16 },
  { name: '5',  px: 24 },
  { name: '6',  px: 32 },
  { name: '7',  px: 48 },
  { name: '8',  px: 72 },
  { name: '9',  px: 120 },
];

/* Apply a system + accent, mutating <html> inline-style + data-system. */
window.applyWADesignSystem = function (systemId, accentId) {
  const sys = window.WA_DESIGN_SYSTEMS[systemId] || window.WA_DESIGN_SYSTEMS.journal;
  const root = document.documentElement;

  /* Clear previously-applied keys so nothing leaks across switches. */
  if (root.__waAppliedKeys) {
    root.__waAppliedKeys.forEach((k) => root.style.removeProperty(k));
  }
  const applied = [];
  Object.entries(sys.vars).forEach(([k, v]) => {
    root.style.setProperty(k, v);
    applied.push(k);
  });

  const a =
    window.WA_ACCENTS.find((x) => x.id === accentId) || window.WA_ACCENTS[0];
  root.style.setProperty('--accent', a.primary);
  root.style.setProperty('--accent-2', a.secondary);
  applied.push('--accent', '--accent-2');

  root.__waAppliedKeys = applied;
  root.setAttribute('data-system', systemId);
  root.setAttribute('data-accent', accentId);
};
