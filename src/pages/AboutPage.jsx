const VALUES = [
  { title: '100% Handmade', text: 'Stitched by one maker with love and intention.' },
  { title: 'Mindful Sourcing', text: 'Soft acrylic and cotton yarn blends.' },
  { title: 'Made To Order', text: 'Created especially for you upon request.' },
];
const TEXT = { color: 'var(--charcoal-soft)', fontSize: 15, lineHeight: 1.7 };

/**
 * About the maker: photo, story, three values.
 *
 * >>> <Route path="/about" element={<AboutPage />} />
 */
export default function AboutPage() {
  return (
    <section className="page active">
      <div className="wrap about-grid" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 56, alignItems: 'center', padding: '40px 0 60px' }}>
        <div className="about-img" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '4/5', background: 'var(--cream-deep)' }}>
          <img src="/images/founder photo.jpg" alt="Advika crafting crochet" loading="lazy" />
        </div>
        <div className="about-text">
          <div className="eyebrow"><span className="dot"></span> The Maker</div>
          <h2 style={{ marginTop: 14, fontSize: 'clamp(28px,4vw,42px)' }}>Hi, I'm Advika.</h2>
          <p style={{ ...TEXT, margin: '16px 0' }}>CrochetsBy_Advika started as a way to slow down between semesters — one hook, one ball of yarn, and a lot of trial and error. Today every plushie, headband, and flower pot is still made the exact same way: by hand, in small batches, with no two pieces ever identical.</p>
          <p style={{ ...TEXT, marginBottom: 24 }}>I personally design each piece, select the yarn texture, and stitch every loop. Because handmade is personal, I connect with each buyer directly so you know exactly who made your piece.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {VALUES.map(v => (
              <div key={v.title} style={{ padding: 18, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--white)' }}>
                <b style={{ display: 'block', fontSize: 14, marginBottom: 4 }}>{v.title}</b>
                <p style={{ fontSize: 12, color: 'var(--charcoal-soft)', margin: 0, lineHeight: 1.5 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
