import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAccount } from '../account/AccountContext';
import PhoneVerifyStep from '../components/PhoneVerifyStep';
import { useShop } from '../shop/ShopContext';
import { formatDate, formatPrice } from '../shop/format';
import { cleanIndianPhone, isValidIndianPhone } from '../shop/indianPhone';
import { whatsappAdvikaLink } from '../shop/whatsapp';
import { logOutCustomer, updateCustomerProfile } from '../services/customerAccount';
import { listCustomerOrders, shortOrderId } from '../services/orders';

const ROW = { display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid var(--border)', fontSize: 13.5 };
const CARD = { background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 30, boxShadow: 'var(--shadow-card)' };

/** One past order with status pill and a WhatsApp follow-up link. */
function OrderHistoryCard({ order: o }) {
  const isCart = o.type === 'cart';
  const number = shortOrderId(o.id);
  const waText = `Hi Advika! 🧶 Following up on my Order #${number} (${isCart ? 'Shop Order' : 'Custom Request'}).`;
  return (
    <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 20, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 11.5, color: 'var(--charcoal-soft)', letterSpacing: '0.04em' }}>{formatDate(o.createdAt)} · #{number}</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>{isCart ? 'Shop Order' : 'Custom Request'}</div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'capitalize', padding: '4px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--sage-light)', color: 'var(--sage-dark)' }}>{o.status || 'new'}</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 13.5, color: 'var(--charcoal-soft)', lineHeight: 1.6 }}>
        {isCart
          ? (o.items || []).map(i => <div key={i.name}>{i.name} x{i.qty} ({formatPrice(i.price * i.qty)})</div>)
          : <><b>Idea:</b> {o.idea || '—'}<br /><b>Budget:</b> {o.budget || '—'}</>}
      </div>
      {o.giftMessage && <div style={{ fontSize: 12, color: 'var(--rose-dark)', marginTop: 8 }}>🎁 <b>Gift Note:</b> "{o.giftMessage}"</div>}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, borderTop: '1px solid var(--border)', paddingTop: 12, flexWrap: 'wrap', gap: 10 }}>
        <span style={{ fontWeight: 800 }}>{isCart ? formatPrice(o.total || 0) : 'Custom Quote'}</span>
        <a className="btn btn-whatsapp btn-sm" href={whatsappAdvikaLink(waText)} target="_blank" rel="noopener">💬 Chat with Advika</a>
      </div>
    </div>
  );
}

/**
 * Logged-in customer's profile (view / edit / verify phone) and order history.
 *
 * >>> <Route path="/account" element={<AccountPage />} />
 */
export default function AccountPage() {
  const navigate = useNavigate();
  const { user, profile, ready, setProfile } = useAccount();
  const { showToast } = useShop();
  const [orders, setOrders] = useState(null); // null = loading, 'error' = failed
  const [editing, setEditing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) listCustomerOrders(user.uid).then(setOrders).catch(err => { console.error(err); setOrders('error'); });
  }, [user]);

  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;

  const p = profile || {};
  const logOut = async () => { await logOutCustomer(); showToast('Logged out ✦'); navigate('/'); };

  const saveProfile = async e => {
    e.preventDefault();
    const form = Object.fromEntries(new FormData(e.target));
    if (form.phone && !isValidIndianPhone(form.phone)) { showToast('Please enter a valid 10-digit mobile number'); return; }
    setSaving(true);
    try {
      const phone = form.phone ? '+91' + cleanIndianPhone(form.phone) : '';
      setProfile(await updateCustomerProfile(user.uid, { name: form.name.trim(), phone }, p));
      showToast('Profile updated ✦');
      setEditing(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page active">
      <div className="wrap page-header" style={{ paddingTop: 40, paddingBottom: 0 }}>
        <div className="eyebrow"><span className="dot"></span> Customer Account</div>
        <h1 style={{ marginTop: 10 }}>Hi, {(p.name || user.email || '').split(' ')[0] || 'there'} 👋</h1>
        <p style={{ color: 'var(--charcoal-soft)', fontSize: 15, marginTop: 10 }}>Your details, custom requests, and order history.</p>
      </div>
      <div className="wrap account-grid" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.6fr', gap: 26, alignItems: 'flex-start', margin: '30px auto 80px', maxWidth: 1100 }}>
        {/* ── Profile card ── */}
        <div className="account-profile-card" style={CARD}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Account Details</h3>
          {editing ? (
            <form onSubmit={saveProfile}>
              <div className="field"><label htmlFor="editName">Full Name</label><input id="editName" name="name" type="text" defaultValue={p.name || ''} placeholder="Full name" /></div>
              <div className="field"><label htmlFor="editPhone">Phone Number</label><input id="editPhone" name="phone" type="tel" defaultValue={cleanIndianPhone(p.phone)} placeholder="9876543210" maxLength={10} /></div>
              <button type="submit" className="btn btn-rose btn-block" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
              <button type="button" className="btn-link" style={{ marginTop: 14, display: 'block', textAlign: 'center', width: '100%' }} onClick={() => setEditing(false)}>Cancel</button>
            </form>
          ) : (
            <>
              <div style={ROW}><span>Name</span><b>{p.name || '—'}</b></div>
              <div style={ROW}><span>Email</span><b>{user.email || '—'}</b></div>
              <div style={ROW}><span>Phone</span><b>{p.phone || '—'}{p.phoneVerified && <span className="admin-badge-verified" style={{ marginLeft: 6 }}>✓ Verified</span>}</b></div>
              <div style={{ ...ROW, borderBottom: 'none' }}><span>Member since</span><b>{formatDate(p.createdAt)}</b></div>
              {p.phone && !p.phoneVerified && (verifying
                ? <PhoneVerifyStep phone={p.phone} onDone={() => setVerifying(false)} onSkip={() => setVerifying(false)} />
                : <button className="btn btn-sage btn-sm btn-block" style={{ marginTop: 10 }} onClick={() => setVerifying(true)}>Verify Phone</button>)}
              <button className="btn btn-outline btn-sm btn-block" style={{ marginTop: 18 }} onClick={() => setEditing(true)}>Edit Profile</button>
              <button className="btn btn-outline btn-sm btn-block" style={{ marginTop: 10 }} onClick={logOut}>Logout</button>
            </>
          )}
        </div>

        {/* ── Order history ── */}
        <div className="account-orders">
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Order &amp; Custom History</h3>
          {orders === null && <p style={{ color: 'var(--charcoal-soft)', fontSize: 13.5 }}>Loading orders...</p>}
          {orders === 'error' && <p style={{ color: 'var(--charcoal-soft)' }}>Couldn't load orders.</p>}
          {Array.isArray(orders) && orders.length === 0 && (
            <div className="empty-state" style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 36 }}>🧶</div>
              <p style={{ color: 'var(--charcoal-soft)', marginTop: 10 }}>No orders yet.</p>
              <Link className="btn btn-rose btn-sm" to="/gallery" style={{ marginTop: 14 }}>Browse Collection →</Link>
            </div>
          )}
          {Array.isArray(orders) && orders.map(o => <OrderHistoryCard key={o.id} order={o} />)}
        </div>
      </div>
    </section>
  );
}
