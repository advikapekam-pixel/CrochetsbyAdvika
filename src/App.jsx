import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import PageStub from './pages/PageStub';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import ProductPage from './pages/ProductPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';

// ── Pages still to port; each stub is swapped for its real page step by step ──
const STUB_ROUTES = [
  { path: '/track', title: 'Track Order' },
  { path: '/custom-order', title: 'Custom Order' },
  { path: '/login', title: 'Login' },
  { path: '/account', title: 'My Account' },
  { path: '/admin', title: 'Admin' },
  { path: '/about', title: 'About' },
  { path: '/policies/:tab?', title: 'Policies' },
];

/**
 * App layout: header, the current page, footer. Scrolls to top on page change.
 *
 * >>> <BrowserRouter><App /></BrowserRouter>
 */
export default function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);

  return (
    <>
      <SiteHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/cart" element={<CartPage />} />
          {STUB_ROUTES.map(r => <Route key={r.path} path={r.path} element={<PageStub title={r.title} />} />)}
          <Route path="*" element={<PageStub title="Page not found" />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}
