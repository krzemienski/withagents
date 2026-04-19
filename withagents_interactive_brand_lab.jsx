import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Briefcase,
  Check,
  ChevronRight,
  Code2,
  Component,
  Cpu,
  FileText,
  FlaskConical,
  LayoutGrid,
  Menu,
  MoonStar,
  Orbit,
  Palette,
  Sparkles,
  Type,
  Workflow,
  Wrench,
  X,
} from "lucide-react";

const surface = {
  bg: "#040404",
  panel: "#0A0A0D",
  panel2: "#111116",
  panel3: "#15151C",
  text: "#F5F5F7",
  muted: "#A1A1AA",
};

const accentThemes = {
  ultraviolet: {
    id: "ultraviolet",
    name: "Ultraviolet",
    label: "Deep purple / premium",
    accent: "#8B5CF6",
    accentAlt: "#C084FC",
    hot: "#E879F9",
    lime: "#A3E635",
    border: "rgba(255,255,255,0.10)",
    accentSoft: "rgba(139,92,246,0.12)",
    glow: "0 0 0 1px rgba(255,255,255,0.04), 0 0 36px rgba(139,92,246,0.10)",
    hero: "linear-gradient(135deg, rgba(139,92,246,0.09), rgba(232,121,249,0.03) 46%, rgba(0,0,0,0) 82%)",
  },
  magenta: {
    id: "magenta",
    name: "Magenta",
    label: "Crisp pink edge",
    accent: "#A855F7",
    accentAlt: "#F472B6",
    hot: "#FB7185",
    lime: "#A3E635",
    border: "rgba(244,114,182,0.14)",
    accentSoft: "rgba(168,85,247,0.16)",
    glow: "0 0 0 1px rgba(255,255,255,0.04), 0 0 42px rgba(244,114,182,0.10)",
    hero: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(244,114,182,0.08) 52%, rgba(0,0,0,0) 84%)",
  },
  lime: {
    id: "lime",
    name: "Lime",
    label: "Subtle signal green",
    accent: "#7C3AED",
    accentAlt: "#A3E635",
    hot: "#D946EF",
    lime: "#A3E635",
    border: "rgba(163,230,53,0.14)",
    accentSoft: "rgba(124,58,237,0.12)",
    glow: "0 0 0 1px rgba(255,255,255,0.04), 0 0 38px rgba(163,230,53,0.09)",
    hero: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(163,230,53,0.07) 54%, rgba(0,0,0,0) 84%)",
  },
  orchid: {
    id: "orchid",
    name: "Orchid",
    label: "Quiet violet / editorial",
    accent: "#9333EA",
    accentAlt: "#DDD6FE",
    hot: "#E879F9",
    lime: "#84CC16",
    border: "rgba(255,255,255,0.08)",
    accentSoft: "rgba(147,51,234,0.10)",
    glow: "0 0 0 1px rgba(255,255,255,0.04), 0 0 28px rgba(147,51,234,0.08)",
    hero: "linear-gradient(135deg, rgba(147,51,234,0.07), rgba(255,255,255,0.02) 58%, rgba(0,0,0,0) 84%)",
  },
  plasma: {
    id: "plasma",
    name: "Plasma",
    label: "Purple / hot pink",
    accent: "#9333EA",
    accentAlt: "#EC4899",
    hot: "#F472B6",
    lime: "#A3E635",
    border: "rgba(236,72,153,0.12)",
    accentSoft: "rgba(147,51,234,0.13)",
    glow: "0 0 0 1px rgba(255,255,255,0.04), 0 0 48px rgba(236,72,153,0.10)",
    hero: "linear-gradient(135deg, rgba(147,51,234,0.08), rgba(244,114,182,0.09) 54%, rgba(0,0,0,0) 84%)",
  },
  mono: {
    id: "mono",
    name: "Mono Hyper",
    label: "Black / silver / violet",
    accent: "#7C3AED",
    accentAlt: "#D4D4D8",
    hot: "#C084FC",
    lime: "#84CC16",
    border: "rgba(255,255,255,0.08)",
    accentSoft: "rgba(124,58,237,0.09)",
    glow: "0 0 0 1px rgba(255,255,255,0.04), 0 0 20px rgba(124,58,237,0.06)",
    hero: "linear-gradient(135deg, rgba(124,58,237,0.05), rgba(255,255,255,0.02) 58%, rgba(0,0,0,0) 84%)",
  },
};

