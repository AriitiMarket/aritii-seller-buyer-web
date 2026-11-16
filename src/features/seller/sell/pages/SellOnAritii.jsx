import React from 'react';
import { Link } from 'react-router-dom';
import {
  AiOutlineArrowRight,
  AiOutlineThunderbolt,
  AiOutlineDollar,
  AiOutlineSafety,
} from 'react-icons/ai';
import SellerCenterLayout from '@/public/sell/layout/SellerCenterLayout';
import SellerBenefits from '@/public/sell/components/SellerBenefits';
import SellerHowItWorks from '@/public/sell/components/SellerHowItWorks';
import { useLayout } from '@/app/providers/LayoutContext';

/**
 * SellOnAritiiPage (/sell-on-aritii)
 * Unified with Aritii Seller Central layout & branding.
 */
const SellOnAritiiPage = () => {
  const { openLoginModal } = useLayout();

  return (
    <SellerCenterLayout>
      {/* Aritii Dark Slate Hero */}
      <section className="bg-[#141414] text-white py-14 md:py-20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <span className="inline-block px-3.5 py-1 mb-4 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                Sell on Aritii Marketplace
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Launch your digital store. <span className="text-[#75d04b]">Sell to local buyers.</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
                Aritii Market connects your products to verified buyers across Ethiopia. We provide the storefront, secure escrow payments, and driver dispatch — you fulfill orders and grow your revenue.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/seller-sign-up"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#75d04b] hover:bg-[#66bb3f] text-gray-900 font-bold text-sm rounded-full shadow-md transition-colors"
                >
                  Start Selling Today
                  <AiOutlineArrowRight size={18} />
                </Link>
                <button
                  type="button"
                  onClick={() => openLoginModal('SELLER')}
                  className="px-6 py-3.5 border border-gray-700 hover:border-gray-500 text-white font-semibold text-sm rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Seller Log In
                </button>
              </div>
            </div>

            {/* Visual Box */}
            <div className="lg:col-span-5">
              <div className="bg-[#181818] border border-gray-800 rounded-xl p-6 shadow-2xl">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
                  <span>Merchant Highlights</span>
                  <span className="text-amber-400 text-xs font-semibold">Ethiopia Wide</span>
                </h3>
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <AiOutlineThunderbolt className="text-amber-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white">Same-Day Rider Dispatch</p>
                      <p className="text-[11px] text-gray-400">Automated handoff to registered couriers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AiOutlineDollar className="text-[#75d04b] text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white">Low 5% - 8% Commission</p>
                      <p className="text-[11px] text-gray-400">No recurring monthly software fees</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AiOutlineSafety className="text-[#0ea5e9] text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white">Guaranteed Payouts</p>
                      <p className="text-[11px] text-gray-400">Direct settlements to CBE, Telebirr & Awash</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <SellerBenefits />
      </section>

      {/* How it works */}
      <section className="bg-white dark:bg-gray-900 py-12 md:py-16 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SellerHowItWorks />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#141414] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to expand your local business?</h2>
          <p className="text-xs sm:text-sm text-gray-400 mb-6 max-w-lg mx-auto">
            Sign up in minutes, list your inventory, and start receiving customer orders across your neighborhood.
          </p>
          <Link
            to="/seller-sign-up"
            className="inline-block px-8 py-3 bg-[#75d04b] hover:bg-[#66bb3f] text-gray-900 font-bold text-xs rounded-full transition-colors"
          >
            Create Seller Account Now
          </Link>
        </div>
      </section>
    </SellerCenterLayout>
  );
};

export default SellOnAritiiPage;
