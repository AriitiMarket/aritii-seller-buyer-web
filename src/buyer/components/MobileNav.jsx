import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BUYER_BOTTOM_NAV } from '@/config/navigation';
import { getNavIcon } from '@/config/navIcons';

const MobileNav = ({ onMoreClick }) => {
  const location = useLocation();
  const cartCount = useSelector((state) => state.cart?.cart?.reduce((t, i) => t + Number(i.quantity ?? 1), 0) || 0);

  const isActive = (path, end) => {
    if (!path) return false;
    if (end) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200/60 safe-area-bottom" role="navigation" aria-label="Mobile navigation">
      <div className="flex items-center justify-around h-14 px-1">
        {BUYER_BOTTOM_NAV.map((item) => {
          const Icon = getNavIcon(item.icon);
          const active = item.action ? false : isActive(item.to, item.end);

          if (item.action === 'openDrawer') {
            return (
              <button
                key={item.label}
                onClick={onMoreClick}
                className="flex flex-col items-center justify-center gap-0.5 w-14 h-full text-gray-500 active:text-gray-700 transition"
                aria-label="More options"
              >
                {Icon && <Icon size={22} />}
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition ${
                active ? 'text-[#75d04b]' : 'text-gray-500 active:text-gray-700'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative">
                {Icon && <Icon size={22} />}
                {item.badge === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#75d04b] text-white text-[8px] font-bold rounded-full flex items-center justify-center" aria-hidden="true">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
