import React from 'react';

/**
 * SocialProof - Platform statistics and social proof
 * Shows numbers that build trust and credibility
 */
const SocialProof = () => {
  const stats = [
    { value: '10K+', label: 'Active Sellers' },
    { value: '50K+', label: 'Products Listed' },
    { value: '100K+', label: 'Happy Customers' },
    { value: '500K+', label: 'Orders Delivered' },
  ];

  return (
    <section className="py-12 md:py-16 bg-[#FDF6EC] dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { SocialProof };
export default SocialProof;
