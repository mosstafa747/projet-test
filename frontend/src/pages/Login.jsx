import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.user, data.token);
      if (data.user?.is_admin) navigate('/admin');
      else if (data.user?.is_driver) navigate('/driver');
      else navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* --- Left Design Panel (Abstract Abstract) --- */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-[#E62E04] via-[#cc2904] to-[#00A854] overflow-hidden items-center justify-center">
        {/* Decorative Shapes (Inspired by Freepik) */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-black/10 rounded-full blur-3xl" />
        
        {/* Floating Abstract Pills */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[15%] w-48 h-12 bg-white/20 rounded-full -rotate-45" 
        />
        <motion.div 
          animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[25%] left-[10%] w-64 h-16 bg-white/10 rounded-full rotate-12" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[40%] right-[10%] w-32 h-8 bg-black/10 rounded-full -rotate-12" 
        />

        <div className="relative z-10 text-white text-center p-12 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl font-black tracking-tight"
          >
            Welcome to website
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 max-w-md mx-auto leading-relaxed text-lg"
          >
            Experience the finest Moroccan artisanal craftsmanship combined with modern simple design.
          </motion.p>
        </div>
      </div>

      {/* --- Right Form Panel (Clean White) --- */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-white">
        <motion.div
          className="w-full max-w-sm space-y-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Logo / Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="text-2xl font-black text-[#E62E04] tracking-tighter">BELDI EXPRESS</Link>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">USER LOGIN</h2>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">warning</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl">person</span>
                <input 
                  type="email" 
                  placeholder="Email"
                  className="w-full bg-gray-50 border-none rounded-full py-4 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-[#E62E04]/20 transition-all text-gray-700"
                  value={email} onChange={(e) => setEmail(e.target.value)} required 
                />
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl">lock</span>
                <input 
                  type="password" 
                  placeholder="Password"
                  className="w-full bg-gray-50 border-none rounded-full py-4 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-[#E62E04]/20 transition-all text-gray-700"
                  value={password} onChange={(e) => setPassword(e.target.value)} required 
                />
              </div>

              <div className="flex justify-between items-center px-4">
                <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase cursor-pointer hover:text-gray-600 transition-colors">
                  <input type="checkbox" className="w-3 h-3 accent-[#00A854]" />
                  Remember
                </label>
                <Link to="/forgot-password" size="sm" className="text-[11px] font-bold text-gray-400 uppercase hover:text-[#E62E04] transition-colors">Forgot password?</Link>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-[#cc2904] to-[#E62E04] text-white font-black py-4 rounded-full shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
              >
                {loading ? 'Processing...' : 'LOGIN'}
              </button>
            </form>

            <div className="text-center pt-4">
              <p className="text-xs font-bold text-gray-400 uppercase">
                New here? <Link to="/register" className="text-[#00A854] hover:underline ml-1">Create Account</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Styled By Footer (Optional matching image) */}
      <div className="fixed bottom-6 w-full text-center md:text-right md:pr-10 z-0 pointer-events-none opacity-40">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Beldi Express — Simple & Functional</p>
      </div>

    </div>
  );
}
