import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AiOutlineArrowRight,
  AiOutlineLineChart,
  AiOutlineShop,
  AiOutlineSafetyCertificate,
} from 'react-icons/ai';
import { useSelector } from 'react-redux';
import SellerCenterLayout from '@/public/sell/layout/SellerCenterLayout';
import { useLayout } from '@/app/providers/LayoutContext';

/**
 * SellerCenterOverviewPage — /seller-center/overview
 * Aritii Seller Central Overview page
 */
const SellerCenterOverviewPage = () => {
  const navigate = useNavigate();
  const { isSeller } = useSelector((state) => state.seller || {});
  const { openLoginModal } = useLayout();

  useEffect(() => {
    if (isSeller) navigate('/business', { replace: true });
  }, [isSeller, navigate]);

  if (isSeller) return null;

  return (
    <SellerCenterLayout>
      {/* Aritii Dark Hero */}
      <section className="bg-[#141414] text-white py-14 sm:py-20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <span className="inline-block px-3.5 py-1 mb-4 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                Seller Central · Program Overview
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight">
                Grow your brand and business on <span className="text-[#75d04b]">Aritii Market</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
                Whether you're an independent craftsperson, a local grocery merchant, or an established distributor, Aritii delivers the digital tools, buyers, and logistics network you need to expand your sales.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/seller-sign-up"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#75d04b] hover:bg-[#66bb3f] text-gray-900 font-bold text-sm rounded-full shadow-md transition-colors"
                >
                  Create Seller Account
                  <AiOutlineArrowRight size={18} />
                </Link>
                <button
                  type="button"
                  onClick={() => openLoginModal('SELLER')}
                  className="px-6 py-3.5 border border-gray-700 hover:border-gray-500 text-white font-semibold text-sm rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Quick Aritii 3-Pillar Highlight */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#181818] p-5 rounded-xl border border-gray-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#75d04b]/15 text-[#75d04b] flex items-center justify-center flex-shrink-0">
                  <AiOutlineShop size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Dedicated Storefront</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Showcase your brand identity, custom logo, business hours, and full product line.</p>
                </div>
              </div>

              <div className="bg-[#181818] p-5 rounded-xl border border-gray-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#75d04b]/15 text-[#75d04b] flex items-center justify-center flex-shrink-0">
                  <AiOutlineLineChart size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Real-time Order Analytics</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Track daily sales volume, pending processing, inventory alerts, and customer reviews.</p>
                </div>
              </div>

              <div className="bg-[#181818] p-5 rounded-xl border border-gray-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-[#0ea5e9] flex items-center justify-center flex-shrink-0">
                  <AiOutlineSafetyCertificate size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Protected Direct Settlements</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Automated payouts right to Telebirr, CBE, or any Ethiopian domestic bank.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Core Pillars */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141414] dark:text-white mb-2">
            Built to empower Ethiopian merchants
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Discover why businesses are moving their catalog to Aritii Market
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <span className="text-2xl font-black text-[#75d04b] block mb-2">01</span>
            <h3 className="font-bold text-base text-[#141414] dark:text-white mb-2">Reach Ready Local Buyers</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Buyers in Addis Ababa and surrounding zones visit daily looking for local products. Position your catalog right in front of active purchase intent.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <span className="text-2xl font-black text-[#75d04b] block mb-2">02</span>
            <h3 className="font-bold text-base text-[#141414] dark:text-white mb-2">Integrated Logistics & Dispatch</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              No need to hire your own couriers. Once you mark an order ready, our delivery partner network dispatches a rider to pick it up and deliver it.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <span className="text-2xl font-black text-[#75d04b] block mb-2">03</span>
            <h3 className="font-bold text-base text-[#141414] dark:text-white mb-2">Seamless Multi-Shop Support</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Manage multiple branches or product categories from one central login. Switch between shops with one click in the header dropdown.
            </p>
          </div>
        </div>

        {/* Navigation cards to other sections */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/seller-center/benefits"
            className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#75d04b] dark:hover:border-[#75d04b] transition-colors group flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-sm text-[#141414] dark:text-white">Detailed Benefits</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Explore tools, support & features</p>
            </div>
            <span className="text-[#75d04b] group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            to="/seller-center/how-it-works"
            className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#75d04b] dark:hover:border-[#75d04b] transition-colors group flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-sm text-[#141414] dark:text-white">How It Works</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Step-by-step registration to payout</p>
            </div>
            <span className="text-[#75d04b] group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            to="/seller-center/workspace"
            className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#75d04b] dark:hover:border-[#75d04b] transition-colors group flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-sm text-[#141414] dark:text-white">Workspace Preview</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Preview the seller management dashboard</p>
            </div>
            <span className="text-[#75d04b] group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>
    </SellerCenterLayout>
  );
};

export default SellerCenterOverviewPage;
