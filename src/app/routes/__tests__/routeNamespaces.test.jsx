import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React, { Suspense } from 'react';
import { MemoryRouter, Routes } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PublicRoutes from '@/app/routes/PublicRoutes';
import BusinessRoutes from '@/app/routes/BusinessRoutes';
import ProviderRoutes from '@/app/routes/ProviderRoutes';
import { rootReducer } from '@/app/store';
import { LayoutProvider } from '@/app/providers/LayoutContext';

vi.mock('@/public/layout/PublicCatalogLayout', () => ({
  default: () => <div data-testid="public-catalog-layout">Catalog Layout</div>,
}));

vi.mock('@/features/seller/components/BusinessLayout.jsx', () => ({
  default: () => <div data-testid="business-layout">Business Layout</div>,
}));

vi.mock('@/features/delivery/components/ProviderLayout', () => ({
  default: () => <div data-testid="provider-layout">Provider Layout</div>,
}));

vi.mock('@/shared/hooks/useAppBootstrap', () => ({
  useAppBootstrap: vi.fn(),
}));

function createMockStore(preloadedState = {}) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

describe('React Router Namespaces & Route Boundary Enforcement', () => {
  it('renders PublicCatalogLayout for /marketplace/products retail catalog route', async () => {
    const store = createMockStore();

    render(
      <ReduxProvider store={store}>
        <LayoutProvider>
          <MemoryRouter initialEntries={['/marketplace/products']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>{PublicRoutes()}</Routes>
            </Suspense>
          </MemoryRouter>
        </LayoutProvider>
      </ReduxProvider>
    );

    expect(await screen.findByTestId('public-catalog-layout')).toBeInTheDocument();
  });

  it('renders BusinessLayout when authenticated merchant visits /seller namespace', async () => {
    const store = createMockStore({
      user: {
        isAuthenticated: true,
        loading: false,
        user: { role: 'SELLER', capabilities: ['SELLER'], roleStatuses: { SELLER: 'ACTIVE' } },
      },
      seller: {
        isSeller: true,
        isLoading: false,
        seller: { _id: 'seller-1' },
      },
    });

    render(
      <ReduxProvider store={store}>
        <LayoutProvider>
          <MemoryRouter initialEntries={['/seller']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>{BusinessRoutes()}</Routes>
            </Suspense>
          </MemoryRouter>
        </LayoutProvider>
      </ReduxProvider>
    );

    expect(await screen.findByTestId('business-layout')).toBeInTheDocument();
  });

  it('renders BusinessLayout when authenticated merchant visits /business namespace', async () => {
    const store = createMockStore({
      user: {
        isAuthenticated: true,
        loading: false,
        user: { role: 'SELLER', capabilities: ['SELLER'], roleStatuses: { SELLER: 'ACTIVE' } },
      },
      seller: {
        isSeller: true,
        isLoading: false,
        seller: { _id: 'seller-1' },
      },
    });

    render(
      <ReduxProvider store={store}>
        <LayoutProvider>
          <MemoryRouter initialEntries={['/business']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>{BusinessRoutes()}</Routes>
            </Suspense>
          </MemoryRouter>
        </LayoutProvider>
      </ReduxProvider>
    );

    expect(await screen.findByTestId('business-layout')).toBeInTheDocument();
  });

  it('renders ProviderLayout when authenticated driver visits /delivery-center/hub', async () => {
    const store = createMockStore({
      user: {
        isAuthenticated: true,
        loading: false,
        user: { role: 'PROVIDER', capabilities: ['PROVIDER'], roleStatuses: { PROVIDER: 'ACTIVE' } },
      },
    });

    render(
      <ReduxProvider store={store}>
        <LayoutProvider>
          <MemoryRouter initialEntries={['/delivery-center/hub']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>{ProviderRoutes()}</Routes>
            </Suspense>
          </MemoryRouter>
        </LayoutProvider>
      </ReduxProvider>
    );

    expect(await screen.findByTestId('provider-layout')).toBeInTheDocument();
  });

  it('renders ProviderLayout when authenticated driver visits /provider namespace', async () => {
    const store = createMockStore({
      user: {
        isAuthenticated: true,
        loading: false,
        user: { role: 'PROVIDER', capabilities: ['PROVIDER'], roleStatuses: { PROVIDER: 'ACTIVE' } },
      },
    });

    render(
      <ReduxProvider store={store}>
        <LayoutProvider>
          <MemoryRouter initialEntries={['/provider']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>{ProviderRoutes()}</Routes>
            </Suspense>
          </MemoryRouter>
        </LayoutProvider>
      </ReduxProvider>
    );

    expect(await screen.findByTestId('provider-layout')).toBeInTheDocument();
  });

  it('blocks unauthenticated visitors from entering /seller and presents sign-in required', async () => {
    const store = createMockStore({
      user: {
        isAuthenticated: false,
        loading: false,
        user: null,
      },
      seller: {
        isSeller: false,
        isLoading: false,
        seller: null,
      },
    });

    render(
      <ReduxProvider store={store}>
        <LayoutProvider>
          <MemoryRouter initialEntries={['/seller']}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>{BusinessRoutes()}</Routes>
            </Suspense>
          </MemoryRouter>
        </LayoutProvider>
      </ReduxProvider>
    );

    expect(await screen.findByText('Please sign in to continue')).toBeInTheDocument();
  });
});
