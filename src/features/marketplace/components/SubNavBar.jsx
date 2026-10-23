import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineMenu, AiOutlineClose, AiOutlineRight } from 'react-icons/ai'
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories'
import CategoryIcon from '@/features/marketplace/components/CategoryIcon'
import { useAuth } from '@/auth/hooks/useAuth'
import { useLayout } from '@/app/providers/LayoutContext'
import { toast } from 'react-toastify'

/**
 * SubNavBar - horizontal secondary navigation for the public
 * marketplace catalog. Sits directly under the main header.
 *
 * Left:  "☰ All" — opens the browse drawer (departments + marketplace links).
 *        The drawer is a LEFT slide-in panel on every screen size,
 *        so the same tap/click target works on mobile and desktop.
 * Right: flat experience links (Products · Shops · Categories · Deals · Best Sellers)
 *
 * The active item is underlined in the marketplace accent. On <lg the link row
 * scrolls horizontally.
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
]

const titleOf = (cat) => (typeof cat === 'string' ? cat : cat?.title || cat?.name || '')

const SubNavBar = ({ onOpenAll, stickyTopClass = 'top-[88px]' }) => {
  const location = useLocation();
  const [allOpen, setAllOpen] = useState(false);
  const closeRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useLayout();
  const { categories, loading } = useCatalogCategories({ type: 'product' });

  // Close the browse drawer whenever the route changes (a link was picked).
  useEffect(() => {
    setAllOpen(false);
  }, [location.pathname, location.search]);

  // Drawer behaviours: focus the close button, lock body scroll, Escape to close.
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

  return (
    <nav
      className={`sticky ${stickyTopClass} z-40 w-full bg-[#232f3e] border-b border-[#37475a] text-white shadow-sm`}
      aria-label="Marketplace sections"
    >
      {/* Align to the site container (max-w-7xl + shared gutters) */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center gap-1 h-9 overflow-x-auto no-scrollbar text-xs">
          {/* All / categories trigger - Amazon style with hamburger */}
          <button
            type="button"
            onClick={() => {
              setAllOpen((v) => !v);
              onOpenAll?.();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 font-bold rounded hover:outline hover:outline-1 hover:outline-white transition-all whitespace-nowrap flex-shrink-0 text-white"
            aria-expanded={allOpen}
            aria-haspopup="dialog"
          >
            <AiOutlineMenu size={16} className="text-white" />
            <span>All</span>
          </button>

          <span className="w-px h-4 bg-white/20 mx-1 flex-shrink-0" aria-hidden="true" />

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
                className={`px-2.5 py-1.5 whitespace-nowrap flex-shrink-0 rounded transition-all ${
                  active
                    ? 'font-bold text-white bg-white/10 outline outline-1 outline-white/40'
                    : 'text-gray-200 hover:text-white hover:outline hover:outline-1 hover:outline-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ===== Browse drawer — LEFT slide-in on mobile AND desktop ===== */}
      {allOpen && (
        <div className="fixed inset-0 z-[65]" onClick={() => setAllOpen(false)}>
          {/* Backdrop overlay — inert attribute prevents focus on main page while drawer is open */}
          <div
            className="fixed inset-0 bg-black/50"
            inert
            aria-hidden="true"
          />
          
          {/* Dialog itself — NOT aria-hidden, so focus can be trapped inside */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Browse categories"
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-y-0 left-0 z-[70] flex w-80 max-w-[85vw] flex-col rounded-r-2xl border-r border-[#232f3e] bg-[#131921] shadow-2xl"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-[#232f3e] p-4 bg-[#1a222d]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#75d04b]/20 text-[#75d04b] flex items-center justify-center font-bold text-sm">
                  A
                </span>
                <div>
                  <h2 className="text-sm font-bold text-white leading-tight">All Departments</h2>
                  <span className="text-[10px] text-[#febd69] font-medium tracking-wide">Marketplace & Delivery</span>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setAllOpen(false)}
                className="p-1.5 text-[#9aa6b2] transition-colors hover:text-white rounded-lg min-h-[36px] min-w-[36px]"
                aria-label="Close browse menu"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>

            {/* Logistics & Ecosystem quick banner */}
            <div className="px-4 py-3 bg-gradient-to-r from-[#1f2b3e] to-[#131921] border-b border-[#232f3e]">
              <div className="flex items-center justify-between text-xs text-gray-300">
                <span className="flex items-center gap-1.5 font-medium text-white">
                  <span className="w-2 h-2 rounded-full bg-[#75d04b] animate-pulse" />
                  Fast Door-to-Door Delivery
                </span>
                <Link
                  to="/delivery"
                  onClick={() => setAllOpen(false)}
                  className="text-[11px] text-[#febd69] hover:underline font-bold"
                >
                  Zones →
                </Link>
              </div>
            </div>

            {/* Drawer body */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-4" aria-label="Browse categories and sections">
              <div>
                <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-[#9aa6b2]">
                  Shop by Department
                </p>
                <Link
                  to="/products"
                  onClick={() => setAllOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#232f3e]"
                >
                  <span className="flex h-7 w-7 rounded-lg bg-[#febd69]/15 items-center justify-center text-[#febd69]">
                    <AiOutlineMenu size={16} />
                  </span>
                  <span>All Products Directory</span>
                  <AiOutlineRight size={12} className="ml-auto text-[#9aa6b2]" />
                </Link>
                {loading ? (
                  <div className="space-y-2 px-2 py-2" aria-hidden="true">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-6 w-3/4 rounded bg-[#232f3e] animate-pulse" />
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
                        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs text-[#c9d1d9] transition-colors hover:bg-[#232f3e] hover:text-white"
                      >
                        <CategoryIcon title={name} size={16} />
                        <span className="truncate flex-1 font-medium">{name}</span>
                        <AiOutlineRight size={12} className="text-[#9aa6b2]" />
                      </Link>
                    );
                  })
                )}
              </div>

              {/* Programs, Logistics & Portals */}
              <div className="pt-3 border-t border-[#232f3e]">
                <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-[#febd69]">
                  Logistics & Merchant Services
                </p>
                <div className="space-y-1">
                  <Link
                    to="/seller-center"
                    onClick={() => setAllOpen(false)}
                    className="flex items-center justify-between w-full rounded-lg px-2.5 py-2 text-xs font-medium text-gray-200 transition-colors hover:bg-[#232f3e] hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">🏪</span>
                      <span>Sell on Aritii (Merchant Hub)</span>
                    </span>
                    <span className="text-[10px] bg-[#FF9900]/20 text-[#FF9900] px-1.5 py-0.5 rounded font-bold">
                      0% Fees
                    </span>
                  </Link>
                  <Link
                    to="/delivery-center"
                    onClick={() => setAllOpen(false)}
                    className="flex items-center justify-between w-full rounded-lg px-2.5 py-2 text-xs font-medium text-gray-200 transition-colors hover:bg-[#232f3e] hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">🚚</span>
                      <span>Deliver with Us (Logistics Network)</span>
                    </span>
                    <span className="text-[10px] bg-[#00A8E1]/20 text-[#00A8E1] px-1.5 py-0.5 rounded font-bold">
                      Daily Payout
                    </span>
                  </Link>
                  <Link
                    to="/delivery"
                    onClick={() => setAllOpen(false)}
                    className="flex items-center justify-between w-full rounded-lg px-2.5 py-2 text-xs font-medium text-gray-200 transition-colors hover:bg-[#232f3e] hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">📍</span>
                      <span>Delivery Coverage & Zones</span>
                    </span>
                    <AiOutlineRight size={12} className="text-[#9aa6b2]" />
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setAllOpen(false)}
                    className="flex items-center justify-between w-full rounded-lg px-2.5 py-2 text-xs font-medium text-gray-200 transition-colors hover:bg-[#232f3e] hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">🛡️</span>
                      <span>Buyer Protection & Escrow Help</span>
                    </span>
                    <AiOutlineRight size={12} className="text-[#9aa6b2]" />
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
