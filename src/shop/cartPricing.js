import { PRODUCTS } from '../data/catalog.js';

const SHIPPING_FEE = 60;

// ── Promo codes (client-side, same as old site; server check planned in step 10) ──
const COUPONS = {
  FIRST10: { type: 'percent', value: 10, label: '10% Off' },
  ADVIKA10: { type: 'percent', value: 10, label: '10% Off' },
  FREESHIP: { type: 'shipping', value: SHIPPING_FEE, label: 'Free Shipping' },
  YARNLOVE: { type: 'flat', value: 50, label: '₹50 Off' },
};

/**
 * Look up a promo code (case-insensitive); null if unknown.
 *
 * >>> findCoupon('freeship')
 * { code: 'FREESHIP', type: 'shipping', value: 60, label: 'Free Shipping' }
 */
export function findCoupon(input) {
  const code = input.trim().toUpperCase();
  return COUPONS[code] ? { code, ...COUPONS[code] } : null;
}

/**
 * Cart lines and totals for a cart { productId: qty } and optional coupon.
 *
 * >>> priceCart({ 1: 2 }, findCoupon('FIRST10'))
 * { lines: [{ product: {...Sunflower Pot}, qty: 2 }], subtotal: 1500, shipping: 60, discount: 150, total: 1410 }
 *
 * >>> priceCart({ 2: 1 }, findCoupon('FREESHIP')).total
 * 350
 */
export function priceCart(cart, coupon) {
  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ product: PRODUCTS.find(p => p.id === Number(id)), qty }))
    .filter(line => line.product);
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
  let discount = 0;
  if (coupon?.type === 'percent') discount = Math.round(subtotal * coupon.value / 100);
  if (coupon?.type === 'shipping') discount = shipping; // old site also zeroed shipping, double-counting the ₹60
  if (coupon?.type === 'flat') discount = Math.min(subtotal, coupon.value);
  return { lines, subtotal, shipping, discount, total: Math.max(0, subtotal - discount + shipping) };
}
