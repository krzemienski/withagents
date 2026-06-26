/* =====================================================================
   SHOWCASE · TYPE + COLOR + GEOMETRY
   These three sections render the system's tokens as living specimens.
   ===================================================================== */

function WATypeSection({ systemId }) {
  return (
    <section className="ds-section">
      <SectionHeader num="01" eyebrow="Type · the voice"
        title={<>Same scale. <em>Different mouth.</em></>}
        sub="One pinned 9-step scale per system. The personality lives in the family, weight, tracking, and italic posture — not in the sizes." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48,
        alignItems: 'start' }}>
        <div>
          {window.WA_TYPE_SCALE.map((t) => (
            <div key={t.name} style={{
              borderTop: '1px solid var(--hairline)',
              padding: '20px 0',
              display: 'grid', gridTemplateColumns: '1fr auto', gap: 24,
              alignItems: 'baseline',
            }}>
              <div className={t.px >= 32 ? 'display ds-h' : ''}
                style={{
                  fontSize: t.px,
                  lineHeight: t.px >= 44 ? 'var(--display-leading)' : 1.25,
                  fontFamily: t.name === 'mono' ? 'var(--font-mono)'
                    : (t.px >= 32 ? 'var(--font-display)' : 'var(--font-body)'),
                  fontWeight: t.px >= 32 ? 'var(--display-weight)' : (t.name === 'mono' ? 'var(--mono-weight)' : 400),
                  letterSpacing: t.px >= 32 ? 'var(--display-tracking)' : 'normal',
                  color: 'var(--text)',
                }}>
                {t.label === 'Hero' ? <>23,479<span style={{ color: 'var(--accent)' }}>.</span></>
                  : t.label === 'Page' ? <>The <em style={{ color: 'var(--accent)', fontStyle: 'italic',
                      fontFamily: 'var(--font-display)' }}>consensus</em> gate</>
                  : t.label === 'Section' ? 'Three roles, one verdict'
                  : t.label === 'H2' ? 'How agents disagreed'
                  : t.label === 'H3' ? 'Lead · Alpha · Bravo'
                  : t.label === 'Body LG' ? 'We logged every session and shipped what survived three readings.'
                  : t.label === 'Body' ? 'The diff is the unit of work; the verdict is the unit of trust.'
                  : t.label === 'Small' ? '02 · Posted 14 Apr · 8 min read'
                  : '> session.start · 14:02:31'}
              </div>
              <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                {t.label} · {t.px}px
              </div>
            </div>
          ))}
        </div>
        <aside className="card" style={{ padding: 22, position: 'sticky', top: 90 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Stack · live</div>
          <div style={{ display: 'grid', gap: 12, fontSize: 12, lineHeight: 1.6 }}>
            <Row k="display" v={getCSSVar('--font-display')} />
            <Row k="body"    v={getCSSVar('--font-body')} />
            <Row k="mono"    v={getCSSVar('--font-mono')} />
            <Row k="weight"  v={getCSSVar('--display-weight')} />
            <Row k="tracking" v={getCSSVar('--display-tracking')} />
            <Row k="leading" v={getCSSVar('--display-leading')} />
          </div>
        </aside>
      </div>
    </section>
  );
}

function getCSSVar(name) {
  if (typeof window === 'undefined') return '—';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    .replace(/['"]/g, '').replace(/, /g, ', ').slice(0, 56);
}

function Row({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12,
      borderBottom: '1px dashed var(--hairline)', paddingBottom: 8 }}>
      <span className="mono" style={{ color: 'var(--text-3)' }}>{k}</span>
      <span className="mono" style={{ color: 'var(--text)', textAlign: 'right' }}>{v || '—'}</span>
    </div>
  );
}

