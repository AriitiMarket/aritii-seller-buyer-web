import React from 'react';
import { Link } from 'react-router-dom';
import {
  AiOutlineArrowRight,
  AiOutlineFileText,
  AiOutlineCamera,
  AiOutlineTag,
  AiOutlineBank,
} from 'react-icons/ai';
import SellerCenterLayout from '@/public/sell/layout/SellerCenterLayout';
import SellerHowItWorks from '@/public/sell/components/SellerHowItWorks';
import SellerPageHero from '@/public/sell/components/SellerPageHero';

/**
 * SellerCenterHowItWorksPage — /seller-center/how-it-works
 * Aritii Seller Central Onboarding Guide.
 */
const SellerCenterHowItWorksPage = () => {
  return (
    <SellerCenterLayout>
      {/* Aritii Hero Header */}
      <SellerPageHero
        badge="Seller Onboarding Roadmap"
        title="Start selling in four simple steps"
        description="No hidden fees, no complicated paperwork. Learn exactly how registration, catalog setup, order fulfillment, and bank payouts work."
      />

      {/* Main Roadmap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <SellerHowItWorks />
      </section>

      {/* Step by step detail checklist */}
      <section className="bg-white dark:bg-[#1a222d] py-14 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1111] dark:text-white mb-2">
              What you need to get started
            </h2>
            <p className="text-xs sm:text-sm text-[#565959] dark:text-gray-400">
              Have these items ready for quick, same-day account approval
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#F7F7F7] dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#FF9900]/10 text-[#FF9900] flex items-center justify-center flex-shrink-0">
                <AiOutlineFileText size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0F1111] dark:text-white mb-1">Business or Personal ID</h3>
                <p className="text-xs text-[#565959] dark:text-gray-400">Valid Ethiopian National ID, Kebele ID, or Trade License for registered companies.</p>
              </div>
            </div>

            <div className="p-6 bg-[#F7F7F7] dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0">
                <AiOutlineBank size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0F1111] dark:text-white mb-1">Local Bank Account</h3>
                <p className="text-xs text-[#565959] dark:text-gray-400">Account details for CBE, Awash, Dashen, or active Telebirr merchant phone number.</p>
              </div>
            </div>

            <div className="p-6 bg-[#F7F7F7] dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-[#00A8E1] flex items-center justify-center flex-shrink-0">
                <AiOutlineCamera size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0F1111] dark:text-white mb-1">Product Images</h3>
                <p className="text-xs text-[#565959] dark:text-gray-400">Clear photos of your merchandise on a clean background for high conversion.</p>
              </div>
            </div>

            <div className="p-6 bg-[#F7F7F7] dark:bg-gray-850 rounded-xl border border-gray-200 dark:border-gray-800 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center flex-shrink-0">
                <AiOutlineTag size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#0F1111] dark:text-white mb-1">Pricing & Stock Count</h3>
                <p className="text-xs text-[#565959] dark:text-gray-400">Your unit retail price in ETB and actual units ready in your shop inventory.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/seller-sign-up"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF9900] hover:bg-[#E68A00] text-[#111111] font-bold text-sm rounded shadow-md transition-colors"
            >
              Start Free Registration
              <AiOutlineArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </SellerCenterLayout>
  );
};

export default SellerCenterHowItWorksPage;
