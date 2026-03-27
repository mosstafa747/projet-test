import React from 'react';
import { Link } from 'react-router-dom';

export default function Sitemap() {
  const sections = [
    {
      title: 'Main Navigation',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Categories', path: '/categories' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact Us', path: '/contact' },
      ]
    },
    {
      title: 'Customer Support',
      links: [
        { name: 'Help Center', path: '/help' },
        { name: 'Support Tickets', path: '/support' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Shipping Info', path: '/shipping' },
        { name: 'Return Policy', path: '/returns' },
      ]
    },
    {
      title: 'Legal & Policy',
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Use', path: '/terms' },
        { name: 'Sitemap', path: '/sitemap' },
      ]
    },
    {
      title: 'User Account',
      links: [
        { name: 'Profile', path: '/profile' },
        { name: 'Orders', path: '/orders' },
        { name: 'Wishlist', path: '/wishlist' },
        { name: 'Artisan Login', path: '/admin' },
        { name: 'Driver Portal', path: '/driver' },
      ]
    }
  ];

  return (
    <div className="min-h-screen animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1600" 
            alt="Website Map" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative text-center space-y-4 px-6">
          <h1 className="text-4xl md:text-5xl text-white font-extrabold tracking-tight">
            Sitemap
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-medium">
            Explore all sections of our platform from a single directory.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider border-b-2 border-gray-100 pb-3">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      to={link.path} 
                      className="text-gray-500 hover:text-[#E62E04] transition-colors font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
