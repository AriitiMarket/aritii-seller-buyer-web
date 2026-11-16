import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineArrowForward } from 'react-icons/md';

export const BuyerWelcomeBanner = ({ user, activeOrdersCount = 0 }) => {
  if (activeOrdersCount > 0) {
    return (
      <div className="relative isolate overflow-hidden bg-[#141414] dark:bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-9 text-white shadow-sm">
        <div aria-hidden="true" className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[28px] border-white/5" />
        <h1 className="relative text-2xl md:text-3xl font-bold tracking-tight mb-1">
          {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome back'}
        </h1>
        <p className="relative text-white/75 text-sm md:text-base">
          You have {activeOrdersCount} active order{activeOrdersCount > 1 ? 's' : ''} in progress
        </p>
        <div className="relative flex flex-wrap gap-3 mt-5">
          <Link
            to="/my-dashboard/orders"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#75d04b] text-white rounded-full text-sm font-semibold shadow-sm hover:brightness-95 active:brightness-90 transition"
          >
            View Orders <MdOutlineArrowForward size={16} />
          </Link>
          <Link
            to="/my-dashboard/marketplace"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/15 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative isolate overflow-hidden bg-[#141414] dark:bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-9 text-white shadow-sm">
      <div aria-hidden="true" className="absolute -right-12 -top-20 h-64 w-64 rounded-full border-[28px] border-white/5" />
      <h1 className="relative text-2xl md:text-3xl font-bold tracking-tight mb-1">
        {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome to Aritii'}
      </h1>
      <p className="relative text-white/75 text-sm md:text-base">
        Discover products from trusted Ethiopian shops
      </p>
      <div className="relative flex flex-wrap gap-3 mt-5">
        <Link
          to="/my-dashboard/marketplace"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#75d04b] text-white rounded-full text-sm font-semibold shadow-sm hover:brightness-95 active:brightness-90 transition"
        >
          Browse Products <MdOutlineArrowForward size={16} />
        </Link>
        <Link
          to="/my-dashboard/shops"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 border border-white/20 text-white rounded-full text-sm font-medium hover:bg-white/15 transition"
        >
          Explore Shops
        </Link>
      </div>
    </div>
  );
};

export default BuyerWelcomeBanner;
