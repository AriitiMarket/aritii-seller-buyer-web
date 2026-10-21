import api from './api';

/**
 * BaseService - All feature services must extend this class.
 * Uses the SINGLE centralized axios client with interceptors.
 * Never create new axios instances in feature services.
 */
export class BaseService {
  constructor() {
    this.api = api;
  }

  /**
   * Handle API response - extract data from success envelope
   * Backend returns: { success: true, data: ..., pagination?: ..., total?: ... }
   */
  extractData(response) {
    const payload = response.data;
    if (!payload?.success) {
      throw new Error(response.data?.message || 'Request failed');
    }
    // Newer services spread named fields beside `success` (for example
    // `{ success: true, payments: [...] }`); older handlers use `{ data: ... }`.
    return Object.prototype.hasOwnProperty.call(payload, 'data')
      ? payload.data
      : payload;
  }

  /**
   * Extract a NAMED collection from the response envelope.
   *
   * List endpoints answer with `{ success: true, <name>: [...] }` — for
   * example `{ success: true, methods: [...] }` or
   * `{ success: true, allocations: [...] }`. `extractData` returns that whole
   * envelope, so a caller expecting an array would break. This helper pulls
   * the named array out (falling back to `data` and then to an empty array).
   */
  extractList(response, name) {
    const payload = this.extractData(response);
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload[name])) return payload[name];
    if (payload && Array.isArray(payload.data)) return payload.data;
    return [];
  }

  /**
   * GET a list endpoint and return the named collection.
   * Backend shape: { success: true, <name>: [...] }
   */
  getList(url, name, params = {}) {
    return this.api.get(url, { params }).then((response) =>
      this.extractList(response, name)
    );
  }

  /**
   * Handle API error - normalize error message
   */
  handleError(error) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.response?.data?.error) {
      return new Error(error.response.data.error);
    }
    if (error.message) {
      return new Error(error.message);
    }
    return new Error('An unexpected error occurred');
  }

  /**
   * Safe async wrapper - catches and normalizes errors
   */
  async safeCall(asyncFn) {
    try {
      const response = await asyncFn();
      return this.extractData(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Common HTTP methods
  get(url, params = {}) {
    return this.safeCall(() => this.api.get(url, { params }));
  }

  post(url, data = {}) {
    return this.safeCall(() => this.api.post(url, data));
  }

  put(url, data = {}) {
    return this.safeCall(() => this.api.put(url, data));
  }

  patch(url, data = {}) {
    return this.safeCall(() => this.api.patch(url, data));
  }

  delete(url, data = {}) {
    return this.safeCall(() => this.api.delete(url, { data }));
  }
}

export default BaseService;
