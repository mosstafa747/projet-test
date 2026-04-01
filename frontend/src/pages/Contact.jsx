import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div 
          className="bg-white p-12 md:p-16 rounded-3xl text-center space-y-8 max-w-xl shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">Message Received</h1>
            <p className="text-gray-500 leading-relaxed font-medium">Thank you for reaching out. Our support team will review your inquiry and get back to you within 24 hours.</p>
          </div>
          <button 
            onClick={() => setSent(false)} 
            className="w-full bg-[#E62E04] text-white py-4 rounded-full font-bold hover:opacity-90 transition-all"
          >
            Send Another Inquiry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
          <Link to="/" className="hover:text-black transition">Home</Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          <span className="text-[#E62E04]">Customer Service</span>
        </nav>
      </div>

      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-24 items-start">
           
           {/* Info Side */}
           <div className="space-y-12">
              <div className="space-y-4">
                 <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Help Center</h1>
                 <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-lg">
                   Connect with our global support team for inquiries about shipping, custom orders, or any technical assistance.
                 </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                   <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-[#E62E04]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900">Email Support</h3>
                      <p className="text-sm text-gray-500 font-medium mt-1">support@beldi-express.com</p>
                   </div>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                   <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900">Phone Support</h3>
                      <p className="text-sm text-gray-500 font-medium mt-1">+212 524 00 00 00</p>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="text-xs uppercase tracking-widest font-bold text-gray-400">Headquarters</h3>
                 <div className="text-sm text-gray-600 font-medium leading-relaxed">
                    <p>6, Derb Chorfa Sghir, Mouassine</p>
                    <p>Marrakech Medina 40000</p>
                    <p>Morocco</p>
                 </div>
              </div>

              <div className="pt-8 border-t border-gray-100 flex gap-6">
                {['Facebook', 'Instagram', 'Pinterest'].map(social => (
                  <a key={social} href="#" className="text-xs font-bold text-gray-400 hover:text-[#E62E04] transition-colors">{social}</a>
                ))}
              </div>
           </div>

           {/* Form Side */}
           <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us an Inquiry</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-tight">Full Name</label>
                   <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#E62E04] focus:bg-white transition-all outline-none text-sm"
                    placeholder="Enter your name"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-tight">Email Address</label>
                   <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#E62E04] focus:bg-white transition-all outline-none text-sm"
                    placeholder="example@mail.com"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-tight">Inquiry Type</label>
                   <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#E62E04] focus:bg-white transition-all outline-none text-sm cursor-pointer"
                    value={form.subject}
                    onChange={(e) => setForm({...form, subject: e.target.value})}
                   >
                     <option value="">General Support</option>
                     <option value="order">Order Status</option>
                     <option value="shipping">Shipping & Returns</option>
                     <option value="custom">Custom Request</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-tight">Message</label>
                   <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-[#E62E04] focus:bg-white transition-all outline-none text-sm resize-none"
                    placeholder="How can we help you?"
                   />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E62E04] text-white py-4 rounded-xl font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
           </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] bg-gray-100 border-y border-gray-100">
        <iframe
          title="Map"
          src="https://www.google.com/maps?q=31.6284804,-7.9951671&z=16&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(0.5)' }}
          allowFullScreen
          loading="lazy"
        />
      </section>
    </div>
  );
}
