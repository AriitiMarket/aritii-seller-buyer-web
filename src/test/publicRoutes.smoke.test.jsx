import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from '@reduxjs/toolkit';

vi.mock('@/services/api', () => ({
  default: { get: vi.fn().mockResolvedValue({ data: { hierarchy: [] } }) },
}));

vi.mock('@/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({ isAuthenticated: false, loading: false, user: null })),
}));

import PublicRoutes from '@/app/routes/PublicRoutes';

const store = createStore(() => ({
  cart: { cart: [] },
  user: { isAuthenticated: false },
  seller: { isSeller: false, isLoading: false },
  products: { allProducts: [] },
  shop: { categoriesByType: { product: [] } },
  events: { allEvents: [], isLoading: false },
  wishlist: { wishlist: [] },
}));

const ROUTES = [
  '/',
  '/marketplace',
  '/products',
  '/categories',
  '/shops',
  '/deals',
  '/best-selling',
  '/about',
  '/how-it-works',
  '/faq',
  '/events',
  '/sell-on-aritii',
  '/seller-center',
  '/seller-center/overview',
  '/seller-center/benefits',
  '/seller-center/how-it-works',
  '/seller-center/workspace',
  '/delivery',
  '/delivery-center',
];

describe('Public routes smoke test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  ROUTES.forEach((path) => {
    it(`renders ${path} without crashing`, async () => {
      const { unmount } = render(
        <ReduxProvider store={store}>
          <MemoryRouter initialEntries={[path]}>
            <Routes>{PublicRoutes()}</Routes>
          </MemoryRouter>
        </ReduxProvider>
      );
      // The routes are lazy; give the chunk a tick to mount.
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(document.body).toBeTruthy();
      unmount();
    });
  });
});
