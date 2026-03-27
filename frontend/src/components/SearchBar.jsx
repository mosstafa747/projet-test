import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

export default function SearchBar({ minimal = false }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    if (!minimal) {
      const saved = localStorage.getItem('recentSearches');
      if (saved) setRecentSearches(JSON.parse(saved));
    }

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [minimal]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await api.get(`/products/suggestions?q=${query}`);
        setSuggestions(r.data || []);
        setShowSuggestions(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const saveSearch = (q) => {
    if (minimal) return;
    const updated = [q, ...recentSearches.filter(s => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveSearch(query.trim());
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${minimal ? 'w-48 xl:w-64' : 'w-full max-w-2xl'}`} ref={menuRef}>
      <form onSubmit={handleSearch} className="relative group">
        <input
          id="global-search-input"
          name="q"
          type="text"
          autoComplete="off"
          placeholder={minimal ? "Search..." : "I am shopping for..."}
          className="w-full h-10 md:h-11 pl-4 pr-12 rounded-full border-2 border-[#E62E04] focus:outline-none text-sm placeholder-gray-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => (query.length >= 2 || (recentSearches.length > 0 && !minimal)) && setShowSuggestions(true)}
        />
        <button 
            type="submit"
            className="absolute right-1 top-1 h-8 md:h-9 px-4 bg-[#E62E04] text-white rounded-full flex items-center justify-center hover:bg-[#D62803] transition-colors"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </form>

      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || (query.length < 2 && recentSearches.length > 0 && !minimal)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl z-50 overflow-hidden border border-gray-100 min-w-[300px]"
          >
            <ul className="flex flex-col py-2">
              {query.length < 2 && recentSearches.length > 0 && !minimal && (
                <>
                  <li className="px-5 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50">Recent Searches</li>
                  {recentSearches.map((s) => (
                    <li key={s}>
                      <button
                        className="w-full flex items-center gap-4 px-5 py-2.5 hover:bg-gray-50 transition text-left text-sm text-gray-700 font-medium"
                        onClick={() => {
                          setQuery(s);
                          navigate(`/products?q=${encodeURIComponent(s)}`);
                          setShowSuggestions(false);
                        }}
                      >
                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {s}
                      </button>
                    </li>
                  ))}
                </>
              )}
              {suggestions.map((p) => (
                <li key={p.id}>
                  <button
                    className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition text-left border-b border-gray-50 last:border-0"
                    onClick={() => {
                      saveSearch(p.name);
                      navigate(`/product/${p.id}`);
                      setShowSuggestions(false);
                      setQuery('');
                    }}
                  >
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded-lg" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-50 rounded-lg" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{p.category?.replace('_', ' ')}</p>
                    </div>
                  </button>
                </li>
              ))}
              {query.length >= 2 && (
                <li className="px-5 pt-2 mt-2 border-t border-gray-50 text-center">
                  <button
                    className="w-full py-2 text-xs text-[#E62E04] font-bold hover:underline"
                    onClick={handleSearch}
                  >
                    View all results for "{query}"
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
