import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { PRODUCTS } from '../data/catalog';

const ShopContext = createContext(null);

// ── Guest cart lives in localStorage (Firestore sync arrives with login, step 6) ──
function loadGuestCart() {
  try { return JSON.parse(localStorage.getItem('guestCart') || '{}'); } catch { return {}; }
}

/**
 * Shared shop state: cart { productId: qty }, wishlist (Set of ids), toast message.
 *
 * >>> <ShopProvider><App /></ShopProvider>
 */
export function ShopProvider({ children }) {
  const [cart, setCart] = useState(loadGuestCart);
  const [wishlist, setWishlist] = useState(() => new Set()); // not persisted, same as old site
  const [toast, setToast] = useState('');
  const toastTimer = useRef();

  useEffect(() => { localStorage.setItem('guestCart', JSON.stringify(cart)); }, [cart]);

  const showToast = useCallback(message => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  }, []);

  const addToCart = useCallback((id, qty = 1) => {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + qty }));
    const name = PRODUCTS.find(p => p.id === id).name;
    showToast(qty > 1 ? `${name} added to cart 🛍️` : `${name} added to cart ✦`);
  }, [showToast]);

  const toggleWishlist = useCallback(id => {
    const saved = !wishlist.has(id);
    setWishlist(w => {
      const next = new Set(w);
      saved ? next.add(id) : next.delete(id);
      return next;
    });
    showToast(saved ? 'Saved to wishlist ♥' : 'Removed from wishlist');
  }, [wishlist, showToast]);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <ShopContext.Provider value={{ cart, setCart, cartCount, addToCart, wishlist, toggleWishlist, showToast }}>
      {children}
      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </ShopContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useShop = () => useContext(ShopContext);
