import React from 'react';
import {
  MdOutlineStorefront,
  MdOutlineInventory2,
  MdOutlineLocalShipping,
  MdOutlinePayments,
  MdOutlineInsights,
  MdOutlineShield,
} from 'react-icons/md';

/**
 * SellerCentralFeatures - Aritii Seller feature grid
 * Highlights fulfillment, payments, metrics, and security.
 */
const SellerCentralFeatures = () => {
  const features = [
    {
      icon: MdOutlineStorefront,
      title: 'Digital Storefront',
      description: 'Custom shop profile, banner, brand story, and product catalog that look professional across desktop and mobile.',
    },
    {
      icon: MdOutlineInventory2,
      title: 'Real-Time Stock Management',
      description: 'Automated stock reservation on orders, low-stock notifications, and batch inventory updates to avoid overselling.',
    },
    {
      icon: MdOutlineLocalShipping,
      title: 'Fulfillment by Aritii (FBA)',
      description: 'Automatic rider dispatch, trackable order status, and instant delivery notifications right to your customers.',
    },
    {
      icon: MdOutlinePayments,
      title: 'Fast, Flexible Payouts',
      description: 'Receive earnings directly into Commercial Bank of Ethiopia (CBE), Telebirr, Awash, or your designated bank.',
    },
    {
      icon: MdOutlineInsights,
      title: 'Advanced Analytics & Reports',
      description: 'Track daily revenue, best sellers, customer retention, return rates, and profit margins through clean dashboards.',
    },
    {
      icon: MdOutlineShield,
      title: 'Seller Protection & Verification',
      description: 'Protected payments, dispute resolution support, verified buyer accounts, and anti-fraud order screening.',
    },
  ];

  return (
    <section id="benefits" className="py-16 md:py-24 bg-white dark:bg-gray-900 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-3 py-1 rounded-full">
            Why Sell on Aritii
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3 mb-4">
            Everything you need to sell, deliver, and scale
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Engineered with the same high-standard seller tools used by global e-commerce leaders, tailored for local Ethiopian trade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60 hover:border-[#75d04b] dark:hover:border-[#75d04b] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-[#75d04b] mb-5 group-hover:scale-110 transition-transform">
                  <Icon size={26} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SellerCentralFeatures;
