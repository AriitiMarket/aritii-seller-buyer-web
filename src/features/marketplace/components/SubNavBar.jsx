import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineMenu, AiOutlineClose, AiOutlineRight } from 'react-icons/ai'
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories'
import CategoryIcon from '@/features/marketplace/components/CategoryIcon'
import { useAuth } from '@/auth/hooks/useAuth'
import { toast } from 'react-toastify'

/**
 * SubNavBar - horizontal secondary navigation for the public
 * marketplace catalog. Sits directly under the main header.
 *
 * Left:  "☰ All" — opens the browse drawer (departments + marketplace links).
 *        The drawer is a LEFT slide-in panel on every screen size (Amazon-style
 *        "All" menu), so the same tap/click target works on mobile and desktop.
 * Right: flat experience links (Products · Shops · Categories · Deals · Best Sellers)
 *
 * The active item is underlined in the marketplace accent. On <lg the link row
 * scrolls horizontally.
 */

const LINKS = [
  { label: 'Products', to: '/products', match: ['/products', '/product/'] },
  { label: 'Shops', to: '/shops', match: ['/shops', '/shop/'] },
  { label: 'Categories', to: '/categories', match: ['/categories'] },
  { label: "Today's Deals", to: '/deals', match: ['/deals'] },
  { label: 'Best Sellers', to: '/best-selling', match: ['/best-selling'] },
  { label: 'Orders', to: '/my-dashboard/orders', match: ['/my-dashboard/orders'], protected: true },
  { label: 'Requests', to: '/my-dashboard/requests', match: ['/my-dashboard/requests'], protected: true },
]

const titleOf = (cat) => (typeof cat === 'string' ? cat : cat?.title || cat?.name || '')

const SubNavBar = ({ onOpenAll }) => {
  const location = useLocation();
  const [allOpen, setAllOpen] = useState(false);
  const closeRef = useRef(null);
  const { isAuthenticated } = useAuth();
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
      className="sticky top-16 z-40 w-full bg-market-subnav border-b border-market-subnav-border"
      aria-label="Marketplace sections"
    >
      {/* Align to the site container (max-w-7xl + shared gutters) so the rail's
          items line up exactly with the header logo/search above it. */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 h-10 overflow-x-auto no-scrollbar">
          {/* All / categories trigger */}
          <button
            type="button"
            onClick={() => {
              setAllOpen((v) => !v);
              onOpenAll?.();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold rounded hover:bg-market-inverse-surface/10 transition-colors whitespace-nowrap flex-shrink-0"
            aria-expanded={allOpen}
            aria-haspopup="dialog"
          >
            <AiOutlineMenu size={16} />
            All
          </button>

          <span className="w-px h-5 bg-market-inverse-on-surface/20 mx-1 flex-shrink-0" aria-hidden="true" />

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
                    toast.error(`Please sign in to ${item.label.toLowerCase()}.`);
                  }
                }}
                className={`px-3 py-1.5 text-sm whitespace-nowrap flex-shrink-0 rounded hover:bg-market-inverse-surface/10 transition-colors ${active ? 'font-bold text-market-inverse-on-surface bg-market-inverse-surface/10' : 'text-market-inverse-on-surface/90 hover:text-market-inverse-on-surface'}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ===== Browse drawer — LEFT slide-in on mobile AND desktop ===== */}
      {allOpen && (
        <div
          className="fixed inset-0 z-[65] bg-black/50"
          onClick={() => setAllOpen(false)}
          aria-hidden="true"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Browse categories"
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-y-0 left-0 z-[70] flex w-72 max-w-[85vw] flex-col rounded-r-xl border-r border-market-subnav-border bg-market-header shadow-level-3"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-market-subnav-border p-4">
              <h2 className="text-base font-bold text-white">Browse</h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setAllOpen(false)}
                className="p-1.5 text-[#9aa6b2] transition-colors hover:text-white"
                aria-label="Close browse menu"
              >
                <AiOutlineClose size={22} />
              </button>
            </div>

            {/* Drawer body */}
            <nav className="flex-1 overflow-y-auto p-4" aria-label="Browse categories and sections">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#9aa6b2]">
                Shop by department
              </p>
              <Link
                to="/products"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-market-subnav"
              >
                <span className="flex h-[18px] w-[18px] items-center justify-center text-[#febd69]">
                  <AiOutlineMenu size={16} />
                </span>
                All Products
              </Link>
              {loading ? (
                <div className="space-y-2 px-3 py-2" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-5 w-2/3 rounded bg-market-subnav animate-pulse" />
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
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#c9d1d9] transition-colors hover:bg-market-subnav hover:text-white"
                    >
                      <CategoryIcon title={name} size={18} />
                      <span className="truncate">{name}</span>
                      <AiOutlineRight size={13} className="ml-auto flex-shrink-0 text-[#9aa6b2]" />
                    </Link>
                  );
                })
              )}

              <p className="mt-4 mb-2 px-3 border-t border-market-subnav-border pt-4 text-[11px] font-semibold uppercase tracking-wider text-[#9aa6b2]">
                Marketplace
              </p>
              {LINKS.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`block w-full rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-market-subnav hover:text-white ${isActive(item.match) ? 'bg-market-subnav font-semibold text-white' : 'text-[#c9d1d9]'}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SubNavBar;
