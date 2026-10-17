import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight, AiOutlineCheck } from 'react-icons/ai';
import SellerCenterLayout from '@/public/sell/layout/SellerCenterLayout';
import SellerBenefits from '@/public/sell/components/SellerBenefits';

/**
 * SellerCenterBenefitsPage — /seller-center/benefits
 *
 * Detailed benefits of selling on Aritii.
 * Uses independent SellerCenterLayout for header and navigation.
 */
const SellerCenterBenefitsPage = () => {
  return (
    <SellerCenterLayout>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-[#131921] to-[#232f3e] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[#FF9900]/20 text-[#FF9900] text-xs font-bold uppercase tracking-wider">
              Seller Benefits
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to grow your business
            </h1>
            <p className="text-lg text-white/90">
              Aritii gives you the tools, reach, and support to turn local customers into loyal shoppers.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <SellerBenefits />
      </section>

      {/* Detailed Benefits */}
      <section className="bg-white dark:bg-gray-900 py-12 md:py-16 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
            Why sellers choose Aritii
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Local Market Advantage',
                description: 'Tap into customers actively looking for products in your community. Skip international shipping delays.',
                items: ['Local customer focus', 'Shorter delivery times', 'Community trust'],
              },
              {
                title: 'Simple Tools',
                description: 'No coding required. Manage your entire shop with intuitive, easy-to-use tools.',
                items: ['Easy product uploads', 'One-click pricing', 'Inventory tracking'],
              },
              {
                title: 'Built-in Delivery',
                description: "Orders automatically connect to Aritii's delivery network. Focus on packing, we handle delivery.",
                items: ['Automatic fulfillment', 'Real-time tracking', 'Customer visibility'],
              },
              {
                title: 'Grow Your Sales',
                description: 'Reach more customers through promotions, analytics, and seller support.',
                items: ['Sales reports', 'Promotion tools', 'Buyer insights'],
              },
            ].map((benefit) => (
              <div key={benefit.title} className="p-8 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-5">{benefit.description}</p>
                <ul className="space-y-2">
                  {benefit.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <AiOutlineCheck className="text-[#2f6e4f] flex-shrink-0 mt-0.5" size={18} aria-hidden="true" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#FDF6EC] dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to start selling?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            See how the onboarding works and preview your seller workspace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/seller-center/how-it-works"
              className="px-8 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/seller-sign-up"
              className={`group inline-flex items-center justify-center gap-2 px-8 py-3 font-bold rounded-lg transition-colors ${exp.button}`}
            >
              Start Selling
              <AiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </SellerCenterLayout>
  );
};

export default SellerCenterBenefitsPage;
