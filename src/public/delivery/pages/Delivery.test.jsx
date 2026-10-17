import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from '@reduxjs/toolkit';

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('@/features/delivery-provider/components/DeliveryPortalHeader', () => ({
  default: () => null,
}));

vi.mock('@/public/delivery/components/DeliveryFlowVisual', () => ({
  default: () => null,
}));

vi.mock('@/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

import DeliveryPage from './Delivery';
import api from '@/services/api';
import { useAuth } from '@/auth/hooks/useAuth';

const renderPage = (auth = {}, apiGet = {}) => {
  const store = createStore(() => ({}));
  const utils = render(
    <ReduxProvider store={store}>
      <MemoryRouter initialEntries={['/delivery']}>
        <DeliveryPage />
      </MemoryRouter>
    </ReduxProvider>
  );
  return utils;
};

describe('DeliveryPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the hero heading and primary CTAs', () => {
    (useAuth).mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });
    (api.get).mockResolvedValue({ data: { hierarchy: [] } });

    renderPage();
    expect(
      screen.getByText(/Deliver Locally\. Grow with Ariiti Market\./i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Get Started/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Sign In/i).length).toBeGreaterThanOrEqual(1);
    // skipAuth is passed so no token is attached for unauthenticated visitors
    expect(api.get).toHaveBeenCalledWith(
      '/delivery/location/hierarchy',
      expect.objectContaining({ skipAuth: true })
    );
  });

  it('renders the main content sections', () => {
    (useAuth).mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });
    (api.get).mockResolvedValue({ data: { hierarchy: [] } });

    renderPage();
    expect(screen.getByText(/How Delivery Works/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivery Services/i)).toBeInTheDocument();
    expect(screen.getByText(/Why Deliver with Ariiti Market\?/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Operating Areas/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Getting Started/i)).toBeInTheDocument();
    expect(screen.getByText(/Help & Support/i)).toBeInTheDocument();
  });

  it('shows a loading state while operating areas load', () => {
    (useAuth).mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });
    (api.get).mockReturnValue(new Promise(() => {}));

    renderPage();
    expect(screen.getByText(/Loading operating areas/i)).toBeInTheDocument();
  });
});