const brandModes = {
  nexus: {
    id: "nexus",
    name: "Nexus",
    label: "Balanced monogram",
    logoStyle: "hex",
    wordmark: "WithAgents",
    tracking: "-0.03em",
    badge: "Balanced system brand",
  },
  index: {
    id: "index",
    name: "Index",
    label: "Editorial lowercase",
    logoStyle: "orbit",
    wordmark: "withagents",
    tracking: "-0.04em",
    badge: "Editorial product index",
  },
  command: {
    id: "command",
    name: "Command",
    label: "Sharper uppercase",
    logoStyle: "monogram",
    wordmark: "WITHAGENTS",
    tracking: "0.08em",
    badge: "Systems-first identity",
  },
  pen: {
    id: "pen",
    name: "Glyph",
    label: "Icon-led wordmark",
    logoStyle: "pen",
    wordmark: "WithAgents",
    tracking: "-0.03em",
    badge: "Writing-forward mark",
  },
  frame: {
    id: "frame",
    name: "Frame",
    label: "Quiet enterprise",
    logoStyle: "frame",
    wordmark: "WithAgents",
    tracking: "-0.02em",
    badge: "Minimal enterprise lockup",
  },
};

const typeSystems = {
  inter: {
    id: "inter",
    name: "Inter",
    label: "Neutral / product",
    display: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    body: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "JetBrains Mono, SFMono-Regular, Menlo, monospace",
  },
  sora: {
    id: "sora",
    name: "Sora",
    label: "Modern / geometric",
    display: "Sora, Inter, ui-sans-serif, system-ui, sans-serif",
    body: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "JetBrains Mono, SFMono-Regular, Menlo, monospace",
  },
  grotesk: {
    id: "grotesk",
    name: "Space Grotesk",
    label: "Sharper / technical",
    display: "Space Grotesk, Inter, ui-sans-serif, system-ui, sans-serif",
    body: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    mono: "JetBrains Mono, SFMono-Regular, Menlo, monospace",
  },
  manrope: {
    id: "manrope",
    name: "Manrope",
    label: "Clean / premium",
    display: "Manrope, Inter, ui-sans-serif, system-ui, sans-serif",
    body: "Manrope, Inter, ui-sans-serif, system-ui, sans-serif",
    mono: "JetBrains Mono, SFMono-Regular, Menlo, monospace",
  },
  plex: {
    id: "plex",
    name: "IBM Plex Sans",
    label: "Structured / editorial",
    display: "IBM Plex Sans, Inter, ui-sans-serif, system-ui, sans-serif",
    body: "IBM Plex Sans, Inter, ui-sans-serif, system-ui, sans-serif",
    mono: "IBM Plex Mono, SFMono-Regular, Menlo, monospace",
  },
};

const products = [
  {
    name: "Runbooks",
    icon: Workflow,
    summary:
      "Opinionated workflows for triage, analysis, and execution across real internal systems.",
    tags: ["Agents", "Ops", "Execution"],
  },
  {
    name: "Memory Layer",
    icon: BrainCircuit,
    summary:
      "Practical patterns for preserving context across sessions, tools, and multi-step work.",
    tags: ["Memory", "State", "Context"],
  },
  {
    name: "Operator UI",
    icon: LayoutGrid,
    summary:
      "Clean interfaces for inspecting runs, stepping in when needed, and keeping systems legible.",
    tags: ["UI", "Review", "Control"],
  },
];

