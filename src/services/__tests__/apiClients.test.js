import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { toast } from 'react-toastify';
import { tokenStore } from '@/services/tokenStore';
import {
  buyerApiClient,
  sellerApiClient,
  deliveryApiClient,
  createPortalApiClient,
  notifyUnauthorized,
} from '@/services/apiClients';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

describe('Dedicated Portal API Clients', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tokenStore.clear();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('instantiates isolated clients with domain-specific headers', () => {
    expect(buyerApiClient).toBeDefined();
    expect(sellerApiClient).toBeDefined();
    expect(deliveryApiClient).toBeDefined();

    expect(buyerApiClient.defaults.headers['X-Client-Portal']).toBe('buyer');
    expect(sellerApiClient.defaults.headers['X-Client-Portal']).toBe('seller');
    expect(deliveryApiClient.defaults.headers['X-Client-Portal']).toBe('delivery');
  });

  it('automatically attaches Bearer token from tokenStore in request interceptor', async () => {
    tokenStore.setTokens({
      access_token: 'mock-jwt-token-buyer-123',
      refresh_token: 'mock-refresh-token-456',
    });

    const client = createPortalApiClient('Buyer', { enableToast: false });
    const requestHandler = client.interceptors.request.handlers[0].fulfilled;

    const config = await requestHandler({ headers: {} });
    expect(config.headers.Authorization).toBe('Bearer mock-jwt-token-buyer-123');
  });

  it('does not overwrite existing Authorization header if already present', async () => {
    tokenStore.setTokens({
      access_token: 'mock-jwt-token-buyer-123',
    });

    const client = createPortalApiClient('Buyer', { enableToast: false });
    const requestHandler = client.interceptors.request.handlers[0].fulfilled;

    const config = await requestHandler({
      headers: { Authorization: 'Custom-Auth-Header' },
    });
    expect(config.headers.Authorization).toBe('Custom-Auth-Header');
  });

  it('bypasses token injection if skipAuth is set', async () => {
    tokenStore.setTokens({
      access_token: 'mock-jwt-token-buyer-123',
    });

    const client = createPortalApiClient('Buyer', { enableToast: false });
    const requestHandler = client.interceptors.request.handlers[0].fulfilled;

    const config = await requestHandler({
      headers: {},
      skipAuth: true,
    });
    expect(config.headers.Authorization).toBeUndefined();
  });

  it('triggers toast.error on 403 Forbidden responses', async () => {
    const client = createPortalApiClient('Seller');
    const responseErrorHandler = client.interceptors.response.handlers[0].rejected;

    const error403 = {
      config: {},
      response: {
        status: 403,
        data: { message: 'Merchant not approved to edit this inventory.' },
      },
    };

    await expect(responseErrorHandler(error403)).rejects.toEqual(error403);
    expect(toast.error).toHaveBeenCalledWith(
      'Merchant not approved to edit this inventory.',
      expect.objectContaining({ toastId: 'http-403-Seller' })
    );
  });

  it('triggers toast.error on 500 Server Error responses with portal context', async () => {
    const client = createPortalApiClient('Delivery');
    const responseErrorHandler = client.interceptors.response.handlers[0].rejected;

    const error500 = {
      config: {},
      response: {
        status: 500,
        data: { message: 'Database query timeout.' },
      },
    };

    await expect(responseErrorHandler(error500)).rejects.toEqual(error500);
    expect(toast.error).toHaveBeenCalledWith(
      'Database query timeout.',
      expect.objectContaining({ toastId: 'http-500-Delivery' })
    );
  });

  it('suppresses toast.error when skipToast or silent flag is passed on request', async () => {
    const client = createPortalApiClient('Buyer');
    const responseErrorHandler = client.interceptors.response.handlers[0].rejected;

    const error500Silent = {
      config: { skipToast: true },
      response: {
        status: 500,
        data: { message: 'Silent failure' },
      },
    };

    await expect(responseErrorHandler(error500Silent)).rejects.toEqual(error500Silent);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('triggers toast.error on network error when no response is received', async () => {
    const client = createPortalApiClient('Buyer');
    const responseErrorHandler = client.interceptors.response.handlers[0].rejected;

    const networkError = {
      config: {},
      message: 'Network Error',
    };

    await expect(responseErrorHandler(networkError)).rejects.toEqual(networkError);
    expect(toast.error).toHaveBeenCalledWith(
      'Network connection error. Please verify your connection.',
      expect.objectContaining({ toastId: 'http-network-error' })
    );
  });

  it('handles 401 unauthorized session termination and dispatches auth:unauthorized event', () => {
    const eventSpy = vi.fn();
    window.addEventListener('auth:unauthorized', eventSpy);

    tokenStore.setTokens({
      access_token: 'expired-access-token',
      refresh_token: 'expired-refresh-token',
    });
    localStorage.setItem('token', 'expired-token');
    localStorage.setItem('cartItems', JSON.stringify([{ id: 1 }]));

    notifyUnauthorized();

    expect(tokenStore.getAccessToken()).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('cartItems')).toBeNull();
    expect(eventSpy).toHaveBeenCalledTimes(1);

    window.removeEventListener('auth:unauthorized', eventSpy);
  });
});
