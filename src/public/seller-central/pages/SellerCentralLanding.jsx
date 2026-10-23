import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLayout } from '@/app/providers/LayoutContext';
import SellerCenterLayout from '@/public/sell/layout/SellerCenterLayout';
import SellerCentralHero from '../components/SellerCentralHero';
import SellerCentralFeatures from '../components/SellerCentralFeatures';
import StepGrid from '@/public/components/StepGrid';
import {
  AiOutlineCheck,
  AiOutlineCalculator,
} from 'react-icons/ai';

/**
 * SellerCentralLandingPage - /seller-center
 * Complete Aritii Seller Central layout & onboarding experience.
 */
const SELLER_LANDING_NAV = [
  { label: 'Overview', to: '#overview' },
  { label: 'Benefits', to: '#benefits' },
  { label: 'How It Works', to: '#how-to-sell' },
  { label: 'Pricing', to: '#pricing' },
];

const SELLER_STEPS = [
  {
    step: '01',
    title: 'Register & Verify',
    description:
      'Sign up with your phone or email, enter your trade/TIN information, and get approved fast.',
  },
  {
    step: '02',
    title: 'Set Up Your Shop',
    description:
      'Upload your shop logo, contact info, working hours, and delivery zone coverage.',
  },
  {
    step: '03',
    title: 'List Inventory',
    description:
      'Add single or bulk product listings with high-res photos, description, and ETB pricing.',
  },
  {
    step: '04',
    title: 'Fulfill & Get Paid',
    description:
      'Accept customer orders, pack items, hand to delivery drivers, and receive direct bank deposits.',
  },
];

