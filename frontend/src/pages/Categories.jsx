import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then((r) => {
      setCategories(r.data);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
           <p className="text-wood/40 uppercase tracking-[0.3em] text-[10px] font-bold">Curating Collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pb-40">
      {/* Hero Header */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="space-y-4"
           >
              <span className="text-gold font-bold uppercase tracking-[0.4em] text-[11px] block">The Heritage Registry</span>
              <h1 className="font-heading text-6xl md:text-8xl text-wood font-bold leading-none">Our Collections</h1>
              <p className="text-wood/60 text-lg italic max-w-2xl mx-auto">Discover the soul of Moroccan craftsmanship through our curated categories of timeless excellence.</p>
           </motion.div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gold/5 blur-[120px] rounded-full -z-10" />
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="group block relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-white shadow-premium transition-all duration-700 hover:shadow-2xl"
              >
                <img 
                  src={cat.image || 'https://placehold.co/800x1200?text=' + cat.name} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-wood/90 via-wood/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                
                {/* Content */}
                <div className="absolute inset-0 p-12 flex flex-col justify-end text-center">
                   <div className="space-y-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                      <h2 className="font-heading text-4xl text-cream font-bold group-hover:text-gold transition-colors">{cat.name}</h2>
                      <div className="w-12 h-0.5 bg-gold mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <p className="text-cream/60 text-sm italic line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                        {cat.description || 'Handcrafted excellence from the heart of Morocco.'}
                      </p>
                      <div className="pt-6 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                         <span className="premium-button bg-cream/10 border-white/20 text-cream group-hover:bg-gold group-hover:border-gold group-hover:text-wood py-2.5 px-8 text-[10px]">
                           Explore Collection
                         </span>
                      </div>
                   </div>
                </div>

                {/* Corner Decoration */}
                <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-gold/40 group-hover:border-gold transition-colors" />
                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-gold/40 group-hover:border-gold transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Craftsmanship Banner */}
      <section className="max-w-7xl mx-auto px-6 mt-40">
         <div className="glass-panel p-12 md:p-24 rounded-[4rem] border-white/40 shadow-premium overflow-hidden relative">
            <div className="relative z-10 max-w-2xl space-y-8">
               <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px]">The Artisan Way</span>
               <h2 className="font-heading text-5xl text-wood font-bold leading-tight">Every piece tells a story of heritage and soul.</h2>
               <p className="text-wood/60 text-lg leading-relaxed">Our categories are not just labels; they are chapters of a legacy passed down through centuries of Moroccan mastery.</p>
               <Link to="/about" className="premium-button bg-wood text-cream inline-block px-10">Learn Our Story</Link>
            </div>
            
            {/* background textures */}
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-gold/10 blur-[100px] rounded-full" />
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none grayscale">
               <img src="https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=800" alt="texture" className="w-full h-full object-cover" />
            </div>
         </div>
      </section>
    </div>
  );
}
