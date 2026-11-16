import React from 'react';
import { Outlet } from 'react-router-dom';
import SkipToContent from '@/shared/components/SkipToContent';
import ErrorBoundary from '@/components/layout/ErrorBoundary';

/**
 * BaseLayout - Consolidated foundation layout supporting explicit slot-based
 * injection across all portals (Public Marketplace, Buyer Portal, Seller Central, Delivery Portal).
 *
 * Slots & Configuration:
 * - topBar: Element rendered at the top (e.g. TopUtilityBar, PublicScrollToTop, announcements)
 * - header: Portal-specific header (MarketplaceHeader, BuyerHeader, ModernSellerHeader, ProviderHeader)
 * - sidebar: Desktop navigation sidebar (e.g. ModernSellerSidebar, ProviderSidebar)
 * - sidebarClassName: Custom classes for the sidebar wrapper when auto-wrapped
 * - sidebarDirect: When true, renders `sidebar` without an enclosing <aside>
 * - drawer: Mobile navigation drawer (e.g. ModernSellerMobileDrawer, ProviderMobileDrawer)
 * - bottomNav: Mobile bottom navigation bar
 * - footer: Portal footer or standardized footer
 * - footerPlacement: 'auto' | 'inside-main' | 'after-main'
 * - layoutMode: 'page' (min-h-screen) | 'viewport' (h-screen overflow-hidden)
 * - portalName: Domain name for error boundary containment ('Buyer Portal', 'Seller Central', etc.)
 * - errorFallback: Custom fallback component or render function for ErrorBoundary
 * - onReset: Reset callback function for ErrorBoundary
 * - onError: Error reporting callback for ErrorBoundary
 * - skipToContent: Whether to render the SkipToContent accessibility link (default true)
 * - withErrorBoundary: Whether to wrap the layout with an ErrorBoundary (default true)
 * - className: Outer container custom class
 * - bodyClassName: Main content wrapper custom class
 * - mainClassName: <main> element custom class
 * - contentWrapperClassName: Inner container wrapper class around children/Outlet
 * - mainId: HTML id for the main element (default 'main-content')
 * - dataTestId: data-testid attribute for the main element
 * - children: Optional child content (defaults to <Outlet /> if omitted)
 */
export function BaseLayout({
  children,
  portalName,
  errorFallback = null,
  onReset = null,
  onError = null,
  topBar = null,
  header = null,
  sidebar = null,
  sidebarClassName = 'hidden lg:block',
  sidebarDirect = false,
  drawer = null,
  bottomNav = null,
  footer = null,
  footerPlacement = 'auto',
  layoutMode = 'page',
  skipToContent = true,
  withErrorBoundary = true,
  className = '',
  bodyClassName = '',
  mainClassName = '',
  contentWrapperClassName = '',
  mainId = 'main-content',
  dataTestId,
  ...restProps
}) {
  const isViewport = layoutMode === 'viewport';
  const resolvedFooterPlacement =
    footerPlacement === 'auto'
      ? isViewport
        ? 'inside-main'
        : 'after-main'
      : footerPlacement;

  // Default container classes based on layout mode
  const defaultContainerClass = isViewport
    ? 'flex flex-col h-screen overflow-hidden'
    : 'min-h-screen flex flex-col';

  // Default body classes based on layout mode
  const defaultBodyClass = isViewport
    ? 'flex flex-1 min-h-0'
    : sidebar
      ? 'flex flex-1 min-h-0'
      : 'flex-1 flex flex-col';

  // Default main element classes
  const defaultMainClass = isViewport
    ? 'flex-1 min-w-0 min-h-0 overflow-y-auto outline-none'
    : 'flex-1 outline-none';

  const containerClasses = `${defaultContainerClass} ${className}`.trim();
  const bodyClasses = bodyClassName || defaultBodyClass;
  const mainClasses = mainClassName || defaultMainClass;

  const renderedContent = children !== undefined ? children : <Outlet />;

  const renderedSidebar = sidebar ? (
    sidebarDirect ? (
      sidebar
    ) : (
      <aside className={sidebarClassName}>{sidebar}</aside>
    )
  ) : null;

  const layoutMarkup = (
    <div className={containerClasses} {...restProps}>
      {skipToContent && <SkipToContent />}
      {topBar}
      {header}
      {drawer}

      <div className={bodyClasses}>
        {renderedSidebar}
        <main
          id={mainId}
          tabIndex={-1}
          className={mainClasses}
          data-testid={dataTestId}
        >
          {contentWrapperClassName ? (
            <div className={contentWrapperClassName}>{renderedContent}</div>
          ) : (
            renderedContent
          )}
          {resolvedFooterPlacement === 'inside-main' && footer}
        </main>
      </div>

      {resolvedFooterPlacement === 'after-main' && footer}
      {bottomNav}
    </div>
  );

  if (withErrorBoundary) {
    return (
      <ErrorBoundary
        portalName={portalName}
        fallback={errorFallback}
        onReset={onReset}
        onError={onError}
      >
        {layoutMarkup}
      </ErrorBoundary>
    );
  }

  return layoutMarkup;
}

export default BaseLayout;
