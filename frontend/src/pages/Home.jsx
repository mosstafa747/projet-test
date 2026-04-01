import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const user = useAuthStore((s) => s.user);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const wishlistItems = useWishlistStore((s) => s.items);
  const { formatPrice } = useCurrencyStore();

  useEffect(() => {
    api.get('/products?sort=bestselling&per_page=8').then((r) => setFeatured(r.data.data || r.data));
    api.get('/categories').then((r) => setDbCategories(r.data || []));
    if (user) fetchWishlist();
  }, [user]);

  const handleWishlistToggle = async (product) => {
    if (!user) { alert('Please sign in to save items to your wishlist.'); return; }
    await toggleWishlist(product);
  };

  const productList = Array.isArray(featured) ? featured : featured.data || [];

  return (
    <div className="bg-[#F0F2F5] min-h-screen">

      {/* Hero Banner */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="relative rounded-lg overflow-hidden h-[380px]">
            <img
              src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=80"
              alt="New Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="px-12 space-y-4 max-w-lg">
                <span className="bg-[#E62E04] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded">New Arrival</span>
                <h1 className="text-4xl font-extrabold text-white leading-tight">Authentic Moroccan Furniture</h1>
                <p className="text-white/80 text-sm">Handcrafted by master artisans. Delivered to your door.</p>
                <div className="flex gap-3 pt-2">
                  <Link to="/products" className="bg-[#E62E04] text-white px-6 py-2.5 rounded font-bold text-sm hover:bg-red-700 transition">Shop Now</Link>
                  <Link to="/custom-request" className="bg-white text-gray-800 px-6 py-2.5 rounded font-bold text-sm hover:bg-gray-100 transition">Custom Order</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Banners */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'On orders over 500 MAD' },
              { icon: '🛡️', title: 'Buyer Protection', desc: 'Full refund if item not received' },
              { icon: '↩️', title: 'Easy Returns', desc: '30 days return policy' },
              { icon: '💬', title: '24/7 Support', desc: 'Dedicated help center' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 py-2">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-[12px] font-bold text-gray-800">{item.title}</p>
                  <p className="text-[11px] text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-extrabold text-gray-900">Shop by Category</h2>
            <Link to="/categories" className="text-[#E62E04] text-sm font-semibold hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {dbCategories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-transparent group-hover:border-[#E62E04] transition">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200'}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[11px] font-semibold text-gray-700 text-center group-hover:text-[#E62E04] transition">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-[#E62E04] rounded-full" />
              <h2 className="text-lg font-extrabold text-gray-900">Best Sellers</h2>
            </div>
            <Link to="/products" className="text-[#E62E04] text-sm font-semibold hover:underline">View all →</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {productList.map((p, i) => {
              const saved = wishlistItems.some(x => x.id === p.id);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border border-gray-100 rounded-lg overflow-hidden bg-white hover:shadow-md hover:border-gray-200 transition-all group"
                >
                  <Link to={`/product/${p.id}`} className="block">
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <img
                        src={p.images?.[0] || 'https://placehold.co/400'}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={(e) => { e.preventDefault(); handleWishlistToggle(p); }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-sm hover:scale-110 transition"
                      >
                        <svg className="w-4 h-4" fill={saved ? '#E62E04' : 'none'} stroke={saved ? '#E62E04' : '#999'} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-3 space-y-1">
                      <p className="text-[13px] text-gray-700 line-clamp-2 leading-snug">{p.name}</p>
                      <p className="text-base font-extrabold text-[#E62E04]">{formatPrice(p.price)}</p>
                      {p.sales_count > 0 && (
                        <p className="text-[11px] text-gray-400">{p.sales_count} sold</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-[#E62E04] rounded-lg p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white space-y-2">
            <p className="text-[11px] uppercase tracking-widest font-bold opacity-80">Limited Time</p>
            <h3 className="text-2xl font-extrabold">Get a Custom Piece Made for You</h3>
            <p className="text-white/80 text-sm">Tell us what you need — our artisans will build it from scratch.</p>
          </div>
          <Link to="/custom-request" className="bg-white text-[#E62E04] font-bold px-8 py-3 rounded text-sm hover:bg-gray-100 transition whitespace-nowrap">
            Start Custom Order
          </Link>
        </div>
      </section>

    </div>
  );
}
