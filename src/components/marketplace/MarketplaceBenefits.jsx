import React from "react";
import { Link } from "react-router-dom";

/**
 * Homepage "Why Shop on Aritii Market" / "Become a Seller" section.
 *
 * Community + multi-seller marketplace value props. Purely static/UI content.
 */
const MarketplaceBenefits = () => {
  const benefits = [
    {
      icon: "🛍️",
      title: "Shop from trusted sellers",
      desc: "Every product comes from a verified seller shop on Aritii Market.",
    },
    {
      icon: "🏪",
      title: "Discover real businesses",
      desc: "Browse a growing marketplace of local and regional shops.",
    },
    {
      icon: "🚚",
      title: "One marketplace, endless options",
      desc: "Electronics, fashion, home essentials and unique local crafts.",
    },
  ];

  return (
    <section className="w-11/12 mx-auto my-14">
      {/* Benefits */}
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-charcoal">
          Why Shop on Aritii Market
        </h2>
        <p className="text-brand-muted mt-1 text-sm">
          A marketplace built for both customers and the businesses that serve them.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((b, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-brand-border shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="text-3xl mb-2">{b.icon}</div>
            <h3 className="font-semibold text-brand-charcoal">{b.title}</h3>
            <p className="text-sm text-brand-muted mt-1">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Become a Seller CTA */}
      <div className="mt-12 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-accent p-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          Sell your products and grow your business
        </h2>
        <p className="mt-2 text-white/85 max-w-2xl mx-auto">
          Create your own shop on Aritii Market, add your products, and reach
          customers across the marketplace.
        </p>
        <Link
          to="/sell"
          className="mt-6 inline-block px-8 py-3 bg-white text-brand-primary rounded-lg font-semibold shadow"
        >
          Become a Seller →
        </Link>
      </div>
    </section>
  );
};

export default MarketplaceBenefits;