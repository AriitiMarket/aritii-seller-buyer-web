import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';

/**
 * HeroSection - The front door of Aritii Market.
 *
 * Design tokens:
 * - Surface: Vibrant Aritii Lime Green `bg-[#75d04b]`
 * - Typography: Crisp `text-white` headings
 * - Inverted primary CTA: `bg-white text-[#75d04b] rounded-full font-semibold hover:brightness-95 shadow-lg`
 * - Secondary dark CTA: `bg-[#141414] text-white rounded-full font-semibold hover:brightness-95 shadow-lg`
 * - Bottom SVG wave transition: `fill-white dark:fill-gray-900`
 */
const WORDS = ['Discover', 'Shop', 'Sell', 'Deliver'];

const HeroSection = () => {
  const [activeWord, setActiveWord] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % WORDS.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate w-full overflow-hidden bg-[#75d04b] pt-8 sm:pt-12 md:pt-14 pb-24 sm:pb-32 lg:pb-36 transition-colors">
      {/* Background motion banner with subtle overlay */}
      <img
        src="/banner.png"
        alt=""
        aria-hidden="true"
        className="hero-banner-motion absolute inset-0 h-full w-full object-cover object-[54%_center] sm:object-center opacity-25 mix-blend-multiply"
        width="1774"
        height="887"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#75d04b]/90 via-[#75d04b]/80 to-[#75d04b]" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.05]" aria-hidden="true">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '36px 36px' }} />
      </div>

      {/* Atmospheric lighting glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-2 left-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Animated Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-2 sm:mb-4">
          {WORDS.map((word, idx) => (
            <React.Fragment key={word}>
              <span
                className={
                  activeWord === idx
                    ? 'text-white underline decoration-white/60 decoration-wavy underline-offset-8 transition-all duration-300'
                    : 'text-white/90 transition-all duration-300'
                }
              >
                {word}
              </span>
              {idx < WORDS.length - 1 && <span className="text-white/40 mx-1.5 sm:mx-2.5">.</span>}
            </React.Fragment>
          ))}
        </h1>

        {/* Concise Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-white font-medium max-w-xl leading-relaxed mb-6 sm:mb-8 drop-shadow-xs">
          Connecting Ethiopian artisans, local shops, and shoppers in one seamless marketplace.
        </p>

        {/* Primary and Cross-Portal Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-[#5ac12f] hover:text-[#4da327] font-bold transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            <span>Explore Marketplace</span>
            <AiOutlineArrowRight size={16} />
          </Link>

          <Link
            to="/seller-center"
            className="inline-flex items-center px-7 py-3 rounded-full bg-[#141414] hover:bg-black text-white font-bold transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            Sell on Aritii
          </Link>

          <Link
            to="/delivery-center"
            className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold backdrop-blur-xs transition shadow-xs"
          >
            Delivery Hub
          </Link>
        </div>
      </div>

      {/* Clean Bottom SVG Wave Transition */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden leading-none z-10 pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 sm:h-16 fill-gray-50 dark:fill-gray-900 transition-colors"
          aria-hidden="true"
        >
          <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
};

export { HeroSection };
export default HeroSection;