function WAColorSection({ systemId, accentId }) {
  const surfaces = [
    ['--bg', 'page'], ['--bg-2', 'panel'],
    ['--surface', 'card'], ['--surface-2', 'card hover'], ['--surface-3', 'card pressed'],
  ];
  const ink = [
    ['--text', '100', 'primary copy'],
    ['--text-2', '72', 'secondary'],
    ['--text-3', '40', 'meta · captions'],
    ['--text-4', '24', 'disabled · grid'],
  ];
  return (
    <section className="ds-section">
      <SectionHeader num="02" eyebrow="Color · the temperature"
        title={<>Black anchors. <em>Accent earns its line.</em></>}
        sub="Every system holds the page in a deep neutral and rations a single accent. Status colors stay constant across all five — pass is always green." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Surfaces */}
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 16 }}>
            Surfaces · stack
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            {surfaces.map(([k, lbl]) => (
              <div key={k} className="card" style={{ padding: 14,
                display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: 16,
                alignItems: 'center' }}>
                <div style={{ width: 40, height: 40,
                  background: `var(${k})`, border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)' }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{lbl}</div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{k}</div>
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)' }}>
                  {getCSSVar(k)}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Ink */}
        <div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 16 }}>
            Ink · ramp
          </div>
          <div className="card" style={{ padding: 22 }}>
            {ink.map(([k, pct, use]) => (
              <div key={k} style={{ padding: '14px 0',
                borderTop: '1px dashed var(--hairline)',
                display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16,
                alignItems: 'baseline' }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: `var(${k})`,
                  fontFamily: 'var(--font-display)' }}>Aa</span>
                <div>
                  <div style={{ fontSize: 13, color: `var(${k})` }}>{use}</div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{k}</div>
                </div>
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)' }}>{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accent + status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 32 }}>
        <div className="card" style={{ padding: 28, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 400px 200px at 80% 0%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)',
            pointerEvents: 'none' }} />
          <div className="eyebrow" style={{ marginBottom: 14 }}>Accent · {accentId}</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 64, background: 'var(--accent)',
              borderRadius: 'var(--radius-sm)' }} />
            <div style={{ flex: 1, height: 64, background: 'var(--accent-2)',
              borderRadius: 'var(--radius-sm)' }} />
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.7 }}>
            <div>--accent · {getCSSVar('--accent')}</div>
            <div>--accent-2 · {getCSSVar('--accent-2')}</div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 16,
            lineHeight: 1.55, maxWidth: '40ch' }}>
            Use on one element per viewport. Live state, the in-progress link,
            the figure number — the thing the reader's eye should land on.
          </p>
        </div>
        <div className="card" style={{ padding: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Status · constant</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {[['pass','#34D08C','3/3 unanimous · merge'],
              ['warn','#FFB84D','2/3 split · review'],
              ['fail','#FF3D52','blocked · revert'],
              ['info','#5EE6F2','session · live']].map(([n, c, msg]) => (
              <div key={n} style={{ display: 'grid',
                gridTemplateColumns: '12px 80px 1fr', gap: 14, alignItems: 'center',
                padding: '10px 0', borderTop: '1px dashed var(--hairline)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 5,
                  background: c, boxShadow: `0 0 8px ${c}` }} />
                <span className="mono" style={{ fontSize: 11,
                  letterSpacing: '0.14em', color: c,
                  textTransform: 'uppercase' }}>{n}</span>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WAGeometrySection() {
  return (
    <section className="ds-section">
      <SectionHeader num="03" eyebrow="Geometry · radius, border, shadow"
        title={<>The <em>shape</em> of an opinion.</>}
        sub="Radii say how forgiving the system is. Borders say how loud. Shadows say what's elevated. All three move together when you switch." />
      <div style={{ display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {[
          { k: '--radius-sm', label: 'sm' },
          { k: '--radius',    label: 'default' },
          { k: '--radius-lg', label: 'lg' },
          { k: '--radius-pill', label: 'pill' },
        ].map(({ k, label }) => (
          <div key={k} className="card" style={{ padding: 22 }}>
            <div style={{
              height: 70, background: 'var(--surface-3)',
              borderRadius: `var(${k})`,
              border: '1px solid var(--border-strong)',
              marginBottom: 16,
            }} />
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--text-3)' }}>{label}</div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--text)' }}>{getCSSVar(k)}</div>
          </div>
        ))}
      </div>

      {/* Borders + shadows row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16,
        marginTop: 16 }}>
        <div className="card" style={{ padding: 22 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Border weight</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 60, height: 60,
              border: 'var(--hairline-w) solid var(--text-2)' }} />
            <div style={{ width: 60, height: 60,
              border: 'var(--border-w) solid var(--text)' }} />
          </div>
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 12 }}>
            hairline {getCSSVar('--hairline-w')} · stroke {getCSSVar('--border-w')}
          </div>
        </div>
        <div className="card" style={{ padding: 22 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Default shadow</div>
          <div style={{ width: '100%', height: 60, background: 'var(--surface-2)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow)' }} />
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)',
            marginTop: 12, wordBreak: 'break-all' }}>
            {getCSSVar('--shadow')}
          </div>
        </div>
        <div className="card" style={{ padding: 22 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Accent shadow</div>
          <div style={{ width: '100%', height: 60, background: 'var(--surface-2)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-accent)' }} />
          <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)',
            marginTop: 12, wordBreak: 'break-all' }}>
            {getCSSVar('--shadow-accent')}
          </div>
        </div>
      </div>

      {/* Spacing scale */}
      <div className="card" style={{ padding: 28, marginTop: 16 }}>
        <div className="eyebrow" style={{ marginBottom: 18 }}>Spacing · 4px base</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
          {window.WA_SPACE_SCALE.slice(1).map((s) => (
            <div key={s.name} style={{ display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8 }}>
              <div style={{ width: Math.max(s.px, 4), height: 40,
                background: 'var(--accent)', opacity: 0.8 }} />
              <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)' }}>
                {s.name} · {s.px}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { WATypeSection, WAColorSection, WAGeometrySection });
