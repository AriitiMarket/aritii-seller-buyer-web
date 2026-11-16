import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight, AiOutlineCheckCircle } from 'react-icons/ai';
import { useLayout } from '@/app/providers/LayoutContext';
import { useAuth } from '@/features/auth/hooks/useAuth';

/**
 * DeliveryPortalHero - Aritii Delivery Partner Hero
 * Modernized with #141414 dark surface, #75d04b accents, and sky-cyan badges.
 */
const DeliveryPortalHero = () => {
  const { openLoginModal } = useLayout();
  const { isAuthenticated, isProvider } = useAuth();

  return (
    <section className="bg-[#141414] text-white py-12 md:py-18 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Text Content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-bold uppercase tracking-wider mb-4 border border-sky-500/30">
              <span>⚡</span> Aritii Delivery Partner Network
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Deliver with Aritii.
              <span className="block text-[#75d04b]">Earn on your terms.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 mb-6 leading-relaxed max-w-xl">
              Be your own boss. Use your motorcycle, bicycle, or van to deliver packages from local neighborhood stores directly to customer doorsteps.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              <div className="flex items-start gap-2.5">
                <AiOutlineCheckCircle className="text-[#75d04b] text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Daily & Instant Payouts</h4>
                  <p className="text-[11px] text-gray-400">Direct cashouts to your mobile wallet</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <AiOutlineCheckCircle className="text-[#75d04b] text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Choose Your Schedule</h4>
                  <p className="text-[11px] text-gray-400">Drive full-time, part-time, or weekends</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <AiOutlineCheckCircle className="text-[#75d04b] text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Smart Navigation</h4>
                  <p className="text-[11px] text-gray-400">Optimized local zone delivery routes</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <AiOutlineCheckCircle className="text-[#75d04b] text-lg flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">Driver Partner Protection</h4>
                  <p className="text-[11px] text-gray-400">Insurance coverage & 24/7 route support</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {isAuthenticated && isProvider ? (
                <Link
                  to="/provider"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#75d04b] hover:bg-[#66bb3f] text-gray-900 font-bold text-sm rounded-full shadow-md transition-colors"
                >
                  Open Provider Portal
                  <AiOutlineArrowRight size={18} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/delivery-sign-up"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#75d04b] hover:bg-[#66bb3f] text-gray-900 font-bold text-sm rounded-full shadow-md transition-colors"
                  >
                    Apply to Deliver
                    <AiOutlineArrowRight size={18} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => openLoginModal('PROVIDER')}
                    className="inline-flex items-center justify-center px-6 py-3.5 border border-gray-700 hover:border-gray-500 text-white font-semibold text-sm rounded-full bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    Partner Sign In
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right: Delivery Visual & Driver Snapshot Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Delivery Image Banner */}
            <div className="relative rounded-xl overflow-hidden border border-gray-800 shadow-2xl group">
              <img
                src="/delivery.png"
                alt="Aritii Delivery Partner handing over order to customer"
                className="w-full h-48 sm:h-56 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 bg-[#141414]/90 backdrop-blur-sm border border-gray-700 text-white text-[11px] font-bold rounded-full">
                  Local Addis Ababa Couriers
                </span>
                <span className="text-[10px] text-sky-400 font-semibold bg-[#141414]/90 px-2.5 py-1 rounded-full border border-sky-500/30">
                  ⚡ Active Dispatch
                </span>
              </div>
            </div>

            {/* Driver Earnings Snapshot */}
            <div className="bg-[#181818] border border-gray-800 rounded-xl p-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white font-black text-xs">
                    D
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Daily Driver Estimator</h3>
                    <p className="text-[10px] text-gray-400">Bole, Kazanchis & Piassa Zones</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[10px] font-bold rounded-full">
                  High Demand
                </span>
              </div>

              {/* Earnings Card */}
              <div className="my-3 bg-[#141414] p-3 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Estimated Daily Earnings</span>
                  <span className="text-[10px] text-[#75d04b] font-bold">+ 100% Tips</span>
                </div>
                <p className="text-2xl font-black text-[#75d04b]">
                  850 - 1,400 <span className="text-xs font-normal text-white">ETB / day</span>
                </p>
              </div>

              {/* Vehicle Options */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-gray-850 border border-gray-800">
                  <p className="text-base">🛵</p>
                  <p className="font-bold text-[11px] text-white">Motorcycle</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-850 border border-gray-800">
                  <p className="text-base">🚲</p>
                  <p className="font-bold text-[11px] text-white">Bicycle</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-850 border border-gray-800">
                  <p className="text-base">🚐</p>
                  <p className="font-bold text-[11px] text-white">Van / Car</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryPortalHero;
