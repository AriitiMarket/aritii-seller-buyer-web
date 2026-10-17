import React from 'react';
import { Link } from 'react-router-dom';
import {
  AiOutlineCheck,
  AiOutlineArrowRight,
  AiOutlineShop,
  AiOutlineUser,
  AiOutlineTag,
  AiOutlineDashboard,
  AiOutlineCar,
  AiOutlineMessage,
  AiOutlineBarChart,
} from 'react-icons/ai';
import ExperienceLayout from '@/public/layout/ExperienceLayout';
import { EXPERIENCES } from '@/public/experiences';
import ExperiencePageHeader from '@/public/components/ExperiencePageHeader';
import SellerBenefits from '@/public/sell/components/SellerBenefits';
import SellerHowItWorks from '@/public/sell/components/SellerHowItWorks';

/**
 * PUBLIC SELLER EXPERIENCE (/sell-on-aritii)
 *
 * The marketing/onboarding page for businesses — NOT the seller dashboard.
 * Uses the standard ExperiencePageHeader (Seller accent = deep forest) so the
 * page reads as part of the one Aritii platform. Hands off to the existing
 * application flow at /become-a-seller (SellerApplicationPage).
 */

const SellOnAritiiPage = () => {
  const exp = EXPERIENCES.seller;

  return (
    <ExperienceLayout>
      {/* Standard experience page header — Seller accent */}
      <ExperiencePageHeader
        experience={exp}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Sell on Aritii' }]}
        badge="Seller Experience"
        title="Sell on Aritii. Grow with your local market."
        description="Aritii Market gives your business a storefront in front of local buyers, tools to manage products and orders, and a delivery network that moves every order to the customer. You focus on the product — we connect the rest."
        size="md"
        visual={(
          <img
            src="/seller.png"
            alt="Aritii Seller Hub with shop management and growth tools"
            width="1024"
            height="512"
            loading="eager"
            fetchPriority="high"
            className="block w-full rounded-2xl border border-white/20 shadow-2xl"
          />
        )}
        actions={
          <>
            <Link
              to="/seller-sign-up"
              className={`group inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold rounded-full text-base transition-colors focus-visible:outline-none focus-visible:ring-2 ${exp.button} ${exp.ring}`}
            >
              Start Selling
              <AiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full text-base border border-gray-300 dark:border-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6e4f]"
            >
              See the marketplace
            </Link>
          </>
        }
      />

      {/* Why sell on Aritii */}
      <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 scroll-mt-32">
        <SellerBenefits />
      </section>

      {/* What your seller workspace covers */}
      <section id="seller-workspace" className="bg-[#FDF6EC] dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800 scroll-mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className={`inline-block px-3 py-1 mb-4 rounded-full text-xs font-bold uppercase tracking-wider ${exp.badge}`}>
                Your seller workspace
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Manage the whole business from one place
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Once approved, your seller dashboard keeps the day-to-day under control — so you
                always know what to pack, what to restock, and how you are growing.
              </p>
              <ul className="space-y-3">
                {[
                  'Products & pricing — publish and update your catalog',
                  'Orders — a live queue of what buyers have ordered',
                  'Inventory — stock levels that stay honest with sales',
                  'Buyer messages — questions and order details in one inbox',
                  'Fulfilment — confirm, pack, and hand orders to delivery',
                  'Analytics — sales, revenue and shop performance',
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2.5">
                    <AiOutlineCheck className={`${exp.accentText} flex-shrink-0 mt-0.5`} size={18} aria-hidden="true" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">Today in your shop</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${exp.badge}`}>
                    Live
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">New orders</p>
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-white">7</p>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ready for delivery</p>
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-white">5</p>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Products live</p>
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-white">42</p>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Buyer messages</p>
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-white">3</p>
                  </div>
                </div>
                <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
                  <AiOutlineCar size={20} className={`${exp.accentText} flex-shrink-0`} aria-hidden="true" />
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-snug">
                    Packed orders hand off to the delivery network automatically — riders see the
                    request the moment you confirm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding steps */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 scroll-mt-32">
        <SellerHowItWorks />
      </section>

      {/* Final CTA */}
      <section className="bg-[#FDF6EC] dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
          <AiOutlineShop size={36} className="mx-auto mb-4" style={{ color: exp.accent }} aria-hidden="true" />
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to open your shop on Aritii?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 text-sm md:text-lg">
            Start your seller application today. One account — buy and sell. An administrator
            approves your shop before you publish products.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/seller-sign-up"
              className={`group inline-flex items-center justify-center gap-2 px-10 py-4 font-bold rounded-full text-base shadow-xl transition-colors ${exp.button}`}
            >
              Become a Seller
              <AiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Link>
            <Link
              to="/seller-sign-up"
              className="inline-flex items-center justify-center px-10 py-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-full text-base border border-gray-300 dark:border-gray-700 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </ExperienceLayout>
  );
};

export default SellOnAritiiPage;
