import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight, AiOutlineCheckCircle, AiOutlineCalculator } from 'react-icons/ai';
import { useLayout } from '@/app/providers/LayoutContext';

/**
 * SellerCentralHero - Aritii Seller Central Style Hero
 * Features high-contrast dark theme, bold orange CTA, and key seller stats + seller.png visual.
 */
const SellerCentralHero = () => {
  const { openLoginModal } = useLayout();

  return (
    <section id="overview" className="bg-[#141414] text-white py-12 md:py-18 border-b border-[#1f2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Text Content & Value Prop */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/30">
              <span>★</span> Ethiopian Local Sellers Program
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Sell on Aritii.
              <span className="block text-[#75d04b]">Reach millions of buyers.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 mb-6 leading-relaxed max-w-xl">
              Turn your storefront into an online business. List your products, reach verified buyers across Ethiopia, and let our logistics partners handle prompt door-to-door delivery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              <div className="flex items-start gap-2.5">
                <AiOutlineCheckCircle className="text-[#75d04b] text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">0% Upfront Listing Cost</h4>
                  <p className="text-[11px] text-gray-400">Only pay when you make a sale</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <AiOutlineCheckCircle className="text-[#75d04b] text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Instant Bank Payouts</h4>
                  <p className="text-[11px] text-gray-400">Direct deposits to Telebirr, CBE & more</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <AiOutlineCheckCircle className="text-[#75d04b] text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Built-in Delivery Network</h4>
                  <p className="text-[11px] text-gray-400">Automated rider dispatch & route tracking</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <AiOutlineCheckCircle className="text-[#75d04b] text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Dedicated Seller Central</h4>
                  <p className="text-[11px] text-gray-400">Inventory, orders, & customer insights</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/seller-sign-up"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#75d04b] hover:brightness-95 text-white font-bold text-sm rounded-full shadow-md transition"
              >
                Sign up to sell
                <AiOutlineArrowRight size={18} />
              </Link>
              <button
                type="button"
                onClick={() => openLoginModal('SELLER')}
                className="inline-flex items-center justify-center px-6 py-3.5 border border-gray-700 hover:border-gray-500 text-white font-semibold text-sm rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                Log in to Seller Central
              </button>
            </div>
          </div>

          {/* Right: Seller Image & Aritii Seller Central Metric Preview Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Visual Seller Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl group">
              <img
                src="/seller.png"
                alt="Aritii Local Seller managing orders in store"
                className="w-full h-48 sm:h-56 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 bg-[#141414]/90 backdrop-blur-sm border border-gray-800 text-white text-[11px] font-bold rounded-full">
                  Ethiopia Verified Sellers
                </span>
                <span className="text-[10px] text-amber-400 font-semibold bg-[#141414]/90 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  ★ Top Rated Hub
                </span>
              </div>
            </div>

            {/* Quick Metrics & Snapshot */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#75d04b] flex items-center justify-center text-white font-black text-xs">
                    A
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Live Store Snapshot</h3>
                    <p className="text-[10px] text-gray-400">Addis Artisan Roasters</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-green-950 border border-green-700/60 text-green-400 text-[10px] font-bold rounded-full">
                  Online
                </span>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 gap-2.5 my-3">
                <div className="bg-[#141414] p-2.5 rounded-xl border border-gray-800">
                  <p className="text-[10px] text-gray-400">Today's Sales</p>
                  <p className="text-base font-bold text-[#75d04b]">14,250 ETB</p>
                  <p className="text-[9px] text-green-400">↑ 18% vs yesterday</p>
                </div>
                <div className="bg-[#141414] p-2.5 rounded-xl border border-gray-800">
                  <p className="text-[10px] text-gray-400">Orders to Ship</p>
                  <p className="text-base font-bold text-white">8 Orders</p>
                  <p className="text-[9px] text-gray-400">4 assigned to rider</p>
                </div>
              </div>

              <div className="bg-gray-800 p-2.5 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <AiOutlineCalculator className="text-[#75d04b] text-sm" />
                  <span className="text-[11px] text-gray-200">5% - 8% Commission Tiers</span>
                </div>
                <a href="#pricing" className="text-[11px] font-bold text-[#75d04b] hover:underline">
                  Fee Tiers →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerCentralHero;
