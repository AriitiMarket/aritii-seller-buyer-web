import React, { useState } from 'react';

/**
 * HowItWorksSection - How Aritii works for different user roles
 */

const howItWorksSteps = {
  buyers: [
    { step: 1, title: 'Browse Products', description: 'Explore products from local shops', icon: '�️' },
    { step: 2, title: 'Find What You Need', description: 'Search by category, shop, or keyword', icon: '�' },
    { step: 3, title: 'Shop Securely', description: 'Purchase from verified sellers', icon: '🔒' },
    { step: 4, title: 'Get Your Items', description: 'Receive your order from local sellers', icon: '📦' },
  ],
  sellers: [
    { step: 1, title: 'Join the Platform', description: 'Register as a seller on Ariiti Market', icon: '📝' },
    { step: 2, title: 'List Your Products', description: 'Add items with details and pricing', icon: '📋' },
    { step: 3, title: 'Reach Customers', description: 'Connect with buyers across Ethiopia', icon: '�' },
    { step: 4, title: 'Grow Your Business', description: 'Build your customer base and sales', icon: '�' },
  ],
};

const HowItWorksSection = () => {
  const [activeRole, setActiveRole] = useState('buyers');
  const steps = howItWorksSteps[activeRole];

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">How Aritii Works</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Choose your role to see how Aritii Market works for you</p>
        </div>

        <div className="flex gap-3 sm:gap-4 mb-12 justify-center">
          <button 
            onClick={() => setActiveRole('buyers')} 
            className={`px-5 py-2.5 sm:px-6 sm:py-3 font-semibold rounded-lg transition-colors ${
              activeRole === 'buyers' 
                ? 'bg-[#75d04b] text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            👥 For Buyers
          </button>
          <button 
            onClick={() => setActiveRole('sellers')} 
            className={`px-5 py-2.5 sm:px-6 sm:py-3 font-semibold rounded-lg transition-colors ${
              activeRole === 'sellers' 
                ? 'bg-[#75d04b] text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            🏪 For Sellers
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step) => (
            <div key={step.step} className="text-center">
              <div className="text-4xl md:text-5xl mb-4">{step.icon}</div>
              <div className="bg-[#75d04b] text-white font-bold rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mx-auto mb-4 text-sm md:text-base">
                {step.step}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-base md:text-lg">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { HowItWorksSection }
export default HowItWorksSection