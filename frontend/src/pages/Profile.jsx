import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import api from '../lib/api';

const inputClass = "w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:bg-white focus:border-[#E62E04] transition-all outline-none placeholder:text-gray-300";
const labelClass = "text-[11px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block";

export default function Profile() {
  const { user, fetchProfile, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const [profileForm, setProfileForm] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    address: '',
    city: ''
  });
  const [passwordForm, setPasswordForm] = useState({ 
    current_password: '', 
    password: '', 
    password_confirmation: '' 
  });

  useEffect(() => {
    fetchProfile().then(u => {
      if (u) setProfileForm({ 
        name: u.name, 
        email: u.email, 
        phone: u.phone || '',
        address: u.address || '',
        city: u.city || ''
      });
    });
  }, [fetchProfile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true); setSuccess('');
    try {
      await updateProfile(profileForm);
      setSuccess('Profile information updated successfully.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true); setSuccess('');
    try {
      await api.put('/users/password', passwordForm);
      setSuccess('Your password has been changed.');
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Password update failed');
    } finally { setLoading(false); }
  };

  if (!user) return null;

  const initials = user.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-100">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-900 rounded-[2rem] flex items-center justify-center text-white text-2xl font-black shadow-xl">
               {initials}
            </div>
            <div>
               <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{user.name}</h1>
               <p className="text-gray-400 font-bold tracking-tight">{user.email}</p>
            </div>
         </div>
         <div className="flex gap-4">
            <Link to="/orders" className="bg-gray-50 text-gray-900 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all border border-gray-100">My Orders</Link>
            <button onClick={() => { logout(); navigate('/'); }} className="bg-red-50 text-[#E62E04] px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-100 transition-all">Sign Out</button>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-2">
             <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-6 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all ${activeTab === 'profile' ? 'bg-gray-900 text-white shadow-xl rotate-[-1deg]' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
             >
                Profile & Shipping
             </button>
             <button 
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-6 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all ${activeTab === 'security' ? 'bg-gray-900 text-white shadow-xl rotate-[1deg]' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
             >
                Security Settings
             </button>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <section className="space-y-8">
                     <div className="flex justify-between items-end">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Personal & Shipping</h2>
                        {success && (
                           <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#00A854] font-black text-xs uppercase tracking-widest px-4 py-2 bg-emerald-50 rounded-xl">✓ {success}</motion.span>
                        )}
                     </div>

                     <form onSubmit={handleUpdateProfile} className="space-y-8">
                        <div className="grid sm:grid-cols-2 gap-8">
                           <div>
                              <label className={labelClass}>Full Name</label>
                              <input 
                                 type="text" 
                                 className={inputClass}
                                 value={profileForm.name}
                                 onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                 placeholder="Hassan Benali"
                                 required
                              />
                           </div>
                           <div>
                              <label className={labelClass}>Email Address</label>
                              <input 
                                 type="email" 
                                 className={inputClass}
                                 value={profileForm.email}
                                 onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                                 placeholder="hassan@example.com"
                                 required
                              />
                           </div>
                           <div>
                              <label className={labelClass}>Phone Number</label>
                              <input 
                                 type="tel" 
                                 className={inputClass}
                                 value={profileForm.phone}
                                 onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                                 placeholder="06 XX XX XX XX"
                              />
                           </div>
                           <div>
                              <label className={labelClass}>City</label>
                              <input 
                                 type="text" 
                                 className={inputClass}
                                 value={profileForm.city}
                                 onChange={e => setProfileForm({ ...profileForm, city: e.target.value })}
                                 placeholder="Casablanca"
                              />
                           </div>
                           <div className="sm:col-span-2">
                              <label className={labelClass}>Full Shipping Address</label>
                              <input 
                                 type="text" 
                                 className={inputClass}
                                 value={profileForm.address}
                                 onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                                 placeholder="Street name, Apartment number, Landmark"
                              />
                           </div>
                        </div>

                        <button 
                           type="submit" 
                           disabled={loading}
                           className="bg-[#E62E04] text-white px-10 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-red-100 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                        >
                           {loading ? 'Saving Changes...' : 'Save Profile'}
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        </button>
                     </form>
                  </section>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  <section className="space-y-8">
                     <div className="flex justify-between items-end">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Account Security</h2>
                        {success && (
                           <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#00A854] font-black text-xs uppercase tracking-widest px-4 py-2 bg-emerald-50 rounded-xl">✓ {success}</motion.span>
                        )}
                     </div>

                     <form onSubmit={handleUpdatePassword} className="space-y-8 max-w-xl">
                        <div className="space-y-6">
                           <div>
                              <label className={labelClass}>Current Password</label>
                              <input 
                                 type="password" 
                                 className={inputClass}
                                 value={passwordForm.current_password}
                                 onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                 placeholder="••••••••"
                                 required
                              />
                           </div>
                           <div>
                              <label className={labelClass}>New Password</label>
                              <input 
                                 type="password" 
                                 className={inputClass}
                                 value={passwordForm.password}
                                 onChange={e => setPasswordForm({ ...passwordForm, password: e.target.value })}
                                 placeholder="••••••••"
                                 required
                              />
                           </div>
                           <div>
                              <label className={labelClass}>Confirm New Password</label>
                              <input 
                                 type="password" 
                                 className={inputClass}
                                 value={passwordForm.password_confirmation}
                                 onChange={e => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                                 placeholder="••••••••"
                                 required
                              />
                           </div>
                        </div>

                        <button 
                           type="submit" 
                           disabled={loading}
                           className="bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-gray-100 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                        >
                           {loading ? 'Changing Password...' : 'Change Password'}
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </button>
                     </form>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
