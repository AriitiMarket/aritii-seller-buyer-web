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
 * Unified with Amazon Seller Central layout & branding.
 */
const SellOnAritiiPage = () => {
  const { openLoginModal } = useLayout();

  return (
    <SellerCenterLayout>
      {/* Amazon-style Dark Slate Hero */}
      <section className="bg-[#131921] text-white py-14 md:py-20 border-b border-[#232F3E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <span className="inline-block px-3 py-1 mb-4 rounded bg-[#232F3E] text-[#FF9900] text-xs font-bold uppercase tracking-wider border border-[#37475A]">
                Sell on Aritii Marketplace
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Launch your digital store. <span className="text-[#FF9900]">Sell to local buyers.</span>
              </h1>
              <p className="text-base sm:text-lg text-[#CCCCCB] mb-8 leading-relaxed max-w-xl">
                Aritii Market connects your products to verified buyers across Ethiopia. We provide the storefront, secure escrow payments, and driver dispatch — you fulfill orders and grow your revenue.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/seller-sign-up"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FF9900] hover:bg-[#E68A00] text-[#111111] font-bold text-sm rounded shadow-md transition-colors"
                >
                  Start Selling Today
                  <AiOutlineArrowRight size={18} />
                </Link>
                <button
                  type="button"
                  onClick={() => openLoginModal('SELLER')}
                  className="px-6 py-3.5 border border-[#565959] hover:border-white text-white font-semibold text-sm rounded bg-[#232F3E] hover:bg-[#37475A] transition-colors"
                >
                  Seller Log In
                </button>
              </div>
            </div>

            {/* Visual Box */}
            <div className="lg:col-span-5">
              <div className="bg-[#1A222D] border border-[#232F3E] rounded-xl p-6 shadow-2xl">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
                  <span>Merchant Highlights</span>
                  <span className="text-[#FF9900] text-xs font-semibold">Ethiopia Wide</span>
                </h3>
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <AiOutlineThunderbolt className="text-[#FF9900] text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white">Same-Day Rider Dispatch</p>
                      <p className="text-[11px] text-[#999999]">Automated handoff to registered couriers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AiOutlineDollar className="text-green-400 text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white">Low 5% - 8% Commission</p>
                      <p className="text-[11px] text-[#999999]">No recurring monthly software fees</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AiOutlineSafety className="text-[#00A8E1] text-lg flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-white">Guaranteed Payouts</p>
                      <p className="text-[11px] text-[#999999]">Direct settlements to CBE, Telebirr & Awash</p>
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
      <section className="bg-white dark:bg-[#1a222d] py-12 md:py-16 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SellerHowItWorks />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#232F3E] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to expand your local business?</h2>
          <p className="text-xs sm:text-sm text-[#CCCCCB] mb-6 max-w-lg mx-auto">
            Sign up in minutes, list your inventory, and start receiving customer orders across your neighborhood.
          </p>
          <Link
            to="/seller-sign-up"
            className="inline-block px-8 py-3 bg-[#FF9900] hover:bg-[#E68A00] text-[#111111] font-bold text-xs rounded transition-colors"
          >
            Create Seller Account Now
          </Link>
        </div>
      </section>
    </SellerCenterLayout>
  );
};

export default SellOnAritiiPage;
