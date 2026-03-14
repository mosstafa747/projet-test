import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

export default function CustomRequest() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', furniture_type: '', 
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
      setForm({ name: '', email: '', phone: '', furniture_type: '', budget: '', dimensions: '', description: '' });
      setImageFile(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'The Vision', desc: 'Share your ideas, dimensions, and inspirations with our design studio.' },
    { title: 'Artisan Review', desc: 'Our master craftsmen evaluate the technical feasibility and material sourcing.' },
    { title: 'The Proposal', desc: 'Receive a detailed quote and estimated timeline for your unique piece.' },
    { title: 'Creation', desc: 'Watch your vision come to life through traditional Moroccan techniques.' },
  ];

  if (sent) {
    return (
      <div className="min-h-screen bg-wood flex items-center justify-center px-6">
        <motion.div 
          className="glass-panel-dark max-w-lg w-full p-12 rounded-[3rem] text-center space-y-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto text-gold text-4xl">✓</div>
          <div className="space-y-4">
            <h1 className="font-heading text-4xl text-cream font-bold">Request Shared</h1>
            <p className="text-beige/60 leading-relaxed text-lg">Your bespoke journey has begun. Our artisans will review your vision and contact you within 48 hours.</p>
          </div>
          <button 
            type="button" 
            onClick={() => setSent(false)} 
            className="premium-button bg-gold text-wood w-full font-bold uppercase tracking-widest py-5"
          >
            Submit Another Vision
          </button>
          <Link to="/" className="block text-beige/40 text-sm hover:text-gold transition font-bold uppercase tracking-widest">Return to Home</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-wood min-h-screen relative overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0 opacity-20">
         <img 
          src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1600" 
          alt="" 
          className="w-full h-full object-cover grayscale"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-wood via-transparent to-wood" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32">
        {/* Breadcrumbs */}
        <nav className="flex gap-2 text-[10px] uppercase tracking-widest text-beige/20 font-bold mb-20">
          <Link to="/" className="hover:text-gold transition">Home</Link>
          <span>/</span>
          <span className="text-gold">Bespoke Pieces</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Content side */}
          <div className="space-y-16">
            <div className="space-y-6">
               <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px] block">Exclusive Service</span>
               <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-cream font-bold leading-tight">Your Vision, <br/> Our Craft.</h1>
               <p className="text-beige/60 text-xl leading-relaxed max-w-lg">
                 Traditional Moroccan craftsmanship meets your personal style. Create a legacy piece that fits your space and soul perfectly.
               </p>
            </div>

            <div className="space-y-12">
               <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gold">The Bespoke Journey</h3>
               <div className="grid sm:grid-cols-2 gap-10">
                  {steps.map((step, idx) => (
                    <div key={idx} className="space-y-3">
                       <div className="text-gold font-bold text-lg">0{idx + 1}.</div>
                       <h4 className="text-cream font-bold text-lg">{step.title}</h4>
                       <p className="text-beige/40 text-[13px] leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Form side */}
          <motion.div 
            className="glass-panel-dark p-8 md:p-12 rounded-[3.5rem] border-beige/5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-3xl text-cream font-bold mb-10">Bespoke Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest font-bold text-beige/30 ml-2">Your Name</label>
                   <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    required
                    className="premium-input bg-beige/5 border-beige/10 text-beige py-4 px-6 rounded-2xl w-full"
                    placeholder="Full Name"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest font-bold text-beige/30 ml-2">Email Address</label>
                   <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    required
                    className="premium-input bg-beige/5 border-beige/10 text-beige py-4 px-6 rounded-2xl w-full"
                    placeholder="name@example.com"
                   />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest font-bold text-beige/30 ml-2">Furniture Type</label>
                   <input
                    type="text"
                    value={form.furniture_type}
                    onChange={(e) => update('furniture_type', e.target.value)}
                    className="premium-input bg-beige/5 border-beige/10 text-beige py-4 px-6 rounded-2xl w-full"
                    placeholder="e.g. Atlas Oak Table"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] uppercase tracking-widest font-bold text-beige/30 ml-2">Expected Budget</label>
                   <input
                    type="text"
                    value={form.budget}
                    onChange={(e) => update('budget', e.target.value)}
                    className="premium-input bg-beige/5 border-beige/10 text-beige py-4 px-6 rounded-2xl w-full"
                    placeholder="e.g. 15,000 MAD"
                   />
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest font-bold text-beige/30 ml-2">Detailed Vision</label>
                 <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={4}
                  className="premium-input bg-beige/5 border-beige/10 text-beige py-4 px-6 rounded-3xl w-full"
                  placeholder="Describe materials, style, and special requests..."
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest font-bold text-beige/30 ml-2">Reference Photo</label>
                 <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="custom-file-upload"
                    />
                    <label 
                      htmlFor="custom-file-upload"
                      className="flex items-center justify-center gap-4 py-8 border-2 border-dashed border-beige/10 rounded-3xl group-hover:border-gold transition cursor-pointer"
                    >
                       <div className="text-gold text-2xl">+</div>
                       <span className="text-beige/40 text-sm font-medium">
                         {imageFile ? imageFile.name : 'Upload Inspiration / Drawing'}
                       </span>
                    </label>
                 </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="premium-button bg-gold text-wood w-full font-bold uppercase tracking-widest py-5 text-[11px] shadow-2xl hover:shadow-gold/20"
              >
                {loading ? 'Submitting Inquiry...' : 'Begin Bespoke Journey'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
