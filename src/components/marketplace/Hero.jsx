import React from "react";
import { HeroMain } from '../../assets';
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative min-h-[70vh] w-full flex items-center justify-center bg-gradient-to-br from-brand-cream via-white to-brand-cream overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-12 w-full flex flex-col md:flex-row items-center justify-between gap-10 py-16">
        {/* Left Side - Text Content */}
        <div className="w-full md:w-[48%] z-10 space-y-6">
          <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-sm font-semibold rounded-full">
            Multi-Vendor Marketplace
          </span>
          <h1 className="text-[40px] md:text-[58px] font-bold leading-tight text-brand-charcoal">
            <span className="text-brand-primary">Aritii</span> Market
            <p className="mt-2 text-[20px] md:text-[24px] font-medium text-brand-muted leading-snug">
              Discover products from trusted sellers, all in one marketplace.
            </p>
          </h1>
          <p className="text-lg text-brand-muted leading-relaxed max-w-xl">
            Shop electronics, fashion, home essentials and unique local crafts —
            backed by trusted regional vendors you can rely on.
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-3.5 bg-brand-primary text-white rounded-lg shadow-md hover:bg-brand-primary/90 hover:shadow-lg transition duration-200 font-semibold text-lg">
              <Link to="/products">Explore Products</Link>
            </button>
            <button className="px-8 py-3.5 bg-transparent text-brand-primary border-2 border-brand-primary rounded-lg hover:bg-brand-primary hover:text-white transition duration-200 font-semibold text-lg">
              <Link to="/sell">Start Selling</Link>
            </button>
          </div>
        </div>

        {/* Right Side - Hero Image */}
        <div className="w-full md:w-[52%] flex items-center justify-center">
          <img
            src={HeroMain}
            alt="Aritii Market — Multi-vendor marketplace"
            className="w-full max-w-[650px] h-auto object-contain"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;