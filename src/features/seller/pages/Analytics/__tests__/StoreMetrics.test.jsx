import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  MetricCard,
  StoreMetricsKPIGrid,
  StoreMetricsLowStockAlerts,
  StoreMetricsInventoryAndBestsellers,
} from '../components';

describe('Decomposed Store Metrics Components', () => {
  it('renders MetricCard with label, value, sub, and tone', () => {
    render(
      <MetricCard
        label="Net Revenue"
        value="ETB 85,000"
        sub="30-day window"
        tone="green"
      />
    );

    expect(screen.getByText('Net Revenue')).toBeInTheDocument();
    expect(screen.getByText('ETB 85,000')).toBeInTheDocument();
    expect(screen.getByText('30-day window')).toBeInTheDocument();
  });

  it('renders StoreMetricsKPIGrid with computed analytics values', () => {
    render(
      <StoreMetricsKPIGrid
        revenue={125000}
        windowOrdersCount={48}
        completedOrdersCount={40}
        productsCount={22}
        totalStockUnits={310}
        uniqueCustomers={35}
      />
    );

    expect(screen.getByText('ETB 125,000')).toBeInTheDocument();
    expect(screen.getByText('48')).toBeInTheDocument();
    expect(screen.getByText('22')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
  });

  it('renders low stock alert cards when low stock products exist', () => {
    const lowStock = [
      { _id: 'prod-1', name: 'Coffee Beans 1kg', stock: 3 },
      { _id: 'prod-2', name: 'Clay Jebena', stock: 1 },
    ];

    render(<StoreMetricsLowStockAlerts lowStock={lowStock} />);

    expect(screen.getByText('Low Stock Alerts (2)')).toBeInTheDocument();
    expect(screen.getByText('Coffee Beans 1kg')).toBeInTheDocument();
    expect(screen.getByText('3 units remaining')).toBeInTheDocument();
    expect(screen.getByText('Clay Jebena')).toBeInTheDocument();
    expect(screen.getByText('1 units remaining')).toBeInTheDocument();
  });

  it('renders inventory snapshot and best sellers table', () => {
    const bestSellers = [
      { name: 'Organic Honey', quantity: 25, revenue: 12500 },
    ];

    render(
      <StoreMetricsInventoryAndBestsellers
        bestSellers={bestSellers}
        totalStockUnits={180}
        lowStockCount={2}
        outOfStockCount={1}
      />
    );

    expect(screen.getByText('Top Selling Products')).toBeInTheDocument();
    expect(screen.getByText('Organic Honey')).toBeInTheDocument();
    expect(screen.getByText(/25 sold/)).toBeInTheDocument();
    expect(screen.getByText('Inventory Snapshot')).toBeInTheDocument();
    expect(screen.getByText('180')).toBeInTheDocument();
  });
});
