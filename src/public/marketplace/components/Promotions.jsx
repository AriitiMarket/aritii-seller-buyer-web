import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Promotions - Deal cards with countdown and discount badges
 */

const deals = [
  { id: 1, title: 'Mega Fashion Sale', desc: 'Up to 60% off on traditional & modern wear', badge: 'HOT', color: 'from-red-500 to-red-600', icon: '👗' },
  { id: 2, title: 'Tech Week Deals', desc: 'Latest gadgets at unbeatable prices', badge: 'NEW', color: 'from-blue-600 to-blue-500', icon: '📱' },
  { id: 3, title: 'Coffee Festival', desc: 'Premium Ethiopian coffee directly from farms', badge: 'LIMITED', color: 'from-amber-700 to-amber-500', icon: '☕' },
];

const Promotions = () => {
  return (
    <section className="py-10 md:py-14 bg-[#FDF6EC] dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Deals & Promotions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Limited time offers from top sellers</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f] flex items-center gap-1 transition-colors"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Deal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {deals.map((deal) => (
            <Link
              to="/products"
              key={deal.id}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br text-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${deal.color}`}></div>
              <div className="relative z-10 p-6 md:p-8">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold mb-4">{deal.badge}</span>
                <span className="block text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform">{deal.icon}</span>
                <h3 className="text-lg md:text-xl font-bold mb-2">{deal.title}</h3>
                <p className="text-sm text-white/80">{deal.desc}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
                  <span>Shop Now</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Promotions };
export default Promotions;
