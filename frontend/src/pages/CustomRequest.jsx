import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

export default function CustomRequest() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', 
    budget: '', dimensions: '', description: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (imageFile) fd.append('image', imageFile);
      await api.post('/custom-requests', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSent(true);
      setForm({ name: '', email: '', phone: '', budget: '', dimensions: '', description: '' });
      setImageFile(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'The Vision', desc: 'Share your ideas, dimensions, and inspirations.' },
    { title: 'Artisan Review', desc: 'Our master craftsmen evaluate the feasibility.' },
    { title: 'The Proposal', desc: 'Receive a detailed quote and timeline.' },
    { title: 'Creation', desc: 'Watch your vision come to life traditionally.' },
  ];

  if (sent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div 
          className="max-w-lg w-full p-12 rounded-[3.5rem] text-center space-y-8 bg-gray-50 border border-gray-100 shadow-xl shadow-gray-200/40"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-24 h-24 bg-[#00A854] rounded-full flex items-center justify-center mx-auto text-white text-5xl">
             <span className="material-symbols-outlined text-4xl">check</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl text-gray-900 font-black tracking-tight">VISION SHARED</h1>
            <p className="text-gray-400 font-medium leading-relaxed uppercase tracking-wider text-xs">Your bespoke journey with Beldi Express has begun. We'll contact you within 48 hours.</p>
          </div>
          <button 
            type="button" 
            onClick={() => setSent(false)} 
            className="w-full bg-[#E62E04] text-white font-black py-5 rounded-full shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
          >
            Submit Another Vision
          </button>
          <Link to="/" className="block text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-[#00A854] transition">Return to Home</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* --- Left Design Panel (Abstract Red/Green) --- */}
      <div className="hidden md:flex md:w-[45%] lg:w-1/2 relative bg-gradient-to-br from-[#E62E04] via-[#cc2904] to-[#00A854] overflow-hidden flex-col items-center justify-center">
        {/* Decorative Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] bg-black/5 rounded-full blur-3xl" />
        
        {/* Floating Pills */}
        <motion.div 
          animate={{ y: [0, -25, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[10%] w-64 h-16 bg-white/15 rounded-full -rotate-12" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute bottom-[10%] right-[10%] w-48 h-12 bg-black/10 rounded-full rotate-45" 
        />

        <div className="relative z-10 text-white p-12 lg:p-24 space-y-16">
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-6xl lg:text-8xl font-black tracking-tight leading-[0.9]"
            >
              BESPOKE <br/><span className="text-white/40">INQUIRY</span>
            </motion.h1>
            <p className="text-white/70 max-w-sm text-lg leading-relaxed font-medium">
              Transform your ideas into high-quality Moroccan artisanal crafts with Beldi Express.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/10">
            {steps.map((s, idx) => (
              <div key={idx} className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00A854] bg-white px-2 py-0.5 rounded-sm">Step {idx + 1}</span>
                <h3 className="text-sm font-bold uppercase tracking-tight">{s.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Right Form Panel (Clean White) --- */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-14 lg:p-24 bg-white overflow-y-auto">
        <motion.div
          className="w-full max-w-xl space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="text-center md:text-left space-y-3">
             <Link to="/" className="text-2xl font-black text-[#E62E04] tracking-tighter hover:scale-105 transition-transform inline-block">BELDI EXPRESS</Link>
             <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">SUBMIT VISION</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <span className="absolute left-4 top-[14px] material-symbols-outlined text-gray-400 text-xl">person</span>
                <input type="text" placeholder="Full Name" className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-[#E62E04]/20 transition-all font-medium"
                   value={form.name} onChange={(e) => update('name', e.target.value)} required />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-[14px] material-symbols-outlined text-gray-400 text-xl">mail</span>
                <input type="email" placeholder="Email Address" className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-[#E62E04]/20 transition-all font-medium"
                   value={form.email} onChange={(e) => update('email', e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <span className="absolute left-4 top-[14px] material-symbols-outlined text-gray-400 text-xl">payments</span>
                <input type="text" placeholder="Budget (e.g. 5,000 DH)" className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-[#E62E04]/20 transition-all font-medium"
                   value={form.budget} onChange={(e) => update('budget', e.target.value)} />
              </div>
              <div className="relative">
                 <span className="absolute left-4 top-[14px] material-symbols-outlined text-gray-400 text-xl">straighten</span>
                 <input type="text" placeholder="Dimensions" className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-[#E62E04]/20 transition-all font-medium"
                   value={form.dimensions} onChange={(e) => update('dimensions', e.target.value)} />
              </div>
            </div>

            <div className="relative">
              <textarea 
                rows={5} 
                placeholder="Describe your vision, materials, and any special requests..." 
                className="w-full bg-gray-50 border-none rounded-[2rem] p-6 text-sm outline-none focus:ring-2 focus:ring-[#E62E04]/20 transition-all font-medium resize-none shadow-inner"
                value={form.description} onChange={(e) => update('description', e.target.value)} required 
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reference Inspiration (Optional)</label>
              <div className="relative group">
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" id="vision-file" />
                <label 
                  htmlFor="vision-file"
                  className="w-full h-32 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center gap-2 cursor-pointer group-hover:bg-gray-50 group-hover:border-[#00A854]/40 transition-all duration-300 overflow-hidden px-6"
                >
                  <span className="material-symbols-outlined text-[#00A854] text-3xl">add_photo_alternate</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                    {imageFile ? imageFile.name : 'Upload Inspiration / Drawing'}
                  </span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-[#cc2904] to-[#E62E04] text-white font-black py-5 rounded-full shadow-lg shadow-red-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 uppercase tracking-widest text-xs mt-6"
            >
              {loading ? 'Submitting Inquiry...' : 'Begin Bespoke Journey'}
            </button>
          </form>

          <footer className="text-center pt-8 border-t border-gray-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] opacity-60">Beldi Express — Bespoke Artisanal Workspace</p>
          </footer>
        </motion.div>
      </div>

    </div>
  );
}
