// ui_kits/withagents-site/Components.jsx
//
// High-fidelity React components distilled from the WithAgents site.
// All components use the design tokens from /colors_and_type.css.
//
// Usage:
//   <link rel="stylesheet" href="../../colors_and_type.css">
//   <script type="text/babel" src="Components.jsx"></script>
//
// Then mount any of the exported components: WAMark, WANav, WAFooter,
// WAEyebrow, WAStatusPill, PostCard, ProductCard, GateDiagram.

const ACCENT = '#FF3D52';

// ---- Mark ------------------------------------------------------------------
function WAMark({ size = 22, color = ACCENT }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
      <rect x="3" y="5" width="26" height="22" rx="5" fill={color} />
      <circle cx="16" cy="3" r="1.6" fill={color} />
      <line x1="16" y1="4" x2="16" y2="7" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <rect x="9" y="13" width="4" height="6" rx="1.2" fill="#0a0a0a" />
      <rect x="19" y="13" width="4" height="6" rx="1.2" fill="#0a0a0a" />
      <rect x="12" y="22" width="8" height="1.6" rx="0.8" fill="#0a0a0a" />
    </svg>
  );
}

// ---- Eyebrow ---------------------------------------------------------------
function WAEyebrow({ num, label, accent = ACCENT }) {
  return (
    <div className="wa-mono" style={{
      display: 'inline-flex', alignItems: 'center', gap: 12,
      fontSize: 11, letterSpacing: 2.4, fontWeight: 700, color: accent,
      marginBottom: 16,
    }}>
      <span style={{ width: 24, height: 1, background: accent, opacity: 0.5 }} />
      {String(num).padStart(2, '0')} · {label.toUpperCase()}
    </div>
  );
}

// ---- Status Pill -----------------------------------------------------------
function WAStatusPill({ label = 'SYSTEM STATUS · NOMINAL', accent = ACCENT }) {
  return (
    <div className="wa-pill" style={{ ['--wa-accent']: accent }}>
      <span>{label}</span>
    </div>
  );
}

// ---- Nav -------------------------------------------------------------------
function WANav({ accent = ACCENT, current = 'home' }) {
  const items = [
    { id: 'home',     label: 'Home' },
    { id: 'series',   label: 'The Series' },
    { id: 'products', label: 'Products' },
    { id: 'about',    label: 'About' },
  ];
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', height: 64,
      background: 'rgba(8,8,10,0.7)', backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--wa-line)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <WAMark size={22} color={accent} />
        <span className="wa-mono" style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 2.2 }}>
          WITHAGENTS
        </span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {items.map((it) => {
          const active = it.id === current;
          return (
            <a key={it.id} style={{
              padding: '8px 14px', borderRadius: 8, fontSize: 13,
              color: active ? '#f4f3ee' : 'rgba(244,243,238,0.6)',
              background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
              cursor: 'pointer', textDecoration: 'none',
            }}>{it.label}</a>
          );
        })}
      </div>
    </nav>
  );
}

// ---- Post Card -------------------------------------------------------------
function PostCard({ num, title, subtitle, read, tags = [], accent = ACCENT, glyph }) {
  return (
    <article style={{
      padding: 24, borderRadius: 14,
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.08)',
      cursor: 'pointer', transition: 'all 120ms cubic-bezier(0.2,0.6,0.2,1)',
      display: 'flex', flexDirection: 'column', gap: 14, height: '100%',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="wa-mono" style={{
          fontSize: 28, fontWeight: 700, color: accent, letterSpacing: -0.6,
        }}>{String(num).padStart(2, '0')}</span>
        {glyph && <div style={{ color: accent, opacity: 0.7 }}>{glyph}</div>}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, lineHeight: 1.25, letterSpacing: -0.4 }}>{title}</h3>
        <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.5, color: 'rgba(244,243,238,0.6)' }}>{subtitle}</p>
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {tags.slice(0, 2).map((t) => (
            <span key={t} className="wa-mono" style={{
              fontSize: 10, padding: '3px 9px', borderRadius: 5,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(244,243,238,0.6)',
            }}>{t}</span>
          ))}
        </div>
        <span className="wa-mono" style={{ fontSize: 10.5, color: 'rgba(244,243,238,0.45)', letterSpacing: 1.4 }}>
          {read}
        </span>
      </div>
    </article>
  );
}

