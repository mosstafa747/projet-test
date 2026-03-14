import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';

export default function TicketDetail() {
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchTicket = async () => {
        try {
            const r = await api.get(`/tickets/${id}`);
            setTicket(r.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchTicket();
  }, [user, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
        const { data } = await api.post(`/tickets/${id}/messages`, { message });
        setTicket({ ...ticket, messages: [...ticket.messages, data] });
        setMessage('');
    } catch (e) {
        alert('Failed to send message');
    }
  };

  if (!user || loading || !ticket) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-40">
         <div className="h-96 bg-beige/40 animate-pulse rounded-[4rem]" />
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pb-40">
       <nav className="max-w-7xl mx-auto px-6 pt-12 flex gap-2 text-[10px] uppercase tracking-widest text-wood/40 font-bold mb-20">
        <Link to="/" className="hover:text-gold transition">Home</Link>
        <span>/</span>
        <Link to="/support" className="hover:text-gold transition">Concierge Inquiries</Link>
        <span>/</span>
        <span className="text-gold">#{ticket.id.toString().padStart(5, '0')}</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-20 space-y-4">
           <div className="flex items-center gap-6">
              <span className={`px-6 py-2 rounded-full border ${ticket.status === 'resolved' ? 'border-olive/20 text-olive bg-olive/5' : 'border-gold/20 text-gold bg-gold/5'} text-[10px] uppercase font-bold tracking-widest`}>{ticket.status}</span>
              <span className="text-wood/30 font-bold tracking-[0.3em] text-[11px] uppercase italic">Inquiry Authentic</span>
           </div>
           <h1 className="font-heading text-5xl text-wood font-bold">{ticket.subject}</h1>
           {ticket.order && (
              <Link to={`/orders/${ticket.order.id}`} className="inline-block text-[10px] uppercase font-bold tracking-widest text-gold hover:text-wood transition-all border-b border-gold/20 pb-1">Related to Order #{ticket.order.order_number}</Link>
           )}
        </header>

        <div className="space-y-10 mb-20">
           {ticket.messages.map((m) => (
              <div key={m.id} className={`flex ${m.user_id === user.id ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] p-8 rounded-[2.5rem] ${m.user_id === user.id ? 'bg-wood text-cream rounded-tr-none' : 'glass-panel border-white/60 text-wood rounded-tl-none'} shadow-sm`}>
                    <div className="flex justify-between items-center mb-4 gap-8">
                       <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">{m.user?.name || (m.user_id === user.id ? 'You' : 'Concierge')}</span>
                       <span className="text-[9px] uppercase font-bold tracking-widest opacity-40 italic">{new Date(m.created_at).toLocaleString()}</span>
                    </div>
                    <p className="leading-relaxed font-serif italic text-lg">{m.message}</p>
                 </div>
              </div>
           ))}
        </div>

        <div className="glass-panel p-10 rounded-[4rem] border-white/40 shadow-premium">
           <h2 className="font-heading text-2xl text-wood font-bold mb-8">Extend the Discussion</h2>
           <form onSubmit={handleSubmit} className="space-y-6">
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="premium-input bg-white/20 w-full rounded-[2rem] h-40 pt-6"
                placeholder="Share your thoughts with our concierge..."
                required
              />
              <button disabled={ticket.status === 'closed'} className="premium-button bg-wood text-cream w-full py-5 font-bold uppercase tracking-widest shadow-xl disabled:bg-wood/20">Send Response</button>
           </form>
        </div>
      </div>
    </div>
  );
}
