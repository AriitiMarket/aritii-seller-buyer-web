import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Advertisements - curated advertisement / partner slots on the public website.
 *
 * Presentation-only and intentionally compact. For the MVP the slots are curated
 * in code; when the backend exposes a public advertisements feed only this
 * component changes, and it must go through a public-content service rather than
 * fetching ad-hoc (see docs/PUBLIC_CONTENT.md).
 */
const AD_SLOTS = [
  {
    id: 'airlines',
    title: 'Ethiopian Airlines',
    description: 'Fly local - connecting Ethiopia',
    icon: '✈️',
    gradient: 'from-blue-600 to-blue-700',
  },
  {
    id: 'cbe-birr',
    title: 'CBE Birr',
    description: 'Secure digital payments',
    icon: '💳',
    gradient: 'from-green-600 to-green-700',
  },
  {
    id: 'dhl',
    title: 'DHL Ethiopia',
    description: 'Reliable delivery nationwide',
    icon: '',
    gradient: 'from-yellow-600 to-yellow-700',
  },
];

const Advertisements = () => {
  return (
    <section className="py-10 md:py-14 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Our Partners</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Trusted partners powering Aritii Market</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {AD_SLOTS.map((ad) => (
            <Link
              key={ad.id}
              to="/about"
              className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${ad.gradient} text-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
            >
              <div className="relative z-10 p-5 md:p-6">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold mb-3">
                  Partner
                </span>
                <div className="text-2xl mb-2">{ad.icon}</div>
                <h3 className="text-base md:text-lg font-bold mb-1">{ad.title}</h3>
                <p className="text-sm text-white/80 mb-4">{ad.description}</p>
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>Learn more</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
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

export { Advertisements };
export default Advertisements;
