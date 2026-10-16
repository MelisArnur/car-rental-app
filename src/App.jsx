import { useEffect, useState } from 'react';
import { Outlet, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import { Toast } from './components/Toast/Toast';
import { useFavorites } from './context/useContexts';
import { BookingsPage } from './pages/BookingsPage';
import { CarDetailsPage } from './pages/CarDetailsPage';
import { CatalogPage } from './pages/CatalogPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import './App.css';

function RouteEffects() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page');

  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.hash, page]);

  return null;
}

function AppLayout() {
  const { toastMessage, clearToast } = useFavorites();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navItems = [
    { id: 'fleet', label: 'Fleet', to: '/', end: true },
    { id: 'stats', label: 'Analytics', to: '/#stats' },
    { id: 'reviews', label: 'Reviews', to: '/#reviews' },
    { id: 'bookings', label: 'Bookings', to: '/bookings' },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.title = location.pathname.startsWith('/cars/')
      ? 'Vehicle details | DriveSelect'
      : location.pathname === '/bookings'
        ? 'My bookings | DriveSelect'
        : location.pathname === '/login'
          ? 'Sign in | DriveSelect'
          : location.pathname === '/'
            ? 'DriveSelect — Premium Car Rental'
            : 'Page not found | DriveSelect';
  }, [location.pathname]);

  return (
    <div className="app-root">
      <RouteEffects />
      <ProgressBar />
      <Header navItems={navItems} isMobile={isMobile} />
      <main className="page-content">
        <Outlet />
      </main>
      <Footer
        copyrightText="© 2026 DriveSelect Inc. All rights reserved."
        socialLinks={[
          { platform: 'GitHub', url: 'https://github.com' },
          { platform: 'Twitter', url: 'https://twitter.com' },
        ]}
      />
      {toastMessage && <Toast message={toastMessage} onClose={clearToast} />}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<CatalogPage />} />
        <Route path="cars/:id" element={<CarDetailsPage />} />
        <Route
          path="bookings"
          element={(
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          )}
        />
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
