/**
 * BUYER HEADER — SIGN OUT REGRESSION TEST
 *
 * The desktop "Account & Lists" dropdown used to declare its Sign Out row as
 * `{ label: 'Sign Out', onClick: null }` with no `to`. The renderer picks the
 * <Link> branch whenever `onClick` is falsy, and a <Link> without a target
 * resolves to the CURRENT route — so clicking "Sign Out" silently did nothing
 * and the user could never sign out from the buyer dashboard.
 *
 * These tests lock in that Sign Out is a real button wired to the logout
 * action, and that clicking it dispatches the logout thunk.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector) =>
      selector({ cart: [], products: {}, shop: {}, deliveryLocation: {} }),
  };
});

vi.mock('@/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/store/slices/userThunks', () => ({
  logoutUser: vi.fn(() => ({ type: 'LogoutRequest' })),
}));

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@/services/location.service', () => ({
  default: { listZones: vi.fn().mockResolvedValue([]) },
}));

vi.mock('@/app/providers/LayoutContext', () => ({
  useLayout: () => ({
    openLoginModal: vi.fn(),
    closeLoginModal: vi.fn(),
  }),
}));

import { useAuth } from '@/auth/hooks/useAuth';
import { logoutUser } from '@/store/slices/userThunks';
import BuyerHeader from '../BuyerHeader';

const renderHeader = (auth = { isAuthenticated: true, user: { name: 'Buyer' } }) => {
  (useAuth).mockReturnValue(auth);
  const store = configureStore({
    reducer: { cart: (state = []) => state },
  });
  return render(
    <ReduxProvider store={store}>
      <MemoryRouter initialEntries={['/my-dashboard/orders']}>
        <BuyerHeader />
      </MemoryRouter>
    </ReduxProvider>
  );
};

/** Open the desktop "Account & Lists" dropdown. */
const openAccountMenu = () => {
  fireEvent.click(screen.getByRole('button', { name: /account & lists/i }));
};

describe('BuyerHeader — sign out', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Sign Out as a button, not a link', () => {
    renderHeader();
    openAccountMenu();

    // A <Link> with no target resolves to the current route and does nothing
    // on click — that was the bug. It must be a real button.
    const signOut = screen.getByRole('button', { name: /sign out/i });
    expect(signOut.tagName).toBe('BUTTON');
    expect(signOut).toHaveAttribute('type', 'button');
  });

  it('dispatches the logout action when Sign Out is clicked', async () => {
    renderHeader();
    openAccountMenu();

    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalledTimes(1);
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('does not offer Sign Out to signed-out visitors', () => {
    renderHeader({ isAuthenticated: false, user: null });
    openAccountMenu();

    expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});