const writings = [
  {
    title: "Agent workflows should read like operating systems, not demos",
    kind: "Essay",
    date: "Apr 2026",
    excerpt:
      "The strongest agent products are bounded, inspectable, and easy to recover when the world gets messy.",
  },
  {
    title: "The layer between chat and automation is where the real product work lives",
    kind: "Field note",
    date: "Mar 2026",
    excerpt:
      "Most teams do not need theatrical autonomy. They need systems that can take on structured work without becoming opaque.",
  },
  {
    title: "What I look for before trusting an agent stack in production",
    kind: "Guide",
    date: "Feb 2026",
    excerpt:
      "The signal is usually in the contracts, retries, memory boundaries, and review paths, not the benchmark screenshots.",
  },
];

const projects = [
  {
    title: "Agent Platform",
    subtitle: "A control plane for agent runs",
    description:
      "Timelines, checkpoints, logs, and policy gates for teams running agentic workflows against real systems.",
    links: ["Architecture", "GitHub", "Writeup"],
  },
  {
    title: "Memory Patterns",
    subtitle: "Reference patterns for durable context",
    description:
      "Working approaches to session state, summary layers, artifact retention, and retrieval that survive scale.",
    links: ["Patterns", "Repo", "Notes"],
  },
  {
    title: "Operator Screens",
    subtitle: "Minimal interfaces for supervising agents",
    description:
      "Review surfaces built around clarity, intervention, escalation, and fast comprehension under load.",
    links: ["Preview", "Components", "Spec"],
  },
];

const openSource = [
  {
    name: "agent-contracts",
    text: "Typed tool schemas and execution envelopes for safer agent-to-tool interactions.",
    stars: "1.4k",
  },
  {
    name: "trace-timeline",
    text: "A compact event viewer for inspecting step-by-step agent runs across retries and branches.",
    stars: "920",
  },
  {
    name: "context-layers",
    text: "Composable patterns for short-term memory, summary memory, and retrieved memory in agent systems.",
    stars: "2.1k",
  },
];

const engagements = [
  "Internal copilots for domain-specific workflows",
  "Operator UX for human-in-the-loop review",
  "Agent orchestration for high-signal internal tasks",
  "Knowledge interfaces and tool-safe automation",
];

const pages = ["Home", "Products", "Writing", "Open Source", "About"];

function cardStyle(theme, elevated = false) {
  return {
    borderColor: theme.border,
    background: elevated ? theme.panel2 : theme.panel,
    boxShadow: elevated ? theme.glow : "none",
  };
}

function textStyles(type) {
  return {
    body: { fontFamily: type.body },
    display: { fontFamily: type.display },
    mono: { fontFamily: type.mono },
  };
}

function getTheme(accent) {
  return {
    ...surface,
    ...accent,
  };
}

