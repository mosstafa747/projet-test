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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-[400px] z-[999]"
        >
          <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 relative overflow-hidden">
            <div className="relative space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                  </div>
                  <div>
                     <h3 className="text-sm font-bold text-gray-900">Cookie Preference</h3>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Privacy & Security</p>
                  </div>
               </div>

               <p className="text-xs text-gray-500 leading-relaxed font-medium">
                 We use cookies to improve your experience, analyze site traffic, and personalize content. By clicking "Accept All", you agree to our use of cookies.
               </p>

               <div className="flex gap-3 pt-2">
                  <button
                    onClick={accept}
                    className="flex-1 bg-[#E62E04] text-white font-bold py-3 rounded-full text-xs hover:bg-[#CC2904] transition-all shadow-md shadow-[#E62E04]/20"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={decline}
                    className="flex-1 bg-gray-50 text-gray-500 font-bold py-3 rounded-full text-xs hover:bg-gray-100 transition-all border border-gray-100"
                  >
                    Decline
                  </button>
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
