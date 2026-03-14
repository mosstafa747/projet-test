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
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.user, data.token);
      navigate(data.user?.is_admin ? '/admin' : '/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Left: Cinematic Image */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1534001569309-88006d997204?q=80&w=1974&auto=format&fit=crop" 
          alt="Moroccan Crafty Workspace" 
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
             <h2 className="font-heading text-6xl text-cream font-bold mt-4 leading-tight">The Artisan's <br/>Legacy</h2>
             <p className="text-cream/80 text-xl italic font-serif mt-6 max-w-md">Connect to your personal collection of Moroccan heritage and handcrafted excellence.</p>
           </motion.div>
        </div>
      </div>

      {/* Right: Sophisticated Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 py-20 relative overflow-hidden">
        {/* Abstract pattern background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-wood/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

        <motion.div
          className="relative max-w-md w-full mx-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="mb-12 space-y-4 text-center md:text-left">
            <h1 className="font-heading text-5xl text-wood font-bold">Welcome Back</h1>
            <p className="text-wood/40 font-bold uppercase tracking-widest text-[10px]">Entrance to the Boutique</p>
          </div>

          <div className="glass-panel p-10 md:p-12 rounded-[3.5rem] shadow-premium border-white/60">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-red-500 text-[11px] font-bold uppercase tracking-widest text-center bg-red-50 py-3 rounded-2xl"
                >{error}</motion.p>
              )}
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your artisan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="premium-input w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30">Password</label>
                    <button type="button" className="text-[9px] uppercase tracking-widest font-bold text-gold hover:text-wood transition">Forgot Registry?</button>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="premium-input w-full"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="premium-button bg-wood text-cream w-full shadow-xl hover:shadow-2xl transition-all"
              >
                {loading ? 'Authenticating…' : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="mt-12 text-center space-y-6">
            <p className="text-wood/40 text-[11px] uppercase tracking-widest font-bold">
              New to the Atelier? <Link to="/register" className="text-gold hover:text-wood transition border-b-2 border-gold/20 hover:border-gold pb-1 ml-2">Create an Account</Link>
            </p>
            
            <div className="pt-8 border-t border-wood/5 flex flex-wrap justify-center gap-6 opacity-30">
               <span className="text-[9px] font-bold uppercase tracking-widest">Handcrafted Security</span>
               <span className="text-[9px] font-bold uppercase tracking-widest">Artisan Privacy</span>
               <span className="text-[9px] font-bold uppercase tracking-widest">Heritage Trust</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
