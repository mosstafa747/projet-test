import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useCurrencyStore } from '../../store/useCurrencyStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useState } from 'react';

const nav = [
  { to: '/products', label: 'Shop' },
  { to: '/categories', label: 'Categories' },
  { to: '/custom-request', label: 'Custom Furniture' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const { user, logout } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const { currency, setCurrency } = useCurrencyStore();
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const cartCount = items.reduce((n, i) => n + i.quantity, 0);
  const [currOpen, setCurrOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top bar */}
      <div className="bg-[#E62E04]">
        <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between text-[11px] text-white/90 font-medium">
          <span>Free shipping on orders over 5000 MAD</span>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/orders" className="hover:text-white transition">My Orders</Link>
                <span className="opacity-40">|</span>
                <button onClick={logout} className="hover:text-white transition">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-white transition">Sign In</Link>
                <span className="opacity-40">|</span>
                <Link to="/register" className="hover:text-white transition">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="text-lg font-extrabold text-[#E62E04] tracking-tight whitespace-nowrap shrink-0">
          Beldi Express
        </Link>

        {/* Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-[13px] font-semibold transition-colors ${
                  isActive ? 'text-[#E62E04]' : 'text-gray-700 hover:text-[#E62E04]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          {/* Currency */}
          <div className="relative">
            <button
              onClick={() => setCurrOpen(!currOpen)}
              className="flex items-center gap-1 text-[12px] font-bold text-gray-600 hover:text-[#E62E04] transition border border-gray-200 rounded px-2 py-1"
            >
              {currency}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {currOpen && (
              <div className="absolute top-full right-0 mt-1 w-24 bg-white border border-gray-200 rounded shadow-lg z-50 py-1">
                {['MAD', 'EUR', 'USD', 'GBP'].map(curr => (
                  <button
                    key={curr}
                    onClick={() => { setCurrency(curr); setCurrOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-[12px] font-semibold transition-colors ${currency === curr ? 'text-[#E62E04] bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative p-1.5 text-gray-600 hover:text-[#E62E04] transition" aria-label="Wishlist">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#E62E04] text-white text-[9px] flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative p-1.5 text-gray-600 hover:text-[#E62E04] transition" aria-label="Cart">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#E62E04] text-white text-[9px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          {/* Profile / Account */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="p-1.5 text-gray-600 hover:text-[#E62E04] transition" aria-label="Profile">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
