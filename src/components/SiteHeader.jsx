import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

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
  const closeMenu = () => setMenuOpen(false);

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
          <Link className="mobile-extra-link" to="/login" onClick={closeMenu}>Login</Link>
        </nav>

        <div className="nav-actions">
          <Link className="btn btn-charcoal btn-sm" to="/login">Login</Link>
          <Link className="btn btn-rose btn-sm" to="/custom-order">Custom Order</Link>
          <Link className="icon-btn" to="/wishlist" aria-label="View wishlist">♡</Link>
          <Link className="icon-btn" to="/cart" aria-label="View cart">🛍️</Link>
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
