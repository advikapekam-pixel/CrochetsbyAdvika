import { Link } from 'react-router-dom';

/**
 * Shown for unknown URLs (and unknown product ids).
 *
 * >>> <NotFoundPage title="Product not found" />
 */
export default function NotFoundPage({ title = 'Page not found' }) {
  return (
    <section className="page active">
      <div className="wrap" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1>{title}</h1>
        <p style={{ color: 'var(--charcoal-soft)', margin: '12px 0 20px' }}>This page may have moved. Let's get you back to the yarn.</p>
        <Link className="btn btn-rose" to="/gallery">Browse the Gallery →</Link>
      </div>
    </section>
  );
}
