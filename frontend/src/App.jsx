import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Categories from './pages/Categories';
import ProductDetail from './pages/ProductDetail';
import FAQ from './pages/FAQ';
import Support from './pages/Support';
import TicketDetail from './pages/TicketDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CustomRequest from './pages/CustomRequest';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Admin from './pages/Admin';
import AdminProductForm from './pages/AdminProductForm';
import AdminCategoryForm from './pages/AdminCategoryForm';
import AdminCouponForm from './pages/AdminCouponForm';
import DriverPortal from './pages/DriverPortal';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Sitemap from './pages/Sitemap';
import NotFound from './pages/NotFound';
import Chatbot from './components/Chatbot';
import RoleGate from './components/RoleGate';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES (Accessible to Guest & Customers) */}
        <Route element={<RoleGate allowedRoles={['customer', 'guest']} />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="custom-request" element={<CustomRequest />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="profile" element={<Profile />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="support" element={<Support />} />
            <Route path="support/:id" element={<TicketDetail />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfUse />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="sitemap" element={<Sitemap />} />
          </Route>
        </Route>

        {/* ADMIN SILO (No Header/Footer from Layout) */}
        <Route element={<RoleGate allowedRoles={['admin']} />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/products/new" element={<AdminProductForm />} />
          <Route path="/admin/products/:id" element={<AdminProductForm />} />
          <Route path="/admin/categories/new" element={<AdminCategoryForm />} />
          <Route path="/admin/categories/:id" element={<AdminCategoryForm />} />
          <Route path="/admin/coupons/new" element={<AdminCouponForm />} />
          <Route path="/admin/coupons/:id" element={<AdminCouponForm />} />
        </Route>

        {/* DRIVER SILO */}
        <Route element={<RoleGate allowedRoles={['driver']} />}>
          <Route path="/driver" element={<DriverPortal />} />
        </Route>

        {/* FALLBACK */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
