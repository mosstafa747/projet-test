import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminCouponForm() {
  const { user } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.is_admin) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: 0,
    expiry_date: '',
    usage_limit: '',
    min_order_value: 0,
    is_active: true,
  });

  useEffect(() => {
    if (id) {
      api.get(`/admin/coupons/${id}`).then((r) => {
        const data = r.data.data || r.data;
        if (data.expiry_date) {
            data.expiry_date = data.expiry_date.split('T')[0];
        }
        setFormData(data);
      });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await api.put(`/admin/coupons/${id}`, formData);
      } else {
        await api.post('/admin/coupons', formData);
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving coupon');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#F9FAFB] min-h-screen pb-20 font-sans">
       <nav className="max-w-4xl mx-auto px-6 pt-10 flex gap-2 text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-10">
        <Link to="/" className="hover:text-yellow-600 transition">Home</Link>
        <span>/</span>
        <Link to="/admin" className="hover:text-yellow-600 transition">Dashboard</Link>
        <span>/</span>
        <span className="text-yellow-600">{id ? 'Edit Coupon' : 'Create New Coupon'}</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-10">
           <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">{id ? 'Edit Coupon' : 'Create New Coupon'}</h1>
           <p className="text-gray-500 font-medium">Manage your promotional offers and {id ? 'update existive incentives' : 'forge new keys for artisan savings'}.</p>
        </header>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white p-10 md:p-12 rounded-3xl shadow-sm border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-12">
             <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                   <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 border-b border-gray-50 pb-4">Coupon Identity</h3>
                   
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1">Secret Code</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 text-sm font-mono uppercase tracking-widest focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                        placeholder="e.g. ATLAS20"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1">Reward Type</label>
                      <select
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none appearance-none cursor-pointer"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="percentage">Percentage Off (%)</option>
                        <option value="fixed">Fixed Amount (MAD)</option>
                        <option value="free_shipping">Free Shipping</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-8">
                   <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 border-b border-gray-50 pb-4">Redemption Logistics</h3>
                   
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1">Benefit Value</label>
                      <input
                        type="number"
                        required
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        disabled={formData.type === 'free_shipping'}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1">Expiration Date</label>
                      <input
                        type="date"
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                        value={formData.expiry_date}
                        onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                      />
                   </div>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                   <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 border-b border-gray-50 pb-4">Usage Limits</h3>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1">Total Redemptions Allowed</label>
                      <input
                        type="number"
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                        value={formData.usage_limit}
                        onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                        placeholder="Leave empty for unlimited"
                      />
                   </div>
                </div>

                <div className="space-y-8">
                   <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 border-b border-gray-50 pb-4">Minimum Requirement</h3>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1">Min Order Value (MAD)</label>
                      <input
                        type="number"
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                        value={formData.min_order_value}
                        onChange={(e) => setFormData({ ...formData, min_order_value: e.target.value })}
                      />
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-4 py-6 px-10 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                   <input
                     type="checkbox"
                     id="is_active"
                     className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-2 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:border-yellow-500"
                     checked={formData.is_active}
                     onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                   />
                   <label htmlFor="is_active" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
                <label htmlFor="is_active" className="text-xs font-bold text-gray-700 cursor-pointer">Coupon is Currently Active</label>
             </div>

             <div className="flex justify-between items-center pt-10 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="px-8 py-4 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-12 rounded-2xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : (id ? 'Save Changes' : 'Forge Coupon')}
                </button>
             </div>
          </form>
        </motion.div>
      </div>
      <style>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #eab308;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #facc15;
        }
        .toggle-checkbox {
          right: auto;
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
