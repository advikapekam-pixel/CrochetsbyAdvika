import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useShop } from '../shop/ShopContext';
import { useAccount } from '../account/AccountContext';
import { logOutCustomer } from '../services/customerAccount';

// ── Main nav links (desktop + mobile drawer) ──
const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/track', label: 'Track Order' },
  { to: '/account', label: 'My Account' },
];

/**
 * Sticky site header: brand, nav links, cart/wishlist icons, mobile menu.
 *
 * >>> <SiteHeader />
 */
export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, wishlist, showToast } = useShop();
  const { user, isAdmin } = useAccount();
  const navigate = useNavigate();
  const closeMenu = () => setMenuOpen(false);

  // ── Login button doubles as Logout once signed in ──
  const authAction = async () => {
    closeMenu();
    if (!user) { navigate('/login'); return; }
    await logOutCustomer();
    showToast('Logged out ✦');
    navigate('/');
  };

  return (
    <header className="site">
      <div className="wrap nav-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <img className="brand-logo" src="/images/logo.png" alt="CrochetsBy_Advika logo" />
          <span>Crochets<span className="brand-2">By_Advika</span></span>
        </Link>

        <nav className={`links${menuOpen ? ' open' : ''}`}>
          {NAV_LINKS.map(link => (
            <NavLink key={link.to} to={link.to} end onClick={closeMenu}>{link.label}</NavLink>
          ))}
          <Link className="mobile-extra-link" to="/custom-order" onClick={closeMenu}>Custom Order</Link>
          {isAdmin && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}
          <a className="mobile-extra-link" onClick={authAction}>{user ? 'Logout' : 'Login'}</a>
        </nav>

        <div className="nav-actions">
          <a className="btn btn-charcoal btn-sm" onClick={authAction}>{user ? 'Logout' : 'Login'}</a>
          <Link className="btn btn-rose btn-sm" to="/custom-order">Custom Order</Link>
          <Link className="icon-btn" to="/wishlist" aria-label="View wishlist">♡{wishlist.size > 0 && <span className="badge-count">{wishlist.size}</span>}</Link>
          <Link className="icon-btn" to="/cart" aria-label="View cart">🛍️{cartCount > 0 && <span className="badge-count">{cartCount}</span>}</Link>
          <button
            className={`menu-toggle${menuOpen ? ' active' : ''}`}
            onClick={() => setMenuOpen(open => !open)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
