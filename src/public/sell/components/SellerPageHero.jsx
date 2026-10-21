import React from 'react';

/**
 * SellerPageHero — the dark hero header shared by the Seller Center sub-pages
 * (/seller-center/benefits, /seller-center/how-it-works, /seller-center/workspace).
 *
 * The three pages each carried a byte-identical copy of this block; only the
 * badge, the title and the description differed.
 */
const SellerPageHero = ({ badge, title, description }) => (
  <section className="bg-[#131921] text-white py-12 md:py-16 border-b border-[#232F3E]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <span className="inline-block px-3 py-1 mb-4 rounded bg-[#232F3E] text-[#FF9900] text-xs font-bold uppercase tracking-wider border border-[#37475A]">
          {badge}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{title}</h1>
        <p className="text-base text-[#CCCCCB] leading-relaxed">{description}</p>
      </div>
    </div>
  </section>
);

export default SellerPageHero;
