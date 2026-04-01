import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const stats = [
  { value: '50,000+', label: 'Orders Shipped' },
  { value: '4.9 / 5', label: 'Average Rating' },
  { value: '15+', label: 'Years Experience' },
  { value: '50+', label: 'Master Artisans' },
];

const strengths = [
  { icon: '🚀', title: 'Fast Delivery', desc: 'Most orders shipped within 24–48h. Express delivery available.' },
  { icon: '🛡️', title: 'Buyer Protection', desc: 'Full refund guaranteed if your order doesn\'t arrive or match the description.' },
  { icon: '🏆', title: 'Artisan Quality', desc: 'Every piece handcrafted by certified Moroccan Mâalem masters.' },
  { icon: '💰', title: 'Best Value', desc: 'Direct from workshop to you — no middlemen, no markups.' },
  { icon: '↩️', title: '30-Day Returns', desc: 'Not satisfied? Return it hassle-free within 30 days.' },
  { icon: '💬', title: '2-Hour Support', desc: 'Our team replies within 2 hours, 7 days a week.' },
];

const reviews = [
  { name: 'Sofia M.', country: '🇫🇷 France', rating: 5, text: 'Absolutely stunning quality. The table arrived perfectly packed and looks even better in person.' },
  { name: 'Ahmed K.', country: '🇩🇪 Germany', rating: 5, text: 'Fast shipping, great packaging and the product is exactly as described. 10/10 would order again.' },
  { name: 'Laura B.', country: '🇬🇧 UK', rating: 5, text: 'My custom sofa was made exactly to spec. Communication was great throughout. Highly recommend!' },
];

export default function About() {
  return (
    <div className="bg-[#F0F2F5] min-h-screen">

      {/* Store Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Store Avatar */}
            <div className="shrink-0">
              <div className="w-28 h-28 rounded-full border-4 border-[#E62E04] overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400"
                  alt="Beldi Express Store"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Store Info */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h1 className="text-2xl font-extrabold text-gray-900">Beldi Express</h1>
                <span className="inline-flex items-center gap-1 bg-[#E62E04] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                  ✓ Official Store
                </span>
              </div>
              <p className="text-gray-500 text-sm max-w-2xl">
                🌍 Marrakech, Morocco · Est. 2009 · <span className="text-green-600 font-semibold">● Online</span>
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-1">
                <div className="text-center">
                  <span className="text-yellow-500 font-bold">★★★★★</span>
                  <span className="text-sm text-gray-600 ml-1 font-semibold">4.9/5</span>
                  <p className="text-[11px] text-gray-400">2,400+ reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-800">98.7%</p>
                  <p className="text-[11px] text-gray-400">Positive Feedback</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-800">50,000+</p>
                  <p className="text-[11px] text-gray-400">Orders Completed</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2 justify-center md:justify-start">
                <Link to="/contact" className="bg-[#E62E04] text-white px-6 py-2 rounded font-bold text-sm hover:bg-red-700 transition">
                  Contact Store
                </Link>
                <Link to="/products" className="border border-gray-300 text-gray-700 px-6 py-2 rounded font-bold text-sm hover:bg-gray-50 transition">
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-200 mt-2">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-gray-100">
            {stats.map((s) => (
              <div key={s.label} className="text-center py-2">
                <p className="text-xl font-extrabold text-[#E62E04]">{s.value}</p>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">

        {/* About Section */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-[#E62E04] rounded-full" />
            <h2 className="text-base font-extrabold text-gray-900">About Our Store</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>
                Welcome to <strong className="text-gray-900">Beldi Express</strong> — your trusted source for <strong className="text-gray-900">authentic Moroccan furniture and handcrafted home décor</strong>, delivered straight from the artisan workshops of Marrakech to your door.
              </p>
              <p>
                We are a family-run business with <strong className="text-gray-900">over 15 years of experience</strong> connecting passionate customers worldwide with Morocco's finest craftsmen. Every piece in our collection is <strong className="text-gray-900">100% handmade</strong>, ethically sourced, and built to last.
              </p>
              <p className="italic text-gray-400 border-l-2 border-[#E62E04] pl-4">
                "We don't just sell furniture — we deliver a piece of Moroccan heritage crafted with love. Your satisfaction is our craft."
              </p>
            </div>
            <div className="rounded-lg overflow-hidden h-56">
              <img
                src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800"
                alt="Beldi Workshop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Why Shop With Us */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-[#E62E04] rounded-full" />
            <h2 className="text-base font-extrabold text-gray-900">Why Shop With Us</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {strengths.map((s) => (
              <motion.div
                key={s.title}
                whileHover={{ y: -2 }}
                className="border border-gray-100 rounded-lg p-4 space-y-2 hover:border-[#E62E04]/30 hover:shadow-sm transition-all"
              >
                <span className="text-2xl">{s.icon}</span>
                <h3 className="font-bold text-gray-800 text-sm">{s.title}</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-6 bg-[#E62E04] rounded-full" />
            <h2 className="text-base font-extrabold text-gray-900">What We Offer</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', label: 'Sofas & Seating' },
              { img: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=400', label: 'Dining Tables' },
              { img: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400', label: 'Bedroom Sets' },
              { img: 'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?w=400', label: 'Home Décor' },
            ].map((item) => (
              <Link to="/products" key={item.label} className="group block">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-100 group-hover:border-[#E62E04]/40 transition">
                  <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="mt-2 text-[12px] font-semibold text-gray-700 text-center group-hover:text-[#E62E04] transition">{item.label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-[#E62E04] rounded-full" />
              <h2 className="text-base font-extrabold text-gray-900">Customer Reviews</h2>
            </div>
            <span className="text-[12px] text-[#E62E04] font-semibold">2,400+ reviews</span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {reviews.map((r) => (
              <div key={r.name} className="border border-gray-100 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-gray-800">{r.name}</p>
                    <p className="text-[11px] text-gray-400">{r.country}</p>
                  </div>
                  <span className="text-yellow-400 text-sm">{'★'.repeat(r.rating)}</span>
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#E62E04] rounded-lg p-8 text-center space-y-4">
          <h3 className="text-2xl font-extrabold text-white">Ready to Shop Authentic Moroccan Furniture?</h3>
          <p className="text-white/80 text-sm">Fast shipping · Buyer protection · Artisan quality guaranteed</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/products" className="bg-white text-[#E62E04] px-8 py-3 rounded font-bold text-sm hover:bg-gray-100 transition">
              Browse Products
            </Link>
            <Link to="/custom-request" className="border-2 border-white text-white px-8 py-3 rounded font-bold text-sm hover:bg-white/10 transition">
              Custom Order
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
