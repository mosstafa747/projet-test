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
  const [activeTab, setActiveTab] = useState('description');
  const [scrolled, setScrolled] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const user = useAuthStore((s) => s.user);
  const { formatPrice, currency } = useCurrencyStore();
  const toggleWishlistStore = useWishlistStore((s) => s.toggleWishlist);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const isSaved = useWishlistStore((s) => product && s.items.some(i => i.id === product.id));

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => {
      setProduct(r.data);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }).catch(() => setLoading(false));
  }, [id]);

  useEffect(() => { if (user) fetchWishlist(); }, [user]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleWishlist = async () => {
    if (!user) { alert('Please sign in to save items.'); return; }
    try { await toggleWishlistStore(product); } catch (e) { console.error(e); }
  };

  if (loading || !product) {
    return (
      <div className="bg-[#F5F5F5] min-h-screen py-10 px-6">
        <div className="page-container grid lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-white rounded-xl" />
          <div className="space-y-6 pt-6">
            <div className="h-4 w-1/4 bg-white rounded" />
            <div className="h-10 w-3/4 bg-white rounded" />
            <div className="h-20 w-full bg-white rounded" />
            <div className="h-12 w-1/2 bg-white rounded" />
          </div>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ['https://placehold.co/800'];
  const rating = Math.round(product.rating || 5);
  const reviewCount = product.approved_reviews?.length || 12;

  return (
    <div className="bg-white min-h-screen relative pb-20 lg:pb-0">
      
      {/* Sticky Bottom Bar (Mobile/Scroll) */}
      <AnimatePresence>
        {scrolled && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden lg:flex lg:top-0 lg:bottom-auto lg:border-t-0 lg:border-b items-center justify-between"
          >
            <div className="hidden lg:flex items-center gap-4 page-container">
               <img src={images[0]} alt="" className="w-12 h-12 object-cover rounded" />
               <div>
                  <h4 className="font-bold text-gray-900 text-sm">{product.name}</h4>
                  <p className="font-bold text-red-600 text-sm">{formatPrice(product.price)}</p>
               </div>
               <div className="ml-auto flex gap-3">
                  <button onClick={() => addItem(product, quantity)} disabled={!product.in_stock} className="btn btn-primary lg:px-12">
                     {product.in_stock ? 'Add to Cart' : 'Sold Out'}
                  </button>
               </div>
            </div>
            
            {/* Mobile sticky version */}
            <div className="flex gap-3 lg:hidden w-full">
              <button onClick={() => addItem(product, 1)} disabled={!product.in_stock} className="btn btn-primary flex-1 py-3 text-base">
                {product.in_stock ? `Add to Cart - ${formatPrice(product.price)}` : 'Sold Out'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#F5F5F5] border-b border-gray-200">
        <div className="page-container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to={`/products?category=${product.category}`}>{product.category.replace('-', ' ')}</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="text-gray-900 font-semibold truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <main className="page-container py-10">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* Gallery Section */}
          <div className="flex flex-col-reverse md:flex-row gap-4 lg:sticky lg:top-24 h-fit">
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar pb-2 md:pb-0 md:max-h-[600px]">
              {images.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setSelectedImage(i)}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 md:w-24 aspect-square rounded-lg overflow-hidden shrink-0 border-2 transition-all ${selectedImage === i ? 'border-red-600' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            
            <div className="flex-1 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group cursor-zoom-in">
               <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-auto aspect-square md:aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-125"
               />
               <button 
                  onClick={handleToggleWishlist}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all z-10"
               >
                  <svg className={`w-5 h-5 ${isSaved ? 'text-red-500 fill-current' : 'text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" fill={isSaved ? "currentColor" : "none"}>
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
               </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                  <div className="flex text-yellow-500 text-sm">
                     {[...Array(5)].map((_, i) => <span key={i}>{i < rating ? '★' : '☆'}</span>)}
                  </div>
                  <span className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">
                     {reviewCount} Reviews
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-500">{product.sales_count} sold</span>
               </div>
               <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {product.name}
               </h1>
            </div>

            <div className="flex flex-col gap-1">
               <div className="flex items-end gap-3">
                  <span className="text-4xl font-extrabold text-red-600">{formatPrice(product.price)}</span>
                  {product.original_price && (
                     <span className="text-lg text-gray-400 line-through mb-1">{formatPrice(product.original_price)}</span>
                  )}
               </div>
               <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Price includes VAT</p>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
               {product.description}
            </p>

            {/* Action Area */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
               <div className="flex items-center justify-between">
                  <label className="font-bold text-sm text-gray-900">Quantity</label>
                  {product.in_stock ? (
                     <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">In Stock ({product.stock} available)</span>
                  ) : (
                     <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">Out of Stock</span>
                  )}
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg h-14 w-full sm:w-32 justify-between px-2">
                     <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition font-bold text-xl">−</button>
                     <span className="font-bold text-gray-900 text-lg">{quantity}</span>
                     <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= product.stock} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition font-bold text-xl">+</button>
                  </div>
                  
                  <button 
                     onClick={() => addItem(product, quantity)}
                     disabled={!product.in_stock}
                     className="btn btn-primary flex-1 h-14 text-base tracking-wide"
                  >
                     {product.in_stock ? 'Add to Cart' : 'Sold Out'}
                  </button>
                  <button 
                     disabled={!product.in_stock}
                     className="btn btn-dark h-14 px-8 text-base tracking-wide shadow-lg hover:shadow-xl transition-all"
                  >
                     Buy Now
                  </button>
               </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
               {[
                  { icon: '🛡️', title: 'Secure Payment', sub: '100% Protected' },
                  { icon: '🚚', title: 'Fast Delivery', sub: '3-5 Business Days' },
                  { icon: '✍️', title: 'Authentic', sub: 'Moroccan Craft' },
                  { icon: '↩️', title: 'Returns', sub: '30-Day Guarantee' }
               ].map((b, i) => (
                  <div key={i} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg text-center gap-1 border border-gray-100">
                     <span className="text-xl mb-1">{b.icon}</span>
                     <span className="text-xs font-bold text-gray-900 leading-tight">{b.title}</span>
                     <span className="text-[10px] text-gray-500 font-semibold">{b.sub}</span>
                  </div>
               ))}
            </div>

            {/* Details Tabs */}
            <div className="pt-8">
               <div className="flex gap-6 border-b border-gray-200">
                  {['description', 'materials', 'dimensions', 'delivery'].map(t => (
                     <button 
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`pb-3 text-sm font-bold capitalize transition-colors relative ${activeTab === t ? 'text-red-600' : 'text-gray-500 hover:text-gray-900'}`}
                     >
                        {t}
                        {activeTab === t && <motion.div layoutId="tabLine" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-red-600" />}
                     </button>
                  ))}
               </div>
               <div className="py-6 text-sm text-gray-600 leading-relaxed min-h-[150px]">
                  <AnimatePresence mode="wait">
                     <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                        {activeTab === 'description' && (
                           <div className="space-y-4">
                              <p>{product.description}</p>
                              <p>Each piece is expertly crafted to bring the rich heritage of Moroccan design into your modern living space. Please note that due to the artisanal nature of these products, slight variations in color and texture may occur, which only adds to their unique character.</p>
                           </div>
                        )}
                        {activeTab === 'materials' && (
                           <ul className="list-disc pl-5 space-y-2 font-medium">
                              <li>Primary Material: {product.materials || 'As listed'}</li>
                              <li>Finish: Natural eco-friendly wax</li>
                              <li>Origin: Handcrafted in Morocco</li>
                           </ul>
                        )}
                        {activeTab === 'dimensions' && (
                           <div className="bg-gray-50 p-4 border border-gray-100 rounded-lg inline-block">
                              <p className="font-bold text-gray-900 mb-1">Overall Dimensions</p>
                              <p className="text-gray-700 font-mono">{product.dimensions || 'N/A'}</p>
                           </div>
                        )}
                        {activeTab === 'delivery' && (
                           <div className="space-y-4">
                              <div className="flex gap-3">
                                 <span className="text-xl">🚚</span>
                                 <div>
                                    <h4 className="font-bold text-gray-900">Standard Delivery (3-5 Days)</h4>
                                    <p>Free for orders over 5,000 MAD. Fully tracked shipping via major couriers.</p>
                                 </div>
                              </div>
                              <div className="flex gap-3">
                                 <span className="text-xl">📦</span>
                                 <div>
                                    <h4 className="font-bold text-gray-900">Professional Packaging</h4>
                                    <p>Items are securely crated to ensure safe transit of delicate materials.</p>
                                 </div>
                              </div>
                           </div>
                        )}
                     </motion.div>
                  </AnimatePresence>
               </div>
            </div>

          </div>
        </div>
      </main>

      {/* Cross-Sell Section */}
      <section className="border-t border-gray-200 bg-[#F5F5F5] py-16">
         <div className="page-container">
            <div className="flex justify-between items-center mb-8">
               <h2 className="text-2xl font-extrabold text-gray-900">Frequently Bought Together</h2>
            </div>
            <RelatedProducts category={product.category} excludeId={product.id} />
         </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-white py-16 border-t border-gray-200">
         <div className="page-container grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-6">
               <h2 className="text-2xl font-extrabold text-gray-900">Customer Reviews</h2>
               
               <div className="flex items-end gap-3">
                  <span className="text-5xl font-extrabold text-gray-900">{rating.toFixed(1)}</span>
                  <div className="space-y-1 mb-1">
                     <div className="flex text-yellow-500 text-lg">
                        {[...Array(5)].map((_, i) => <span key={i}>{i < rating ? '★' : '☆'}</span>)}
                     </div>
                     <p className="text-sm font-semibold text-gray-500">Based on {reviewCount} reviews</p>
                  </div>
               </div>

               <div className="card p-6 bg-gray-50 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Write a Review</h3>
                  {user ? (
                     <ReviewForm productId={product.id} onSubmitted={() => window.location.reload()} />
                  ) : (
                     <div className="text-center py-4">
                        <p className="text-sm text-gray-600 mb-3">Login to share your experience</p>
                        <Link to="/login" className="btn btn-outline btn-block text-sm">Sign In</Link>
                     </div>
                  )}
               </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
               {(product.approved_reviews && product.approved_reviews.length > 0) ? (
                  product.approved_reviews.map((r) => (
                     <div key={r.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                              <p className="font-bold text-gray-900">{r.user?.name}</p>
                              <div className="flex text-yellow-500 text-xs mt-1">
                                 {[...Array(5)].map((_, i) => <span key={i}>{i < r.rating ? '★' : '☆'}</span>)}
                              </div>
                           </div>
                           <span className="text-xs font-semibold text-gray-400">Verified Buyer</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mt-3">"{r.comment}"</p>
                     </div>
                  ))
               ) : (
                  <div className="text-center py-12 card bg-gray-50 border-dashed border-2 border-gray-200">
                     <span className="text-4xl mb-3 block">💬</span>
                     <p className="font-bold text-gray-600">No reviews yet</p>
                     <p className="text-sm text-gray-400">Be the first to review this product.</p>
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
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment });
      setComment('');
      setSuccess(true);
      setTimeout(() => {
         if (onSubmitted) onSubmitted();
      }, 1500);
    } catch (e) {
      console.error(e);
      alert('Could not submit the review. Please check your input.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
     return (
        <div className="bg-green-50 border border-green-100 p-6 rounded-lg text-center">
           <span className="text-3xl mb-2 block">✨</span>
           <h4 className="font-bold text-green-800 text-lg mb-1">Thank you!</h4>
           <p className="text-sm text-green-700">Your review was published instantly.</p>
        </div>
     );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
         <div className="flex gap-2 text-2xl mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
               <button key={s} type="button" onClick={() => setRating(s)} className={`transition-transform hover:scale-110 ${s <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</button>
            ))}
         </div>
      </div>
      <div>
         <textarea
            required
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="input text-sm"
            placeholder="What did you think about this product?"
         />
      </div>
      <button type="submit" disabled={submitting} className="btn btn-dark btn-block btn-sm">
         {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

function RelatedProducts({ category, excludeId }) {
  const [products, setProducts] = useState([]);
  const addItem = useCartStore(s => s.addItem);
  
  useEffect(() => {
    api.get('/products', { params: { category, per_page: 5 } }).then((r) => {
      const data = r.data.data || r.data;
      const list = Array.isArray(data) ? data : data.data || [];
      setProducts(list.filter((p) => p.id !== excludeId).slice(0, 4));
    });
  }, [category, excludeId]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {products.map((p) => (
         <ProductCrossSellCard key={p.id} product={p} onAdd={() => addItem(p, 1)} />
      ))}
    </div>
  );
}

function ProductCrossSellCard({ product, onAdd }) {
   const { formatPrice } = useCurrencyStore();
   return (
      <div className="product-card flex flex-col h-full bg-white group">
         <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100">
            <img src={product.images?.[0] || 'https://placehold.co/400'} alt={product.name} className="w-full h-full object-cover" />
            {!product.in_stock && (
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white text-gray-700 px-3 py-1 rounded text-xs font-bold uppercase">Sold Out</span>
               </div>
            )}
         </Link>
         <div className="p-3 flex flex-col flex-1">
            <Link to={`/product/${product.id}`} className="flex-1">
               <p className="text-[13px] text-gray-700 line-clamp-2 leading-snug font-medium mb-1">{product.name}</p>
               <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-yellow-500 text-[10px]">
                     {[...Array(5)].map((_, i) => <span key={i}>{i < Math.round(product.rating || 5) ? '★' : '☆'}</span>)}
                  </div>
                  <span className="text-[10px] text-gray-400">({product.sales_count})</span>
               </div>
               <span className="price-sm block mb-3">{formatPrice(product.price)}</span>
            </Link>
            <button 
               onClick={(e) => { e.preventDefault(); onAdd(); }} 
               disabled={!product.in_stock}
               className="btn btn-outline btn-block text-xs py-2 mt-auto hover:bg-red-600 hover:text-white transition-colors"
            >
               <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
               Add
            </button>
         </div>
      </div>
   );
}
