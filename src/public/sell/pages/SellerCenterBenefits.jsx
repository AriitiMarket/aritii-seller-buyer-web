import React from 'react';
import { Link } from 'react-router-dom';
import {
  AiOutlineCheck,
  AiOutlineSafetyCertificate,
  AiOutlineLineChart,
  AiOutlineRocket,
} from 'react-icons/ai';
import SellerCenterLayout from '@/public/sell/layout/SellerCenterLayout';
import SellerBenefits from '@/public/sell/components/SellerBenefits';
import SellerPageHero from '@/public/sell/components/SellerPageHero';

/**
 * SellerCenterBenefitsPage — /seller-center/benefits
 * Aritii Seller Central Benefits page with structured feature pillars.
 */
const SellerCenterBenefitsPage = () => {
  return (
    <SellerCenterLayout>
      {/* Aritii Hero Header */}
      <SellerPageHero
        badge="Seller Central Benefits"
        title="Powerful tools designed to scale your business"
        description="From inventory controls and batch SKU updates to express local delivery and direct bank settlements, Aritii equips your business to succeed."
      />

      {/* Main Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <SellerBenefits />
      </section>

      {/* Deep-Dive Aritii Feature Comparisons */}
      <section className="bg-white dark:bg-gray-900 py-14 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#141414] dark:text-white mb-2">
              Advanced Seller Central Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Enterprise-grade infrastructure built for Ethiopian commerce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60">
              <div className="w-10 h-10 rounded-lg bg-[#75d04b]/15 text-[#75d04b] flex items-center justify-center mb-4">
                <AiOutlineSafetyCertificate size={22} />
              </div>
              <h3 className="font-bold text-base text-[#141414] dark:text-white mb-2">
                Order Hold & SLA Protection
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Built-in order hold statuses and real-time SLA countdowns keep you in control of fulfillment times and protect your seller rating.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
                <li className="flex items-center gap-1.5"><AiOutlineCheck className="text-[#75d04b]" /> Automated SLA breach alerts</li>
                <li className="flex items-center gap-1.5"><AiOutlineCheck className="text-[#75d04b]" /> Order priority tagging (VIP/Urgent)</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60">
              <div className="w-10 h-10 rounded-lg bg-[#75d04b]/15 text-[#75d04b] flex items-center justify-center mb-4">
                <AiOutlineLineChart size={22} />
              </div>
              <h3 className="font-bold text-base text-[#141414] dark:text-white mb-2">
                Real-Time Financial Ledger
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Full transparency into your earnings, platform commissions, pending wallet balances, and completed bank payouts.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
                <li className="flex items-center gap-1.5"><AiOutlineCheck className="text-[#75d04b]" /> One-click payout requests</li>
                <li className="flex items-center gap-1.5"><AiOutlineCheck className="text-[#75d04b]" /> Automated invoice generation</li>
              </ul>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-[#0ea5e9] flex items-center justify-center mb-4">
                <AiOutlineRocket size={22} />
              </div>
              <h3 className="font-bold text-base text-[#141414] dark:text-white mb-2">
                Promotions & Product Requests
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Create promotional discount codes and respond directly to buyer custom product inquiries submitted on the marketplace.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
                <li className="flex items-center gap-1.5"><AiOutlineCheck className="text-[#75d04b]" /> Custom coupon builder</li>
                <li className="flex items-center gap-1.5"><AiOutlineCheck className="text-[#75d04b]" /> Direct quotation to customer requests</li>
              </ul>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-12 p-8 rounded-xl bg-[#141414] text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-800">
            <div>
              <h3 className="text-xl font-bold mb-1">Ready to unlock these seller benefits?</h3>
              <p className="text-xs text-gray-400">Create your account in under 5 minutes with zero upfront listing fees.</p>
            </div>
            <Link
              to="/seller-sign-up"
              className="py-3 px-6 bg-[#75d04b] hover:bg-[#66bb3f] text-gray-900 font-bold text-xs rounded-full transition-colors whitespace-nowrap"
            >
              Sign Up Now →
            </Link>
          </div>
        </div>
      </section>
    </SellerCenterLayout>
  );
};

export default SellerCenterBenefitsPage;
