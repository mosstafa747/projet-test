import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    bg: 'bg-yellow-50', text: 'text-yellow-600', dot: 'bg-yellow-400', pulse: true  },
  processing: { label: 'Processing', bg: 'bg-orange-50', text: 'text-orange-500', dot: 'bg-orange-400', pulse: true  },
  shipped:    { label: 'Shipped',    bg: 'bg-blue-50',   text: 'text-blue-600',   dot: 'bg-blue-400',   pulse: false },
  delivered:  { label: 'Delivered',  bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500',  pulse: false },
  cancelled:  { label: 'Cancelled',  bg: 'bg-red-50',    text: 'text-red-500',    dot: 'bg-red-400',    pulse: false },
  returned:   { label: 'Returned',   bg: 'bg-gray-100',  text: 'text-gray-500',   dot: 'bg-gray-400',   pulse: false },
};

const FILTERS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </span>
  );
}

export default function Orders() {
  const user = useAuthStore((s) => s.user);
  const { formatPrice } = useCurrencyStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    api.get('/orders').then((r) => {
      const data = r.data.data || r.data;
      setOrders(Array.isArray(data) ? data : data?.data || []);
    }).finally(() => setLoading(false));
  }, [user]);

  const filtered = useMemo(() => {
    let list = orders;
    if (filter !== 'All') list = list.filter(o => o.status === filter.toLowerCase());
    if (search.trim()) list = list.filter(o => o.order_number?.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [orders, filter, search]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-[#F8F8F6]">
        <div className="bg-white border border-gray-100 shadow-sm p-12 rounded-2xl text-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Please sign in to view your orders.</p>
          <Link to="/login" className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F6] min-h-screen pb-20">

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <nav className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold mb-1 flex gap-2">
                <Link to="/" className="hover:text-gray-600 transition">Home</Link>
                <span>/</span>
                <Link to="/profile" className="hover:text-gray-600 transition">Account</Link>
                <span>/</span>
                <span>Orders</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Orders</h1>
              <p className="text-sm text-gray-400 mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
            </div>
            <Link to="/products" className="shrink-0 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              + New Order
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                  filter === f
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="sm:ml-auto flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 min-w-[200px]">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search order ID..."
              className="bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 w-full"
            />
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 h-28 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-800 mb-1">No orders found</h2>
            <p className="text-sm text-gray-400 mb-6">
              {search || filter !== 'All' ? 'Try adjusting your filters.' : 'You haven\'t placed any orders yet.'}
            </p>
            <Link to="/products" className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition">
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {filtered.map((order, idx) => {
                const itemCount = order.items?.length || 0;
                const firstImg = order.items?.[0]?.product?.images?.[0];
                const date = new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">

                      {/* Thumbnail */}
                      <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                        {firstImg ? (
                          <img src={firstImg} alt="Product" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Order Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">#{order.order_number}</span>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                          {itemCount} item{itemCount !== 1 ? 's' : ''}
                          {order.items?.[0]?.product?.name && (
                            <span className="text-gray-400 font-normal"> · {order.items[0].product.name}{itemCount > 1 ? ` +${itemCount - 1} more` : ''}</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">Ordered {date}</p>
                      </div>

                      {/* Price */}
                      <div className="shrink-0 text-center sm:text-right">
                        <p className="text-lg font-extrabold text-gray-900">{formatPrice(order.total_price)}</p>
                        {order.payment_status && (
                          <p className={`text-[11px] font-semibold capitalize mt-0.5 ${order.payment_status === 'paid' ? 'text-green-500' : 'text-orange-400'}`}>
                            {order.payment_status}
                          </p>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="shrink-0">
                        <Link
                          to={`/orders/${order.id}`}
                          className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all duration-200"
                        >
                          View Details
                          <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    {/* Progress bar for active orders */}
                    {['pending','processing','shipped'].includes(order.status) && (
                      <div className="px-5 pb-4">
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-semibold">
                          {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                            const stepIdx = { pending: 0, processing: 1, shipped: 2, delivered: 3 }[order.status] ?? 0;
                            const active = i <= stepIdx;
                            return (
                              <div key={step} className="flex items-center gap-2">
                                <span className={`${active ? 'text-gray-800' : 'text-gray-300'}`}>{step}</span>
                                {i < 3 && <div className={`w-6 h-px ${active && i < stepIdx ? 'bg-gray-800' : 'bg-gray-200'}`} />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
