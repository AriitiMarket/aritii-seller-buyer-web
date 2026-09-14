import React from 'react';
import { Link } from 'react-router-dom';
import { mockEcosystemStats } from '../../data/mockData';

/**
 * BusinessShowcase Component
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Showcase of three business ecosystem participants:
 * - 🚴 Riders & Logistics Providers
 * - 🏪 Sellers & Merchants
 * - 👥 Buyers & Consumers
 *
 * Design:
 * - Dark background continuing from hero
 * - Gold accent highlights
 * - Cards with hover effects
 * - Each role has detailed features and benefits
 * - CTAs for joining each category
 */
const BusinessShowcase = () => {
  const roles = [
    {
      id: 'riders',
      title: 'For Riders & Logistics',
      subtitle: '🚴 Delivery Network',
      description: 'Join Ethiopia\'s fastest-growing logistics network. Earn steady income on your schedule with transparent commission rates and guaranteed daily settlements.',
      icon: '🚴',
      features: [
        'Flexible daily/hourly earnings',
        'Real-time order tracking & navigation',
        'Instant settlement to mobile wallet',
        'Weather & traffic alerts',
        'Accident insurance included',
        'Performance bonuses'
      ],
      link: '/join-riders',
      linkText: 'Become a Rider',
      bgClass: 'from-blue-900/20 to-blue-800/10',
      borderColor: 'border-blue-500/30',
      accentColor: '#3b82f6',
      accentBg: 'bg-blue-500/20'
    },
    {
      id: 'sellers',
      title: 'For Sellers & Merchants',
      subtitle: '🏪 Seller Network',
      description: 'Grow your business nationwide. Reach millions of customers, manage inventory, track sales, and scale with minimal overhead. Zero commission for the first 3 months.',
      icon: '🏪',
      features: [
        'Free storefront setup',
        'Multi-channel selling (app, web)',
        'Inventory management dashboard',
        'Advanced analytics & insights',
        'Marketing tools & promotions',
        'Dedicated seller support'
      ],
      link: '/become-seller',
      linkText: 'Open Shop Now',
      bgClass: 'from-emerald-900/20 to-emerald-800/10',
      borderColor: 'border-emerald-500/30',
      accentColor: '#10b981',
      accentBg: 'bg-emerald-500/20'
    },
    {
      id: 'buyers',
      title: 'For Buyers & Consumers',
      subtitle: '👥 Shopping Community',
      description: 'Shop authentic Ethiopian products with confidence. Verified sellers, secure checkout with CBE escrow, fast nationwide shipping, and 7-day returns.',
      icon: '👥',
      features: [
        'Verified seller verification',
        'CBE escrow protection',
        'Free shipping on orders 500+',
        '24-48 hour delivery',
        'Easy returns & refunds',
        'Community reviews & ratings'
      ],
      link: '/products',
      linkText: 'Start Shopping',
      bgClass: 'from-purple-900/20 to-purple-800/10',
      borderColor: 'border-purple-500/30',
      accentColor: '#8b5cf6',
      accentBg: 'bg-purple-500/20'
    }
  ];

  return (
    <section id="business-showcase" className="relative w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-[#052919] via-[#0a3a2a] to-[#052919] overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-40 left-10 w-80 h-80 bg-[#E5A93C]/3 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-[#E5A93C]/2 rounded-full blur-3xl opacity-15 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#083B24]/40 border border-[#E5A93C]/30 rounded-full backdrop-blur-md mb-6">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E5A93C]"></div>
            <span className="text-xs md:text-sm font-semibold text-[#E5A93C] tracking-wider">
              💡 ECOSYSTEM ROLES
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Three Ways to Participate in Aritii Market
          </h2>
          <p className="text-base md:text-lg text-gray-300 leading-relaxed">
            Whether you deliver packages, sell products, or shop smart, Aritii Market has a role for you in our thriving commerce ecosystem.
          </p>
        </div>

        {/* Three-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`group relative bg-gradient-to-br ${role.bgClass} border ${role.borderColor} rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[#E5A93C]/50 hover:-translate-y-2`}
            >
              {/* Background gradient accent */}
              <div className={`absolute inset-0 ${role.accentBg} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

              {/* Content */}
              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="space-y-3">
                  <div className="text-5xl">{role.icon}</div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#E5A93C]/80">
                    {role.subtitle}
                  </span>
                  <h3 className="text-2xl md:text-xl font-bold text-white leading-snug">
                    {role.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                  {role.description}
                </p>

                {/* Features List */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <p className="text-xs font-semibold uppercase text-[#E5A93C]/80 mb-3">Key Benefits</p>
                  {role.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs md:text-sm text-gray-300">
                      <span className="text-[#E5A93C] font-bold flex-shrink-0 mt-1">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
                  {role.id === 'riders' && (
                    <>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#E5A93C]">{mockEcosystemStats.riders.active}</div>
                        <div className="text-xs text-gray-400 mt-1">Active Riders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#E5A93C]">{mockEcosystemStats.riders.dailyDeliveries}</div>
                        <div className="text-xs text-gray-400 mt-1">Daily</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#E5A93C]">{mockEcosystemStats.riders.avgEarningPerDay}</div>
                        <div className="text-xs text-gray-400 mt-1">Avg Earnings</div>
                      </div>
                    </>
                  )}
                  {role.id === 'sellers' && (
                    <>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#E5A93C]">{mockEcosystemStats.sellers.active}</div>
                        <div className="text-xs text-gray-400 mt-1">Sellers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#E5A93C]">{mockEcosystemStats.sellers.listings}</div>
                        <div className="text-xs text-gray-400 mt-1">Listings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#E5A93C]">{mockEcosystemStats.sellers.avgMonthlyRevenue}</div>
                        <div className="text-xs text-gray-400 mt-1">Avg Revenue</div>
                      </div>
                    </>
                  )}
                  {role.id === 'buyers' && (
                    <>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#E5A93C]">{mockEcosystemStats.buyers.monthly}</div>
                        <div className="text-xs text-gray-400 mt-1">Monthly</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#E5A93C]">{mockEcosystemStats.buyers.categories}</div>
                        <div className="text-xs text-gray-400 mt-1">Categories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#E5A93C]">{mockEcosystemStats.buyers.avgOrderValue}</div>
                        <div className="text-xs text-gray-400 mt-1">Avg Order</div>
                      </div>
                    </>
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  to={role.link}
                  className="group/btn inline-flex items-center justify-between w-full gap-3 px-6 py-3 mt-4 bg-[#E5A93C] hover:bg-[#f0b856] text-[#052919] font-bold text-sm md:text-base rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#E5A93C]/40"
                >
                  <span>{role.linkText}</span>
                  <svg className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>

              {/* Hover border accent */}
              <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[#E5A93C]/20 transition-colors duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-20 pt-16 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#E5A93C]">150K+</div>
              <div className="text-sm text-gray-300 mt-2">Total Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#E5A93C]">15M+ Birr</div>
              <div className="text-sm text-gray-300 mt-2">GMV (Last 90 Days)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#E5A93C]">98.5%</div>
              <div className="text-sm text-gray-300 mt-2">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#E5A93C]">8 Regions</div>
              <div className="text-sm text-gray-300 mt-2">Active Coverage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessShowcase;
