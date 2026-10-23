import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  AiOutlineArrowRight,
  AiOutlineInbox,
  AiOutlineShopping,
  AiOutlineDollarCircle,
} from 'react-icons/ai';
import SellerCenterLayout from '@/public/sell/layout/SellerCenterLayout';
import BusinessDashboardHero from '@/business/components/BusinessDashboardHero';
import SellerPageHero from '@/public/sell/components/SellerPageHero';
import { useLayout } from '@/app/providers/LayoutContext';

/**
 * SellerCenterWorkspacePage — /seller-center/workspace
 * Previews the Aritii Seller Central workspace for prospective sellers,
 * or displays the active business dashboard if already signed in as a seller.
 */
const SellerCenterWorkspacePage = () => {
  const { isSeller } = useSelector((state) => state.seller || {});
  const { openLoginModal } = useLayout();

  // If approved seller, show real seller dashboard
  if (isSeller) {
    return (
      <SellerCenterLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BusinessDashboardHero />
        </div>
      </SellerCenterLayout>
    );
  }

  // Prospective seller interactive preview
  return (
    <SellerCenterLayout>
      {/* Aritii Hero Header */}
      <SellerPageHero
        badge="Seller Central Workspace Preview"
        title="A command center designed for growing businesses"
        description="Every tool you need to manage orders, update catalog stock, track driver deliveries, and review financial payouts in one place."
      />

      {/* Interactive Mock Dashboard View */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <span className="text-xs font-bold text-[#FF9900] uppercase">Simulated Portal Preview</span>
              <h2 className="text-xl font-bold text-[#0F1111] dark:text-white mt-0.5">
                Seller Central Portal Dashboard
              </h2>
            </div>
            <div className="flex gap-2">
              <Link
                to="/seller-sign-up"
                className="px-4 py-2 bg-[#FF9900] hover:bg-[#E68A00] text-[#111111] text-xs font-bold rounded shadow-sm transition-colors"
              >
                Open Your Live Store
              </Link>
              <button
                type="button"
                onClick={() => openLoginModal('SELLER')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200 rounded transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
            <div className="p-4 rounded-xl bg-[#F7F7F7] dark:bg-gray-850 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#565959] dark:text-gray-400 font-medium">Daily Revenue</span>
                <span className="w-7 h-7 rounded bg-green-500/10 text-green-500 flex items-center justify-center text-sm font-bold">ETB</span>
              </div>
              <p className="text-2xl font-black text-[#0F1111] dark:text-white">18,450</p>
              <p className="text-[11px] text-green-600 font-semibold mt-1">↑ 24% vs last week</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F7F7] dark:bg-gray-850 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#565959] dark:text-gray-400 font-medium">Pending Orders</span>
                <AiOutlineInbox className="text-[#FF9900] text-lg" />
              </div>
              <p className="text-2xl font-black text-[#0F1111] dark:text-white">12</p>
              <p className="text-[11px] text-[#565959] dark:text-gray-400 mt-1">5 marked ready for pickup</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F7F7] dark:bg-gray-850 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#565959] dark:text-gray-400 font-medium">Live Products</span>
                <AiOutlineShopping className="text-[#00A8E1] text-lg" />
              </div>
              <p className="text-2xl font-black text-[#0F1111] dark:text-white">48</p>
              <p className="text-[11px] text-[#565959] dark:text-gray-400 mt-1">All in active circulation</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F7F7] dark:bg-gray-850 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#565959] dark:text-gray-400 font-medium">Wallet Balance</span>
                <AiOutlineDollarCircle className="text-purple-500 text-lg" />
              </div>
              <p className="text-2xl font-black text-[#0F1111] dark:text-white">32,100</p>
              <p className="text-[11px] text-green-600 font-semibold mt-1">Available for cashout</p>
            </div>
          </div>

          {/* Workflow Tabs Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div>
              <h4 className="font-bold text-sm text-[#0F1111] dark:text-white mb-1.5 flex items-center gap-2">
                <span className="text-base">📦</span> Inventory Control
              </h4>
              <p className="text-xs text-[#565959] dark:text-gray-400 leading-relaxed">
                Add variants, toggle availability, edit prices, set low-stock triggers, and prevent double selling with automatic reserve locking.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#0F1111] dark:text-white mb-1.5 flex items-center gap-2">
                <span className="text-base">🚚</span> Live Dispatch & Tracking
              </h4>
              <p className="text-xs text-[#565959] dark:text-gray-400 leading-relaxed">
                Assign orders to nearby delivery drivers, track handover, and see customer delivery confirmations in real-time.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#0F1111] dark:text-white mb-1.5 flex items-center gap-2">
                <span className="text-base">🏦</span> Payouts & Finance
              </h4>
              <p className="text-xs text-[#565959] dark:text-gray-400 leading-relaxed">
                Track every order fee, commission deduction, and request one-click withdrawals to CBE or Telebirr anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Link
            to="/seller-sign-up"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF9900] hover:bg-[#E68A00] text-[#111111] font-bold text-sm rounded shadow-md transition-colors"
          >
            Access Full Workspace — Register Now
            <AiOutlineArrowRight size={18} />
          </Link>
        </div>
      </section>
    </SellerCenterLayout>
  );
};

export default SellerCenterWorkspacePage;
