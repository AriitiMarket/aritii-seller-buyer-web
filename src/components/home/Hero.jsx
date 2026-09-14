import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PromoBanner from './PromoBanner';

/**
 * Hero - Large banner with orbiting Aritii icon
 */

const stats = [
  { value: '50K+', label: 'Products' },
  { value: '10K+', label: 'Sellers' },
  { value: '100K+', label: 'Customers' },
  { value: '8', label: 'Regions' },
];

const typingTexts = [
  'sellers',
  'riders',
  'buyers',
];

const Hero = () => {
  const [currentText, setCurrentText] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = typingTexts[currentText];
    let timeout;

    if (!isDeleting && displayText === text) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setCurrentText((prev) => (prev + 1) % typingTexts.length);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(
          isDeleting ? text.substring(0, displayText.length - 1) : text.substring(0, displayText.length + 1)
        );
      }, isDeleting ? 50 : 100);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentText]);

  return (
    <div className="relative w-full bg-gradient-to-br from-white via-gray-50 to-[#052919]/5 overflow-hidden">
      
      {/* Promo Banner */}
      <PromoBanner />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #052919 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Left - Text */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="mb-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E5A93C]/10 border border-[#E5A93C]/20 rounded-full">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5A93C] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E5A93C]"></span>
                </span>
                <span className="text-[10px] md:text-xs font-bold text-[#052919] tracking-wider">ETHIOPIA&apos;S #1 MARKETPLACE</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1F2937] leading-tight animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Your Local Marketplace,
              <span className="block text-[#052919] mt-1">All in One Place.</span>
            </h1>

            {/* Animated Typing Text */}
            <div className="mt-4 h-8 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <p className="text-sm md:text-base text-gray-600">
                Local marketplace connecting{' '}
                <span className="inline-block min-w-[80px] text-[#052919] font-bold">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </span>
              </p>
            </div>

            {/* Subheadline */}
            <p className="mt-2 text-xs md:text-sm text-gray-500 max-w-md animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              Buy local. Sell local. Grow together across Ethiopia.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <Link
                to="/explore/products"
                className="group px-6 py-2.5 bg-[#E5A93C] hover:bg-[#f0b856] text-[#052919] font-bold text-sm rounded-lg transition-all duration-300 shadow-lg shadow-[#E5A93C]/20 hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <span>Explore Marketplace</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/sell"
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#052919] font-bold text-sm rounded-lg border border-gray-200 hover:border-[#E5A93C]/50 transition-all duration-300"
              >
                Start Selling
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-8 justify-center lg:justify-start animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-lg md:text-xl font-extrabold text-[#E5A93C]">{stat.value}</div>
                  <div className="text-[10px] text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Large Banner with Orbiting Aritii Icon */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="relative flex items-center justify-center h-80 md:h-[450px] lg:h-[500px]">
              
              {/* Large Banner Image with Zoom Animation */}
              <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] rounded-2xl overflow-hidden shadow-2xl border border-gray-100 z-10">
                <img
                  src="/banner.jpeg"
                  alt="Aritii Market - Ethiopia's Commerce Ecosystem"
                  className="w-full h-full object-cover animate-zoomInOut"
                />
              </div>

              {/* Orbiting Aritii Icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="aritii-orbit">
                  <div className="aritii-orbit-icon">
                    <img src="/aritii-icon.svg" alt="Aritii" className="w-14 h-14 md:w-16 md:h-16 drop-shadow-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes orbit360 {
          from { transform: rotate(0deg) translateX(180px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(180px) rotate(-360deg); }
        }
        @keyframes zoomInOut {
          0% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @media (min-width: 768px) {
          @keyframes orbit360 {
            from { transform: rotate(0deg) translateX(240px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(240px) rotate(-360deg); }
          }
        }
        @media (min-width: 1024px) {
          @keyframes orbit360 {
            from { transform: rotate(0deg) translateX(270px) rotate(0deg); }
            to { transform: rotate(360deg) translateX(270px) rotate(-360deg); }
          }
        }
        .animate-fadeInUp { opacity: 0; animation: fadeInUp 0.5s ease forwards; }
        .aritii-orbit { animation: orbit360 12s linear infinite; }
        .animate-zoomInOut { animation: zoomInOut 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Hero;
