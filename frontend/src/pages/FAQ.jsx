import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const faqCategories = [
  {
    id: 'orders',
    name: 'Logistics & Registry',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    questions: [
      {
        q: "How can I track my acquisition's journey?",
        a: "You may oversee your registry status within your Private Atelier. Once an artisan piece is dispatched, you will receive a formal notification with tracking credentials."
      },
      {
        q: "May I modify my order after authentication?",
        a: "Our artisans begin preparation once an order is authenticated. Modifications are possible only within the first 6 hours of registry entry."
      },
      {
        q: "What is the expected timeframe for bespoke pieces?",
        a: "Craftsmanship requires patience. Standard collection pieces are prepared within 7-10 days, while bespoke commissions may require 4-8 weeks of dedicated artisan time."
      }
    ]
  },
  {
    id: 'craftsmanship',
    name: 'Artisan Excellence',
    icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
    questions: [
      {
        q: "What materials are used in your masterpieces?",
        a: "We exclusively utilize heritage materials: aged Atlas Cedar, authentic Moroccan leather, and hand-forged brass, ensuring each piece endures for generations."
      },
      {
        q: "How should I preserve my Moroccan heirloom?",
        a: "Wood should be treated with natural beeswax periodically. Avoid direct exposure to intense heat or humidity to maintain the material's natural integrity."
      }
    ]
  },
  {
    id: 'returns',
    name: 'Returns & Authenticity',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    questions: [
      {
        q: "What is your policy regarding returns?",
        a: "If a piece does not align with your vision, you may initiate a return within 14 days of acquisition. Note that bespoke commissions are final once craftsmanship begins."
      },
      {
        q: "Are the pieces authenticated?",
        a: "Every masterpiece from Beldi Amueblement is accompanied by a Certificate of Authenticity, bearing the mark of the master artisan who curated it."
      }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('orders');
  const [openQuestion, setOpenQuestion] = useState(null);

  return (
    <div className="bg-cream min-h-screen pb-40">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 pt-12 flex gap-2 text-[10px] uppercase tracking-widest text-wood/40 font-bold mb-20">
        <Link to="/" className="hover:text-gold transition">Home</Link>
        <span>/</span>
        <span className="text-gold">Registry of Inquiries</span>
      </nav>

      <header className="max-w-7xl mx-auto px-6 mb-24 text-center space-y-6">
         <span className="text-gold font-bold uppercase tracking-[0.4em] text-[11px] block">Concierge Guidance</span>
         <h1 className="font-heading text-6xl md:text-7xl text-wood font-bold">Frequently Asked.</h1>
         <p className="text-wood/60 text-xl font-serif italic max-w-2xl mx-auto">
           Everything you need to know about our heritage pieces and the artisan journey.
         </p>
      </header>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[300px_1fr] gap-20">
           {/* Navigation Sidebar */}
           <aside className="space-y-4">
              {faqCategories.map((cat) => (
                 <button
                   key={cat.id}
                   onClick={() => { setActiveCategory(cat.id); setOpenQuestion(null); }}
                   className={`w-full flex items-center gap-6 p-6 rounded-3xl transition-all duration-500 group ${activeCategory === cat.id ? 'bg-wood text-cream shadow-premium' : 'hover:bg-white/40 text-wood/40 hover:text-wood'}`}
                 >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.icon} />
                    </svg>
                    <span className="text-[11px] uppercase font-bold tracking-widest">{cat.name}</span>
                 </button>
              ))}

              <div className="mt-20 p-8 glass-panel rounded-[3rem] border-white/60 space-y-6">
                 <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold">Further Assistance?</h4>
                 <p className="text-xs text-wood/60 font-serif italic">Our concierge is at your service for any unanswered inquiries.</p>
                 <Link to="/contact" className="premium-button bg-gold text-cream w-full text-center py-4 text-[10px]">Contact Concierge</Link>
              </div>
           </aside>

           {/* Content Accordion */}
           <main className="space-y-6">
              <AnimatePresence mode="wait">
                 <motion.div
                   key={activeCategory}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-6"
                 >
                    {faqCategories.find(c => c.id === activeCategory).questions.map((q, idx) => (
                       <div key={idx} className="glass-panel overflow-hidden rounded-[2.5rem] border-white/60 shadow-sm hover:shadow-md transition-all">
                          <button
                            onClick={() => setOpenQuestion(openQuestion === idx ? null : idx)}
                            className="w-full text-left p-10 flex justify-between items-center group"
                          >
                             <h3 className="font-heading text-xl text-wood font-bold group-hover:text-gold transition-colors">{q.q}</h3>
                             <svg className={`w-5 h-5 text-gold transition-transform duration-500 ${openQuestion === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                          <AnimatePresence>
                             {openQuestion === idx && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                                >
                                   <div className="px-10 pb-10 text-wood/60 leading-relaxed font-serif italic text-lg border-t border-wood/5 pt-6">
                                      {q.a}
                                   </div>
                                </motion.div>
                             )}
                          </AnimatePresence>
                       </div>
                    ))}
                 </motion.div>
              </AnimatePresence>
           </main>
        </div>
      </div>
    </div>
  );
}
