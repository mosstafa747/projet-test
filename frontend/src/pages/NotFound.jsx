import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-cream flex items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
         <img src="https://images.unsplash.com/photo-1539706123445-54c7ba30c57d?auto=format&fit=crop&q=80" alt="" className="w-full h-full object-cover grayscale" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel p-16 md:p-24 rounded-[4rem] shadow-premium-soft text-center border-white/60 relative z-10 max-w-2xl bg-white/40"
      >
        <span className="text-gold font-bold uppercase tracking-[0.5em] text-[10px] block mb-8">Registry Error</span>
        <h1 className="font-heading text-8xl md:text-9xl text-wood font-bold mb-8 opacity-20">404</h1>
        
        <div className="space-y-4 mb-12">
           <h2 className="font-heading text-4xl text-wood font-bold">Lost in the Atlas</h2>
           <p className="text-wood/40 italic font-serif text-lg leading-relaxed">
             "The path you seek has been swept away by the sands of time. Let us guide you back to our curated collections."
           </p>
        </div>

        <Link 
           to="/" 
           className="premium-button bg-wood text-cream inline-block px-12 py-5 shadow-2xl hover:shadow-gold/20"
        >
           Return to Gallery
        </Link>
        
        <div className="mt-16 flex justify-center gap-8 opacity-20">
           <span className="text-[9px] font-bold uppercase tracking-widest text-wood">Handcrafted</span>
           <span className="text-[9px] font-bold uppercase tracking-widest text-wood">Timeless</span>
           <span className="text-[9px] font-bold uppercase tracking-widest text-wood">Authentic</span>
        </div>
      </motion.div>
    </div>
  );
}
