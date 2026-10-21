import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Same mocking style as the other business tests: feed the selector a fixed
// redux state per test through `stateOverride`.
let stateOverride = {};
vi.mock('react-redux', () => ({
  useDispatch: () => vi.fn(),
  useSelector: (selector) => selector(stateOverride),
}));

import Customers from '../Customers';
import AllRefundOrders from '@/business/components/AllRefundOrders';

const baseOrder = {
  _id: 'o1',
  totalPrice: 100,
  cart: [{ productId: 'p1' }],
  status: 'Processing',
};

describe('Customers page — one entry per buyer (no duplicates)', () => {
  beforeEach(() => cleanup());

  it('merges orders from the same buyer even when the id shape differs', () => {
    stateOverride = {
      seller: { seller: { id: 'seller-1' } },
      order: {
        isLoading: false,
        ShopOrders: [
          {
            ...baseOrder,
            _id: 'o1',
            buyerId: 'b1',
            user: { id: 'b1', _id: 'b1', name: 'Abebe', email: 'abebe@x.com', phoneNumber: '0911111111' },
            destination: { phone: '0911111111', fullAddress: 'Bole, Addis' },
            createdAt: '2026-01-01T10:00:00.000Z',
          },
          {
            // Same buyer, but no top-level buyerId — only the user snapshot.
            ...baseOrder,
            _id: 'o2',
            totalPrice: 50,
            user: { id: 'b1', _id: 'b1', name: 'Abebe B', email: 'abebe@x.com' },
            destination: { phone: '0922222222', fullAddress: 'Bole, Addis' },
            createdAt: '2026-01-02T10:00:00.000Z',
          },
          {
            ...baseOrder,
            _id: 'o3',
            totalPrice: 75,
            buyerId: 'b2',
            user: { _id: 'b2', name: 'Kebede', email: 'kebede@x.com' },
            shippingAddress: { phone: '0933333333' },
            createdAt: '2026-01-03T10:00:00.000Z',
          },
        ],
      },
    };

    render(<Customers />);

    // 3 orders, 2 distinct buyers → 2 customer rows.
    expect(screen.getByText(/Showing 2 of 2 customers/)).toBeInTheDocument();

    // Order-count and spend are merged onto the single Abebe row.
    expect(screen.getAllByText('Abebe B').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Kebede').length).toBeGreaterThan(0);

    // The newest order refreshes the stored contact snapshot (phone 0922…),
    // older orders only fill gaps (Kebede falls back to shippingAddress.phone).
    expect(screen.getAllByText('0922222222').length).toBeGreaterThan(0);
    expect(screen.getAllByText('0933333333').length).toBeGreaterThan(0);
  });
});

describe('Refunds page — history of buyer-requested refunds only', () => {
  beforeEach(() => cleanup());

  it('lists refund-state orders and hides plain delivered/processing orders', () => {
    stateOverride = {
      seller: { seller: { id: 'seller-1' } },
      order: {
        isLoading: false,
        ShopOrders: [
          { ...baseOrder, _id: 'r1', status: 'Refund Requested' },
          { ...baseOrder, _id: 'r2', status: 'REFUND APPROVED' }, // legacy spelling
          { ...baseOrder, _id: 'r3', status: 'Refund Success' },
          { ...baseOrder, _id: 'r4', status: 'Delivered' }, // NOT a refund
          { ...baseOrder, _id: 'r5', status: 'Processing' }, // NOT a refund
        ],
      },
    };

    // The row action column renders a react-router <Link>.
    render(
      <MemoryRouter>
        <AllRefundOrders />
      </MemoryRouter>
    );

    expect(screen.getByText('Refund Requested')).toBeInTheDocument();
    expect(screen.getByText('Refund Approved')).toBeInTheDocument();
    expect(screen.getByText('Refund Success')).toBeInTheDocument();
    expect(screen.queryByText('Delivered')).not.toBeInTheDocument();
    expect(screen.queryByText('Processing')).not.toBeInTheDocument();
  });
});
