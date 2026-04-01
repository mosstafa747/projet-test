import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import SearchBar from '../components/SearchBar';
import { useCurrencyStore } from '../store/useCurrencyStore';
import { useWishlistStore } from '../store/useWishlistStore';

function ProductCard({ product, onWishlist }) {
  const { formatPrice } = useCurrencyStore();
  const isInWishlist = useWishlistStore((s) => s.items.some(i => i.id === product.id));

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
      <div className="product-card group h-full">
        <Link to={`/product/${product.id}`} className="flex flex-col h-full">
          <div className="relative aspect-square overflow-hidden bg-gray-100 shrink-0">
            <img
              src={product.images?.[0] || 'https://placehold.co/400'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Wishlist */}
            <button
              onClick={(e) => { e.preventDefault(); onWishlist?.(product); }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
            >
              <svg className="w-4 h-4" fill={isInWishlist ? '#E62E04' : 'none'} stroke={isInWishlist ? '#E62E04' : '#999'} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            {/* Out of stock */}
            {!product.in_stock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-gray-700 px-3 py-1 rounded text-xs font-bold uppercase">Out of Stock</span>
              </div>
            )}
            {/* Discount */}
            {product.original_price && product.original_price > product.price && (
              <span className="absolute top-2 left-2 badge badge-error">
                -{Math.round((1 - product.price / product.original_price) * 100)}%
              </span>
            )}
          </div>
          <div className="p-3 flex-1 flex flex-col justify-between">
            <div className="space-y-1">
              <p className="text-[13px] text-gray-700 line-clamp-2 leading-snug font-medium min-h-[2.5em]">{product.name}</p>
              <div className="flex items-baseline gap-2">
                <span className="price">{formatPrice(product.price)}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="price-old">{formatPrice(product.original_price)}</span>
                )}
              </div>
            </div>
            <div className="mt-2 text-left">
              {product.sales_count > 0 && (
                <p className="text-[11px] text-gray-400 mb-1">{product.sales_count.toLocaleString()} sold</p>
              )}
              <div className="stars text-xs">★★★★★</div>
            </div>
          </div>
        </Link>
      </div>
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
  const { formatPrice } = useCurrencyStore();

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const query = searchParams.get('q') || '';
  const activeCategory = categories.find(c => c.slug === category);

  const fetchProducts = (p = 1) => {
    setLoading(true);
    const params = { page: p, per_page: 12, sort, min_price: priceRange[0], max_price: priceRange[1] };
    if (category) params.category = category;
    if (query) params.q = query;
    if (selectedMaterials.length > 0) params.materials = selectedMaterials.join(',');
    api.get('/products', { params }).then((r) => {
      const res = r.data;
      const data = res.data ?? (Array.isArray(res) ? res : []);
      setProducts(Array.isArray(data) ? data : []);
      setTotal(res.total ?? data.length ?? 0);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { api.get('/categories').then((r) => setCategories(r.data)); }, []);
  useEffect(() => {
    const t = setTimeout(() => fetchProducts(page), 400);
    return () => clearTimeout(t);
  }, [page, category, sort, query, priceRange, selectedMaterials]);

  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const user = useAuthStore((s) => s.user);
  useEffect(() => { if (user) fetchWishlist(); }, [user]);

  const handleToggleWishlist = async (product) => {
    if (!user) { alert('Please sign in to save items.'); return; }
    try { await toggleWishlist(product); } catch (e) { console.error(e); }
  };

  const handleCategoryClick = (slug) => {
    const p = Object.fromEntries(searchParams);
    if (slug) p.category = slug; else delete p.category;
    setSearchParams(p); setPage(1);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="page-container py-4">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">/</span>
            <span>Shop</span>
            {activeCategory && <><span className="breadcrumb-sep">/</span><span style={{color: 'var(--color-primary)'}}>{activeCategory.name}</span></>}
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">
              {activeCategory ? activeCategory.name : query ? `Results for "${query}"` : 'All Products'}
            </h1>
            <span className="text-sm text-gray-400">{total} products</span>
          </div>
        </div>
      </div>

      <div className="page-container py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="w-full lg:w-56 shrink-0 space-y-4">
            {/* Categories */}
            <div className="card p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-3">Categories</h3>
              <ul className="space-y-1">
                <li>
                  <button onClick={() => handleCategoryClick('')}
                    className={`w-full text-left text-sm py-1.5 transition px-2 rounded ${!category ? 'text-red-600 font-bold bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'}`}>
                    All Products
                  </button>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <button onClick={() => handleCategoryClick(c.slug)}
                      className={`w-full text-left text-sm py-1.5 transition px-2 rounded ${category === c.slug ? 'text-red-600 font-bold bg-red-50' : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'}`}>
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div className="card p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-3">Price Range</h3>
              <input type="range" min="0" max="50000" value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="range-slider w-full" />
              <div className="flex justify-between mt-2 text-xs text-gray-400 font-semibold">
                <span>{formatPrice(0)}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>

            {/* Materials */}
            <div className="card p-4">
              <h3 className="font-bold text-sm text-gray-900 mb-3">Material</h3>
              <ul className="space-y-2">
                {['Atlas Oak', 'Walnut Wood', 'Premium Leather', 'Moroccan Silk', 'Hand-forged Brass'].map((m) => (
                  <li key={m} className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => { setSelectedMaterials(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]); setPage(1); }}>
                    <div className={`w-4 h-4 border rounded flex items-center justify-center transition ${selectedMaterials.includes(m) ? 'bg-red-600 border-red-600' : 'border-gray-300 group-hover:border-red-400'}`}>
                      {selectedMaterials.includes(m) && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                    </div>
                    <span className={`text-sm transition ${selectedMaterials.includes(m) ? 'text-gray-900 font-semibold' : 'text-gray-500 group-hover:text-gray-700'}`}>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="card p-3 mb-4 flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex-1 w-full"><SearchBar /></div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-400 font-semibold">Sort:</span>
                <select
                  className="input py-1.5 text-sm w-auto"
                  value={sort}
                  onChange={(e) => setSearchParams({ ...Object.fromEntries(searchParams), sort: e.target.value })}
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="popular">Best Selling</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="skeleton aspect-square" />
                    <div className="p-3 space-y-2">
                      <div className="skeleton h-4 rounded" />
                      <div className="skeleton h-4 w-2/3 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <AnimatePresence mode="popLayout">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {products.map((p) => (
                      <ProductCard key={p.id} product={p} onWishlist={handleToggleWishlist} />
                    ))}
                  </div>
                </AnimatePresence>

                {products.length === 0 && (
                  <div className="card p-16 text-center">
                    <p className="text-gray-400 text-sm">No products found. Try adjusting your filters.</p>
                  </div>
                )}

                {/* Pagination */}
                {total > 12 && (
                  <div className="mt-6 flex justify-center gap-2">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                      className="btn btn-ghost btn-sm disabled:opacity-40">← Prev</button>
                    {[...Array(Math.ceil(total / 12))].map((_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)}
                        className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}>
                        {i + 1}
                      </button>
                    ))}
                    <button disabled={page * 12 >= total} onClick={() => setPage(p => p + 1)}
                      className="btn btn-ghost btn-sm disabled:opacity-40">Next →</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
