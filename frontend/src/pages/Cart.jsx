import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useCurrencyStore } from '../store/useCurrencyStore';

export default function Cart() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const { formatPrice, currency } = useCurrencyStore();
  const subtotal = items.reduce((s, i) => s + (i.variant ? Number(i.variant.price_modifier) + Number(i.product.price) : Number(i.product.price)) * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream px-6">
        <motion.div 
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-24 h-24 bg-beige rounded-full flex items-center justify-center mx-auto text-wood/20">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="space-y-4">
            <h1 className="font-heading text-4xl text-wood font-bold">Your Boutique Bag is Empty</h1>
            <p className="text-wood/60 text-lg italic max-w-sm mx-auto">Explore our collection of handcrafted masterpieces to find your next heirloom.</p>
          </div>
          <Link to="/products" className="premium-button bg-wood text-cream inline-block px-12">Continue Shopping</Link>
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
        <span className="text-gold">Boutique Bag</span>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16 space-y-4">
          <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px] block">Your Collection</span>
          <h1 className="font-heading text-5xl md:text-6xl text-wood font-bold">The Boutique Bag</h1>
        </header>

        <div className="grid lg:grid-cols-3 gap-24 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.cartItemId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass-panel p-6 md:p-8 rounded-[3rem] shadow-premium flex flex-col md:flex-row gap-8 items-center border-white/40"
                >
                  <div className="w-40 h-48 rounded-[2rem] overflow-hidden bg-beige flex-shrink-0 shadow-lg">
                    {item.product.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-wood/40 text-[10px] uppercase font-bold tracking-widest text-center px-4">No Visual Available</div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <Link to={`/product/${item.productId}`} className="font-heading text-2xl text-wood font-bold hover:text-gold transition block">
                        {item.product.name}
                      </Link>
                      <p className="text-wood/40 text-[11px] uppercase tracking-widest font-bold mt-1">Ref: #B-{item.productId.toString().padStart(4, '0')}</p>
                      {item.variant && (
                        <p className="text-gold font-bold text-xs uppercase tracking-widest mt-2">{item.variant.name}</p>
                      )}
                    </div>
                    
                    <p className="text-gold font-bold text-xl">{formatPrice(item.variant ? Number(item.product.price) + Number(item.variant.price_modifier) : Number(item.product.price))}</p>
                    
                    <div className="flex items-center justify-center md:justify-start gap-6">
                      <div className="flex items-center bg-white/40 rounded-full px-4 py-2 border border-white/60">
                         <button
                           onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                           className="w-8 h-8 flex items-center justify-center text-wood/60 hover:text-wood transition font-bold"
                         >−</button>
                         <span className="w-12 text-center text-wood font-bold text-sm">{item.quantity}</span>
                         <button
                           onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                           className="w-8 h-8 flex items-center justify-center text-wood/60 hover:text-wood transition font-bold"
                         >+</button>
                      </div>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-[10px] uppercase tracking-widest font-bold text-red-400 hover:text-red-500 transition underline underline-offset-4"
                      >Remove</button>
                    </div>
                  </div>

                  <div className="hidden md:block text-right space-y-2 pr-4">
                    <p className="text-wood/30 text-[10px] uppercase font-bold tracking-widest">Total</p>
                    <p className="text-wood font-bold text-2xl font-heading">
                      {formatPrice((item.variant ? Number(item.product.price) + Number(item.variant.price_modifier) : Number(item.product.price)) * item.quantity)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary Sidebar */}
          <div className="sticky top-32">
            <div className="glass-panel p-10 rounded-[4rem] shadow-premium space-y-10 border-white/60">
              <h2 className="font-heading text-3xl text-wood font-bold">Summary</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center text-wood/60">
                  <span className="text-sm font-medium">Boutique Total</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-wood/60">
                  <span className="text-sm font-medium">Shipping Concierge</span>
                  <span className="text-xs uppercase tracking-widest font-bold text-gold">Calculated Later</span>
                </div>
                <div className="pt-6 border-t border-wood/5 flex justify-between items-end">
                  <span className="font-heading text-xl text-wood font-bold">Total</span>
                  <div className="text-right">
                     <p className="text-wood font-bold text-3xl font-heading leading-none">{formatPrice(subtotal)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-10">
                <Link
                  to="/checkout"
                  className="premium-button bg-wood text-cream w-full block text-center shadow-xl hover:shadow-2xl transition-all"
                >Proceed to Checkout</Link>
                <Link to="/products" className="block text-center text-wood/40 text-[10px] uppercase tracking-widest font-bold hover:text-gold transition">Return to Collections</Link>
              </div>

              <div className="pt-10 space-y-4">
                <div className="flex items-center gap-4 text-wood/60">
                   <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.355r-.015.015V21.355z" /></svg>
                   </div>
                   <p className="text-[11px] leading-relaxed">Secure transaction with Moroccan artisans and certified payment gateways.</p>
                </div>
                <div className="flex items-center gap-4 text-wood/60">
                   <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <p className="text-[11px] leading-relaxed">Artisan quality guaranteed or free return within 14 days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
