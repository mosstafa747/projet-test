import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    low_stock_threshold: 5,
    materials: '',
    dimensions: '',
    images: [],
  });

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data || r.data));
    if (isEdit) {
      api.get(`/admin/products/${id}`).then(r => {
        const p = r.data;
        setForm({
          name: p.name,
          price: p.price,
          description: p.description || '',
          category: p.category,
          stock: p.stock,
          low_stock_threshold: p.low_stock_threshold || 5,
          materials: p.materials || '',
          dimensions: p.dimensions || '',
          images: p.images || [],
        });
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/admin/products/${id}`, form);
      } else {
        await api.post('/admin/products', form);
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
     <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" />
     </div>
  );

  return (
    <div className="bg-[#FBF9F6] min-h-screen pb-40">
       <nav className="max-w-7xl mx-auto px-6 pt-12 flex gap-2 text-[10px] uppercase tracking-widest text-wood/40 font-bold mb-20">
        <Link to="/" className="hover:text-gold transition">Home</Link>
        <span>/</span>
        <Link to="/admin" className="hover:text-gold transition">Master Atelier</Link>
        <span>/</span>
        <span className="text-gold">{isEdit ? 'Refine Piece' : 'Curate New Piece'}</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-20 space-y-4">
           <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px] block">Inventory Management</span>
           <h1 className="font-heading text-6xl text-wood font-bold">{isEdit ? 'Piece Refinement' : 'Piece Curation'}</h1>
           <p className="text-wood/40 italic font-serif">Detailing the essence of Moroccan craftsmanship.</p>
        </header>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-panel p-12 md:p-16 rounded-[4rem] shadow-premium border-white/60"
        >
          <form onSubmit={handleSubmit} className="space-y-12">
             <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-wood/30 border-b border-wood/5 pb-4">Core Identity</h3>
                   
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Appellation</label>
                      <input
                        type="text"
                        required
                        className="premium-input w-full bg-white/50"
                        placeholder="e.g., Imperial Cedar Credenza"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Valuation (MAD)</label>
                         <input
                           type="number"
                           required
                           className="premium-input w-full bg-white/50"
                           value={form.price}
                           onChange={e => setForm({ ...form, price: e.target.value })}
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Collection</label>
                         <select
                           required
                           className="premium-input w-full bg-white/50 appearance-none"
                           value={form.category}
                           onChange={e => setForm({ ...form, category: e.target.value })}
                         >
                           <option value="">Select registry...</option>
                           {categories.map(c => (
                             <option key={c.id} value={c.slug}>{c.name}</option>
                           ))}
                         </select>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-wood/30 border-b border-wood/5 pb-4">Stock Registry</h3>
                   
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Available Units</label>
                         <input
                           type="number"
                           required
                           min="0"
                           className="premium-input w-full bg-white/50"
                           value={form.stock}
                           onChange={e => setForm({ ...form, stock: e.target.value })}
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Low Alert Level</label>
                         <input
                           type="number"
                           min="0"
                           className="premium-input w-full bg-white/50"
                           value={form.low_stock_threshold}
                           onChange={e => setForm({ ...form, low_stock_threshold: e.target.value })}
                         />
                      </div>
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Materials (Artisan Info)</label>
                      <input
                        type="text"
                        className="premium-input w-full bg-white/50"
                        placeholder="e.g., Solid Cedar, Brass Inlays"
                        value={form.materials}
                        onChange={e => setForm({ ...form, materials: e.target.value })}
                      />
                   </div>
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-wood/30 border-b border-wood/5 pb-4">The Narrative</h3>
                <div className="space-y-1">
                   <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Piece Description</label>
                   <textarea
                     required
                     className="premium-input w-full bg-white/50 h-40 pt-4"
                     placeholder="Tell the story of this handcrafted masterpiece..."
                     value={form.description}
                     onChange={e => setForm({ ...form, description: e.target.value })}
                   />
                </div>
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
                  disabled={saving}
                  className="premium-button bg-wood text-cream min-w-[240px] shadow-xl"
                >
                  {saving ? 'Preserving...' : (isEdit ? 'Finalize Refinement' : 'Registry Entry')}
                </button>
             </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
