/* =====================================================================
   SHOWCASE · HERO + SYSTEM SWITCHER + INDEX
   The top of the page. Switcher is sticky; the hero re-renders to show
   each system's voice in its own typeface.
   ===================================================================== */

function WAStickyBar({ systemId, accentId, onSystem, onAccent }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      background: 'color-mix(in srgb, var(--bg) 78%, transparent)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 40px',
        display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="live-dot" />
          <span className="mono" style={{ fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--text-3)' }}>
            withagents · design systems
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Object.entries(window.WA_DESIGN_SYSTEMS).map(([id, s]) => (
            <button key={id}
              className={`ds-system-pill ${systemId === id ? 'active' : ''}`}
              onClick={() => onSystem(id)}>
              {s.name}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'var(--text-4)', marginRight: 6 }}>accent</span>
          {window.WA_ACCENTS.map((a) => (
            <button key={a.id}
              onClick={() => onAccent(a.id)}
              title={a.name}
              style={{
                width: 22, height: 22, borderRadius: 999,
                background: a.primary,
                border: accentId === a.id
                  ? '2px solid var(--text)'
                  : '1px solid var(--border)',
                cursor: 'pointer', padding: 0,
                boxShadow: accentId === a.id ? `0 0 14px ${a.primary}` : 'none',
              }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function WAHero({ systemId }) {
  const sys = window.WA_DESIGN_SYSTEMS[systemId];
  // Each system gets a slightly different hero composition that matches
  // the personality: same words, different staging.
  const head = (
    <h1 className="display ds-h" style={{ fontSize: 'clamp(56px, 9vw, 124px)',
      margin: '0 0 32px', maxWidth: '14ch', textWrap: 'balance' }}>
      One system, <em>five voices.</em>
    </h1>
  );
  const lede = (
    <p style={{ fontSize: 19, color: 'var(--text-2)', maxWidth: '52ch',
      lineHeight: 1.55, marginBottom: 28 }}>
      Every primitive on this page — type, color, geometry, components,
      diagrams — flips together when you change the pill above. Same content,
      same evidence. Different posture toward the reader.
    </p>
  );
  return (
    <section style={{ padding: '88px 0 56px', position: 'relative' }}>
      <div className="eyebrow" style={{ marginBottom: 24 }}>
        <span className="live-dot" /> {sys.tag}
      </div>
      {head}
      {lede}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
        <button className="btn primary">View as a post</button>
        <button className="btn">Open product page</button>
        <button className="btn ghost">Diff vs. previous</button>
      </div>
      <div className="shimmer-line" style={{ marginTop: 48 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))',
        gap: 40, marginTop: 40, paddingTop: 8 }}>
        {[
          ['23,479', 'sessions logged'],
          ['19',     'evidence posts'],
          ['6',      'shipped products'],
          ['5',      'design systems'],
        ].map(([n, lbl]) => (
          <div key={lbl}>
            <div className="display" style={{ fontSize: 56, lineHeight: 1, marginBottom: 8 }}>{n}</div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: 'var(--text-3)' }}>{lbl}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WASystemIndex({ systemId, onSystem }) {
  return (
    <section className="ds-section">
      <SectionHeader num="00" eyebrow="The five systems" title="Pick a posture." />
      <div style={{ display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 16 }}>
        {Object.entries(window.WA_DESIGN_SYSTEMS).map(([id, s]) => (
          <button key={id} onClick={() => onSystem(id)}
            className="card hoverable glow"
            style={{ padding: 20, textAlign: 'left', cursor: 'pointer',
              fontFamily: 'inherit', color: 'inherit',
              borderColor: systemId === id ? 'var(--accent)' : 'var(--border)' }}>
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
              {String(Object.keys(window.WA_DESIGN_SYSTEMS).indexOf(id) + 1).padStart(2, '0')} ·
              {' '}{s.role}
            </div>
            <div className="display" style={{ fontSize: 24, marginBottom: 8 }}>{s.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
              {s.desc}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ num, eyebrow, title, sub }) {
  return (
    <div style={{ marginBottom: 40, display: 'grid',
      gridTemplateColumns: '60px 1fr', gap: 24, alignItems: 'baseline' }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: '0.18em',
        color: 'var(--text-4)', paddingTop: 6 }}>§ {num}</div>
      <div>
        <div className="eyebrow" style={{ marginBottom: 12 }}>{eyebrow}</div>
        <h2 className="display ds-h" style={{ fontSize: 'clamp(36px, 5vw, 56px)',
          margin: 0, maxWidth: '20ch', textWrap: 'balance' }}>{title}</h2>
        {sub && <p style={{ fontSize: 16, color: 'var(--text-2)',
          maxWidth: '60ch', lineHeight: 1.6, marginTop: 16 }}>{sub}</p>}
      </div>
    </div>
  );
}

Object.assign(window, { WAStickyBar, WAHero, WASystemIndex, SectionHeader });
