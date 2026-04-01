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
    if (form.password !== form.password_confirmation) { setError('Passwords do not match'); return; }
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
    } finally { setLoading(false); }
  };

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row-reverse overflow-hidden font-sans">
      
      {/* --- Right Design Panel (Abstract Gradient) --- */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-[#00A854] via-[#cc2904] to-[#E62E04] overflow-hidden items-center justify-center">
        {/* Decorative Shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-15%] left-[-5%] w-[50%] h-[50%] bg-black/5 rounded-full blur-3xl" />
        
        {/* Floating Pills */}
        <motion.div 
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-[30%] right-[10%] w-56 h-14 bg-white/15 rounded-full rotate-45" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
          className="absolute bottom-[20%] right-[20%] w-40 h-10 bg-white/10 rounded-full -rotate-12" 
        />

        <div className="relative z-10 text-white text-center p-12 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl font-black tracking-tight"
          >
            Join millions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 max-w-sm mx-auto leading-relaxed text-lg"
          >
            Start your journey with authentic Beldi craftsmanship today. Fast, simple, and artisan-first.
          </motion.p>
        </div>
      </div>

      {/* --- Left Form Panel (Clean White) --- */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-14 bg-white overflow-y-auto">
        <motion.div
          className="w-full max-w-md space-y-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Logo / Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="text-2xl font-black text-[#E62E04] tracking-tighter hover:scale-105 transition-transform inline-block">BELDI EXPRESS</Link>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">USER REGISTER</h2>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">warning</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl">person</span>
                <input type="text" placeholder="Full Name" className="w-full bg-gray-50 border-none rounded-full py-3.5 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-[#E62E04]/20 transition-all"
                  value={form.name} onChange={(e) => update('name', e.target.value)} required />
              </div>
              
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl">mail</span>
                <input type="email" placeholder="Email Address" className="w-full bg-gray-50 border-none rounded-full py-3.5 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-[#E62E04]/20 transition-all"
                  value={form.email} onChange={(e) => update('email', e.target.value)} required />
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl">call</span>
                <input type="tel" placeholder="Phone Number" className="w-full bg-gray-50 border-none rounded-full py-3.5 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-[#E62E04]/20 transition-all"
                  value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl uppercase">lock</span>
                  <input type="password" placeholder="Pass..." className="w-full bg-gray-50 border-none rounded-full py-3.5 pl-12 pr-4 text-xs outline-none focus:ring-2 focus:ring-[#E62E04]/20"
                    value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={8} />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl">shield</span>
                  <input type="password" placeholder="Confirm..." className="w-full bg-gray-50 border-none rounded-full py-3.5 pl-12 pr-4 text-xs outline-none focus:ring-2 focus:ring-[#E62E04]/20"
                    value={form.password_confirmation} onChange={(e) => update('password_confirmation', e.target.value)} required />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-[#cc2904] to-[#E62E04] text-white font-black py-4 rounded-full shadow-lg shadow-red-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-4 uppercase tracking-widest text-xs"
              >
                {loading ? 'Account creating...' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-xs font-bold text-gray-400 uppercase">
                Already member? <Link to="/login" className="text-[#00A854] hover:underline ml-1">Login here</Link>
              </p>
            </div>
          </div>

          <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest max-w-[280px] mx-auto opacity-60">
            By joining, you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
