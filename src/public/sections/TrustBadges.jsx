import React from 'react';

/**
 * TrustBadges - Trust signals and platform benefits
 * Shows why users should trust and use Aritii Market
 */
const TrustBadges = () => {
  const benefits = [
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'Your transactions are protected with industry-standard encryption'
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Get your orders delivered quickly by trusted local couriers'
    },
    {
      icon: '✓',
      title: 'Verified Sellers',
      description: 'Shop from verified and trusted local businesses'
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Our team is here to help you anytime you need assistance'
    },
  ];

  return (
    <section className="py-10 md:py-14 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { TrustBadges };
export default TrustBadges;
