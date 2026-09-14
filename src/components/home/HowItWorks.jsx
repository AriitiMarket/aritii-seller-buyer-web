import React from 'react';

/**
 * HowItWorks - Step-by-step explanation of the platform
 */

const steps = [
  {
    step: '01',
    icon: '🔍',
    title: 'Discover',
    desc: 'Browse thousands of products from verified local sellers across Ethiopia.',
  },
  {
    step: '02',
    icon: '🛒',
    title: 'Order',
    desc: 'Add items to cart and checkout securely with CBE escrow protection.',
  },
  {
    step: '03',
    icon: '📦',
    title: 'Deliver',
    desc: 'Get your order delivered to your doorstep within 24-48 hours.',
  },
  {
    step: '04',
    icon: '⭐',
    title: 'Review',
    desc: 'Rate your experience and help other buyers make informed decisions.',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#052919]">How Ariiti Market Works</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">Simple, secure, and designed for Ethiopia</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center p-5 md:p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#E5A93C]/30 hover:shadow-md transition-all duration-300">
              <span className="text-[10px] md:text-xs font-bold text-[#E5A93C] tracking-widest">{step.step}</span>
              <div className="text-3xl md:text-4xl mt-3 mb-3">{step.icon}</div>
              <h3 className="text-sm md:text-base font-bold text-[#052919] mb-2">{step.title}</h3>
              <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              {/* Connector line (hidden on mobile, last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
