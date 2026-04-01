import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

export default function Cart() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  const subtotal = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#F5F5F5] px-4">
        <div className="card p-12 text-center space-y-4 max-w-sm w-full">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800">Your cart is empty</h2>
          <p className="text-sm text-gray-400">Add items to your cart to get started.</p>
          <Link to="/products" className="btn btn-primary btn-block">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <div className="bg-white border-b border-gray-200">
        <div className="page-container py-3">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Shopping Cart</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Shopping Cart <span className="text-gray-400 font-normal text-base">({items.length} item{items.length !== 1 ? 's' : ''})</span></h1>
        </div>
      </div>

      <div className="page-container py-6">
        <div className="grid lg:grid-cols-3 gap-4 items-start">

          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="card p-4 flex gap-4 items-start"
                >
                  {/* Image */}
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No image</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <Link to={`/product/${item.productId}`} className="text-sm font-semibold text-gray-800 hover:text-red-600 transition line-clamp-2">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-400">SKU: #B-{item.productId.toString().padStart(4, '0')}</p>
                    <span className="price-sm">{formatPrice(item.product.price)}</span>
                  </div>

                  {/* Controls */}
                  <div className="shrink-0 flex flex-col items-end gap-3">
                    <p className="font-bold text-gray-900 text-base">{formatPrice(Number(item.product.price) * item.quantity)}</p>
                    <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                      <button onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition font-bold text-lg leading-none">−</button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-800">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition font-bold text-lg leading-none">+</button>
                    </div>
                    <button onClick={() => removeItem(item.productId)}
                      className="text-xs text-red-400 hover:text-red-600 transition font-semibold">Remove</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="sticky top-20">
            <div className="card p-5 space-y-4">
              <h2 className="font-bold text-gray-900 text-base">Order Summary</h2>

              {subtotal < 5000 && (
                <div className="bg-gold/5 border border-gold/10 rounded-2xl p-4 space-y-2">
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gold">
                      <span>Free Shipping Goal</span>
                      <span>{Math.round((subtotal / 5000) * 100)}%</span>
                   </div>
                   <div className="h-1.5 bg-wood/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (subtotal / 5000) * 100)}%` }}
                        className="h-full bg-gold shadow-[0_0_8px_rgba(198,166,100,0.5)]" 
                      />
                   </div>
                   <p className="text-[11px] text-wood/60 italic">Add <span className="text-gold font-bold">{formatPrice(5000 - subtotal)}</span> more for complimentary artisan delivery.</p>
                </div>
              )}

              <div className="space-y-3 text-sm pt-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={subtotal >= 5000 ? "text-green-600 font-bold uppercase tracking-widest text-[10px]" : "font-semibold"}>
                    {subtotal >= 5000 ? "Complimentary" : formatPrice(120)}
                  </span>
                </div>
                <hr className="divider" />
                <div className="flex justify-between font-bold text-gray-900 text-base">
                  <span>Total Investment</span>
                  <span className="price text-lg">{formatPrice(subtotal + (subtotal >= 5000 ? 0 : 120))}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn btn-primary btn-block btn-lg">
                Proceed to Checkout →
              </Link>
              <Link to="/products" className="btn btn-ghost btn-block text-center">
                Continue Shopping
              </Link>

              <div className="pt-2 space-y-2 border-t border-gray-100">
                {[
                  { icon: '🛡️', text: 'Buyer protection on every order' },
                  { icon: '↩️', text: '30-day free returns' },
                  { icon: '🔒', text: 'Secure checkout' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
