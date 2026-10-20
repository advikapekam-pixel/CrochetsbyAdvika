import {
  addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from 'firebase/firestore';
import { db } from './firebase';
import { emailAdvikaNewOrder } from './notifyAdvika';
import { cleanIndianPhone } from '../shop/indianPhone';

/**
 * Public order number shown to customers: first 7 chars of the Firestore id.
 *
 * >>> shortOrderId('a1b2c3d4e5f6')
 * 'A1B2C3D'
 */
export function shortOrderId(orderId) {
  return orderId.slice(0, 7).toUpperCase();
}

// ── Public tracking snapshot: no address/phone/email, so anyone with the order number can view it ──
async function writeTrackingSnapshot(orderId, order) {
  try {
    await setDoc(doc(db, 'tracking', shortOrderId(orderId)), {
      orderId,
      type: order.type,
      status: 'new',
      createdAt: serverTimestamp(),
      name: (order.name || '').trim().split(/\s+/)[0] || 'Customer', // first name only
      city: order.city || '',
      items: (order.items || []).map(i => ({ name: i.name || '', qty: i.qty || 1 })),
      total: order.total ?? null,
      idea: order.idea ? order.idea.slice(0, 80) : '',
    });
  } catch (err) { console.warn('Tracking snapshot failed (order still placed):', err); }
}

/**
 * Save a new order (type 'cart' or 'custom'), write its tracking snapshot,
 * email Advika, and return the Firestore order id.
 *
 * >>> await placeOrder({ type: 'cart', name: 'Riya Shah', phone: '+919812345678', items: [...], total: 410 }, user?.uid)
 * 'kX9aB2cD7eF1gH3iJ4kL'
 */
export async function placeOrder(order, uid = null) {
  const ref = await addDoc(collection(db, 'orders'), {
    ...order, uid, status: 'new', createdAt: serverTimestamp(),
  });
  await writeTrackingSnapshot(ref.id, order);
  await emailAdvikaNewOrder(ref.id, order);
  return ref.id;
}

/**
 * A customer's own orders, newest first.
 *
 * >>> (await listCustomerOrders('uid123'))[0].status
 * 'new'
 */
export async function listCustomerOrders(uid) {
  const snap = await getDocs(query(collection(db, 'orders'), where('uid', '==', uid)));
  const orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const millis = o => o.createdAt?.toMillis?.() ?? 0;
  return orders.sort((a, b) => millis(b) - millis(a));
}

/**
 * Every order, newest first (admin only — Firestore rules enforce this).
 *
 * >>> (await listAllOrders()).length
 * 42
 */
export async function listAllOrders() {
  const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Change an order's status ('new' | 'in progress' | 'shipped') and its tracking snapshot.
 *
 * >>> await updateOrderStatus('kX9aB2cD7eF1gH3iJ4kL', 'shipped')
 */
export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, 'orders', orderId), { status });
  try { await updateDoc(doc(db, 'tracking', shortOrderId(orderId)), { status }); }
  catch (err) { console.warn('Tracking status update failed:', err); }
}

/**
 * Find an order to track by 7-char order number, or by phone for a logged-in
 * customer. Returns the order (with id) or null. Never lists all orders.
 *
 * >>> await findOrderToTrack('#A1B2C3D')
 * { id: 'a1b2c3d4…', status: 'in progress', name: 'Riya', items: [...], ... }
 */
export async function findOrderToTrack(input, uid = null) {
  const orderNumber = (input || '').replace(/#/g, '').trim().toUpperCase();

  // ── By order number: public tracking snapshot ──
  if (/^[A-Z0-9]{7}$/.test(orderNumber)) {
    try {
      const snap = await getDoc(doc(db, 'tracking', orderNumber));
      if (snap.exists()) return { ...snap.data(), id: snap.data().orderId || orderNumber };
    } catch (err) { console.warn('Tracking lookup failed:', err); }
  }

  // ── By phone: only within the logged-in customer's own orders ──
  const phone = cleanIndianPhone(input);
  if (phone.length === 10 && uid) {
    const mine = await listCustomerOrders(uid);
    return mine.find(o => cleanIndianPhone(o.phone) === phone) || null;
  }
  return null;
}
