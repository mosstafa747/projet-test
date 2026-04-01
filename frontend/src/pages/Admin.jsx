import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

const sidebarMenus = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { id: 'orders', label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { id: 'custom-requests', label: 'Custom Requests', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { id: 'products', label: 'Inventory', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { id: 'categories', label: 'Categories', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { id: 'reviews', label: 'Reviews', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { id: 'coupons', label: 'Coupons', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
  { id: 'drivers', label: 'Logistics', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { id: 'users', label: 'Customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
];

export default function Admin() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // User Filter State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatPrice = useCurrencyStore((s) => s.formatPrice);

  useEffect(() => {
    if (!user?.is_admin) return;
    setLoading(true);
    Promise.all([
      api.get('/admin/products').then((r) => setProducts(r.data.data || r.data)),
      api.get('/categories').then((r) => setCategories(r.data.data || r.data)),
      api.get('/admin/orders').then((r) => setOrders(r.data.data || r.data)),
      api.get('/admin/custom-requests').then((r) => setRequests(r.data.data || r.data)),
      api.get('/admin/reviews').then((r) => setReviews(r.data.data || r.data)),
      api.get('/admin/coupons').then((r) => setCoupons(r.data.data || r.data)),
      api.get('/admin/dispatch/drivers/stats').then((r) => setDrivers(r.data.data || r.data)),
      api.get('/admin/users').then((r) => setUsers(r.data.data || r.data)),
    ]).finally(() => setLoading(false));
  }, [user?.is_admin]);

  const handleOrderAction = async (id, action) => {
    try {
      const { data } = await api.post(`/admin/orders/${id}/${action}`);
      setOrders(orders.map(o => o.id === id ? { ...o, ...data } : o));
      if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, ...data });
    } catch (e) { 
      alert(e.response?.data?.message || `Action '${action}' failed`); 
    }
  };

  const handleStartDelivery = async (id) => {
    try {
      const { data } = await api.post(`/admin/dispatch/orders/${id}/start-delivery`);
      setOrders(orders.map(o => o.id === id ? { ...o, ...data } : o));
      if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, ...data });
    } catch (e) { alert('Failed to start delivery'); }
  };

  const handleRequestStatus = async (id, newStatus) => {
    try {
      const { data } = await api.put(`/admin/custom-requests/${id}`, { status: newStatus });
      setRequests(requests.map(r => r.id === id ? { ...r, status: data.status || newStatus } : r));
    } catch (e) { alert('Action failed'); }
  };

  const handleReviewAction = async (id, approved) => {
    try {
      await api.put(`/admin/reviews/${id}`, { approved });
      setReviews(reviews.map(r => r.id === id ? { ...r, approved } : r));
    } catch (e) { console.error(e); }
  };

  const handleAssignDriver = async (orderId, driverId) => {
    if (!driverId) return;
    try {
      const { data } = await api.post(`/admin/dispatch/orders/${orderId}/assign`, { driver_id: driverId });
      setOrders(orders.map(o => o.id === orderId ? { ...o, driver_id: driverId, status: 'assigned' } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, driver_id: driverId, status: 'assigned' });
    } catch (e) { alert('Failed to assign driver'); }
  };

  const handleSettleCash = async (driverId) => {
    try {
      await api.post(`/admin/dispatch/drivers/${driverId}/settle`);
      setDrivers(drivers.map(d => d.id === driverId ? { ...d, collected_cash: 0 } : d));
    } catch (e) { alert('Failed to settle cash'); }
  };

  const handleToggleRole = async (userId, role) => {
    try {
      const endpoint = role === 'admin' ? `/admin/users/${userId}/toggle-admin` : `/admin/users/${userId}/toggle-driver`;
      const { data } = await api.put(endpoint);
      setUsers(users.map(u => u.id === userId ? { ...u, ...data } : u));
    } catch (e) { alert('Action failed'); }
  };

  if (!user?.is_admin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-500">You must be an administrator to view this page.</p>
        <Link to="/" className="btn btn-primary">Return Home</Link>
      </div>
    );
  }

  // Derived Stats
  const totalSales = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + Number(o.total_price), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockProducts = products.filter(p => p.stock < (p.low_stock_threshold || 5));

  // --- Render Components ---
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-default">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.11-1.36-3.11-2.92v-.46h2.26v.29c0 .8.71 1.46 1.89 1.46 1.41 0 2.13-.58 2.13-1.57 0-2.31-4.99-1.28-4.99-4.32 0-1.29 1-2.4 2.82-2.73V5.91h2.67v1.86c1.23.27 2.37 1 2.51 2.37h-2.26c-.15-.65-.77-1.12-1.77-1.12-1.21 0-1.89.58-1.89 1.44 0 2.22 4.99 1.15 4.99 4.34.01 1.54-1.28 2.58-2.59 2.92z"/></svg>
          </div>
          <div className="flex justify-between items-start mb-4">
             <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Sales</p>
             <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                +14.5% <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>
             </span>
          </div>
          <p className="text-3xl font-black text-gray-900 tracking-tight">{formatPrice(totalSales)}</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-default">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v7h4v-2z"/></svg>
          </div>
          <div className="flex justify-between items-start mb-4">
             <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending Orders</p>
             {pendingOrders > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">Needs Action</span>
             )}
          </div>
          <p className="text-3xl font-black text-gray-900 tracking-tight">{pendingOrders}</p>
        </div>

        {/* Custom Requests */}
        <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-default">
           <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Custom Requests</p>
              <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100">Pending</span>
           </div>
           <p className="text-3xl font-black text-gray-900 tracking-tight">{requests.filter(r => r.status === 'pending').length}</p>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-default">
          <div className="flex justify-between items-start mb-4">
             <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Low Stock</p>
             {lowStockProducts.length > 0 && <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">Warning</span>}
          </div>
          <p className="text-3xl font-black text-gray-900 tracking-tight">{lowStockProducts.length}</p>
          <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
             <div className="bg-red-500 h-full rounded-full" style={{ width: `${Math.min(100, (lowStockProducts.length / Math.max(1, products.length)) * 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid lg:grid-cols-3 gap-6">
         {/* Recent Orders */}
         <div className="lg:col-span-2 bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <h3 className="font-bold text-gray-900">Recent Orders</h3>
               <button onClick={() => setActiveTab('orders')} className="text-sm font-bold text-yellow-600 hover:text-yellow-700 transition">View All →</button>
            </div>
            <div className="divide-y divide-gray-100 flex-1">
               {orders.slice(0, 5).map(o => (
                 <div key={o.id} className="p-4 px-6 flex justify-between items-center group cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setSelectedOrder(o)}>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                       </div>
                       <div>
                          <p className="font-bold text-gray-900">#{o.order_number}</p>
                          <p className="text-sm text-gray-500">{o.user?.name || o.shipping_address?.name || 'Guest'}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-gray-900">{formatPrice(o.total_price)}</p>
                       <span className={`text-[10px] uppercase font-bold tracking-wider ${
                          o.status === 'delivered' ? 'text-green-600' : 
                          o.status === 'cancelled' ? 'text-red-600' : 'text-orange-500'
                       }`}>{o.status}</span>
                    </div>
                 </div>
               ))}
               {orders.length === 0 && <div className="p-8 text-center text-gray-400 font-medium">No recent orders found.</div>}
            </div>
         </div>
         
         {/* Inventory Alerts */}
         <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <h3 className="font-bold text-gray-900">Restock Priority</h3>
               <button onClick={() => setActiveTab('products')} className="text-sm font-bold text-yellow-600 hover:text-yellow-700 transition">Manage</button>
            </div>
            <div className="divide-y divide-gray-100 p-2">
               {lowStockProducts.slice(0, 5).map(p => {
                 const percentage = Math.max(5, (p.stock / (p.low_stock_threshold || 5)) * 100);
                 return (
                 <div key={p.id} className="p-4 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className="flex justify-between items-center mb-2">
                       <p className="text-sm font-bold text-gray-900 truncate pr-4">{p.name}</p>
                       <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md">{p.stock} left</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                       <div className={`h-full rounded-full transition-all duration-1000 ${p.stock === 0 ? 'bg-red-600 w-full' : 'bg-orange-400'}`} style={{ width: p.stock === 0 ? '100%' : `${percentage}%` }}></div>
                    </div>
                 </div>
               )})}
               {lowStockProducts.length === 0 && (
                  <div className="p-8 pb-10 text-center text-gray-400 font-medium flex flex-col items-center">
                     <svg className="w-12 h-12 text-green-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     All inventory well-stocked
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Order Management</h2>
      </div>
      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-100">
              <th className="px-6 py-4">Order Details</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Fulfillment Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(o => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors group">
                 <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors cursor-pointer" onClick={() => setSelectedOrder(o)}>#{o.order_number}</p>
                    <p className="text-sm text-gray-500">{o.user?.name || o.shipping_address?.name || 'Guest'}</p>
                 </td>
                 <td className="px-6 py-4 font-black text-gray-900">{formatPrice(o.total_price)}</td>
                 <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${o.payment_status === 'paid' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                       {o.payment_status}
                    </span>
                 </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1.5">
                        <span className={`w-fit px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                           o.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' : 
                           o.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' : 
                           o.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                           'bg-yellow-50 text-yellow-700 border-yellow-100'
                        }`}>
                           {o.status.replace('_', ' ')}
                        </span>
                        {o.driver_id && <p className="text-[9px] font-bold text-gray-400 uppercase">Driver Assigned</p>}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-2">
                        {o.status === 'pending' && (
                           <>
                              <button onClick={() => handleOrderAction(o.id, 'confirm')} className="text-[10px] font-black uppercase tracking-wider bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600 transition-all shadow-sm shadow-yellow-200">Confirm</button>
                              <button onClick={() => handleOrderAction(o.id, 'cancel')} className="text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all">Cancel</button>
                           </>
                        )}
                        {o.status === 'confirmed' && (
                           <button onClick={() => setSelectedOrder(o)} className="text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-all shadow-sm shadow-orange-200">Assign Driver</button>
                        )}
                        {o.status === 'assigned' && (
                           <button onClick={() => handleStartDelivery(o.id)} className="text-[10px] font-black uppercase tracking-wider bg-yellow-600 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-700 transition-all shadow-sm shadow-yellow-200">Start Delivery</button>
                        )}
                        {o.status === 'delivered' && (
                           <button onClick={() => handleOrderAction(o.id, 'complete')} className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-200 font-bold">Complete Order</button>
                        )}
                        {(o.status === 'completed' || o.status === 'cancelled' || o.status === 'shipped' || o.status === 'picked_up' || o.status === 'on_the_way') && (
                           <button onClick={() => setSelectedOrder(o)} className="text-[10px] font-black uppercase tracking-wider bg-gray-50 text-gray-400 border border-gray-100 px-3 py-1.5 rounded-lg hover:bg-white hover:text-yellow-600 transition-all font-bold">Details</button>
                        )}
                     </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCustomRequests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-xl font-bold text-gray-900 tracking-tight">Bespoke Custom Orders</h2>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
         {/* Columns: Pending, Progress, Approved/Rejected */}
         {['pending', 'in_progress', 'approved', 'rejected'].map(colStatus => {
            const colRequests = requests.filter(r => (r.status || 'pending') === colStatus);
            if (colStatus === 'approved' || colStatus === 'rejected') {
                if (colStatus === 'approved') return null; // We'll group them mentally
            }
            
            return (
               <div key={colStatus} className="bg-gray-50/80 border border-gray-100 p-4 rounded-[24px] space-y-4 min-h-[500px] flex flex-col">
                  <div className="flex justify-between items-center mb-2 px-2">
                     <h3 className="font-black text-gray-800 capitalize tracking-tight">{colStatus.replace('_', ' ')}</h3>
                     <span className="bg-gray-200 text-gray-700 text-xs font-black px-2.5 py-1 rounded-full">{colRequests.length}</span>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                     {colRequests.map(r => (
                        <div key={r.id} className="bg-white p-5 rounded-[16px] space-y-3 shadow-sm border border-gray-200 hover:border-yellow-400 hover:shadow-md transition-all cursor-grab group">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded uppercase tracking-widest">{r.furniture_type}</span>
                                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{r.budget}</span>
                            </div>
                            <h4 className="font-bold text-gray-900 leading-tight group-hover:text-yellow-700 transition-colors">{r.name}</h4>
                            <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{r.description}</p>
                            
                            <div className="border-t border-gray-100 pt-4 mt-4">
                                <p className="text-xs font-bold text-gray-800">{r.email}</p>
                                {r.phone && <p className="text-xs font-medium text-gray-500">{r.phone}</p>}
                            </div>
                            
                            <div className="flex gap-2 pt-2">
                                {colStatus !== 'approved' && (
                                   <button onClick={() => handleRequestStatus(r.id, 'approved')} className="text-[11px] font-bold uppercase tracking-wider flex-1 bg-green-500 text-white rounded-lg py-2 hover:bg-green-600 transition-colors shadow-sm shadow-green-500/20">Approve</button>
                                )}
                                {colStatus !== 'in_progress' && colStatus !== 'rejected' && (
                                   <button onClick={() => handleRequestStatus(r.id, 'in_progress')} className="text-[11px] font-bold uppercase tracking-wider flex-1 bg-yellow-600 text-white rounded-lg py-2 hover:bg-yellow-700 transition-colors shadow-sm shadow-yellow-600/20">Start Work</button>
                                )}
                                {colStatus !== 'rejected' && (
                                   <button onClick={() => handleRequestStatus(r.id, 'rejected')} className="text-[11px] font-bold uppercase tracking-wider px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">Reject</button>
                                )}
                            </div>
                        </div>
                     ))}
                     {colRequests.length === 0 && (
                        <div className="h-24 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 text-sm font-medium">Empty</div>
                     )}
                  </div>
               </div>
            );
         })}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Inventory Management</h2>
        <Link to="/admin/products/new" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 px-5 rounded-xl shadow-sm shadow-yellow-600/20 transition-all hover:shadow-md hover:-translate-y-0.5">Add Product</Link>
      </div>
      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-100">
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Stock Level</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => {
               const isLowStock = p.stock < (p.low_stock_threshold || 5);
               const percentage = Math.max(5, Math.min(100, (p.stock / (p.low_stock_threshold || 5) / 2) * 100));
               return (
              <tr key={p.id} className={`transition-colors group hover:bg-gray-50 ${isLowStock ? 'bg-red-50/30' : ''}`}>
                 <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                          <img src={p.images?.[0] || 'https://placehold.co/100'} alt="" className="w-full h-full object-cover" />
                       </div>
                       <span className="font-bold text-sm text-gray-900 group-hover:text-yellow-600 transition-colors">{p.name}</span>
                    </div>
                 </td>
                 <td className="px-6 py-4 font-black text-gray-900">{formatPrice(p.price)}</td>
                 <td className="px-6 py-4 text-sm font-medium text-gray-500">{p.category}</td>
                 <td className="px-6 py-4 w-48">
                    <div className="flex items-center justify-between mb-1">
                       <span className={`text-xs font-black ${isLowStock ? 'text-red-600' : 'text-gray-700'}`}>{p.stock} units</span>
                       {isLowStock && <span className="text-[9px] uppercase font-bold text-red-500 tracking-wider">Low</span>}
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                       <div className={`h-full rounded-full transition-all duration-1000 ${isLowStock ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${percentage}%` }}></div>
                    </div>
                 </td>
                 <td className="px-6 py-4 text-right">
                    <Link to={`/admin/products/${p.id}`} className="text-sm font-bold text-yellow-600 hover:text-yellow-800 transition-colors bg-yellow-50 px-4 py-2 rounded-lg hover:bg-yellow-100">Edit</Link>
                 </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Category Registry</h2>
        <Link to="/admin/categories/new" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 px-5 rounded-xl shadow-sm shadow-yellow-600/20 transition-all hover:shadow-md hover:-translate-y-0.5">Define Category</Link>
      </div>
      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-100">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Identifier</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">{c.name}</td>
                <td className="px-6 py-4 font-mono text-[10px] text-gray-400 bg-gray-50/50 px-2 rounded-md">{c.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{c.description}</td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/admin/categories/${c.id}`} className="text-sm font-bold text-yellow-600 hover:text-yellow-800 transition-colors bg-yellow-50 px-4 py-2 rounded-lg hover:bg-yellow-100">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 tracking-tight">Patron Reviews</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        {reviews.map(r => (
          <div key={r.id} className="bg-white p-6 rounded-[16px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded uppercase tracking-widest">{r.product?.name}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${r.approved ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                  {r.approved ? 'Approved' : 'Pending'}
                </span>
              </div>
              <p className="font-medium text-gray-800 leading-relaxed italic">"{r.comment}"</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">— {r.user?.name}</p>
            </div>
            <div className="flex items-center gap-3 pt-6 mt-4 border-t border-gray-50">
              {!r.approved ? (
                <button onClick={() => handleReviewAction(r.id, true)} className="flex-1 text-[11px] font-bold uppercase tracking-wider bg-green-500 text-white rounded-lg py-2 hover:bg-green-600 transition-colors shadow-sm shadow-green-500/20">Approve</button>
              ) : (
                <button onClick={() => handleReviewAction(r.id, false)} className="flex-1 text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded-lg py-2 hover:bg-red-50 hover:text-red-600 transition-colors">Reject / Hide</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCoupons = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Discount Coupons</h2>
        <Link to="/admin/coupons/new" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 px-5 rounded-xl shadow-sm shadow-yellow-600/20 transition-all hover:shadow-md hover:-translate-y-0.5">Create Coupon</Link>
      </div>
      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-100">
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4">Uses</th>
              <th className="px-6 py-4 text-right">Expiration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 font-mono font-black text-yellow-600 text-lg">{c.code}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-500 capitalize">{c.type}</td>
                <td className="px-6 py-4 font-black text-gray-900 text-lg">{c.type === 'percentage' ? `${c.value}%` : formatPrice(c.value)}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-500"><span className="text-gray-900">{c.times_used}</span> / {c.max_uses || '∞'}</td>
                <td className="px-6 py-4 text-right text-sm font-medium text-gray-400">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never expires'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDrivers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Logistics & Drivers</h2>
      </div>
      <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-100">
              <th className="px-6 py-4">Driver Details</th>
              <th className="px-6 py-4 text-center">Active Deliveries</th>
              <th className="px-6 py-4 text-right">Collected COD Cash</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {drivers.map(d => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                   <p className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">{d.name}</p>
                   <p className="text-sm text-gray-500">{d.email}</p>
                </td>
                <td className="px-6 py-4 text-center">
                   <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold inline-flex items-center justify-center">{d.active_orders_count}</span>
                </td>
                <td className="px-6 py-4 text-right">
                   <p className="text-lg font-black text-emerald-600">{formatPrice(d.collected_cash)}</p>
                </td>
                <td className="px-6 py-4 text-right">
                   {Number(d.collected_cash) > 0 ? (
                      <button onClick={() => handleSettleCash(d.id)} className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold px-4 py-2 text-sm rounded-lg transition-colors shadow-sm">Settle Cash</button>
                   ) : (
                      <span className="text-[11px] uppercase font-black tracking-widest text-gray-300">Settled</span>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => {
    const filteredUsers = users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = userRoleFilter === 'all' || 
                         (userRoleFilter === 'admin' && u.is_admin) || 
                         (userRoleFilter === 'driver' && u.is_driver) ||
                         (userRoleFilter === 'user' && !u.is_admin && !u.is_driver);
      return matchesSearch && matchesRole;
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">User Management</h2>
          <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search name or email..." 
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 pl-10 text-sm focus:ring-2 focus:ring-yellow-500 transition-all outline-none min-w-[240px]"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
             <select 
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-yellow-500 transition-all outline-none"
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
             >
                <option value="all">All Roles</option>
                <option value="user">Customers</option>
                <option value="admin">Administrators</option>
                <option value="driver">Drivers</option>
             </select>
          </div>
        </div>

        <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-[11px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-100">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Role Matrix</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${u.is_admin ? 'bg-red-100 text-red-700' : u.is_driver ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                           {u.name.charAt(0)}
                        </div>
                        <div>
                           <p className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors uppercase tracking-tight text-sm">{u.name}</p>
                           <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-wrap gap-1.5">
                        {u.is_admin && <span className="bg-red-50 text-red-700 text-[9px] font-black px-2 py-0.5 rounded border border-red-100 uppercase tracking-widest">Admin</span>}
                        {u.is_driver && <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest">Driver</span>}
                        {!u.is_admin && !u.is_driver && <span className="bg-gray-50 text-gray-400 text-[9px] font-black px-2 py-0.5 rounded border border-gray-100 uppercase tracking-widest">Customer</span>}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-600">{u.phone || '—'}</td>
                  <td className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                          onClick={() => handleToggleRole(u.id, 'admin')}
                          className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${
                             u.is_admin ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white text-gray-400 border-gray-100 hover:text-red-600 hover:bg-red-50'
                          }`}
                       >
                          {u.is_admin ? 'Remove Admin' : 'Grant Admin'}
                       </button>
                       <button 
                          onClick={() => handleToggleRole(u.id, 'driver')}
                          className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${
                             u.is_driver ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-gray-400 border-gray-100 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                       >
                          {u.is_driver ? 'Remove Driver' : 'Grant Driver'}
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                 <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium">No users found matching your search.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Modal Order Details
  const OrderModal = () => {
     if (!selectedOrder) return null;
     return (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                 <h2 className="text-xl font-black text-gray-900 tracking-tight">Order #{selectedOrder.order_number}</h2>
                 <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
              <div className="p-8 space-y-8 overflow-y-auto">
                 {/* Workflow Stepper */}
                 <div className="relative">
                    <div className="flex justify-between items-center mb-8 relative z-10 px-4">
                       {[
                          { id: 'pending', label: 'Order', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
                          { id: 'confirmed', label: 'Processing', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                          { id: 'assigned', label: 'Assigned', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                          { id: 'shipped', label: 'In Delivery', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                          { id: 'delivered', label: 'Delivered', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                          { id: 'completed', label: 'Done', icon: 'M5 13l4 4L19 7' }
                       ].map((step, idx, arr) => {
                          const statusOrder = ['pending', 'confirmed', 'assigned', 'shipped', 'picked_up', 'on_the_way', 'delivered', 'completed'];
                          const currentIdx = statusOrder.indexOf(selectedOrder.status);
                          const stepIdx = statusOrder.indexOf(step.id);
                          
                          // Correctly identify active/completed steps
                          const isCompleted = currentIdx > stepIdx || (step.id === 'shipped' && (selectedOrder.status === 'picked_up' || selectedOrder.status === 'on_the_way' || currentIdx > 6)) || (step.id === 'delivered' && (selectedOrder.status === 'completed' || currentIdx > 6));
                          const isActive = selectedOrder.status === step.id || (step.id === 'shipped' && (selectedOrder.status === 'picked_up' || selectedOrder.status === 'on_the_way')) || (step.id === 'delivered' && selectedOrder.status === 'delivered');

                          return (
                             <div key={step.id} className="flex flex-col items-center group relative z-10">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                   isCompleted ? 'bg-yellow-600 border-yellow-600 text-white shadow-lg shadow-yellow-600/30' : 
                                   isActive ? 'bg-white border-yellow-500 text-yellow-600 animate-pulse ring-4 ring-yellow-50' : 
                                   'bg-white border-gray-200 text-gray-400'
                                }`}>
                                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={step.icon} /></svg>
                                </div>
                                <span className={`text-[9px] font-black uppercase mt-3 tracking-widest ${isActive ? 'text-yellow-600' : 'text-gray-400'}`}>{step.label}</span>
                             </div>
                          );
                       })}
                       {/* Line background */}
                       <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-100 -z-0" />
                    </div>
                 </div>

                 {/* Details grids... */}
                 <div className="grid grid-cols-2 gap-8">
                     <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Customer & Shipping</h3>
                        <p className="font-bold text-gray-900 leading-tight">{selectedOrder.shipping_name || 'Customer'}</p>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{selectedOrder.shipping_address || 'N/A'}</p>
                        <p className="text-sm text-gray-500">{selectedOrder.shipping_city}, {selectedOrder.shipping_country}</p>
                        <p className="text-sm font-semibold text-gray-700 mt-2">{selectedOrder.shipping_phone}</p>
                     </div>
                     <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Payment Info</h3>
                        <p className="text-sm text-gray-600 mb-1"><span className="font-bold text-gray-900">Method:</span> <span className="capitalize">{selectedOrder.payment_method}</span></p>
                        <p className="text-sm text-gray-600 mb-3"><span className="font-bold text-gray-900">Status:</span> <span className={`uppercase font-black ml-1 text-[10px] px-2 py-0.5 rounded tracking-wider ${selectedOrder.payment_status === 'paid' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>{selectedOrder.payment_status}</span></p>
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-center justify-between">
                           <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total</span>
                           <span className="text-xl font-black text-gray-900">{formatPrice(selectedOrder.total_price)}</span>
                        </div>
                     </div>
                 </div>

                 <div className="border-t border-gray-100 pt-8">
                     <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Logistics & Tracking</h3>
                     <div className="bg-white border border-gray-200 p-5 rounded-[16px] shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Driver Assignment</p>
                              {selectedOrder.status === 'confirmed' ? (
                                 <div className="flex gap-2">
                                    <select 
                                       className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-yellow-500 focus:bg-white p-2.5 transition-all outline-none"
                                       value={selectedOrder.driver_id || ''}
                                       onChange={(e) => handleAssignDriver(selectedOrder.id, e.target.value)}
                                    >
                                       <option value="">-- Choose Driver --</option>
                                       {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                 </div>
                              ) : (
                                 <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-black text-[10px]">
                                       {drivers.find(d => d.id === selectedOrder.driver_id)?.name.charAt(0) || '?'}
                                    </div>
                                    <div>
                                       <p className="text-sm font-bold text-gray-900">{drivers.find(d => d.id === selectedOrder.driver_id)?.name || 'Not assigned'}</p>
                                       {selectedOrder.driver_id && <p className="text-[10px] font-bold text-gray-400 uppercase">Field Agent</p>}
                                    </div>
                                 </div>
                              )}
                           </div>
                           <div className="w-px h-12 bg-gray-100 mx-6 hidden sm:block" />
                           <div className="flex-1">
                              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Current Action</p>
                              {selectedOrder.status === 'pending' && <button onClick={() => handleOrderAction(selectedOrder.id, 'confirm')} className="w-full bg-yellow-600 text-white font-black text-[10px] uppercase tracking-wider py-3 rounded-xl hover:bg-yellow-700 shadow-lg shadow-yellow-600/20">Confirm Order</button>}
                              {selectedOrder.status === 'confirmed' && <div className="text-[10px] font-black text-orange-500 bg-orange-50 px-4 py-3 rounded-xl border border-orange-100 text-center uppercase tracking-widest">Awaiting Driver</div>}
                              {selectedOrder.status === 'assigned' && <button onClick={() => handleStartDelivery(selectedOrder.id)} className="w-full bg-yellow-600 text-white font-black text-[10px] uppercase tracking-wider py-3 rounded-xl hover:bg-yellow-700 shadow-lg shadow-yellow-600/20">Start Delivery</button>}
                              {selectedOrder.status === 'delivered' && <button onClick={() => handleOrderAction(selectedOrder.id, 'complete')} className="w-full bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider py-3 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 font-bold">Mark as Completed</button>}
                              {['shipped', 'picked_up', 'on_the_way'].includes(selectedOrder.status) && <div className="text-[10px] font-black text-yellow-600 bg-yellow-50 px-4 py-3 rounded-xl border border-yellow-100 text-center uppercase tracking-widest">In Transit</div>}
                              {selectedOrder.status === 'completed' && <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 text-center uppercase tracking-widest">Transaction Closed</div>}
                           </div>
                        </div>
                     </div>
                 </div>

                 <div className="border-t border-gray-100 pt-8">
                     <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Workflow Journey</h3>
                     <div className="flex flex-col gap-6 relative pl-5 border-l-2 border-yellow-100 ml-3">
                        <div className="relative">
                            <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-yellow-500 ring-4 ring-yellow-50" />
                            <p className="font-black text-sm text-gray-900 leading-none mb-1">Order Placed</p>
                            <p className="text-xs font-semibold text-gray-400">{new Date(selectedOrder.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>
                        {selectedOrder.confirmed_at && (
                            <div className="relative">
                                <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-yellow-500 ring-4 ring-yellow-50" />
                                <p className="font-black text-sm text-gray-900 leading-none mb-1">Confirmed by Admin</p>
                                <p className="text-xs font-semibold text-gray-400">{new Date(selectedOrder.confirmed_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                            </div>
                        )}
                        {selectedOrder.shipped_at && (
                            <div className="relative">
                                <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-yellow-500 ring-4 ring-yellow-50" />
                                <p className="font-black text-sm text-gray-900 leading-none mb-1">Dispatched to Driver</p>
                                <p className="text-xs font-semibold text-gray-400">{new Date(selectedOrder.shipped_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                            </div>
                        )}
                        {selectedOrder.delivered_at && (
                            <div className="relative">
                                <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-yellow-500 ring-4 ring-yellow-50" />
                                <p className="font-black text-sm text-gray-900 leading-none mb-1">Marked as Delivered</p>
                                <p className="text-xs font-semibold text-gray-400 mb-2">{new Date(selectedOrder.delivered_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                {selectedOrder.driver_comment && (
                                    <p className="text-xs font-bold text-yellow-700 bg-yellow-50 p-3 rounded-xl border border-yellow-100 italic">“{selectedOrder.driver_comment}”</p>
                                )}
                            </div>
                        )}
                        {selectedOrder.completed_at && (
                            <div className="relative">
                                <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <p className="font-black text-sm text-emerald-600 leading-none mb-1">Completed & Paid</p>
                                <p className="text-xs font-semibold text-gray-400">{new Date(selectedOrder.completed_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                            </div>
                        )}
                        {selectedOrder.cancelled_at && (
                            <div className="relative">
                                <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-red-500 ring-4 ring-red-50" />
                                <p className="font-black text-sm text-red-600 leading-none mb-1">Order Cancelled</p>
                                <p className="text-xs font-semibold text-gray-400">{new Date(selectedOrder.cancelled_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                            </div>
                        )}
                     </div>
                 </div>

                 <div className="border-t border-gray-100 pt-8">
                     <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Items Included</h3>
                     <div className="space-y-3 bg-gray-50/50 p-4 rounded-[16px] border border-gray-100">
                        {selectedOrder.items?.map(item => (
                           <div key={item.id} className="flex justify-between items-center text-sm bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                      <img src={item.product?.images?.[0] || 'https://placehold.co/100'} className="w-full h-full object-cover" />
                                  </div>
                                   <span className="font-bold text-gray-900">{item.product?.name || 'Product'} <span className="text-gray-400 font-semibold ml-1">x{item.quantity}</span></span>
                              </div>
                              <span className="font-black text-gray-900">{formatPrice(item.unit_price * item.quantity)}</span>
                           </div>
                        ))}
                     </div>
                 </div>
              </div>
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                  <button onClick={() => setSelectedOrder(null)} className="px-6 py-2.5 bg-white border border-gray-200 font-bold text-sm text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">Close Window</button>
              </div>
           </div>
        </div>
     );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex font-sans text-gray-900">
      {OrderModal()}
      
      {/* Sidebar - Beldi Premium Style */}
      <aside className="w-[260px] bg-[#0F0E0C] border-r border-gray-800/20 hidden md:flex flex-col sticky top-0 h-screen shrink-0 shadow-2xl z-20">
        <div className="p-6">
           <Link to="/" className="text-xl font-black text-white tracking-tight flex items-center gap-2 group font-heading">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center group-hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/30">
                 <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              Beldi Express
           </Link>
        </div>
        
        <div className="px-4 pb-2">
           <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-2">Main Menu</p>
        </div>
        
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
           {sidebarMenus.map(menu => (
              <button
                 key={menu.id}
                 onClick={() => setActiveTab(menu.id)}
                 className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === menu.id 
                    ? 'bg-yellow-500/10 text-yellow-500 border-l-2 border-yellow-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                 }`}
              >
                  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menu.icon} /></svg>
                  {menu.label}
              </button>
           ))}
        </nav>

        <div className="p-4 border-t border-[#1e2433]">
           <button 
              onClick={() => { useAuthStore.getState().logout(); window.location.href = '/login'; }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all duration-200"
           >
              <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6-10V7a3 3 0 00-6 0v1" /></svg>
              Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full flex flex-col min-h-screen">
         {/* Topbar */}
         <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div className="flex-1 max-w-xl">
               <div className="relative group">
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-yellow-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input type="text" placeholder="Search orders, customers, or products... (Press '/')" className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white border-transparent focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium transition-all" />
               </div>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-4 border-r border-gray-200 pr-6">
                  <span className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Live
                  </span>
                  <button className="relative text-gray-400 hover:text-gray-900 transition-colors focus:outline-none">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                     <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                  </button>
               </div>
               <div className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1.5 pr-3 rounded-2xl transition-colors border border-transparent hover:border-gray-200">
                  <div className="text-right hidden sm:block">
                     <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-yellow-600 transition-colors">{user.name}</p>
                     <p className="text-[10px] text-gray-500 uppercase font-black tracking-wider">Admin</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-yellow-200 transition-colors">
                     {user.name.charAt(0)}
                  </div>
               </div>
            </div>
         </header>

         <div className="p-8 flex-1">
           {loading ? (
             <div className="h-64 rounded-2xl bg-gray-100 animate-pulse border border-gray-100 shadow-sm" />
           ) : (
             <AnimatePresence mode="wait">
               <motion.div
                 key={activeTab}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
                 className="flex flex-col gap-6"
               >
                 {activeTab === 'dashboard' && renderDashboard()}
                 {activeTab === 'orders' && renderOrders()}
                 {activeTab === 'custom-requests' && renderCustomRequests()}
                 {activeTab === 'products' && renderProducts()}
                 {activeTab === 'categories' && renderCategories()}
                 {activeTab === 'reviews' && renderReviews()}
                 {activeTab === 'coupons' && renderCoupons()}
                 {activeTab === 'drivers' && renderDrivers()}
                  {activeTab === 'users' && renderUsers()}
               </motion.div>
             </AnimatePresence>
           )}
         </div>
      </main>
    </div>
  );
}
