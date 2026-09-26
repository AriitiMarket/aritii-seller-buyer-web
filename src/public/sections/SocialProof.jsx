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
    <section className="py-12 md:py-16 bg-[#75d04b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-white/90">
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
