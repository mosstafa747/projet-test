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
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-white">
        <div className="bg-gray-50 p-12 rounded-[40px] shadow-xl shadow-gray-100 text-center border border-gray-100 max-w-md w-full">
          <p className="text-gray-400 font-bold tracking-tight mb-8">Please log in to view your order details.</p>
          <Link to="/login" className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl inline-block hover:bg-gray-800 transition-all">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading || !order) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 bg-white min-h-screen">
         <div className="h-96 bg-gray-50 animate-pulse rounded-[40px] border border-gray-100" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-40">
       {/* Breadcrumbs */}
       <nav className="max-w-7xl mx-auto px-6 pt-12 flex items-center gap-3 text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 mb-16">
        <Link to="/" className="hover:text-black transition">Home</Link>
        <span className="text-gray-200">/</span>
        <Link to="/profile" className="hover:text-black transition">Profile</Link>
        <span className="text-gray-200">/</span>
        <Link to="/orders" className="hover:text-black transition">Orders</Link>
        <span className="text-gray-200">/</span>
        <span className="text-[#E62E04]">Order #{order.order_number}</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-10">
           <div className="space-y-4">
              <span className="text-[#E62E04] font-black uppercase tracking-[0.3em] text-[10px] block">Order Tracking</span>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter">#{order.order_number}</h1>
              <p className="text-gray-400 font-bold tracking-tight">Placed on {new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
           </div>
           
           <div className="flex gap-4">
              <div className={`px-8 py-3 rounded-2xl border-2 font-black uppercase tracking-[0.2em] text-[10px] ${
                order.status === 'delivered' ? 'border-emerald-100 text-emerald-600 bg-emerald-50/50' : 
                order.status === 'processing' ? 'border-amber-100 text-amber-600 bg-amber-50/50' :
                'border-gray-100 text-gray-500 bg-gray-50/50'
              }`}>
                 {order.status === 'processing' ? 'Processing' : order.status}
              </div>
              {order.confirmed_at && (
                 <div className="px-8 py-3 rounded-2xl border-2 border-blue-100 text-blue-600 bg-blue-50/50 font-black uppercase tracking-[0.2em] text-[10px]">
                    Verified
                 </div>
              )}
           </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Main Summary Card */}
          <div className="bg-gray-50 p-10 md:p-14 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden">
             {/* Simple accent */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#E62E04]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
             
             <div className="grid md:grid-cols-2 gap-16 relative">
                {/* Shipping Details */}
                <div className="space-y-8">
                   <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-400 border-b border-gray-200 pb-4">Shipping Destination</h3>
                   <div className="space-y-4">
                      <p className="text-2xl font-black text-gray-900 tracking-tight">{order.shipping_name}</p>
                      <div className="space-y-1 text-gray-500 font-bold tracking-tight">
                         <p>{order.shipping_address}</p>
                         <p>{order.shipping_city}, {order.shipping_country}</p>
                         <p className="pt-2 text-[10px] uppercase tracking-widest text-gray-400">Phone: {order.shipping_phone}</p>
                      </div>
                   </div>
                </div>

                {/* Summary */}
                <div className="space-y-8">
                   <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-400 border-b border-gray-200 pb-4">Order Summary</h3>
                   <div className="space-y-5">
                      <div className="flex justify-between items-center text-sm font-bold">
                         <span className="text-gray-400">Logistics</span>
                         <span className="text-gray-900">Standard Delivery</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-gray-400">Payment</span>
                          <span className="text-gray-900 uppercase tracking-widest text-[10px]">{order.payment_method === 'cash' ? 'Cash on Delivery' : 'Secure Online Payment'}</span>
                       </div>
                       {order.refund_status === 'processed' && (
                          <div className="flex justify-between items-center text-sm text-red-600 bg-red-50 p-3 rounded-2xl border border-red-100">
                             <span>Refunded</span>
                             <span className="font-black">-{formatPrice(order.refund_amount)}</span>
                          </div>
                       )}
                      <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
                         <span className="text-[10px] uppercase font-black tracking-widest text-[#E62E04]">Total Valuation</span>
                         <span className="text-3xl font-black text-gray-900 tracking-tighter">{formatPrice(order.total_price)}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Execution Timeline */}
             <div className="mt-20 space-y-10">
                <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-400 border-b border-gray-200 pb-4">Order Timeline</h3>
                <div className="relative pl-8 space-y-10 border-l-2 border-gray-100 ml-4 pb-4">
                    <div className="relative">
                        <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-black border-4 border-white shadow-sm" />
                        <p className="text-[11px] uppercase font-black tracking-widest text-gray-900">Order Placed</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">{new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                    
                    {order.confirmed_at && (
                        <div className="relative">
                            <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-black border-4 border-white shadow-sm" />
                            <p className="text-[11px] uppercase font-black tracking-widest text-gray-900">Order Confirmed</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">{new Date(order.confirmed_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>
                    )}

                    {order.shipped_at && (
                        <div className="relative">
                            <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-black border-4 border-white shadow-sm" />
                            <p className="text-[11px] uppercase font-black tracking-widest text-gray-900">Dispatched & En Route</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">{new Date(order.shipped_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>
                    )}

                    {order.delivered_at && (
                        <div className="relative">
                            <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                            <p className="text-[11px] uppercase font-black tracking-widest text-emerald-600">Successfully Delivered</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">{new Date(order.delivered_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>
                    )}

                    {order.completed_at && (
                        <div className="relative">
                            <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-gray-900 border-4 border-white shadow-sm" />
                            <p className="text-[11px] uppercase font-black tracking-widest text-gray-900">Order Settled</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">{new Date(order.completed_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>
                    )}
                    
                    {order.cancelled_at && order.failed_reason && (
                        <div className="relative">
                            <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-[#E62E04] border-4 border-white shadow-sm" />
                            <p className="text-[11px] uppercase font-black tracking-widest text-[#E62E04]">Delivery Attempt Failed</p>
                            <p className="text-[10px] text-gray-400 font-black mb-3">{new Date(order.cancelled_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 max-w-sm">
                               <p className="text-sm font-bold text-red-900">{order.failed_reason}</p>
                            </div>
                        </div>
                    )}
                </div>
             </div>

             {/* Items Gallery */}
             <div className="mt-20 space-y-10">
                <h3 className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-400 border-b border-gray-200 pb-4">Purchased Items</h3>
                <ul className="space-y-4">
                   {order.items?.map((item) => (
                     <li key={item.id} className="flex items-center justify-between p-6 bg-white rounded-3xl border-2 border-gray-50 hover:border-[#E62E04]/20 transition-all group">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                             <img 
                               src={item.product?.images?.[0] || item.product?.image || 'https://placehold.co/150'} 
                               alt={item.product?.name} 
                               className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                             />
                          </div>
                          <div>
                             <p className="font-black text-lg text-gray-900 tracking-tight leading-tight">{item.product?.name}</p>
                             <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-1">Quantity: {item.quantity}</p>
                          </div>
                       </div>
                       <p className="text-sm font-black text-gray-900">{formatPrice(Number(item.unit_price) * item.quantity)}</p>
                     </li>
                   ))}
                </ul>
             </div>
          </div>

          <div className="flex flex-col items-center gap-10 pt-16">
             <Link 
                to="/orders" 
                className="text-[11px] uppercase tracking-widest font-black text-gray-400 hover:text-black transition-all flex items-center gap-4 group"
             >
                <svg className="w-4 h-4 transform group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                Back to My Orders
             </Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
