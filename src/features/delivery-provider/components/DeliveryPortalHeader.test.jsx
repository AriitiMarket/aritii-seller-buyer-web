import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from '@reduxjs/toolkit';

vi.mock('@/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useDispatch: vi.fn(() => vi.fn()),
    useSelector: vi.fn((selector) => selector({})),
  };
});

import { useAuth } from '@/auth/hooks/useAuth';
import DeliveryPortalHeader from './DeliveryPortalHeader';

const renderHeader = (auth = {}) => {
  const store = createStore(() => ({}));
  const utils = render(
    <ReduxProvider store={store}>
      <MemoryRouter initialEntries={['/delivery']}>
        <DeliveryPortalHeader />
      </MemoryRouter>
    </ReduxProvider>
  );
  return utils;
};

const openAccountMenu = () => {
  // Both desktop and mobile variants render an "Account menu" button; click
  // the first visible one to open the account dropdown.
  const btns = screen.getAllByLabelText(/Account menu/i);
  fireEvent.click(btns[0]);
};

describe('DeliveryPortalHeader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the delivery portal identity and main navigation', () => {
    (useAuth).mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
      logout: vi.fn(),
    });

    renderHeader();
    expect(screen.getByText(/Delivery Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Services/i)).toBeInTheDocument();
    expect(screen.getByText(/Operating Areas/i)).toBeInTheDocument();
  });

  it('shows sign-in and register links for unauthenticated users', () => {
    (useAuth).mockReturnValue({
      isAuthenticated: false,
      loading: false,
      user: null,
      logout: vi.fn(),
    });

    renderHeader();
    openAccountMenu();
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/Register as delivery provider/i)).toBeInTheDocument();
  });

  it('does not show register link when authenticated', () => {
    (useAuth).mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { capabilities: ['BUYER'] },
      logout: vi.fn(),
    });

    renderHeader();
    expect(screen.queryByText(/Register as delivery provider/i)).not.toBeInTheDocument();
    openAccountMenu();
    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();
  });

  it('renders nothing while auth is loading', () => {
    (useAuth).mockReturnValue({
      isAuthenticated: false,
      loading: true,
      user: null,
      logout: vi.fn(),
    });

    const { container } = renderHeader();
    expect(container.querySelector('header')).toBeNull();
  });
});
