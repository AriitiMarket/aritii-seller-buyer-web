/**
 * PAYMENT API CLIENT TESTS
 *
 * These lock down WHICH endpoint each payment action reaches. The point is the
 * financial consequence of a wrong URL: `DELETE /payment/delete-payment/:id`
 * destroys a PAYMENT (a financial transaction record), so a "delete my payment
 * method" / "delete my payment account" action must never point at it.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '@/services/api';
import { paymentService } from '@/services/payment.service';
import sellerPaymentsService from '@/business/services/sellerPayments.service';

const mockSuccess = (data = {}) => Promise.resolve({ data: { success: true, ...data } });
const mockList = (name, items = []) => mockSuccess({ [name]: items });

const calledUrl = (method) => {
  const call = api[method].mock.calls[0];
  return call ? call[0] : null;
};

describe('payment.service — endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a payment for an order at the checkout endpoint', async () => {
    api.post.mockResolvedValueOnce(mockSuccess({ payment: { _id: 'pay-1' } }));
    await paymentService.createPayment('order-123', 'COD');
    expect(calledUrl('post')).toBe('/payment/create-payment');
    expect(api.post.mock.calls[0][1]).toEqual({
      orderId: 'order-123',
      paymentMethod: 'COD',
      metadata: {},
    });
  });

  it('reads a payment by id and by order', async () => {
    api.get.mockResolvedValueOnce(mockSuccess({ payment: { _id: 'pay-1' } }));
    await paymentService.getPaymentDetails('pay-1');
    expect(calledUrl('get')).toBe('/payment/get-payment/pay-1');

    vi.clearAllMocks();
    api.get.mockResolvedValueOnce(mockSuccess({ payment: { _id: 'pay-1' } }));
    await paymentService.getPaymentByOrder('order-1');
    expect(calledUrl('get')).toBe('/payment/get-payment-by-order/order-1');
  });

  it('reads the buyer transaction history', async () => {
    const mockResponse = mockList('payments', []);
    api.get.mockImplementation(() => mockResponse);
    const result = await paymentService.getBuyerPayments('buyer-1');
    console.log('api.get.mock.calls:', api.get.mock.calls);
    console.log('result:', result);
    expect(calledUrl('get')).toBe('/payment/get-user-payments/buyer-1');
  });

  it('reads the active settlement rails', async () => {
    api.get.mockResolvedValue(mockList('methods', []));
    await paymentService.getActiveMethods();
    expect(calledUrl('get')).toBe('/payment/get-active-methods');
  });

  it('exposes NO way for a buyer to delete a payment transaction', () => {
    expect(paymentService.deleteMethod).toBeUndefined();
  });

  it('never targets the payment-transaction delete endpoint', async () => {
    const names = Object.getOwnPropertyNames(Object.getPrototypeOf(paymentService))
      .concat(Object.getOwnPropertyNames(paymentService));
    expect(names.length).toBeGreaterThan(0);

    api.get.mockResolvedValue(mockList('methods', []));
    api.get.mockResolvedValue(mockList('accounts', []));
    api.get.mockResolvedValue(mockList('payments', []));
    api.get.mockResolvedValue(mockList('allocations', []));
    api.get.mockResolvedValue(mockList('payments', []));
    api.get.mockResolvedValue(mockSuccess({ payment: { _id: 'p1' } }));
    api.get.mockResolvedValue(mockSuccess({ payment: { _id: 'p1' } }));
    api.post.mockResolvedValue(mockSuccess({ payment: { _id: 'pay-1' } }));
    api.get.mockResolvedValue(mockSuccess({ ledger: {} }));
    api.post.mockResolvedValue(mockSuccess({ method: { _id: 'm1' } }));
    api.put.mockResolvedValue(mockSuccess({ method: { _id: 'm1' } }));

    await paymentService.getActiveMethods();
    await paymentService.getSellerAccounts();
    await paymentService.getSellerPayments('seller-1');
    await paymentService.getSellerAllocations('seller-1');
    await paymentService.getBuyerPayments('buyer-1');
    await paymentService.getPaymentDetails('p1');
    await paymentService.getPaymentByOrder('o1');
    await paymentService.createPayment('o1', 'COD');
    await paymentService.getPaymentLedger('p1');
    await paymentService.saveMethod({ name: 'X', key: 'X', providerKey: 'x' });
    await paymentService.updateMethod('m1', { status: 'INACTIVE' });

    const urls = ['get', 'post', 'put', 'delete'].flatMap((m) =>
      api[m].mock.calls.map((call) => call[0])
    );
    expect(urls.every((url) => !String(url).includes('/payment/delete-payment'))).toBe(true);
  });
});

describe('sellerPayments.service — endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes a seller payment ACCOUNT, not a payment transaction', async () => {
    api.delete.mockResolvedValueOnce(mockSuccess({}));
    await sellerPaymentsService.deletePaymentAccount('seller-1', 'acct-9');
    expect(calledUrl('delete')).toBe('/payment/seller/seller-1/payment-accounts/acct-9');
    expect(calledUrl('delete')).not.toContain('/payment/delete-payment');
  });

  it('reads and creates payment accounts on the account endpoints', async () => {
    api.get.mockResolvedValueOnce(mockList('accounts', []));
    await sellerPaymentsService.getPaymentAccounts();
    expect(calledUrl('get')).toBe('/payment/get-seller-accounts');

    vi.clearAllMocks();
    api.post.mockResolvedValueOnce(mockSuccess({ account: { _id: 'acct-9' } }));
    await sellerPaymentsService.createPaymentAccount('seller-1', { accountNumber: '1' });
    expect(calledUrl('post')).toBe('/payment/seller/seller-1/payment-accounts');
  });

  it('reads payouts and the wallet from their own endpoints', async () => {
    api.post.mockResolvedValueOnce(mockSuccess({ payout: { _id: 'po-1' } }));
    await sellerPaymentsService.requestPayout({ amount: 500 });
    expect(calledUrl('post')).toBe('/payout/request');

    vi.clearAllMocks();
    api.get.mockResolvedValueOnce(mockList('payouts', []));
    await sellerPaymentsService.getPayouts();
    expect(calledUrl('get')).toBe('/payout');

    vi.clearAllMocks();
    api.get.mockResolvedValueOnce(mockSuccess({ wallet: {} }));
    await sellerPaymentsService.getWalletDashboard('seller-1');
    expect(calledUrl('get')).toBe('/wallet/seller-1/dashboard');

    vi.clearAllMocks();
    api.get.mockResolvedValueOnce(mockList('transactions', []));
    await sellerPaymentsService.getWalletTransactions('seller-1');
    expect(calledUrl('get')).toBe('/wallet/seller-1/transactions');
  });
});
