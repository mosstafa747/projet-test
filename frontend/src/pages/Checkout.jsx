import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useCurrencyStore } from '../store/useCurrencyStore';
import api from '../lib/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const { formatPrice } = useCurrencyStore();
  
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errors, setErrors] = useState({});
  
  const [form, setForm] = useState({
    shipping_name: user?.name || '',
    shipping_phone: user?.phone || '',
    shipping_address: user?.address || '',
    shipping_city: user?.city || '',
    shipping_country: 'Morocco',
    payment_method: 'cash',
    delivery_method: 'standard',
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const subtotal = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);
  const shippingCost = subtotal >= 5000 || appliedCoupon?.type === 'free_shipping' ? 0 : 45;
  const discountAmount = appliedCoupon?.type === 'fixed' ? Number(appliedCoupon.value) : 
                        appliedCoupon?.type === 'percentage' ? (subtotal * Number(appliedCoupon.value) / 100) : 0;
  const finalTotal = Math.max(0, subtotal + shippingCost - discountAmount);

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, amount: subtotal });
      setAppliedCoupon(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.shipping_name.trim()) newErrors.shipping_name = "Full name is required";
    if (!form.shipping_phone.trim()) newErrors.shipping_phone = "Phone number is required";
    if (!form.shipping_address.trim()) newErrors.shipping_address = "Address is required";
    if (!form.shipping_city.trim()) newErrors.shipping_city = "City is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
       window.scrollTo({ top: 0, behavior: 'smooth' });
       return;
    }
    
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
        coupon_code: appliedCoupon?.code,
        ...form,
      };
      const { data: order } = await api.post('/orders', payload);
      
      if (form.payment_method === 'card') {
        const { data: session } = await api.post('/payment/stripe-session', { order_id: order.id });
        window.location.href = session.url;
        return;
      }

      setOrderId(order.order_number || order.id);
      clearCart();
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !isSuccess) {
    navigate('/cart');
    return null;
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <motion.div 
          className="max-w-md w-full text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-gray-900 leading-tight">Order Confirmed!</h1>
            <p className="text-gray-500 font-medium tracking-tight">Your order #<span className="text-emerald-600 font-bold">{orderId}</span> is now being prepared. We'll contact you shortly for delivery.</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center border-b border-gray-100">
         <Link to="/" className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E62E04] rounded-lg"></div>
            Beldi Express
         </Link>
         <Link to="/cart" className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Cart
         </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-12">
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Shipping Information</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Hassan Benali"
                      value={form.shipping_name}
                      onChange={(e) => update('shipping_name', e.target.value)}
                      className={`w-full bg-gray-50 border-2 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:bg-white focus:border-[#E62E04] transition-all outline-none ${errors.shipping_name ? 'border-red-500 bg-red-50/30' : 'border-gray-50'}`}
                    />
                    {errors.shipping_name && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.shipping_name}</p>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="06 XX XX XX XX"
                      value={form.shipping_phone}
                      onChange={(e) => update('shipping_phone', e.target.value)}
                      className={`w-full bg-gray-50 border-2 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:bg-white focus:border-[#E62E04] transition-all outline-none ${errors.shipping_phone ? 'border-red-500 bg-red-50/30' : 'border-gray-50'}`}
                    />
                    {errors.shipping_phone && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.shipping_phone}</p>}
                 </div>
                 <div className="space-y-2 sm:col-span-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Full Address</label>
                    <input
                      type="text"
                      placeholder="Street name, Apartment number, Landmark"
                      value={form.shipping_address}
                      onChange={(e) => update('shipping_address', e.target.value)}
                      className={`w-full bg-gray-50 border-2 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:bg-white focus:border-[#E62E04] transition-all outline-none ${errors.shipping_address ? 'border-red-500 bg-red-50/30' : 'border-gray-50'}`}
                    />
                    {errors.shipping_address && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.shipping_address}</p>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Casablanca"
                      value={form.shipping_city}
                      onChange={(e) => update('shipping_city', e.target.value)}
                      className={`w-full bg-gray-50 border-2 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:bg-white focus:border-[#E62E04] transition-all outline-none ${errors.shipping_city ? 'border-red-500 bg-red-50/30' : 'border-gray-50'}`}
                    />
                    {errors.shipping_city && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.shipping_city}</p>}
                 </div>
              </div>
            </section>

            {/* Hardcoded Payment Method - Simple System */}
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Payment Method</h2>
              <div className="flex items-center gap-5 p-6 rounded-3xl border-2 border-[#E62E04] bg-red-50/10">
                 <div className="w-6 h-6 rounded-full border-2 border-[#E62E04] flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#E62E04] rounded-full" />
                 </div>
                 <div className="flex-1">
                    <p className="font-black text-gray-900 uppercase text-sm tracking-wide">Cash on Delivery</p>
                    <p className="text-xs text-gray-500 font-bold tracking-tight">Pay safely at your doorstep</p>
                 </div>
                 <svg className="w-8 h-8 text-[#E62E04]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-8">
             <div className="bg-gray-50 rounded-[40px] p-8 md:p-10 space-y-10 border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Order Summary</h2>
                
                {/* Product List */}
                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                   {items.map((i) => (
                      <div key={i.productId} className="flex gap-4">
                         <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex-shrink-0 overflow-hidden">
                            <img src={i.product.images?.[0] || 'https://placehold.co/100'} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1">
                            <p className="font-bold text-gray-900 leading-tight line-clamp-2">{i.product.name}</p>
                            <p className="text-xs text-gray-400 font-black tracking-widest uppercase mt-1">QTY: {i.quantity} × {formatPrice(i.product.price)}</p>
                         </div>
                      </div>
                   ))}
                </div>

                {/* Promo Code */}
                <div className="space-y-3">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Gift Certificate or Coupon</p>
                   <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="ENTER CODE"
                        className="flex-1 bg-white border border-gray-200 rounded-2xl px-5 py-3 font-bold text-sm tracking-widest outline-none focus:border-[#E62E04] transition-all"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={appliedCoupon}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || appliedCoupon || !couponCode}
                        className="bg-gray-900 text-white px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-30"
                      >
                        {validatingCoupon ? '...' : 'Apply'}
                      </button>
                   </div>
                   {appliedCoupon && (
                      <div className="flex items-center justify-between px-2">
                         <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Coupon Applied
                         </span>
                         <button onClick={() => {setAppliedCoupon(null); setCouponCode('');}} className="text-red-500 text-[9px] font-black uppercase hover:underline">Remove</button>
                      </div>
                   )}
                </div>

                {/* Totals */}
                <div className="space-y-4 pt-6 border-t border-gray-200/60">
                   <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                      <span>Subtotal</span>
                      <span className="text-gray-900">{formatPrice(subtotal)}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                      <span>Shipping Fee</span>
                      <span className={shippingCost === 0 ? 'text-[#00A854]' : 'text-gray-900'}>
                         {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                      </span>
                   </div>
                   {appliedCoupon && (
                      <div className="flex justify-between items-center text-sm font-bold text-[#00A854]">
                         <span>Discount</span>
                         <span>-{formatPrice(discountAmount)}</span>
                      </div>
                   )}
                   <div className="pt-6 border-t border-gray-200/60 flex justify-between items-end">
                      <div>
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total to Pay</p>
                         <p className="text-5xl font-black text-gray-900 tracking-tighter">{formatPrice(finalTotal)}</p>
                      </div>
                   </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4 ${
                     form.payment_method === 'cash' ? 'bg-[#E62E04] text-white shadow-red-200' : 'bg-[#00A854] text-white shadow-emerald-200'
                  }`}
                >
                  {loading ? (
                     <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                     <>{form.payment_method === 'cash' ? 'Place Order (COD)' : 'Secure Pay & Order'}</>
                  )}
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
