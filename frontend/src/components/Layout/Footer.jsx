import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 mt-20">
      <div className="max-w-7xl mx-auto px-4 pb-12">
        
        {/* Help & Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-sm">Customer Service</h4>
            <ul className="space-y-2 text-xs text-gray-500 font-bold uppercase tracking-tighter">
              <li><Link to="/help" className="hover:text-[#E62E04] transition">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-[#E62E04] transition">Contact Us</Link></li>
              <li><Link to="/support" className="hover:text-[#E62E04] transition">Support Tickets</Link></li>
              <li><Link to="/faq" className="hover:text-[#E62E04] transition">FAQ</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-sm">Shopping Guide</h4>
            <ul className="space-y-2 text-xs text-gray-500 font-bold uppercase tracking-tighter">
              <li><Link to="/terms" className="hover:text-[#E62E04] transition">Terms of Use</Link></li>
              <li><Link to="/privacy" className="hover:text-[#E62E04] transition">Privacy Policy</Link></li>
              <li><Link to="/shipping" className="hover:text-[#E62E04] transition">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-[#E62E04] transition">Return Policy</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-sm">About Us</h4>
            <ul className="space-y-2 text-xs text-gray-500 font-bold uppercase tracking-tighter">
              <li><Link to="/about" className="hover:text-[#E62E04] transition">Our Story</Link></li>
              <li><Link to="/craftsmanship" className="hover:text-[#E62E04] transition">Craftsmanship</Link></li>
              <li><Link to="/custom-request" className="hover:text-[#E62E04] transition">Custom Orders</Link></li>
              <li><Link to="/admin" className="hover:text-[#E62E04] transition">Artisan Login</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h4 className="font-bold text-gray-900 text-sm">Stay Connected</h4>
            <div className="flex gap-4">
                <a href="#" className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#E62E04] hover:text-white transition-all shadow-sm">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#E62E04] hover:text-white transition-all shadow-sm">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
            </div>
            
            <div className="pt-6">
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Secure Payment Methods</p>
               <div className="flex gap-4 opacity-30 grayscale">
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#F0F2F5] py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
          <p>© {currentYear} Beldi Ameublement. All Rights Reserved.</p>
          <div className="flex gap-10">
             <Link to="/privacy" className="hover:text-[#E62E04] transition">Privacy Policy</Link>
             <Link to="/terms" className="hover:text-[#E62E04] transition">Terms of Use</Link>
             <Link to="/sitemap" className="hover:text-[#E62E04] transition">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
