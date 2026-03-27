import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1557591953-26466336e382?auto=format&fit=crop&q=80&w=1600" 
            alt="Security and Privacy" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative text-center space-y-4 px-6">
          <h1 className="text-4xl md:text-5xl text-white font-extrabold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto font-medium">
            Your trust is our priority. Learn how we handle and protect your personal data.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-[#E62E04] pl-4">1. Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed">
              We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact our support team. This may include your name, email address, shipping address, and payment information.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-[#E62E04] pl-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 leading-relaxed">
              We use the information we collect to process your orders, provide customer support, and improve our services. We may also use your contact information to send you updates about your orders or promotional offers, which you can opt out of at any time.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-[#E62E04] pl-4">3. Data Security and Protection</h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures to protect your personal information from unauthorized access, loss, or misuse. Our site uses SSL encryption to ensure that all data transmitted between your browser and our servers remains private and secure.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-[#E62E04] pl-4">4. Your Rights and Choices</h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to access, update, or delete your personal information at any time. If you wish to exercise these rights, please contact us through our support channels. You can also manage your communication preferences in your account settings.
            </p>
          </div>

          <div className="pt-10 border-t border-gray-100 italic text-gray-400 text-sm">
            Last updated: March 27, 2026. Beldi Express reserves the right to update this policy as our services evolve.
          </div>
        </div>
      </section>
    </div>
  );
}
