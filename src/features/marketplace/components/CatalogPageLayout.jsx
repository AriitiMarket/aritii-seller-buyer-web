import React from 'react';
import { AiOutlineFilter, AiOutlineClose } from 'react-icons/ai';
import Breadcrumbs from '@/shared/components/Breadcrumbs';

/**
 * CatalogPageLayout — shared top chrome for the public catalog pages
 * (`/products` and `/shops`).
 *
 * Layout structure:
 *   - FilterSidebar to far left (full height, sticky)
 *   - Main content takes remaining space
 *   - Mobile: sidebar becomes drawer overlay
 *
 * Responsive (mobile-first):
 *   - Mobile (<lg): FilterSidebar hidden, toolbar with drawer button
 *   - Tablet (md): Optional sidebar visibility
 *   - Desktop (lg+): Sidebar sticky on left, full height
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
      <div className="mb-4 flex items-center gap-2 lg:hidden px-3 sm:px-4">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 min-h-[44px] min-w-[44px] flex-1"
          aria-haspopup="dialog"
          aria-controls="catalog-filters-drawer"
        >
          <AiOutlineFilter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Main flex layout: Sidebar on left (desktop), content on right */}
      <div className="flex gap-0 lg:gap-6 px-3 sm:px-4 lg:px-0">
        {/* Left FilterSidebar — sticky, full height on desktop */}
        <aside
          className={`hidden lg:flex lg:flex-col lg:flex-shrink-0 ${
            sidebarOpen ? 'lg:w-60' : 'lg:w-0'
          } overflow-hidden transition-all duration-300 ease-in-out`}
        >
          <div className="sticky top-[104px] max-h-[calc(100vh-7rem)] overflow-y-auto pr-3">
            <div className="space-y-1">{sidebarContent}</div>
          </div>
        </aside>

        {/* Main content area — takes remaining space */}
        <main className="flex-1 min-w-0">
          {mainContent}
        </main>
      </div>

      {/* ===== Mobile filters drawer — LEFT slide-in overlay ===== */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[65] lg:hidden" onClick={() => setDrawerOpen(false)}>
          {/* Backdrop overlay — inert attribute prevents focus on main page while drawer is open */}
          <div
            className="fixed inset-0 bg-black/50"
            inert=""
            aria-hidden="true"
          />
          
          {/* Dialog itself — NOT aria-hidden, so focus can be trapped inside */}
          <div
            id="catalog-filters-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Filters and categories"
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-y-0 left-0 z-[70] flex w-72 max-w-[85vw] flex-col rounded-r-2xl bg-white dark:bg-gray-900 shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-4 min-h-[56px] flex-shrink-0">
              <h2 className="text-base font-bold text-[#131921] dark:text-white">
                Filters & Categories
              </h2>
              <button
                ref={drawerCloseRef}
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 -m-2 text-gray-500 dark:text-gray-400 transition-colors hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px]"
                aria-label="Close filters"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>

            {/* Sidebar content — scrollable */}
            <div className="flex-1 overflow-y-auto p-4 space-y-0">
              {sidebarContent}
            </div>

            {/* Footer action */}
            <div className="border-t border-gray-200 dark:border-gray-800 p-4 min-h-[56px] flex items-center flex-shrink-0">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-full rounded-lg bg-[#75d04b] px-4 py-3 text-base font-bold text-white transition-colors hover:bg-[#5ac12f] active:bg-[#4ab01f] min-h-[44px]"
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
