import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight, AiOutlineCheck, AiOutlineDashboard } from 'react-icons/ai';
import SellerCenterLayout from '@/public/sell/layout/SellerCenterLayout';
import BusinessDashboardHero from '@/business/components/BusinessDashboardHero';

/**
 * SellerCenterWorkspacePage — /seller-center/workspace
 *
 * Shows real seller dashboard for approved sellers, or marketing preview for non-sellers.
 * Uses independent SellerCenterLayout for header and navigation.
 */
const SellerCenterWorkspacePage = () => {
  const { isSeller } = useSelector((state) => state.seller || {});

  // Show real dashboard for authenticated approved sellers
  if (isSeller) {
    return (
      <SellerCenterLayout>
        <BusinessDashboardHero />
      </SellerCenterLayout>
    );
  }

  // Show marketing preview for non-sellers
  return (
    <SellerCenterLayout>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-[#131921] to-[#232f3e] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-4 rounded-full bg-[#FF9900]/20 text-[#FF9900] text-xs font-bold uppercase tracking-wider">
              Your Workspace
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Manage your entire business in one place
            </h1>
            <p className="text-lg text-white/90">
              The Aritii seller dashboard gives you complete control over your products, orders, inventory, and growth.
            </p>
          </div>
        </div>
      </section>

      {/* Workspace Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Your Command Center
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Once approved, your seller dashboard keeps the day-to-day under control — so you always know what to pack, what to restock, and how you are growing.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Products & pricing — publish and update your catalog',
                'Orders — a live queue of what buyers have ordered',
                'Inventory — stock levels that stay honest with sales',
                'Buyer messages — questions and order details in one inbox',
                'Fulfillment — confirm, pack, and hand orders to delivery',
                'Analytics — sales, revenue and shop performance',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <AiOutlineCheck className={`${exp.accentText} flex-shrink-0 mt-0.5`} size={18} aria-hidden="true" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{line}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/seller-sign-up"
              className={`group inline-flex items-center justify-center gap-2 px-8 py-3 font-bold rounded-lg transition-colors ${exp.button}`}
            >
              Start Selling
              <AiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Today in your shop</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${exp.badge}`}>
                  Live
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">New orders</p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">7</p>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ready for delivery</p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">5</p>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Products live</p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">42</p>
                </div>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Buyer messages</p>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">3</p>
                </div>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-3">
                <AiOutlineDashboard size={20} className={`${exp.accentText} flex-shrink-0`} aria-hidden="true" />
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                  Packed orders hand off to the delivery network automatically — riders see the request the moment you confirm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Overview */}
      <section className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
            Everything you need to scale
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Product Management',
                description: 'Upload bulk products, manage variants, set pricing, and update stock from one dashboard.',
                icon: '📦',
              },
              {
                title: 'Order Management',
                description: 'See all orders in real time. Confirm, pack, and hand off to delivery with one click.',
                icon: '📋',
              },
              {
                title: 'Inventory Tracking',
                description: 'Stock levels update automatically as orders come in. Never oversell again.',
                icon: '📊',
              },
              {
                title: 'Buyer Messaging',
                description: 'Answer questions and provide order updates directly through the platform.',
                icon: '💬',
              },
              {
                title: 'Sales Analytics',
                description: 'Track what sells, when, and who your buyers are. Make data-driven decisions.',
                icon: '📈',
              },
              {
                title: 'Promotions & Discounts',
                description: 'Run promotions, offer discounts, and boost visibility during peak seasons.',
                icon: '🎯',
              },
            ].map((tool) => (
              <div
                key={tool.title}
                className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-3">{tool.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{tool.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Support */}
      <section className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Secure & Reliable</h3>
              <ul className="space-y-3">
                {[
                  'Secure payment processing',
                  'Protected seller data',
                  'Real-time order notifications',
                  'Dispute resolution support',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <AiOutlineCheck className={`${exp.accentText} flex-shrink-0 mt-0.5`} size={18} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Seller Support</h3>
              <ul className="space-y-3">
                {[
                  'Email and chat support',
                  'Seller documentation & guides',
                  'Community seller forums',
                  'Regular product updates',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <AiOutlineCheck className={`${exp.accentText} flex-shrink-0 mt-0.5`} size={18} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#FDF6EC] dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to launch your shop?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Start your seller application today. Get approved in 1-3 days and begin selling.
          </p>
          <Link
            to="/seller-sign-up"
            className={`group inline-flex items-center justify-center gap-2 px-10 py-4 font-bold rounded-full text-base transition-colors ${exp.button}`}
          >
            Become a Seller
            <AiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
          </Link>
        </div>
      </section>
    </SellerCenterLayout>
  );
};

export default SellerCenterWorkspacePage;
