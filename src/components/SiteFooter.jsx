import { Link } from 'react-router-dom';

const WHATSAPP_URL = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`;
const INSTAGRAM_URL = 'https://instagram.com/crochetsby_advika';

/**
 * Site footer: brand blurb, social icons, shop/help/contact link columns.
 *
 * >>> <SiteFooter />
 */
export default function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap footer-grid">
        {/* ── Brand + socials ── */}
        <div className="footer-brand">
          <span className="brand">Crochets<span className="brand-2">By_Advika</span></span>
          <p>Handmade crochet plushies, headbands, and custom gifts — designed and stitched one loop at a time in Mumbai, India.</p>
          <div className="social-row">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" /><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" /></svg>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.79 14.13c-.24.67-1.39 1.28-1.92 1.36-.5.08-1.15.11-3.7-1.02-2.18-.97-3.6-3.23-3.71-3.38-.11-.15-.89-1.19-.89-2.27s.56-1.61.76-1.83c.2-.22.44-.28.59-.28.15 0 .3 0 .43.01.14.01.32-.05.5.38.19.45.64 1.56.7 1.68.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.25.31-.36.42-.12.12-.24.25-.1.5.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.53-.12.22.08 1.38.65 1.62.77.24.12.4.18.46.28.06.1.06.58-.18 1.25z" /></svg>
            </a>
          </div>
        </div>

        {/* ── Link columns ── */}
        <div className="footer-cols">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/gallery">Full Gallery</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/track">Track Order</Link>
            <Link to="/custom-order">Custom Order</Link>
          </div>
          <div className="footer-col">
            <h4>Company &amp; Help</h4>
            <Link to="/about">About Us</Link>
            <Link to="/account">My Account</Link>
            <Link to="/policies/shipping">Shipping Policy</Link>
            <Link to="/policies/payment">Payment &amp; UPI</Link>
            <Link to="/policies/care">Care Guide</Link>
          </div>
          <div className="footer-col">
            <h4>Get In Touch</h4>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener">WhatsApp Support →</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener">DM on Instagram →</a>
            <a href="mailto:crochetsbyadvika@gmail.com">crochetsbyadvika@gmail.com</a>
            <p className="footer-note">Mumbai, India — usually replies within 2–6 hours.</p>
          </div>
        </div>
      </div>
      <p className="copyright">© 2026 CrochetsBy_Advika. Handcrafted with love &amp; yarn.</p>
    </footer>
  );
}