const SellerCentralLandingPage = () => {
  const navigate = useNavigate();
  const { isSeller } = useSelector((state) => state.seller || {});
  const { openLoginModal } = useLayout();

  // Interactive fee calculator state
  const [salePrice, setSalePrice] = useState(1000);
  const [categoryRate, setCategoryRate] = useState(0.06); // 6% avg

  // Redirect approved sellers to business dashboard
  useEffect(() => {
    if (isSeller) {
      navigate('/business', { replace: true });
    }
  }, [isSeller, navigate]);

  if (isSeller) return null;

  const estimatedFee = Math.round(salePrice * categoryRate);
  const sellerEarnings = Math.max(0, salePrice - estimatedFee);

  return (
    <SellerCenterLayout
      navItems={SELLER_LANDING_NAV}
      background="bg-white dark:bg-gray-950"
    >
      {/* Aritii Dark Hero with KPI Snapshot */}
      <SellerCentralHero />

      {/* Feature Modules */}
      <SellerCentralFeatures />

      {/* Interactive Aritii Profit / Fee Calculator */}
      <section className="py-14 bg-[#F7F7F7] dark:bg-[#131921] border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#FF9900]/10 text-[#FF9900] flex items-center justify-center">
                <AiOutlineCalculator size={24} />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F1111] dark:text-white">
                  Earnings & Commission Estimator
                </h3>
                <p className="text-xs sm:text-sm text-[#565959] dark:text-gray-400">
                  See how much you keep per order with our low, transparent commission.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F1111] dark:text-white uppercase mb-1">
                    Your Item Sale Price (ETB)
                  </label>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:ring-2 focus:ring-[#FF9900] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F1111] dark:text-white uppercase mb-1">
                    Product Category
                  </label>
                  <select
                    value={categoryRate}
                    onChange={(e) => setCategoryRate(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:ring-2 focus:ring-[#FF9900] outline-none"
                  >
                    <option value={0.05}>Groceries & Agriculture (5%)</option>
                    <option value={0.06}>Traditional Handicrafts & Art (6%)</option>
                    <option value={0.07}>Apparel & Fashion (7%)</option>
                    <option value={0.08}>Consumer Electronics (8%)</option>
                  </select>
                </div>
              </div>

              {/* Calculator Output */}
              <div className="bg-[#F8F9FA] dark:bg-gray-850 p-6 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs text-[#565959] dark:text-gray-400 font-medium uppercase mb-1">
                  Estimated Take-Home per Sale
                </p>
                <p className="text-3xl sm:text-4xl font-black text-[#5ac12f] mb-3">
                  {sellerEarnings.toLocaleString()} <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">ETB</span>
                </p>
                <div className="text-xs text-[#565959] dark:text-gray-400 space-y-1 mb-4 border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span>Aritii Platform Fee ({(categoryRate * 100).toFixed(0)}%):</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{estimatedFee.toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Gateway & Payout Processing:</span>
                    <span className="font-semibold text-[#5ac12f]">0 ETB (Included)</span>
                  </div>
                </div>
                <Link
                  to="/seller-sign-up"
                  className="block w-full py-2.5 px-4 bg-[#FF9900] hover:bg-[#E68A00] text-[#111111] font-bold text-xs rounded-md shadow-sm transition-colors text-center"
                >
                  Start Selling at These Rates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Aritii 4-Step Process */}
      <section id="how-to-sell" className="bg-white dark:bg-[#0f1419] py-16 md:py-24 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF9900] bg-[#FF9900]/10 px-3 py-1 rounded-full">
              Simple 4-Step Setup
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111] dark:text-white mt-3 mb-2">
              How Selling on Aritii Works
            </h2>
            <p className="text-base text-[#565959] dark:text-gray-400">
              From account registration to your first payout in simple steps
            </p>
          </div>

          <StepGrid
            steps={SELLER_STEPS}
            accent="#FF9900"
            badgeTextClassName="text-[#111111]"
            cardClassName="p-6 bg-[#F7F7F7] dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl"
          />
        </div>
      </section>

      {/* Pricing / Plan Comparison Section */}
      <section id="pricing" className="bg-[#F7F7F7] dark:bg-[#131921] py-16 md:py-24 border-t border-gray-200 dark:border-gray-800 scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F1111] dark:text-white mb-2">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base text-[#565959] dark:text-gray-400">
              No hidden listing fees or subscriptions. Pay only when you sell.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0F1111] dark:text-white mb-1">Starter Seller</h3>
                <p className="text-xs text-[#565959] dark:text-gray-400 mb-4">For individual artisans & new shops</p>
                <div className="text-2xl font-black text-[#0F1111] dark:text-white mb-4">
                  0 ETB <span className="text-xs font-normal text-gray-500">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#565959] dark:text-gray-400 mb-6">
                  <li className="flex items-center gap-2"><AiOutlineCheck className="text-green-600" /> Up to 50 active listings</li>
                  <li className="flex items-center gap-2"><AiOutlineCheck className="text-green-600" /> Standard 6% commission</li>
                  <li className="flex items-center gap-2"><AiOutlineCheck className="text-green-600" /> Basic sales dashboard</li>
                  <li className="flex items-center gap-2"><AiOutlineCheck className="text-green-600" /> Delivery network access</li>
                </ul>
              </div>
              <Link
                to="/seller-sign-up"
                className="w-full py-2.5 bg-[#F7CA00] hover:bg-[#F0B800] text-[#111111] font-bold text-xs rounded text-center transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Growth Plan - Highlighted */}
            <div className="bg-white dark:bg-[#1a222d] border-2 border-[#FF9900] rounded-xl p-6 flex flex-col justify-between relative shadow-lg">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#FF9900] text-[#111111] text-[10px] font-black uppercase rounded-full">
                Most Popular
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#0F1111] dark:text-white mb-1">Professional Merchant</h3>
                <p className="text-xs text-[#565959] dark:text-gray-400 mb-4">For established storefronts & wholesalers</p>
                <div className="text-2xl font-black text-[#FF9900] mb-4">
                  Pay-as-you-sell <span className="text-xs font-normal text-gray-500">Tier</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#565959] dark:text-gray-400 mb-6">
                  <li className="flex items-center gap-2"><AiOutlineCheck className="text-green-600" /> Unlimited active listings</li>
                  <li className="flex items-center gap-2"><AiOutlineCheck className="text-green-600" /> Tiered low commissions (5-7%)</li>
                  <li className="flex items-center gap-2"><AiOutlineCheck className="text-green-600" /> Multi-location inventory support</li>
                  <li className="flex items-center gap-2"><AiOutlineCheck className="text-green-600" /> Priority rider dispatch</li>
                  <li className="flex items-center gap-2"><AiOutlineCheck className="text-green-600" /> Promo code & deal generator</li>
                </ul>
              </div>
              <Link
                to="/seller-sign-up"
                className="w-full py-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-[#111111] font-bold text-xs rounded text-center transition-colors"
              >
                Sign Up as Professional
              </Link>
            </div>

            {/* Brand / Enterprise */}
            <div className="bg-white dark:bg-[#1a222d] border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0F1111] dark:text-white mb-1">Enterprise Brands</h3>
                <p className="text-xs text-[#565959] dark:text-gray-400 mb-4">For manufacturers & national retailers</p>
                <div className="text-2xl font-black text-[#0F1111] dark:text-white mb-4">
                  Custom <span className="text-xs font-normal text-gray-500">Agreements</span>
                </div>
                <ul className="space-y-2.5 text-xs text-[#565959] dark:text-gray-400 mb-6">
                  <li className="flex items-center gap-2"><AiOutlineCheck className="text-green-600" /> Dedicated account manager</li>
                  <li className="flex items-center gap-2"><AiOutlineCheck className="text-green-600" /> Custom volume commission rates</li>
                  <li className="flex items-center gap-2"><AiOutlineCheck className="text-green-600" /> ERP & API catalog sync</li>
                  <li className="flex items-center gap-2"><AiOutlineCheck className="text-green-600" /> Bulk fulfillment routing</li>
                </ul>
              </div>
              <Link
                to="/contact"
                className="w-full py-2.5 bg-[#232F3E] hover:bg-[#37475A] text-white font-bold text-xs rounded text-center transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Aritii Seller Central Closing CTA */}
      <section className="bg-[#131921] text-white py-16 border-t border-[#232F3E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Ready to become an Aritii Seller?
          </h2>
          <p className="text-sm md:text-base text-[#CCCCCB] mb-8 max-w-xl mx-auto">
            Take your business to the next level with tools, customers, and delivery infrastructure ready to support your growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/seller-sign-up"
              className="px-8 py-3.5 bg-[#FF9900] hover:bg-[#E68A00] text-[#111111] font-bold text-sm rounded transition-colors"
            >
              Start Selling Today
            </Link>
            <button
              type="button"
              onClick={() => openLoginModal('SELLER')}
              className="px-8 py-3.5 border border-[#565959] text-white font-semibold text-sm rounded hover:border-white hover:bg-white/5 transition-colors"
            >
              Sign In to Your Store
            </button>
          </div>
        </div>
      </section>
    </SellerCenterLayout>
  );
};

export default SellerCentralLandingPage;
