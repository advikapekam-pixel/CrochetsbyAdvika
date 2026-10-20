import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Save a logged-in customer's cart { productId: qty } to Firestore.
 *
 * >>> await saveCustomerCart('uid123', { 1: 2, 9: 1 })
 */
export function saveCustomerCart(uid, cart) {
  return setDoc(doc(db, 'carts', uid), { items: cart, updatedAt: serverTimestamp() });
}

/**
 * Load a logged-in customer's saved cart ({} if none).
 *
 * >>> await loadCustomerCart('uid123')
 * { 1: 2, 9: 1 }
 */
export async function loadCustomerCart(uid) {
  const snap = await getDoc(doc(db, 'carts', uid));
  return snap.exists() ? snap.data().items || {} : {};
}
