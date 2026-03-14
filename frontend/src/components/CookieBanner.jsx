import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 md:max-w-[420px] z-[999]"
        >
          <div className="glass-panel-dark p-8 rounded-[2.5rem] shadow-premium border-white/10 backdrop-blur-3xl bg-wood/80 text-cream relative overflow-hidden">
            {/* Ambient pattern */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/10 rounded-full blur-[60px]" />
            
            <div className="relative space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                     <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                     </svg>
                  </div>
                  <div>
                     <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-gold/60 block mb-1">Privacy & Registry</span>
                     <h3 className="font-heading text-xl font-bold tracking-tight">The Artisan's Promise</h3>
                  </div>
               </div>

               <p className="text-sm text-cream/60 leading-relaxed font-serif italic">
                 "To preserve the sanctity of your experience, we use digital identifiers to curate our gallery and remember your journey."
               </p>

               <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={accept}
                    className="w-full bg-gold text-wood font-bold py-4 rounded-[1.5rem] text-[10px] uppercase tracking-widest hover:bg-gold/90 transition-all duration-500 shadow-xl"
                  >
                    Accept All Cookies
                  </button>
                  <button
                    onClick={decline}
                    className="w-full bg-transparent border border-white/10 text-cream/40 font-bold py-4 rounded-[1.5rem] text-[10px] uppercase tracking-widest hover:text-cream hover:border-white/20 transition-all duration-500"
                  >
                    Reject Non-Essential
                  </button>
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
