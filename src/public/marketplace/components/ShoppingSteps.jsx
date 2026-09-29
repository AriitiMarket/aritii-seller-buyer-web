/**
 * ShoppingSteps - Visual shopping journey component
 * 
 * Shows the 5-step shopping process: Browse → Choose → Order → Delivery → Receive
 */

import React from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';

const ShoppingSteps = () => {
  const steps = [
    { step: '1', title: 'Browse', description: 'Explore products and shops across categories' },
    { step: '2', title: 'Choose', description: 'Compare options and select what you need' },
    { step: '3', title: 'Order', description: 'Add to cart and check out securely' },
    { step: '4', title: 'Delivery', description: 'Track your order until it reaches you' },
    { step: '5', title: 'Receive', description: 'Get your products at your door' },
  ];

  return (
    <section className="bg-[#FDF6EC] dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[#75d04b]/10 text-[#5ac12f] text-xs font-bold uppercase tracking-wider">
            Shopping Journey
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            How Shopping Works
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            From discovery to delivery — a simple, transparent process
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {steps.map((item, index) => (
            <div
              key={item.step}
                className="relative flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="hidden lg:flex absolute -right-7 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white dark:bg-gray-900 border border-[#75d04b]/40 text-[#75d04b] items-center justify-center"
                >
                  <AiOutlineArrowRight size={15} />
                </span>
              )}

              <span className="w-10 h-10 rounded-full bg-[#75d04b] text-white font-bold flex items-center justify-center text-sm mb-3">
                {item.step}
              </span>

              <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShoppingSteps;
