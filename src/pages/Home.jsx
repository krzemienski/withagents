// Home page — hero carousel (3 content types), the-series grid, products strip, subscribe
import React from 'react';
import { SERIES, PRODUCTS } from '../data/content.js';
import { hexA, shuffle, pick } from '../lib/util.js';
import { WANav, WAFooter, WAEyebrow, WAStatusPill, PostGlyph } from '../components/ui.jsx';
import { HeroSceneCanvas } from '../components/HeroSceneCanvas.jsx';

export function HomePage({ accent, go }) {
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
      <section className="wa-hero" style={{ position: 'relative', minHeight: 720, padding: '64px 40px 40px', overflow: 'hidden' }}>
        <HeroSceneCanvas accent={accent} scrollY={scrollY} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            <WAStatusPill accent={accent}>23,479 SESSIONS · 19 LESSONS · 6 PRODUCTS</WAStatusPill>
          </div>
          <HeroCarousel accent={accent} go={go} />
        </div>

        {/* scroll cue — connects hero into the content below */}
        <button
          onClick={() => document.getElementById('the-series')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to writing"
          style={{
            position: 'relative', zIndex: 2, margin: '36px auto 0', display: 'flex',
            flexDirection: 'column', alignItems: 'center', gap: 8,
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'rgba(244,243,238,0.4)', fontFamily: 'inherit',
          }}>
          <span className="wa-mono" style={{ fontSize: 10, letterSpacing: 2, fontWeight: 600 }}>SCROLL</span>
          <span style={{ animation: 'wa-cz-bob 1.8s ease-in-out infinite', fontSize: 16, lineHeight: 1 }}>↓</span>
        </button>
      </section>

      {/* THE SERIES — featured row */}
      <Reveal as="section" id="the-series" style={{ padding: '88px 40px 20px', position: 'relative', zIndex: 2 }}>
        <SectionHeader
          accent={accent} num={1} label="WRITING" title="The Series"
          blurb="19 lessons from 23,479 AI coding sessions. Deeply technical, evidence-based, no fluff."
          meta="314 min total reading" linkLabel="See all 19 →" onLink={() => go({ page: 'series' })} />

        {/* featured three */}
        <div className="wa-grid-3" style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {SERIES.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}><PostCard post={p} accent={accent} go={go} size="lg" /></Reveal>
          ))}
        </div>

        {/* bottom three */}
        <div className="wa-grid-3" style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {SERIES.slice(6, 9).map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}><PostCard post={p} accent={accent} go={go} size="lg" /></Reveal>
          ))}
        </div>

        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => go({ page: 'series' })} style={{
            height: 42, padding: '0 22px', borderRadius: 8,
            background: 'transparent', color: '#f4f3ee',
            border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
            fontWeight: 600, fontSize: 13, fontFamily: 'inherit',
          }}>View all 19 lessons →</button>
        </div>
      </Reveal>

      {/* PRODUCTS */}
      <Reveal as="section" style={{ padding: '96px 40px 40px' }}>
        <SectionHeader
          accent={accent} num={2} label="PRODUCTS" title="What we ship"
          blurb="Every system in the series turned into something you can install, clone, or subscribe to. Six of them, so far."
          linkLabel="All products →" onLink={() => go({ page: 'products' })} />

        <div className="wa-grid-3" style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {PRODUCTS.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}><ProductMiniCard product={p} accent={accent} go={go} /></Reveal>
          ))}
        </div>
        <div className="wa-grid-3" style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
          {PRODUCTS.slice(3, 6).map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}><ProductMiniCard product={p} accent={accent} go={go} /></Reveal>
          ))}
        </div>
      </Reveal>

      {/* SUBSCRIBE */}
      <Reveal as="section" className="wa-subscribe-section" style={{ padding: '72px 40px 0' }}>
        <div className="wa-subscribe" style={{
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
      </Reveal>

      <WAFooter accent={accent} go={go} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HERO CAROUSEL — three slides, reshuffled every page load.
//   slot 1 = WRITING (a field note)
//   slot 2 = PRODUCT (a shipped tool)
//   slot 3 = WILDCARD (open-source / signal / alt field note)
// Auto-advances, animates each slide in, manual dots + arrows + progress.
// ─────────────────────────────────────────────────────────────

// Scroll-reveal wrapper — fades + rises its child in when it enters view.
function Reveal({ children, as: Tag = 'div', delay = 0, style, ...rest }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current; if (!el) return undefined;
    // Find the scrolling ancestor (the .wa-page container)
    const root = el.closest('.wa-page') || null;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } });
    }, { root, threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} style={{
      ...style,
      opacity: shown ? 1 : 0,
      transform: shown ? 'none' : 'translateY(22px)',
      transition: `opacity .6s cubic-bezier(.2,.7,.3,1) ${delay}ms, transform .6s cubic-bezier(.2,.7,.3,1) ${delay}ms`,
    }} {...rest}>{children}</Tag>
  );
}

