import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';
import SellerCenterLayout from '@/public/sell/layout/SellerCenterLayout';

/**
 * SellerCenterOverviewPage — /seller-center/overview
 *
 * Introduction to selling on Aritii with hero section and CTA.
 * Users can navigate to Benefits, How It Works, and Workspace pages.
 *
 * Uses SellerCenterLayout for independent header/footer and sub-navigation.
 * NO extra ExperiencePageHeader - let the layout handle navigation.
 */
const SellerCenterOverviewPage = () => {
  return (
    <SellerCenterLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#131921] to-[#232f3e] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Sell on Aritii. Grow with your local market.
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Aritii Market gives your business a storefront in front of local buyers, tools to manage products and orders, and a delivery network that moves every order to the customer. You focus on the product — we connect the rest.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/seller-sign-up"
                  className="px-8 py-4 bg-[#FF9900] hover:bg-[#E68A00] text-white font-bold rounded transition-colors inline-flex items-center gap-2"
                >
                  Start Selling
                  <AiOutlineArrowRight size={18} />
                </Link>
                <Link
                  to="/seller-center/benefits"
                  className="px-8 py-4 border border-gray-400 text-white hover:bg-white/10 font-bold rounded transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="hidden lg:block">
              <img
                src="/seller.png"
                alt="Aritii Seller Hub with shop management and growth tools"
                width="1024"
                height="512"
                loading="eager"
                fetchPriority="high"
                className="w-full rounded-2xl border border-white/20 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Sell on Aritii?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Everything you need to succeed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Local Reach', description: 'Connect with buyers in your community who want what you sell' },
              { title: 'Easy Management', description: 'Manage products, orders, and inventory from one dashboard' },
              { title: 'Integrated Delivery', description: 'Built-in delivery network that handles logistics for you' },
            ].map((item) => (
              <div key={item.title} className="p-8 bg-[#F7F7F7] dark:bg-gray-900 rounded-lg border border-[#E7E5E4] dark:border-gray-800">
                <h3 className="font-bold text-[#0F1111] dark:text-white mb-3">{item.title}</h3>
                <p className="text-[#565959] dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/seller-center/benefits"
              className="px-6 py-3 bg-[#FF9900] hover:bg-[#E68A00] text-white font-semibold rounded-lg transition-colors text-center"
            >
              Explore Benefits
            </Link>
            <Link
              to="/seller-center/how-it-works"
              className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
            >
              How It Works
            </Link>
            <Link
              to="/seller-center/workspace"
              className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
            >
              Workspace Preview
            </Link>
          </div>
        </div>
      </section>
    </SellerCenterLayout>
  );
};

export default SellerCenterOverviewPage;
