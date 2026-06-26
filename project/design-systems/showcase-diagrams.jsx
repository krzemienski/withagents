/* =====================================================================
   SHOWCASE · DIAGRAMS + FOOTER
   The same Consensus Gate diagram rendered through each system's
   diagram primitives. This is where the whole thesis lands.
   ===================================================================== */

function WADiagramsSection({ systemId, accentId }) {
  const accent = (window.WA_ACCENTS.find(a => a.id === accentId) || window.WA_ACCENTS[0]).primary;
  const others = ['journal','terminal','paper','console','brutal'].filter(s => s !== systemId);
  return (
    <section className="ds-section">
      <SectionHeader num="07" eyebrow="Diagrams · the same gate, five drawings"
        title={<>One <em>flowchart.</em> Five postures.</>}
        sub="The Consensus Gate from Post 02. Same nodes, same arrows, same verdict. The grammar of how it's drawn — node shape, arrow head, edge label, lane container — is what changes." />

      {/* Current system, large */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'baseline',
          justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="eyebrow">
            Current · {window.WA_DESIGN_SYSTEMS[systemId].name}
          </div>
          <span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.14em',
            color: 'var(--text-3)', textTransform: 'uppercase' }}>
            change → trio → tally → gate → ship | block
          </span>
        </div>
        <WAConsensusGate sysId={systemId} accent={accent} />
      </div>

      {/* The other four, small */}
      <div className="eyebrow" style={{ marginBottom: 14 }}>And the others, side by side</div>
      <div style={{ display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px,1fr))', gap: 16 }}>
        {others.map((id) => (
          <div key={id}>
            <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 8 }}>
              {window.WA_DESIGN_SYSTEMS[id].name}
            </div>
            <div style={{ transform: 'scale(0.55)', transformOrigin: 'top left',
              width: '182%', height: 200, marginBottom: -68 }}>
              <WAConsensusGate sysId={id} accent={accent} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WAFooter({ systemId }) {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', paddingTop: 56,
      marginTop: 80, paddingBottom: 40 }}>
      <div style={{ display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 40,
        marginBottom: 56 }}>
        <div>
          <div className="display" style={{ fontSize: 28, marginBottom: 8 }}>
            With<em style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>Agents</em>.
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55,
            maxWidth: '34ch' }}>
            Five design systems for the same body of work. Pick the one that
            fits the moment — or run them in branches and keep the strongest
            pieces of each.
          </p>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>
            Files
          </div>
          <ul style={{ listStyle: 'none', display: 'grid', gap: 8, fontSize: 13,
            color: 'var(--text-2)' }}>
            <li>design-systems.jsx · tokens</li>
            <li>styles.css · skin layer</li>
            <li>diagrams.jsx · primitives</li>
            <li>showcase-*.jsx · this page</li>
          </ul>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>
            What you control
          </div>
          <ul style={{ listStyle: 'none', display: 'grid', gap: 8, fontSize: 13,
            color: 'var(--text-2)' }}>
            <li>System · top-bar pill</li>
            <li>Accent · top-bar swatch</li>
            <li>Persists across reloads</li>
          </ul>
        </div>
        <div>
          <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 14 }}>
            Status · live
          </div>
          <div style={{ display: 'grid', gap: 8, fontSize: 13 }}>
            <div><span className="dot ok" /> 23,479 sessions logged</div>
            <div><span className="dot ok" /> 5/5 systems building clean</div>
            <div><span className="dot warn" /> 1 system pending review</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', paddingTop: 24,
        borderTop: '1px dashed var(--hairline)' }}>
        <span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.16em',
          color: 'var(--text-4)', textTransform: 'uppercase' }}>
          withagents · 5 systems · {systemId} active
        </span>
        <span className="mono caret" style={{ fontSize: 11, color: 'var(--text-3)' }}>
          end_of_log
        </span>
      </div>
    </footer>
  );
}

Object.assign(window, { WADiagramsSection, WAFooter });
