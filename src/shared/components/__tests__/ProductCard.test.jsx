import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductCard from '../ProductCard';
import LayoutContext from '@/app/providers/LayoutContext';

vi.mock('@/components/common/ImageWithFallback', () => ({
  ProductImage: () => <div data-testid="product-image" />,
}));

vi.mock('@/components/common/Ratings', () => ({
  default: () => <div data-testid="ratings" />,
}));

const mockProduct = {
  _id: 'prod-test-1',
  name: 'Harar Coffee Beans 1kg',
  price: 850,
  stock: 20,
  shop: { _id: 'shop-harar-1', name: 'Harar Heritage Coffee' },
};

const createMockStore = (isAuthenticated = false) => {
  return configureStore({
    reducer: {
      user: () => ({ isAuthenticated, user: isAuthenticated ? { id: 'buyer-1' } : null }),
      wishlist: () => ({ wishlist: [] }),
      cart: () => ({ cart: [] }),
    },
  });
};

describe('ProductCard authentication & variant behavior', () => {
  it('shows "Add to Cart" and allows adding to cart when user is unauthenticated and variant="public"', () => {
    const openLoginModal = vi.fn();
    const store = createMockStore(false);

    render(
      <ReduxProvider store={store}>
        <LayoutContext.Provider value={{ openLoginModal }}>
          <MemoryRouter>
            <ProductCard data={mockProduct} variant="public" />
          </MemoryRouter>
        </LayoutContext.Provider>
      </ReduxProvider>
    );

    const addToCartBtn = screen.getByRole('button', { name: /add harar coffee beans 1kg to cart/i });
    expect(addToCartBtn).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign in to buy/i })).not.toBeInTheDocument();
  });

  it('shows "Add to Cart" and NOT "Sign in to buy" when buyer IS logged in, even if variant="public" is passed', () => {
    const openLoginModal = vi.fn();
    const store = createMockStore(true);

    render(
      <ReduxProvider store={store}>
        <LayoutContext.Provider value={{ openLoginModal }}>
          <MemoryRouter>
            <ProductCard data={mockProduct} variant="public" />
          </MemoryRouter>
        </LayoutContext.Provider>
      </ReduxProvider>
    );

    const addToCartBtn = screen.getByRole('button', { name: /add harar coffee beans 1kg to cart/i });
    expect(addToCartBtn).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign in to buy/i })).not.toBeInTheDocument();

    // Wishlist button should also be visible for logged in buyer
    const wishlistBtn = screen.getByLabelText(/save to wishlist/i);
    expect(wishlistBtn).toBeInTheDocument();
  });

  it('shows "Add to Cart" when buyer is logged in with default variant', () => {
    const store = createMockStore(true);

    render(
      <ReduxProvider store={store}>
        <LayoutContext.Provider value={{ openLoginModal: vi.fn() }}>
          <MemoryRouter>
            <ProductCard data={mockProduct} variant="default" />
          </MemoryRouter>
        </LayoutContext.Provider>
      </ReduxProvider>
    );

    expect(screen.getByRole('button', { name: /add harar coffee beans 1kg to cart/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign in to buy/i })).not.toBeInTheDocument();
  });
});
