/* =====================================================================
   SHOWCASE · COMPONENTS + CARDS + CODE
   The interactive surfaces. Same structure across all systems —
   the skin in styles.css does the talking.
   ===================================================================== */

function WAComponentsSection() {
  return (
    <section className="ds-section">
      <SectionHeader num="04" eyebrow="Components · the chassis"
        title={<>Buttons, chips, fields. <em>Five inflections.</em></>}
        sub="Identical markup, identical class names. The data-system attribute on <html> reaches in and reshapes radius, border weight, casing, and hover behavior." />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Buttons */}
        <div className="card" style={{ padding: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Buttons</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            <button className="btn primary">Ship change</button>
            <button className="btn">Re-run trio</button>
            <button className="btn ghost">Cancel</button>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Disabled</button>
            <button className="btn icon" aria-label="More">⋯</button>
            <button className="btn icon" aria-label="Play">▶</button>
          </div>
        </div>

        {/* Chips */}
        <div className="card" style={{ padding: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Chips · status</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="chip accent">accent · live</span>
            <span className="chip ok">3/3 pass</span>
            <span className="chip warn">2/3 split</span>
            <span className="chip bad">blocked</span>
            <span className="chip muted">archived</span>
            <span className="chip">post · 02</span>
            <span className="pill">Session 04 · running</span>
          </div>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: 28 }}>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Form · prompt → run</div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label>Change summary</label>
            <input className="input" placeholder="Tighten gate on auth flow" defaultValue="Restrict /admin to lead role" />
          </div>
          <div className="field" style={{ marginBottom: 12 }}>
            <label>Reviewers</label>
            <select className="select" defaultValue="trio">
              <option value="trio">Lead · Alpha · Bravo (default)</option>
              <option value="duo">Lead · Alpha</option>
              <option value="solo">Lead only</option>
            </select>
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea className="textarea" defaultValue="See post 02. Want unanimous before merge."></textarea>
          </div>
        </div>

        {/* Tabs + table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="tabs" style={{ padding: '0 14px' }}>
            <button className="tab active">Sessions</button>
            <button className="tab">Posts</button>
            <button className="tab">Diffs</button>
            <button className="tab">Verdicts</button>
          </div>
          <table className="table">
            <thead>
              <tr><th>Session</th><th>Roles</th><th>Result</th><th>Δ</th></tr>
            </thead>
            <tbody>
              <tr><td>S-23478</td><td>Lead · Alpha · Bravo</td><td><span className="dot ok" /> pass</td><td className="mono">+12 −4</td></tr>
              <tr><td>S-23477</td><td>Lead · Alpha</td><td><span className="dot warn" /> split</td><td className="mono">+38 −11</td></tr>
              <tr><td>S-23476</td><td>Lead · Bravo</td><td><span className="dot bad" /> block</td><td className="mono">+0 −214</td></tr>
              <tr><td>S-23475</td><td>Lead · Alpha · Bravo</td><td><span className="dot ok" /> pass</td><td className="mono">+6 −0</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function WACardsSection() {
  return (
    <section className="ds-section">
      <SectionHeader num="05" eyebrow="Surfaces · post + product"
        title={<>The two cards <em>everything</em> reduces to.</>}
        sub="A post (long-form evidence) and a product (a tool the agents made). Both come in five flavors here." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <PostCard />
        <ProductCard />
      </div>
    </section>
  );
}

function PostCard() {
  return (
    <article className="card hoverable glow" style={{ padding: 28, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 22 }}>
        <span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.18em',
          color: 'var(--text-3)', textTransform: 'uppercase' }}>Post 02</span>
        <span className="chip accent">Evidence</span>
      </div>
      <h3 className="display ds-h" style={{ fontSize: 36, marginBottom: 14,
        lineHeight: 1.05 }}>
        How the consensus <em>gate</em> caught a bad merge.
      </h3>
      <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 22 }}>
        Three roles read the same diff. Two passed. One held the line. The
        commit never landed — and four hours later we found the regression
        Bravo had been pointing at. Here is the trace.
      </p>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center',
        paddingTop: 18, borderTop: '1px dashed var(--hairline)' }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>14 Apr</span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>·</span>
        <span className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>8 min</span>
        <span style={{ marginLeft: 'auto' }} className="mono">
          <span style={{ color: 'var(--accent)' }}>read →</span>
        </span>
      </div>
    </article>
  );
}

function ProductCard() {
  return (
    <article className="card hoverable glow" style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)',
            background: 'var(--accent)', color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>T</div>
          <div>
            <div className="display" style={{ fontSize: 20 }}>Trio</div>
            <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)' }}>v0.4.2</div>
          </div>
        </div>
        <span className="chip ok">live</span>
      </div>
      <p style={{ fontSize: 14.5, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 22 }}>
        Three-role review on every commit. Lead reads for architecture, Alpha
        for product, Bravo plays adversary. Block on any single objection.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8,
        marginBottom: 22 }}>
        {[['1.4k','runs'],['97%','3/3 pass'],['12s','median']].map(([n,l]) => (
          <div key={l} style={{ padding: '10px 0', borderTop: '1px solid var(--hairline)' }}>
            <div className="display" style={{ fontSize: 22 }}>{n}</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)',
              letterSpacing: '0.14em', textTransform: 'uppercase' }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn primary" style={{ flex: 1 }}>Open</button>
        <button className="btn ghost">Docs</button>
      </div>
    </article>
  );
}

function WACodeSection() {
  return (
    <section className="ds-section">
      <SectionHeader num="06" eyebrow="Code · the receipt"
        title={<>Every claim ships <em>with its trace.</em></>}
        sub="The mono treatment changes per system — but the receipt always lives next to the assertion." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="codeblock">
          <div className="head">
            <span>session.log · S-23478</span>
            <span>14:02:31 → 14:02:43</span>
          </div>
<pre>{`<span class="tok-cmt">// trio.review(diff) — 3 roles, 1 verdict</span>
<span class="tok-key">const</span> verdict = <span class="tok-key">await</span> trio.review({
  diff: <span class="tok-str">"feat: restrict /admin to lead role"</span>,
  roles: [<span class="tok-str">"lead"</span>, <span class="tok-str">"alpha"</span>, <span class="tok-str">"bravo"</span>],
  gate: <span class="tok-str">"unanimous"</span>,
});

<span class="tok-cmt">// =&gt; { lead: pass, alpha: pass, bravo: pass }</span>
<span class="tok-cmt">// =&gt; merge: true · session: <span class="tok-num">23478</span> · ms: <span class="tok-num">12,041</span></span>

<span class="tok-key">if</span> (verdict.unanimous) <span class="tok-key">return</span> ship(verdict);
<span class="tok-key">else</span> <span class="tok-key">return</span> hold(verdict.dissent);  <span class="err">// Bravo objects, hold</span>`}</pre>
        </div>
        <div className="codeblock">
          <div className="head">
            <span>tokens.css · current system</span>
            <span>live</span>
          </div>
<pre>{`<span class="tok-cmt">/* surface */</span>
<span class="tok-key">--bg</span>:        <span class="tok-str">var(--bg)</span>;
<span class="tok-key">--surface</span>:   <span class="tok-str">var(--surface)</span>;
<span class="tok-key">--border</span>:    <span class="tok-str">var(--border)</span>;

<span class="tok-cmt">/* type */</span>
<span class="tok-key">--font-display</span>: <span class="tok-str">var(--font-display)</span>;
<span class="tok-key">--font-body</span>:    <span class="tok-str">var(--font-body)</span>;
<span class="tok-key">--font-mono</span>:    <span class="tok-str">var(--font-mono)</span>;

<span class="tok-cmt">/* shape */</span>
<span class="tok-key">--radius</span>:     <span class="tok-str">var(--radius)</span>;
<span class="tok-key">--border-w</span>:   <span class="tok-str">var(--border-w)</span>;
<span class="tok-key">--shadow</span>:     <span class="tok-str">var(--shadow)</span>;`}</pre>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { WAComponentsSection, WACardsSection, WACodeSection });
