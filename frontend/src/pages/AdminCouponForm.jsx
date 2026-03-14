import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';

export default function AdminCouponForm() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  return (
    <div className="bg-[#FBF9F6] min-h-screen pb-40">
       <nav className="max-w-7xl mx-auto px-6 pt-12 flex gap-2 text-[10px] uppercase tracking-widest text-wood/40 font-bold mb-20">
        <Link to="/" className="hover:text-gold transition">Home</Link>
        <span>/</span>
        <Link to="/admin" className="hover:text-gold transition">Master Atelier</Link>
        <span>/</span>
        <span className="text-gold">{id ? 'Refine Registry Key' : 'Forge New Key'}</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6">
        <header className="mb-20 space-y-4">
           <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px] block">Registry Access Control</span>
           <h1 className="font-heading text-6xl text-wood font-bold">{id ? 'Key Refinement' : 'Registry Key Forging'}</h1>
           <p className="text-wood/40 italic font-serif">Curating exclusive access and artisan incentives.</p>
        </header>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-panel p-12 md:p-16 rounded-[4rem] shadow-premium border-white/60"
        >
          <form onSubmit={handleSubmit} className="space-y-12">
             <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-wood/30 border-b border-wood/5 pb-4">Key Identity</h3>
                   
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Secret Code</label>
                      <input
                        type="text"
                        required
                        className="premium-input w-full bg-white/50 font-mono uppercase tracking-widest"
                        placeholder="e.g. ATLAS20"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      />
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Heritage Class (Type)</label>
                      <select
                        className="premium-input w-full bg-white/50 appearance-none"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (MAD)</option>
                        <option value="free_shipping">Free Shipping</option>
                      </select>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-wood/30 border-b border-wood/5 pb-4">Key Logistics</h3>
                   
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Valuation / Value</label>
                      <input
                        type="number"
                        required
                        className="premium-input w-full bg-white/50"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        disabled={formData.type === 'free_shipping'}
                      />
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Sunset Date (Expiry)</label>
                      <input
                        type="date"
                        className="premium-input w-full bg-white/50"
                        value={formData.expiry_date}
                        onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                      />
                   </div>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-wood/30 border-b border-wood/5 pb-4">Usage Thresholds</h3>
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Registry Limit</label>
                      <input
                        type="number"
                        className="premium-input w-full bg-white/50"
                        value={formData.usage_limit}
                        onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                        placeholder="Unlimited usage"
                      />
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-wood/30 border-b border-wood/5 pb-4">Minimum Valuation</h3>
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Min order value (MAD)</label>
                      <input
                        type="number"
                        className="premium-input w-full bg-white/50"
                        value={formData.min_order_value}
                        onChange={(e) => setFormData({ ...formData, min_order_value: e.target.value })}
                      />
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-4 py-4 px-6 bg-wood/5 rounded-3xl border border-wood/10 w-fit">
                <input
                  type="checkbox"
                  id="is_active"
                  className="w-5 h-5 accent-gold cursor-pointer"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <label htmlFor="is_active" className="text-[11px] uppercase font-bold tracking-widest text-wood cursor-pointer">Key is Currently Active</label>
             </div>

             <div className="flex justify-between items-center pt-12 border-t border-wood/5">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="text-[10px] uppercase font-bold tracking-widest text-wood/40 hover:text-wood transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="premium-button bg-wood text-cream min-w-[240px] shadow-xl"
                >
                  {loading ? 'Preserving Key...' : (id ? 'Finalize Refinement' : 'Forge Secret Key')}
                </button>
             </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
