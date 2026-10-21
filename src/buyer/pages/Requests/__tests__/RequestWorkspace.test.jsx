import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { toast } from 'react-toastify';

vi.mock('@/services/request.service', () => ({
  default: {
    get: vi.fn(),
    getMessages: vi.fn(),
    acceptOffer: vi.fn(),
    confirmAgreement: vi.fn(),
    sendMessage: vi.fn(),
  },
}));
vi.mock('@/services/shop.service', () => ({ default: { getPublicById: vi.fn() } }));
vi.mock('@/services', () => ({ addressService: { getAll: vi.fn() } }));
vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() } }));
vi.mock('@/features/product-requests', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ActivityTimeline: () => null,
    AttachmentGallery: () => null,
    DiscussionThread: () => null,
    OfferCard: () => null,
    ParticipantCard: () => null,
    RequestSummary: () => null,
    useRequestEvents: () => {},
  };
});
vi.mock('@/components/common/Modal', () => ({ default: ({ open, children }) => open ? <div>{children}</div> : null }));
vi.mock('@/components/common/Button', () => ({
  default: ({ children, onClick, disabled, className }) => (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>{children}</button>
  ),
}));
vi.mock('@/components/common/Loading', () => ({ default: () => <p>Loading</p> }));
vi.mock('@/components/common/EmptyState', () => ({ default: ({ title }) => <p>{title}</p> }));

import requestService from '@/services/request.service';
import RequestWorkspacePage from '../RequestWorkspace';

const sellerConfirmedRequest = {
  _id: 'request-1',
  buyerId: 'buyer-1',
  sellerId: 'seller-1',
  status: 'AGREED',
  title: 'Bulk coffee beans',
  quantity: 20,
  offers: [{ _id: 'offer-1', status: 'ACCEPTED', quantity: 20, unitPrice: 120, totalPrice: 2400, unit: 'Kg' }],
  agreement: {
    terms: { productName: 'Coffee beans', quantity: 20, unit: 'Kg', unitPrice: 120, totalPrice: 2400 },
    buyerConfirmedAt: null,
    sellerConfirmedAt: '2026-10-20T09:00:00.000Z',
    confirmedAt: null,
  },
  createdAt: '2026-10-20T08:00:00.000Z',
  updatedAt: '2026-10-20T09:00:00.000Z',
};

function renderWorkspace(request = sellerConfirmedRequest) {
  requestService.get.mockResolvedValue(request);
  requestService.getMessages.mockResolvedValue([]);
  const store = configureStore({
    reducer: (state = { user: { user: { id: 'buyer-1', name: 'Buyer' } } }) => state,
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/my-dashboard/requests/request-1']}>
        <Routes>
          <Route path="/my-dashboard/requests/:id" element={<RequestWorkspacePage />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe('buyer request agreement flow', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it('lets the buyer confirm after the seller has confirmed an agreed offer', async () => {
    const completed = {
      ...sellerConfirmedRequest,
      agreement: { ...sellerConfirmedRequest.agreement, buyerConfirmedAt: '2026-10-20T09:05:00.000Z', confirmedAt: '2026-10-20T09:05:00.000Z' },
    };
    requestService.confirmAgreement.mockResolvedValue(completed);

    renderWorkspace();
    await screen.findAllByText('Bulk coffee beans');
    fireEvent.click(screen.getByRole('tab', { name: /agreement/i }));
    const confirmButton = await screen.findByRole('button', { name: 'Confirm Agreement' });
    fireEvent.click(confirmButton);

    await waitFor(() => expect(requestService.confirmAgreement).toHaveBeenCalledWith('request-1'));
    expect(await screen.findByText('Agreement confirmed')).toBeInTheDocument();
    expect(requestService.get).toHaveBeenCalledTimes(1);
  });

  it('records buyer acceptance as buyer confirmation and explains the seller action', async () => {
    const openRequest = {
      ...sellerConfirmedRequest,
      status: 'NEGOTIATING',
      agreement: { terms: null, buyerConfirmedAt: null, sellerConfirmedAt: null, confirmedAt: null },
      offers: [{ _id: 'offer-1', status: 'ACTIVE', quantity: 20, unitPrice: 120, totalPrice: 2400, unit: 'Kg' }],
    };
    const accepted = {
      ...openRequest,
      status: 'AGREED',
      offers: [{ ...openRequest.offers[0], status: 'ACCEPTED' }],
      agreement: { terms: openRequest.offers[0], buyerConfirmedAt: '2026-10-20T09:05:00.000Z', sellerConfirmedAt: null, confirmedAt: null },
    };
    requestService.get.mockResolvedValue(openRequest);
    requestService.acceptOffer.mockResolvedValue(accepted);

    renderWorkspace(openRequest);
    const acceptButtons = await screen.findAllByRole('button', { name: 'Accept Offer' });
    fireEvent.click(acceptButtons[0]);

    await waitFor(() => expect(requestService.acceptOffer).toHaveBeenCalledWith('request-1'));
    expect(toast.success).toHaveBeenCalledWith(expect.stringMatching(/your confirmation is recorded/i));
    expect(await screen.findByText(/already confirmed — waiting for the seller/i)).toBeInTheDocument();
  });
});
