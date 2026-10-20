import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';
import { useShop } from '../shop/ShopContext';
import { findCoupon, priceCart } from '../shop/cartPricing';
import { formatPrice } from '../shop/format';

/**
 * Shopping bag: line items with qty controls, order summary, promo code,
 * gift note, and the button that leads to checkout details.
 *
 * >>> <Route path="/cart" element={<CartPage />} />
 */
export default function CartPage() {
  const { cart, setCart, showToast } = useShop();
  const [coupon, setCoupon] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  const [showCheckout, setShowCheckout] = useState(false);
  const checkoutRef = useRef(null);

  const pricing = priceCart(cart, coupon);
  const { lines, subtotal, shipping, discount, total } = pricing;

  // ── Checkout ──
  const openCheckout = () => {
    setShowCheckout(true);
    setTimeout(() => checkoutRef.current?.scrollIntoView({ behavior: 'smooth' }));
  };
  const resetExtras = () => { setCoupon(null); setCouponInput(''); setIsGift(false); setGiftMessage(''); };

  // ── Cart line edits ──
  const changeQty = (id, delta) => setCart(c => {
    const next = { ...c, [id]: (c[id] || 0) + delta };
    if (next[id] <= 0) delete next[id];
    return next;
  });
  const removeLine = id => setCart(c => {
    const next = { ...c };
    delete next[id];
    return next;
  });

  // ── Promo code ──
  const applyCoupon = () => {
    const found = findCoupon(couponInput);
    if (!found) { setCouponError('Invalid promo code. Try FIRST10 or FREESHIP'); return; }
    setCoupon(found);
    setCouponError('');
    showToast(`Promo code ${found.code} applied! 🎉`);
  };
  const removeCoupon = () => { setCoupon(null); setCouponInput(''); showToast('Coupon removed'); };

  return (
    <section className="page active">
      <div className="wrap">
        <div className="page-header" style={{ padding: '40px 0 10px' }}>
          <div className="eyebrow"><span className="dot"></span> Shopping Bag</div>
          <h1 style={{ fontSize: 'clamp(30px,4vw,44px)', marginTop: 10 }}>Your Cart</h1>
        </div>

        {lines.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '70px 0' }}>
            <div style={{ fontSize: 40 }}>🧶</div>
            <p style={{ color: 'var(--charcoal-soft)', marginTop: 10 }}>Your cart is empty.</p>
            <Link className="btn btn-rose" to="/gallery" style={{ marginTop: 14 }}>Browse the Gallery →</Link>
          </div>
        ) : (
          <div className="cart-wrap">
            {/* ── Line items ── */}
            <div>
              {lines.map(({ product: p, qty }) => (
                <div key={p.id} className="cart-item">
                  <img src={p.img} alt={p.name} />
                  <div className="cart-item-info">
                    <div className="name">{p.name}</div>
                    <div className="price">{formatPrice(p.price)}</div>
                    <div className="qty-row">
                      <button className="qty-btn" onClick={() => changeQty(p.id, -1)}>−</button>
                      <span>{qty}</span>
                      <button className="qty-btn" onClick={() => changeQty(p.id, 1)}>+</button>
                    </div>
                    <a className="remove-link" onClick={() => removeLine(p.id)}>Remove</a>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Summary, promo, gift ── */}
            <div className="summary-card">
              <h3 style={{ marginBottom: 18, fontSize: 18 }}>Order Summary</h3>
              <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="summary-row"><span>Pan-India Shipping</span><span>{formatPrice(shipping)}</span></div>
              {coupon && (
                <div className="summary-row discount-row">
                  <span>Discount ({coupon.code}) <button style={{ color: 'var(--rose)', marginLeft: 6, fontSize: 11, textDecoration: 'underline' }} onClick={removeCoupon}>remove</button></span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="summary-row total"><span>Total</span><span>{formatPrice(total)}</span></div>

              <div className="coupon-box">
                <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder="Promo code (e.g. FIRST10)" />
                <button type="button" className="btn btn-charcoal btn-sm" onClick={applyCoupon}>Apply</button>
              </div>
              <div className={`coupon-status ${couponError ? 'error' : coupon ? 'success' : ''}`}>
                {couponError || (coupon && `✓ Promo code ${coupon.code} applied!`)}
              </div>

              <div className="gift-option-card">
                <label className="gift-toggle-label">
                  <input type="checkbox" checked={isGift} onChange={e => setIsGift(e.target.checked)} />
                  <span>🎁 Sending as a gift? Add a free note</span>
                </label>
                <div className="gift-note-wrap" style={isGift ? { display: 'block' } : undefined}>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--charcoal-soft)', display: 'block', marginBottom: 4 }}>Handwritten Note Message (Max 200 chars)</label>
                  <textarea value={giftMessage} onChange={e => setGiftMessage(e.target.value)} maxLength={200} placeholder="e.g. Happy Birthday Riya! Hope this little sunflower brightens your days 🌻 Love, Priya" />
                  <small style={{ color: 'var(--charcoal-soft)', fontSize: 11, display: 'block', marginTop: 4 }}>Advika will personally handwrite this on a craft mini-card!</small>
                </div>
              </div>

              <div style={{ background: 'var(--cream)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--charcoal-soft)', marginTop: 16 }}>
                ✦ Pay with UPI QR code after confirming customization &amp; timeline with Advika.
              </div>
              <button className="btn btn-rose btn-block" style={{ marginTop: 18 }} onClick={openCheckout}>Proceed to Details →</button>
            </div>
          </div>
        )}

        {/* Outside the cart branch so the success popup survives the cart emptying */}
        {showCheckout && (
          <div ref={checkoutRef}>
            <CheckoutForm pricing={pricing} coupon={coupon} giftMessage={isGift ? giftMessage.trim() : ''} onPlaced={resetExtras} />
          </div>
        )}
      </div>
    </section>
  );
}
