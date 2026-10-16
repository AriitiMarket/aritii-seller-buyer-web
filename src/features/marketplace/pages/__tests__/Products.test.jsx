import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from '@reduxjs/toolkit';

vi.mock('@/features/marketplace/hooks/useDeals', () => ({
  useDeals: vi.fn(),
}));

vi.mock('@/shared/hooks/useCatalogCategories', () => ({
  useCatalogCategories: vi.fn(() => ({ categories: [], loading: false })),
}));

vi.mock('@/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/features/marketplace/components/CatalogPageLayout', () => ({
  default: ({ mainContent, children, breadcrumbItems }) => (
    <>
      {breadcrumbItems?.map((item, i) => (
        <div key={i}>{item.label}</div>
      ))}
      {mainContent || children}
    </>
  ),
}));

import { useDeals } from '@/features/marketplace/hooks/useDeals';
import DealsPage from '../DealsPage';

const mockDeals = [
  {
    _id: 'prod-1',
    name: 'Smart Watch Pro',
    description: 'Latest smartwatch with GPS and heart rate monitor',
    images: ['https://example.com/watch.jpg'],
    originalPrice: 2500,
    discountPrice: 1750,
    discountPercent: 30,
    discount: 750,
    category: 'Electronics',
    ratings: 4.5,
    sold_out: 120,
    stock: 45,
    createdAt: '2026-01-10T10:00:00Z',
    shop: { _id: 'shop-1', name: 'TechHub Electronics', avatar: { url: 'https://example.com/shop1.png' } },
  },
  {
    _id: 'prod-2',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling headphones',
    images: ['https://example.com/headphones.jpg'],
    originalPrice: 1800,
    discountPrice: 1260,
    discountPercent: 30,
    discount: 540,
    category: 'Electronics',
    ratings: 4.2,
    sold_out: 85,
    stock: 30,
    createdAt: '2026-01-12T10:00:00Z',
    shop: { _id: 'shop-1', name: 'TechHub Electronics', avatar: { url: 'https://example.com/shop1.png' } },
  },
  {
    _id: 'prod-3',
    name: 'Running Shoes',
    description: 'Lightweight running shoes for daily training',
    images: ['https://example.com/shoes.jpg'],
    originalPrice: 1500,
    discountPrice: 1050,
    discountPercent: 30,
    discount: 450,
    category: 'Fashion',
    ratings: 4.0,
    sold_out: 200,
    stock: 100,
    createdAt: '2026-01-15T10:00:00Z',
    shop: { _id: 'shop-2', name: 'SportHub', avatar: { url: 'https://example.com/shop2.png' } },
  },
];

const renderPage = (deals = mockDeals, loading = false, error = null) => {
  (useDeals).mockReturnValue({
    deals,
    loading,
    error,
    refresh: vi.fn(),
  });
  const store = createStore(() => ({}));
  return render(
    <ReduxProvider store={store}>
      <MemoryRouter initialEntries={['/deals']}>
        <DealsPage />
      </MemoryRouter>
    </ReduxProvider>
  );
};

describe('DealsPage - Today\'s Deals', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders product cards for each deal', () => {
    renderPage();
    const headings = screen.getAllByText("Today's Deals");
    expect(headings.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Smart Watch Pro/i)).toBeInTheDocument();
    expect(screen.getByText(/Wireless Headphones/i)).toBeInTheDocument();
    expect(screen.getByText(/Running Shoes/i)).toBeInTheDocument();
    const discountBadges = screen.getAllByText(/30% off/i);
    expect(discountBadges.length).toBeGreaterThanOrEqual(1);
  });

  it('shows loading state while fetching deals', () => {
    renderPage([], true, null);
    expect(screen.getByText(/Loading deals/i)).toBeInTheDocument();
  });

  it('shows empty state when no deals are available', () => {
    renderPage([], false, null);
    expect(screen.getByText(/No deals right now/i)).toBeInTheDocument();
    expect(screen.getByText(/All products are at full price/i)).toBeInTheDocument();
  });

  it('shows error state when deals fail to load', () => {
    renderPage([], false, 'Could not load deals');
    expect(screen.getAllByText(/Could not load deals/i)).toHaveLength(2);
  });

  it('enables sort by discount percent', () => {
    renderPage();
    const select = screen.getByLabelText('Sort deals');
    expect(select).toHaveValue('discount-percent');
  });
});
