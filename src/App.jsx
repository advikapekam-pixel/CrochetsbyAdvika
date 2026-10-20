import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import PageStub from './pages/PageStub';

// ── Every page route; stubs are swapped for real pages step by step ──
const ROUTES = [
  { path: '/', title: 'Home' },
  { path: '/gallery', title: 'Gallery' },
  { path: '/product/:id', title: 'Product' },
  { path: '/wishlist', title: 'Wishlist' },
  { path: '/cart', title: 'Cart' },
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
          {ROUTES.map(r => <Route key={r.path} path={r.path} element={<PageStub title={r.title} />} />)}
          <Route path="*" element={<PageStub title="Page not found" />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}
