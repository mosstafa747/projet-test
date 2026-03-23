import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        await api.post('/tickets', {
            subject: form.subject || 'General Inquiry',
            message: form.message
        });
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
    } catch (e) {
        alert('Failed to send inquiry. Please ensure you are signed in.');
    } finally {
        setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-cream px-6">
        <motion.div 
          className="glass-panel p-16 rounded-[4rem] text-center space-y-8 max-w-xl shadow-premium"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold text-4xl italic font-serif">B</div>
          <div className="space-y-4">
            <h1 className="font-heading text-4xl text-wood font-bold">Message Received</h1>
            <p className="text-wood/60 leading-relaxed text-lg italic">The essence of your message has been captured. Our concierge will reach out to you shortly.</p>
          </div>
          <button 
            onClick={() => setSent(false)} 
            className="premium-button bg-wood text-cream w-full"
          >
            Send Another Inquiry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 pt-12 flex gap-2 text-[10px] uppercase tracking-widest text-wood/40 font-bold mb-20">
        <Link to="/" className="hover:text-gold transition">Home</Link>
        <span>/</span>
        <span className="text-gold">Contact Concierge</span>
      </nav>

      <section className="max-w-7xl mx-auto px-6 pb-40">
        <div className="grid lg:grid-cols-2 gap-24 xl:gap-40 items-start">
           {/* Info Side */}
           <div className="space-y-16">
              <div className="space-y-6">
                 <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px] block">Get in Touch</span>
                 <h1 className="font-heading text-6xl md:text-7xl text-wood font-bold leading-tight">Elevate Your Space.</h1>
                 <p className="text-wood/60 text-xl leading-relaxed max-w-lg">
                   Whether you have a specific inquiry about our masterpieces or wish to discuss a bespoke project, our dedicated team is here to assist you.
                 </p>
              </div>

              <div className="space-y-12">
                 <div className="grid sm:grid-cols-2 gap-12">
                    <div className="space-y-4">
                       <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-wood">The Atelier</h3>
                       <address className="not-italic text-wood/70 text-[13px] leading-relaxed space-y-1">
                          <p>123 Avenue des Artisans</p>
                          <p>Gueliz, Marrakech 40000</p>
                          <p>Morocco</p>
                       </address>
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-wood">Concierge</h3>
                       <div className="text-wood/70 text-[13px] leading-relaxed space-y-1">
                          <p>concierge@beldiameublement.com</p>
                          <p>+212 524 00 00 00</p>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-wood">Follow the Vision</h3>
                    <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-wood/40">
                       <a href="#" className="hover:text-gold transition">Instagram</a>
                       <a href="#" className="hover:text-gold transition">Pinterest</a>
                       <a href="#" className="hover:text-gold transition">LinkedIn</a>
                    </div>
                 </div>
              </div>
           </div>

           {/* Form Side */}
           <div className="glass-panel p-10 md:p-14 rounded-[4rem] shadow-premium border-white/40">
              <h2 className="font-heading text-3xl text-wood font-bold mb-10">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">Full Name</label>
                   <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="premium-input bg-white/20 w-full"
                    placeholder="E.g. Omar Khalid"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">Email Address</label>
                   <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="premium-input bg-white/20 w-full"
                    placeholder="omar@example.com"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">Inquiry Type</label>
                   <select
                    className="premium-input bg-white/20 w-full cursor-pointer appearance-none"
                    value={form.subject}
                    onChange={(e) => setForm({...form, subject: e.target.value})}
                   >
                     <option value="">General Inquiry</option>
                     <option value="bespoke">Bespoke Project</option>
                     <option value="shipping">Shipping & Delivery</option>
                     <option value="wholesale">Wholesale</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">Message</label>
                   <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    className="premium-input bg-white/20 w-full rounded-3xl"
                    placeholder="How can we assist your vision?"
                   />
                </div>
                <button
                  type="submit"
                  className="premium-button bg-wood text-cream w-full font-bold uppercase tracking-widest py-5 text-sm"
                >
                  Send Inquiry
                </button>
              </form>
           </div>
        </div>
      </section>

      {/* Map Section - Immersive */}
      <section className="h-[60vh] relative grayscale hover:grayscale-0 transition-all duration-1000">
  <iframe
    title="Map"
    src="https://www.google.com/maps?q=31.6295,-7.989755&z=15&output=embed"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
  <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(74,52,40,0.2)]" />
</section>
    </div>
  );
}
