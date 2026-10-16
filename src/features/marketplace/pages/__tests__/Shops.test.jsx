import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from '@reduxjs/toolkit';

vi.mock('@/shared/hooks/useShops', () => ({
  useShops: vi.fn(),
  filterShops: vi.fn((shops, { search, category } = {}) => {
    let filtered = Array.isArray(shops) ? [...shops] : [];
    if (search?.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter((s) =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        (s.category || '').toLowerCase().includes(q)
      );
    }
    if (category) {
      filtered = filtered.filter(
        (s) => String(s.category || '').trim().toLowerCase() === category.trim().toLowerCase()
      );
    }
    return filtered;
  }),
}));

vi.mock('@/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/features/marketplace/components/CatalogPageLayout', () => ({
  default: ({ mainContent, children }) => <>{mainContent || children}</>,
}));

vi.mock('@/features/marketplace/components/CategorySidebar', () => ({
  default: () => null,
}));

import ShopsPage from '../Shops';
import { useShops, filterShops } from '@/shared/hooks/useShops';
import { useAuth } from '@/auth/hooks/useAuth';

const mockShops = [
  {
    _id: 'shop-1',
    name: 'TechHub Electronics',
    description: 'Latest gadgets and electronics',
    category: 'Retail',
    address: '100 Tech Street',
    zipCode: '10001',
    status: 'APPROVED',
    showOnPublic: true,
    productCount: 15,
    ratings: 4.5,
    ratingCount: 100,
    avatar: { public_id: 'shop_1', url: 'https://example.com/shop1.png' },
    isVerified: true,
  },
  {
    _id: 'shop-2',
    name: 'Fashion Forward',
    description: 'Trendy clothing and fashion accessories',
    category: 'Fashion',
    address: '200 Fashion Ave',
    zipCode: '10002',
    status: 'APPROVED',
    showOnPublic: true,
    productCount: 25,
    ratings: 4.2,
    ratingCount: 50,
    avatar: { public_id: 'shop_2', url: 'https://example.com/shop2.png' },
    isVerified: false,
  },
  {
    _id: 'shop-3',
    name: 'Harar Fresh Market',
    description: 'Fresh produce and organic food',
    category: 'Food & Beverage',
    address: '300 Market Road',
    zipCode: '10003',
    status: 'SUSPENDED',
    showOnPublic: false,
    productCount: 0,
    ratings: 0,
    ratingCount: 0,
  },
];

const renderPage = (auth = {}, shops = mockShops) => {
  const store = createStore(() => ({}));
  const utils = render(
    <ReduxProvider store={store}>
      <MemoryRouter initialEntries={['/shops']}>
        <ShopsPage />
      </MemoryRouter>
    </ReduxProvider>
  );
  return utils;
};

describe('ShopsPage - Public Shop Discovery', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders shop cards for publicly visible shops', () => {
    (useAuth).mockReturnValue({ isAuthenticated: false, loading: false });
    (useShops).mockReturnValue({
      shops: mockShops.filter((s) => s.showOnPublic !== false && s.status === 'APPROVED'),
      loading: false,
      error: null,
      refresh: vi.fn(),
    });

    renderPage();
    expect(screen.getByText(/TechHub Electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/Fashion Forward/i)).toBeInTheDocument();
    // Suspended shop should not appear
    expect(screen.queryByText(/Harar Fresh Market/i)).not.toBeInTheDocument();
  });

  it('shows loading state while fetching shops', () => {
    (useAuth).mockReturnValue({ isAuthenticated: false, loading: false });
    (useShops).mockReturnValue({
      shops: [],
      loading: true,
      error: null,
      refresh: vi.fn(),
    });

    renderPage();
    expect(screen.getByText(/Loading shops/i)).toBeInTheDocument();
  });

  it('shows empty state when no shops are available', () => {
    (useAuth).mockReturnValue({ isAuthenticated: false, loading: false });
    (useShops).mockReturnValue({
      shops: [],
      loading: false,
      error: null,
      refresh: vi.fn(),
    });

    renderPage();
    expect(screen.getByText(/No shops available yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Be the first to sell on Aritii Market/i)).toBeInTheDocument();
  });

  it('shows error state when shops fail to load', () => {
    (useAuth).mockReturnValue({ isAuthenticated: false, loading: false });
    (useShops).mockReturnValue({
      shops: [],
      loading: false,
      error: 'Could not load shops',
      refresh: vi.fn(),
    });

    renderPage();
    const errorText = screen.getAllByText(/Could not load shops/i);
    expect(errorText.length).toBeGreaterThan(0);
  });

  it('filters shops by search term', () => {
    (useAuth).mockReturnValue({ isAuthenticated: false, loading: false });
    (useShops).mockReturnValue({
      shops: mockShops.filter((s) => s.showOnPublic !== false && s.status === 'APPROVED'),
      loading: false,
      error: null,
      refresh: vi.fn(),
    });

    renderPage({ shops: mockShops.filter((s) => s.showOnPublic !== false && s.status === 'APPROVED') });
    // The filterShops mock handles filtering; verify it's called
    expect(filterShops).toHaveBeenCalled();
  });

  it('renders shop cards with correct info', () => {
    (useAuth).mockReturnValue({ isAuthenticated: false, loading: false });
    (useShops).mockReturnValue({
      shops: [mockShops[0]],
      loading: false,
      error: null,
      refresh: vi.fn(),
    });

    renderPage();
    expect(screen.getByText(/TechHub Electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/Latest gadgets and electronics/i)).toBeInTheDocument();
    expect(screen.getByText(/15/i)).toBeInTheDocument();
  });
});