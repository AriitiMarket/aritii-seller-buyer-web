import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BaseLayout from '@/components/layout/BaseLayout';
import ProviderHeader from './ProviderHeader';
import ProviderSidebar from './ProviderSidebar';
import ProviderMobileDrawer from './ProviderMobileDrawer';

/**
 * ProviderLayout - Unified layout for all /provider/* delivery routes.
 *
 * Extends BaseLayout with:
 * - Header: ProviderHeader
 * - Sidebar: ProviderSidebar
 * - Drawer: ProviderMobileDrawer
 * - Surface: gray-50
 * - ErrorBoundary: Crash containment isolating delivery provider operations
 */
const ProviderLayout = ({ flushFooter = false, children }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const closeMobileDrawer = () => setMobileDrawerOpen(false);

  const providerHeader = <ProviderHeader onMenuClick={() => setMobileDrawerOpen(true)} />;
  const providerDrawer = (
    <ProviderMobileDrawer
      isOpen={mobileDrawerOpen}
      onClose={closeMobileDrawer}
    />
  );
  const providerSidebar = (
    <aside className="hidden lg:flex lg:flex-col flex-shrink-0 h-full">
      <ProviderSidebar />
    </aside>
  );

  const providerFooter = !flushFooter ? (
    <footer className="mt-8 py-4 px-6 text-center text-xs text-gray-500 border-t border-gray-200 bg-white">
      <span>© Aritii Market Provider Portal.</span>{' '}
      <Link className="hover:underline text-[#75d04b]" to="/provider/available-work">Available Work</Link> ·{' '}
      <Link className="hover:underline text-[#75d04b]" to="/provider/deliveries">My Deliveries</Link>
    </footer>
  ) : null;

  return (
    <BaseLayout
      portalName="Delivery Portal"
      layoutMode="viewport"
      className="bg-gray-50"
      header={providerHeader}
      drawer={providerDrawer}
      sidebar={providerSidebar}
      sidebarDirect={true}
      footer={providerFooter}
      footerPlacement="inside-main"
      mainClassName="flex-1 min-w-0 min-h-0 overflow-y-auto px-4 py-6 lg:px-6 lg:py-6 outline-none"
      dataTestId="provider-content"
      withErrorBoundary={true}
    >
      {children}
    </BaseLayout>
  );
};

export { ProviderLayout };
export default ProviderLayout;
