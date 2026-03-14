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
  const { formatPrice, currency } = useCurrencyStore();

  useEffect(() => {
    api.get('/products?sort=bestselling&per_page=4').then((r) => setFeatured(r.data.data || r.data));
    api.get('/categories').then((r) => setDbCategories(r.data || []));
    if (user) fetchWishlist();
  }, [user]);

  const handleWishlistToggle = async (product) => {
    if (!user) {
      alert('Please sign in to save pieces to your private gallery.');
      return;
    }
    await toggleWishlist(product);
  };

  const productList = Array.isArray(featured) ? featured : featured.data || [];

  return (
    <div className="bg-cream overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=80" 
            alt="Luxurious Moroccan Interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-wood/30 blend-overlay" />
        </div>

        {/* Content Card */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <motion.div
            className="glass-panel p-8 md:p-16 max-w-2xl rounded-[40px]"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: 'circOut' }}
          >
            <h1 className="font-heading text-5xl md:text-7xl text-wood leading-[1.1] font-bold">
              Timeless <br /> Moroccan <br /> Craftsmanship for <br /> Modern Living
            </h1>
            <p className="mt-8 text-wood/70 text-lg leading-relaxed max-w-md">
              Experience the intersection of traditional heritage and contemporary design with our curated furniture collection.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link to="/products" className="premium-button bg-gold hover:bg-gold/90 border-gold">
                Shop Collection
              </Link>
              <Link to="/custom-request" className="premium-button bg-cream border border-wood/10 text-wood hover:bg-beige/50">
                Request Custom Piece
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20 space-y-4">
           <h2 className="font-heading text-4xl text-wood font-bold">Featured Categories</h2>
           <div className="w-20 h-1 bg-gold mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {dbCategories.slice(0, 4).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="group block relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-beige shadow-premium transition-all duration-700"
              >
                <img 
                  src={cat.image || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wood/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <div className="absolute bottom-10 left-0 right-0 text-center">
                  <span className="font-heading text-2xl text-cream font-bold group-hover:text-gold transition-colors">{cat.name}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-beige/30 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-2">
              <h2 className="font-heading text-4xl text-wood font-bold">Best Sellers</h2>
              <p className="text-wood/50 text-sm tracking-widest uppercase">Our most coveted pieces of the season</p>
            </div>
            <Link to="/products" className="text-gold font-bold uppercase tracking-widest text-[11px] hover:text-wood transition">View All Products →</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {productList.map((p, i) => {
                  const saved = wishlistItems.some(x => x.id === p.id);
                  return (
                    <motion.div
                      key={p.id}
                      className="group"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link to={`/product/${p.id}`} className="block">
                        <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-cream shadow-premium group-hover:shadow-2xl transition-all duration-500">
                          <img 
                            src={p.images?.[0] || 'https://placehold.co/600'} 
                            alt={p.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          />
                          {/* wishlist heart */}
                          <button 
                            onClick={(e) => { e.preventDefault(); handleWishlistToggle(p); }}
                            className={`absolute top-6 right-6 p-2.5 rounded-full bg-cream/90 transition shadow-sm z-10 ${saved ? 'text-red-500' : 'text-wood/30 hover:text-red-500'}`}
                          >
                            <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-6 space-y-1 px-2">
                          <h3 className="text-lg font-bold text-wood group-hover:text-gold transition truncate">{p.name}</h3>
                          <p className="text-gold font-bold tracking-tight">{formatPrice(p.price)}</p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
             <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-premium">
                <img 
                  src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=1000" 
                  alt="Artisan at work" 
                  className="w-full h-full object-cover"
                />
             </div>
             {/* inset image */}
             <div className="absolute -bottom-10 -right-10 w-2/3 aspect-video rounded-[2rem] overflow-hidden border-[12px] border-cream shadow-2xl hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800" 
                  alt="Detail" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
             </div>
          </div>
          
          <div className="space-y-8">
            <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px]">Our Story</span>
            <h2 className="font-heading text-5xl md:text-6xl text-wood font-bold leading-[1.1]">
              Heritage in Every Thread, Soul in Every Grain.
            </h2>
            <div className="space-y-6 text-wood/70 leading-relaxed text-lg">
              <p>For three generations, our family has partnered with the finest Mâalems (master artisans) across Morocco to bring high-end furniture into contemporary homes. Each piece is hand-carved, hand-woven, and hand-finished in our Marrakech workshops.</p>
              <p>We believe in slow design—where quality takes precedence over speed, and soul over mass production. By choosing Beldi Ameublement, you support a legacy of craftsmanship that has survived for centuries.</p>
            </div>
            <Link to="/about" className="inline-flex items-center gap-3 text-gold font-bold uppercase tracking-widest text-sm group">
              Learn about our process 
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-wood py-32 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-12">
          <div className="text-gold text-4xl">“</div>
          <p className="font-heading text-3xl md:text-4xl text-beige italic leading-relaxed">
            “The craftsmanship is beyond anything I’ve ever seen. Our living room feels like a contemporary sanctuary that still feels deeply rooted in history.”
          </p>
          <div className="flex flex-col items-center gap-4">
             <div className="w-16 h-16 rounded-full bg-gold/20 p-1">
                <img src="https://i.pravatar.cc/100?u=elena" alt="Elena" className="w-full h-full rounded-full object-cover grayscale" />
             </div>
             <div>
                <p className="text-gold font-bold uppercase tracking-widest text-[11px]">Elena Rodriguez</p>
                <p className="text-beige/40 text-[11px]">Interior Designer, Madrid</p>
             </div>
          </div>
        </div>
      </section>

      {/* Inspiration */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="text-center mb-16 space-y-4">
           <h2 className="font-heading text-4xl text-wood font-bold">Interior Inspiration</h2>
           <p className="text-gold font-medium">Tag us with #BeldiModern to be featured</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500',
            'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=500',
            'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=500',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500',
            'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500',
            'https://images.unsplash.com/photo-1554995207-c18c20360a59?w=500'
          ].map((url, i) => (
            <motion.div 
              key={i} 
              className="aspect-square rounded-2xl overflow-hidden shadow-premium"
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.5 }}
            >
              <img src={url} alt="Inspiration" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-beige border-t border-wood/5 py-32 text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          <div className="space-y-4">
            <h2 className="font-heading text-5xl text-wood font-bold">Join our Inner Circle</h2>
            <p className="text-wood/60 text-lg">Receive early access to new collections and artisan stories.</p>
          </div>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-8 py-4 bg-cream border border-wood/10 rounded-2xl focus:outline-none focus:border-gold shadow-sm font-medium"
            />
            <button type="submit" className="premium-button bg-wood text-cream hover:bg-wood/90 py-4 px-10 text-sm font-bold uppercase tracking-widest whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
