import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const faqCategories = [
  {
    id: 'orders',
    name: 'Order & Shipping',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    questions: [
      {
        q: "How can I track my order?",
        a: "You can track your order status in your Account profile under 'My Orders'. Once your artisanal piece is dispatched, you will receive an email with real-time tracking credentials."
      },
      {
        q: "Can I modify my order after placement?",
        a: "As our artisans begin preparation shortly after authentication, modifications are only possible within the first 6 hours of order entry. Please contact support immediately for urgent changes."
      },
      {
        q: "What are the shipping timeframes?",
        a: "Preparation for standard collection pieces takes 7-10 days. Bespoke commissions are handcrafted to order and typically require 4-8 weeks for completion and quality inspection."
      }
    ]
  },
  {
    id: 'quality',
    name: 'Product Quality',
    icon: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
    questions: [
      {
        q: "What materials are used in your products?",
        a: "We use only premium heritage materials: aged Atlas Cedar, authentic Moroccan leather, and hand-forged brass. Every piece is built to be a lifelong heirloom."
      },
      {
        q: "How do I maintain my handcrafted furniture?",
        a: "We recommend treating wood with natural beeswax every 6 months. Keep leather away from direct sunlight and use a dedicated leather conditioner twice a year for best results."
      }
    ]
  },
  {
    id: 'returns',
    name: 'Returns & Authenticity',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    questions: [
      {
        q: "What is your return policy?",
        a: "If your piece doesn't meet your expectations, you may initiate a return within 14 days of delivery. Please note that custom/bespoke orders are final sale due to their unique nature."
      },
      {
        q: "Are the products authentic?",
        a: "Yes. Every masterpiece is accompanied by a Certificate of Authenticity, personally signed and stamped by the master artisan who managed its creation."
      }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('orders');
  const [openQuestion, setOpenQuestion] = useState(null);

  return (
    <div className="bg-[#F0F2F5] min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <Link to="/" className="hover:text-[#E62E04] transition">Home</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900">FAQ & Support</span>
        </nav>
      </div>

      <header className="bg-white border-b border-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
           <span className="text-[#E62E04] font-extrabold uppercase tracking-[0.2em] text-xs block">Help Center</span>
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">How can we help?</h1>
           <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
             Guidance on our collections, orders, and the artisan craftsmanship behind every piece.
           </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-[320px_1fr] gap-12 lg:gap-20 items-start">
           {/* Sidebar */}
           <aside className="space-y-3 sticky top-24">
              {faqCategories.map((cat) => (
                 <button
                   key={cat.id}
                   onClick={() => { setActiveCategory(cat.id); setOpenQuestion(null); }}
                   className={`w-full flex items-center gap-4 p-5 rounded-xl transition-all font-bold text-sm ${
                     activeCategory === cat.id 
                       ? 'bg-gray-900 text-white shadow-lg' 
                       : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-100'
                   }`}
                 >
                    <svg className={`w-5 h-5 ${activeCategory === cat.id ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.icon} />
                    </svg>
                    <span>{cat.name}</span>
                 </button>
              ))}

              <div className="mt-12 p-8 bg-white rounded-2xl border border-gray-100 space-y-6 text-center shadow-sm">
                 <h4 className="text-xs uppercase font-extrabold tracking-widest text-[#E62E04]">Need more help?</h4>
                 <p className="text-sm text-gray-400 font-medium">Our support team is ready to assist you directly.</p>
                 <Link to="/contact" className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-all inline-block text-sm">
                    Contact Support
                 </Link>
              </div>
           </aside>

           {/* Content */}
           <main>
              <AnimatePresence mode="wait">
                 <motion.div
                   key={activeCategory}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="space-y-4"
                 >
                    {faqCategories.find(c => c.id === activeCategory).questions.map((q, idx) => (
                       <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <button
                            onClick={() => setOpenQuestion(openQuestion === idx ? null : idx)}
                            className="w-full text-left p-6 md:p-8 flex justify-between items-center group"
                          >
                             <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-[#E62E04] transition-colors">{q.q}</h3>
                             <div className={`p-2 rounded-full transition-all ${openQuestion === idx ? 'bg-red-50 text-[#E62E04] rotate-180' : 'bg-gray-50 text-gray-400 rotate-0'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                             </div>
                          </button>
                          <AnimatePresence>
                             {openQuestion === idx && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                   <div className="px-6 md:px-8 pb-8 text-gray-500 font-medium leading-relaxed text-base md:text-lg border-t border-gray-50 pt-6">
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
