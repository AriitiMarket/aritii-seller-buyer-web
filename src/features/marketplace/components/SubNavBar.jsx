import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose, AiOutlineRight } from 'react-icons/ai';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
import CategoryIcon from '@/features/marketplace/components/CategoryIcon';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLayout } from '@/app/providers/LayoutContext';
import { toast } from 'react-toastify';

/**
 * SubNavBar - Horizontal secondary navigation for the public marketplace catalog.
 *
 * Left:   "☰ All" — opens the browse categories drawer.
 * Center: Retail catalog links (Products · Shops · Categories · Deals · Best Sellers · Orders · Saved Items).
 * Right:  Cross-portal links ("Sell on Aritii" -> /seller-center, "Delivery Hub" -> /delivery-center).
 *
 * Active item underlined in #75d04b brand accent.
 */

const LINKS = [
  { label: 'Products', to: '/products', match: ['/products', '/product/'] },
  { label: 'Shops', to: '/shops', match: ['/shops', '/shop/'] },
  { label: 'Categories', to: '/categories', match: ['/categories', '/category/'] },
  { label: "Today's Deals", to: '/deals', match: ['/deals'] },
  { label: 'Best Sellers', to: '/best-selling', match: ['/best-selling'] },
  { label: 'Orders', to: '/my-dashboard/orders', match: ['/my-dashboard/orders'], protected: true },
  { label: 'Saved Items', to: '/my-dashboard/wishlist', match: ['/my-dashboard/wishlist'], protected: true },
  { label: 'Requests', to: '/my-dashboard/requests', match: ['/my-dashboard/requests'], protected: true },
  { label: 'Customer Service', to: '/help', match: ['/help', '/support', '/faq'] },
];

const titleOf = (cat) => (typeof cat === 'string' ? cat : cat?.title || cat?.name || '');

