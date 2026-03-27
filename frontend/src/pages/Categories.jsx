import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then((r) => {
      setCategories(Array.isArray(r.data) ? r.data : r.data.data || []);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-gray-100 border-t-[#E62E04] rounded-full animate-spin" />
           <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Loading Collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 text-center space-y-4">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
           >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">Shop by Categories</h1>
              <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto mt-4">Discover our curated collections of authentic Moroccan craftsmanship and modern home essentials.</p>
           </motion.div>
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="group block relative aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <img 
                  src={cat.image || 'https://placehold.co/800x1000?text=' + cat.name} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                   <div className="space-y-2">
                      <h2 className="text-3xl font-bold text-white group-hover:text-[#E62E04] transition-colors">{cat.name}</h2>
                      <p className="text-white/80 text-sm font-medium line-clamp-2">
                        {cat.description || 'Explore our latest collection of premium artisanal pieces.'}
                      </p>
                      <div className="pt-4 flex items-center gap-2 text-white font-bold text-sm">
                         <span>View Collection</span>
                         <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </div>
                   </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="max-w-7xl mx-auto px-4 mt-12 mb-20">
         <div className="bg-gray-900 rounded-3xl p-10 md:p-16 relative overflow-hidden text-center md:text-left">
            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
               <div className="space-y-6">
                  <span className="text-[#E62E04] font-bold uppercase tracking-widest text-xs">Direct from Source</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">Master Artisan Craftsmanship at Every Corner.</h2>
                  <p className="text-gray-400 text-lg font-medium">We deliver authentic, hand-carved, and meticulously finished pieces directly from the world's most talented cooperatives.</p>
                  <Link to="/about" className="bg-white text-gray-900 px-8 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-all inline-block">Learn Our Vision</Link>
               </div>
               <div className="hidden md:block relative">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center p-6 space-y-2">
                        <span className="text-3xl font-extrabold text-white">500+</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Artisans</span>
                     </div>
                     <div className="aspect-square bg-[#E62E04]/10 rounded-2xl border border-[#E62E04]/20 flex flex-col items-center justify-center p-6 space-y-2">
                        <span className="text-3xl font-extrabold text-[#E62E04]">100%</span>
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Handmade</span>
                     </div>
                  </div>
               </div>
            </div>
            
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-1/4 h-full bg-[#E62E04] opacity-5 origin-right skew-x-[15deg] translate-x-1/2" />
         </div>
      </section>
    </div>
  );
}
