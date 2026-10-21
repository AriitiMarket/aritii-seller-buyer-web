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
 * Amazon Seller Central Overview page
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
      {/* Amazon-style Dark Slate Hero */}
      <section className="bg-[#131921] text-white py-14 sm:py-20 border-b border-[#232F3E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <span className="inline-block px-3 py-1 mb-4 rounded bg-[#232F3E] text-[#FF9900] text-xs font-bold uppercase tracking-wider border border-[#37475A]">
                Seller Central · Program Overview
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 leading-tight">
                Grow your brand and business on <span className="text-[#FF9900]">Aritii Market</span>
              </h1>
              <p className="text-base sm:text-lg text-[#CCCCCB] mb-8 leading-relaxed max-w-xl">
                Whether you're an independent craftsperson, a local grocery merchant, or an established distributor, Aritii delivers the digital tools, buyers, and logistics network you need to expand your sales.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/seller-sign-up"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FF9900] hover:bg-[#E68A00] text-[#111111] font-bold text-sm rounded shadow-md transition-colors"
                >
                  Create Seller Account
                  <AiOutlineArrowRight size={18} />
                </Link>
                <button
                  type="button"
                  onClick={() => openLoginModal('SELLER')}
                  className="px-6 py-3.5 border border-[#565959] hover:border-white text-white font-semibold text-sm rounded bg-[#232F3E] hover:bg-[#37475A] transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Quick Amazon 3-Pillar Highlight */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[#1A222D] p-5 rounded-xl border border-[#232F3E] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#FF9900]/10 text-[#FF9900] flex items-center justify-center flex-shrink-0">
                  <AiOutlineShop size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Dedicated Storefront</h3>
                  <p className="text-xs text-[#999999] mt-0.5">Showcase your brand identity, custom logo, business hours, and full product line.</p>
                </div>
              </div>

              <div className="bg-[#1A222D] p-5 rounded-xl border border-[#232F3E] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center flex-shrink-0">
                  <AiOutlineLineChart size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Real-time Order Analytics</h3>
                  <p className="text-xs text-[#999999] mt-0.5">Track daily sales volume, pending processing, inventory alerts, and customer reviews.</p>
                </div>
              </div>

              <div className="bg-[#1A222D] p-5 rounded-xl border border-[#232F3E] flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-[#00A8E1] flex items-center justify-center flex-shrink-0">
                  <AiOutlineSafetyCertificate size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Protected Direct Settlements</h3>
                  <p className="text-xs text-[#999999] mt-0.5">Automated payouts right to Telebirr, CBE, or any Ethiopian domestic bank.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Core Pillars */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1111] dark:text-white mb-2">
            Built to empower Ethiopian merchants
          </h2>
          <p className="text-sm text-[#565959] dark:text-gray-400">
            Discover why businesses are moving their catalog to Aritii Market
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <span className="text-2xl font-black text-[#FF9900] block mb-2">01</span>
            <h3 className="font-bold text-base text-[#0F1111] dark:text-white mb-2">Reach Ready Local Buyers</h3>
            <p className="text-xs text-[#565959] dark:text-gray-400 leading-relaxed">
              Buyers in Addis Ababa and surrounding zones visit daily looking for local products. Position your catalog right in front of active purchase intent.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <span className="text-2xl font-black text-[#FF9900] block mb-2">02</span>
            <h3 className="font-bold text-base text-[#0F1111] dark:text-white mb-2">Integrated Logistics & Dispatch</h3>
            <p className="text-xs text-[#565959] dark:text-gray-400 leading-relaxed">
              No need to hire your own couriers. Once you mark an order ready, our delivery partner network dispatches a rider to pick it up and deliver it.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <span className="text-2xl font-black text-[#FF9900] block mb-2">03</span>
            <h3 className="font-bold text-base text-[#0F1111] dark:text-white mb-2">Seamless Multi-Shop Support</h3>
            <p className="text-xs text-[#565959] dark:text-gray-400 leading-relaxed">
              Manage multiple branches or product categories from one central login. Switch between shops with one click in the header dropdown.
            </p>
          </div>
        </div>

        {/* Navigation cards to other sections */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/seller-center/benefits"
            className="p-5 bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-[#FF9900] transition-colors group flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-sm text-[#0F1111] dark:text-white">Detailed Benefits</p>
              <p className="text-xs text-[#565959] dark:text-gray-400">Explore tools, support & features</p>
            </div>
            <span className="text-[#FF9900] group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            to="/seller-center/how-it-works"
            className="p-5 bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-[#FF9900] transition-colors group flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-sm text-[#0F1111] dark:text-white">How It Works</p>
              <p className="text-xs text-[#565959] dark:text-gray-400">Step-by-step registration to payout</p>
            </div>
            <span className="text-[#FF9900] group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          <Link
            to="/seller-center/workspace"
            className="p-5 bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-lg hover:border-[#FF9900] transition-colors group flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-sm text-[#0F1111] dark:text-white">Workspace Preview</p>
              <p className="text-xs text-[#565959] dark:text-gray-400">Preview the seller management dashboard</p>
            </div>
            <span className="text-[#FF9900] group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>
    </SellerCenterLayout>
  );
};

export default SellerCenterOverviewPage;
