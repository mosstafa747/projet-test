import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function DriverPortal() {
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending or history
  const user = useAuthStore(s => s.user);
  const formatPrice = useCurrencyStore(s => s.formatPrice);

  const fetchOrders = async () => {
    setLoading(true);
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
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    if (!confirm(`Are you sure you want to mark this as ${status}?`)) return;
    try {
      await api.post(`/driver/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (!user?.is_driver && !user?.is_admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-sm">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm">You must be registered as a driver to access this portal.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-24">
      {/* Header */}
      <header className="bg-gray-900 px-6 py-5 sticky top-0 z-30 shadow-md flex items-center justify-between">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Shift</p>
           </div>
           <h1 className="text-xl font-bold text-white">{user.name}</h1>
        </div>
        <div className="w-12 h-12 rounded-full border-2 border-gray-700 bg-gray-800 flex items-center justify-center text-white font-bold shadow-inner">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex p-1.5 bg-gray-200/50 mx-4 mt-6 mb-4 rounded-xl shadow-sm">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Active Routes ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Past Deliveries
        </button>
      </div>

      {/* List */}
      <main className="px-4 space-y-4">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="space-y-4">
               {[1,2,3].map(i => <div key={i} className="h-40 bg-white/50 animate-pulse rounded-2xl" />)}
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {(activeTab === 'pending' ? orders : history).length === 0 && (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <p className="text-gray-400 font-bold text-sm">No orders found</p>
                </div>
              )}

              {(activeTab === 'pending' ? orders : history).map(order => (
                <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
                  {(order.status === 'shipped' || order.status === 'assigned') && (
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-400"></div>
                  )}
                  {order.status === 'delivered' && (
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-400"></div>
                  )}

                  <div className="p-5 border-b border-gray-50 flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">COD Order</span>
                        <p className="text-[10px] text-gray-400 font-bold font-mono">#{order.order_number}</p>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg leading-tight">{order.shipping_name}</h3>
                      <p className="text-xs text-gray-500 font-medium">{order.shipping_phone}</p>
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                      order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                      order.status === 'refused' ? 'bg-red-50 text-red-700' :
                      'bg-orange-50 text-orange-700'
                    }`}>
                      {order.status === 'delivered' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div className="flex gap-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <div className="bg-white p-2 rounded-full shadow-sm h-fit">
                         <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2" strokeLinecap="round" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2" strokeLinecap="round" /></svg>
                      </div>
                      <p className="font-medium pt-1">{order.shipping_address}, {order.shipping_city}</p>
                    </div>

                    <div className="flex justify-between items-center text-sm font-bold bg-green-50/50 p-4 rounded-2xl border border-green-100/50">
                      <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         </div>
                         <span className="text-gray-700">Collect Cash:</span>
                      </div>
                      <span className="text-green-700 text-xl tracking-tight">{formatPrice(order.total_price)}</span>
                    </div>

                    {activeTab === 'pending' && (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {order.status === 'assigned' ? (
                          <button 
                            onClick={() => handleStatusUpdate(order.id, 'shipped')}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 transition-all col-span-2 flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Start Delivery Route
                          </button>
                        ) : (
                          <>
                            <button 
                               onClick={() => handleStatusUpdate(order.id, 'refused')}
                               className="bg-red-50 hover:bg-red-100 text-red-600 py-4 rounded-xl font-bold text-sm transition-all"
                            >
                              Client Refused
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(order.id, 'delivered')}
                              className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-green-500/30 transition-all flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              Mark Delivered
                            </button>
                          </>
                        )}
                        <a 
                          href={`tel:${order.shipping_phone}`}
                          className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-4 font-bold text-sm col-span-2 mt-1 transition-all"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Call Customer
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
