import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import BaseLayout from '@/components/layout/BaseLayout';
import BuyerLayout from '@/features/buyer/components/BuyerLayout';
import BusinessLayout from '@/features/seller/components/BusinessLayout';
import PublicCatalogLayout from '@/features/marketplace/layout/PublicCatalogLayout';
import PublicLayout from '@/features/marketplace/layout/PublicLayout';

// Mock sub-components that have heavy dependencies
vi.mock('@/shared/components/SkipToContent', () => ({
  default: () => <a href="#main-content">Skip to content</a>,
}));

vi.mock('@/public/components/PublicScrollToTop', () => ({
  default: () => <div data-testid="scroll-to-top" />,
}));

vi.mock('@/public/components/TopUtilityBar', () => ({
  default: () => <div data-testid="top-utility-bar" />,
}));

vi.mock('@/features/marketplace/components/MarketplaceHeader', () => ({
  default: ({ hideSubNav }) => (
    <header data-testid="marketplace-header" data-hide-subnav={hideSubNav ? 'true' : 'false'}>
      MarketplaceHeader
    </header>
  ),
}));

vi.mock('@/features/buyer/components/BuyerHeader', () => ({
  default: () => <header data-testid="buyer-header">BuyerHeader</header>,
}));

vi.mock('@/features/seller/components/SellerHeader/ModernSellerHeader', () => ({
  default: ({ onMenuClick, onToggleSidebar, sidebarCollapsed }) => (
    <header data-testid="seller-header" data-collapsed={sidebarCollapsed ? 'true' : 'false'}>
      <button onClick={onMenuClick}>Menu</button>
      <button onClick={onToggleSidebar}>Toggle</button>
    </header>
  ),
}));

vi.mock('@/features/seller/components/SellerSidebar/ModernSellerSidebar', () => ({
  default: ({ isCollapsed }) => (
    <div data-testid="seller-sidebar" data-collapsed={isCollapsed ? 'true' : 'false'}>
      SellerSidebar
    </div>
  ),
}));

vi.mock('@/features/seller/components/SellerMobileDrawer/ModernSellerMobileDrawer', () => ({
  default: ({ isOpen }) => (
    <div data-testid="seller-drawer" data-open={isOpen ? 'true' : 'false'}>
      SellerDrawer
    </div>
  ),
}));

vi.mock('@/shared/components/Footer', () => ({
  default: () => <footer data-testid="public-footer">PublicFooter</footer>,
}));

