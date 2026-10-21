import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../services/providerDeliveryApi', () => ({
  providerDeliveryApi: {
    getProviderBatches: vi.fn(),
    acceptBatch: vi.fn(),
    rejectDispatchBatch: vi.fn(),
  },
}));

import { providerDeliveryApi } from '../services/providerDeliveryApi';
import AvailableWork from './AvailableWork';

/**
 * A batch as the API returns it: `status` is the DISPLAY vocabulary
 * (AVAILABLE / IN_PROGRESS / …) and `originalStatus` is the service's own
 * (`waiting_acceptance`, `picking_up`, …).
 */
const batch = (id, originalStatus, overrides = {}) => ({
  id,
  _id: id,
  reference: `DL-${id}`,
  originalStatus,
  status: originalStatus === 'waiting_acceptance' ? 'AVAILABLE' : 'IN_PROGRESS',
  count: 1,
  assignments: [
    {
      _id: `${id}-delivery`,
      orderId: `${id}-order`,
      sellerName: 'Yihune Belay Sebsibe',
      buyerName: 'Yihune Belay Sebsibe',
      paymentMethod: 'COD',
      paymentAmount: 1675,
      pickupAddress: { cityName: 'Harar', addressDetail: 'Cheleleka, Harar' },
      dropoffAddress: { cityName: 'Harar', addressDetail: 'Belghis Mazmura, Harar' },
      status: 'assigned',
    },
  ],
  createdAt: new Date().toISOString(),
  ...overrides,
});

const renderPage = () => render(<MemoryRouter><AvailableWork /></MemoryRouter>);

describe('AvailableWork', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    providerDeliveryApi.getProviderBatches.mockResolvedValue({
      batches: [batch('a1', 'waiting_acceptance'), batch('b2', 'picking_up')],
      count: 2,
      totalPages: 1,
      supported: true,
    });
    providerDeliveryApi.acceptBatch.mockResolvedValue({ success: true });
    providerDeliveryApi.rejectDispatchBatch.mockResolvedValue({ success: true });
  });

  it('lists the batches that are waiting for the rider\'s response', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText(/Delivery Batch DL-a1/)).toBeInTheDocument());
    // The batch already in progress is not an offer — it must not be listed.
    expect(screen.queryByText(/Delivery Batch DL-b2/)).not.toBeInTheDocument();
    expect(screen.getByText(/1 assignment waiting for your response/i)).toBeInTheDocument();
  });

  it('shows the pickup and the destination of the offered work', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText(/Cheleleka, Harar/)).toBeInTheDocument());
    expect(screen.getByText(/Belghis Mazmura, Harar/)).toBeInTheDocument();
    // The shop the parcel is collected from, and the buyer it goes to.
    expect(screen.getAllByText(/Yihune Belay Sebsibe/).length).toBeGreaterThan(0);
  });

  it('accepts an offered batch', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText(/Delivery Batch DL-a1/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /accept/i }));
    await waitFor(() => expect(providerDeliveryApi.acceptBatch).toHaveBeenCalledWith('a1'));
  });

  it('declines an offered batch', async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText(/Delivery Batch DL-a1/)).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: /decline/i }));
    await waitFor(() => expect(providerDeliveryApi.rejectDispatchBatch).toHaveBeenCalledWith('a1', expect.any(String)));
  });

  it('explains an empty queue instead of failing', async () => {
    providerDeliveryApi.getProviderBatches.mockResolvedValue({ batches: [], count: 0, supported: true });
    renderPage();
    await waitFor(() => expect(screen.getByText(/No available assignments/i)).toBeInTheDocument());
  });
});