const SubNavBar = ({ onOpenAll, stickyTopClass = 'top-[88px]', isEmbedded = false }) => {
  const location = useLocation();
  const [allOpen, setAllOpen] = useState(false);
  const closeRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useLayout();
  const { categories, loading } = useCatalogCategories({ type: 'product' });

  // Close drawer when route changes
  useEffect(() => {
    setAllOpen(false);
  }, [location.pathname, location.search]);

  // Drawer accessibility
  useEffect(() => {
    if (!allOpen) return undefined;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setAllOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [allOpen]);

  const isActive = (match) =>
    Array.isArray(match) ? match.some((m) => location.pathname.startsWith(m)) : location.pathname.startsWith(match);

  const containerClass = isEmbedded
    ? 'w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 transition-colors'
    : `sticky ${stickyTopClass} z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 shadow-xs transition-colors`;

  return (
    <nav
      className={containerClass}
      aria-label="Marketplace navigation"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between gap-1 h-10 text-xs">
          {/* Left + Links */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {/* All / categories trigger */}
            <button
              type="button"
              onClick={() => {
                setAllOpen((v) => !v);
                onOpenAll?.();
              }}
              className="flex items-center gap-1.5 px-3 py-1 font-bold rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#75d04b] transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
              aria-expanded={allOpen}
              aria-haspopup="dialog"
            >
              <AiOutlineMenu size={16} className="text-[#75d04b]" />
              <span>All</span>
            </button>

            <span className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1 flex-shrink-0" aria-hidden="true" />

            {LINKS.map((item) => {
              const active = isActive(item.match);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  onClick={(e) => {
                    if (item.protected && !isAuthenticated) {
                      e.preventDefault();
                      toast.info(`Please sign in to access your ${item.label.toLowerCase()}.`);
                      openLoginModal('BUYER');
                    }
                  }}
                  className={`px-3 py-1.5 whitespace-nowrap flex-shrink-0 text-xs transition-all ${
                    active
                      ? 'font-bold text-[#75d04b] border-b-2 border-[#75d04b] bg-transparent'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#75d04b] dark:hover:text-[#75d04b] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right: Cross-portal switcher buttons (hidden on xs/sm, visible on md+) */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0 text-xs font-semibold pl-2">
            <Link
              to="/seller-center"
              className="px-3 py-1 rounded-full text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Sell on Aritii</span>
            </Link>
            <Link
              to="/delivery-center"
              className="px-3 py-1 rounded-full text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>Delivery Hub</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ===== Browse drawer — LEFT slide-in ===== */}
      {allOpen && (
        <div className="fixed inset-0 z-[80]" onClick={() => setAllOpen(false)}>
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            inert={true}
            aria-hidden="true"
          />
          
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Browse categories"
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-y-0 left-0 z-[85] flex w-80 max-w-[85vw] flex-col rounded-r-2xl border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl text-gray-900 dark:text-white"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-850">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#75d04b]/20 text-[#75d04b] flex items-center justify-center font-bold text-sm">
                  A
                </span>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">All Categories & Menu</h2>
                  <span className="text-[10px] text-[#75d04b] font-medium tracking-wide">Aritii Marketplace</span>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setAllOpen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg min-h-[36px] min-w-[36px]"
                aria-label="Close browse menu"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>

            {/* Logistics quick banner */}
            <div className="px-4 py-3 bg-[#f3ffee] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-1.5 font-medium text-gray-900 dark:text-white">
                  <span className="w-2 h-2 rounded-full bg-[#75d04b] animate-pulse" />
                  Fast Door-to-Door Delivery
                </span>
                <Link
                  to="/delivery"
                  onClick={() => setAllOpen(false)}
                  className="text-[11px] text-[#75d04b] hover:underline font-bold"
                >
                  Zones →
                </Link>
              </div>
            </div>

            {/* Drawer body */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-4" aria-label="Browse categories and sections">
              <div>
                <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Shop by Category
                </p>
                <Link
                  to="/categories"
                  onClick={() => setAllOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-900 dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="flex h-7 w-7 rounded-lg bg-[#75d04b]/15 items-center justify-center text-[#75d04b]">
                    <AiOutlineMenu size={16} />
                  </span>
                  <span>Browse All Categories</span>
                  <AiOutlineRight size={12} className="ml-auto text-gray-400" />
                </Link>
                {loading ? (
                  <div className="space-y-2 px-2 py-2" aria-hidden="true">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  categories.map((cat) => {
                    const name = titleOf(cat);
                    if (!name) return null;
                    return (
                      <Link
                        key={cat._id || name}
                        to={`/products?category=${encodeURIComponent(name)}`}
                        onClick={() => setAllOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#75d04b]"
                      >
                        <CategoryIcon title={name} size={16} />
                        <span className="truncate flex-1 font-medium">{name}</span>
                        <AiOutlineRight size={12} className="text-gray-400" />
                      </Link>
                    );
                  })
                )}
              </div>

              {/* Cross-portal & Merchant Services */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Portals & Merchant Services
                </p>
                <div className="space-y-1">
                  <Link
                    to="/seller-center"
                    onClick={() => setAllOpen(false)}
                    className="flex items-center justify-between w-full rounded-lg px-2.5 py-2 text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">🏪</span>
                      <span>Sell on Aritii (Merchant Hub)</span>
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full font-bold">
                      0% Fees
                    </span>
                  </Link>
                  <Link
                    to="/delivery-center"
                    onClick={() => setAllOpen(false)}
                    className="flex items-center justify-between w-full rounded-lg px-2.5 py-2 text-xs font-medium text-sky-700 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">🚚</span>
                      <span>Deliver with Us (Logistics Hub)</span>
                    </span>
                    <span className="text-[10px] bg-sky-500/20 text-sky-600 dark:text-sky-400 px-1.5 py-0.5 rounded-full font-bold">
                      Daily Payout
                    </span>
                  </Link>
                  <Link
                    to="/delivery"
                    onClick={() => setAllOpen(false)}
                    className="flex items-center justify-between w-full rounded-lg px-2.5 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">📍</span>
                      <span>Delivery Coverage & Zones</span>
                    </span>
                    <AiOutlineRight size={12} className="text-gray-400" />
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setAllOpen(false)}
                    className="flex items-center justify-between w-full rounded-lg px-2.5 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">🛡️</span>
                      <span>Buyer Protection & Escrow Help</span>
                    </span>
                    <AiOutlineRight size={12} className="text-gray-400" />
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SubNavBar;
