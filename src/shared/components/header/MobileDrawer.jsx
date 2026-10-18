import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AiOutlineClose, AiOutlineDown } from 'react-icons/ai';
import BrandLogo from '@/components/common/BrandLogo';

/**
 * MobileDrawer — shared slide-in drawer for public headers.
 *
 * Features: overlay backdrop, focus trap, Escape to close,
 * body scroll lock, focus return, role="dialog" aria-modal.
 *
 * Structure (mobile IA):
 *   1. Primary rows only: Home · Marketplace · Sell on Aritii · Delivery
 *   2. Experience rows expand in place (accordion) revealing that experience's
 *      sub-items (same list as the desktop sub-header) plus an "Overview" link.
 *   3. Quick categories, then Sign In / Create Account.
 *
 * `groups` = [{ heading?, items, expandable?, experienceKey? }]
 */
export default function MobileDrawer({
  open,
  onClose,
  groups = [],
  navLinkClass,
  id = 'mobile-drawer',
  children,
}) {
  const closeRef = useRef(null);
  const location = useLocation();
  // Which accordion section is expanded (null = none).
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      closeRef.current?.focus();
      // Auto-expand the section matching the current experience so the menu
      // opens in context (e.g. you are on /products → Marketplace expanded).
      const current = groups.find((g) =>
        g.expandable &&
        g.items.some((i) => !i.hash && location.pathname.startsWith(i.to.replace(/#.*$/, '')))
      );
      setExpanded(current ? current.experienceKey ?? current.heading ?? null : null);
    } else {
      document.body.style.overflow = '';
      setExpanded(null);
    }
    return () => { document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[70] lg:hidden"
          onClick={onClose}
        >
          {/* Backdrop overlay — inert attribute prevents focus on main page */}
          <div 
            className="fixed inset-0 bg-black/50"
            inert
            aria-hidden="true"
          />
        </div>
      )}

      {/* Drawer */}
      <div
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed top-0 bottom-0 left-0 w-[84%] max-w-[330px] bg-white dark:bg-gray-900 shadow-xl z-[75] transform transition-transform duration-300 ease-in-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 dark:border-gray-800">
            <Link to="/" className="flex items-center gap-2" onClick={onClose}>
              <BrandLogo size="sm" showText showTagline={false} linked={false} />
            </Link>
            <button
              ref={closeRef}
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-[#75d04b] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close navigation menu"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1" aria-label="Mobile navigation">
            {groups.map((group, gi) => {
              if (group.expandable) {
                const isOpen = expanded === (group.experienceKey ?? group.heading);
                return (
                  <div key={group.experienceKey || group.heading || gi}>
                    {/* Primary row — tapping toggles the sub-list; the label itself
                        is a plain link to the experience page for full navigation. */}
                    <div className="flex items-center rounded-lg overflow-hidden">
                      <Link
                        to={group.to}
                        className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#75d04b] ${
                          group.active
                            ? 'text-gray-900 dark:text-white font-semibold'
                            : 'text-gray-700 dark:text-gray-300 hover:text-[#75d04b] hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={onClose}
                      >
                        {group.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : (group.experienceKey ?? group.heading))}
                        aria-expanded={isOpen}
                        aria-controls={`drawer-sub-${gi}`}
                        aria-label={`${isOpen ? 'Hide' : 'Show'} ${group.label} sub menu`}
                        className="flex-shrink-0 w-11 self-stretch flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#75d04b] hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#75d04b]"
                      >
                        <AiOutlineDown
                          size={16}
                          className={`transition-transform duration-300 ease-in-out motion-reduce:transition-none ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>

                    {/* Sub-items (accordion content)
                        Always mounted, animated with the grid-rows trick:
                        0fr → 1fr transitions the height smoothly in BOTH
                        directions regardless of content length, and the
                        collapsed section is inert so its links are not
                        focusable while hidden. */}
                    <div
                      id={`drawer-sub-${gi}`}
                      role="region"
                      aria-label={`${group.label} sub menu`}
                      aria-hidden={!isOpen}
                      inert={!isOpen}
                      className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden min-h-0">
                        <div
                          className={`mt-1 mb-2 ml-3 pl-3 border-l-2 border-gray-100 dark:border-gray-800 flex flex-col gap-0.5 transition-opacity duration-300 motion-reduce:transition-none ${
                            isOpen ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          {group.items.map((item) =>
                            item.hash ? (
                              <Link
                                key={item.label}
                                to={item.to}
                                className="px-3 py-2 text-[13px] text-gray-600 dark:text-gray-400 rounded-lg hover:text-[#75d04b] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                onClick={onClose}
                              >
                                {item.label}
                              </Link>
                            ) : (
                              <NavLink
                                key={item.label}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                  `px-3 py-2 text-[13px] rounded-lg transition-colors ${
                                    isActive
                                      ? 'text-[#4a8f28] dark:text-[#8fdc6a] bg-[#f3ffee] dark:bg-gray-800 font-semibold'
                                      : 'text-gray-600 dark:text-gray-400 hover:text-[#75d04b] hover:bg-gray-50 dark:hover:bg-gray-800'
                                  }`
                                }
                                onClick={onClose}
                              >
                                {item.label}
                              </NavLink>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Plain primary row (e.g. Home)
              return (
                <NavLink
                  key={group.to || group.heading || gi}
                  to={group.to}
                  end={group.end}
                  className={navLinkClass}
                  onClick={onClose}
                >
                  <span className="truncate">{group.label}</span>
                </NavLink>
              );
            })}
            {children}
          </nav>
        </div>
      </div>
    </>
  );
}
