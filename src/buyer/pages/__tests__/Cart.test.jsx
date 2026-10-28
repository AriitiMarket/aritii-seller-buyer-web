import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import BuyerCartPage from '../Cart';
import { cartReducer } from '@/store/slices/cartSlice';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/components/common/ImageWithFallback', () => ({
  ProductImage: () => <div data-testid="product-image" />,
}));

vi.mock('@/shared/hooks/useDeliveryLocation', () => ({
  useDeliveryLocation: () => ({
    zoneId: 'zone-1',
    zoneName: 'Bole',
    cityName: 'Addis Ababa',
    hasZone: true,
    setLocation: vi.fn(),
  }),
}));

vi.mock('@/shared/utils/deliveryPricing', () => ({
  money2: (v) => Number(v || 0),
  quoteCartDelivery: vi.fn().mockResolvedValue({
    quotes: {},
    total: 50,
    error: '',
    eta: { text: 'Delivery in 1 day' },
  }),
}));

vi.mock('@/services', () => ({
  shopService: {
    getPublicById: vi.fn().mockResolvedValue({ name: 'Fresh Goods' }),
  },
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockCartItem = {
  productId: 'prod-item-1',
  _id: 'prod-item-1',
  name: 'Organic Honey 500g',
  price: 320,
  quantity: 2,
  shopId: 'shop-1',
  shopName: 'Fresh Goods',
};

const createMockStore = ({ isAuthenticated = false, cart = [mockCartItem], error = null } = {}) => {
  return configureStore({
    reducer: {
      user: () => ({ isAuthenticated, user: isAuthenticated ? { id: 'buyer-1' } : null }),
      cart: cartReducer,
    },
    preloadedState: {
      user: { isAuthenticated, user: isAuthenticated ? { id: 'buyer-1' } : null },
      cart: { cart, isLoading: false, error },
    },
  });
};

describe('BuyerCartPage Guest and Authenticated behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('allows unauthenticated guest to view cart items and redirects to /login on checkout', () => {
    localStorage.setItem('cartItems', JSON.stringify([mockCartItem]));
    const store = createMockStore({ isAuthenticated: false, cart: [mockCartItem] });

    render(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <BuyerCartPage />
        </MemoryRouter>
      </ReduxProvider>
    );

    expect(screen.getByText('Organic Honey 500g')).toBeInTheDocument();
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();

    const checkoutBtn = screen.getByRole('button', { name: /sign in to checkout/i });
    expect(checkoutBtn).toBeInTheDocument();

    fireEvent.click(checkoutBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/login', {
      state: { from: '/checkout' },
    });
  });

  it('navigates directly to /checkout when user is authenticated', () => {
    localStorage.setItem('cartItems', JSON.stringify([mockCartItem]));
    const store = createMockStore({ isAuthenticated: true, cart: [mockCartItem] });

    render(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <BuyerCartPage />
        </MemoryRouter>
      </ReduxProvider>
    );

    const checkoutBtn = screen.getByRole('button', { name: /proceed to checkout/i });
    expect(checkoutBtn).toBeInTheDocument();

    fireEvent.click(checkoutBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });

  it('renders responsive error banner when cartError exists and allows dismissing it', () => {
    localStorage.setItem('cartItems', JSON.stringify([mockCartItem]));
    const store = createMockStore({ isAuthenticated: false, cart: [mockCartItem], error: 'Out of stock limit reached' });

    render(
      <ReduxProvider store={store}>
        <MemoryRouter>
          <BuyerCartPage />
        </MemoryRouter>
      </ReduxProvider>
    );

    expect(screen.getByText('Out of stock limit reached')).toBeInTheDocument();
    const dismissBtn = screen.getByRole('button', { name: /dismiss error/i });
    expect(dismissBtn).toBeInTheDocument();

    fireEvent.click(dismissBtn);
    expect(screen.queryByText('Out of stock limit reached')).not.toBeInTheDocument();
  });
});
