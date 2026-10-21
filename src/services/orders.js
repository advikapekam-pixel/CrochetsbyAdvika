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
      giftMessage: order.giftMessage ? order.giftMessage.slice(0, 100) : '',
    });
  } catch (err) {
    console.warn('Tracking snapshot failed (order still placed):', err);
  }
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
  try {
    await setDoc(doc(db, 'tracking', shortOrderId(orderId)), { status }, { merge: true });
  } catch (err) {
    console.warn('Tracking status update failed:', err);
  }
}

/**
 * Find an order to track by its 7-char order number (or full order ID),
 * or by phone / order history for a logged-in customer. Returns the order (with id) or null.
 *
 * >>> await findOrderToTrack('#A1B2C3D')
 * { id: 'a1b2c3d4…', status: 'in progress', name: 'Riya', items: [...], ... }
 */
export async function findOrderToTrack(input, uid = null) {
  const raw = (input || '').replace(/#/g, '').trim();
  if (!raw) return null;

  const upper = raw.toUpperCase();
  // Extract 7-char short ID (works whether customer entered 7-char ID or full 20-char Firestore ID)
  const shortId = upper.slice(0, 7);

  // 1. By order number: public tracking snapshot
  if (/^[A-Z0-9]{7}$/.test(shortId)) {
    try {
      const snap = await getDoc(doc(db, 'tracking', shortId));
      if (snap.exists()) {
        return { ...snap.data(), id: snap.data().orderId || shortId };
      }
    } catch (err) {
      console.warn('Tracking lookup by shortId failed:', err);
    }
  }

  // 2. If logged in, search within customer's own orders (by short ID, full ID, or phone)
  if (uid) {
    try {
      const mine = await listCustomerOrders(uid);
      const phoneInput = cleanIndianPhone(raw);
      const match = mine.find(o =>
        shortOrderId(o.id) === shortId ||
        o.id.toUpperCase() === upper ||
        o.id === raw ||
        (phoneInput.length === 10 && cleanIndianPhone(o.phone) === phoneInput)
      );
      if (match) return match;
    } catch (err) {
      console.warn('Customer orders fallback lookup failed:', err);
    }
  }

  // 3. Fallback: If logged in and given a full order ID, try direct getDoc on orders
  if (uid && raw.length >= 15) {
    try {
      const orderSnap = await getDoc(doc(db, 'orders', raw));
      if (orderSnap.exists() && orderSnap.data().uid === uid) {
        return { id: orderSnap.id, ...orderSnap.data() };
      }
    } catch {
      /* ignore permission denial or missing doc */
    }
  }

  return null;
}