// ---- Product Card ----------------------------------------------------------
function ProductCard({ name, kicker, blurb, status = 'OPEN SOURCE', accent = ACCENT }) {
  return (
    <article style={{
      padding: 24, borderRadius: 14,
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div className="wa-mono" style={{ fontSize: 10.5, letterSpacing: 1.6, fontWeight: 700, color: accent }}>
        {kicker.toUpperCase()}
      </div>
      <h3 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: -0.8 }}>{name}</h3>
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'rgba(244,243,238,0.7)' }}>{blurb}</p>
      <div style={{ marginTop: 4 }}>
        <span className="wa-mono" style={{
          display: 'inline-block', fontSize: 10, padding: '3px 8px',
          borderRadius: 4, letterSpacing: 1.4, fontWeight: 700,
          background: 'rgba(52,208,140,0.12)', color: '#34D08C',
        }}>{status}</span>
      </div>
    </article>
  );
}

// ---- Gate Diagram (static preview of the interactive consensus gate) ------
function GateDiagram({ accent = ACCENT }) {
  const reviewers = [
    { name: 'lead',  v: 'FAIL', why: 'Both SDK and CLI paths share this flawed handler.' },
    { name: 'alpha', v: 'FAIL', why: 'Line 926: += appends, but textBlock.text is the full message.' },
    { name: 'bravo', v: 'FAIL', why: 'Run: "Four." renders as "Four.Four." on second token.' },
  ];
  return (
    <div style={{
      padding: 22, borderRadius: 14,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div className="wa-mono" style={{ fontSize: 10.5, color: accent, letterSpacing: 1.6, fontWeight: 700 }}>
        CONSENSUS GATE · UNANIMOUS=<span style={{ color: '#FF6B7E' }}>FALSE</span>
      </div>
      <div style={{ marginTop: 6, fontSize: 17, fontWeight: 700, letterSpacing: -0.4 }}>
        Three reviewers, one verdict
      </div>
      <pre className="wa-mono" style={{
        margin: '14px 0 0', padding: '10px 12px', borderRadius: 8, fontSize: 12.5,
        background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', color: '#f4f3ee',
      }}>{`message.text += textBlock.text  // line 926`}</pre>
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {reviewers.map((r) => (
          <div key={r.name} style={{
            padding: '12px 14px', borderRadius: 10,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,107,126,0.35)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="wa-mono" style={{ fontSize: 10.5, letterSpacing: 1.4, fontWeight: 700, color: 'rgba(244,243,238,0.65)' }}>
                {r.name.toUpperCase()}
              </span>
              <span className="wa-mono" style={{
                fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
                letterSpacing: 1, background: 'rgba(255,107,126,0.16)', color: '#FF6B7E',
              }}>{r.v}</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 12.5, color: 'rgba(244,243,238,0.7)', lineHeight: 1.45 }}>
              {r.why}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Footer ----------------------------------------------------------------
function WAFooter({ accent = ACCENT }) {
  const cols = [
    { h: 'WRITING',  links: ['The Series', 'About'] },
    { h: 'PRODUCTS', links: ['Anneal', 'Runbooks', 'Memory Layer'] },
    { h: 'CODE',     links: ['GitHub', 'Companion Repos'] },
  ];
  return (
    <footer style={{
      padding: '56px 28px 28px', borderTop: '1px solid var(--wa-line)',
      display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', gap: 40,
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <WAMark size={28} color={accent} />
          <span className="wa-mono" style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2.2 }}>
            WITHAGENTS
          </span>
        </div>
        <p style={{ marginTop: 14, fontSize: 13, lineHeight: 1.6, color: 'rgba(244,243,238,0.55)', maxWidth: 280 }}>
          A field journal for people building real agent systems. Numbers up front, hand-wavy claims out.
        </p>
      </div>
      {cols.map((c) => (
        <div key={c.h}>
          <div className="wa-mono" style={{ fontSize: 10.5, letterSpacing: 1.6, fontWeight: 700, color: 'rgba(244,243,238,0.4)' }}>
            {c.h}
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {c.links.map((l) => (
              <a key={l} style={{ fontSize: 13.5, color: 'rgba(244,243,238,0.7)', cursor: 'pointer', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      ))}
    </footer>
  );
}

Object.assign(window, {
  WAMark, WANav, WAFooter, WAEyebrow, WAStatusPill, PostCard, ProductCard, GateDiagram,
});