function Logo({ theme, brand, type, compact = false }) {
  const styles = textStyles(type);
  const common = {
    width: compact ? 34 : 42,
    height: compact ? 34 : 42,
    viewBox: "0 0 42 42",
    fill: "none",
  };

  const icon = (() => {
    switch (brand.logoStyle) {
      case "monogram":
        return (
          <svg {...common}>
            <path d="M8 31V11l6 6 7-9 7 9 6-6v20" stroke={theme.accent} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 33h22" stroke={theme.hot} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case "orbit":
        return (
          <svg {...common}>
            <circle cx="21" cy="21" r="15" stroke={theme.accentAlt} strokeWidth="2.4" opacity="0.9" />
            <path d="M10 25c4-11 13-15 22-8" stroke={theme.accent} strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="30.5" cy="15" r="2.5" fill={theme.hot} />
          </svg>
        );
      case "pen":
        return (
          <svg {...common}>
            <path d="M21 6l8 8-8 22-8-22 8-8z" stroke={theme.hot} strokeWidth="2.4" fill={theme.accentSoft} />
            <path d="M21 12v11" stroke={theme.text} strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="9" cy="18" r="2.3" fill={theme.lime} />
            <circle cx="33" cy="18" r="2.3" fill={theme.accent} />
          </svg>
        );
      case "frame":
        return (
          <svg {...common}>
            <rect x="7" y="7" width="28" height="28" rx="14" stroke={theme.accent} strokeWidth="2.4" />
            <path d="M12 26c4-8 8-10 18-10" stroke={theme.accentAlt} strokeWidth="2.4" strokeLinecap="round" />
            <path d="M16 30h13" stroke={theme.hot} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg {...common}>
            <path d="M10 30V12l8 8 3-4 3 4 8-8v18" stroke={theme.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 31.5h26" stroke={theme.hot} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
    }
  })();

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl border" style={{ borderColor: theme.border, background: theme.panel2, boxShadow: theme.glow }}>
        {icon}
      </div>
      <div>
        <div className="text-[1.1rem] font-semibold leading-none" style={{ ...styles.display, letterSpacing: brand.tracking }}>
          {brand.wordmark}
        </div>
      </div>
    </div>
  );
}

function SwitcherSection({ title, icon: Icon, items, activeId, onChange, theme, type }) {
  const styles = textStyles(type);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium" style={styles.body}>
        <Icon size={15} style={{ color: theme.accentAlt }} />
        {title}
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="rounded-2xl border px-3 py-3 text-left transition hover:translate-y-[-1px]"
              style={{
                borderColor: active ? theme.accent : theme.border,
                background: active ? theme.accentSoft : theme.panel2,
                boxShadow: active ? theme.glow : "none",
              }}
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-medium" style={styles.body}>{item.name}</span>
                {active ? <Check size={14} style={{ color: theme.accentAlt }} /> : null}
              </div>
              <div className="text-xs" style={{ ...styles.body, color: theme.muted }}>
                {item.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TopNav({ theme, brand, type, page, setPage, mobileOpen, setMobileOpen }) {
  const styles = textStyles(type);
  return (
    <div
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{
        borderColor: theme.border,
        background: "rgba(5,5,5,0.76)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Logo theme={theme} brand={brand} type={type} compact />
        <div className="hidden items-center gap-2 md:flex">
          {pages.map((item) => (
            <button
              key={item}
              onClick={() => setPage(item)}
              className="rounded-full px-4 py-2 text-sm transition"
              style={{
                ...styles.body,
                color: page === item ? theme.text : theme.muted,
                background: page === item ? theme.accentSoft : "transparent",
                border: page === item ? `1px solid ${theme.border}` : "1px solid transparent",
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            className="hidden rounded-full border px-4 py-2 text-sm md:inline-flex"
            style={{ ...styles.body, borderColor: theme.border, background: theme.panel }}
          >
            Subscribe
          </button>
          <button
            className="inline-flex rounded-xl border p-2 md:hidden"
            style={{ borderColor: theme.border, background: theme.panel }}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t md:hidden"
            style={{ borderColor: theme.border, background: theme.panel }}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4">
              {pages.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setPage(item);
                    setMobileOpen(false);
                  }}
                  className="rounded-xl px-3 py-3 text-left"
                  style={{
                    ...styles.body,
                    color: page === item ? theme.text : theme.muted,
                    background: page === item ? theme.accentSoft : "transparent",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionTitle({ eyebrow, title, text, theme, type, action }) {
  const styles = textStyles(type);
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em]" style={{ ...styles.body, color: theme.accentAlt }}>
          {eyebrow}
        </div>
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl" style={styles.display}>{title}</h2>
        {text ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 md:text-base" style={{ ...styles.body, color: theme.muted }}>
            {text}
          </p>
        ) : null}
      </div>
      {action ? (
        <button className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ ...styles.body, borderColor: theme.border, background: theme.panel }}>
          {action} <ArrowUpRight size={16} />
        </button>
      ) : null}
    </div>
  );
}

function HomePage({ theme, brand, type, setPage }) {
  const styles = textStyles(type);
  return (
    <div className="space-y-8">
      <section
        className="relative overflow-hidden rounded-[2rem] border p-6 md:p-10"
        style={{ ...cardStyle(theme), boxShadow: theme.glow }}
      >
        <div className="absolute inset-0" style={{ background: theme.hero }} />
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: `radial-gradient(circle at 20% 20%, ${theme.accentSoft}, transparent 35%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.04), transparent 20%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent 26%)` }} />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium" style={{ ...styles.body, borderColor: theme.border, background: "rgba(255,255,255,0.02)", color: theme.accentAlt }}>
              <Sparkles size={14} /> {brand.badge}
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl" style={styles.display}>
              Products, systems, and notes for agentic work.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 md:text-lg" style={{ ...styles.body, color: theme.muted }}>
              WithAgents is a home for applied agent design: products, open-source work, and writing about what holds up in production.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setPage("Products")} className="rounded-full px-5 py-3 text-sm font-medium" style={{ ...styles.body, background: theme.accent, color: "white" }}>
                Explore products
              </button>
              <button onClick={() => setPage("Writing")} className="rounded-full border px-5 py-3 text-sm font-medium" style={{ ...styles.body, borderColor: theme.border, background: theme.panel2 }}>
                Read the writing
              </button>
            </div>
            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {[
                ["Products", "Compact systems, interfaces, and patterns made to be used"],
                ["Writing", "Essays, field notes, and implementation guides"],
                ["Open source", "Reference repos shaped by real workflow constraints"],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border p-4" style={{ borderColor: theme.border, background: "rgba(255,255,255,0.02)" }}>
                  <div className="font-medium" style={styles.display}>{title}</div>
                  <div className="mt-2 text-sm leading-6" style={{ ...styles.body, color: theme.muted }}>
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[1.75rem] border p-5" style={{ borderColor: theme.border, background: theme.panel2 }}>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium" style={styles.body}>
                <MoonStar size={16} style={{ color: theme.accentAlt }} /> Current focus
              </div>
              <div className="space-y-3">
                {[
                  "Operator interfaces for human-in-the-loop workflows",
                  "Execution timelines and review surfaces for agents",
                  "Memory layers that survive real product constraints",
                  "Tool contracts and safe execution envelopes",
                ].map((item) => (
                  <div key={item} className="rounded-xl border px-3 py-3 text-sm" style={{ ...styles.body, borderColor: theme.border, background: theme.panel }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[1.75rem] border p-5" style={{ borderColor: theme.border, background: theme.panel2 }}>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium" style={styles.body}>
                <Briefcase size={16} style={{ color: theme.hot }} /> In practice
              </div>
              <p className="text-sm leading-6" style={{ ...styles.body, color: theme.muted }}>
                The public surface is products, notes, and tools. Underneath that is applied work: helping teams introduce agentic systems where they can create leverage without creating chaos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {products.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.name}
              whileHover={{ y: -4 }}
              className="rounded-[1.5rem] border p-5"
              style={{ ...cardStyle(theme), boxShadow: theme.glow }}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border" style={{ borderColor: theme.border, background: theme.panel2 }}>
                <Icon size={20} style={{ color: theme.accentAlt }} />
              </div>
              <div className="text-xl font-semibold tracking-tight" style={styles.display}>{item.name}</div>
              <p className="mt-3 text-sm leading-6" style={{ ...styles.body, color: theme.muted }}>
                {item.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full border px-3 py-1 text-xs" style={{ ...styles.body, borderColor: theme.border, background: theme.panel2 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.75rem] border p-6" style={cardStyle(theme)}>
          <SectionTitle
            eyebrow="Writing"
            title="Notes from the field"
            text="Not trend pieces. Working notes on building agentic products that need to be comprehensible, reliable, and useful."
            theme={theme}
            type={type}
            action="View all writing"
          />
          <div className="space-y-4">
            {writings.map((post) => (
              <div key={post.title} className="rounded-2xl border p-4" style={{ borderColor: theme.border, background: theme.panel2 }}>
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em]" style={{ ...styles.body, color: theme.accentAlt }}>
                  <span>{post.kind}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
                <div className="mt-3 text-lg font-medium" style={styles.display}>{post.title}</div>
                <p className="mt-2 text-sm leading-6" style={{ ...styles.body, color: theme.muted }}>
                  {post.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] border p-6" style={cardStyle(theme)}>
          <SectionTitle
            eyebrow="Open source"
            title="Tools shaped by real problems"
            text="The repo list reads like the site itself: small systems, durable patterns, and operational clarity."
            theme={theme}
            type={type}
          />
          <div className="space-y-4">
            {openSource.map((repo) => (
              <div key={repo.name} className="rounded-2xl border p-4" style={{ borderColor: theme.border, background: theme.panel2 }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 font-medium" style={styles.display}>
                      <Code2 size={16} style={{ color: theme.accentAlt }} /> {repo.name}
                    </div>
                    <p className="mt-2 text-sm leading-6" style={{ ...styles.body, color: theme.muted }}>
                      {repo.text}
                    </p>
                  </div>
                  <span className="rounded-full border px-3 py-1 text-xs" style={{ ...styles.body, borderColor: theme.border, background: theme.panel }}>
                    ★ {repo.stars}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductsPage({ theme, type }) {
  const styles = textStyles(type);
  return (
    <div>
      <SectionTitle
        eyebrow="Products"
        title="A product surface for agentic work"
        text="Products here are opinionated artifacts: small systems, interfaces, and patterns that make agentic work easier to inspect, ship, and extend."
        theme={theme}
        type={type}
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {projects.map((project, idx) => (
          <div key={project.title} className="rounded-[1.5rem] border p-5" style={{ ...cardStyle(theme), boxShadow: theme.glow }}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border" style={{ borderColor: theme.border, background: theme.panel2 }}>
              {React.createElement([Cpu, Component, Wrench][idx], { size: 20, style: { color: theme.accentAlt } })}
            </div>
            <div className="text-xl font-semibold" style={styles.display}>{project.title}</div>
            <div className="mt-1 text-sm" style={{ ...styles.body, color: theme.accentAlt }}>
              {project.subtitle}
            </div>
            <p className="mt-4 text-sm leading-6" style={{ ...styles.body, color: theme.muted }}>
              {project.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.links.map((link) => (
                <button key={link} className="rounded-full border px-3 py-1.5 text-xs" style={{ ...styles.body, borderColor: theme.border, background: theme.panel2 }}>
                  {link}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-[1.75rem] border p-6" style={cardStyle(theme)}>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="text-xl font-semibold" style={styles.display}>What the product layer is doing</div>
            <p className="mt-3 text-sm leading-6" style={{ ...styles.body, color: theme.muted }}>
              The product layer is intentionally clean: reference tools, operating patterns, and lightweight interfaces that make agentic systems legible. The goal is not maximal complexity. It is systems that hold up under real use.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              "Execution visibility",
              "Operator intervention",
              "Context persistence",
              "Tool-safe contracts",
            ].map((item) => (
              <div key={item} className="rounded-2xl border p-4 text-sm" style={{ ...styles.body, borderColor: theme.border, background: theme.panel2 }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WritingPage({ theme, type }) {
  const styles = textStyles(type);
  return (
    <div>
      <SectionTitle
        eyebrow="Writing"
        title="Writing grounded in building"
        text="The writing stays close to the work: clear, practical, and grounded in building rather than hype."
        theme={theme}
        type={type}
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {writings.map((post, idx) => (
          <div key={post.title} className="rounded-[1.5rem] border p-5" style={{ ...cardStyle(theme), boxShadow: theme.glow }}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border" style={{ borderColor: theme.border, background: theme.panel2 }}>
              {React.createElement([BookOpen, FileText, FlaskConical][idx], { size: 20, style: { color: theme.hot } })}
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]" style={{ ...styles.body, color: theme.accentAlt }}>
              <span>{post.kind}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
            <div className="mt-3 text-lg font-semibold" style={styles.display}>{post.title}</div>
            <p className="mt-3 text-sm leading-6" style={{ ...styles.body, color: theme.muted }}>
              {post.excerpt}
            </p>
            <button className="mt-5 inline-flex items-center gap-2 text-sm" style={{ ...styles.body, color: theme.text }}>
              Read article <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-[1.75rem] border p-6" style={cardStyle(theme)}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border p-5" style={{ borderColor: theme.border, background: theme.panel2 }}>
            <div className="mb-2 font-medium" style={styles.display}>Editorial lens</div>
            <p className="text-sm leading-6" style={{ ...styles.body, color: theme.muted }}>
              Practical agent design, human-in-the-loop systems, product surface area, internal tools, and reliability as a design discipline.
            </p>
          </div>
          <div className="rounded-2xl border p-5" style={{ borderColor: theme.border, background: theme.panel2 }}>
            <div className="mb-2 font-medium" style={styles.display}>Formats</div>
            <p className="text-sm leading-6" style={{ ...styles.body, color: theme.muted }}>
              Long-form essays, field notes, architecture walk-throughs, repo write-ups, implementation guides, and visual references.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OSSPage({ theme, type }) {
  const styles = textStyles(type);
  return (
    <div>
      <SectionTitle
        eyebrow="Open source"
        title="Open source shaped by real constraints"
        text="The open-source work mirrors the broader brand: compact abstractions, practical interfaces, and patterns that earn their keep."
        theme={theme}
        type={type}
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {openSource.map((repo) => (
          <div key={repo.name} className="rounded-[1.5rem] border p-5" style={{ ...cardStyle(theme), boxShadow: theme.glow }}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-lg font-semibold" style={styles.display}>
                <Code2 size={18} style={{ color: theme.accentAlt }} /> {repo.name}
              </div>
              <span className="rounded-full border px-3 py-1 text-xs" style={{ ...styles.body, borderColor: theme.border, background: theme.panel2 }}>
                ★ {repo.stars}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6" style={{ ...styles.body, color: theme.muted }}>
              {repo.text}
            </p>
            <div className="mt-5 flex gap-2">
              {["Repo", "Docs", "Examples"].map((item) => (
                <button key={item} className="rounded-full border px-3 py-1.5 text-xs" style={{ ...styles.body, borderColor: theme.border, background: theme.panel2 }}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-[1.75rem] border p-6" style={cardStyle(theme)}>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["6", "Public repos"],
            ["3", "Core systems"],
            ["28", "Reference components"],
            ["100%", "Built to be read"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border p-5 text-center" style={{ borderColor: theme.border, background: theme.panel2 }}>
              <div className="text-3xl font-semibold" style={{ ...styles.display, color: theme.accentAlt }}>{value}</div>
              <div className="mt-2 text-sm" style={{ ...styles.body, color: theme.muted }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutPage({ theme, type }) {
  const styles = textStyles(type);
  return (
    <div>
      <SectionTitle
        eyebrow="About"
        title="A quiet brand around applied agent design"
        text="WithAgents is intentionally presented as a product-and-ideas home first: things to read, use, inspect, and learn from. The more applied side stays present, but understated."
        theme={theme}
        type={type}
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[1.75rem] border p-6" style={cardStyle(theme)}>
          <div className="text-xl font-semibold" style={styles.display}>What lives here</div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ["Products", "Interfaces, tools, and compact productized systems"],
              ["Writing", "Essays, notes, architecture thinking, and field observations"],
              ["Open source", "Reference repos and reusable building blocks"],
              ["Applied systems", "Quiet collaboration where these ideas need to live inside real organizations"],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border p-4" style={{ borderColor: theme.border, background: theme.panel2 }}>
                <div className="font-medium" style={styles.display}>{title}</div>
                <p className="mt-2 text-sm leading-6" style={{ ...styles.body, color: theme.muted }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] border p-6" style={cardStyle(theme)}>
          <div className="mb-4 text-xl font-semibold" style={styles.display}>Selected areas</div>
          <div className="space-y-3">
            {engagements.map((item) => (
              <div key={item} className="rounded-2xl border px-4 py-4 text-sm" style={{ ...styles.body, borderColor: theme.border, background: theme.panel2 }}>
                {item}
              </div>
            ))}
          </div>
          <button className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ ...styles.body, borderColor: theme.border, background: theme.panel2 }}>
            Start a conversation <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WithAgentsInteractiveBrandLab() {
  const [accentId, setAccentId] = useState("ultraviolet");
  const [brandId, setBrandId] = useState("nexus");
  const [typeId, setTypeId] = useState("inter");
  const [page, setPage] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useMemo(() => getTheme(accentThemes[accentId]), [accentId]);
  const brand = useMemo(() => brandModes[brandId], [brandId]);
  const type = useMemo(() => typeSystems[typeId], [typeId]);
  const styles = textStyles(type);

  const pageComponent = useMemo(() => {
    switch (page) {
      case "Products":
        return <ProductsPage theme={theme} type={type} />;
      case "Writing":
        return <WritingPage theme={theme} type={type} />;
      case "Open Source":
        return <OSSPage theme={theme} type={type} />;
      case "About":
        return <AboutPage theme={theme} type={type} />;
      default:
        return <HomePage theme={theme} brand={brand} type={type} setPage={setPage} />;
    }
  }, [page, theme, brand, type]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: `radial-gradient(circle at top, ${theme.accentSoft}, transparent 26%), ${theme.bg}`,
        color: theme.text,
        fontFamily: type.body,
      }}
    >
      <TopNav
        theme={theme}
        brand={brand}
        type={type}
        page={page}
        setPage={setPage}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        <section className="mb-8 rounded-[2rem] border p-5 md:p-6" style={cardStyle(theme)}>
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ ...styles.body, color: theme.accentAlt }}>
                Hyper black brand lab
              </div>
              <div className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl" style={styles.display}>
                Change accents, branding, and typography without leaving the same dark WithAgents world.
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 md:text-base" style={{ ...styles.body, color: theme.muted }}>
                Everything stays rooted in a black, minimal, product-first system. What changes is the accent language, the mark, and the type system.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs" style={{ ...styles.body, borderColor: theme.border, background: theme.panel2, color: theme.muted }}>
              <Orbit size={14} style={{ color: theme.accentAlt }} /> Live brand, theme, and type switching
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-[1.5rem] border p-4" style={{ borderColor: theme.border, background: theme.panel2 }}>
              <SwitcherSection
                title="Accent"
                icon={Palette}
                items={Object.values(accentThemes)}
                activeId={accentId}
                onChange={setAccentId}
                theme={theme}
                type={type}
              />
            </div>
            <div className="rounded-[1.5rem] border p-4" style={{ borderColor: theme.border, background: theme.panel2 }}>
              <SwitcherSection
                title="Branding"
                icon={Sparkles}
                items={Object.values(brandModes)}
                activeId={brandId}
                onChange={setBrandId}
                theme={theme}
                type={type}
              />
            </div>
            <div className="rounded-[1.5rem] border p-4" style={{ borderColor: theme.border, background: theme.panel2 }}>
              <SwitcherSection
                title="Typography"
                icon={Type}
                items={Object.values(typeSystems)}
                activeId={typeId}
                onChange={setTypeId}
                theme={theme}
                type={type}
              />
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border p-4 md:p-5" style={{ borderColor: theme.border, background: theme.panel }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <Logo theme={theme} brand={brand} type={type} />
              <div className="grid gap-2 md:grid-cols-3">
                <div className="rounded-2xl border px-4 py-3" style={{ borderColor: theme.border, background: theme.panel2 }}>
                  <div className="text-[11px] uppercase tracking-[0.22em]" style={{ ...styles.body, color: theme.accentAlt }}>Accent</div>
                  <div className="mt-1 text-sm font-medium" style={styles.display}>{accentThemes[accentId].name}</div>
                </div>
                <div className="rounded-2xl border px-4 py-3" style={{ borderColor: theme.border, background: theme.panel2 }}>
                  <div className="text-[11px] uppercase tracking-[0.22em]" style={{ ...styles.body, color: theme.accentAlt }}>Brand</div>
                  <div className="mt-1 text-sm font-medium" style={styles.display}>{brandModes[brandId].name}</div>
                </div>
                <div className="rounded-2xl border px-4 py-3" style={{ borderColor: theme.border, background: theme.panel2 }}>
                  <div className="text-[11px] uppercase tracking-[0.22em]" style={{ ...styles.body, color: theme.accentAlt }}>Type</div>
                  <div className="mt-1 text-sm font-medium" style={styles.display}>{typeSystems[typeId].name}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${accentId}-${brandId}-${typeId}-${page}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
          >
            {pageComponent}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
