import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';

export default function AdminCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
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
        <span className="text-gold">{isEdit ? 'Refine Collection' : 'Define Collection'}</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6">
        <header className="mb-20 space-y-4">
           <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px] block">Collection Registry</span>
           <h1 className="font-heading text-6xl text-wood font-bold">{isEdit ? 'Collection Refinement' : 'Collection Definition'}</h1>
           <p className="text-wood/40 italic font-serif">Establishing the thematic boundaries of Moroccan heritage.</p>
        </header>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="glass-panel p-12 md:p-16 rounded-[4rem] shadow-premium border-white/60"
        >
          <form onSubmit={handleSubmit} className="space-y-10">
             <div className="space-y-6">
                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-wood/30 border-b border-wood/5 pb-4">Artisan Identity</h3>
                
                <div className="space-y-1">
                   <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Collection Name</label>
                   <input
                     type="text"
                     required
                     className="premium-input w-full bg-white/50"
                     placeholder="e.g., The Atlas Collection"
                     value={form.name}
                     onChange={e => setForm({ ...form, name: e.target.value })}
                   />
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Cover Imagery (URL)</label>
                   <input
                     type="text"
                     className="premium-input w-full bg-white/50"
                     placeholder="https://images.unsplash.com/..."
                     value={form.image}
                     onChange={e => setForm({ ...form, image: e.target.value })}
                   />
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-wood/30 border-b border-wood/5 pb-4">The Narrative</h3>
                <div className="space-y-1">
                   <label className="text-[10px] uppercase font-bold tracking-widest text-wood/60 ml-2">Collection Description</label>
                   <textarea
                     required
                     className="premium-input w-full bg-white/50 h-40 pt-4"
                     placeholder="Describe the soul of this collection..."
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
                  className="premium-button bg-wood text-cream min-w-[200px] shadow-xl"
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
