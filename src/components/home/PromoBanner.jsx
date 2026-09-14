import React from 'react';

/**
 * PromoBanner - Animated scrolling promo cards
 */

const promos = [
  { 
    id: 1, 
    text: '60% OFF on First Order', 
    subtext: 'New customers only',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=200&fit=crop',
    color: 'from-[#E5A93C]/90 to-[#E5A93C]/70',
    icon: '🎉'
  },
  { 
    id: 2, 
    text: 'Free Delivery Nationwide', 
    subtext: 'All orders over ETB 500',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=200&fit=crop',
    color: 'from-[#052919]/90 to-[#052919]/70',
    icon: '🚚'
  },
  { 
    id: 3, 
    text: 'Zero Commission for Sellers', 
    subtext: 'Start selling today',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop',
    color: 'from-[#C8522C]/90 to-[#C8522C]/70',
    icon: '🏪'
  },
  { 
    id: 4, 
    text: 'CBE Escrow Protected', 
    subtext: '100% secure payments',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop',
    color: 'from-emerald-700/90 to-emerald-600/70',
    icon: '🔒'
  },
  { 
    id: 5, 
    text: '24-48hr Express Delivery', 
    subtext: 'Fast & reliable',
    image: 'https://images.unsplash.com/photo-1616432043562-3671ea2e5242?w=400&h=200&fit=crop',
    color: 'from-purple-700/90 to-purple-600/70',
    icon: '⚡'
  },
  { 
    id: 6, 
    text: 'Verified Ethiopian Sellers', 
    subtext: 'Trusted businesses',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=200&fit=crop',
    color: 'from-blue-700/90 to-blue-600/70',
    icon: '✓'
  },
];

const PromoBanner = () => {
  const items = [...promos, ...promos, ...promos];

  return (
    <div className="relative w-full py-3 bg-black/40 backdrop-blur-sm">
      <div 
        className="flex gap-3 px-3"
        style={{ animation: 'scrollPromo 25s linear infinite', width: 'max-content' }}
      >
        {items.map((promo, index) => (
          <div
            key={index}
            className="flex-shrink-0 relative w-52 md:w-60 h-14 rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            {/* Card Image */}
            <img
              src={promo.image}
              alt={promo.text}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
            />
            {/* Card Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${promo.color} group-hover:opacity-90 transition-opacity`}></div>
            {/* Card Content */}
            <div className="relative z-10 h-full flex items-center gap-3 px-4">
              <span className="text-xl md:text-2xl group-hover:animate-bounce">{promo.icon}</span>
              <div>
                <p className="text-[11px] md:text-xs font-bold text-white leading-tight">{promo.text}</p>
                <p className="text-[9px] md:text-[10px] text-white/70">{promo.subtext}</p>
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

export default PromoBanner;
