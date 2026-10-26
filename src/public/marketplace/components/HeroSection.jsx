import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';

/**
 * Hero - the front door of Aritii Market.
 *
 * Minimalist, clean, and modern layout:
 * - Punchy animated title (Discover. Shop. Sell. Deliver.)
 * - Single-line concise tagline
 * - Two centered primary CTAs (Explore Marketplace & Sell on Aritii)
 * - Zero text clutter so categories & departments are discovered naturally in the cards below
 */
const WORDS = ['Discover', 'Shop', 'Sell', 'Deliver'];

const HeroSection = () => {
  const [activeWord, setActiveWord] = useState(0);

  // Smooth cycling highlight across the 4 commerce pillars
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % WORDS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate w-full overflow-hidden bg-[#20305c] pt-6 sm:pt-8 md:pt-10 pb-20 sm:pb-24 lg:pb-28">
      {/* Background motion banner */}
      <img
        src="/banner.png"
        alt=""
        aria-hidden="true"
        className="hero-banner-motion absolute inset-0 h-full w-full object-cover object-[54%_center] sm:object-center opacity-85"
        width="1774"
        height="887"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[#142044]/75 sm:hidden" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#142044]/80 via-[#20305c]/65 to-[#20305c]/95 sm:bg-gradient-to-r sm:from-[#142044]/90 sm:via-[#20305c]/80 sm:to-[#20305c]/50" aria-hidden="true" />
      <div className="absolute inset-0 hidden bg-gradient-to-t from-[#20305c] via-transparent to-[#142044]/30 sm:block" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Atmospheric lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-2 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-6 right-1/4 w-52 h-52 bg-emerald-400/10 rounded-full blur-3xl" />
      </div>

      {/* Minimal Hero Content — Centered, uncluttered */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Animated Pillar Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-2 sm:mb-3">
          {WORDS.map((word, idx) => (
            <React.Fragment key={word}>
              <span
                className={
                  activeWord === idx
                    ? 'text-[#FFD814] transition-colors duration-300'
                    : 'text-white transition-colors duration-300'
                }
              >
                {word}
              </span>
              {idx < WORDS.length - 1 && <span className="text-white/40 mx-1.5 sm:mx-2.5">.</span>}
            </React.Fragment>
          ))}
        </h1>

        {/* Minimal Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-xl font-medium leading-relaxed mb-5 sm:mb-6">
          Connecting Ethiopian artisans, local shops, and shoppers in one marketplace.
        </p>

        {/* Centered High-Contrast CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#20305c] font-bold hover:bg-gray-100 transition shadow-lg hover:scale-105"
          >
            <span>Explore Marketplace</span>
            <AiOutlineArrowRight size={16} />
          </Link>

          <Link
            to="/sell-on-aritii"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-[#131921] hover:bg-black text-white font-bold border border-white/30 transition shadow-lg hover:scale-105"
          >
            Sell on Aritii
          </Link>

          <Link
            to="/delivery"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 transition shadow-sm"
          >
            Delivery Services
          </Link>
        </div>
      </div>

      {/* Smooth bottom fade to the marketplace page background */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#EAEDED] dark:from-[#0f1419] to-transparent pointer-events-none" />
    </section>
  );
};

export { HeroSection };
export default HeroSection;
