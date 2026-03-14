import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';

export default function Support() {
  const user = useAuthStore((s) => s.user);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get('/tickets').then((r) => {
        setTickets(r.data);
        setLoading(false);
    });
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-cream">
        <div className="glass-panel p-16 rounded-[4rem] shadow-premium text-center border-white/60">
          <p className="text-wood/40 italic font-serif mb-8 text-lg">Please authenticate to access the Concierge Gallery.</p>
          <Link to="/login" className="premium-button bg-wood text-cream inline-block px-12">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pb-40">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 pt-12 flex gap-2 text-[10px] uppercase tracking-widest text-wood/40 font-bold mb-20">
        <Link to="/" className="hover:text-gold transition">Home</Link>
        <span>/</span>
        <Link to="/profile" className="hover:text-gold transition">Private Atelier</Link>
        <span>/</span>
        <span className="text-gold">Concierge Inquiries</span>
      </nav>

      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-wood/10 pb-12">
           <div className="space-y-4">
              <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px] block">Patron Assistance</span>
              <h1 className="font-heading text-6xl text-wood font-bold">Concierge Gallery.</h1>
              <p className="text-wood/40 italic font-serif">Track your active inquiries and return requests.</p>
           </div>
           
           <Link to="/contact" className="premium-button bg-gold text-cream px-10 shadow-lg">Submit New Inquiry</Link>
        </header>

        {loading ? (
            <div className="h-96 bg-beige/40 animate-pulse rounded-[4rem]" />
        ) : tickets.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-[4rem] border-white/40">
                <p className="text-wood/30 italic font-serif text-xl">No active inquiries found in your registry.</p>
            </div>
        ) : (
            <div className="grid gap-6">
                {tickets.map((t) => (
                    <Link 
                        key={t.id} 
                        to={`/support/${t.id}`}
                        className="glass-panel p-10 rounded-[3rem] border-white/40 hover:border-gold/30 hover:shadow-premium transition-all group flex justify-between items-center"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest ${t.status === 'resolved' ? 'bg-olive/10 text-olive' : 'bg-gold/10 text-gold'}`}>{t.status}</span>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-wood/30 italic">#{t.id.toString().padStart(5, '0')}</span>
                            </div>
                            <h3 className="font-heading text-2xl text-wood font-bold group-hover:text-gold transition-colors">{t.subject}</h3>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-wood/40">Last entry: {new Date(t.updated_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-wood/30 group-hover:text-gold transition-all">Inspect</span>
                            <svg className="w-5 h-5 text-wood/20 group-hover:text-gold group-hover:translate-x-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </Link>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
