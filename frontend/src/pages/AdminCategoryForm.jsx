import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminCategoryForm() {
  const { user } = useAuthStore();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.is_admin) {
      navigate('/login');
    }
  }, [user, navigate]);

  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/categories/${id}`).then(r => {
        const c = r.data.data || r.data;
        setForm({
          name: c.name,
          description: c.description || '',
          image: c.image || '',
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
        await api.put(`/admin/categories/${id}`, form);
      } else {
        await api.post('/admin/categories', form);
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
      alert('Error saving category');
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
       <nav className="max-w-4xl mx-auto px-6 pt-10 flex gap-2 text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-10">
        <Link to="/" className="hover:text-yellow-600 transition">Home</Link>
        <span>/</span>
        <Link to="/admin" className="hover:text-yellow-600 transition">Dashboard</Link>
        <span>/</span>
        <span className="text-yellow-600">{isEdit ? 'Edit Category' : 'Add New Category'}</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-10">
           <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">{isEdit ? 'Collection Refinement' : 'Collection Definition'}</h1>
           <p className="text-gray-500 font-medium">Establishing the thematic categories of your {isEdit ? 'collection' : 'heritage-focused inventory'}.</p>
        </header>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white p-10 md:p-12 rounded-3xl shadow-sm border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-12">
             <div className="space-y-8">
                <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 border-b border-gray-50 pb-4">Artisan Identity</h3>
                
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-700 ml-1">Collection Name</label>
                   <input
                     type="text"
                     required
                     className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                     placeholder="e.g., The Atlas Collection"
                     value={form.name}
                     onChange={e => setForm({ ...form, name: e.target.value })}
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-700 ml-1">Cover Imagery (URL)</label>
                   <input
                     type="text"
                     className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                     placeholder="https://images.unsplash.com/..."
                     value={form.image}
                     onChange={e => setForm({ ...form, image: e.target.value })}
                   />
                   <p className="text-[10px] text-gray-400 font-medium ml-1">Provide a high-quality image URL for the category banner.</p>
                </div>
             </div>

             <div className="space-y-8">
                <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400 border-b border-gray-50 pb-4">The Narrative</h3>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-700 ml-1">Collection Description</label>
                   <textarea
                     required
                     className="w-full bg-gray-50 border-none rounded-3xl px-6 py-5 text-gray-900 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none h-48 leading-relaxed"
                     placeholder="Describe the soul of this collection..."
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
                  {saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Register Collection')}
                </button>
             </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
