import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';

export default function Wishlist() {
  const user = useAuthStore((s) => s.user);
  const { items, loading, fetchWishlist, toggleWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const removeFromWishlist = async (product) => {
    try {
      await toggleWishlist(product);
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream px-6">
        <motion.div 
          className="glass-panel p-16 rounded-[4rem] text-center space-y-8 max-w-xl shadow-premium border-white/40"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold text-4xl italic font-serif">B</div>
          <div className="space-y-4">
            <h1 className="font-heading text-4xl text-wood font-bold">Your Private Gallery</h1>
            <p className="text-wood/60 leading-relaxed text-lg italic">Please sign in to your account to view your curated selection of handcrafted masterpieces.</p>
          </div>
          <Link to="/login" className="premium-button bg-wood text-cream w-full inline-block">Sign In to Your Account</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pb-40">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 pt-12 flex gap-2 text-[10px] uppercase tracking-widest text-wood/40 font-bold mb-20">
        <Link to="/" className="hover:text-gold transition">Home</Link>
        <span>/</span>
        <span className="text-gold">Private Gallery</span>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px] block">Your Curation</span>
            <h1 className="font-heading text-5xl md:text-6xl text-wood font-bold">The Private Gallery</h1>
          </div>
          <div className="glass-panel px-6 py-3 rounded-full border-white/60 shadow-md">
            <span className="text-wood font-bold text-lg font-heading">{items.length} <span className="text-[12px] uppercase tracking-widest font-sans ml-1">Pieces</span></span>
          </div>
        </header>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-6">
                <div className="aspect-[3/4] bg-beige/50 animate-pulse rounded-[3rem]" />
                <div className="h-4 w-3/4 bg-beige/50 animate-pulse rounded-full" />
                <div className="h-4 w-1/2 bg-beige/50 animate-pulse rounded-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center glass-panel rounded-[4rem] border-dashed border-2 border-wood/10"
          >
            <div className="w-24 h-24 bg-beige/40 rounded-full flex items-center justify-center mx-auto mb-8 text-wood/20">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
               </svg>
            </div>
            <h2 className="font-heading text-3xl text-wood font-bold mb-4">No Masterpieces Saved</h2>
            <p className="text-wood/60 mb-10 italic text-lg max-w-md mx-auto">Items you admire will appear here, waiting to join your personal collection.</p>
            <Link to="/products" className="premium-button bg-wood text-cream inline-block px-12">Browse Collections</Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <AnimatePresence mode="popLayout">
              {items.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative flex flex-col"
                >
                  <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-beige shadow-premium-soft group-hover:shadow-premium transition-all duration-700 border border-white/40">
                    <Link to={`/product/${p.id}`} className="block h-full w-full">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-wood/10 text-[10px] uppercase font-bold tracking-widest text-center px-4">No Visual Available</div>
                      )}
                    </Link>
                    
                    <button
                      onClick={() => removeFromWishlist(p)}
                      className="absolute top-6 right-6 p-4 rounded-full bg-cream/80 backdrop-blur-md text-red-400 hover:bg-cream hover:text-red-500 transition-all opacity-100 shadow-xl"
                      aria-label="Remove"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>

                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      {!p.in_stock && (
                        <span className="bg-wood/80 backdrop-blur-sm text-cream text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ring-1 ring-white/20">Out of Stock</span>
                      )}
                    </div>
                    
                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-wood/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700">
                        <button
                          onClick={() => addItem(p)}
                          disabled={!p.in_stock}
                          className="w-full py-4 bg-cream text-wood rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-xl hover:bg-gold hover:text-wood transition-colors disabled:opacity-50 disabled:bg-cream/50"
                        >
                          {p.in_stock ? 'Move to Bag' : 'Sold Out'}
                        </button>
                    </div>
                  </div>

                  <div className="pt-8 space-y-2 px-2">
                    <Link to={`/product/${p.id}`}>
                      <h3 className="font-heading text-xl text-wood font-bold group-hover:text-gold transition truncate">{p.name}</h3>
                    </Link>
                    <div className="flex items-center justify-between">
                       <p className="text-gold font-bold text-lg">{Number(p.price).toLocaleString()} <span className="text-[10px]">MAD</span></p>
                       <p className="text-wood/30 text-[9px] uppercase tracking-widest font-bold">Ref: #{p.id.toString().padStart(4, '0')}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
