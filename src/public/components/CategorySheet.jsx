import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';
import CategoryIcon from '@/shared/categories/CategoryIcon';
import { categoryHref } from '@/shared/categories/categoryHref';
import { MdClose, MdExpandMore, MdOutlineApps, MdOutlineCheck, MdTune } from 'react-icons/md';

/**
 * CategorySheet — the mobile/tablet (<1024px) category selector.
 *
 * Desktop keeps the far-left sidebar (CategorySidebar); small screens get this
 * trigger + bottom sheet instead, because a chip rail either scrolls sideways
 * (hiding categories) or eats 3-4 rows of grid space.
 *
 *   [ 🔘 Categories: Electronics ˅ ]   ← trigger (clears with ✕)
 *   ────────────────────────────────
 *   ⬇ slide-up sheet: "All" + every category, counts, active check
 *
 * A11y: role="dialog" aria-modal, Escape + backdrop close, focus moves into
 * the panel, Tab is trapped while open, focus returns to the trigger.
 */
const CategorySheet = ({
  basePath = '/products',
  type = 'product',
  title = 'Categories',
  allLabel = 'All',
  counts = null,
  className = '',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('category') || '';
  const { categories, loading, error } = useCatalogCategories({ type });

  const clearCategory = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('category');
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const closeTimer = useRef(null);

  const openSheet = useCallback(() => {
    setOpen(true);
    window.requestAnimationFrame(() => setShown(true));
  }, []);

  const closeSheet = useCallback(() => {
    setShown(false);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      triggerRef.current?.focus();
    }, 240);
  }, []);

  // Cleanup: clear pending close, release the body scroll lock, return focus.
  useEffect(() => () => {
    window.clearTimeout(closeTimer.current);
    document.body.style.overflow = '';
  }, []);

  // Body scroll lock + Escape + focus while open.
  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSheet();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled])'
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const focusId = window.requestAnimationFrame(() => panelRef.current?.focus());
    return () => {
      document.removeEventListener('keydown', onKey);
      window.cancelAnimationFrame(focusId);
      document.body.style.overflow = '';
    };
  }, [open, closeSheet]);

  if (error && categories.length === 0) return null;

  const titleOf = (cat) =>
    typeof cat === 'string' ? cat : cat?.title || cat?.name || '';

  const countOf = (cat) => {
    const name = titleOf(cat);
    if (counts && name && counts[name] !== undefined) return counts[name];
    if (cat && typeof cat === 'object') return cat.productCount ?? cat.count ?? 0;
    return 0;
  };

  const isActive = (name) => !!active && active.toLowerCase() === name.toLowerCase();

  const rowClass = (activeRow) =>
    `flex items-center gap-3 w-full rounded-xl px-3 py-3 text-left text-sm transition-colors ${
      activeRow
        ? 'bg-[#75d04b]/10 text-[#75d04b] font-semibold ring-1 ring-[#75d04b]/30'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-800'
    }`;

  return (
    <>
      {/* ---------------------------------------------------------- trigger */}
      <div className={`lg:hidden ${className}`}>
        <div className="flex items-stretch gap-2">
          <button
            ref={triggerRef}
            type="button"
            onClick={openSheet}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="flex-1 min-w-0 flex items-center gap-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3.5 py-2.5 shadow-sm active:scale-[.99] transition"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#75d04b]/10 text-[#75d04b] flex-shrink-0">
              <MdTune size={16} />
            </span>
            <span className="min-w-0 text-left">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 leading-none">
                {title}
              </span>
              <span
                className={`block truncate text-sm leading-tight mt-0.5 ${
                  active
                    ? 'text-[#75d04b] font-semibold'
                    : 'text-gray-700 dark:text-gray-200 font-medium'
                }`}
              >
                {loading ? 'Loading…' : active || allLabel}
              </span>
            </span>
            <MdExpandMore size={18} className="ml-auto flex-shrink-0 text-gray-400" />
          </button>

          {active && (
            <button
              type="button"
              onClick={clearCategory}
              aria-label={`Clear category filter (${active})`}
              className="w-11 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900/50 shadow-sm"
            >
              <MdClose size={18} />
            </button>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------- sheet */}
      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              shown ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeSheet}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className={`absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-white shadow-2xl outline-none dark:bg-gray-900 transition-transform duration-300 ease-out ${
              shown ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            {/* grabber */}
            <div className="flex justify-center pt-3 pb-1">
              <span className="h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>

            {/* header */}
            <div className="flex items-center gap-3 px-4 pb-3 pt-1">
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {loading ? 'Loading categories' : `${categories.length} available`}
                </p>
              </div>
              <button
                type="button"
                onClick={closeSheet}
                aria-label="Close category filter"
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300"
              >
                <MdClose size={20} />
              </button>
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800" />

            {/* list */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
              {loading ? (
                <div className="space-y-2" aria-hidden="true">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-1.5">
                  <Link
                    to={basePath}
                    onClick={closeSheet}
                    aria-current={!active ? 'page' : undefined}
                    className={rowClass(!active)}
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      <MdOutlineApps size={17} />
                    </span>
                    <span className="flex-1 truncate">{allLabel}</span>
                    {!active && <MdOutlineCheck size={17} className="flex-shrink-0" />}
                  </Link>

                  {categories.map((cat) => {
                    const name = titleOf(cat);
                    if (!name) return null;
                    const selected = isActive(name);
                    const count = countOf(cat);
                    return (
                      <Link
                        key={cat._id || name}
                        to={categoryHref(name, basePath)}
                        onClick={closeSheet}
                        aria-current={selected ? 'page' : undefined}
                        className={rowClass(selected)}
                      >
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          <CategoryIcon title={name} size={17} />
                        </span>
                        <span className="flex-1 truncate">{name}</span>
                        {count > 0 && (
                          <span
                            className={`text-[11px] font-bold ${
                              selected ? 'text-[#75d04b]' : 'text-gray-400 dark:text-gray-500'
                            }`}
                          >
                            {count}
                          </span>
                        )}
                        {selected && <MdOutlineCheck size={17} className="flex-shrink-0" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* footer */}
            <div className="border-t border-gray-100 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 dark:border-gray-800">
              <button
                type="button"
                onClick={closeSheet}
                className="w-full rounded-xl bg-[#75d04b] py-3 text-sm font-bold text-white active:bg-[#5ac12f] transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategorySheet;
