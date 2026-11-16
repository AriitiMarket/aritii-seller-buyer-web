import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  BuyerWelcomeBanner,
  BuyerQuickStats,
  BuyerActiveOrdersList,
} from '../components';

describe('Decomposed Buyer Dashboard Components', () => {
  it('renders BuyerWelcomeBanner with active orders banner when active orders exist', () => {
    render(
      <MemoryRouter>
        <BuyerWelcomeBanner
          user={{ name: 'Haile Gebrselassie' }}
          activeOrdersCount={2}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Hi, Haile')).toBeInTheDocument();
    expect(screen.getByText(/You have 2 active orders in progress/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Orders/i })).toBeInTheDocument();
  });

  it('renders BuyerWelcomeBanner discovery message when no active orders exist', () => {
    render(
      <MemoryRouter>
        <BuyerWelcomeBanner
          user={{ name: 'Haile Gebrselassie' }}
          activeOrdersCount={0}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Hi, Haile')).toBeInTheDocument();
    expect(screen.getByText(/Discover products from trusted Ethiopian shops/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Browse Products/i })).toBeInTheDocument();
  });

  it('renders quick stats grid with accurate order and cart numbers', () => {
    render(
      <MemoryRouter>
        <BuyerQuickStats
          totalOrders={15}
          inTransitCount={2}
          cartCount={4}
          savedItemsCount={9}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getAllByText('In Transit').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Cart Items')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('Saved Items')).toBeInTheDocument();
  });

  it('renders active orders stepper and details accurately', () => {
    const mockOrders = [
      {
        _id: 'ord-87654321',
        orderStatus: 'In Transit',
        totalPrice: 2800,
        items: [{ name: 'Handwoven Scarf', quantity: 1, shopName: 'Selam Weaving' }],
      },
    ];

    render(
      <MemoryRouter>
        <BuyerActiveOrdersList activeOrders={mockOrders} />
      </MemoryRouter>
    );

    expect(screen.getByText('Active Orders')).toBeInTheDocument();
    expect(screen.getByText(/Selam Weaving/)).toBeInTheDocument();
    expect(screen.getByText(/Handwoven Scarf/)).toBeInTheDocument();
    expect(screen.getAllByText('In Transit').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('75% Complete')).toBeInTheDocument();
  });
});
