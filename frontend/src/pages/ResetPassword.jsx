import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';

export default function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    setError(''); setMessage(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/password-reset', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      setMessage(data.message || 'Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row-reverse overflow-hidden font-sans">
      
      {/* --- Design Panel (Abstract Green/Red) --- */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-[#00A854] via-[#cc2904] to-[#E62E04] overflow-hidden items-center justify-center">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-black/10 rounded-full blur-3xl" />
        
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[30%] right-[15%] w-32 h-32 bg-white/5 rounded-3xl" 
        />

        <div className="relative z-10 text-white text-center p-12 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl font-black tracking-tight"
          >
            New Security
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 max-w-sm mx-auto leading-relaxed text-lg"
          >
            Create a strong new password to protect your Beldi account and ensure your artisan orders stay secure.
          </motion.p>
        </div>
      </div>

      {/* --- Right Form Panel (Clean White) --- */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 bg-white">
        <motion.div
          className="w-full max-w-sm space-y-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="text-center space-y-2">
            <Link to="/" className="text-2xl font-black text-[#E62E04] tracking-tighter">BELDI EXPRESS</Link>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">RESET PASSWORD</h2>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">warning</span>
                {error}
              </div>
            )}
            {message && (
              <div className="p-4 bg-green-50 text-green-600 text-xs font-bold rounded-lg border border-green-100 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                {message}
              </div>
            )}

            {!message && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email (Confirmed)</label>
                  <input type="text" value={email} readOnly className="w-full bg-gray-50 border-none rounded-full py-4 px-6 text-sm text-gray-500 cursor-not-allowed outline-none" />
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl">lock_open</span>
                  <input 
                    type="password" 
                    placeholder="New Password"
                    className="w-full bg-gray-50 border-none rounded-full py-4 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-[#E62E04]/20 transition-all text-gray-700"
                    value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-xl">verified_user</span>
                  <input 
                    type="password" 
                    placeholder="Confirm New Password"
                    className="w-full bg-gray-50 border-none rounded-full py-4 pl-12 pr-6 text-sm outline-none focus:ring-2 focus:ring-[#E62E04]/20 transition-all text-gray-700"
                    value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-gradient-to-r from-[#cc2904] to-[#E62E04] text-white font-black py-4 rounded-full shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                  {loading ? 'Changing...' : 'RESET PASSWORD'}
                </button>
              </form>
            )}

            <div className="text-center pt-4">
              <Link to="/login" className="text-xs font-bold text-gray-400 uppercase hover:text-[#00A854] transition-colors">Return to Login</Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
