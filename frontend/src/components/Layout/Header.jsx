import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
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

  return (
    <motion.header
      className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-wood/5"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="font-heading text-lg md:text-xl text-wood font-bold tracking-tight">
          Beldi Ameublement
        </Link>

        {/* Nav - Centered */}
        <nav className="hidden lg:flex items-center gap-10">
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-[13px] uppercase tracking-[0.1em] font-medium transition-all duration-300 ${
                  isActive ? 'text-gold' : 'text-wood/60 hover:text-wood'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5">
          {/* Currency Switcher */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-wood/10 hover:border-gold/30 text-[10px] uppercase font-bold tracking-widest text-wood/60 hover:text-wood transition-all">
              {currency}
              <svg className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute top-full right-0 pt-3 w-32 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-500 z-50">
               <div className="glass-panel p-2 shadow-premium">
                 {['MAD', 'EUR', 'USD', 'GBP'].map(curr => (
                   <button 
                    key={curr}
                    onClick={() => setCurrency(curr)}
                    className={`w-full text-left px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-xl transition-colors ${currency === curr ? 'bg-gold text-cream' : 'text-wood/60 hover:text-gold hover:bg-gold/5'}`}
                   >
                     {curr}
                   </button>
                 ))}
               </div>
            </div>
          </div>

          
          <Link to="/wishlist" className="relative p-1.5 text-wood/60 hover:text-wood transition-colors" aria-label="Wishlist">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-gold/20 text-gold text-[8px] flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative p-1.5 text-wood/60 hover:text-wood transition-colors" aria-label="Cart">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 h-3.5 w-3.5 rounded-full bg-gold text-cream text-[8px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
               <Link to="/profile" className="p-1.5 text-wood/60 hover:text-wood transition-colors" aria-label="Profile">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>
              {user.is_admin && (
                <Link to="/admin" className="text-[10px] uppercase tracking-wider bg-gold/10 text-gold px-2 py-0.5 rounded font-bold">Admin</Link>
              )}
            </div>
          ) : (
            <Link to="/login" className="p-1.5 text-wood/60 hover:text-wood transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
