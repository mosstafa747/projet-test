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
  const { formatPrice, currency } = useCurrencyStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [form, setForm] = useState({
    shipping_name: user?.name || '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_country: '',
    delivery_method: '',
    payment_method: 'cash',
  });
  const [shippingMethods, setShippingMethods] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    api.get('/shipping-methods').then((r) => {
      setShippingMethods(r.data);
      if (r.data.length > 0) {
        setForm(f => ({ ...f, delivery_method: r.data[0].id.toString() }));
      }
    });
  }, []);

  const selectedMethod = shippingMethods.find(m => m.id.toString() === form.delivery_method);
  const subtotal = items.reduce((s, i) => s + (i.variant ? Number(i.variant.price_modifier) + Number(i.product.price) : Number(i.product.price)) * Number(i.quantity), 0);
  const shippingCost = appliedCoupon?.type === 'free_shipping' ? 0 : (selectedMethod?.price || 0);
  const discountAmount = appliedCoupon?.type === 'fixed' ? Number(appliedCoupon.value) : 
                        appliedCoupon?.type === 'percentage' ? (subtotal * Number(appliedCoupon.value) / 100) : 0;

  const taxRate = form.shipping_country?.toLowerCase() !== 'morocco' ? 0.20 : 0;
  const taxAmount = subtotal * taxRate;
  const finalTotal = Math.max(0, Number(subtotal) + Number(shippingCost) + taxAmount - (appliedCoupon?.type === 'free_shipping' ? 0 : discountAmount));

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, amount: subtotal });
      setAppliedCoupon(data.coupon);
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleSubmit = async () => {
    if (step < 4) {
      setStep((s) => s + 1);
      window.scrollTo(0, 0);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        items: items.map((i) => ({ 
          product_id: i.productId, 
          product_variant_id: i.variantId || null, 
          quantity: i.quantity 
        })),
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
      setStep(5);
    } catch (err) {
      alert(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step < 5) {
    navigate('/cart');
    return null;
  }

  if (step === 5) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <motion.div 
          className="glass-panel p-16 rounded-[4rem] text-center space-y-8 max-w-xl shadow-premium"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <div className="space-y-4">
            <h1 className="font-heading text-4xl text-wood font-bold">A Masterpiece Awaits</h1>
            <p className="text-wood/60 leading-relaxed text-lg italic">Order #<span className="text-gold font-bold">{orderId}</span> has been successfully placed. We are preparing the artisans for your collection.</p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="premium-button bg-wood text-cream w-full"
          >
            Continue Exploring
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pb-40">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 pt-12 flex gap-2 text-[10px] uppercase tracking-widest text-wood/40 font-bold mb-20">
        <Link to="/" className="hover:text-gold transition">Home</Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-gold transition">Boutique Bag</Link>
        <span>/</span>
        <span className="text-gold">Checkout Narrative</span>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          
          {/* Main Flow */}
          <div className="space-y-16">
            <header className="space-y-4">
              <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px] block">Step {step} of 4</span>
              <h1 className="font-heading text-5xl text-wood font-bold">
                {step === 1 && "Shipping Information"}
                {step === 2 && "Delivery Method"}
                {step === 3 && "Payment Selection"}
                {step === 4 && "Final Review"}
              </h1>
              
              {/* Step indicator */}
              <div className="flex gap-3 pt-6">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-gold shadow-[0_0_10px_rgba(198,166,100,0.5)]' : 'bg-wood/10'}`} />
                ))}
              </div>
            </header>

            <div className="glass-panel p-10 md:p-14 rounded-[4rem] shadow-premium border-white/40">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-8"
                  >
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">Full Name</label>
                        <input
                          type="text"
                          placeholder="E.g. Omar Khalid"
                          value={form.shipping_name}
                          onChange={(e) => update('shipping_name', e.target.value)}
                          className="premium-input w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+212 600 000 000"
                          value={form.shipping_phone}
                          onChange={(e) => update('shipping_phone', e.target.value)}
                          className="premium-input w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">Delivery Address</label>
                        <input
                          type="text"
                          placeholder="Street name, Apartment, etc."
                          value={form.shipping_address}
                          onChange={(e) => update('shipping_address', e.target.value)}
                          className="premium-input w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">City</label>
                          <input
                            type="text"
                            placeholder="Marrakech"
                            value={form.shipping_city}
                            onChange={(e) => update('shipping_city', e.target.value)}
                            className="premium-input w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-wood/30 ml-2">Country</label>
                          <input
                            type="text"
                            placeholder="Morocco"
                            value={form.shipping_country}
                            onChange={(e) => update('shipping_country', e.target.value)}
                            className="premium-input w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      {shippingMethods.map((m) => (
                        <label 
                          key={m.id} 
                          className={`flex items-center gap-6 p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer ${form.delivery_method === m.id.toString() ? 'border-gold bg-gold/5 shadow-lg' : 'border-white/40 bg-white/10 hover:bg-white/30'}`}
                        >
                          <input 
                            type="radio" 
                            name="delivery" 
                            className="hidden"
                            checked={form.delivery_method === m.id.toString()} 
                            onChange={() => update('delivery_method', m.id.toString())} 
                          />
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${form.delivery_method === m.id.toString() ? 'border-gold' : 'border-wood/20'}`}>
                             {form.delivery_method === m.id.toString() && <div className="w-3 h-3 bg-gold rounded-full" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-heading text-xl text-wood font-bold">{m.name}</p>
                            {m.estimated_days && <p className="text-[11px] text-wood/40 uppercase tracking-widest font-bold mt-1">{m.estimated_days}</p>}
                          </div>
                          <div className="text-right">
                             <p className="text-gold font-bold">{formatPrice(m.price)}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    {[
                      { id: 'cash', label: 'Cash on Delivery', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.651 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.651-1M12 16V5' },
                      { id: 'card', label: 'Credit Card (Stripe)', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z' },
                      { id: 'paypal', label: 'PayPal Checkout', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' }
                    ].map((p) => (
                      <label 
                        key={p.id} 
                        className={`flex items-center gap-6 p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer ${form.payment_method === p.id ? 'border-gold bg-gold/5 shadow-lg' : 'border-white/40 bg-white/10 hover:bg-white/30'}`}
                      >
                        <input type="radio" name="payment" className="hidden" checked={form.payment_method === p.id} onChange={() => update('payment_method', p.id)} />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${form.payment_method === p.id ? 'border-gold' : 'border-wood/20'}`}>
                           {form.payment_method === p.id && <div className="w-3 h-3 bg-gold rounded-full" />}
                        </div>
                        <div className="w-12 h-12 bg-gold/5 rounded-2xl flex items-center justify-center text-gold">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={p.icon} /></svg>
                        </div>
                        <span className="font-heading text-xl text-wood font-bold">{p.label}</span>
                      </label>
                    ))}
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-12"
                  >
                    <div className="space-y-6">
                      <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-wood/30 border-b border-wood/5 pb-4">The Selection</h3>
                      <div className="space-y-4">
                        {items.map((i) => (
                          <div key={i.productId} className="flex justify-between items-center group">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl overflow-hidden bg-beige ring-1 ring-wood/5">
                                  <img src={i.product.images?.[0]} className="w-full h-full object-cover" />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-wood">{i.product.name}</p>
                                  {i.variant && <p className="text-[9px] text-wood/60 uppercase font-bold tracking-widest">{i.variant.name}</p>}
                                  <p className="text-[10px] text-wood/40 uppercase font-bold tracking-widest mt-0.5">Qty: {i.quantity}</p>
                               </div>
                            </div>
                            <span className="text-sm font-bold text-wood">{((i.variant ? Number(i.variant.price_modifier) + Number(i.product.price) : Number(i.product.price)) * i.quantity).toLocaleString()} <span className="text-[10px]">MAD</span></span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-12">
                       <div className="space-y-4">
                          <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-wood/30 border-b border-wood/5 pb-2">Shipped To</h3>
                          <div className="text-[13px] text-wood/60 leading-relaxed font-serif">
                             <p className="font-bold text-wood mb-1">{form.shipping_name}</p>
                             <p>{form.shipping_address}</p>
                             <p>{form.shipping_city}, {form.shipping_country}</p>
                             <p>{form.shipping_phone}</p>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-wood/30 border-b border-wood/5 pb-2">Payment</h3>
                          <div className="text-[13px] text-wood/60 leading-relaxed font-serif italic capitalize">
                             {form.payment_method === 'cash' ? 'Pay upon delivery' : `${form.payment_method} Secure Payment`}
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-16 flex flex-col sm:flex-row gap-4">
                {step > 1 && (
                  <button 
                    type="button" 
                    onClick={() => setStep((s) => s - 1)} 
                    className="px-10 py-5 text-[11px] uppercase tracking-widest font-bold text-wood/30 hover:text-wood transition"
                  >Back</button>
                )}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || (step === 1 && !form.shipping_name.trim())}
                  className="premium-button bg-wood text-cream flex-1 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                >
                  {step < 4 ? 'Continue the Journey' : loading ? 'Crafting Order…' : 'Place Narrative Order'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="sticky top-32">
             <div className="glass-panel p-10 rounded-[40px] shadow-premium space-y-10 border-white/60">
                <h2 className="font-heading text-3xl text-wood font-bold">The Balance</h2>
                
                <div className="space-y-6 text-sm">
                   <div className="flex justify-between items-center text-wood/60">
                      <span>Refined Subtotal</span>
                      <span className="font-bold">{formatPrice(subtotal)}</span>
                   </div>
                   <div className="flex justify-between items-center text-wood/60">
                      <span>Artisan Tax ({taxRate * 100}%)</span>
                      <span className="font-bold">{formatPrice(taxAmount)}</span>
                   </div>
                   <div className="flex justify-between items-center text-wood/60">
                      <span>Courier Concierge</span>
                      <span className="font-bold">{shippingCost === 0 ? 'COMPLIMENTARY' : formatPrice(shippingCost)}</span>
                   </div>
                   {appliedCoupon && (
                     <div className="flex justify-between items-center text-olive">
                        <span className="flex items-center gap-2">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                           Gift Certificate Applied
                        </span>
                        <span className="font-bold">-{formatPrice(discountAmount)}</span>
                     </div>
                   )}
                   <div className="pt-8 border-t border-wood/5 flex justify-between items-end">
                      <span className="font-heading text-2xl text-wood font-bold">Total Investment</span>
                      <div className="text-right">
                         <p className="text-wood font-bold text-4xl font-heading leading-none">{formatPrice(finalTotal)}</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white/40 p-10 rounded-[3rem] space-y-4 shadow-inner ring-1 ring-white/60">
                   <p className="text-[11px] uppercase tracking-widest font-bold text-wood/30 mb-2">Have a privilege code?</p>
                   <div className="relative group">
                      <input
                        type="text"
                        placeholder="ENTER CODE"
                        className="premium-input w-full uppercase font-mono tracking-widest text-sm"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={appliedCoupon}
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || appliedCoupon || !couponCode}
                        className="absolute right-2 top-2 px-4 py-3 bg-wood text-cream rounded-[1.5rem] text-[10px] uppercase font-bold tracking-widest hover:bg-gold transition disabled:opacity-0"
                      >{validatingCoupon ? '...' : 'Verify'}</button>
                   </div>
                   {appliedCoupon && (
                     <button onClick={() => {setAppliedCoupon(null); setCouponCode('');}} className="text-[10px] text-red-400 font-bold uppercase tracking-widest hover:underline ml-2">Remove Privilege</button>
                   )}
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
