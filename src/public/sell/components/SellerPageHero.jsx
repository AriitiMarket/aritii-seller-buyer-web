import React from 'react';

/**
 * SellerPageHero — Header shared by Seller Center sub-pages.
 */
const SellerPageHero = ({ badge, title, description }) => (
  <section className="bg-[#141414] text-white py-12 md:py-16 border-b border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="inline-block px-3.5 py-1 mb-4 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
          {badge}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{title}</h1>
        <p className="text-base text-gray-300 leading-relaxed">{description}</p>
      </div>
    </div>
  </section>
);

export default SellerPageHero;
