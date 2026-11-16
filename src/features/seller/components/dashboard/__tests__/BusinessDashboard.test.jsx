import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  DashboardGreeting,
  DashboardKPICards,
  DashboardStockAlerts,
  DashboardRecentOrders,
} from '../index';

describe('Decomposed Seller Dashboard Components', () => {
  it('renders DashboardGreeting with seller and shop details', () => {
    render(
      <DashboardGreeting
        seller={{ name: 'Abebe Bikila' }}
        shopName="Addis Craft Shop"
        hasMultipleShops={false}
      />
    );

    expect(screen.getByText(/Abebe Bikila/)).toBeInTheDocument();
    expect(screen.getByText(/Addis Craft Shop/)).toBeInTheDocument();
  });

  it('renders multi-shop selector when hasMultipleShops is true', () => {
    const selectShopMock = vi.fn();
    render(
      <DashboardGreeting
        seller={{ name: 'Abebe' }}
        shopName="Shop A"
        hasMultipleShops={true}
        shops={[
          { _id: 'shop-1', name: 'Shop A' },
          { _id: 'shop-2', name: 'Shop B' },
        ]}
        activeShopId="shop-1"
        selectShop={selectShopMock}
      />
    );

    expect(screen.getByText('Active shop:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('shop-1');
  });

  it('renders KPI metrics cards correctly', () => {
    render(
      <MemoryRouter>
        <DashboardKPICards
          totalProducts={42}
          totalOrders={120}
          totalRevenue="150000"
          pendingOrders={8}
          cancelledOrders={2}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Total Products')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('ETB 150000')).toBeInTheDocument();
    expect(screen.getByText('Pending Orders')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('renders stock alerts when out-of-stock or low-stock items exist', () => {
    render(
      <DashboardStockAlerts
        outOfStock={3}
        lowStockCount={5}
      />
    );

    expect(screen.getByText('Out of stock')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Low stock')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders recent orders list correctly', () => {
    const mockOrders = [
      {
        _id: 'order-12345678',
        user: { name: 'Almaz Ayana' },
        totalPrice: 4500,
        status: 'Delivered',
        cart: [{ quantity: 2 }],
        createdAt: new Date().toISOString(),
      },
    ];

    render(
      <MemoryRouter>
        <DashboardRecentOrders recentOrders={mockOrders} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Almaz Ayana/)).toBeInTheDocument();
    expect(screen.getByText(/4,500/)).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });
});
