import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import api from '../lib/api';

export default function Profile() {
  const { user, fetchProfile, updateProfile, deleteAccount, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    fetchProfile().then(u => {
      if (u) {
        setProfileForm({
          name: u.name,
          email: u.email,
          phone: u.phone || '',
        });
      }
    });
  }, [fetchProfile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await updateProfile(profileForm);
      setSuccess('Profile successfully preserved.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await api.put('/users/password', passwordForm);
      setSuccess('Security credentials updated.');
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('This will permanently remove your narrative from our history. Are you sure?')) return;
    try {
      await deleteAccount();
      navigate('/');
    } catch (err) {
      alert('Failed to delete account');
    }
  };

  if (!user) return null;

  return (
    <div className="bg-cream min-h-screen pb-40">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 pt-12 flex gap-2 text-[10px] uppercase tracking-widest text-wood/40 font-bold mb-20">
        <Link to="/" className="hover:text-gold transition">Home</Link>
        <span>/</span>
        <span className="text-gold">Private Atelier</span>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20 space-y-4">
           <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px] block">Your Legacy</span>
           <h1 className="font-heading text-5xl md:text-6xl text-wood font-bold">The Private Atelier</h1>
        </header>

        <div className="grid lg:grid-cols-4 gap-16 items-start">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-10">
            <div className="glass-panel p-10 rounded-[3rem] shadow-premium text-center border-white/60">
               <div className="w-24 h-24 bg-beige rounded-full flex items-center justify-center mx-auto mb-6 text-wood/10 ring-4 ring-white shadow-inner">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               </div>
               <h2 className="font-heading text-2xl text-wood font-bold truncate">{user.name}</h2>
               <div className="mt-4 inline-block px-4 py-1.5 bg-gold/10 rounded-full">
                  <span className="text-[10px] text-gold uppercase tracking-widest font-bold">Patron since {new Date(user.created_at || Date.now()).getFullYear()}</span>
               </div>
            </div>

            <div className="space-y-3">
              {[
                { id: 'overview', label: 'Artisan Portfolio', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { id: 'security', label: 'Vault Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-8 py-5 rounded-[2rem] transition-all duration-500 font-bold uppercase tracking-widest text-[11px] ${activeTab === tab.id ? 'bg-wood text-cream shadow-xl translate-x-4' : 'text-wood/40 hover:text-wood hover:bg-white/40'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
              
              <Link
                to="/orders"
                className="w-full flex items-center gap-4 px-8 py-5 rounded-[2rem] text-wood/40 hover:text-wood hover:bg-white/40 font-bold uppercase tracking-widest text-[11px] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Orders Gallery
              </Link>

              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full flex items-center gap-4 px-8 py-5 rounded-[2rem] text-red-400 hover:bg-red-50 font-bold uppercase tracking-widest text-[11px] transition-all mt-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                End Session
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <div className="glass-panel p-12 md:p-16 rounded-[4rem] shadow-premium border-white/60 space-y-12">
                    <header className="space-y-2">
                       <h2 className="font-heading text-4xl text-wood font-bold">Portfolio Details</h2>
                       <p className="text-wood/40 italic font-serif">A record of your journey with Beldi Concept.</p>
                    </header>

                    {success && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-olive/10 text-olive text-[11px] font-bold uppercase tracking-widest rounded-3xl border border-olive/20 text-center"
                      >{success}</motion.div>
                    )}

                    <form onSubmit={handleUpdateProfile} className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-4">Full Identity</label>
                          <input
                            type="text"
                            required
                            className="premium-input w-full"
                            value={profileForm.name}
                            onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-4">Registry Email</label>
                          <input
                            type="email"
                            required
                            className="premium-input w-full"
                            value={profileForm.email}
                            onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2 max-w-md">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-4">Concierge Phone</label>
                        <input
                          type="text"
                          className="premium-input w-full"
                          value={profileForm.phone}
                          onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                        />
                      </div>

                      <div className="pt-6">
                        <button
                          type="submit"
                          disabled={loading}
                          className="premium-button bg-wood text-cream shadow-xl hover:shadow-2xl transition-all"
                        >
                          {loading ? 'Preserving…' : 'Preserve Portfolio'}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                     <Link to="/orders" className="glass-panel p-10 rounded-[3rem] border-white/40 group hover:border-gold/30 transition-all shadow-premium-soft">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-cream transition-colors">
                               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            </div>
                            <svg className="w-6 h-6 text-wood/20 group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                        <h3 className="font-heading text-2xl text-wood font-bold mt-6">Order Gallery</h3>
                        <p className="text-wood/40 text-sm italic font-serif mt-2">Browse your past acquisitions.</p>
                     </Link>
                     <Link to="/wishlist" className="glass-panel p-10 rounded-[3rem] border-white/40 group hover:border-gold/30 transition-all shadow-premium-soft">
                        <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-cream transition-colors">
                               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </div>
                            <svg className="w-6 h-6 text-wood/20 group-hover:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                        <h3 className="font-heading text-2xl text-wood font-bold mt-6">Private Collection</h3>
                        <p className="text-wood/40 text-sm italic font-serif mt-2">Saved pieces awaiting a home.</p>
                     </Link>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <div className="glass-panel p-12 md:p-16 rounded-[4rem] shadow-premium border-white/60 space-y-12">
                    <header className="space-y-2">
                       <h2 className="font-heading text-4xl text-wood font-bold">Vault Security</h2>
                       <p className="text-wood/40 italic font-serif">Manage the keys to your private portfolio.</p>
                    </header>

                    <form onSubmit={handleUpdatePassword} className="space-y-10 max-w-md">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-4">Current Registry Key</label>
                          <input
                            type="password"
                            required
                            className="premium-input w-full"
                            value={passwordForm.current_password}
                            onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-4">New Registry Key</label>
                          <input
                            type="password"
                            required
                            className="premium-input w-full"
                            value={passwordForm.password}
                            onChange={e => setPasswordForm({ ...passwordForm, password: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-4">Confirm New Key</label>
                          <input
                            type="password"
                            required
                            className="premium-input w-full"
                            value={passwordForm.password_confirmation}
                            onChange={e => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="premium-button bg-wood text-cream shadow-xl hover:shadow-2xl transition-all"
                      >
                        Change Registry Key
                      </button>
                    </form>

                    <div className="pt-20 border-t border-red-50 space-y-8">
                       <h3 className="text-red-400 font-bold uppercase tracking-[0.2em] text-[11px]">The Final Step</h3>
                       <div className="bg-red-50/30 p-10 rounded-[3rem] border border-red-100/50 space-y-6">
                          <p className="text-wood/60 text-sm italic font-serif leading-relaxed">Closing your atelier is a permanent action. All records of your acquisitions and curations will be vanished from our history, in full compliance with global privacy standards.</p>
                          <button
                            onClick={handleDeleteAccount}
                            className="text-[11px] uppercase tracking-widest font-bold text-red-400 hover:text-red-500 transition-all border-b border-red-200 pb-1"
                          >
                            Dissolve My Registry
                          </button>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
