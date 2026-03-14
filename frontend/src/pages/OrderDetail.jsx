import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

export default function OrderDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const { formatPrice, currency } = useCurrencyStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');

  const handleReturnRequest = async () => {
    if (!returnReason.trim()) return;
    try {
        await api.post('/returns', {
            order_id: id,
            reason: returnReason
        });
        setShowReturnModal(false);
        setReturnReason('');
        // Refresh order to show status
        const r = await api.get(`/orders/${id}`);
        setOrder(r.data);
    } catch (e) {
        alert('Failed to submit return request.');
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const fetchOrder = async () => {
        try {
            if (searchParams.get('payment') === 'success') {
                await api.post('/payment/success', { order_id: id });
            }
            const r = await api.get(`/orders/${id}`);
            setOrder(r.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    fetchOrder();
  }, [user, id, searchParams]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-cream">
        <div className="glass-panel p-12 rounded-[3.5rem] shadow-premium text-center border-white/60">
          <p className="text-wood/40 italic font-serif mb-6">Please log in to view this acquisition.</p>
          <Link to="/login" className="premium-button bg-wood text-cream inline-block">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading || !order) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
         <div className="h-96 bg-beige/40 animate-pulse rounded-[4rem]" />
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
        <Link to="/orders" className="hover:text-gold transition">Acquisitions</Link>
        <span>/</span>
        <span className="text-gold">Registry #{order.order_number}</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
           <div className="space-y-4">
              <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px] block">Acquisition Detail</span>
              <h1 className="font-heading text-6xl text-wood font-bold">#{order.order_number}</h1>
              <p className="text-wood/40 italic font-serif">Registry entry from {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
           </div>
           
           <div className="flex gap-4">
              <div className={`px-6 py-2 rounded-full border ${order.status === 'delivered' ? 'border-olive/20 text-olive bg-olive/5' : 'border-gold/20 text-gold bg-gold/5'}`}>
                 <span className="text-[10px] uppercase font-bold tracking-[0.2em]">{order.status === 'processing' ? 'Registry Procuring' : order.status}</span>
              </div>
              {order.confirmed_at && (
                 <div className="px-6 py-2 rounded-full border border-blue-200/40 text-blue-500 bg-blue-50/10">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Authenticity Confirmed</span>
                 </div>
              )}
           </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Main Certificate Card */}
          <div className="glass-panel p-12 md:p-16 rounded-[4rem] shadow-premium border-white/60 relative overflow-hidden">
             {/* Decorative pattern */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
             
             <div className="grid md:grid-cols-2 gap-16 relative">
                {/* Delivery Logistics */}
                <div className="space-y-8">
                   <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-wood/30 border-b border-wood/5 pb-4">Destination</h3>
                   <div className="space-y-4">
                      <p className="font-heading text-2xl text-wood font-bold">{order.shipping_name}</p>
                      <div className="space-y-1 text-wood/60 text-sm font-serif italic">
                         <p>{order.shipping_address}</p>
                         <p>{order.shipping_city}, {order.shipping_country}</p>
                         <p className="pt-2 font-sans font-bold text-[10px] uppercase tracking-widest text-wood/40">Reference: {order.shipping_phone}</p>
                      </div>
                   </div>
                </div>

                {/* Narrative Summary */}
                <div className="space-y-8">
                   <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-wood/30 border-b border-wood/5 pb-4">Acquisition Summary</h3>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                         <span className="text-wood/40 italic font-serif">Logistics</span>
                         <span className="text-wood font-bold">Delivered via Courier</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-wood/40 italic font-serif">Payment Registry</span>
                          <span className="text-wood font-bold uppercase tracking-widest text-[10px]">{order.payment_method === 'cash' ? 'Pay on Delivery' : 'Digital settlement'}</span>
                       </div>
                       {order.refund_status === 'processed' && (
                          <div className="flex justify-between items-center text-sm text-red-500 bg-red-50/50 p-2 rounded-lg">
                             <span className="italic font-serif">Refund Authorized</span>
                             <span className="font-bold">-{formatPrice(order.refund_amount)}</span>
                          </div>
                       )}
                      <div className="pt-4 flex justify-between items-center">
                         <span className="text-[10px] uppercase font-bold tracking-widest text-gold">Total Valuation</span>
                         <span className="text-2xl text-wood font-bold">{formatPrice(order.total_price)}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Pieces Gallery */}
             <div className="mt-20 space-y-8">
                <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-wood/30 border-b border-wood/5 pb-4">Curated Pieces</h3>
                <ul className="space-y-6">
                   {order.items?.map((item) => (
                     <li key={item.id} className="flex items-center justify-between p-6 bg-white/40 rounded-3xl border border-white/60 hover:border-gold/20 transition-all group">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-beige rounded-2xl overflow-hidden shadow-inner">
                             <img 
                               src={item.product?.images?.[0] || item.product?.image || 'https://placehold.co/150'} 
                               alt={item.product?.name} 
                               className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                             />
                          </div>
                          <div>
                             <p className="font-heading text-lg text-wood font-bold">{item.product?.name}</p>
                             <p className="text-[10px] uppercase font-bold tracking-widest text-wood/30">Quantity: {item.quantity}</p>
                          </div>
                       </div>
                       <p className="text-sm text-gold font-bold">{formatPrice(Number(item.unit_price) * item.quantity)}</p>
                     </li>
                   ))}
                </ul>
             </div>
          </div>

          <div className="flex flex-col items-center gap-8 pt-8">
             {order.status === 'delivered' && !order.return_requests?.length && (
                <button 
                  onClick={() => setShowReturnModal(true)}
                  className="premium-button bg-gold text-white px-12"
                >
                  Initiate Return Request
                </button>
             )}
             
             <Link 
                to="/orders" 
                className="text-[11px] uppercase tracking-widest font-bold text-wood/40 hover:text-gold transition-all flex items-center gap-4 group"
             >
                <svg className="w-4 h-4 transform group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Return to Gallery
             </Link>
          </div>
        </motion.div>
      </div>

      {/* Return Request Modal */}
      <AnimatePresence>
        {showReturnModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-wood/40 backdrop-blur-sm"
              onClick={() => setShowReturnModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel p-12 rounded-[4rem] max-w-lg w-full relative z-[101] border-white/60 shadow-premium"
            >
              <h2 className="font-heading text-3xl text-wood font-bold mb-6">Initiate Return</h2>
              <p className="text-wood/60 italic font-serif mb-8">Please provide the essence of your reason for this return request.</p>
              
              <div className="space-y-6">
                <textarea 
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="premium-input bg-white/20 w-full h-32 rounded-3xl"
                  placeholder="Reason for return..."
                />
                <button 
                  onClick={handleReturnRequest}
                  className="premium-button bg-wood text-cream w-full py-5"
                >
                  Submit Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
