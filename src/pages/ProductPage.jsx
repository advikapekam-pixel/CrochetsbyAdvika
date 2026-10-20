import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import NotFoundPage from './NotFoundPage';
import { PRODUCTS } from '../data/catalog';
import { useShop } from '../shop/ShopContext';
import { discountPercent, formatPrice, tagClassName } from '../shop/format';

/**
 * Rough delivery estimate from an Indian pincode, or null if the pincode is invalid.
 * The +2 days covers handmade production time.
 *
 * >>> estimateDelivery('400077', new Date('2026-10-20'))
 * { region: 'Mumbai / MMR', days: 3, date: 'Sun, 25 Oct' }
 */
function estimateDelivery(pincode, today = new Date()) {
  if (!/^[1-9]\d{5}$/.test(pincode)) return null;
  const lead = pincode[0];
  let days = 6, region = 'All India';
  if (pincode.startsWith('400')) { days = 3; region = 'Mumbai / MMR'; }
  else if (lead === '4') { days = 4; region = 'Maharashtra / West India'; }
  else if (lead === '1' || lead === '2') { days = 5; region = 'North India'; }
  else if (lead === '5' || lead === '6') { days = 5; region = 'South India'; }
  const target = new Date(today.getTime() + (days + 2) * 86400000);
  return { region, days, date: target.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) };
}

/**
 * Remember a viewed product id (newest first, max 6) and return the updated list.
 *
 * >>> rememberRecentlyViewed(3)
 * [3, 7, 1]
 */
function rememberRecentlyViewed(id) {
  try {
    const ids = [id, ...JSON.parse(localStorage.getItem('recentlyViewed') || '[]').filter(x => x !== id)].slice(0, 6);
    localStorage.setItem('recentlyViewed', JSON.stringify(ids));
    return ids;
  } catch { return [id]; }
}

/**
 * Product detail: image, price, qty, actions (cart, save, hint, share),
 * delivery estimator, related + recently viewed, mobile sticky add bar.
 *
 * >>> <Route path="/product/:id" element={<ProductPage />} />
 */
