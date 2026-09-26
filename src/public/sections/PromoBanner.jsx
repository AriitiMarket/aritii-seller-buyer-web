import React from 'react';

/**
 * PromoBanner - Animated scrolling promo cards
 */

const promos = [
  { 
    id: 1, 
    text: '60% OFF on First Order', 
    subtext: 'New customers only',
    color: 'from-[#75d04b]/90 to-[#75d04b]/70',
    icon: '🎉'
  },
  { 
    id: 2, 
    text: 'Free Delivery Nationwide', 
    subtext: 'All orders over ETB 500',
    color: 'from-[#141414]/90 to-[#141414]/70',
    icon: '🚚'
  },
  { 
    id: 3, 
    text: 'Zero Commission for Sellers', 
    subtext: 'Start selling today',
    color: 'from-red-500/90 to-red-500/70',
    icon: '🏪'
  },
  { 
    id: 4, 
    text: 'CBE Escrow Protected', 
    subtext: '100% secure payments',
    color: 'from-emerald-700/90 to-emerald-600/70',
    icon: '🔒'
  },
  { 
    id: 5, 
    text: '24-48hr Express Delivery', 
    subtext: 'Fast & reliable',
    color: 'from-purple-700/90 to-purple-600/70',
    icon: '⚡'
  },
  { 
    id: 6, 
    text: 'Verified Ethiopian Sellers', 
    subtext: 'Trusted businesses',
    color: 'from-blue-700/90 to-blue-600/70',
    icon: '✓'
  },
];

const PromoBanner = () => {
  const items = [...promos, ...promos, ...promos];

  return (
    <div className="relative w-full py-2 sm:py-3 bg-black/40 backdrop-blur-sm overflow-hidden">
      <div 
        className="flex gap-2 sm:gap-3 px-2 sm:px-3"
        style={{ animation: 'scrollPromo 25s linear infinite', width: 'max-content' }}
      >
        {items.map((promo, index) => (
          <div
            key={index}
            className="flex-shrink-0 relative w-36 sm:w-48 md:w-56 h-10 sm:h-12 rounded-full sm:rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            {/* Card Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${promo.color} group-hover:opacity-90 transition-opacity`}></div>
            {/* Card Content */}
            <div className="relative z-10 h-full flex items-center gap-2 sm:gap-3 px-2 sm:px-4">
              <span className="text-base sm:text-lg md:text-xl flex-shrink-0 group-hover:animate-bounce">{promo.icon}</span>
              <div className="min-w-0">
                <p className="text-[8px] sm:text-[10px] md:text-[11px] font-bold text-white leading-tight truncate">{promo.text}</p>
                <p className="text-[7px] sm:text-[8px] md:text-[9px] text-white/70 truncate">{promo.subtext}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scrollPromo {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
};

export { PromoBanner };
export default PromoBanner;
