import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductListItem from '../ProductListItem';
import LayoutContext from '@/app/providers/LayoutContext';

vi.mock('@/components/common/ImageWithFallback', () => ({
  ProductImage: () => <div data-testid="product-image" />,
}));

vi.mock('@/components/common/Ratings', () => ({
  default: () => <div data-testid="ratings" />,
}));

const mockProduct = {
  _id: 'prod-test-2',
  name: 'Dire Dawa Spices Mix',
  price: 450,
  stock: 15,
  shop: { _id: 'shop-dd-1', name: 'Sabian Spice Market' },
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

describe('ProductListItem authentication & variant behavior', () => {
  it('shows "Add to cart" when user is unauthenticated and variant="public"', () => {
    const openLoginModal = vi.fn();
    const store = createMockStore(false);

    render(
      <ReduxProvider store={store}>
        <LayoutContext.Provider value={{ openLoginModal }}>
          <MemoryRouter>
            <ProductListItem data={mockProduct} variant="public" />
          </MemoryRouter>
        </LayoutContext.Provider>
      </ReduxProvider>
    );

    const addToCartBtn = screen.getByRole('button', { name: /add dire dawa spices mix to cart/i });
    expect(addToCartBtn).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign in to buy/i })).not.toBeInTheDocument();
  });

  it('shows "Add to cart" and NOT "Sign in to buy" when buyer IS logged in, even if variant="public" is passed', () => {
    const openLoginModal = vi.fn();
    const store = createMockStore(true);

    render(
      <ReduxProvider store={store}>
        <LayoutContext.Provider value={{ openLoginModal }}>
          <MemoryRouter>
            <ProductListItem data={mockProduct} variant="public" />
          </MemoryRouter>
        </LayoutContext.Provider>
      </ReduxProvider>
    );

    const addToCartBtn = screen.getByRole('button', { name: /add dire dawa spices mix to cart/i });
    expect(addToCartBtn).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign in to buy/i })).not.toBeInTheDocument();

    const wishlistBtn = screen.getByLabelText(/save to wishlist/i);
    expect(wishlistBtn).toBeInTheDocument();
  });
});
