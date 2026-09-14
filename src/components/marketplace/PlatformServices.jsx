import React from 'react';

/**
 * PlatformServices Component
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Showcase of core platform services and features:
 * - Payment & Escrow
 * - Logistics & Delivery
 * - Seller Tools & Analytics
 * - Customer Support & Trust
 * - Mobile App
 * - Security & Compliance
 *
 * Design:
 * - Grid layout with hover effects
 * - Icons with gradient backgrounds
 * - Dark theme with gold accents
 * - Descriptions and nested features
 */
const PlatformServices = () => {
  const services = [
    {
      id: 'escrow',
      title: 'CBE-Backed Payment Escrow',
      description: 'Your money is protected by Central Bank of Ethiopia. We hold funds until order delivery is confirmed.',
      icon: '🏦',
      features: ['Safe transaction holding', 'Instant buyer refunds', 'Seller verification', 'Fraud protection'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'logistics',
      title: 'National Logistics Network',
      description: 'Fast, reliable nationwide delivery managed by our partner rider network and trusted couriers.',
      icon: '🚚',
      features: ['24-48 hour delivery', 'Real-time tracking', 'Insurance included', 'Nationwide coverage'],
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'analytics',
      title: 'Seller Analytics Dashboard',
      description: 'Complete business intelligence. Track sales, inventory, customer behavior, and optimize your shop.',
      icon: '📊',
      features: ['Real-time metrics', 'Sales trends', 'Inventory alerts', 'Revenue reports'],
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'support',
      title: '24/7 Multilingual Support',
      description: 'Dedicated support team in Amharic, Oromo, and English. Chat, email, or phone support anytime.',
      icon: '💬',
      features: ['Instant chat response', 'Video support', 'Dispute resolution', 'Technical help'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'app',
      title: 'Mobile App (iOS & Android)',
      description: 'Shop, sell, or deliver on the go. Lightweight app optimized for Ethiopian 4G and 3G networks.',
      icon: '📱',
      features: ['Offline mode available', 'One-tap checkout', 'Push notifications', 'Lightweight (15MB)'],
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'trust',
      title: 'Community Verification',
      description: 'All participants verified with KYC/AML compliance. Ratings, reviews, and trust scores.',
      icon: '✓',
      features: ['Identity verification', 'Rating system', 'Review authenticity', 'Compliance ready'],
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-[#052919] via-[#0a3a2a] to-[#041f18] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#E5A93C]/2 rounded-full blur-3xl opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#E5A93C]/3 rounded-full blur-3xl opacity-10 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#083B24]/40 border border-[#E5A93C]/30 rounded-full backdrop-blur-md mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E5A93C]"></div>
            <span className="text-xs md:text-sm font-semibold text-[#E5A93C] tracking-wider">
              🔧 PLATFORM FEATURES
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Built-In Services for Seamless Commerce
          </h2>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            Everything you need to buy, sell, or deliver. No external integrations required.
          </p>
        </div>

        {/* Services Grid - 2x3 on desktop, 1x6 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 overflow-hidden transition-all duration-300 hover:border-[#E5A93C]/40 hover:bg-white/8 hover:shadow-lg hover:shadow-[#E5A93C]/10 hover:-translate-y-1"
            >
              {/* Background accent on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>

              {/* Content */}
              <div className="relative z-10 space-y-4">
                {/* Icon with gradient background */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} text-white text-2xl`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-white">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-300 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 pt-4 border-t border-white/10">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hover border */}
              <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[#E5A93C]/30 transition-colors duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom section - Why choose Aritii */}
        <div className="mt-20 pt-16 border-t border-white/10">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
              Why Choose Aritii Market?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#E5A93C]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#E5A93C] font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Single Platform</h4>
                  <p className="text-gray-400 text-sm">No need to integrate multiple payment gateways, delivery services, or analytics tools.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#E5A93C]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#E5A93C] font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Trust Built-In</h4>
                  <p className="text-gray-400 text-sm">CBE escrow, verified participants, and community ratings protect everyone.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#E5A93C]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#E5A93C] font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Low Costs</h4>
                  <p className="text-gray-400 text-sm">No middleman markups. Better prices for shoppers, better margins for sellers.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#E5A93C]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#E5A93C] font-bold">4</span>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-2">Always Online</h4>
                  <p className="text-gray-400 text-sm">24/7 support team available in multiple languages to help you anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformServices;
