import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import SearchBar from '../components/SearchBar';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useWishlistStore } from '../store/useWishlistStore';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Latest Arrivals' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'bestselling', label: 'Best Selling' },
];

function ProductCard({ product, onWishlist }) {
  const user = useAuthStore((s) => s.user);
  const { formatPrice, currency } = useCurrencyStore();
  const isInWishlist = useWishlistStore((s) => s.items.some(i => i.id === product.id));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-cream shadow-sm group-hover:shadow-premium transition-all duration-500">
          <img
            src={product.images?.[0] || 'https://placehold.co/600'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Wishlist Button */}
          <button
            onClick={(e) => { e.preventDefault(); onWishlist?.(product); }}
            className={`absolute top-5 right-5 p-2.5 rounded-full bg-cream/90 transition shadow-sm z-10 ${isInWishlist ? 'text-red-500' : 'text-wood/30 hover:text-red-500'}`}
          >
            <svg className="w-4 h-4" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          {!product.in_stock && (
            <div className="absolute inset-0 bg-wood/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-cream text-wood px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="mt-5 space-y-1.5 px-2">
          <h3 className="text-[15px] font-bold text-wood group-hover:text-gold transition truncate">{product.name}</h3>
          <p className="text-gold font-bold">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const { formatPrice, currency } = useCurrencyStore();
  
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const query = searchParams.get('q') || '';

  const activeCategory = categories.find(c => c.slug === category);

  const fetchProducts = (p = 1) => {
    setLoading(true);
    const params = { 
      page: p, 
      per_page: 12, 
      sort,
      min_price: priceRange[0],
      max_price: priceRange[1]
    };
    if (category) params.category = category;
    if (query) params.q = query;
    if (selectedMaterials.length > 0) {
      params.materials = selectedMaterials.join(',');
    }

    api.get('/products', { params }).then((r) => {
      const res = r.data;
      const data = res.data ?? (Array.isArray(res) ? res : []);
      setProducts(Array.isArray(data) ? data : []);
      setTotal(res.total ?? data.length ?? 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(page);
    }, 400); // Debounce price slider
    return () => clearTimeout(timer);
  }, [page, category, sort, query, priceRange, selectedMaterials]);

  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const handleToggleWishlist = async (product) => {
    if (!user) {
      alert('Please sign in to save pieces to your private gallery.');
      return;
    }
    try {
      await toggleWishlist(product);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCategoryClick = (slug) => {
    const newParams = Object.fromEntries(searchParams);
    if (slug) newParams.category = slug;
    else delete newParams.category;
    setSearchParams(newParams);
    setPage(1);
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Header / Breadcrumbs */}
      <section className="bg-beige/30 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4">
               <nav className="flex gap-2 text-[10px] uppercase tracking-widest text-wood/40 font-bold">
                 <Link to="/" className="hover:text-gold transition">Home</Link>
                 <span>/</span>
                 <span className="text-wood/60">Shop</span>
                 {activeCategory && (
                   <>
                     <span>/</span>
                     <span className="text-gold">{activeCategory.name}</span>
                   </>
                 )}
               </nav>
               <h1 className="font-heading text-5xl text-wood font-bold">
                 {activeCategory ? `${activeCategory.name} Collection` : (query ? `Results for "${query}"` : 'The Collection')}
               </h1>
            </div>
            <div className="flex items-center gap-4 text-wood/50 text-[11px] font-bold uppercase tracking-widest">
              <span>Showing {products.length} of {total} pieces</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-16">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-12">
          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-wood">Categories</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => handleCategoryClick('')}
                  className={`text-[13px] font-medium transition ${!category ? 'text-gold' : 'text-wood/60 hover:text-wood'}`}
                >
                  All Masterpieces
                </button>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button 
                    onClick={() => handleCategoryClick(c.slug)}
                    className={`text-[13px] font-medium transition ${category === c.slug ? 'text-gold' : 'text-wood/60 hover:text-wood'}`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Refine By */}
          <div className="space-y-8">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-wood">Refine By</h3>
            
            {/* Price Range Placeholder */}
            <div className="space-y-4">
               <h4 className="text-[11px] font-bold text-wood/80">Price Range</h4>
               <div className="px-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="50000" 
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="premium-range"
                  />
                  <div className="flex justify-between mt-2 text-[10px] text-wood/50 font-bold">
                    <span>{formatPrice(0)}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
               </div>
            </div>

            {/* Materials */}
            <div className="space-y-4">
               <h4 className="text-[11px] font-bold text-wood/80">Material</h4>
               <ul className="space-y-2">
                 {['Atlas Oak', 'Walnut Wood', 'Premium Leather', 'Moroccan Silk', 'Hand-forged Brass'].map((m) => (
                   <li key={m} className="flex items-center gap-3 group cursor-pointer" onClick={() => {
                     setSelectedMaterials(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
                     setPage(1);
                   }}>
                      <div className={`w-3.5 h-3.5 border rounded-sm transition flex items-center justify-center ${selectedMaterials.includes(m) ? 'bg-gold border-gold' : 'border-wood/20 group-hover:border-gold'}`}>
                        {selectedMaterials.includes(m) && <svg className="w-2.5 h-2.5 text-cream" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                      </div>
                      <span className={`text-[12px] transition ${selectedMaterials.includes(m) ? 'text-wood font-bold' : 'text-wood/60 group-hover:text-wood'}`}>{m}</span>
                   </li>
                 ))}
               </ul>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 space-y-12">
          {/* Search and Sort Row */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
               <div className="w-full md:w-auto">
                  <SearchBar />
               </div>

               <div className="flex items-center gap-4 w-full md:w-auto self-end">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-wood/30 whitespace-nowrap">Sort By</span>
                  <select 
                    className="premium-input py-2 px-6 text-[12px] bg-white ring-1 ring-wood/5 w-full md:w-auto"
                    value={sort}
                    onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), sort: e.target.value })}
                  >
                    <option value="newest">Latest Arrivals</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
               </div>
            </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/5] rounded-[2rem] bg-beige animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                  {products.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              </AnimatePresence>
              
              {products.length === 0 && (
                <div className="py-20 text-center space-y-4">
                  <div className="text-4xl">🏺</div>
                  <p className="text-wood/50 text-sm font-medium italic">No pieces found in this collection.</p>
                </div>
              )}

              {/* Pagination */}
              {total > 12 && (
                <div className="pt-20 border-t border-wood/5 flex justify-center items-center gap-10">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="text-[11px] font-bold uppercase tracking-[0.2em] text-wood/40 hover:text-gold disabled:opacity-30 transition"
                  >
                    Previous
                  </button>
                  <div className="flex gap-4">
                     {[...Array(Math.ceil(total / 12))].map((_, i) => (
                       <button 
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-8 h-8 rounded-full text-[11px] font-bold flex items-center justify-center transition ${page === i + 1 ? 'bg-gold text-cream shadow-md' : 'text-wood/40 hover:text-wood'}`}
                       >
                         {i + 1}
                       </button>
                     ))}
                  </div>
                  <button
                    disabled={page * 12 >= total}
                    onClick={() => setPage((p) => p + 1)}
                    className="text-[11px] font-bold uppercase tracking-[0.2em] text-wood/40 hover:text-gold disabled:opacity-30 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
