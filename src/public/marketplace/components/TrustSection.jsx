import React from 'react';
import { Link } from 'react-router-dom';

/**
 * TrustSection - Marketplace trust signals and value propositions
 */
const TrustSection = () => {
  const trustItems = [
    {
      icon: '🏪',
      title: 'Local Marketplace',
      description: 'Discover products from local businesses across Ethiopia.',
    },
    {
      icon: '✓',
      title: 'Verified Sellers',
      description: 'Shop from sellers approved through the platform.',
    },
    {
      icon: '🛍️',
      title: 'Simple Shopping',
      description: 'Browse products and shops easily with a clean experience.',
    },
    {
      icon: '🤝',
      title: 'Community First',
      description: 'Built around local commerce and community connections.',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-[#FDF6EC] dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Why Shop on Aritii Market?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your trusted local marketplace for authentic products and verified sellers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#75d04b] hover:bg-[#5ac12f] text-white font-semibold rounded-lg transition-colors"
          >
            Learn More About Us
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export { TrustSection };
export default TrustSection;
