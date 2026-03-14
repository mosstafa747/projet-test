import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      setAuth(data.user, data.token);
      navigate('/profile');
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(' ')
        : err.response?.data?.message || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row-reverse">
      {/* Left (was Right in Login): Cinematic Image */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1590073844006-3a44579462a1?q=80&w=2021&auto=format&fit=crop" 
          alt="Moroccan Artisanal Details" 
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[2000ms]"
        />
        <div className="absolute inset-0 bg-wood/40 mix-blend-multiply" />
        <div className="absolute inset-0 flex flex-col justify-end p-20 space-y-6">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
           >
             <span className="text-gold font-bold uppercase tracking-[0.4em] text-xs">Beldi Concept</span>
             <h2 className="font-heading text-6xl text-cream font-bold mt-4 leading-tight">Join the <br/>Atelier</h2>
             <p className="text-cream/80 text-xl italic font-serif mt-6 max-w-md">Become part of our exclusive community and celebrate the beauty of handcrafted Moroccan living.</p>
           </motion.div>
        </div>
      </div>

      {/* Right (was Left in Login): Sophisticated Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 py-20 relative overflow-hidden">
        {/* Abstract pattern background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-wood/5 rounded-full blur-[80px] translate-y-1/2 translate-x-1/2" />

        <motion.div
          className="relative max-w-md w-full mx-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="mb-12 space-y-4 text-center md:text-left">
            <h1 className="font-heading text-5xl text-wood font-bold">Create Registry</h1>
            <p className="text-wood/40 font-bold uppercase tracking-widest text-[10px]">Begin Your Artisan Journey</p>
          </div>

          <div className="glass-panel p-10 md:p-12 rounded-[3.5rem] shadow-premium border-white/60">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-red-500 text-[11px] font-bold uppercase tracking-widest text-center bg-red-50 py-3 rounded-2xl"
                >{error}</motion.p>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Omar Khalid"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    required
                    className="premium-input w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="omar.k@example.com"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    required
                    className="premium-input w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+212 600 000 000"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="premium-input w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">Registry Key</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      required
                      minLength={8}
                      className="premium-input w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">Confirm Key</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={form.password_confirmation}
                      onChange={(e) => update('password_confirmation', e.target.value)}
                      required
                      className="premium-input w-full"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="premium-button bg-wood text-cream w-full shadow-xl hover:shadow-2xl transition-all mt-6"
              >
                {loading ? 'Processing Registry…' : 'Join the Atelier'}
              </button>
            </form>
          </div>

          <div className="mt-12 text-center space-y-6">
            <p className="text-wood/40 text-[11px] uppercase tracking-widest font-bold">
              Already have a key? <Link to="/login" className="text-gold hover:text-wood transition border-b-2 border-gold/20 hover:border-gold pb-1 ml-2">Sign In Here</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
