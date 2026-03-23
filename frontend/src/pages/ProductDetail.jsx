import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCurrencyStore } from "../store/useCurrencyStore";
import { useWishlistStore } from "../store/useWishlistStore";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const { formatPrice, currency } = useCurrencyStore();
  const toggleWishlistStore = useWishlistStore((s) => s.toggleWishlist);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const isSaved = useWishlistStore((s) => product && s.items.some(i => i.id === product.id));

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => {
      setProduct(r.data);
      if (r.data.variants && r.data.variants.length > 0) {
          setSelectedVariant(r.data.variants[0]);
      }
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }).catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const handleToggleWishlist = async () => {
    if (!user) {
      alert('Please sign in to save pieces to your private gallery.');
      return;
    }
    try {
      await toggleWishlistStore(product);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !product) {
    return (
      <div className="bg-cream min-h-screen py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 animate-pulse">
          <div className="aspect-square bg-beige rounded-[3rem]" />
          <div className="space-y-8 py-10">
            <div className="h-4 w-1/4 bg-beige rounded-full" />
            <div className="h-12 w-3/4 bg-beige rounded-full" />
            <div className="h-24 w-full bg-beige rounded-3xl" />
            <div className="h-12 w-1/2 bg-beige rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'];
  const hasVariants = product.variants && product.variants.length > 0;
  
  const currentPrice = hasVariants && selectedVariant
    ? Number(product.price) + Number(selectedVariant.price_modifier)
    : Number(product.price);
    
  const currentStock = hasVariants && selectedVariant
    ? selectedVariant.stock
    : product.stock;
    
  const isOutOfStock = currentStock <= 0;

  return (
    <div className="bg-cream min-h-screen">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-6 pt-10 flex gap-2 text-[10px] uppercase tracking-widest text-wood/40 font-bold">
        <Link to="/" className="hover:text-gold transition">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-gold transition">Shop</Link>
        <span>/</span>
        <span className="text-gold truncate">{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Gallery - Vertical Layout */}
          <div className="flex flex-col-reverse md:flex-row gap-6">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                      selectedImage === i ? 'border-gold shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Main Image */}
            <motion.div 
              className="flex-1 aspect-[4/5] rounded-[3rem] overflow-hidden bg-beige shadow-premium relative group"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <button 
                onClick={handleToggleWishlist}
                className={`absolute top-8 right-8 p-3 rounded-full glass-panel shadow-xl z-10 transition ${isSaved ? 'text-red-500' : 'text-wood/40 hover:text-red-500'}`}
              >
                <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </motion.div>
          </div>

          {/* Details */}
          <div className="py-6 space-y-10">
            <div className="space-y-4">
              <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px] block">{product.category.replace('_', ' ')}</span>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-wood font-bold leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                 <div className="flex text-gold text-sm">
                   {[...Array(5)].map((_, i) => (
                     <span key={i}>{i < Math.round(product.rating || 5) ? '★' : '☆'}</span>
                   ))}
                 </div>
                 <span className="text-wood/40 text-[11px] font-bold uppercase tracking-widest">(12 Verified Reviews)</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-wood">
               {formatPrice(currentPrice)}
            </div>

            <p className="text-wood/70 text-lg leading-relaxed max-w-xl">
              {product.description || "A masterfully crafted piece that embodies the soul of Moroccan tradition. Each detail has been carefully considered to ensure both aesthetic beauty and functional longevity."}
            </p>

            <div className="space-y-8">
              
              {/* Variations */}
              {hasVariants && (
                 <div className="space-y-4 pt-4">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-wood/40">Select Variation</label>
                    <div className="flex flex-wrap gap-3">
                       {product.variants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                              selectedVariant && selectedVariant.id === variant.id 
                                ? 'bg-wood text-cream shadow-xl scale-105' 
                                : 'bg-transparent text-wood border border-wood/20 hover:border-gold hover:text-gold'
                            } ${variant.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                             {variant.name} {variant.price_modifier > 0 ? `(+${formatPrice(variant.price_modifier)})` : ''}
                          </button>
                       ))}
                    </div>
                 </div>
              )}

              {/* Quantity */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest font-bold text-wood/40">Quantity</label>
                <div className="flex items-center w-32 glass-panel rounded-full p-1 border border-wood/5">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-10 h-10 flex items-center justify-center text-wood hover:text-gold transition font-bold text-lg">−</button>
                  <span className="flex-1 text-center font-bold text-wood">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="w-10 h-10 flex items-center justify-center text-wood hover:text-gold transition font-bold text-lg">+</button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => addItem(product, quantity, selectedVariant)}
                  disabled={isOutOfStock}
                  className="flex-1 premium-button bg-wood text-cream hover:bg-wood/90 py-5 text-sm font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!isOutOfStock ? 'Add to Collection' : 'Sold Out'}
                </button>
                <button
                  className="premium-button border-wood group flex items-center justify-center gap-3 py-5 text-sm font-bold uppercase tracking-widest"
                >
                  Buy Piece Now
                </button>
              </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-wood/5">
               <div className="space-y-1">
                 <p className="text-[10px] uppercase tracking-widest text-wood/40 font-bold">Materials</p>
                 <p className="text-[13px] text-wood font-medium">{product.materials || 'Premium Walnut & Brass'}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] uppercase tracking-widest text-wood/40 font-bold">Dimensions</p>
                 <p className="text-[13px] text-wood font-medium">{product.dimensions || '120cm x 80cm x 45cm'}</p>
               </div>
               {(product.sku || (selectedVariant && selectedVariant.sku)) && (
                   <div className="space-y-1 col-span-2 pt-2">
                     <p className="text-[10px] uppercase tracking-widest text-wood/40 font-bold">SKU</p>
                     <p className="text-[13px] text-wood font-mono">{(selectedVariant && selectedVariant.sku) ? selectedVariant.sku : product.sku}</p>
                   </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-beige/30 py-32 mt-20">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8 order-2 lg:order-1">
                 <span className="text-gold font-bold uppercase tracking-[0.3em] text-[11px]">Craftsmanship</span>
                 <h2 className="font-heading text-4xl md:text-5xl text-wood font-bold leading-tight">A Masterpiece of Natural Tradition</h2>
                 <p className="text-wood/70 text-lg leading-relaxed">
                   Handcrafted by our master artisans in Marrakech, this piece undergoes a meticulous 6-week manufacturing process. From the selection of premium local materials to the final hand-polishing with natural waxes, every step is a tribute to centuries of Moroccan heritage.
                 </p>
                 <ul className="space-y-4">
                    {[
                      'Sustainably sourced Atlas woods',
                      'Traditional interlocking joinery (un-nailed)',
                      'Natural vegetable-tanned leather accents',
                      'Hand-forged solid brass hardware'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-wood font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                        {item}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="aspect-[16/9] rounded-[3rem] overflow-hidden shadow-premium order-1 lg:order-2">
                 <img 
                  src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1000" 
                  alt="Craftsmanship" 
                  className="w-full h-full object-cover"
                 />
              </div>
           </div>
        </div>
      </section>

      {/* Complete the Look / Related */}
      <section className="max-w-7xl mx-auto px-6 py-40">
        <div className="flex justify-between items-end mb-16">
          <div className="space-y-2">
            <h2 className="font-heading text-4xl text-wood font-bold">Complete the Look</h2>
            <p className="text-wood/50 text-sm tracking-widest uppercase">Handpicked pieces to complement your selection</p>
          </div>
        </div>
        <RelatedProducts category={product.category} excludeId={product.id} />
      </section>

      {/* Reviews */}
      <section className="bg-wood py-32 text-beige">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h2 className="font-heading text-4xl font-bold">Client Experiences</h2>
            <p className="text-beige/60 text-lg max-w-md">Our pieces find their homes across the globe. Here's what our discerning clients have to say.</p>
            
            <div className="flex flex-col gap-10">
              {(product.approved_reviews && product.approved_reviews.length > 0) ? (
                product.approved_reviews.map((r) => (
                   <div key={r.id} className="space-y-4 border-l-[1px] border-beige/10 pl-8">
                      <div className="flex text-gold text-xs">
                        {[...Array(5)].map((_, i) => <span key={i}>{i < r.rating ? '★' : '☆'}</span>)}
                      </div>
                      <p className="text-lg italic leading-relaxed text-beige/90">"{r.comment}"</p>
                      <p className="text-[10px] uppercase border-beige/10 tracking-[0.2em] font-bold text-gold">— {r.user?.name}</p>
                   </div>
                ))
              ) : (
                <div className="space-y-4 border-l-[1px] border-beige/10 pl-8">
                  <p className="text-beige/40 italic">No reviews yet for this masterpiece.</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-panel-dark p-10 rounded-[3rem] border-beige/5">
            <h3 className="font-heading text-2xl font-bold mb-8 text-gold">Share your experience</h3>
            {user ? (
               <ReviewForm productId={product.id} onSubmitted={() => alert('Review submitted!')} />
            ) : (
               <div className="py-10 text-center space-y-4">
                 <p className="text-beige/60">Please login to leave a review</p>
                 <Link to="/login" className="premium-button bg-gold text-wood inline-block">Login Now</Link>
               </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ReviewForm({ productId, onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      setComment('');
      onSubmitted();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
       <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest font-bold text-beige/40">Your Rating</label>
          <div className="flex gap-4 text-2xl">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setRating(s)} className={`transition-transform hover:scale-125 ${s <= rating ? 'text-gold' : 'text-beige/10'}`}>★</button>
            ))}
          </div>
       </div>
       <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest font-bold text-beige/40">Your Experience</label>
          <textarea
            required
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-6 bg-beige/5 border border-beige/10 rounded-3xl focus:border-gold outline-none text-beige text-sm transition-all"
            placeholder="Tell us about the craftsmanship..."
          />
       </div>
       <button
        type="submit"
        disabled={submitting}
        className="premium-button bg-gold text-wood w-full font-bold uppercase tracking-widest text-[11px]"
      >
        {submitting ? 'Sharing...' : 'Share Review'}
      </button>
    </form>
  );
}

function ProductMiniCard({ product, formatPrice }) {
  const { currency } = useCurrencyStore();
  const isSaved = useWishlistStore((s) => s.items.some(i => i.id === product.id));
  const toggle = useWishlistStore((s) => s.toggleWishlist);
  const user = useAuthStore((s) => s.user);

  const handleToggle = async (e) => {
    e.preventDefault();
    if (!user) { alert('Sign in to save pieces.'); return; }
    await toggle(product);
  };

  return (
    <motion.div className="group relative" whileHover={{ y: -10 }}>
      <Link to={`/product/${product.id}`}>
        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-beige shadow-sm group-hover:shadow-premium transition-all duration-500 relative">
            <img src={product.images?.[0] || 'https://placehold.co/600'} alt={product.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
            <button 
              onClick={handleToggle}
              className={`absolute top-4 right-4 p-2 rounded-full glass-panel z-10 transition ${isSaved ? 'text-red-500' : 'text-wood/30 hover:text-red-500'}`}
            >
              <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
        </div>
        <div className="mt-6 space-y-1.5 px-2">
            <h3 className="text-sm font-bold text-wood group-hover:text-gold transition truncate">{product.name}</h3>
            <p className="text-gold font-bold text-sm">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}

function RelatedProducts({ category, excludeId }) {
  const [products, setProducts] = useState([]);
  const { formatPrice, currency } = useCurrencyStore();
  useEffect(() => {
    api.get('/products', { params: { category, per_page: 5 } }).then((r) => {
      const data = r.data.data || r.data;
      const list = Array.isArray(data) ? data : data.data || [];
      setProducts(list.filter((p) => p.id !== excludeId).slice(0, 4));
    });
  }, [category, excludeId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
      {products.map((p) => (
        <ProductMiniCard key={p.id} product={p} formatPrice={formatPrice} />
      ))}
    </div>
  );
}