export default function ProductPage() {
  const id = Number(useParams().id);
  const p = PRODUCTS.find(x => x.id === id);
  const { addToCart, wishlist, toggleWishlist, showToast } = useShop();
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState('');
  const [estimate, setEstimate] = useState(undefined); // undefined = not checked, null = invalid
  const [recentIds, setRecentIds] = useState([]);
  const [stickyVisible, setStickyVisible] = useState(false);
  const actionsRef = useRef(null);

  // ── Reset per product + track recently viewed ──
  useEffect(() => {
    setQty(1); setPincode(''); setEstimate(undefined);
    setRecentIds(rememberRecentlyViewed(id));
  }, [id]);

  // ── Mobile sticky bar appears once the action buttons scroll away ──
  useEffect(() => {
    const onScroll = () => {
      const rect = actionsRef.current?.getBoundingClientRect();
      setStickyVisible(window.innerWidth <= 768 && !!rect && rect.bottom < 50);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!p) return <NotFoundPage title="Product not found" />;

  const wished = wishlist.has(p.id);
  const discount = discountPercent(p);
  const productUrl = `${window.location.origin}/product/${p.id}`;
  const related = PRODUCTS.filter(r => r.category === p.category && r.id !== p.id).slice(0, 4);
  const recent = recentIds.filter(x => x !== p.id).map(x => PRODUCTS.find(r => r.id === x)).filter(Boolean);
  const addCurrent = () => addToCart(p.id, qty);

  const dropAHint = () => {
    const msg = `Hey! Dropping a little hint... 🙈 I'm in love with this *${p.name}* (${formatPrice(p.price)}) from CrochetsBy_Advika! 🌸\nTake a look: ${productUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: `${p.name} — CrochetsBy_Advika`, text: `Take a look at this handmade ${p.name} on CrochetsBy_Advika! 🧶`, url: productUrl }); } catch { /* user cancelled */ }
      return;
    }
    try { await navigator.clipboard.writeText(productUrl); showToast('Product link copied to clipboard! ✦'); }
    catch { showToast('Share link: ' + productUrl); }
  };

  return (
    <>
      <section className="page active">
        <div className="wrap">
          <div className="detail-grid">
            <div className="detail-media"><img src={p.img} alt={p.name} /></div>
            <div className="detail-info">
              {p.tag && <span className={`tag ${tagClassName(p.tag)}`}>{p.tag}</span>}
              <h1>{p.name}</h1>
              <div className="detail-price-row">
                <span className="price">{formatPrice(p.price)}</span>
                {p.originalPrice && <>
                  <span className="price-strike">{formatPrice(p.originalPrice)}</span>
                  <span className="discount-badge" style={{ position: 'static' }}>{discount}% OFF</span>
                </>}
              </div>
              <p className="desc">{p.desc}</p>

              <div className="qty-stepper">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button><span>{qty}</span><button onClick={() => setQty(q => q + 1)}>+</button>
              </div>

              {/* ── Actions ── */}
              <div className="detail-actions" ref={actionsRef}>
                <button className="btn btn-charcoal" disabled={p.soldOut} onClick={addCurrent}>{p.soldOut ? 'Sold Out' : 'Add to Cart'}</button>
                <button className="btn btn-outline" onClick={() => toggleWishlist(p.id)}>{wished ? '♥ Saved' : '♡ Save'}</button>
                <button className="btn btn-outline" onClick={dropAHint}>Drop a Hint 💌</button>
                <button className="btn btn-outline" onClick={share} title="Share piece">↗ Share</button>
              </div>

              {/* ── Delivery estimator ── */}
              <div className="delivery-estimator">
                <div className="estimator-head"><span>🚚</span><b>Estimated Delivery Date</b></div>
                <div className="estimator-row">
                  <input type="text" value={pincode} onChange={e => setPincode(e.target.value.trim())} placeholder="Enter 6-digit Pincode (e.g. 400077)" maxLength={6} inputMode="numeric" />
                  <button type="button" className="btn btn-sage btn-sm" onClick={() => setEstimate(estimateDelivery(pincode))}>Check</button>
                </div>
                {estimate === null && <div className="estimator-result error" style={{ display: 'block' }}>Please enter a valid 6-digit Indian Pincode</div>}
                {estimate && <div className="estimator-result" style={{ display: 'block' }}>✨ Handcrafted &amp; delivered to <b>{estimate.region}</b> by <b>{estimate.date}</b> (approx {estimate.days}–{estimate.days + 2} days).</div>}
              </div>

              {p.reel && <a className="btn btn-reel" href={p.reel} target="_blank" rel="noopener" style={{ marginBottom: 20 }}>▶ Watch Reel on Instagram</a>}
              <div className="info-block"><b>Materials &amp; Quality</b><p>Hand-selected premium acrylic and cotton blend yarn for durability and softness.</p></div>
              <div className="info-block"><b>Production &amp; Shipping</b><p>Handmade to order — dispatches within 3–7 business days, delivered pan-India.</p></div>
              <div className="info-block"><b>Care Instructions</b><p>Hand wash in cold water with mild detergent. Dry flat in shade. Do not wring.</p></div>
            </div>
          </div>

          {/* ── Related + recently viewed ── */}
          <div className="section" style={{ paddingTop: 0 }}>
            <div className="section-head"><h2>You May Also Like</h2></div>
            <div className="product-grid">{related.map(r => <ProductCard key={r.id} product={r} />)}</div>
          </div>
          {recent.length > 0 && (
            <div className="recently-viewed-section">
              <div className="section-head" style={{ marginBottom: 20 }}>
                <div><div className="eyebrow"><span className="dot"></span> Jump Back In</div><h2 style={{ marginTop: 6 }}>Recently Viewed By You</h2></div>
              </div>
              <div className="recently-viewed-row">{recent.map(r => <ProductCard key={r.id} product={r} />)}</div>
            </div>
          )}
        </div>
      </section>

      {/* ── Mobile sticky add-to-cart bar ── */}
      <div className={`mobile-sticky-bar${stickyVisible ? ' visible' : ''}`}>
        <div className="sticky-thumb"><img src={p.img} alt="Thumbnail" /></div>
        <div className="sticky-info">
          <div className="sticky-name">{p.name}</div>
          <div className="sticky-price">{formatPrice(p.price)}</div>
        </div>
        <button className="btn btn-charcoal btn-sm" disabled={p.soldOut} onClick={addCurrent}>{p.soldOut ? 'Sold Out' : 'Add to Cart'}</button>
      </div>
    </>
  );
}