// Shared section header — eyebrow + title + blurb on the left, meta/link on the right.
function SectionHeader({ accent, num, label, title, blurb, meta, linkLabel, onLink }) {
  return (
    <div className="wa-stack-md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
      <div style={{ maxWidth: 680 }}>
        <WAEyebrow accent={accent} num={num} label={label} />
        <h2 className="wa-section-title" style={{ margin: 0, fontSize: 'clamp(38px, 6vw, 60px)', fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>{title}</h2>
        {blurb && <div style={{ marginTop: 16, fontSize: 15, color: 'rgba(244,243,238,0.6)', lineHeight: 1.55, maxWidth: 520 }}>{blurb}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0 }}>
        {meta && <div className="wa-mono wa-hide-sm" style={{ fontSize: 12, color: 'rgba(244,243,238,0.5)', letterSpacing: 0.6 }}>{meta}</div>}
        {linkLabel && <a onClick={onLink} style={{ fontSize: 13, color: accent, cursor: 'pointer', whiteSpace: 'nowrap' }}>{linkLabel}</a>}
      </div>
    </div>
  );
}

function buildHeroSlides() {
  const series = SERIES || [];
  const products = PRODUCTS || [];

  // WRITING — any field note
  const post = pick(series);
  const writing = { type: 'writing', label: 'WRITING', post };

  // PRODUCT — prefer a flagship (accent status), else any
  const flagship = products.filter((p) => p.statusTone === 'accent');
  const product = pick(flagship.length ? flagship : products);
  const productSlide = { type: 'product', label: 'PRODUCT', product };

  // WILDCARD — always a THIRD, distinct type (never another writing/product).
  // Guarantees the three slots are always three different kinds of content.
  const wildKind = pick(['oss', 'signal']);
  let wildcard;
  if (wildKind === 'oss') {
    const oss = products.filter((p) => p.kind === 'Open source');
    const repoPost = series.filter((p) => p.repo);
    if (oss.length && Math.random() > 0.4) {
      wildcard = { type: 'oss', label: 'OPEN SOURCE', product: pick(oss) };
    } else if (repoPost.length) {
      wildcard = { type: 'oss', label: 'OPEN SOURCE', post: pick(repoPost) };
    } else {
      wildcard = { type: 'oss', label: 'OPEN SOURCE', product: pick(products) };
    }
  } else {
    wildcard = { type: 'signal', label: 'BY THE NUMBERS' };
  }

  // Always 3 slots, but shuffle the order so the first thing you see varies.
  return shuffle([writing, productSlide, wildcard]);
}

const HERO_CZ_STYLE = `
@keyframes wa-cz-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes wa-cz-pop  { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: none; } }
@keyframes wa-cz-prog { from { width: 0%; } to { width: 100%; } }
@keyframes wa-cz-blink { 0%,49% { opacity: 1; } 50%,100% { opacity: .25; } }
@keyframes wa-cz-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
.wa-cz-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 40px; align-items: center; }
.wa-cz-rise > * { animation: wa-cz-rise .62s cubic-bezier(.2,.7,.3,1) both; }
.wa-cz-rise > *:nth-child(1) { animation-delay: .04s; }
.wa-cz-rise > *:nth-child(2) { animation-delay: .12s; }
.wa-cz-rise > *:nth-child(3) { animation-delay: .20s; }
.wa-cz-rise > *:nth-child(4) { animation-delay: .28s; }
.wa-cz-rise > *:nth-child(5) { animation-delay: .36s; }
.wa-cz-visual { animation: wa-cz-pop .7s cubic-bezier(.2,.7,.3,1) both; animation-delay: .14s; }
@media (max-width: 820px) {
  .wa-cz-grid { grid-template-columns: 1fr !important; gap: 28px; }
  .wa-cz-visual { order: -1; }
}
@media (prefers-reduced-motion: reduce) {
  .wa-cz-rise > *, .wa-cz-visual { animation: none !important; }
}
`;

function HeroCarousel({ accent, go }) {
  // Reshuffled once per mount → new every page visit.
  const slides = React.useMemo(buildHeroSlides, []);
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const DURATION = 7000;

  React.useEffect(() => {
    if (paused) return undefined;
    const id = setTimeout(() => setIdx((i) => (i + 1) % slides.length), DURATION);
    return () => clearTimeout(id);
  }, [idx, paused, slides.length]);

  const goTo = (i) => setIdx(((i % slides.length) + slides.length) % slides.length);
  const active = slides[idx];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: 'clamp(24px, 4vw, 44px)',
        minHeight: 420,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        overflow: 'hidden',
      }}>
      <style>{HERO_CZ_STYLE}</style>

      {/* slide body — keyed by idx so the entrance animation replays each time */}
      <div key={idx} className="wa-cz-grid">
        <HeroSlide slide={active} accent={accent} go={go} />
      </div>

      {/* controls row */}
      <div style={{
        marginTop: 32, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {slides.map((s, i) => (
            <button key={i} onClick={() => goTo(i)}
              aria-label={`Show ${s.label.toLowerCase()} slide`}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                height: 30, padding: '0 12px', borderRadius: 8,
                background: i === idx ? hexA(accent, 0.14) : 'rgba(255,255,255,0.03)',
                border: `1px solid ${i === idx ? hexA(accent, 0.45) : 'rgba(255,255,255,0.08)'}`,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
              <span style={{
                width: 6, height: 6, borderRadius: 3,
                background: i === idx ? accent : 'rgba(244,243,238,0.3)',
                boxShadow: i === idx ? `0 0 8px ${accent}` : 'none',
                transition: 'all .2s',
              }} />
              <span className="wa-mono" style={{
                fontSize: 10, letterSpacing: 1.4, fontWeight: 700,
                color: i === idx ? '#f4f3ee' : 'rgba(244,243,238,0.45)',
              }}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* progress bar */}
        <div style={{ flex: 1, minWidth: 80, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
          <div key={idx + (paused ? '-p' : '')} style={{
            height: '100%', background: accent, borderRadius: 2,
            animation: paused ? 'none' : `wa-cz-prog ${DURATION}ms linear both`,
            width: paused ? '0%' : undefined,
          }} />
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {['‹', '›'].map((g, i) => (
            <button key={g} onClick={() => goTo(idx + (i === 0 ? -1 : 1))}
              aria-label={i === 0 ? 'Previous' : 'Next'}
              style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f4f3ee', cursor: 'pointer', fontSize: 17, lineHeight: 1,
                fontFamily: 'inherit',
              }}>{g}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroKicker({ accent, children }) {
  return (
    <div className="wa-mono" style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      fontSize: 11, letterSpacing: 2.2, fontWeight: 700, color: accent,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: 4, background: accent,
        boxShadow: `0 0 10px ${accent}`, animation: 'wa-cz-blink 1.6s ease infinite',
      }} />
      {children}
    </div>
  );
}

function HeroCTA({ accent, label, onClick, primary }) {
  return (
    <button onClick={onClick} style={{
      height: 46, padding: '0 22px', borderRadius: 10,
      background: primary ? accent : 'rgba(255,255,255,0.04)',
      color: primary ? '#0a0a0a' : '#f4f3ee',
      border: primary ? 'none' : '1px solid rgba(255,255,255,0.16)',
      fontWeight: primary ? 700 : 600, fontSize: 13.5, letterSpacing: 0.2,
      cursor: 'pointer', fontFamily: 'inherit',
      display: 'inline-flex', alignItems: 'center', gap: 10,
    }}>{label}</button>
  );
}

function HeroSlide({ slide, accent, go }) {
  if (slide.type === 'writing') return <HeroWriting post={slide.post} label={slide.label} accent={accent} go={go} />;
  if (slide.type === 'product') return <HeroProduct product={slide.product} accent={accent} go={go} />;
  if (slide.type === 'oss')     return <HeroOSS slide={slide} accent={accent} go={go} />;
  return <HeroSignal accent={accent} go={go} />;
}

function HeroWriting({ post, label, accent, go }) {
  const t = post.title;
  const words = t.split(' ');
  const head = words.slice(0, Math.max(1, words.length - 2)).join(' ');
  const tail = words.slice(-2).join(' ');
  return (
    <>
      <div className="wa-cz-rise" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <HeroKicker accent={accent}>{label} · FIELD NOTE {String(post.num).padStart(2, '0')} / 19</HeroKicker>
        <h1 style={{ margin: 0, fontSize: 'clamp(34px, 5vw, 60px)', lineHeight: 1.0, letterSpacing: -2, fontWeight: 800, textWrap: 'balance' }}>
          {head}{' '}
          <span className="wa-display" style={{ fontStyle: 'italic', fontWeight: 500, color: accent }}>{tail}</span>
        </h1>
        <p style={{ margin: 0, fontSize: 'clamp(14px, 1.6vw, 17px)', lineHeight: 1.55, color: 'rgba(244,243,238,0.68)', maxWidth: 520 }}>
          {post.subtitle}
        </p>
        <div className="wa-mono" style={{ display: 'flex', gap: 14, fontSize: 11.5, color: 'rgba(244,243,238,0.45)' }}>
          <span>{post.read} read</span><span>·</span><span>{post.date}</span>
          {post.tags && <><span>·</span><span style={{ color: accent }}>{post.tags[0]}</span></>}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <HeroCTA accent={accent} primary label="Read the field note →" onClick={() => go({ page: 'post', slug: post.slug })} />
          <HeroCTA accent={accent} label="All 19 lessons" onClick={() => go({ page: 'series' })} />
        </div>
      </div>
      <div className="wa-cz-visual">
        <HeroPageVisual post={post} accent={accent} />
      </div>
    </>
  );
}

function HeroProduct({ product, accent, go }) {
  return (
    <>
      <div className="wa-cz-rise" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <HeroKicker accent={accent}>PRODUCT · {product.kind.toUpperCase()} · {product.status}</HeroKicker>
        <h1 style={{ margin: 0, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 0.98, letterSpacing: -2.4, fontWeight: 800 }}>
          {product.name}
        </h1>
        <div className="wa-display" style={{ fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(16px, 2vw, 22px)', color: accent, lineHeight: 1.25 }}>
          {product.tagline}
        </div>
        <p style={{ margin: 0, fontSize: 'clamp(13px, 1.5vw, 15.5px)', lineHeight: 1.55, color: 'rgba(244,243,238,0.62)', maxWidth: 520 }}>
          {product.desc.length > 150 ? product.desc.slice(0, 148) + '…' : product.desc}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <HeroCTA accent={accent} primary label={`${product.cta} →`} onClick={() => go({ page: 'product', slug: product.slug })} />
          <HeroCTA accent={accent} label="All products" onClick={() => go({ page: 'products' })} />
        </div>
      </div>
      <div className="wa-cz-visual">
        <HeroProductVisual product={product} accent={accent} />
      </div>
    </>
  );
}

function HeroOSS({ slide, accent, go }) {
  const name = slide.product ? slide.product.name : slide.post.title;
  const repo = slide.product ? slide.product.slug : slide.post.repo;
  const install = slide.product
    ? (slide.product.kind === 'Open source' ? `pip install ${repo}` : `git clone …/${repo}`)
    : `git clone github.com/withagents/${repo}`;
  const onOpen = () => slide.product ? go({ page: 'product', slug: slide.product.slug }) : go({ page: 'post', slug: slide.post.slug });
  return (
    <>
      <div className="wa-cz-rise" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <HeroKicker accent={accent}>OPEN SOURCE · MIT · CLONE &amp; RUN</HeroKicker>
        <h1 style={{ margin: 0, fontSize: 'clamp(32px, 4.6vw, 56px)', lineHeight: 1.0, letterSpacing: -1.8, fontWeight: 800, textWrap: 'balance' }}>
          {name}
        </h1>
        <p style={{ margin: 0, fontSize: 'clamp(13px, 1.5vw, 16px)', lineHeight: 1.55, color: 'rgba(244,243,238,0.65)', maxWidth: 520 }}>
          {slide.product ? slide.product.desc.slice(0, 150) : slide.post.subtitle}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <HeroCTA accent={accent} primary label="View on GitHub ↗" onClick={onOpen} />
          <HeroCTA accent={accent} label="Read the post" onClick={() => slide.post ? go({ page: 'post', slug: slide.post.slug }) : go({ page: 'series' })} />
        </div>
      </div>
      <div className="wa-cz-visual">
        <HeroTerminalVisual install={install} repo={repo} accent={accent} />
      </div>
    </>
  );
}

function HeroSignal({ accent, go }) {
  const stats = React.useMemo(() => shuffle([
    { v: '23,479', l: 'sessions analyzed' },
    { v: '11.6 GB', l: 'interaction data' },
    { v: '73%', l: 'fewer repeat bugs' },
    { v: '$0.15', l: 'per consensus gate' },
    { v: '194', l: 'parallel agents' },
    { v: '92%', l: 'bugs caught pre-merge' },
  ]).slice(0, 4), []);
  return (
    <>
      <div className="wa-cz-rise" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <HeroKicker accent={accent}>BY THE NUMBERS · RECEIPTS, NOT VIBES</HeroKicker>
        <h1 style={{ margin: 0, fontSize: 'clamp(34px, 5vw, 60px)', lineHeight: 1.0, letterSpacing: -2, fontWeight: 800, textWrap: 'balance' }}>
          Every claim ships with{' '}
          <span className="wa-display" style={{ fontStyle: 'italic', fontWeight: 500, color: accent }}>its receipt.</span>
        </h1>
        <p style={{ margin: 0, fontSize: 'clamp(14px, 1.6vw, 17px)', lineHeight: 1.55, color: 'rgba(244,243,238,0.68)', maxWidth: 520 }}>
          No fabricated examples. No mock data. Just what actually works when you run AI agents at scale — traced back to real sessions.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <HeroCTA accent={accent} primary label="See the evidence →" onClick={() => go({ page: 'series' })} />
          <HeroCTA accent={accent} label="Explore products" onClick={() => go({ page: 'products' })} />
        </div>
      </div>
      <div className="wa-cz-visual">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
          {stats.map((s) => (
            <div key={s.l} style={{ background: '#0a0a0c', padding: '22px 20px' }}>
              <div style={{ fontSize: 'clamp(26px, 3.4vw, 38px)', fontWeight: 800, letterSpacing: -1.4, color: '#f4f3ee' }}>{s.v}</div>
              <div className="wa-mono" style={{ marginTop: 6, fontSize: 10, letterSpacing: 1.2, fontWeight: 600, color: 'rgba(244,243,238,0.45)', textTransform: 'uppercase' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Hero visual blocks ──────────────────────────────────────────
function HeroPageVisual({ post, accent }) {
  return (
    <div style={{
      background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
      padding: 24, position: 'relative', overflow: 'hidden', minHeight: 280,
    }}>
      <div style={{
        position: 'absolute', right: -30, top: -40,
        fontSize: 220, fontWeight: 800, letterSpacing: -10, lineHeight: 1,
        color: hexA(accent, 0.1), fontFamily: '"JetBrains Mono", monospace',
      }}>{String(post.num).padStart(2, '0')}</div>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
        <div style={{ width: 44, height: 44, borderRadius: 11, background: hexA(accent, 0.12), border: `1px solid ${hexA(accent, 0.3)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PostGlyph kind={post.icon} size={22} color={accent} />
        </div>
        <span className="wa-mono" style={{ fontSize: 10, letterSpacing: 1.4, color: 'rgba(244,243,238,0.4)' }}>FIELD&nbsp;NOTE</span>
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 30 }}>
        {[1, 0.92, 0.78, 0.64, 0.5].map((w, i) => (
          <div key={i} style={{ height: 8, width: `${w * 100}%`, borderRadius: 4, background: i === 0 ? hexA(accent, 0.5) : 'rgba(255,255,255,0.07)' }} />
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: 22, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {(post.tags || []).slice(0, 3).map((tag) => (
          <span key={tag} className="wa-mono" style={{ fontSize: 9.5, padding: '4px 9px', borderRadius: 99, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(244,243,238,0.6)', letterSpacing: 0.4 }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

function HeroProductVisual({ product, accent }) {
  return (
    <div style={{
      background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
      padding: 24, minHeight: 280, display: 'flex', flexDirection: 'column', gap: 18,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 12, background: accent, color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 24, fontFamily: '"Fraunces", serif' }}>{product.name[0]}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.4 }}>{product.name}</div>
          <div className="wa-mono" style={{ fontSize: 10.5, color: 'rgba(244,243,238,0.4)', letterSpacing: 1 }}>{product.status}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(product.stats.length, 3)}, 1fr)`, gap: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}>
        {product.stats.slice(0, 3).map((s) => (
          <div key={s.l} style={{ background: '#0a0a0c', padding: '16px 14px' }}>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -1, color: accent }}>{s.v}</div>
            <div className="wa-mono" style={{ marginTop: 4, fontSize: 9.5, letterSpacing: 1, color: 'rgba(244,243,238,0.45)', textTransform: 'uppercase' }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto' }}>
        {(product.modules || []).slice(0, 5).map((m) => (
          <span key={m} className="wa-mono" style={{ fontSize: 9.5, padding: '4px 9px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(244,243,238,0.55)', letterSpacing: 0.4 }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function HeroTerminalVisual({ install, repo, accent }) {
  const lines = [
    { t: `$ ${install}`, c: '#f4f3ee' },
    { t: 'resolving dependencies…', c: 'rgba(244,243,238,0.45)' },
    { t: '✓ installed · 0 vulnerabilities', c: '#34D08C' },
    { t: `$ ${repo} run --demo`, c: '#f4f3ee' },
    { t: 'spawning 3 reviewers · lead·alpha·bravo', c: accent },
    { t: '✓ unanimous · gate passed', c: '#34D08C' },
  ];
  return (
    <div style={{
      background: '#050507', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
      overflow: 'hidden', minHeight: 280,
    }}>
      <div style={{ height: 34, display: 'flex', alignItems: 'center', gap: 7, padding: '0 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: '#ff5f57' }} />
        <span style={{ width: 10, height: 10, borderRadius: 5, background: '#febc2e' }} />
        <span style={{ width: 10, height: 10, borderRadius: 5, background: '#28c840' }} />
        <span className="wa-mono" style={{ marginLeft: 8, fontSize: 10.5, color: 'rgba(244,243,238,0.4)' }}>{repo} — zsh</span>
      </div>
      <div className="wa-mono" style={{ padding: '16px 18px', fontSize: 12.5, lineHeight: 1.95 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ color: l.c, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{l.t}</div>
        ))}
        <span style={{ display: 'inline-block', width: 8, height: 15, background: accent, verticalAlign: 'middle', animation: 'wa-cz-blink 1.1s steps(1) infinite' }} />
      </div>
    </div>
  );
}

// Series post card — matches the reference: number eyebrow, title, sub, meta
export function PostCard({ post, accent, go, size = 'md' }) {
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
export function ProductMiniCard({ product, accent, go }) {
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
