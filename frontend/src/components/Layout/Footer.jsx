import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-wood text-beige pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="font-heading text-2xl font-bold text-gold tracking-tight">
              Beldi Ameublement
            </Link>
            <p className="text-[13px] leading-relaxed text-beige/60 max-w-xs">
              Premium Moroccan furniture manufactured with passion. Bridging the gap between traditional heritage and modern living spaces worldwide.
            </p>
            <div className="flex gap-4">
               {['facebook', 'instagram', 'pinterest'].map((social) => (
                <a key={social} href={`#${social}`} className="w-8 h-8 rounded-full border border-beige/10 flex items-center justify-center hover:bg-gold hover:border-gold transition-all duration-300">
                   <span className="sr-only">{social}</span>
                   <div className="w-1 h-1 bg-beige rounded-full" /> {/* Placeholder icon */}
                </a>
               ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold mb-6">Shop</h4>
            <ul className="space-y-3 text-[13px] text-beige/60">
              <li><Link to="/products" className="hover:text-gold transition">New Arrivals</Link></li>
              <li><Link to="/products?category=living-room" className="hover:text-gold transition">Living Room</Link></li>
              <li><Link to="/products?category=dining-room" className="hover:text-gold transition">Dining Room</Link></li>
              <li><Link to="/products?category=bedroom" className="hover:text-gold transition">Bedroom</Link></li>
              <li><Link to="/custom-request" className="hover:text-gold transition">Custom Orders</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold mb-6">Company</h4>
            <ul className="space-y-3 text-[13px] text-beige/60">
              <li><Link to="/about" className="hover:text-gold transition">About Us</Link></li>
              <li><Link to="/our-process" className="hover:text-gold transition">Our Artisans</Link></li>
              <li><Link to="/showrooms" className="hover:text-gold transition">Showrooms</Link></li>
              <li><Link to="/sustainability" className="hover:text-gold transition">Sustainability</Link></li>
              <li><Link to="/careers" className="hover:text-gold transition">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold mb-6">Support</h4>
            <ul className="space-y-3 text-[13px] text-beige/60">
              <li><Link to="/contact" className="hover:text-gold transition">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-gold transition">Shipping & Returns</Link></li>
              <li><Link to="/track-order" className="hover:text-gold transition">Order Tracking</Link></li>
              <li><Link to="/faq" className="hover:text-gold transition">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-gold transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-beige/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest text-beige/30">
          <p>© {currentYear} Beldi Ameublement. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Built by Antigravity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
