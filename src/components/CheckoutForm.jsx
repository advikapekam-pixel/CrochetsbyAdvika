import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../shop/ShopContext';
import { useAccount } from '../account/AccountContext';
import { formatPrice } from '../shop/format';
import { cleanIndianPhone, isValidIndianPhone } from '../shop/indianPhone';
import { whatsappAdvikaLink } from '../shop/whatsapp';
import { placeOrder, shortOrderId } from '../services/orders';

/**
 * WhatsApp message a customer sends Advika after placing a cart order.
 *
 * >>> cartOrderMessage('A1B2C3D', order).split('\n')[0]
 * "Hi Advika! 🧶 I've placed Order #A1B2C3D on CrochetsBy_Advika:"
 */
function cartOrderMessage(orderNumber, o) {
  const items = o.items.map(i => `• ${i.name} x${i.qty} (${formatPrice(i.price * i.qty)})`).join('\n');
  let text = `Hi Advika! 🧶 I've placed Order #${orderNumber} on CrochetsBy_Advika:\n\n${items}\n\n`;
  if (o.discountAmount > 0) text += `Discount: -${formatPrice(o.discountAmount)} (${o.couponApplied})\n`;
  text += `Total: ${formatPrice(o.total)} (incl. shipping)\nDelivery to: ${o.name}, ${o.city} (${o.pincode})\nPhone: ${o.phone}\n`;
  if (o.giftMessage) text += `\n🎁 Gift Order Note: "${o.giftMessage}"\n`;
  return text + `\nPlease let me know your UPI QR code to complete the payment! ✨`;
}

/**
 * Delivery & contact form under the cart. Saves the order, empties the cart,
 * and shows a success popup with the WhatsApp payment link.
 *
 * >>> <CheckoutForm pricing={priceCart(cart, coupon)} coupon={coupon} giftMessage="Happy birthday!" onPlaced={reset} />
 */
export default function CheckoutForm({ pricing, coupon, giftMessage, onPlaced }) {
  const navigate = useNavigate();
  const { setCart, showToast } = useShop();
  const { user, profile } = useAccount();
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(null); // { orderNumber, order }

  const submit = async e => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    if (!isValidIndianPhone(form.phone)) {
      showToast('Please enter a valid 10-digit Indian mobile number so Advika can connect with you!');
      return;
    }

    // ── Order record (prices from the shared cart pricing) ──
    const order = {
      type: 'cart',
      name: form.name,
      phone: '+91' + cleanIndianPhone(form.phone),
      phoneVerified: Boolean(profile?.phoneVerified && profile.phone === '+91' + cleanIndianPhone(form.phone)),
      email: form.email,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      notes: form.notes,
      isGift: Boolean(giftMessage),
      giftMessage,
      couponApplied: coupon?.code ?? null,
      discountAmount: pricing.discount,
      items: pricing.lines.map(({ product: p, qty }) => ({ id: p.id, name: p.name, price: p.price, qty })),
      subtotal: pricing.subtotal,
      shipping: pricing.shipping,
      total: pricing.total,
      paymentStatus: 'pending_upi_qr',
    };

    setPlacing(true);
    try {
      const orderId = await placeOrder(order, user?.uid);
      setPlaced({ orderNumber: shortOrderId(orderId), order });
      e.target.reset();
      setCart({});
      onPlaced();
    } catch (err) {
      console.error(err);
      showToast('Something went wrong placing the order — please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <div className="form-shell" style={{ maxWidth: 640, margin: '0 auto 80px' }}>
        <div className="form-card">
          <h2>Delivery &amp; Contact Details</h2>
          <p className="sub">Please enter your delivery address and contact information below.</p>
          <div className="checkout-process-banner">
            <b>✨ How Order &amp; Payment Works:</b>
            <span>No payment is charged online now. After placing your order, Advika will connect with you on WhatsApp to confirm pieces, custom colors, and share her UPI QR code for payment.</span>
          </div>

          <form onSubmit={submit} key={user?.uid || 'guest'}>
            <div className="row-2">
              <div className="field"><label htmlFor="ckName">Full Name *</label><input id="ckName" name="name" type="text" defaultValue={profile?.name} required placeholder="Advika Pekam" /></div>
              <div className="field"><label htmlFor="ckPhone">Mobile Number (WhatsApp) *</label><input id="ckPhone" name="phone" type="tel" defaultValue={cleanIndianPhone(profile?.phone)} required placeholder="10-digit mobile number" maxLength={10} inputMode="numeric" /></div>
            </div>
            <div className="field"><label htmlFor="ckEmail">Email Address (for order receipts)</label><input id="ckEmail" name="email" type="email" defaultValue={user?.email} placeholder="you@email.com" /></div>
            <div className="field"><label htmlFor="ckAddress">Complete Delivery Address *</label><textarea id="ckAddress" name="address" required placeholder="Flat/House number, building name, street, locality, landmark" /></div>
            <div className="row-2">
              <div className="field"><label htmlFor="ckCity">City *</label><input id="ckCity" name="city" type="text" required placeholder="Mumbai" /></div>
              <div className="field"><label htmlFor="ckPincode">Pincode *</label><input id="ckPincode" name="pincode" type="text" required placeholder="400077" maxLength={6} inputMode="numeric" pattern="[1-9][0-9]{5}" title="6-digit Indian pincode" /></div>
            </div>
            <div className="field"><label htmlFor="ckNotes">Notes / Custom Tweaks (Optional)</label><input id="ckNotes" name="notes" type="text" placeholder="Colour tweaks, gift message, or deadline..." /></div>

            <button type="submit" className="btn btn-rose btn-block" disabled={placing} style={{ fontSize: 15, padding: '15px 0' }}>
              {placing ? 'Placing Order...' : 'Place Order & Finalize on WhatsApp →'}
            </button>
            <small style={{ display: 'block', textAlign: 'center', color: 'var(--charcoal-soft)', marginTop: 10 }}>Payment is finalized after chatting with Advika via UPI QR.</small>
          </form>
        </div>
      </div>

      {/* ── Success popup ── */}
      <div className={`modal-overlay${placed ? ' show' : ''}`}>
        {placed && (
          <div className="modal-card">
            <div style={{ fontSize: 48 }}>🎉</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you! Your order has been recorded. Advika will connect with you on WhatsApp to confirm customization, colors, and delivery timeline.</p>
            <div className="modal-details">
              <b>Order #{placed.orderNumber}</b><br />
              Total: <b>{formatPrice(placed.order.total)}</b><br />
              Shipping to: {placed.order.name}, {placed.order.city} ({placed.order.pincode})<br />
              {placed.order.giftMessage && <>🎁 Free Gift Note Included<br /></>}
              Contact: <b>{placed.order.phone}</b>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
              <a className="btn btn-whatsapp btn-block" href={whatsappAdvikaLink(cartOrderMessage(placed.orderNumber, placed.order))} target="_blank" rel="noopener" style={{ fontSize: 15, padding: '15px 0' }}>💬 Chat with Advika to Confirm &amp; Pay</a>
              <button className="btn btn-outline btn-block" onClick={() => navigate('/track', { state: { orderId: placed.orderNumber } })}>Track Order</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
