import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

export default function Orders() {
  const user = useAuthStore((s) => s.user);
  const { formatPrice, currency } = useCurrencyStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get('/orders').then((r) => {
      const data = r.data.data || r.data;
      setOrders(Array.isArray(data) ? data : data?.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-cream">
        <div className="glass-panel p-12 rounded-[3.5rem] shadow-premium text-center border-white/60">
          <p className="text-wood/40 italic font-serif mb-6">Please log in to view your artisan history.</p>
          <Link to="/login" className="premium-button bg-wood text-cream inline-block">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pb-40">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 pt-12 flex gap-2 text-[10px] uppercase tracking-widest text-wood/40 font-bold mb-20">
        <Link to="/" className="hover:text-gold transition">Home</Link>
        <span>/</span>
        <Link to="/profile" className="hover:text-gold transition">Private Atelier</Link>
        <span>/</span>
        <span className="text-gold">Order Gallery</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-20 space-y-4">
           <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px] block">Artisan History</span>
           <h1 className="font-heading text-6xl text-wood font-bold">Acquisition Gallery</h1>
        </header>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-beige/40 animate-pulse rounded-[3rem]" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-20 rounded-[4rem] shadow-premium text-center border-white/60"
          >
            <div className="w-20 h-20 bg-beige rounded-full flex items-center justify-center mx-auto mb-8 text-wood/10">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <h2 className="font-heading text-3xl text-wood font-bold mb-4">No acquisitions found</h2>
            <p className="text-wood/40 italic font-serif mb-10">Your personal collection is currently empty.</p>
            <Link to="/products" className="premium-button bg-wood text-cream">Explore Collections</Link>
          </motion.div>
        ) : (
          <div className="grid gap-8">
            {orders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-8 md:p-12 rounded-[3rem] shadow-premium-soft border-white/60 group hover:border-gold/30 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                   <div className="space-y-1">
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] uppercase font-bold tracking-widest text-wood/30">Registry No.</span>
                         <p className="font-heading text-xl text-wood font-bold">#{order.order_number}</p>
                      </div>
                      <p className="text-sm text-wood/40 font-serif italic">Commissioned on {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                   </div>

                   <div className="flex flex-wrap items-center gap-6 md:gap-12 w-full md:w-auto">
                      <div className="space-y-1">
                         <span className="text-[10px] uppercase font-bold tracking-widest text-wood/30 block">Valuation</span>
                         <p className="text-xl text-gold font-bold">{formatPrice(order.total_price)}</p>
                      </div>

                      <div className="space-y-1">
                         <span className="text-[10px] uppercase font-bold tracking-widest text-wood/30 block">Status</span>
                         <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-olive' : 'bg-gold animate-pulse'}`} />
                            <span className={`text-[10px] uppercase font-bold tracking-[0.2em] ${order.status === 'delivered' ? 'text-olive' : 'text-gold'}`}>
                               {order.status}
                            </span>
                         </div>
                      </div>

                      <div className="pt-4 md:pt-0 md:pl-8 border-t md:border-t-0 md:border-l border-wood/10">
                         <Link 
                            to={`/orders/${order.id}`} 
                            className="bg-wood/5 text-wood hover:bg-wood hover:text-cream px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-500 shadow-sm"
                         >
                            View Details
                         </Link>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-20 pt-20 border-t border-wood/5 flex flex-col items-center gap-8 text-center">
            <p className="text-wood/40 text-xs italic font-serif">Each acquisition brings a piece of Moroccan heritage into your story.</p>
            <div className="flex gap-12 opacity-30">
               <span className="text-[9px] font-bold uppercase tracking-widest">Handcrafted Excellence</span>
               <span className="text-[9px] font-bold uppercase tracking-widest">Timeless Design</span>
               <span className="text-[9px] font-bold uppercase tracking-widest">Artisan Authenticity</span>
            </div>
        </div>
      </div>
    </div>
  );
}
