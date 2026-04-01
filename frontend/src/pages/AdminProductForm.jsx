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
        // Optional: wait a bit or check token if needed
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

              <div className="space-y-8 mb-12">
                <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 border-b border-gray-50 pb-4">Product Imagery</h3>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label htmlFor="product-images" className="flex flex-col items-center justify-center w-full h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 cursor-pointer hover:bg-yellow-50 hover:border-yellow-200 transition-all">
                         <div className="text-center">
                            <svg className="w-8 h-8 text-yellow-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                            <p className="text-xs font-black text-gray-900">Upload Masterpieces</p>
                         </div>
                         <input type="file" multiple id="product-images" className="hidden" accept="image/*" onChange={async (e) => {
                            const files = Array.from(e.target.files);
                            if (files.length === 0) return;
                            
                            const newImages = await Promise.all(
                              files.map(file => new Promise(resolve => {
                                const reader = new FileReader();
                                reader.onload = () => resolve(reader.result);
                                reader.readAsDataURL(file);
                              }))
                            );
                            
                            setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
                            e.target.value = ''; // Reset input to allow same file selection
                         }} />
                      </label>
                   </div>
                   <div className="grid grid-cols-4 gap-2 h-40 overflow-y-auto">
                      {form.images.map((img, idx) => (
                         <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 shadow-sm">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <button type="button" onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))} className="text-white p-1 hover:text-red-400 transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                               </button>
                            </div>
                         </div>
                      ))}
                      {form.images.length === 0 && <div className="col-span-4 flex items-center justify-center bg-gray-50 rounded-xl text-[10px] font-bold text-gray-400 uppercase">Gallery Empty</div>}
                   </div>
                </div>
              </div>

               <div className="space-y-8">
                <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 border-b border-gray-50 pb-4">Detailed Description</h3>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-700 ml-1">Materials</label>
                       <input type="text" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none" placeholder="e.g. Cedar Wood" value={form.materials} onChange={e => setForm({ ...form, materials: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-gray-700 ml-1">Dimensions</label>
                       <input type="text" className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none" placeholder="e.g. 100x50x80" value={form.dimensions} onChange={e => setForm({ ...form, dimensions: e.target.value })} />
                    </div>
                </div>
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
