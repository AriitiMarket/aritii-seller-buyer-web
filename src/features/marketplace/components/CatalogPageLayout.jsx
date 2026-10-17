import React from 'react';
import { AiOutlineFilter, AiOutlineClose } from 'react-icons/ai';
import Breadcrumbs from '@/shared/components/Breadcrumbs';

/**
 * CatalogPageLayout — shared top chrome for the public catalog pages
 * (`/products` and `/shops`).
 *
 * Chrome stack (mobile-first):
 *   1. MarketplaceHeader (sticky, h-16 = 64px)        — in PublicCatalogLayout
 *   2. SubNavBar (sticky top-16, h-10 = 40px)         — in PublicCatalogLayout
 *   3. Breadcrumbs                                     — below the sub-nav
 *   4. Toolbar (mobile) / left rail (desktop) ↔ main content
 *
 * Responsive layout (mobile-first):
 *   - < lg  : no inline rail. A "Filters & categories" toolbar button opens
 *             the SAME sidebar content in a LEFT slide-in drawer (overlay +
 *             scroll lock + Escape), so filters/categories stay fully usable
 *             on phones and the grid keeps the full width.
 *   - >= lg : the toolbar button is hidden; the sidebar is the leftmost fixed
 *             column (w-60), pinned with `sticky top-[104px]` (64px header +
 *             40px sub-nav) and scrolling internally past that height; the
 *             content takes the rest (flex-1).
 *
 * On desktop the rail is collapsible: hiding it frees the whole column
 * (width 0) so the content expands to the full container width; a "Show
 * filters" button is rendered above the content to bring it back.
 *
 * NOTE: horizontal padding (px-4 sm:px-6 lg:px-8) and the max-w-7xl container
 * come from PublicCatalogLayout — do not re-add them here.
 */
const CatalogPageLayout = ({
  breadcrumbItems,
  sidebarContent,
  mainContent,
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const drawerCloseRef = React.useRef(null);

  // Mobile drawer behaviours: focus close button, lock body scroll, Escape.
  React.useEffect(() => {
    if (!drawerOpen) return undefined;
    drawerCloseRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerOpen]);

  return (
    <div className="pb-8">
      {/* Breadcrumbs — below the sub-nav (layout provides the top spacing) */}
      {breadcrumbItems && <Breadcrumbs items={breadcrumbItems} />}

      {/* Mobile toolbar — filters/categories live in a left drawer on <lg */}
      <div className="mb-3 flex items-center gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 rounded bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          aria-haspopup="dialog"
          aria-controls="catalog-filters-drawer"
        >
          <AiOutlineFilter size={14} />
          Filters &amp; categories
        </button>
      </div>

      {/* Mobile-first: the rail is desktop-only (hidden < lg), so the content
          always gets the full width on phones */}
      <div className={`flex flex-col lg:flex-row ${sidebarOpen ? 'gap-4 lg:gap-8' : 'gap-0'}`}>
        {/* Left filter rail — leftmost column on desktop only, sticky under header+subnav */}
        <div
          className={`${
            sidebarOpen ? 'hidden lg:block lg:w-60' : 'hidden lg:block lg:w-0'
          } overflow-hidden transition-all duration-300 ease-in-out lg:flex-shrink-0 lg:sticky lg:top-[104px] lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto`}
        >
          <div className="flex items-center justify-between gap-2 mb-3 lg:w-60">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Filters
            </h2>
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                sidebarOpen
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
              aria-expanded={sidebarOpen}
              aria-controls="catalog-filters"
            >
              <AiOutlineFilter size={13} />
              {sidebarOpen ? 'Hide filters' : 'Show filters'}
            </button>
          </div>

          <div
            id="catalog-filters"
            className={`${sidebarOpen ? 'w-full lg:w-60' : 'w-0'} overflow-hidden transition-all duration-300 ease-in-out`}
          >
            <div className="space-y-1 pr-1 lg:pr-0">{sidebarContent}</div>
          </div>
        </div>

        {/* Main content — full width on mobile; takes the remaining space right
            of the leftmost rail on desktop, and ALL of it when the rail is hidden */}
        <div className="flex-1 min-w-0">
          {!sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 mb-3 px-3 py-1.5 text-xs font-semibold rounded bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-controls="catalog-filters"
            >
              <AiOutlineFilter size={13} />
              Show filters
            </button>
          )}
          {mainContent}
        </div>
      </div>

      {/* ===== Mobile filters/categories drawer — LEFT slide-in ===== */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[65] bg-black/50 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        >
          <div
            id="catalog-filters-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Filters and categories"
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-y-0 left-0 z-[70] flex w-72 max-w-[85vw] flex-col rounded-r-xl bg-white shadow-level-3 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Filters &amp; categories
              </h2>
              <button
                ref={drawerCloseRef}
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                aria-label="Close filters"
              >
                <AiOutlineClose size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">{sidebarContent}</div>

            <div className="border-t border-gray-200 p-3 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-full rounded-lg bg-[#75d04b] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5ac12f]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPageLayout;
