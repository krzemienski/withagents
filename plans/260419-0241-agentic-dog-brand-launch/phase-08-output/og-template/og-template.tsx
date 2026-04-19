/**
 * WithAgents OG Image Template
 * Satori-compatible React/JSX — @vercel/og on Vercel Edge
 * Target: 1200×630 PNG
 *
 * Design tokens: Hyper-black surface + Ultraviolet accent (BRIEF §4, §5)
 * Typography: Space Grotesk Bold (display) · Inter (body) · IBM Plex Mono (mono)
 *
 * Satori CSS support: flex, padding, margin, color, background, fontSize,
 * fontFamily, fontWeight, borderRadius, border, gap, width, height, display,
 * letterSpacing, lineHeight, overflow, whiteSpace, wordBreak, boxSizing
 * NOT supported: grid, pseudo-selectors, text-overflow ellipsis, calc()
 */

export type OGKind = "home" | "product" | "writing" | "opensource" | "about";

export interface OGTemplateProps {
  /** Primary headline */
  title: string;
  /** Supporting line under the title */
  subtitle?: string;
  /** Page section — controls accent word highlighting and tag colour */
  kind?: OGKind;
  /** Short label shown in mono chip (e.g. "ESSAY", "PRODUCT", "OPEN SOURCE") */
  tag?: string;
  /** Author line shown in footer left */
  byline?: string;
}

// ─── Design tokens (BRIEF §4 + §5 Ultraviolet) ───────────────────────────────
const T = {
  bgVoid:      "#040404",
  panel:       "#0A0A0D",
  border:      "rgba(255,255,255,0.10)",
  textPrimary: "#F5F5F7",
  textMuted:   "#A1A1AA",
  accent:      "#8B5CF6",
  accentAlt:   "#C084FC",
  accentWash:  "rgba(139,92,246,0.12)",
  accentWashFaint: "rgba(139,92,246,0.06)",
} as const;

// ─── Kind → accent word count hint ────────────────────────────────────────────
// For non-home pages we highlight the first 1-3 words of the title in accent.
function accentTitle(title: string, kind: OGKind): React.ReactNode {
  if (kind === "home") {
    // Home wordmark: render entire title in accent
    return (
      <span style={{ color: T.accent }}>{title}</span>
    );
  }

  // Split on space, accent first word(s) up to 2 words or first 14 chars
  const words = title.split(" ");
  const accentCount = words[0].length > 14 ? 1 : words.length >= 3 ? 2 : 1;
  const accentPart = words.slice(0, accentCount).join(" ");
  const restPart = words.slice(accentCount).join(" ");

  return (
    <>
      <span style={{ color: T.accent }}>{accentPart}</span>
      {restPart ? (
        <span style={{ color: T.textPrimary }}>{" " + restPart}</span>
      ) : null}
    </>
  );
}

// ─── Tag chip ─────────────────────────────────────────────────────────────────
function TagChip({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "4px 10px",
        background: T.accentWash,
        border: `1px solid ${T.accent}`,
        borderRadius: "4px",
        fontFamily: '"IBM Plex Mono"',
        fontSize: "11px",
        fontWeight: 400,
        letterSpacing: "0.10em",
        color: T.accent,
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  );
}

// ─── Main template ────────────────────────────────────────────────────────────
export default function OGTemplate({
  title,
  subtitle,
  kind = "home",
  tag,
  byline,
}: OGTemplateProps) {
  const hasFooter = byline || tag;
  const isHome = kind === "home";

  return (
    <div
      style={{
        display: "flex",
        width: "1200px",
        height: "630px",
        background: T.bgVoid,
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      {/* Panel frame */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: T.panel,
          border: `1px solid ${T.border}`,
          borderRadius: "12px",
          padding: "52px 60px 44px 60px",
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle radial accent wash — top-right corner, ≤6% opacity */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            background: T.accentWashFaint,
            borderRadius: "50%",
          }}
        />

        {/* Brand wordmark — top right */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            marginBottom: "0px",
            position: "absolute",
            top: "44px",
            right: "60px",
          }}
        >
          <span
            style={{
              fontFamily: '"Space Grotesk"',
              fontSize: "18px",
              fontWeight: 700,
              color: T.accent,
              letterSpacing: "-0.01em",
            }}
          >
            withagents
          </span>
        </div>

        {/* Main content area — vertically centered in the panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: "0px",
          }}
        >
          {/* Title */}
          <div
            style={{
              fontFamily: '"Space Grotesk"',
              fontSize: isHome ? 72 : 58,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              color: T.textPrimary,
              maxWidth: "920px",
              wordBreak: "break-word",
            }}
          >
            {accentTitle(title, kind)}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                fontFamily: '"Inter"',
                fontSize: "23px",
                fontWeight: 500,
                letterSpacing: "0.01em",
                lineHeight: 1.4,
                color: T.textMuted,
                marginTop: "20px",
                maxWidth: "780px",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Footer row */}
        {hasFooter && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginTop: "auto",
              paddingTop: "24px",
            }}
          >
            {/* Byline left */}
            <div
              style={{
                fontFamily: '"Inter"',
                fontSize: "16px",
                fontWeight: 400,
                color: T.textMuted,
                letterSpacing: "0.005em",
              }}
            >
              {byline ?? ""}
            </div>

            {/* Tag chip right */}
            {tag ? <TagChip label={tag} /> : <div />}
          </div>
        )}

        {/* Footer row — no byline/tag but still pin brand bottom when home */}
        {!hasFooter && isHome && (
          <div
            style={{
              display: "flex",
              width: "100%",
              marginTop: "auto",
              paddingTop: "24px",
            }}
          >
            <div
              style={{
                fontFamily: '"Inter"',
                fontSize: "16px",
                fontWeight: 400,
                color: T.textMuted,
                letterSpacing: "0.01em",
              }}
            >
              withagents.dev
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
