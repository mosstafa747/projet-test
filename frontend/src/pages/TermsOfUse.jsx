import React from 'react';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1600" 
            alt="Legal Agreement" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative text-center space-y-4 px-6">
          <h1 className="text-4xl md:text-5xl text-white font-extrabold tracking-tight">
            Terms of Use
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-medium">
            The rules and guidelines for using our services and platform.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-[#E62E04] pl-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using Beldi Express, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-[#E62E04] pl-4">2. User Conduct</h2>
            <p className="text-gray-600 leading-relaxed">
              Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account. You agree to use the site only for lawful purposes and in a way that does not infringe upon the rights of others.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-[#E62E04] pl-4">3. Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              The content, design, and graphics on Beldi Express are protected by copyright and other intellectual property laws. You may not reproduce, distribute, or modify any part of the site without our express written permission.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-[#E62E04] pl-4">4. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              Beldi Express shall not be liable for any damages arising out of the use or inability to use the materials on our platform, even if we have been notified of the possibility of such damages.
            </p>
          </div>

          <div className="pt-10 border-t border-gray-100 italic text-gray-400 text-sm">
            Last updated: March 27, 2026. These terms are subject to change without prior notice.
          </div>
        </div>
      </section>
    </div>
  );
}
