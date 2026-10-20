import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import NotFoundPage from './pages/NotFoundPage';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import ProductPage from './pages/ProductPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import CustomOrderPage from './pages/CustomOrderPage';
import LoginPage from './pages/LoginPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AdminPage from './pages/AdminPage';
import AccountPage from './pages/AccountPage';
import AboutPage from './pages/AboutPage';
import PoliciesPage from './pages/PoliciesPage';

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
          <Route path="/custom-order" element={<CustomOrderPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/policies/:tab?" element={<PoliciesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}