describe('BaseLayout Component', () => {
  it('renders slot elements in page mode with header, topBar, footer, and children', () => {
    render(
      <MemoryRouter>
        <BaseLayout
          layoutMode="page"
          topBar={<div data-testid="test-topbar">Top Bar</div>}
          header={<header data-testid="test-header">Header</header>}
          footer={<footer data-testid="test-footer">Footer</footer>}
          dataTestId="test-main"
        >
          <div data-testid="test-content">Page Content</div>
        </BaseLayout>
      </MemoryRouter>
    );

    expect(screen.getByTestId('test-topbar')).toBeInTheDocument();
    expect(screen.getByTestId('test-header')).toBeInTheDocument();
    expect(screen.getByTestId('test-main')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByTestId('test-footer')).toBeInTheDocument();
    expect(screen.getByText('Skip to content')).toBeInTheDocument();
  });

  it('renders in viewport mode with sidebar and inner footer placement', () => {
    render(
      <MemoryRouter>
        <BaseLayout
          layoutMode="viewport"
          sidebar={<div data-testid="test-sidebar">Sidebar</div>}
          footer={<footer data-testid="viewport-footer">Viewport Footer</footer>}
          dataTestId="viewport-main"
        >
          <div data-testid="viewport-content">Viewport Content</div>
        </BaseLayout>
      </MemoryRouter>
    );

    expect(screen.getByTestId('test-sidebar')).toBeInTheDocument();
    const main = screen.getByTestId('viewport-main');
    expect(main).toBeInTheDocument();
    expect(main).toContainElement(screen.getByTestId('viewport-content'));
    expect(main).toContainElement(screen.getByTestId('viewport-footer'));
  });

  it('renders Outlet when children are omitted in routing contexts', () => {
    render(
      <MemoryRouter initialEntries={['/test-route']}>
        <Routes>
          <Route
            element={
              <BaseLayout
                layoutMode="page"
                header={<header>Route Header</header>}
                dataTestId="route-main"
              />
            }
          >
            <Route path="/test-route" element={<div data-testid="outlet-child">Child From Outlet</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Route Header')).toBeInTheDocument();
    expect(screen.getByTestId('outlet-child')).toBeInTheDocument();
  });

  it('contains component crashes safely via withErrorBoundary', () => {
    const ProblemChild = () => {
      throw new Error('Simulated render error');
    };

    // Prevent console.error noise during error boundary test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <BaseLayout withErrorBoundary={true}>
          <ProblemChild />
        </BaseLayout>
      </MemoryRouter>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});

describe('Consolidated Portal Layouts', () => {
  it('BuyerLayout renders BuyerHeader, buyer navigation, and scannable padding classes', () => {
    render(
      <MemoryRouter initialEntries={['/my-dashboard']}>
        <BuyerLayout>
          <div data-testid="buyer-content">Buyer Dashboard Content</div>
        </BuyerLayout>
      </MemoryRouter>
    );

    expect(screen.getByTestId('buyer-header')).toBeInTheDocument();
    expect(screen.getByTestId('buyer-content')).toBeInTheDocument();

    // Verify container padding rule: px-4 md:px-6 lg:px-12 xl:px-20 2xl:px-[80px]
    const contentWrapper = screen.getByTestId('buyer-content').parentElement;
    expect(contentWrapper.className).toContain('px-4');
    expect(contentWrapper.className).toContain('md:px-6');
    expect(contentWrapper.className).toContain('lg:px-12');
    expect(contentWrapper.className).toContain('xl:px-20');
    expect(contentWrapper.className).toContain('2xl:px-[80px]');

    // Verify buyer mobile navigation links
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /orders/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
  });

  it('BusinessLayout renders ModernSellerHeader, ModernSellerSidebar, and dark/light surfaces', () => {
    render(
      <MemoryRouter initialEntries={['/business']}>
        <BusinessLayout>
          <div data-testid="seller-content">Seller Content</div>
        </BusinessLayout>
      </MemoryRouter>
    );

    expect(screen.getByTestId('seller-header')).toBeInTheDocument();
    expect(screen.getByTestId('seller-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('seller-drawer')).toBeInTheDocument();

    const main = screen.getByTestId('business-content');
    expect(main).toBeInTheDocument();
    expect(main.className).toContain('bg-[#f8f9fa]');
    expect(main.className).toContain('dark:bg-[#0f1419]');
    expect(screen.getByText(/Aritii Market Seller Central/i)).toBeInTheDocument();
  });

  it('PublicCatalogLayout renders MarketplaceHeader, scroll restoration, and Footer', () => {
    render(
      <MemoryRouter initialEntries={['/products']}>
        <Routes>
          <Route element={<PublicCatalogLayout />}>
            <Route path="/products" element={<div data-testid="products-content">Products Catalog</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('marketplace-header')).toBeInTheDocument();
    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
    expect(screen.getByTestId('public-footer')).toBeInTheDocument();
    expect(screen.getByTestId('products-content')).toBeInTheDocument();
  });

  it('PublicLayout accepts children and respects hideFooter & hideSubNav options', () => {
    const { rerender } = render(
      <MemoryRouter>
        <PublicLayout hideFooter={true} hideSubNav={true}>
          <div data-testid="landing-content">Marketplace Landing</div>
        </PublicLayout>
      </MemoryRouter>
    );

    expect(screen.getByTestId('landing-content')).toBeInTheDocument();
    expect(screen.queryByTestId('public-footer')).not.toBeInTheDocument();
    expect(screen.getByTestId('marketplace-header')).toHaveAttribute('data-hide-subnav', 'true');

    rerender(
      <MemoryRouter>
        <PublicLayout hideFooter={false} hideSubNav={false}>
          <div data-testid="landing-content">Marketplace Landing</div>
        </PublicLayout>
      </MemoryRouter>
    );

    expect(screen.getByTestId('public-footer')).toBeInTheDocument();
    expect(screen.getByTestId('marketplace-header')).toHaveAttribute('data-hide-subnav', 'false');
  });
});
