// Home page — hero with parallax aurora, the-series grid, products strip, subscribe

function HomePage({ accent, go }) {
  const scrollRef = React.useRef(null);
  const [scrollY, setScrollY] = React.useState(0);
  React.useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const onScroll = () => setScrollY(el.scrollTop);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={scrollRef} className="wa-page" style={{ height: '100%', overflow: 'auto', position: 'relative' }}>
      <WANav accent={accent} route={{ page: 'home' }} go={go} />

      {/* HERO */}
      <section className="wa-hero" style={{ position: 'relative', minHeight: 720, padding: '80px 40px 40px', overflow: 'hidden' }}>
        <HeroSceneCanvas accent={accent} scrollY={scrollY} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
            <WAStatusPill accent={accent}>SYSTEM STATUS · NOMINAL</WAStatusPill>
          </div>
          <h1 className="wa-hero-title" style={{
            margin: 0,
            fontSize: 'clamp(44px, 12vw, 116px)',
            lineHeight: 0.96, letterSpacing: -4,
            fontWeight: 800, textWrap: 'balance',
          }}>
            Agentic{' '}
            <span style={{
              backgroundImage: `linear-gradient(135deg, ${accent} 0%, #B84DFF 60%, #7A3DFF 100%)`,
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
            }}>Development</span>
          </h1>
          <div className="wa-hero-sub" style={{ marginTop: 26, fontSize: 'clamp(15px, 2.4vw, 22px)', color: 'rgba(244,243,238,0.7)', letterSpacing: -0.2 }}>
            19 Lessons from <span style={{ color: '#5EE6F2', fontWeight: 600 }}>23,479</span> AI Coding Sessions
          </div>
          <div style={{ marginTop: 40, display: 'flex', gap: 14, justifyContent: 'center' }}>
            <button onClick={() => go({ page: 'products' })} style={{
              height: 46, padding: '0 22px', borderRadius: 10,
              background: accent, color: '#0a0a0a',
              fontWeight: 700, fontSize: 13.5, letterSpacing: 0.2,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>Explore Products <span>↗</span></button>
            <button onClick={() => document.getElementById('the-series')?.scrollIntoView({ behavior: 'smooth' })} style={{
              height: 46, padding: '0 22px', borderRadius: 10,
              background: 'rgba(255,255,255,0.04)', color: '#f4f3ee',
              border: '1px solid rgba(255,255,255,0.14)',
              fontWeight: 600, fontSize: 13.5,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'inline-flex', alignItems: 'center', gap: 10,
            }}>Read the Series <span>↓</span></button>
          </div>
        </div>
      </section>

      {/* THE SERIES — featured row */}
      <section id="the-series" style={{ padding: '80px 40px 20px', position: 'relative', zIndex: 2 }}>
        <WAEyebrow accent={accent} num={1} label="WRITING" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
          <div style={{ maxWidth: 680 }}>
            <h2 style={{ margin: 0, fontSize: 60, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>The Series</h2>
            <div style={{ marginTop: 16, fontSize: 15, color: 'rgba(244,243,238,0.6)', lineHeight: 1.55, maxWidth: 520 }}>
              19 lessons from 23,479 AI coding sessions. Deeply technical, evidence-based, no fluff.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div className="wa-mono" style={{ fontSize: 12, color: 'rgba(244,243,238,0.5)', letterSpacing: 0.6 }}>
              314 min total reading
            </div>
            <a onClick={() => go({ page: 'series' })} style={{ fontSize: 13, color: accent, cursor: 'pointer' }}>
              See all 19 →
            </a>
          </div>
        </div>

        {/* featured three */}
        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {SERIES.slice(0, 3).map((p) => (
            <PostCard key={p.slug} post={p} accent={accent} go={go} size="lg" />
          ))}
        </div>

        {/* bottom six */}
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {SERIES.slice(6, 9).map((p) => (
            <PostCard key={p.slug} post={p} accent={accent} go={go} size="lg" />
          ))}
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => go({ page: 'series' })} style={{
            height: 42, padding: '0 22px', borderRadius: 8,
            background: 'transparent', color: '#f4f3ee',
            border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
            fontWeight: 600, fontSize: 13, fontFamily: 'inherit',
          }}>View all 19 lessons →</button>
        </div>
      </section>

      {/* PRODUCTS */}
      <section style={{ padding: '100px 40px 40px' }}>
        <WAEyebrow accent={accent} num={2} label="PRODUCTS" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
          <div style={{ maxWidth: 680 }}>
            <h2 style={{ margin: 0, fontSize: 60, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>What we ship</h2>
            <div style={{ marginTop: 16, fontSize: 15, color: 'rgba(244,243,238,0.6)', lineHeight: 1.55, maxWidth: 560 }}>
              Every system in the series turned into something you can install, clone, or subscribe to. Six of them, so far.
            </div>
          </div>
          <a onClick={() => go({ page: 'products' })} style={{ fontSize: 13, color: accent, cursor: 'pointer' }}>
            All products →
          </a>
        </div>

        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {PRODUCTS.slice(0, 3).map((p) => (
            <ProductMiniCard key={p.slug} product={p} accent={accent} go={go} />
          ))}
        </div>
        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {PRODUCTS.slice(3, 6).map((p) => (
            <ProductMiniCard key={p.slug} product={p} accent={accent} go={go} />
          ))}
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section style={{ padding: '60px 40px 0' }}>
        <div style={{
          padding: '56px 56px', borderRadius: 20,
          background: `linear-gradient(135deg, ${hexA(accent, 0.12)}, ${hexA('#7A3DFF', 0.08)})`,
          border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden',
          display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48, alignItems: 'center',
        }}>
          <div>
            <div className="wa-mono" style={{ fontSize: 11, color: accent, letterSpacing: 2.2, fontWeight: 600 }}>
              ↳ DELIVERED WEEKLY
            </div>
            <div style={{ marginTop: 14, fontSize: 40, fontWeight: 700, letterSpacing: -1.4, lineHeight: 1.04 }}>
              Get the next field note <span className="wa-display" style={{ fontWeight: 400, fontStyle: 'italic', color: accent }}>before it ships.</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 14, color: 'rgba(244,243,238,0.6)' }}>
              4,206 engineers, operators, and weirdos. No spam, ever.
            </div>
          </div>
          <div style={{
            display: 'flex', height: 52, padding: '0 4px 0 16px',
            background: 'rgba(10,10,10,0.6)', borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.12)', alignItems: 'center',
          }}>
            <input placeholder="you@in-production.com" style={{
              flex: 1, height: '100%', background: 'transparent', border: 0, outline: 0,
              color: '#f4f3ee', fontSize: 14, fontFamily: 'inherit',
            }} />
            <button style={{
              height: 42, padding: '0 20px', borderRadius: 10, border: 0,
              background: accent, color: '#0a0a0a', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              fontFamily: 'inherit',
            }}>Subscribe →</button>
          </div>
        </div>
      </section>

      <WAFooter accent={accent} go={go} />
    </div>
  );
}

// Series post card — matches the reference: number eyebrow, title, sub, meta
function PostCard({ post, accent, go, size = 'md' }) {
  const padY = size === 'lg' ? 24 : 20;
  const padX = size === 'lg' ? 24 : 20;
  const titleSize = size === 'lg' ? 17 : 15;
  return (
    <a
      onClick={() => go({ page: 'post', slug: post.slug })}
      className="wa-card"
      style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14, padding: `${padY}px ${padX}px`,
        display: 'flex', flexDirection: 'column', gap: 12,
        cursor: 'pointer', textDecoration: 'none', color: '#f4f3ee',
        transition: 'transform .3s, border-color .3s, background .3s',
        minHeight: 200, position: 'relative', overflow: 'hidden',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="wa-mono" style={{
          fontSize: 11, color: accent, letterSpacing: 1.6, fontWeight: 700,
        }}>{String(post.num).padStart(2, '0')}</span>
        <PostGlyph kind={post.icon} size={20} color={accent} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: titleSize, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.28 }}>
          {post.title}
        </div>
        <div style={{ marginTop: 10, fontSize: 13, color: 'rgba(244,243,238,0.55)', lineHeight: 1.5 }}>
          {post.subtitle.length > 90 ? post.subtitle.slice(0, 88) + '…' : post.subtitle}
        </div>
      </div>
      <div className="wa-mono" style={{
        fontSize: 11, color: 'rgba(244,243,238,0.4)',
        display: 'flex', gap: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <span>{post.read} read</span>
        <span>·</span>
        <span>{post.date}</span>
      </div>
    </a>
  );
}

// Product mini card — product grid on the home page
function ProductMiniCard({ product, accent, go }) {
  const tone = product.statusTone === 'accent';
  return (
    <a onClick={() => go({ page: 'product', slug: product.slug })}
      className="wa-card"
      style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14, padding: '24px',
        display: 'flex', flexDirection: 'column', gap: 14,
        cursor: 'pointer', textDecoration: 'none', color: '#f4f3ee',
        position: 'relative', overflow: 'hidden',
        transition: 'transform .3s, border-color .3s',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="wa-mono" style={{ fontSize: 10.5, color: 'rgba(244,243,238,0.45)', letterSpacing: 1.6, fontWeight: 600 }}>
          {product.kind.toUpperCase()}
        </div>
        <div className="wa-mono" style={{
          fontSize: 10, padding: '3px 9px', borderRadius: 99,
          background: tone ? hexA(accent, 0.16) : 'rgba(255,255,255,0.06)',
          color: tone ? accent : 'rgba(244,243,238,0.7)',
          letterSpacing: 1.2, fontWeight: 700,
        }}>{product.status}</div>
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6 }}>{product.name}</div>
        <div style={{ marginTop: 6, fontSize: 13, color: 'rgba(244,243,238,0.5)', fontStyle: 'italic' }}
          className="wa-display">
          {product.tagline}
        </div>
      </div>
      <div style={{ fontSize: 13.5, color: 'rgba(244,243,238,0.65)', lineHeight: 1.55 }}>
        {product.desc.length > 140 ? product.desc.slice(0, 138) + '…' : product.desc}
      </div>
      <div className="wa-mono" style={{
        display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)',
        fontSize: 11, color: 'rgba(244,243,238,0.4)',
      }}>
        {product.stats.map((s) => (
          <span key={s.l}>
            <span style={{ color: '#f4f3ee', fontWeight: 700 }}>{s.v}</span> {s.l}
          </span>
        ))}
        <span style={{ marginLeft: 'auto', color: accent }}>open →</span>
      </div>
    </a>
  );
}

Object.assign(window, { HomePage, PostCard, ProductMiniCard });
