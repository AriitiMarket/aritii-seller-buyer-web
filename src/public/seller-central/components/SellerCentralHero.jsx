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
    <section id="overview" className="bg-[#131921] text-white py-12 md:py-18 border-b border-[#232F3E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Text Content & Value Prop */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#232F3E] text-[#FF9900] text-xs font-bold uppercase tracking-wider mb-4 border border-[#37475A]">
              <span>★</span> Ethiopian Local Sellers Program
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Sell on Aritii.
              <span className="block text-[#FF9900]">Reach millions of buyers.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#CCCCCB] mb-6 leading-relaxed max-w-xl">
              Turn your storefront into an online business. List your products, reach verified buyers across Ethiopia, and let our logistics partners handle prompt door-to-door delivery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              <div className="flex items-start gap-2.5">
                <AiOutlineCheckCircle className="text-[#FF9900] text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">0% Upfront Listing Cost</h4>
                  <p className="text-[11px] text-[#999999]">Only pay when you make a sale</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <AiOutlineCheckCircle className="text-[#FF9900] text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Instant Bank Payouts</h4>
                  <p className="text-[11px] text-[#999999]">Direct deposits to Telebirr, CBE & more</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <AiOutlineCheckCircle className="text-[#FF9900] text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Built-in Delivery Network</h4>
                  <p className="text-[11px] text-[#999999]">Automated rider dispatch & route tracking</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <AiOutlineCheckCircle className="text-[#FF9900] text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Dedicated Seller Central</h4>
                  <p className="text-[11px] text-[#999999]">Inventory, orders, & customer insights</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/seller-sign-up"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FF9900] hover:bg-[#E68A00] text-[#111111] font-bold text-sm rounded shadow-md transition-colors"
              >
                Sign up to sell
                <AiOutlineArrowRight size={18} />
              </Link>
              <button
                type="button"
                onClick={() => openLoginModal('SELLER')}
                className="inline-flex items-center justify-center px-6 py-3.5 border border-[#565959] hover:border-white text-white font-semibold text-sm rounded bg-[#232F3E] hover:bg-[#37475A] transition-colors"
              >
                Log in to Seller Central
              </button>
            </div>
          </div>

          {/* Right: Seller Image & Aritii Seller Central Metric Preview Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Visual Seller Banner */}
            <div className="relative rounded-xl overflow-hidden border border-[#232F3E] shadow-2xl group">
              <img
                src="/seller.png"
                alt="Aritii Local Seller managing orders in store"
                className="w-full h-48 sm:h-56 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131921] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 bg-[#131921]/90 backdrop-blur-sm border border-[#232F3E] text-white text-[11px] font-bold rounded">
                  Ethiopia Verified Sellers
                </span>
                <span className="text-[10px] text-[#FF9900] font-semibold bg-[#131921]/90 px-2 py-0.5 rounded">
                  ★ Top Rated Hub
                </span>
              </div>
            </div>

            {/* Quick Metrics & Snapshot */}
            <div className="bg-[#1A222D] border border-[#232F3E] rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#232F3E]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-[#FF9900] flex items-center justify-center text-[#111111] font-black text-xs">
                    A
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Live Store Snapshot</h3>
                    <p className="text-[10px] text-[#999999]">Addis Artisan Roasters</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-green-950 border border-green-700/60 text-green-400 text-[10px] font-bold rounded-full">
                  Online
                </span>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 gap-2.5 my-3">
                <div className="bg-[#131921] p-2.5 rounded border border-[#232F3E]">
                  <p className="text-[10px] text-[#999999]">Today's Sales</p>
                  <p className="text-base font-bold text-[#FF9900]">14,250 ETB</p>
                  <p className="text-[9px] text-green-400">↑ 18% vs yesterday</p>
                </div>
                <div className="bg-[#131921] p-2.5 rounded border border-[#232F3E]">
                  <p className="text-[10px] text-[#999999]">Orders to Ship</p>
                  <p className="text-base font-bold text-white">8 Orders</p>
                  <p className="text-[9px] text-[#999999]">4 assigned to rider</p>
                </div>
              </div>

              <div className="bg-[#232F3E] p-2.5 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <AiOutlineCalculator className="text-[#FF9900] text-sm" />
                  <span className="text-[11px] text-gray-200">5% - 8% Commission Tiers</span>
                </div>
                <a href="#pricing" className="text-[11px] font-bold text-[#FF9900] hover:underline">
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
