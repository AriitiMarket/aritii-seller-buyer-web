import React from 'react';
import { Link } from 'react-router-dom';
import { DELIVERY_PROVIDER_LABELS } from '@/app/config';

/**
 * DeliveryExplanation — public explanation of how an Aritii order reaches the buyer.
 *
 * Delivery is an independent domain (see docs/DELIVERY.md). The public website
 * only explains the flow; it never queries delivery data. Both Aritii's own
 * delivery and external providers are described, because the platform supports
 * more than one provider.
 */
const steps = [
  {
    step: '01',
    icon: '🏪',
    title: 'Seller prepares',
    desc: 'The shop confirms the order and packs the items.',
  },
  {
    step: '02',
    icon: '🚚',
    title: 'A rider is assigned',
    desc: 'Aritii Delivery or an external provider picks the order up.',
  },
  {
    step: '03',
    icon: '📍',
    title: 'Tracked to your door',
    desc: 'Follow the delivery status until it reaches your address.',
  },
];

const DeliveryExplanation = () => {
  return (
    <section className="py-10 md:py-14 bg-[#FDF6EC] dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Delivery, handled</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Aritii combines its own delivery network with trusted external providers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {steps.map((item) => (
            <div key={item.step} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 md:p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl md:text-3xl">{item.icon}</span>
                <span className="text-xs font-bold text-[#75d04b]">STEP {item.step}</span>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1.5">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {Object.values(DELIVERY_PROVIDER_LABELS).map((label) => (
            <span
              key={label}
              className="px-3 py-1 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-400"
            >
              {label}
            </span>
          ))}
          <Link
            to="/how-it-works"
            className="ml-auto text-sm font-semibold text-[#75d04b] hover:text-[#5ac12f] transition-colors"
          >
            How it works →
          </Link>
        </div>
      </div>
    </section>
  );
};

export { DeliveryExplanation };
export default DeliveryExplanation;
