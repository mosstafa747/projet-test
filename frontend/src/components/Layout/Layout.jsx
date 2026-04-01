import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CookieBanner from '../CookieBanner';
import ChatbotWidget from '../../pages/ChatbotWidget';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
      <CookieBanner />
    </>
  );
}
