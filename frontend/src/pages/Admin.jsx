import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

const tabs = [
  { id: 'orders', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id: 'analytics', label: 'Performance', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'products', label: 'Catalogue', icon: 'M20 7l-9-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { id: 'categories', label: 'Collections', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
  { id: 'coupons', label: 'Marketing', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
  { id: 'users', label: 'Clients', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { id: 'shipping-methods', label: 'Shipping', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' },
  { id: 'reviews', label: 'Reviews', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { id: 'tickets', label: 'Tickets', icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z' },
  { id: 'returns', label: 'SAV', icon: 'M16 15v-2a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 9V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2v-5z' },
  { id: 'custom-requests', label: 'Custom', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

export default function Admin() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState('orders');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [settings, setSettings] = useState({
    shop_name: 'Beldi Ameublement',
    shop_email: 'contact@beldi.ma',
    shop_phone: '+212 500 000 000',
    shop_address: 'Marrakech, Morocco',
    instagram_url: '',
    facebook_url: '',
  });
  const [returns, setReturns] = useState([]);
  const [userList, setUserList] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [stats, setStats] = useState({ 
    total_sales: 0, 
    total_orders: 0, 
    total_customers: 0, 
    average_order_value: 0, 
    recent_orders: [], 
    top_products: [], 
    sales_history: [] 
  });
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [refundModal, setRefundModal] = useState({ open: false, reason: '', amount: '' });
  const [importResult, setImportResult] = useState(null);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const formatPrice = useCurrencyStore((s) => s.formatPrice);
  const [importing, setImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBulkImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/admin/products/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImportResult(res.data);
      // Refresh products list
      api.get('/admin/products').then((r) => setProducts(r.data.data || r.data));
    } catch (err) {
      setImportResult({ success_count: 0, failure_count: 0, errors: [], message: err.response?.data?.message || 'Import failed' });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

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
      api.get('/admin/users').then((r) => setUserList(r.data.data || r.data)),
      api.get('/admin/shipping-methods').then((r) => setShippingMethods(r.data.data || r.data)),
      api.get('/admin/products/alerts').then((r) => setLowStockAlerts(r.data)),
      api.get('/admin/stats').then((r) => setStats(r.data)),
      api.get('/admin/settings').then((r) => {
        if (Object.keys(r.data).length > 0) {
          setSettings(s => ({ ...s, ...r.data }));
        }
      }),
    ];
    Promise.all(promises).finally(() => setLoading(false));
  }, [user?.is_admin]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/settings', settings);
      alert('Settings updated successfully');
    } catch (e) {
      alert('Failed to update settings');
    }
  };

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

  const deleteShippingMethod = async (id) => {
    if (!confirm('Are you sure you want to remove this shipping method?')) return;
    try {
      await api.delete(`/admin/shipping-methods/${id}`);
      setShippingMethods(shippingMethods.filter(m => m.id !== id));
    } catch (e) {
      alert('Failed to delete shipping method');
    }
  };

  const [shippingModal, setShippingModal] = useState({ open: false, data: { name: '', price: '', estimated_days: '' } });

  const fetchUserDetails = async (userId) => {
    try {
      const { data } = await api.get(`/admin/users/${userId}`);
      setSelectedUser(data);
    } catch (err) {
      alert('Failed to fetch user details');
    }
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    try {
      if (shippingModal.data.id) {
        await api.put(`/admin/shipping-methods/${shippingModal.data.id}`, shippingModal.data);
      } else {
        await api.post('/admin/shipping-methods', shippingModal.data);
      }
      const res = await api.get('/admin/shipping-methods');
      setShippingMethods(res.data.data || res.data);
      setShippingModal({ open: false, data: { name: '', price: '', estimated_days: '' } });
    } catch (err) {
      alert('Error saving shipping method');
    }
  };

  const toggleAdmin = async (u) => {
    if (!confirm(`Are you sure you want to ${u.is_admin ? 'remove' : 'grant'} admin rights for ${u.name}?`)) return;
    try {
      await api.put(`/admin/users/${u.id}/toggle-admin`, {});
      setUserList(userList.map(item => item.id === u.id ? { ...item, is_admin: !item.is_admin } : item));
    } catch (e) {
      console.error('Failed to update user role:', e);
      const errMsg = e.response?.data?.message || e.message || 'Unknown error';
      alert(`Failed to update user role: ${errMsg}`);
    }
  };

  const handleExportOrders = async () => {
    try {
      const response = await api.get('/admin/orders/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Failed to export orders');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete product');
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category? All products in this category will be uncategorized.')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete category');
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      setCoupons(coupons.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete coupon');
    }
  };

  const handleCustomRequestStatus = async (id, status) => {
    try {
      await api.put(`/admin/custom-requests/${id}`, { status });
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    } catch (e) {
      console.error(e);
      alert('Failed to update request status');
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

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const filteredProducts = productList.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredOrders = orderList.filter(o => o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) || o.shipping_name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredUsers = userList.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCategories = categoryList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCoupons = couponList.filter(c => c.code.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTickets = tickets.filter(t => t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.user?.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredReviews = reviewList.filter(r => r.comment.toLowerCase().includes(searchQuery.toLowerCase()) || r.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.product?.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredReturns = returns.filter(r => r.reason.toLowerCase().includes(searchQuery.toLowerCase()) || r.order?.order_number.toLowerCase().includes(searchQuery.toLowerCase()) || r.order?.user?.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredRequests = requestList.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.email.toLowerCase().includes(searchQuery.toLowerCase()) || r.furniture_type.toLowerCase().includes(searchQuery.toLowerCase()));

  const scrollRef = useRef(null);
  useEffect(() => {
    if (selectedTicket && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedTicket?.messages, selectedTicket]);

  return (
    <div className="bg-[#F9FAFB] min-h-screen flex text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-white shadow-sm">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-900 leading-tight">Beldi</h1>
            <p className="text-[11px] text-yellow-600 font-semibold tracking-wide uppercase">Ameublement</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 mb-4">Menu</div>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-semibold text-sm ${
                tab === t.id 
                  ? 'bg-[#FFF9E6] text-[#EAB308] shadow-[0_2px_10px_rgba(234,179,8,0.1)]' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
              </svg>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100 space-y-6 bg-white">
          <Link to="/admin/products/new" className="w-full bg-[#EAB308] hover:bg-yellow-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm flex justify-center items-center gap-2">
             Create New Listing
          </Link>
          
          <div className="flex items-center gap-3 group cursor-pointer" onClick={handleLogout}>
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 relative">
               <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=FFF9E6&color=EAB308`} alt="User avatar" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
               </div>
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-gray-900 truncate">{user?.name || ' Karimi'}</p>
               <p className="text-[11px] text-gray-500 truncate">Store Manager</p>
            </div>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[280px] min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="h-[88px] bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
           <div className="relative w-full max-w-xl">
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder={`Search ${tab.replace('-', ' ')}...`} 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
           </div>
           
           <div className="flex items-center gap-6 ml-4">
              <button onClick={() => alert('Notifications feature coming soon!')} className="relative text-gray-400 hover:text-gray-600 transition-colors">
                 <span className="absolute 1 top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </button>
              <button onClick={() => setTab('settings')} className="text-gray-400 hover:text-gray-600 transition-colors">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
           </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                 key="loading"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="h-96 bg-gray-200 animate-pulse rounded-[2rem]" 
              />
            ) : (
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
              {tab === 'analytics' && (
                <div className="space-y-8">
                  <header className="flex justify-between items-end">
                    <div className="space-y-1">
                      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Performance Analytics</h2>
                      <p className="text-gray-500 font-medium">Real-time insights for Beldi Ameublement</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-bold text-gray-600 uppercase">Live Data</span>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                       <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       </div>
                       <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sales</p>
                          <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatPrice(stats.total_sales)}</h3>
                       </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                       <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                       </div>
                       <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
                          <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total_orders}</h3>
                       </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                       <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                       </div>
                       <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Clients</p>
                          <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total_customers}</h3>
                       </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                       <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                       </div>
                       <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Order Value</p>
                          <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatPrice(stats.average_order_value)}</h3>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                        Last 7 Days Sales
                      </h4>
                      <div className="h-64 flex items-end gap-3 px-4">
                        {stats.sales_history?.map((day, idx) => {
                          const max = Math.max(...stats.sales_history.map(d => d.total), 1);
                          const height = (day.total / max) * 100;
                          return (
                            <div key={idx} className="flex-1 group relative">
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition shadow-xl whitespace-nowrap z-10 font-bold">
                                {formatPrice(day.total)}
                              </div>
                              <div 
                                style={{ height: `${height}%` }} 
                                className="w-full bg-yellow-400/20 group-hover:bg-yellow-400 transition-all rounded-t-lg relative"
                              >
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100" />
                              </div>
                              <p className="text-[10px] text-gray-400 mt-2 text-center font-bold uppercase overflow-hidden truncate px-1">
                                {new Date(day.date).toLocaleDateString([], { weekday: 'short' })}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                      <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        Top Products
                      </h4>
                      <div className="space-y-6">
                        {stats.top_products?.map((p, idx) => (
                          <div key={p.id} className="flex items-center gap-4">
                            <div className="text-sm font-bold text-gray-400 w-4">{idx + 1}</div>
                            <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                               <img src={(() => {
                                 if (!p.images) return 'https://placehold.co/150';
                                 if (Array.isArray(p.images)) return p.images[0] || 'https://placehold.co/150';
                                 try {
                                   const parsed = JSON.parse(p.images);
                                   return Array.isArray(parsed) ? (parsed[0] || 'https://placehold.co/150') : 'https://placehold.co/150';
                                 } catch (e) {
                                   return 'https://placehold.co/150';
                                 }
                               })()} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                              <p className="text-xs text-gray-400 font-medium">{p.sales_count} Sales</p>
                            </div>
                            <p className="text-sm font-bold text-gray-900">{formatPrice(p.price)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'products' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                     <div className="flex gap-3">
                        <label className={`cursor-pointer bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${importing ? 'opacity-50 pointer-events-none' : ''}`}>
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                           {importing ? 'Importing...' : 'Bulk Upload CSV'}
                           <input type="file" accept=".csv" onChange={handleBulkImport} className="hidden" disabled={importing} />
                        </label>
                        <Link to="/admin/products/new" className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                           Create New Product
                        </Link>
                     </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/50 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                            <th className="py-4 px-6 font-semibold">Product</th>
                            <th className="py-4 px-6 font-semibold">Price</th>
                            <th className="py-4 px-6 font-semibold">SKU</th>
                            <th className="py-4 px-6 font-semibold">Category</th>
                            <th className="py-4 px-6 font-semibold">Stock</th>
                            <th className="py-4 px-6 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="py-4 px-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                       <img src={p.image || 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80'} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-semibold text-gray-900">{p.name}</span>
                                 </div>
                              </td>
                              <td className="py-4 px-6 font-bold text-gray-900">{formatPrice(p.price)}</td>
                              <td className="py-4 px-6 text-sm text-gray-500 font-mono">{p.sku || '—'}</td>
                              <td className="py-4 px-6 text-sm text-gray-500">{p.category}</td>
                              <td className="py-4 px-6">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.stock < (p.low_stock_threshold || 5) ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                  {p.stock} units
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right space-x-4">
                                <Link to={`/admin/products/${p.id}`} className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 transition-colors">Edit</Link>
                                <button onClick={() => deleteProduct(p.id)} className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Bulk Import Results Modal */}
              {importResult && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center px-4" onClick={() => setImportResult(null)}>
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                  <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setImportResult(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Import Results</h3>

                    {importResult.message && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-4 text-sm">{importResult.message}</div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center">
                        <p className="text-3xl font-bold text-green-700">{importResult.success_count}</p>
                        <p className="text-sm font-semibold text-green-600">Imported</p>
                      </div>
                      <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center">
                        <p className="text-3xl font-bold text-red-700">{importResult.failure_count}</p>
                        <p className="text-sm font-semibold text-red-600">Failed</p>
                      </div>
                    </div>

                    {importResult.errors?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-3">Error Details</h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                          {importResult.errors.map((err, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-gray-500">Row {err.row}</span>
                                <span className="text-xs font-semibold text-gray-700 truncate max-w-[200px]">{err.name}</span>
                              </div>
                              <ul className="list-disc list-inside text-xs text-red-600">
                                {err.errors.map((e, j) => <li key={j}>{e}</li>)}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button onClick={() => setImportResult(null)} className="mt-6 w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">Close</button>
                  </div>
                </div>
              )}

              {tab === 'categories' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
                     <Link to="/admin/categories/new" className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Category
                     </Link>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/50 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                            <th className="py-4 px-6 font-semibold">Name</th>
                            <th className="py-4 px-6 font-semibold">Slug</th>
                            <th className="py-4 px-6 font-semibold">Description</th>
                            <th className="py-4 px-6 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredCategories.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-4 px-6 font-semibold text-gray-900">{c.name}</td>
                              <td className="py-4 px-6 text-sm text-gray-500 font-mono">{c.slug}</td>
                              <td className="py-4 px-6 text-sm text-gray-500 truncate max-w-xs">{c.description}</td>
                              <td className="py-4 px-6 text-right space-x-4">
                                <Link to={`/admin/categories/${c.id}`} className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 transition-colors">Edit</Link>
                                <button onClick={() => deleteCategory(c.id)} className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'orders' && (
                <div className="space-y-6">
                  {/* Top Header */}
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                    <div className="flex gap-3">
                       <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          Last 30 Days
                       </button>
                    </div>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Revenue */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                       <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                       </div>
                       <div>
                          <p className="text-sm font-semibold text-gray-500 mb-1">Total Revenue</p>
                          <div className="flex items-end gap-3">
                             <h3 className="text-2xl font-bold text-gray-900">{formatPrice(stats.total_sales)}</h3>
                             <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md mb-1">+12.5%</span>
                          </div>
                       </div>
                    </div>

                    {/* New Orders */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                       <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                          </div>
                       </div>
                       <div>
                          <p className="text-sm font-semibold text-gray-500 mb-1">New Orders</p>
                          <div className="flex items-end gap-3">
                             <h3 className="text-2xl font-bold text-gray-900">{stats.total_orders}</h3>
                             <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md mb-1">+5.2%</span>
                          </div>
                       </div>
                    </div>

                    {/* Custom Commissions */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                       <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </div>
                       </div>
                       <div>
                          <p className="text-sm font-semibold text-gray-500 mb-1">Active Clients</p>
                          <div className="flex items-end gap-3">
                             <h3 className="text-2xl font-bold text-gray-900">{stats.total_customers}</h3>
                             <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md mb-1">+4.1%</span>
                          </div>
                       </div>
                    </div>

                    {/* Pending Shipments */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                       <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                          </div>
                       </div>
                       <div>
                          <p className="text-sm font-semibold text-gray-500 mb-1">Pending Shipments</p>
                          <div className="flex items-end gap-3">
                             <h3 className="text-2xl font-bold text-gray-900">{orderList.filter(o => o.status === 'processing' || o.status === 'pending').length}</h3>
                             <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md mb-1">-2.5%</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Order Management Table */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                       <h3 className="text-lg font-bold text-gray-900">Order Management</h3>
                       <div className="flex gap-3">
                          <button 
                            onClick={handleExportOrders}
                            className="bg-gray-100 text-gray-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Export CSV
                          </button>
                          <button onClick={() => alert('Filtering feature coming soon!')} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                             Filter
                          </button>
                       </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/50 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                            <th className="py-4 px-6 font-semibold">Order ID</th>
                            <th className="py-4 px-6 font-semibold">Customer</th>
                            <th className="py-4 px-6 font-semibold">Date</th>
                            <th className="py-4 px-6 font-semibold">Status</th>
                            <th className="py-4 px-6 font-semibold">Total</th>
                            <th className="py-4 px-6 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredOrders.slice(0, tab === 'orders' ? 5 : undefined).map((o) => (
                            <tr key={o.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => setSelectedOrder(o)}>
                              <td className="py-4 px-6">
                                 <span className="font-semibold text-gray-900">#ORD-{o.order_number}</span>
                              </td>
                              <td className="py-4 px-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                       <img src={`https://ui-avatars.com/api/?name=${o.shipping_name}&background=random`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-semibold text-gray-700">{o.shipping_name}</span>
                                 </div>
                              </td>
                              <td className="py-4 px-6 text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                              <td className="py-4 px-6">
                                 <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex inline-flex items-center gap-1.5 w-fit
                                    ${o.status === 'delivered' ? 'bg-green-50 text-green-700' : 
                                      o.status === 'shipped' ? 'bg-blue-50 text-blue-700' : 
                                      o.status === 'pending' || o.status === 'processing' ? 'bg-yellow-50 text-yellow-700' : 
                                      'bg-gray-100 text-gray-600'}`
                                 }>
                                    <span className={`w-1.5 h-1.5 rounded-full ${o.status === 'delivered' ? 'bg-green-500' : o.status === 'shipped' ? 'bg-blue-500' : o.status === 'pending' || o.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-400'}`}></span>
                                    {o.status.toUpperCase()}
                                 </span>
                              </td>
                              <td className="py-4 px-6 font-bold text-gray-900">{formatPrice(o.total_price)}</td>
                              <td className="py-4 px-6 text-right">
                                 <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }} className="text-gray-400 hover:text-gray-900 transition-colors">
                                    <svg className="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                 </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-4 border-t border-gray-100 bg-gray-50/30 text-center">
                       <button onClick={() => setTab('orders')} className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">View All Transactions</button>
                    </div>
                  </div>

                  {/* Bottom Grid: Custom Requests & Stock Alerts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     {/* Recent Custom Requests */}
                     <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-lg font-bold text-gray-900">Recent Custom Requests</h3>
                           <button onClick={() => setTab('custom-requests')} className="text-sm font-semibold text-yellow-600 hover:text-yellow-700">View All</button>
                        </div>
                        <div className="space-y-4">
                           {filteredRequests.slice(0, 3).map((r) => (
                              <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                 <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                                    {/* Placeholder for custom request image if available, else a generic icon */}
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 text-sm truncate">{r.name}</h4>
                                    <p className="text-xs text-gray-500 truncate mb-1">{r.description}</p>
                                    <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400">
                                       <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> {r.email}</span>
                                       <span>•</span>
                                       <span>{new Date(r.created_at).toLocaleDateString()}</span>
                                    </div>
                                 </div>
                                  <div className="flex-shrink-0 ml-4">
                                     <button onClick={() => setTab('custom-requests')} className="text-sm font-semibold text-yellow-600 bg-yellow-50 hover:bg-yellow-100 px-4 py-2 rounded-lg transition-colors">Review Specs</button>
                                  </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Stock Alerts */}
                     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-lg font-bold text-gray-900">Stock Alerts</h3>
                           <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{lowStockAlerts.length} Issues</span>
                        </div>
                        <div className="space-y-4">
                           {lowStockAlerts.slice(0, 4).map(p => (
                              <div key={p.id} className="flex items-center gap-3">
                                 <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={p.image || 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80'} alt="" className="w-full h-full object-cover" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                                    <p className="text-xs font-semibold text-red-500">{p.stock} units left</p>
                                 </div>
                                  <Link to={`/admin/products/${p.id}`} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${p.stock === 0 ? 'bg-red-50 text-red-600 hover:bg-red-100 shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>
                                     {p.stock === 0 ? 'Urgent' : 'Restock'}
                                  </Link>
                              </div>
                           ))}
                           {lowStockAlerts.length === 0 && (
                              <div className="text-center py-8 text-gray-400 text-sm">
                                 No low stock alerts.
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {tab === 'custom-requests' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Custom Requests</h2>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      {filteredRequests.map((r) => (
                        <div key={r.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-3">
                               <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700">{r.furniture_type}</span>
                               <span className="text-xs font-semibold text-gray-400">Budget: {r.budget}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{r.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{r.description}</p>
                            <p className="text-xs font-semibold text-gray-400">{r.email}</p>
                          </div>
                          <div className="flex items-center gap-3">
                             <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${r.status === 'completed' ? 'bg-green-50 text-green-600' : r.status === 'in_progress' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{r.status?.replace('_', ' ').toUpperCase()}</span>
                             <div className="flex gap-2">
                                {r.status !== 'in_progress' && r.status !== 'completed' && (
                                   <button onClick={() => handleCustomRequestStatus(r.id, 'in_progress')} className="text-[10px] font-bold text-blue-600 hover:underline uppercase">Start</button>
                                )}
                                {r.status !== 'completed' && (
                                   <button onClick={() => handleCustomRequestStatus(r.id, 'completed')} className="text-[10px] font-bold text-green-600 hover:underline uppercase">Complete</button>
                                )}
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'reviews' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      {filteredReviews.map((r) => (
                        <div key={r.id} className="p-6 hover:bg-gray-50/50 transition-colors flex justify-between items-start gap-6">
                          <div className="flex-1 space-y-2">
                             <div className="flex items-center gap-4">
                                <div className="flex text-yellow-500">
                                   {[...Array(5)].map((_, i) => (
                                     <svg key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                                   ))}
                                </div>
                                <span className="text-xs font-semibold text-gray-400">for {r.product?.name}</span>
                             </div>
                             <p className="text-sm font-semibold text-gray-900">"{r.comment}"</p>
                             <p className="text-xs font-semibold text-gray-400">By {r.user?.name}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.approved ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                               {r.approved ? 'Approved' : 'Pending'}
                             </span>
                             <div className="flex gap-3 pt-1">
                               {!r.approved ? (
                                 <button onClick={() => handleReviewAction(r.id, true)} className="text-xs font-semibold text-green-600 hover:text-green-700">Approve</button>
                               ) : (
                                 <button onClick={() => handleReviewAction(r.id, false)} className="text-xs font-semibold text-yellow-600 hover:text-yellow-700">Reject</button>
                               )}
                               <button onClick={() => deleteReview(r.id)} className="text-xs font-semibold text-red-500 hover:text-red-600">Delete</button>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'coupons' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <h2 className="text-2xl font-bold text-gray-900">Coupons</h2>
                     <Link to="/admin/coupons/new" className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Create Coupon
                     </Link>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/50 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                            <th className="py-4 px-6 font-semibold">Code</th>
                            <th className="py-4 px-6 font-semibold">Type</th>
                            <th className="py-4 px-6 font-semibold">Value</th>
                            <th className="py-4 px-6 font-semibold">Expiry</th>
                            <th className="py-4 px-6 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredCoupons.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-4 px-6 font-mono font-bold text-gray-900 uppercase">{c.code}</td>
                              <td className="py-4 px-6 text-sm text-gray-500 capitalize">{c.type?.replace('_', ' ')}</td>
                              <td className="py-4 px-6 font-bold text-gray-900">{c.type === 'percentage' ? `${c.value}%` : formatPrice(c.value)}</td>
                              <td className="py-4 px-6 text-sm text-gray-500">{c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : 'No Expiry'}</td>
                              <td className="py-4 px-6 text-right space-x-4">
                                <Link to={`/admin/coupons/${c.id}`} className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 transition-colors">Edit</Link>
                                <button onClick={() => deleteCoupon(c.id)} className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'tickets' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/50 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                            <th className="py-4 px-6 font-semibold">Customer</th>
                            <th className="py-4 px-6 font-semibold">Subject</th>
                            <th className="py-4 px-6 font-semibold">Priority</th>
                            <th className="py-4 px-6 font-semibold">Status</th>
                            <th className="py-4 px-6 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredTickets.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-4 px-6 font-semibold text-gray-900">{t.user?.name}</td>
                              <td className="py-4 px-6 text-sm text-gray-500 truncate max-w-xs">{t.subject}</td>
                              <td className="py-4 px-6">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.priority === 'high' ? 'bg-red-50 text-red-600' : t.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>{t.priority?.toUpperCase()}</span>
                              </td>
                              <td className="py-4 px-6">
                                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.status === 'resolved' || t.status === 'closed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{t.status?.toUpperCase()}</span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                 <button onClick={() => setSelectedTicket(t)} className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 transition-colors">View</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'returns' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Return Requests</h2>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      {filteredReturns.map((r) => (
                        <div key={r.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-3">
                               <span className="text-xs font-semibold text-gray-400">Order #{r.order?.order_number}</span>
                               <span className="text-xs text-gray-300">|</span>
                               <span className="text-xs font-semibold text-gray-400">#{r.id.toString().padStart(5, '0')}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{r.order?.user?.name}</h3>
                            <p className="text-sm text-gray-500">{r.reason}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                             <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${r.status === 'approved' ? 'bg-green-50 text-green-600' : r.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>{r.status?.toUpperCase()}</span>
                             {r.status === 'pending' && (
                                <div className="flex gap-3 pt-1">
                                   <button onClick={() => handleReturnAction(r.id, 'approved')} className="text-xs font-semibold text-green-600 hover:text-green-700">Approve</button>
                                   <button onClick={() => handleReturnAction(r.id, 'rejected')} className="text-xs font-semibold text-red-500 hover:text-red-600">Reject</button>
                                </div>
                             )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'users' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Client Registry</h2>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/50 text-[11px] uppercase font-bold text-gray-400 tracking-wider">
                            <th className="py-4 px-6">Client</th>
                            <th className="py-4 px-6">Email</th>
                            <th className="py-4 px-6">Role</th>
                            <th className="py-4 px-6">Joined Date</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold text-xs">
                                    {u.name.charAt(0)}
                                  </div>
                                  <span className="font-semibold text-gray-900">{u.name}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-sm text-gray-500">{u.email}</td>
                              <td className="py-4 px-6">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.is_admin ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                  {u.is_admin ? 'Admin' : 'Customer'}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                              <td className="py-4 px-6 text-right space-x-4">
                                <button onClick={() => fetchUserDetails(u.id)} className="text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase">
                                  View
                                </button>
                                <button onClick={() => toggleAdmin(u)} className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors uppercase">
                                  {u.is_admin ? 'Demote' : 'Make Admin'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'shipping-methods' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-gray-900">
                    <h2 className="text-2xl font-bold">Shipping Methods</h2>
                    <button onClick={() => setShippingModal({ open: true, data: { name: '', price: '', estimated_days: '' } })} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      Add Method
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="divide-y divide-gray-50">
                      {shippingMethods.map((m) => (
                        <div key={m.id} className="p-6 hover:bg-gray-50/50 transition-colors flex justify-between items-center">
                          <div className="space-y-1">
                            <h4 className="font-bold text-gray-900">{m.name}</h4>
                            <p className="text-xs text-gray-500">Estimated delivery: {m.estimated_days} days</p>
                          </div>
                          <div className="flex items-center gap-6">
                             <span className="font-bold text-gray-900">{formatPrice(m.price)}</span>
                             <div className="flex gap-3">
                                <button onClick={() => setShippingModal({ open: true, data: m })} className="text-xs font-bold text-yellow-600 hover:text-yellow-700 transition-colors uppercase">Edit</button>
                                <button onClick={() => deleteShippingMethod(m.id)} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase">Delete</button>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'settings' && (
                <div className="max-w-4xl space-y-8">
                   <header className="space-y-1">
                      <h2 className="text-2xl font-bold text-gray-900">Shop Settings</h2>
                      <p className="text-sm text-gray-500 font-medium">Configure your commercial presence and social links.</p>
                   </header>
                   
                   <form onSubmit={handleSettingsSubmit} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                         <div className="space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Contact Information</h3>
                            <div className="space-y-4">
                               <div className="space-y-1">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Shop Name</label>
                                  <input type="text" className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-900 text-sm focus:border-yellow-400 focus:ring-0 transition-all outline-none" value={settings.shop_name} onChange={e => setSettings({...settings, shop_name: e.target.value})} />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Support Email</label>
                                  <input type="email" className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-900 text-sm focus:border-yellow-400 focus:ring-0 transition-all outline-none" value={settings.shop_email} onChange={e => setSettings({...settings, shop_email: e.target.value})} />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                  <input type="text" className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-900 text-sm focus:border-yellow-400 focus:ring-0 transition-all outline-none" value={settings.shop_phone} onChange={e => setSettings({...settings, shop_phone: e.target.value})} />
                               </div>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Social Presence</h3>
                            <div className="space-y-4">
                               <div className="space-y-1">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Instagram URL</label>
                                  <input type="text" placeholder="https://instagram.com/..." className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-900 text-sm focus:border-yellow-400 focus:ring-0 transition-all outline-none" value={settings.instagram_url} onChange={e => setSettings({...settings, instagram_url: e.target.value})} />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Facebook URL</label>
                                  <input type="text" placeholder="https://facebook.com/..." className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-900 text-sm focus:border-yellow-400 focus:ring-0 transition-all outline-none" value={settings.facebook_url} onChange={e => setSettings({...settings, facebook_url: e.target.value})} />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-xs font-bold text-gray-500 uppercase">Physical Address</label>
                                  <textarea className="w-full h-24 bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-900 text-sm focus:border-yellow-400 focus:ring-0 transition-all outline-none resize-none" value={settings.shop_address} onChange={e => setSettings({...settings, shop_address: e.target.value})} />
                               </div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex justify-end pt-8">
                         <button type="submit" className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95">Save Changes</button>
                      </div>
                   </form>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>
      <AnimatePresence>
          {selectedTicket && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center px-6">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedTicket(null)} />
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 relative shadow-2xl">
                <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <header className="mb-8 space-y-3">
                   <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedTicket.status === 'resolved' || selectedTicket.status === 'closed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>{selectedTicket.status?.toUpperCase()}</span>
                      <span className="text-xs font-semibold text-gray-400">Support Ticket</span>
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900">{selectedTicket.subject}</h3>
                   <div className="flex gap-2">
                      {['open', 'in_progress', 'resolved', 'closed'].map(s => (
                         <button key={s} onClick={() => handleTicketAction(selectedTicket.id, s)} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${selectedTicket.status === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{s.replace('_', ' ')}</button>
                      ))}
                   </div>
                </header>

                <div ref={scrollRef} className="space-y-4 mb-8 max-h-80 overflow-y-auto pr-2">
                   {selectedTicket.messages?.map((m) => (
                      <div key={m.id} className={`flex ${m.user_id === user.id ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[80%] p-4 rounded-2xl ${m.user_id === user.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
                            <p className="text-sm leading-relaxed">{m.message}</p>
                            <span className="text-[10px] font-semibold opacity-50 block mt-2">{new Date(m.created_at).toLocaleString()}</span>
                         </div>
                      </div>
                   ))}
                </div>

                <form onSubmit={handleTicketReply} className="space-y-3 pt-6 border-t border-gray-100">
                   <textarea value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)} className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-0 text-sm resize-none" placeholder="Type your reply..." required />
                   <button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white w-full py-3 rounded-xl font-semibold transition-colors">Send Reply</button>
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
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 relative shadow-2xl"
              >
                <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <header className="mb-8 space-y-2">
                   <span className="text-xs font-bold text-yellow-600">Order Details</span>
                   <h3 className="text-2xl font-bold text-gray-900">#{selectedOrder.order_number}</h3>
                   <div className="flex gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedOrder.status === 'delivered' ? 'bg-green-50 text-green-600' : selectedOrder.status === 'shipped' ? 'bg-blue-50 text-blue-600' : 'bg-yellow-50 text-yellow-600'}`}>Status: {selectedOrder.status?.toUpperCase()}</span>
                      {selectedOrder.confirmed_at && <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">Confirmed {new Date(selectedOrder.confirmed_at).toLocaleDateString()}</span>}
                   </div>
                </header>

                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <section>
                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shipping Details</h4>
                         <div className="space-y-1 text-sm text-gray-700">
                            <p className="font-bold text-gray-900">{selectedOrder.shipping_name}</p>
                            <p>{selectedOrder.shipping_address}, {selectedOrder.shipping_city}, {selectedOrder.shipping_country}</p>
                            <p className="text-gray-400 font-mono text-xs">{selectedOrder.shipping_phone}</p>
                         </div>
                      </section>

                      <section>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Summary</h4>
                        <div className="space-y-2 bg-gray-50 p-5 rounded-xl">
                           <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Subtotal</span>
                              <span className="font-semibold text-gray-900">{formatPrice(selectedOrder.subtotal)}</span>
                           </div>
                           <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Shipping</span>
                              <span className="font-semibold text-gray-900">{formatPrice(selectedOrder.shipping_cost)}</span>
                           </div>
                           {selectedOrder.discount_amount > 0 && (
                              <div className="flex justify-between text-sm text-red-500">
                                 <span>Discount</span>
                                 <span className="font-semibold">-{formatPrice(selectedOrder.discount_amount)}</span>
                              </div>
                           )}
                           <div className="pt-2 border-t border-gray-200 flex justify-between">
                              <span className="text-base font-bold text-gray-900">Total</span>
                              <span className="text-xl font-bold text-gray-900">{formatPrice(selectedOrder.total_price)}</span>
                           </div>
                        </div>
                      </section>
                   </div>

                   <div className="space-y-6">
                      <section>
                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Actions</h4>
                         <div className="grid gap-3">
                            {selectedOrder.status === 'pending' && (
                               <button onClick={() => handleOrderAction(selectedOrder.id, 'confirm')} className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-xl font-semibold transition-colors">Confirm Order</button>
                            )}
                            {!['delivered', 'cancelled', 'returned'].includes(selectedOrder.status) && (
                               <button onClick={() => handleOrderAction(selectedOrder.id, 'cancel')} className="bg-red-500 hover:bg-red-600 text-white w-full py-3 rounded-xl font-semibold transition-colors">Cancel Order</button>
                            )}
                            {selectedOrder.status === 'delivered' && !selectedOrder.refund_status && (
                               <button onClick={() => setRefundModal({ ...refundModal, open: true, amount: selectedOrder.total_price })} className="bg-yellow-500 hover:bg-yellow-600 text-white w-full py-3 rounded-xl font-semibold transition-colors">Issue Refund</button>
                            )}
                         </div>
                      </section>

                      {refundModal.open && (
                         <section className="bg-gray-50 p-6 rounded-xl space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Refund Details</h4>
                            <div className="space-y-3">
                               <div className="space-y-1">
                                  <label className="text-xs font-semibold text-gray-500">Amount</label>
                                  <input 
                                     type="number" 
                                     value={refundModal.amount} 
                                     onChange={(e) => setRefundModal({...refundModal, amount: e.target.value})}
                                     className="w-full p-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-0 text-sm"
                                  />
                               </div>
                               <div className="space-y-1">
                                  <label className="text-xs font-semibold text-gray-500">Reason</label>
                                  <textarea 
                                     value={refundModal.reason} 
                                     onChange={(e) => setRefundModal({...refundModal, reason: e.target.value})}
                                     className="w-full h-20 p-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-0 text-sm resize-none"
                                     placeholder="Reason for refund..."
                                  />
                               </div>
                               <div className="flex gap-3">
                                  <button onClick={() => setRefundModal({...refundModal, open: false})} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                                  <button onClick={() => handleOrderAction(selectedOrder.id, 'refund', { amount: refundModal.amount, reason: refundModal.reason })} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-yellow-500 hover:bg-yellow-600 transition-colors">Authorize</button>
                               </div>
                            </div>
                         </section>
                      )}

                      {selectedOrder.refund_status === 'processed' && (
                         <div className="bg-green-50 p-5 rounded-xl border border-green-100 space-y-1">
                            <p className="text-xs font-bold text-green-600">Refund Processed</p>
                            <p className="text-lg font-bold text-gray-900">{formatPrice(selectedOrder.refund_amount)}</p>
                            <p className="text-xs text-gray-500">{selectedOrder.refund_reason}</p>
                         </div>
                      )}
                   </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Order Items</h4>
                   <div className="space-y-3">
                      {selectedOrder.items?.map((item) => (
                         <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                  <img src={item.product?.image || 'https://placehold.co/150'} className="w-full h-full object-cover" />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-gray-900">{item.product?.name}</p>
                                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                               </div>
                            </div>
                            <p className="font-bold text-gray-900">{formatPrice(item.unit_price)}</p>
                         </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            </motion.div>
          )}
          {selectedUser && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center px-6">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 relative shadow-2xl">
                <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <header className="mb-8 space-y-2">
                   <span className="text-xs font-bold text-yellow-600 uppercase tracking-widest">Customer Profile</span>
                   <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-yellow-50 text-yellow-600 flex items-center justify-center font-bold text-2xl shadow-sm">
                        {selectedUser.name?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                      </div>
                   </div>
                </header>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                   <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Details</h4>
                      <div className="space-y-3">
                         <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Phone</p>
                            <p className="text-sm font-semibold text-gray-900">{selectedUser.phone || 'Not provided'}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Role</p>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedUser.is_admin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                               {selectedUser.is_admin ? 'Administrator' : 'Customer'}
                            </span>
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Joined</p>
                            <p className="text-sm font-semibold text-gray-900">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                         </div>
                      </div>
                   </div>

                   <div className="md:col-span-2 space-y-6">
                      <section>
                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex justify-between items-center">
                            Recent Orders
                            <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">{selectedUser.orders?.length || 0} Total</span>
                         </h4>
                         <div className="space-y-3">
                            {selectedUser.orders?.map(o => (
                               <div key={o.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow cursor-default">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                     </div>
                                     <div>
                                        <p className="text-sm font-bold text-gray-900">#ORD-{o.order_number}</p>
                                        <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString()}</p>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-sm font-bold text-gray-900">{formatPrice(o.total_price)}</p>
                                     <span className={`text-[10px] font-bold uppercase ${o.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{o.status}</span>
                                  </div>
                               </div>
                            ))}
                            {(!selectedUser.orders || selectedUser.orders.length === 0) && (
                               <p className="text-sm text-gray-400 italic py-4 text-center border-2 border-dashed border-gray-100 rounded-2xl">No orders found for this customer.</p>
                            )}
                         </div>
                      </section>

                      <div className="grid md:grid-cols-2 gap-6">
                         <section>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Reviews</h4>
                            <div className="space-y-3">
                               {selectedUser.reviews?.map(r => (
                                  <div key={r.id} className="p-3 bg-gray-50 rounded-xl">
                                     <div className="flex items-center justify-between mb-1">
                                        <div className="flex text-yellow-400 scale-75 origin-left">
                                           {[...Array(5)].map((_, i) => (
                                              <svg key={i} className={`w-4 h-4 ${i < r.rating ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                                           ))}
                                        </div>
                                        <span className="text-[10px] font-semibold text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                                     </div>
                                     <p className="text-xs font-bold text-gray-900 mb-1 truncate">{r.product?.name}</p>
                                     <p className="text-[11px] text-gray-500 line-clamp-2 italic">"{r.comment}"</p>
                                  </div>
                               ))}
                               {(!selectedUser.reviews || selectedUser.reviews.length === 0) && (
                                  <p className="text-xs text-gray-400 italic py-4 text-center border border-gray-100 rounded-xl">No reviews yet.</p>
                               )}
                            </div>
                         </section>

                         <section>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Support Tickets</h4>
                            <div className="space-y-3">
                               {selectedUser.tickets?.map(t => (
                                  <div key={t.id} className="p-3 bg-white border border-gray-100 rounded-xl flex justify-between items-center">
                                     <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-900 truncate">{t.subject}</p>
                                        <p className="text-[10px] text-gray-400">{new Date(t.created_at).toLocaleDateString()}</p>
                                     </div>
                                     <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase flex-shrink-0 ml-2 ${t.status === 'resolved' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {t.status}
                                     </span>
                                  </div>
                               ))}
                               {(!selectedUser.tickets || selectedUser.tickets.length === 0) && (
                                  <p className="text-xs text-gray-400 italic py-4 text-center border border-gray-100 rounded-xl">No tickets found.</p>
                               )}
                            </div>
                         </section>
                      </div>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {shippingModal.open && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShippingModal({ ...shippingModal, open: false })} />
                <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-md rounded-2xl p-8 relative shadow-2xl">
                   <h3 className="text-xl font-bold text-gray-900 mb-6">{shippingModal.data.id ? 'Edit' : 'Add'} Shipping Method</h3>
                   <form onSubmit={handleShippingSubmit} className="space-y-4">
                      <div className="space-y-1">
                         <label className="text-xs font-bold text-gray-500 uppercase">Method Name</label>
                         <input type="text" required placeholder="Standard Delivery" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none" value={shippingModal.data.name} onChange={e => setShippingModal({ ...shippingModal, data: { ...shippingModal.data, name: e.target.value } })} />
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs font-bold text-gray-500 uppercase">Price (MAD)</label>
                         <input type="number" required placeholder="0" className="w-full bg-white border-2 border-gray-100 rounded-2xl px-5 py-4 text-gray-900 text-sm focus:border-yellow-400 focus:ring-0 transition-all outline-none" value={shippingModal.data.price} onChange={e => setShippingModal({ ...shippingModal, data: { ...shippingModal.data, price: e.target.value } })} />
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs font-bold text-gray-500 uppercase">Est. Days</label>
                         <input type="number" required placeholder="3-5" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none" value={shippingModal.data.estimated_days} onChange={e => setShippingModal({ ...shippingModal, data: { ...shippingModal.data, estimated_days: e.target.value } })} />
                      </div>
                      <div className="flex gap-3 pt-4">
                         <button type="button" onClick={() => setShippingModal({ ...shippingModal, open: false })} className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">Cancel</button>
                         <button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition-all shadow-sm">Save Method</button>
                      </div>
                   </form>
                </motion.div>
             </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}
