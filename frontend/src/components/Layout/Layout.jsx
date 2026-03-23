import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CookieBanner from '../CookieBanner';

export default function Layout() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPath && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <CookieBanner />}
    </div>
  );
}
