import emailjs from '@emailjs/browser';

// ── EmailJS settings from .env (VITE_EMAILJS_*) ──
const env = import.meta.env;
const SEND_OPTIONS = { publicKey: env.VITE_EMAILJS_PUBLIC_KEY };

/** Send an EmailJS template; failures are logged, never thrown (email is best-effort). */
async function sendEmail(templateId, params) {
  try { await emailjs.send(env.VITE_EMAILJS_SERVICE_ID, templateId, params, SEND_OPTIONS); }
  catch (err) { console.warn('Email to Advika failed:', err); }
}

/**
 * Email Advika that a new order (cart or custom) was placed.
 *
 * >>> await emailAdvikaNewOrder('abc123XYZ', { type: 'cart', name: 'Riya', items: [{ name: 'Tulip Bag Charm', qty: 2 }], total: 360 })
 */
export function emailAdvikaNewOrder(orderId, order) {
  const isCart = order.type === 'cart';
  return sendEmail(env.VITE_EMAILJS_TEMPLATE_ORDER, {
    order_type: isCart ? 'Cart Order' : 'Custom Order',
    customer_name: order.name || '',
    customer_email: order.email || '',
    customer_phone: order.phone || '',
    cart_items: isCart ? (order.items || []).map(i => `${i.name} x${i.qty}`).join(', ') : '',
    order_total: isCart && order.total != null ? order.total : '',
    order_budget: isCart ? '' : order.budget || '',
    order_idea: isCart ? '' : order.idea || '',
    order_id: orderId,
  });
}

/**
 * Email Advika that a new customer signed up.
 *
 * >>> await emailAdvikaNewSignup('Riya Shah', 'riya@example.com')
 */
export function emailAdvikaNewSignup(name, email) {
  return sendEmail(env.VITE_EMAILJS_TEMPLATE_SIGNUP, {
    new_user_name: name,
    new_user_email: email,
    signup_time: new Date().toLocaleString('en-IN'),
  });
}
