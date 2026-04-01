import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function DriverPortal() {
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // active or history
  
  // Modals state
  const [confirmModalData, setConfirmModalData] = useState(null); // { order, type: 'deliver' | 'fail' }
  const [paymentReceived, setPaymentReceived] = useState(true);
  const [actionComment, setActionComment] = useState('');

  const user = useAuthStore(s => s.user);
  const formatPrice = useCurrencyStore(s => s.formatPrice);

  const fetchOrders = async () => {
    try {
      const { data: active } = await api.get('/driver/orders');
      const { data: past } = await api.get('/driver/history');
      setOrders(active);
      setHistory(past);
    } catch (err) {
      console.error('Failed to fetch driver orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleStateChange = async (orderId, newStatus) => {
    try {
      await api.post(`/driver/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert('Action failed. Please try again.');
    }
  };

  const submitFinalAction = async () => {
    if (!confirmModalData) return;
    const { order, type } = confirmModalData;
    
    try {
      const payload = {
         status: type === 'deliver' ? 'delivered' : 'refused',
         failed_reason: type === 'fail' ? actionComment : null,
         driver_comment: actionComment,
         payment_received: type === 'deliver' ? paymentReceived : false
      };
      await api.post(`/driver/orders/${order.id}/status`, payload);
      setConfirmModalData(null);
      setActionComment('');
      fetchOrders();
    } catch (err) {
      alert('Submission failed. Check connection.');
    }
  };

  if (!user?.is_driver && !user?.is_admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <h1 className="text-xl font-bold">Access Denied</h1>
      </div>
    );
  }

  // Segment orders
  const newOffers = orders.filter(o => o.status === 'assigned');
  const activeDeliveries = orders.filter(o => ['accepted', 'picked_up', 'shipped', 'on_the_way'].includes(o.status));

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32 md:pb-12 text-gray-900 font-sans">
      {/* Header - Beldi Premium Style */}
      <header className="bg-[#0F0E0C] px-6 py-6 sticky top-0 z-30 shadow-2xl flex items-center justify-between border-b border-gray-800/20">
        <div>
           <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse border-2 border-yellow-200/20"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500/80">Courier Service</p>
           </div>
           <h1 className="text-2xl font-black mt-1 text-white tracking-tight">{user.name}</h1>
        </div>
        <div className="flex items-center gap-4">
           <button 
              onClick={() => { useAuthStore.getState().logout(); window.location.href = '/login'; }}
              className="p-3 bg-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-red-500/20 transition-all border border-white/5"
              title="Logout"
           >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6-10V7a3 3 0 00-6 0v1" /></svg>
           </button>
           <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center shadow-2xl overflow-hidden">
              <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto relative pt-4 px-4 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
           <button onClick={() => setActiveTab('active')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'active' ? 'bg-[#0F0E0C] text-yellow-500 shadow-lg shadow-black/10' : 'text-gray-400'}`}>
              Active Tasks
              {activeDeliveries.length + newOffers.length > 0 && (
                 <span className={`ml-2 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'active' ? 'bg-yellow-500 text-black' : 'bg-gray-100 text-gray-500'}`}>
                    {activeDeliveries.length + newOffers.length}
                 </span>
              )}
           </button>
           <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'history' ? 'bg-[#0F0E0C] text-yellow-500 shadow-lg shadow-black/10' : 'text-gray-400'}`}>
              History ({history.length})
           </button>
        </div>

        {loading ? (
           <div className="space-y-4">
              <div className="h-48 bg-white/50 animate-pulse rounded-3xl" />
              <div className="h-48 bg-white/50 animate-pulse rounded-3xl" />
           </div>
        ) : activeTab === 'active' ? (
           <>
              {/* Active Delivery UI (Glovo Style) */}
              {activeDeliveries.length > 0 && (
                 <div className="space-y-4">
                    <h2 className="px-2 text-sm font-black text-gray-500 uppercase tracking-widest">Active Ride</h2>
                    {activeDeliveries.map(order => (
                       <OrderCard key={order.id} order={order} formatPrice={formatPrice} onStateChange={handleStateChange} onAction={(type) => setConfirmModalData({ order, type })} />
                    ))}
                 </div>
              )}

              {/* New Offers UI */}
              {newOffers.length > 0 && (
                 <div className="space-y-4 mt-8">
                    <h2 className="px-2 text-sm font-black text-gray-500 uppercase tracking-widest">New Dispatch Offers</h2>
                    {newOffers.map(order => (
                       <div key={order.id} className="bg-white rounded-3xl p-5 shadow-sm border-2 border-yellow-400/50 relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-1 text-xs font-bold rounded-bl-2xl uppercase tracking-widest">New Ping</div>
                          
                          <div className="mt-4 mb-4">
                             <p className="text-3xl font-black text-gray-900">{formatPrice(order.total_price)}</p>
                             <p className="text-xs font-bold text-gray-400 uppercase">Est. Payout / Collect</p>
                          </div>
                          
                          <div className="space-y-2 mb-6">
                             <div className="flex gap-3">
                                <div className="mt-1 flex flex-col items-center">
                                   <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                   <div className="w-0.5 h-6 bg-gray-200"></div>
                                   <div className="w-3 h-3 border-2 border-red-500 rounded-full"></div>
                                </div>
                                <div className="space-y-2 text-sm flex-1">
                                   <div>
                                      <p className="font-bold text-gray-900">Warehouse / Store</p>
                                   </div>
                                   <div>
                                      <p className="font-bold text-gray-900">{order.shipping_name}</p>
                                      <p className="text-gray-500 leading-tight">{order.shipping_address}, {order.shipping_city}</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                             <button onClick={() => handleStateChange(order.id, 'rejected')} className="bg-red-50 text-red-600 font-bold py-4 rounded-xl hover:bg-red-100 transition">
                                Decline
                             </button>
                             <button onClick={() => handleStateChange(order.id, 'accepted')} className="bg-yellow-400 text-black font-black py-4 rounded-xl shadow-lg hover:bg-yellow-500 transition">
                                ACCEPT
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              )}

              {activeDeliveries.length === 0 && newOffers.length === 0 && (
                 <div className="py-20 text-center space-y-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto text-gray-400">
                       <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </div>
                    <div>
                       <h3 className="font-bold text-gray-900 text-lg">You're Offline or Idle</h3>
                       <p className="text-sm text-gray-500 px-4 mt-2">No new orders assigned to you right now. Grab a coffee and wait for the next dispatch.</p>
                    </div>
                 </div>
              )}
           </>
        ) : (
           /* History Tab */
           <div className="space-y-4">
              {history.length === 0 ? (
                 <p className="text-center py-10 text-gray-500">No past deliveries.</p>
              ) : (
                 history.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                       <div>
                          <p className="font-bold text-gray-900">#{order.order_number}</p>
                          <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                       </div>
                       <div className="text-right">
                          <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                             {order.status === 'delivered' ? 'Completed' : 'Failed'}
                          </span>
                          <p className="font-black text-gray-900 mt-1">{formatPrice(order.total_price)}</p>
                       </div>
                    </div>
                 ))
              )}
           </div>
        )}
      </main>

      {/* Delivery Confirmation Bottom Sheet / Modal */}
      <AnimatePresence>
         {confirmModalData && (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center sm:p-4"
            >
               <motion.div 
                  initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
               >
                  <div className="flex justify-between items-center bg-white sticky top-0">
                     <h2 className="text-2xl font-black text-gray-900">
                        {confirmModalData.type === 'deliver' ? 'Complete Delivery' : 'Report Failure'}
                     </h2>
                     <button onClick={() => setConfirmModalData(null)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold hover:bg-gray-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
                     </button>
                  </div>

                  {confirmModalData.type === 'deliver' && (
                     <div className="bg-green-50/50 border-2 border-green-500 rounded-2xl p-5">
                        <p className="text-sm font-bold text-green-800 mb-4 uppercase tracking-widest text-center">Cash Collection Required</p>
                        <p className="text-4xl text-center font-black text-gray-900 mb-6">{formatPrice(confirmModalData.order.total_price)}</p>
                        
                        <label className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-green-400">
                           <input 
                              type="checkbox" 
                              className="w-8 h-8 rounded-lg text-green-500 border-gray-300 focus:ring-green-400" 
                              checked={paymentReceived} 
                              onChange={(e) => setPaymentReceived(e.target.checked)}
                           />
                           <div className="flex-1">
                              <span className="font-bold text-gray-900 block">I collected the exact amount</span>
                              <span className="text-xs text-gray-500">Customer paid via cash/terminal</span>
                           </div>
                        </label>
                     </div>
                  )}

                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">
                        {confirmModalData.type === 'deliver' ? 'Delivery Note (Optional)' : 'Reason for Failure (Required)'}
                     </label>
                     <textarea 
                        value={actionComment}
                        onChange={(e) => setActionComment(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                        rows="3"
                        placeholder={confirmModalData.type === 'deliver' ? "Left at door, handed to dog..." : "Customer not home, unreachable, etc..."}
                     />
                  </div>

                  <button 
                     onClick={submitFinalAction}
                     disabled={confirmModalData.type === 'fail' && !actionComment.trim()}
                     className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex justify-center items-center gap-2 ${
                        confirmModalData.type === 'deliver' 
                           ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/30' 
                           : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 disabled:opacity-50'
                     }`}
                  >
                     {confirmModalData.type === 'deliver' ? 'Swipe / Tap to Finish' : 'Confirm Failure'}
                  </button>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

function OrderCard({ order, formatPrice, onStateChange, onAction }) {
   return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative group">
         <div className="bg-[#0F0E0C] text-white p-6 flex justify-between items-center">
            <div>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Reference</p>
               <p className="font-bold font-mono text-lg text-yellow-500">#{order.order_number}</p>
            </div>
            <div className="text-right">
               <p className="font-black text-white text-2xl tracking-tight">{formatPrice(order.total_price)}</p>
               <span className="text-[9px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded font-black uppercase tracking-[0.1em] mt-1 inline-block border border-yellow-500/20">Collect Cash</span>
            </div>
         </div>

         <div className="p-6 space-y-6">
            <div className="flex gap-4 items-center">
               <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100">
                  <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               </div>
               <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Customer</p>
                  <p className="font-black text-gray-900 text-lg leading-tight">{order.shipping_name}</p>
                  <a href={`tel:${order.shipping_phone}`} className="text-yellow-600 font-bold text-sm flex items-center gap-1 mt-1 hover:text-yellow-700 transition-colors">
                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                     {order.shipping_phone}
                  </a>
               </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
               <div className="flex gap-3">
                  <div className="mt-1">
                     <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                     <p className="font-bold text-gray-900 text-sm leading-snug">{order.shipping_address}</p>
                     <p className="text-gray-500 font-bold text-[10px] uppercase tracking-wider mt-1">{order.shipping_city}, {order.shipping_country}</p>
                  </div>
               </div>
               <button 
                  onClick={() => {
                     const addr = `${order.shipping_address}, ${order.shipping_city}, ${order.shipping_country}`;
                     window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`, '_blank');
                  }}
                  className="w-full mt-5 bg-white text-gray-900 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl border border-gray-200 shadow-sm flex justify-center items-center gap-2 hover:bg-gray-50 transition-all active:scale-[0.98]"
               >
                  <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                  Navigate in Maps
               </button>
            </div>

            {/* Action Buttons via State Machine */}
            <div className="pt-2 flex flex-col gap-3">
               {order.status === 'accepted' && (
                  <button onClick={() => onStateChange(order.id, 'picked_up')} className="bg-yellow-500 text-white w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-yellow-500/20 active:scale-[0.98] transition-all">
                     Confirm Pick Up
                  </button>
               )}
               {order.status === 'picked_up' && (
                  <button onClick={() => onStateChange(order.id, 'shipped')} className="bg-[#0F0E0C] text-white w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-black/20 active:scale-[0.98] transition-all">
                     Begin Delivery Route
                  </button>
               )}
               {order.status === 'shipped' && (
                  <>
                     <button onClick={() => onAction('deliver')} className="bg-emerald-500 text-white w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/30 active:scale-[0.98] transition-all">
                        Finalize Delivery
                     </button>
                     <button onClick={() => onAction('fail')} className="bg-gray-50 text-gray-400 w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100">
                        Incident Report
                     </button>
                  </>
               )}
            </div>
         </div>
      </div>
   );
}
