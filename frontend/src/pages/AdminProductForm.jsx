import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminProductForm() {
  const { user } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.is_admin) {
      navigate('/login');
    } else if (!user) {
        // Optional: wait a bit or check token if needed, 
        // but Admin.jsx doesn't do it either.
    }
  }, [user, navigate]);

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
    sku: '',
    variants: [],
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
          sku: p.sku || '',
          variants: p.variants || [],
        });
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleAddVariant = () => {
    setForm({
      ...form, 
      variants: [...form.variants, { name: '', options: [{name: '', value: ''}], price_modifier: 0, stock: 0, sku: '' }]
    });
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...form.variants];
    newVariants[index][field] = value;
    setForm({ ...form, variants: newVariants });
  };

  const removeVariant = (index) => {
    const newVariants = [...form.variants];
    newVariants.splice(index, 1);
    setForm({ ...form, variants: newVariants });
  };

  const addOption = (vIdx) => {
    const newVariants = [...form.variants];
    const options = Array.isArray(newVariants[vIdx].options) ? [...newVariants[vIdx].options] : [];
    newVariants[vIdx].options = [...options, { name: '', value: '' }];
    setForm({ ...form, variants: newVariants });
  };

  const removeOption = (vIdx, oIdx) => {
    const newVariants = [...form.variants];
    newVariants[vIdx].options.splice(oIdx, 1);
    setForm({ ...form, variants: newVariants });
  };

  const updateOption = (vIdx, oIdx, field, value) => {
    const newVariants = [...form.variants];
    newVariants[vIdx].options[oIdx][field] = value;
    setForm({ ...form, variants: newVariants });
  };

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
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
     </div>
  );

  return (
    <div className="bg-[#F9FAFB] min-h-screen pb-20 font-sans">
       <nav className="max-w-5xl mx-auto px-6 pt-10 flex gap-2 text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-10">
        <Link to="/" className="hover:text-yellow-600 transition">Home</Link>
        <span>/</span>
        <Link to="/admin" className="hover:text-yellow-600 transition">Dashboard</Link>
        <span>/</span>
        <span className="text-yellow-600">{isEdit ? 'Edit Product' : 'Add New Product'}</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-10">
           <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
           <p className="text-gray-500 font-medium">Complete the details below to {isEdit ? 'update your product entry' : 'curate a new piece for your collection'}.</p>
        </header>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white p-10 md:p-12 rounded-3xl shadow-sm border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-12">
             <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                   <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 border-b border-gray-50 pb-4">Core Identity</h3>
                   
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1">Product Name</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                        placeholder="e.g., Imperial Cedar Credenza"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-700 ml-1">Price (MAD)</label>
                         <input
                           type="number"
                           required
                           className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                           value={form.price}
                           onChange={e => setForm({ ...form, price: e.target.value })}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-700 ml-1">Category</label>
                         <select
                           required
                           className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none appearance-none cursor-pointer"
                           value={form.category}
                           onChange={e => setForm({ ...form, category: e.target.value })}
                         >
                           <option value="">Select category...</option>
                           {categories.map(c => (
                             <option key={c.id} value={c.slug}>{c.name}</option>
                           ))}
                         </select>
                      </div>
                   </div>
                </div>

                <div className="space-y-8">
                   <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 border-b border-gray-50 pb-4">Inventory & Logistics</h3>
                   
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1">SKU Identification</label>
                      <input
                        type="text"
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 text-sm font-mono focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                        placeholder="e.g., BELDI-CRED-001"
                        value={form.sku}
                        onChange={e => setForm({ ...form, sku: e.target.value.toUpperCase() })}
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-700 ml-1">Available Units</label>
                         <input
                           type="number"
                           required
                           min="0"
                           className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                           value={form.stock}
                           onChange={e => setForm({ ...form, stock: e.target.value })}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-700 ml-1">Low Stock Alert</label>
                         <input
                           type="number"
                           min="0"
                           className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                           value={form.low_stock_threshold}
                           onChange={e => setForm({ ...form, low_stock_threshold: e.target.value })}
                         />
                      </div>
                   </div>
                </div>
             </div>

              <div className="space-y-8">
                 <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                    <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400">Product Variations</h3>
                    <button type="button" onClick={handleAddVariant} className="text-sm font-bold text-yellow-600 hover:text-yellow-700 transition-colors flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                       Add Variant
                    </button>
                 </div>
                 
                 <div className="space-y-6">
                    {form.variants.map((v, idx) => (
                       <div key={idx} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 space-y-6 relative group">
                          <button type="button" onClick={() => removeVariant(idx)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                          
                          <div className="grid md:grid-cols-2 gap-8 pr-10">
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 ml-1">Variant Name</label>
                                <input type="text" placeholder="e.g. Brown Leather" className="w-full bg-white border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none" value={v.name} onChange={e => updateVariant(idx, 'name', e.target.value)} required />
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 ml-1">Variant SKU</label>
                                <input type="text" placeholder="e.g. BELDI-CRED-001-BR" className="w-full bg-white border-none rounded-2xl px-5 py-4 text-gray-900 text-sm font-mono focus:ring-2 focus:ring-yellow-400 transition-all outline-none" value={v.sku} onChange={e => updateVariant(idx, 'sku', e.target.value.toUpperCase())} />
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 ml-1">Price Adjustment (MAD)</label>
                                <input type="number" placeholder="0" className="w-full bg-white border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none" value={v.price_modifier} onChange={e => updateVariant(idx, 'price_modifier', e.target.value)} />
                                <p className="text-[10px] text-gray-400 font-medium ml-1">Added to base price</p>
                             </div>
                             <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 ml-1">Variant Stock</label>
                                <input type="number" min="0" placeholder="0" className="w-full bg-white border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none" value={v.stock} onChange={e => updateVariant(idx, 'stock', e.target.value)} />
                             </div>
                          </div>
                          
                           <div className="space-y-4 pt-6 border-t border-gray-200/50">
                              <div className="flex justify-between items-center mb-1">
                                 <label className="text-xs font-bold text-gray-700 ml-1">Options (Attributes)</label>
                                 <button type="button" onClick={() => addOption(idx)} className="text-[10px] font-bold text-yellow-600 hover:text-yellow-700 uppercase tracking-wider">Add Attribute</button>
                              </div>
                              <div className="space-y-3">
                                 {Array.isArray(v.options) ? v.options.map((opt, oIdx) => (
                                    <div key={oIdx} className="flex gap-3 items-center">
                                       <input type="text" placeholder="Attribute (e.g. Color)" className="flex-1 bg-white border-none rounded-xl px-4 py-3 text-gray-900 text-xs focus:ring-2 focus:ring-yellow-400 transition-all outline-none" value={opt.name} onChange={e => updateOption(idx, oIdx, 'name', e.target.value)} />
                                       <input type="text" placeholder="Value (e.g. Oak)" className="flex-1 bg-white border-none rounded-xl px-4 py-3 text-gray-900 text-xs focus:ring-2 focus:ring-yellow-400 transition-all outline-none" value={opt.value} onChange={e => updateOption(idx, oIdx, 'value', e.target.value)} />
                                       <button type="button" onClick={() => removeOption(idx, oIdx)} className="text-gray-300 hover:text-red-500 transition-colors">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                       </button>
                                    </div>
                                 )) : (
                                    <p className="text-[10px] text-gray-400 italic ml-1">No attributes defined. Click "Add Attribute" to specify variations.</p>
                                 )}
                              </div>
                           </div>
                       </div>
                    ))}
                    {form.variants.length === 0 && (
                       <div className="text-center py-10 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                          <p className="text-sm font-medium text-gray-400">No variants defined for this piece yet.</p>
                       </div>
                    )}
                 </div>
              </div>

             <div className="space-y-8">
                <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 border-b border-gray-50 pb-4">Detailed Description</h3>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-700 ml-1">Narrative</label>
                   <textarea
                     required
                     className="w-full bg-gray-50 border-none rounded-3xl px-6 py-5 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none h-48 leading-relaxed"
                     placeholder="Tell the story of this handcrafted masterpiece..."
                     value={form.description}
                     onChange={e => setForm({ ...form, description: e.target.value })}
                   />
                </div>
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
                  disabled={saving}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-12 rounded-2xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Product')}
                </button>
             </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
