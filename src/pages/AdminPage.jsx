import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAccount } from '../account/AccountContext';
import { useShop } from '../shop/ShopContext';
import { formatDate, formatPrice } from '../shop/format';
import { cleanIndianPhone } from '../shop/indianPhone';
import { trackingStep } from '../shop/orderStatus';
import { listAllOrders, shortOrderId, updateOrderStatus } from '../services/orders';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'in progress', label: 'In Progress' },
  { value: 'shipped', label: 'Shipped' },
];

/**
 * Download every order as an Excel file (SheetJS loaded only when clicked).
 *
 * >>> await downloadOrdersExcel(orders)   // saves crochetsby-advika-orders-2026-10-20.xlsx
 */
async function downloadOrdersExcel(orders) {
  const XLSX = await import('xlsx');
  const rows = orders.map(o => ({
    ID: shortOrderId(o.id), Date: formatDate(o.createdAt), Type: o.type, Name: o.name, Phone: o.phone, Email: o.email,
    City: o.city || '', Pincode: o.pincode || '', Address: o.address || '', Budget: o.budget || '', Idea: o.idea || '',
    'Cart Items': (o.items || []).map(i => `${i.name} x${i.qty}`).join('; '),
    'Gift Message': o.giftMessage || '', Coupon: o.couponApplied || '',
    Subtotal: o.subtotal || '', Discount: o.discountAmount || 0, Shipping: o.shipping || '', Total: o.total || '',
    Status: o.status || 'new',
  }));
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet(rows), 'Orders');
  XLSX.writeFile(book, `crochetsby-advika-orders-${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/** One table row: customer, contact, details, amount, status picker, WhatsApp. */
function AdminOrderRow({ order: o, onStatusChange }) {
  const isCart = o.type === 'cart';
  const phone = cleanIndianPhone(o.phone);
  const waText = `Hi ${o.name || 'there'}! I'm Advika from CrochetsBy_Advika regarding your Order #${shortOrderId(o.id)}.`;
  const step = trackingStep(o.status || 'new');

  return (
    <tr>
      <td>{formatDate(o.createdAt)}</td>
      <td style={{ textTransform: 'capitalize', fontWeight: 700 }}>{o.type || ''}</td>
      <td><b>{o.name || '—'}</b><br /><small style={{ color: 'var(--charcoal-soft)' }}>{o.city || ''}</small></td>
      <td>
        <a href={`tel:+91${phone}`} style={{ color: 'var(--charcoal)', textDecoration: 'underline' }}>+91 {phone}</a>
        {o.phoneVerified && <><br /><span className="admin-badge-verified">✓ Verified</span></>}
        <br /><small style={{ color: 'var(--charcoal-soft)' }}>{o.email || ''}</small>
      </td>
      <td style={{ maxWidth: 240, fontSize: 12.5 }}>
        {isCart ? (o.items || []).map(i => `${i.name} x${i.qty}`).join(', ') : `Budget: ${o.budget || '—'} | ${o.idea || '—'}`}
        {o.giftMessage && <><br /><span style={{ color: 'var(--rose-dark)', fontSize: 11.5 }}>🎁 Note: "{o.giftMessage}"</span></>}
      </td>
      <td><b>{isCart ? formatPrice(o.total || 0) : '—'}</b></td>
      <td>
        <select className="status-select" value={STATUS_OPTIONS[step - 1].value} onChange={e => onStatusChange(o.id, e.target.value)}>
          {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </td>
      <td>
        {phone ? <a className="btn btn-whatsapp btn-sm" href={`https://wa.me/91${phone}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener" style={{ padding: '5px 10px', fontSize: 11 }}>💬 WhatsApp</a> : '—'}
      </td>
    </tr>
  );
}

/**
 * Admin-only orders dashboard: stats, all orders, status changes, Excel export.
 *
 * >>> <Route path="/admin" element={<AdminPage />} />
 */
export default function AdminPage() {
  const { isAdmin, ready } = useAccount();
  const { showToast } = useShop();
  const [orders, setOrders] = useState(null); // null = loading, 'error' = failed

  const refresh = useCallback(() => {
    setOrders(null);
    listAllOrders().then(setOrders).catch(err => { console.error(err); setOrders('error'); });
  }, []);
  useEffect(() => { if (isAdmin) refresh(); }, [isAdmin, refresh]);

  if (!ready) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  const list = Array.isArray(orders) ? orders : [];
  const openCount = list.filter(o => trackingStep(o.status || 'new') < 3).length; // old site counted shipped too
  const shopSales = list.filter(o => o.type === 'cart').reduce((sum, o) => sum + (o.total || 0), 0);

  const changeStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
      showToast(`Order status updated to "${status}" ✦`);
    } catch (err) {
      console.error(err);
      showToast('Failed to update status.');
    }
  };
  const exportExcel = () => (list.length ? downloadOrdersExcel(list) : showToast('No orders to export yet ✦'));
  const tableMessage = orders === null ? 'Loading orders...' : orders === 'error' ? 'Failed to load orders.' : list.length === 0 ? 'No orders yet.' : '';

  return (
    <section className="page active">
      <div className="wrap" style={{ paddingTop: 40 }}>
        <div className="page-header" style={{ paddingBottom: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="eyebrow"><span className="dot"></span> Store Administration</div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,40px)', marginTop: 10 }}>Orders Dashboard</h1>
            <p style={{ color: 'var(--charcoal-soft)', fontSize: 14.5 }}>Manage customer orders, update delivery statuses, and chat on WhatsApp in one click.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-charcoal" onClick={exportExcel}>⬇ Download Excel</button>
            <button className="btn btn-outline" onClick={refresh}>🔄 Refresh</button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="admin-stat-row">
          <div className="admin-stat-card"><span>Total Orders</span><h3>{list.length}</h3></div>
          <div className="admin-stat-card"><span>New / In Progress</span><h3 style={{ color: 'var(--rose)' }}>{openCount}</h3></div>
          <div className="admin-stat-card"><span>Total Shop Sales</span><h3 style={{ color: 'var(--sage-dark)' }}>{formatPrice(shopSales)}</h3></div>
        </div>

        {/* ── Orders table ── */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Date</th><th>Type</th><th>Customer</th><th>Phone / Contact</th><th>Details &amp; Notes</th><th>Amount</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {tableMessage
                ? <tr><td colSpan={8} style={{ padding: 18, textAlign: 'center' }}>{tableMessage}</td></tr>
                : list.map(o => <AdminOrderRow key={o.id} order={o} onStatusChange={changeStatus} />)}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
