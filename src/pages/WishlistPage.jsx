import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/catalog';
import { useShop } from '../shop/ShopContext';

/**
 * Products the visitor saved with the heart icon.
 *
 * >>> <Route path="/wishlist" element={<WishlistPage />} />
 */
export default function WishlistPage() {
  const { wishlist } = useShop();
  const saved = PRODUCTS.filter(p => wishlist.has(p.id));

  return (
    <section className="page active">
      <div className="wrap page-header" style={{ paddingTop: 40 }}>
        <div className="eyebrow"><span className="dot"></span> Saved For Later</div>
        <h1 style={{ marginTop: 10 }}>Your Wishlist</h1>
        <p style={{ color: 'var(--charcoal-soft)', fontSize: 15, marginTop: 10 }}>Pieces you've saved with the heart icon appear here.</p>
      </div>
      <div className="wrap">
        <div className="product-grid" style={{ margin: '30px 0 70px' }}>
          {saved.length > 0 ? saved.map(p => <ProductCard key={p.id} product={p} />) : (
            <div className="empty-state" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: 36 }}>♡</div>
              <p style={{ color: 'var(--charcoal-soft)', marginTop: 10 }}>Nothing saved yet.</p>
              <Link className="btn btn-rose" to="/gallery" style={{ marginTop: 14 }}>Browse the Gallery →</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
