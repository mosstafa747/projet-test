import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

const tabs = [
  { id: 'products', label: 'Inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { id: 'categories', label: 'Collections', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { id: 'orders', label: 'Acquisitions', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { id: 'custom-requests', label: 'Bespoke Jobs', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { id: 'reviews', label: 'Patron Feedback', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { id: 'coupons', label: 'Registry Keys', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
  { id: 'tickets', label: 'Concierge Tickets', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' },
  { id: 'returns', label: 'Return Requests', icon: 'M16 15v-2a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 9V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-5z' },
];

export default function Admin() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [refundModal, setRefundModal] = useState({ open: false, reason: '', amount: '' });
  const formatPrice = useCurrencyStore((s) => s.formatPrice);

  useEffect(() => {
    if (!user?.is_admin) return;
    setLoading(true);
    const promises = [
      api.get('/admin/products').then((r) => setProducts(r.data.data || r.data)),
      api.get('/categories').then((r) => setCategories(r.data.data || r.data)),
      api.get('/admin/orders').then((r) => setOrders(r.data.data || r.data)),
      api.get('/admin/custom-requests').then((r) => setRequests(r.data.data || r.data)),
      api.get('/admin/reviews').then((r) => setReviews(r.data.data || r.data)),
      api.get('/admin/coupons').then((r) => setCoupons(r.data.data || r.data)),
      api.get('/admin/tickets').then((r) => setTickets(r.data.data || r.data)),
      api.get('/admin/returns').then((r) => setReturns(r.data.data || r.data)),
    ];
    Promise.all(promises).finally(() => setLoading(false));
  }, [user?.is_admin, tab]);

  const handleReviewAction = async (id, approved) => {
    try {
      await api.put(`/admin/reviews/${id}`, { approved });
      setReviews(reviews.map(r => r.id === id ? { ...r, approved } : r));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOrderAction = async (id, action, body = {}) => {
    try {
      const { data } = await api.post(`/admin/orders/${id}/${action}`, body);
      setOrders(orders.map(o => o.id === id ? data : o));
      if (selectedOrder?.id === id) setSelectedOrder(data);
      if (action === 'refund') setRefundModal({ open: false, reason: '', amount: '' });
    } catch (e) {
      alert(e.response?.data?.message || 'Action failed');
    }
  };

  const handleTicketAction = async (id, status) => {
    try {
        const { data } = await api.put(`/admin/tickets/${id}`, { status });
        setTickets(tickets.map(t => t.id === id ? { ...t, status: data.status } : t));
        if (selectedTicket?.id === id) setSelectedTicket({ ...selectedTicket, status: data.status });
    } catch (e) {
        console.error(e);
    }
  };

  const handleTicketReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    try {
        const { data } = await api.post(`/admin/tickets/${selectedTicket.id}/messages`, { message: replyMessage });
        const updatedTicket = { ...selectedTicket, messages: [...selectedTicket.messages, data] };
        setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
        setSelectedTicket(updatedTicket);
        setReplyMessage('');
    } catch (e) {
        console.error(e);
    }
  };

  const handleReturnAction = async (id, status) => {
    try {
        const { data } = await api.put(`/admin/returns/${id}`, { status });
        setReturns(returns.map(r => r.id === id ? { ...r, status: data.status } : r));
    } catch (e) {
        console.error(e);
    }
  };

  const deleteReview = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      setReviews(reviews.filter(r => r.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  if (!user?.is_admin) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="glass-panel p-12 rounded-[3rem] shadow-premium text-center border-white/60">
          <p className="text-wood/40 italic font-serif mb-6">Unauthorized Access to the Master Atelier.</p>
          <Link to="/" className="premium-button bg-wood text-cream inline-block">Return Home</Link>
        </div>
      </div>
    );
  }

  const productList = Array.isArray(products) ? products : products?.data || [];
  const categoryList = Array.isArray(categories) ? categories : categories?.data || [];
  const orderList = Array.isArray(orders) ? orders : orders?.data || [];
  const requestList = Array.isArray(requests) ? requests : requests?.data || [];
  const reviewList = Array.isArray(reviews) ? reviews : reviews?.data || [];
  const couponList = Array.isArray(coupons) ? coupons : coupons?.data || [];

  return (
    <div className="bg-[#FBF9F6] min-h-screen">
      {/* Sidebar / Top Nav Container */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
           <div className="space-y-4">
              <span className="text-gold font-bold uppercase tracking-[0.4em] text-[10px] block">Command Center</span>
              <h1 className="font-heading text-5xl text-wood font-bold">Master Atelier</h1>
              <p className="text-wood/40 italic font-serif">Overseeing the legacy of Moroccan craftsmanship.</p>
           </div>
           
           <div className="flex gap-4">
              <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-4 border-white/40">
                 <div className="w-2 h-2 rounded-full bg-olive animate-pulse" />
                 <span className="text-[10px] uppercase font-bold tracking-widest text-wood/60">System Operational</span>
              </div>
           </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-12 p-2 bg-beige/30 rounded-[2.5rem] border border-wood/5 sticky top-8 z-20 backdrop-blur-xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-[2rem] transition-all duration-500 font-bold uppercase tracking-widest text-[10px] ${tab === t.id ? 'bg-wood text-cream shadow-xl' : 'text-wood/40 hover:text-wood hover:bg-white/40'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={t.icon} />
              </svg>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
               key="loading"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="h-96 bg-beige/20 animate-pulse rounded-[4rem] border border-wood/5" 
            />
          ) : (
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-8 md:p-12 rounded-[4rem] shadow-premium-soft border-white/60"
            >
              {tab === 'products' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                     <h2 className="font-heading text-3xl text-wood font-bold">Inventory Registry</h2>
                     <Link to="/admin/products/new" className="bg-gold/10 text-gold hover:bg-gold hover:text-cream px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm">
                        Curate New Piece
                     </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] uppercase font-bold tracking-[0.2em] text-wood/30 border-b border-wood/5">
                          <th className="py-6 px-4">Artisan Piece</th>
                          <th className="py-6 px-4">Valuation</th>
                          <th className="py-6 px-4">Collection</th>
                          <th className="py-6 px-4">Inventory</th>
                          <th className="py-6 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productList.map((p) => (
                          <tr key={p.id} className="border-b border-wood/5 hover:bg-white/40 transition-colors group">
                            <td className="py-6 px-4">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-beige rounded-xl overflow-hidden shadow-inner grayscale group-hover:grayscale-0 transition-all duration-700">
                                     <img src={p.image || 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80'} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <span className="font-heading text-lg text-wood font-bold">{p.name}</span>
                               </div>
                            </td>
                            <td className="py-6 px-4 text-gold font-bold">{formatPrice(p.price)}</td>
                            <td className="py-6 px-4 text-wood/60 text-sm font-serif italic">{p.category}</td>
                            <td className="py-6 px-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${p.stock < (p.low_stock_threshold || 5) ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-olive/10 text-olive border border-olive/20'}`}>
                                {p.stock} units
                              </span>
                            </td>
                            <td className="py-6 px-4 text-right">
                              <Link to={`/admin/products/${p.id}`} className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-wood border-b border-gold/20 hover:border-wood transition-all pb-1">Refine</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === 'categories' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                     <h2 className="font-heading text-3xl text-wood font-bold">Collection Registry</h2>
                     <Link to="/admin/categories/new" className="bg-gold/10 text-gold hover:bg-gold hover:text-cream px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm">
                        Define Collection
                     </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] uppercase font-bold tracking-[0.2em] text-wood/30 border-b border-wood/5">
                          <th className="py-6 px-4">Collection Title</th>
                          <th className="py-6 px-4">Identifier</th>
                          <th className="py-6 px-4">Narrative</th>
                          <th className="py-6 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryList.map((c) => (
                          <tr key={c.id} className="border-b border-wood/5 hover:bg-white/40 transition-colors">
                            <td className="py-6 px-4 font-heading text-lg text-wood font-bold">{c.name}</td>
                            <td className="py-6 px-4 font-mono text-[10px] text-wood/40 uppercase tracking-widest">{c.slug}</td>
                            <td className="py-6 px-4 text-wood/60 text-sm font-serif italic truncate max-w-xs">{c.description}</td>
                            <td className="py-6 px-4 text-right">
                              <Link to={`/admin/categories/${c.id}`} className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-wood transition-all">Edit</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === 'orders' && (
                <div className="space-y-8">
                  <h2 className="font-heading text-3xl text-wood font-bold">Acquisition Ledger</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] uppercase font-bold tracking-[0.2em] text-wood/30 border-b border-wood/5">
                          <th className="py-6 px-4">Registry #</th>
                          <th className="py-6 px-4">Total Valuation</th>
                          <th className="py-6 px-4">Artisan Stage</th>
                          <th className="py-6 px-4">Logged Date</th>
                          <th className="py-6 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderList.map((o) => (
                          <tr key={o.id} className="border-b border-wood/5 hover:bg-white/40 transition-colors">
                            <td className="py-6 px-4 font-heading text-lg text-wood font-bold">#{o.order_number}</td>
                            <td className="py-6 px-4 text-gold font-bold">{formatPrice(o.total_price)}</td>
                            <td className="py-6 px-4">
                               <div className="flex items-center gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full ${o.status === 'delivered' ? 'bg-olive' : 'bg-gold animate-pulse'}`} />
                                  <span className={`text-[10px] uppercase font-bold tracking-widest ${o.status === 'delivered' ? 'text-olive' : 'text-gold'}`}>{o.status}</span>
                               </div>
                            </td>
                            <td className="py-6 px-4 text-wood/40 text-[10px] uppercase tracking-widest font-bold">{new Date(o.created_at).toLocaleDateString()}</td>
                            <td className="py-6 px-4 text-right">
                               <button onClick={() => setSelectedOrder(o)} className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-wood transition-all">Inspect</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === 'custom-requests' && (
                <div className="space-y-8">
                  <h2 className="font-heading text-3xl text-wood font-bold">Bespoke Commissions</h2>
                  <div className="grid gap-6">
                    {requestList.map((r, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={r.id} 
                        className="bg-white/40 p-8 rounded-[2.5rem] border border-white/60 hover:border-gold/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-sm"
                      >
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-4">
                             <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-gold/5 px-4 py-1.5 rounded-full border border-gold/10">{r.furniture_type}</span>
                             <span className="text-[10px] uppercase font-bold tracking-widest text-wood/30">Budget: {r.budget}</span>
                          </div>
                          <h3 className="font-heading text-2xl text-wood font-bold">{r.name}</h3>
                          <p className="text-sm text-wood/60 font-serif italic max-w-2xl leading-relaxed">"{r.description}"</p>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-wood/30">{r.email}</p>
                        </div>
                        <div className="text-right">
                           <span className="px-6 py-2 bg-beige rounded-full text-[10px] uppercase font-bold tracking-[0.2em] text-wood/60">{r.status}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'reviews' && (
                <div className="space-y-8">
                  <h2 className="font-heading text-3xl text-wood font-bold">Patron Testimonials</h2>
                  <div className="grid gap-6">
                    {reviewList.map((r, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        key={r.id} 
                        className="bg-white/40 p-8 rounded-[2.5rem] border border-white/60 hover:border-gold/30 transition-all flex justify-between items-start gap-8 shadow-sm"
                      >
                        <div className="flex-1 space-y-4">
                           <div className="flex items-center gap-6">
                              <div className="flex text-gold">
                                 {[...Array(5)].map((_, i) => (
                                   <svg key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-wood/10'}`} viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                                 ))}
                              </div>
                              <span className="text-[10px] uppercase font-bold tracking-widest text-wood/30 border-l border-wood/10 pl-6">For {r.product?.name}</span>
                           </div>
                           <p className="text-lg text-wood font-bold leading-tight font-heading">"{r.comment}"</p>
                           <p className="text-[10px] uppercase font-bold tracking-widest text-gold italic">By {r.user?.name}</p>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-widest ${r.approved ? 'bg-olive/10 text-olive border border-olive/20' : 'bg-gold/10 text-gold border border-gold/20'}`}>
                             {r.approved ? 'Curated' : 'Pending Review'}
                           </span>
                           <div className="flex gap-4 pt-2">
                             {!r.approved ? (
                               <button onClick={() => handleReviewAction(r.id, true)} className="text-[10px] uppercase font-bold tracking-widest text-olive hover:text-wood transition-colors">Approve</button>
                             ) : (
                               <button onClick={() => handleReviewAction(r.id, false)} className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-wood transition-colors">Reject</button>
                             )}
                             <button onClick={() => deleteReview(r.id)} className="text-[10px] uppercase font-bold tracking-widest text-red-400 hover:text-red-600 transition-colors">Delete</button>
                           </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'coupons' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                     <h2 className="font-heading text-3xl text-wood font-bold">Registry Keys</h2>
                     <Link to="/admin/coupons/new" className="bg-gold/10 text-gold hover:bg-gold hover:text-cream px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm">
                        Forge New Key
                     </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] uppercase font-bold tracking-[0.2em] text-wood/30 border-b border-wood/5">
                          <th className="py-6 px-4">Secret Code</th>
                          <th className="py-6 px-4">Heritage Class</th>
                          <th className="py-6 px-4">Valuation</th>
                          <th className="py-6 px-4">Expiration</th>
                          <th className="py-6 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {couponList.map((c) => (
                          <tr key={c.id} className="border-b border-wood/5 hover:bg-white/40 transition-colors">
                            <td className="py-6 px-4 font-mono text-lg text-wood font-bold uppercase tracking-widest">{c.code}</td>
                            <td className="py-6 px-4 text-wood/60 text-[10px] uppercase font-bold tracking-widest italic">{c.type.replace('_', ' ')}</td>
                            <td className="py-6 px-4 text-gold font-bold">{c.type === 'percentage' ? `${c.value}%` : formatPrice(c.value)}</td>
                            <td className="py-6 px-4 text-wood/40 text-[10px] uppercase tracking-widest font-bold">{c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : 'Infinite'}</td>
                            <td className="py-6 px-4 text-right">
                              <Link to={`/admin/coupons/${c.id}`} className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-wood transition-all">Refine</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === 'tickets' && (
                <div className="space-y-8">
                  <h2 className="font-heading text-3xl text-wood font-bold">Concierge Registry</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] uppercase font-bold tracking-[0.2em] text-wood/30 border-b border-wood/5">
                          <th className="py-6 px-4">Patron</th>
                          <th className="py-6 px-4">Subject</th>
                          <th className="py-6 px-4">Priority</th>
                          <th className="py-6 px-4">Status</th>
                          <th className="py-6 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((t) => (
                          <tr key={t.id} className="border-b border-wood/5 hover:bg-white/40 transition-colors">
                            <td className="py-6 px-4 font-heading text-lg text-wood font-bold">{t.user?.name}</td>
                            <td className="py-6 px-4 text-wood/60 text-sm font-serif italic truncate max-w-xs">{t.subject}</td>
                            <td className="py-6 px-4 font-mono text-[10px] uppercase tracking-widest">{t.priority}</td>
                            <td className="py-6 px-4">
                               <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest ${t.status === 'resolved' ? 'bg-olive/10 text-olive' : 'bg-gold/10 text-gold'}`}>{t.status}</span>
                            </td>
                            <td className="py-6 px-4 text-right">
                               <button onClick={() => setSelectedTicket(t)} className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-wood transition-all">Inspect</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === 'returns' && (
                <div className="space-y-8">
                  <h2 className="font-heading text-3xl text-wood font-bold">Return Registry</h2>
                  <div className="grid gap-6">
                    {returns.map((r) => (
                      <div key={r.id} className="bg-white/40 p-10 rounded-[3rem] border border-white/60 hover:border-gold/30 transition-all flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
                        <div className="space-y-4">
                           <div className="flex items-center gap-4">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-gold">Order #{r.order?.order_number}</span>
                              <span className="text-[10px] uppercase font-bold tracking-widest text-wood/30 italic">#{r.id.toString().padStart(5, '0')}</span>
                           </div>
                           <h3 className="font-heading text-2xl text-wood font-bold">Patron: {r.order?.user?.name}</h3>
                           <p className="text-sm text-wood/60 font-serif italic max-w-2xl leading-relaxed">"{r.reason}"</p>
                        </div>
                        <div className="flex flex-col items-end gap-4 min-w-[200px]">
                           <span className={`px-6 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest ${r.status === 'approved' ? 'bg-olive/10 text-olive' : r.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-gold/10 text-gold'}`}>{r.status}</span>
                           {r.status === 'pending' && (
                              <div className="flex gap-4 pt-2">
                                 <button onClick={() => handleReturnAction(r.id, 'approved')} className="text-[10px] uppercase font-bold tracking-widest text-olive hover:scale-105 transition-transform">Approve</button>
                                 <button onClick={() => handleReturnAction(r.id, 'rejected')} className="text-[10px] uppercase font-bold tracking-widest text-red-400 hover:scale-105 transition-transform">Reject</button>
                              </div>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-20 pt-12 border-t border-wood/5 text-center">
            <p className="text-wood/20 text-[9px] uppercase tracking-[0.4em] font-bold italic">Preserving Moroccan Excellence · Secure Master Atelier Dashboard</p>
        </footer>
        <AnimatePresence>
          {selectedTicket && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center px-6">
              <div className="absolute inset-0 bg-wood/40 backdrop-blur-md" onClick={() => setSelectedTicket(null)} />
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] p-12 relative shadow-2xl border-white/60">
                <button onClick={() => setSelectedTicket(null)} className="absolute top-8 right-8 text-wood/40 hover:text-wood transition">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <header className="mb-12 space-y-4">
                   <div className="flex items-center gap-6">
                      <span className={`px-6 py-2 rounded-full border border-gold/20 text-gold bg-gold/5 text-[10px] uppercase font-bold tracking-widest`}>{selectedTicket.status}</span>
                      <span className="text-wood/30 font-bold tracking-[0.3em] text-[11px] uppercase italic">Inquiry Authentic</span>
                   </div>
                   <h3 className="font-heading text-4xl text-wood font-bold">{selectedTicket.subject}</h3>
                   <div className="flex gap-4">
                      {['open', 'in_progress', 'resolved', 'closed'].map(s => (
                         <button key={s} onClick={() => handleTicketAction(selectedTicket.id, s)} className={`text-[9px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full transition-all ${selectedTicket.status === s ? 'bg-wood text-cream' : 'border border-wood/10 text-wood/40 hover:text-wood'}`}>{s}</button>
                      ))}
                   </div>
                </header>

                <div className="space-y-8 mb-16 max-h-96 overflow-y-auto pr-4 custom-scrollbar">
                   {selectedTicket.messages?.map((m) => (
                      <div key={m.id} className={`flex ${m.user_id === user.id ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[80%] p-6 rounded-[2rem] ${m.user_id === user.id ? 'bg-wood text-cream' : 'bg-beige/40 text-wood'} shadow-sm`}>
                            <p className="font-serif italic text-lg leading-relaxed">{m.message}</p>
                            <span className="text-[9px] uppercase font-bold tracking-widest opacity-40 block mt-4">{new Date(m.created_at).toLocaleString()}</span>
                         </div>
                      </div>
                   ))}
                </div>

                <form onSubmit={handleTicketReply} className="space-y-4 pt-8 border-t border-wood/5">
                   <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} className="premium-input bg-white/40 w-full h-32 pt-6 rounded-3xl" placeholder="Compose your response to the patron..." required />
                   <button type="submit" className="premium-button bg-gold text-cream w-full py-4 tracking-[0.2em]">Transmit Response</button>
                </form>
              </motion.div>
            </motion.div>
          )}

          {selectedOrder && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center px-6"
            >
              <div className="absolute inset-0 bg-wood/40 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] p-12 relative shadow-2xl border-white/60"
              >
                <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 text-wood/40 hover:text-wood transition">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <header className="mb-12 space-y-2">
                   <span className="text-gold font-bold uppercase tracking-[0.3em] text-[10px]">Acquisition Inspection</span>
                   <h3 className="font-heading text-4xl text-wood font-bold">#{selectedOrder.order_number}</h3>
                   <div className="flex gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest ${selectedOrder.status === 'delivered' ? 'bg-olive/10 text-olive' : 'bg-gold/10 text-gold'}`}>Status: {selectedOrder.status}</span>
                      {selectedOrder.confirmed_at && <span className="bg-blue-50 text-blue-500 border border-blue-100 px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest">Confirmed {new Date(selectedOrder.confirmed_at).toLocaleDateString()}</span>}
                   </div>
                </header>

                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <section>
                         <h4 className="text-[10px] uppercase font-bold tracking-widest text-wood/30 mb-4">Registry Details</h4>
                         <div className="space-y-2 text-sm text-wood">
                            <p className="font-bold">{selectedOrder.shipping_name}</p>
                            <p>{selectedOrder.shipping_address}, {selectedOrder.shipping_city}, {selectedOrder.shipping_country}</p>
                            <p className="font-mono text-xs text-wood/60">{selectedOrder.shipping_phone}</p>
                         </div>
                      </section>

                      <section>
                        <h4 className="text-[10px] uppercase font-bold tracking-widest text-wood/30 mb-4">Master Ledger</h4>
                        <div className="space-y-3 bg-white/40 p-6 rounded-3xl border border-white/60">
                           <div className="flex justify-between text-xs">
                              <span className="text-wood/40 font-bold uppercase tracking-widest">Boutique Total</span>
                              <span className="font-bold text-wood">{formatPrice(selectedOrder.subtotal)}</span>
                           </div>
                           <div className="flex justify-between text-xs">
                              <span className="text-wood/40 font-bold uppercase tracking-widest">Shipping</span>
                              <span className="font-bold text-wood">{formatPrice(selectedOrder.shipping_cost)}</span>
                           </div>
                           {selectedOrder.discount_amount > 0 && (
                              <div className="flex justify-between text-xs text-red-500">
                                 <span className="font-bold uppercase tracking-widest">Registry Key Applied</span>
                                 <span className="font-bold">-{formatPrice(selectedOrder.discount_amount)}</span>
                              </div>
                           )}
                           <div className="pt-3 border-t border-wood/10 flex justify-between">
                              <span className="font-heading text-lg text-wood font-bold">Total Valuation</span>
                              <span className="text-2xl text-gold font-bold">{formatPrice(selectedOrder.total_price)}</span>
                           </div>
                        </div>
                      </section>
                   </div>

                   <div className="space-y-8">
                      <section>
                         <h4 className="text-[10px] uppercase font-bold tracking-widest text-wood/30 mb-4">Master Actions</h4>
                         <div className="grid gap-3">
                            {selectedOrder.status === 'pending' && (
                               <button onClick={() => handleOrderAction(selectedOrder.id, 'confirm')} className="premium-button bg-olive text-cream w-full shadow-lg">Confirm Acquisition</button>
                            )}
                            {!['delivered', 'cancelled', 'returned'].includes(selectedOrder.status) && (
                               <button onClick={() => handleOrderAction(selectedOrder.id, 'cancel')} className="premium-button bg-red-500 text-cream w-full shadow-lg">Invalidate Order</button>
                            )}
                            {selectedOrder.status === 'delivered' && !selectedOrder.refund_status && (
                               <button onClick={() => setRefundModal({ ...refundModal, open: true, amount: selectedOrder.total_price })} className="premium-button bg-gold text-cream w-full shadow-lg">Issue Refund</button>
                            )}
                         </div>
                      </section>

                      {refundModal.open && (
                         <section className="bg-beige/30 p-8 rounded-[2.5rem] border border-gold/20 space-y-6">
                            <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold">Refund Authorization</h4>
                            <div className="space-y-4">
                               <div className="space-y-2">
                                  <label className="text-[9px] uppercase font-bold tracking-widest text-wood/40 ml-2">Valuation to Refund</label>
                                  <input 
                                     type="number" 
                                     value={refundModal.amount} 
                                     onChange={(e) => setRefundModal({...refundModal, amount: e.target.value})}
                                     className="premium-input bg-white w-full"
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[9px] uppercase font-bold tracking-widest text-wood/40 ml-2">Authorization Narrative</label>
                                  <textarea 
                                     value={refundModal.reason} 
                                     onChange={(e) => setRefundModal({...refundModal, reason: e.target.value})}
                                     className="premium-input bg-white w-full h-24 pt-4"
                                     placeholder="Reason for refund..."
                                  />
                               </div>
                               <div className="flex gap-4 pt-2">
                                  <button onClick={() => setRefundModal({...refundModal, open: false})} className="flex-1 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest text-wood/40 border border-wood/10 hover:bg-wood/5 transition">Cancel</button>
                                  <button onClick={() => handleOrderAction(selectedOrder.id, 'refund', { amount: refundModal.amount, reason: refundModal.reason })} className="flex-1 premium-button bg-gold text-cream">Authorize</button>
                               </div>
                            </div>
                         </section>
                      )}

                      {selectedOrder.refund_status === 'processed' && (
                         <div className="bg-green-50 p-6 rounded-3xl border border-green-100 space-y-2">
                            <p className="text-[10px] uppercase font-bold tracking-widest text-green-600">Refund Processed</p>
                            <p className="text-xl font-bold text-wood">{formatPrice(selectedOrder.refund_amount)}</p>
                            <p className="text-xs text-wood/60 italic font-serif">"{selectedOrder.refund_reason}"</p>
                         </div>
                      )}
                   </div>
                </div>

                <div className="mt-16 pt-8 border-t border-wood/5">
                   <h4 className="text-[10px] uppercase font-bold tracking-widest text-wood/30 mb-8">Items in Collection</h4>
                   <div className="space-y-6">
                      {selectedOrder.items?.map((item) => (
                         <div key={item.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-6">
                               <div className="w-16 h-16 bg-beige rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                                  <img src={item.product?.image || 'https://placehold.co/150'} className="w-full h-full object-cover" />
                               </div>
                               <div>
                                  <p className="font-heading text-lg text-wood font-bold">{item.product?.name}</p>
                                  <p className="text-xs text-wood/40 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                               </div>
                            </div>
                            <p className="text-gold font-bold">{formatPrice(item.unit_price)}</p>
                         </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
