import { useState } from 'react';
import { useAccount } from '../account/AccountContext';
import { useShop } from '../shop/ShopContext';
import { formatDate, formatPrice } from '../shop/format';
import { whatsappAdvikaLink } from '../shop/whatsapp';
import { trackingStep } from '../shop/orderStatus';
import { findOrderToTrack, shortOrderId } from '../services/orders';

const STEPS = ['Order Received', 'In Progress', 'Dispatched'];

/** Order card with the 3-step progress timeline. */
function TrackingResult({ order }) {
  const isCart = order.type === 'cart';
  const status = (order.status || 'new').toLowerCase();
  const step = trackingStep(status);
  const number = shortOrderId(order.id);

  return (
    <div className="timeline-card">
      <div className="track-header">
        <div>
          <div className="track-oid">Order #{number}</div>
          <div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>{isCart ? 'Handmade Shop Order' : 'Bespoke Custom Piece'}</div>
          <div style={{ fontSize: 12, color: 'var(--charcoal-soft)', marginTop: 2 }}>Placed on {formatDate(order.createdAt)}</div>
        </div>
        <span className="track-status-pill">{status}</span>
      </div>

      <div className="timeline-steps">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < step || n === 3 && step === 3; // final step shows ✓ once reached
          return (
            <div key={label} className={`timeline-step${n > step ? '' : n === step ? ' active' : ' completed'}`}>
              <div className="step-dot">{done ? '✓' : n}</div>
              <div className="step-label">{label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ background: 'var(--cream)', padding: 16, borderRadius: 'var(--radius-md)', marginTop: 20, fontSize: 13.5, lineHeight: 1.6 }}>
        {isCart
          ? <><b>Items:</b> {(order.items || []).map(i => `${i.name} x${i.qty}`).join(', ') || '—'}<br /></>
          : <><b>Idea:</b> {order.idea || '—'}<br /></>}
        <b>Delivery to:</b> {order.name || '—'}{order.city && `, ${order.city}`}<br />
        {order.giftMessage && <>🎁 <b>Handwritten Note:</b> "{order.giftMessage}"<br /></>}
        <b>Total:</b> {order.total != null ? formatPrice(order.total) : isCart ? '—' : 'Custom Quote'}
      </div>

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <a className="btn btn-whatsapp btn-sm" href={whatsappAdvikaLink(`Hi Advika! 🧶 Checking on the progress of my Order #${number}.`)} target="_blank" rel="noopener">💬 Chat with Advika about this order</a>
      </div>
    </div>
  );
}

/**
 * Track an order by its 7-character number (or phone, when logged in).
 *
 * >>> <Route path="/track" element={<TrackOrderPage />} />
 */
export default function TrackOrderPage() {
  const { user } = useAccount();
  const { showToast } = useShop();
  const [input, setInput] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState(undefined); // undefined = not searched, null = not found

  const search = async e => {
    e.preventDefault();
    setSearching(true);
    try { setResult(await findOrderToTrack(input, user?.uid)); }
    catch (err) { console.error(err); showToast('Failed to retrieve tracking information'); }
    finally { setSearching(false); }
  };

  return (
    <section className="page active">
      <div className="wrap form-shell" style={{ maxWidth: 700 }}>
        <div className="form-card" style={{ textAlign: 'center' }}>
          <div className="eyebrow"><span className="dot"></span> Live Tracking</div>
          <h2 style={{ marginTop: 10 }}>Track Your Handmade Order</h2>
          <p className="sub">Enter your 7-character Order ID (e.g. #A1B2C3D) to track your piece's progress.</p>
          <form onSubmit={search} style={{ display: 'flex', gap: 10, maxWidth: 480, margin: '0 auto 10px' }}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Order ID (e.g. #A1B2C3D)" required
              style={{ flex: 1, padding: '12px 18px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-pill)', fontFamily: 'inherit', fontSize: 14, background: 'var(--cream-deep)' }} />
            <button type="submit" className="btn btn-rose btn-sm" disabled={searching}>{searching ? 'Searching...' : 'Track'}</button>
          </form>

          {result === null && (
            <div style={{ background: 'var(--rose-pale)', border: '1px solid var(--rose-light)', borderRadius: 'var(--radius-md)', padding: 18, marginTop: 20, color: 'var(--rose-dark)', fontSize: 13.5, lineHeight: 1.6 }}>
              No order found matching "<b>{input}</b>". Please check your 7-character Order ID (e.g. #A1B2C3D).<br />
              <small style={{ color: 'var(--charcoal-soft)', display: 'block', marginTop: 6 }}>Note: Tracking by phone number requires logging in to your account.</small>
            </div>
          )}
          {result && <TrackingResult order={result} />}
        </div>
      </div>
    </section>
  );
}
