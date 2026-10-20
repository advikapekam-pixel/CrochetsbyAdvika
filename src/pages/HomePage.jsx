import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { COLLECTIONS, FAQS, PRODUCTS, TESTIMONIALS } from '../data/catalog';

const PROCESS_STEPS = [
  { title: 'Share your idea', text: 'A character, colour palette, or just a vibe.' },
  { title: 'I design & yarn-pick', text: 'I choose the perfect yarn weight & textures.' },
  { title: 'Handcrafted with care', text: 'Every stitch made by hand, start to finish.' },
  { title: 'Packed & Shipped', text: 'Wrapped with love and shipped pan-India.' },
];

const PILL_STYLE = { background: 'rgba(255,255,255,0.2)', padding: '10px 16px', borderRadius: 'var(--radius-pill)', fontWeight: 700, fontSize: 13 };

/** Section heading with eyebrow label and optional "View All" link. */
function SectionHead({ eyebrow, title, viewAll }) {
  return (
    <div className="section-head">
      <div>
        {eyebrow && <div className="eyebrow"><span className="dot"></span> {eyebrow}</div>}
        <h2 style={eyebrow ? { marginTop: 10 } : undefined}>{title}</h2>
      </div>
      {viewAll && <Link className="view-all" to="/gallery">View All ›</Link>}
    </div>
  );
}

/**
 * Landing page: hero, collections, best sellers, process, founder note,
 * testimonials, FAQ, custom-order call to action.
 *
 * >>> <Route path="/" element={<HomePage />} />
 */
export default function HomePage() {
  const featuredRef = useRef(null);
  const [openFaqs, setOpenFaqs] = useState(new Set());

  const scrollFeatured = dir => {
    const grid = featuredRef.current;
    grid.scrollBy({ left: dir * grid.clientWidth * 0.8, behavior: 'smooth' });
  };
  const toggleFaq = i => setOpenFaqs(prev => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  return (
    <section className="page active">
      {/* ── Hero ── */}
      <div className="hero-banner">
        <div className="hero-media">
          <img src="/images/hero banner.jpg" alt="Handmade crochet flowers and creations" fetchPriority="high" />
          <div className="hero-scrim"></div>
          <div className="hero-copy">
            <span className="hero-tag">🌸 100% Handcrafted · Ships Pan-India</span>
            <h1>Crochet, made with <span style={{ fontStyle: 'italic', fontWeight: 500 }}>love</span> &amp; yarn</h1>
            <p>Every plushie, headband, and bouquet is handcrafted with patience, vibrant colour, and personal care — made just for you.</p>
            <div className="hero-ctas">
              <Link className="btn btn-rose" to="/gallery">Explore Collection →</Link>
              <Link className="btn btn-outline-light" to="/custom-order">Custom Order</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Shop by collection ── */}
      <div className="wrap section">
        <SectionHead eyebrow="Shop By Collection" title="Find your piece" viewAll />
        <div className="collection-row">
          {COLLECTIONS.map(c => (
            <Link key={c.cat} className="collection-chip" to={c.cat === 'custom' ? '/custom-order' : `/gallery?cat=${c.cat}`}>
              <div className="circle"><img src={c.img} alt={c.label} /></div>
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Best sellers carousel ── */}
      <div className="wrap section" style={{ paddingTop: 0 }}>
        <SectionHead eyebrow="Most Loved" title="Best Sellers" viewAll />
        <div className="scroll-wrap">
          <button className="scroll-arrow left" onClick={() => scrollFeatured(-1)} aria-label="Scroll left">‹</button>
          <div className="product-grid" ref={featuredRef}>
            {PRODUCTS.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <button className="scroll-arrow right" onClick={() => scrollFeatured(1)} aria-label="Scroll right">›</button>
        </div>
      </div>

      {/* ── How it's made ── */}
      <div className="wrap section" style={{ paddingTop: 0 }}>
        <SectionHead title="From My Hands To Yours" />
        <div className="process-row">
          {PROCESS_STEPS.map((s, i) => (
            <div key={s.title} className="process-item">
              <div className="process-step-num">{i + 1}</div><b>{s.title}</b><p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Founder note ── */}
      <div className="wrap section" style={{ paddingTop: 0 }}>
        <div className="founder-section">
          <div className="founder-grid">
            <div className="founder-photo"><img src="/images/founder photo.jpg" alt="Advika, founder of CrochetsBy_Advika" loading="lazy" /></div>
            <div className="founder-copy">
              <div className="eyebrow"><span className="dot"></span> A Note From Me</div>
              <p className="quote" style={{ marginTop: 16 }}>"This started with one hook and a ball of yarn between semesters. Every piece you see here has been through my hands — designed, picked, and stitched by me. Thank you for supporting handmade."</p>
              <div className="sign">— Advika, Founder</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="wrap section" style={{ paddingTop: 0 }}>
        <SectionHead title="Loved By Customers" />
        <div className="testi-row">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="testi-card">
              <div className="testi-head">
                <div className="testi-avatar">{t.name.charAt(0)}</div>
                <div><b>{t.name}</b><span className="stars">★★★★★</span></div>
              </div>
              <p>{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ accordion ── */}
      <div className="wrap section" style={{ paddingTop: 0 }}>
        <SectionHead eyebrow="Helpful Answers" title="Frequently Asked Questions" />
        <div className="faq-section">
          {FAQS.map((f, i) => (
            <div key={f.q} className={`faq-item${openFaqs.has(i) ? ' active' : ''}`} onClick={() => toggleFaq(i)}>
              <button className="faq-question"><span>{f.q}</span><span className="faq-icon">+</span></button>
              <div className="faq-answer">{f.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Custom order band ── */}
      <div className="wrap section" style={{ paddingTop: 0 }}>
        <div style={{ background: 'var(--rose)', color: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <h2 style={{ color: 'var(--white)', fontSize: 'clamp(26px,3.8vw,40px)' }}>Want something <span style={{ fontStyle: 'italic', fontWeight: 500 }}>totally unique</span>?</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, maxWidth: 440, margin: '12px 0 20px', lineHeight: 1.6 }}>Send me your idea — a favourite character, colour palette, or custom size — and I'll bring it to life in yarn.</p>
            <Link className="btn btn-charcoal" to="/custom-order">Start Custom Order →</Link>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={PILL_STYLE}>🌸 Custom Colors</span>
            <span style={PILL_STYLE}>🎁 Gifting Ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
