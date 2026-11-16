import React from 'react';
import BaseLayout from '@/components/layout/BaseLayout';
import MarketplaceHeader from '@/features/marketplace/components/MarketplaceHeader';
import PublicFooter from '@/shared/components/Footer';
import PublicScrollToTop from '@/public/components/PublicScrollToTop';
import TopUtilityBar from '@/public/components/TopUtilityBar';

/**
 * PublicLayout — for pages visible to anyone (no login required).
 *
 * Uses BaseLayout with:
 * - topBar: PublicScrollToTop + TopUtilityBar
 * - header: MarketplaceHeader (with optional hideSubNav)
 * - content: children passed directly
 * - footer: PublicFooter (optional via hideFooter)
 * - layoutMode: 'page'
 * - withErrorBoundary: true (crash containment)
 */
const PublicLayout = ({ 
  children, 
  hideFooter = false, 
  hideSubNav = false,
  topUtilityBar = <TopUtilityBar />,
}) => {
  return (
    <BaseLayout
      portalName="Marketplace"
      layoutMode="page"
      topBar={
        <>
          <PublicScrollToTop />
          {topUtilityBar}
        </>
      }
      header={<MarketplaceHeader hideSubNav={hideSubNav} />}
      footer={!hideFooter ? <PublicFooter /> : null}
      className="min-h-screen flex flex-col bg-white dark:bg-gray-950"
      mainClassName="flex-1 outline-none bg-white dark:bg-gray-950"
      withErrorBoundary={true}
    >
      {children}
    </BaseLayout>
  );
};

export { PublicLayout };
export default PublicLayout;
