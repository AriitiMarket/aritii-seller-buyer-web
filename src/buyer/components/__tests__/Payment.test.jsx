/**
 * CHECKOUT PAYMENT COMPONENT TESTS
 *
 * Covers the two things that can cost the platform money:
 *
 *  1. A double click must not create TWO orders (and two sets of payment
 *     rows). The guard has to be synchronous, because the button's `disabled`
 *     state only reaches the DOM on the next render.
 *  2. An order whose PAYMENT RECORD could not be created must not be
 *     reported as a successful order.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useDispatch: () => vi.fn(),
    useSelector: (selector) => selector({ user: { name: 'Buyer', phoneNumber: '0911' } }),
  };
});

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const { orderServiceMock, paymentServiceMock } = vi.hoisted(() => ({
  orderServiceMock: { createOrder: vi.fn() },
  paymentServiceMock: { getActiveMethods: vi.fn(), createPayment: vi.fn() },
}));

vi.mock('@/services', () => ({
  orderService: orderServiceMock,
  paymentService: paymentServiceMock,
}));

vi.mock('@/store/slices/cartThunks', () => ({ clearCart: vi.fn() }));

import Payment from '../Payment';

const checkoutSession = {
  cart: [{ productId: 'p1', name: 'Widget', quantity: 1, price: 600 }],
  shippingAddress: { city: 'Addis Ababa' },
  destination: {
    sectorId: 'sector-1',
    fullAddress: 'Bole, Addis Ababa',
    phone: '0911223344',
  },
  totalPrice: 600,
  subTotalPrice: 600,
  shipping: 0,
};

const renderPayment = () => {
  const store = configureStore({ reducer: { user: (state = { name: 'Buyer', phoneNumber: '0911' }) => state } });
  return render(
    <ReduxProvider store={store}>
      <MemoryRouter initialEntries={['/payment']}>
        <Payment />
      </MemoryRouter>
    </ReduxProvider>
  );
};

const confirmButton = () => screen.getByRole('button', { name: /confirm order/i });

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.setItem('latestOrder', JSON.stringify(checkoutSession));
  paymentServiceMock.getActiveMethods.mockResolvedValue([
    { key: 'COD', name: 'Cash on Delivery', availableFor: ['BUYERS'], status: 'ACTIVE' },
  ]);
  orderServiceMock.createOrder.mockResolvedValue([
    { _id: 'order-1', orderGroupId: 'group-1' },
  ]);
  paymentServiceMock.createPayment.mockResolvedValue({ _id: 'pay-1', status: 'PENDING' });
});

describe('Checkout payment', () => {
  it('creates one order and one payment record for the order', async () => {
    renderPayment();
    await waitFor(() => expect(confirmButton()).toBeEnabled());

    fireEvent.click(confirmButton());

    await waitFor(() => expect(orderServiceMock.createOrder).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(paymentServiceMock.createPayment).toHaveBeenCalledTimes(1));
    expect(paymentServiceMock.createPayment).toHaveBeenCalledWith('order-1', 'COD');
    expect(toast.success).toHaveBeenCalledWith('Order successful!');
  });

  it('does NOT create a second order when the button is clicked twice', async () => {
    // The order creation never resolves inside the test, so both clicks land
    // in the same window — exactly the race the guard has to close.
    let resolveCreate;
    orderServiceMock.createOrder.mockImplementation(
      () => new Promise((resolve) => { resolveCreate = resolve; })
    );

    renderPayment();
    await waitFor(() => expect(confirmButton()).toBeEnabled());

    const button = confirmButton();
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(orderServiceMock.createOrder).toHaveBeenCalledTimes(1);

    resolveCreate([{ _id: 'order-1', orderGroupId: 'group-1' }]);
    await waitFor(() => expect(paymentServiceMock.createPayment).toHaveBeenCalledTimes(1));
  });

  it('does not report success when the payment record could not be created', async () => {
    paymentServiceMock.createPayment.mockRejectedValue(new Error('Payment already exists for this order'));
    renderPayment();
    await waitFor(() => expect(confirmButton()).toBeEnabled());

    fireEvent.click(confirmButton());

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(toast.success).not.toHaveBeenCalled();
    expect(String(toast.error.mock.calls[0][0])).toMatch(/payment record could not be created/i);
  });

  it('reports a partial payment failure instead of claiming success', async () => {
    orderServiceMock.createOrder.mockResolvedValue([
      { _id: 'order-1', orderGroupId: 'group-1' },
      { _id: 'order-2', orderGroupId: 'group-1' },
    ]);
    paymentServiceMock.createPayment
      .mockResolvedValueOnce({ _id: 'pay-1', status: 'PENDING' })
      .mockRejectedValueOnce(new Error('boom'));

    renderPayment();
    await waitFor(() => expect(confirmButton()).toBeEnabled());

    fireEvent.click(confirmButton());

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(toast.success).not.toHaveBeenCalled();
    expect(String(toast.error.mock.calls[0][0])).toMatch(/1 of 2 orders/i);
  });

  it('surfaces the server error message when the order itself cannot be created', async () => {
    orderServiceMock.createOrder.mockRejectedValue(
      Object.assign(new Error('Request failed with status code 400'), {
        response: { data: { message: 'Your cart contains an unavailable product' } },
      })
    );
    renderPayment();
    await waitFor(() => expect(confirmButton()).toBeEnabled());

    fireEvent.click(confirmButton());

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Your cart contains an unavailable product')
    );
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('does not submit an incomplete checkout session', async () => {
    localStorage.setItem('latestOrder', JSON.stringify({ cart: [], totalPrice: 600 }));
    renderPayment();
    await waitFor(() => expect(screen.getByText(/no checkout session/i)).toBeInTheDocument());
    expect(orderServiceMock.createOrder).not.toHaveBeenCalled();
  });
});
