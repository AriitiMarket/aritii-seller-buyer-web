/**
 * SHARED ERROR HANDLING & PATTERNS
 * Reusable utilities for consistent error handling across all services
 */

/**
 * API Error Class - standardized error format
 */
export class ApiError extends Error {
  constructor(message, status = 500, code = 'API_ERROR', details = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.name = 'ApiError';
  }
}

/**
 * Validation Error Class
 */
export class ValidationError extends ApiError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR', { errors });
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

/**
 * Authorization Error Class
 */
export class AuthorizationError extends ApiError {
  constructor(message = 'Unauthorized', details = {}) {
    super(message, 403, 'FORBIDDEN', details);
    this.name = 'AuthorizationError';
  }
}

/**
 * Resource Not Found Error Class
 */
export class NotFoundError extends ApiError {
  constructor(resource = 'Resource', id = null) {
    super(
      `${resource}${id ? ` with ID ${id}` : ''} not found`,
      404,
      'NOT_FOUND',
      { resource, id }
    );
    this.name = 'NotFoundError';
  }
}

/**
 * ASYNC WRAPPER - Catches errors automatically
 * Usage: const result = await asyncWrapper(promiseFunction);
 */
export async function asyncWrapper(promise, onError = null) {
  try {
    const result = await promise;
    return { success: true, data: result, error: null };
  } catch (err) {
    const error = normalizeError(err);

    if (onError) {
      onError(error);
    }

    return { success: false, data: null, error };
  }
}

/**
 * NORMALIZE ERROR - Convert any error to standard format
 */
export function normalizeError(err) {
  if (err instanceof ApiError) {
    return err;
  }

  // Axios error
  if (err.response) {
    const data = err.response.data || {};
    return new ApiError(
      data.message || err.message || 'Request failed',
      err.response.status || 500,
      data.code || 'HTTP_ERROR',
      data.errors || {}
    );
  }

  // Network error
  if (err.request) {
    return new ApiError(
      'Network error - no response from server',
      0,
      'NETWORK_ERROR'
    );
  }

  // Generic error
  return new ApiError(
    err.message || 'Unknown error occurred',
    500,
    'UNKNOWN_ERROR'
  );
}

/**
 * RETRY LOGIC - Retry failed operations with exponential backoff
 */
export async function retryWithBackoff(
  fn,
  maxAttempts = 3,
  baseDelay = 1000,
  shouldRetry = (_err) => true
) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      // Don't retry if error indicates we shouldn't
      if (!shouldRetry(err)) {
        throw err;
      }

      // Don't delay on last attempt
      if (attempt < maxAttempts) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * RATE LIMIT HANDLER - Handle rate limit errors
 */
export function isRateLimitError(err) {
  return err.status === 429 || err.code === 'RATE_LIMIT';
}

/**
 * RETRY ADVISOR - Determine if should retry based on error
 */
export function shouldRetryRequest(err) {
  const retryableStatuses = [408, 429, 500, 502, 503, 504];
  const retryableCodes = [
    'TIMEOUT',
    'RATE_LIMIT',
    'SERVICE_UNAVAILABLE',
    'NETWORK_ERROR',
  ];

  if (retryableStatuses.includes(err.status)) return true;
  if (retryableCodes.includes(err.code)) return true;
  if (err.message?.includes('timeout')) return true;
  if (err.message?.includes('ECONNREFUSED')) return true;

  return false;
}

/**
 * FORM VALIDATION - Validate form data
 */
export function validateFormData(data, schema) {
  const errors = [];

  for (const [key, rule] of Object.entries(schema)) {
    const value = data[key];

    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors.push({ field: key, message: `${key} is required` });
      continue;
    }

    if (rule.type === 'email' && value && !isValidEmail(value)) {
      errors.push({ field: key, message: `${key} must be valid email` });
    }

    if (rule.type === 'number' && value && isNaN(value)) {
      errors.push({ field: key, message: `${key} must be a number` });
    }

    if (rule.minLength && value && value.length < rule.minLength) {
      errors.push({
        field: key,
        message: `${key} must be at least ${rule.minLength} characters`,
      });
    }

    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors.push({
        field: key,
        message: `${key} must be at most ${rule.maxLength} characters`,
      });
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors.push({ field: key, message: `${key} format is invalid` });
    }

    if (rule.custom && !rule.custom(value)) {
      errors.push({
        field: key,
        message: rule.customMessage || `${key} validation failed`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * EMAIL VALIDATION
 */
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * SAFE API CALL - Wraps API call with error handling
 */
export async function safeApiCall(apiFunction, onError = null, onSuccess = null) {
  const { success, data, error } = await asyncWrapper(apiFunction, onError);

  if (success && onSuccess) {
    onSuccess(data);
  }

  return { success, data, error };
}

/**
 * DEBOUNCE - Delay function execution (useful for search)
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * THROTTLE - Limit function call frequency
 */
export function throttle(fn, limit = 1000) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * CACHE WRAPPER - Simple cache for function results
 */
export function createCache(fn, ttl = 60000) {
  let cachedResult = null;
  let cachedTime = 0;

  return async (...args) => {
    const now = Date.now();

    if (cachedResult && now - cachedTime < ttl) {
      return cachedResult;
    }

    cachedResult = await fn(...args);
    cachedTime = now;
    return cachedResult;
  };
}

/**
 * BATCH PROCESSOR - Process items in batches
 */
export async function processBatch(items, processor, batchSize = 10) {
  const results = [];
  const errors = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);

    const batchResults = await Promise.allSettled(
      batch.map((item) => processor(item))
    );

    batchResults.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        errors.push({ item: batch[idx], error: result.reason });
      }
    });
  }

  return { results, errors };
}

/**
 * FORMAT ERROR MESSAGE - User-friendly error messages
 */
export function formatErrorMessage(error) {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof ApiError) {
    // Network errors
    if (error.code === 'NETWORK_ERROR') {
      return 'Unable to connect to server. Please check your internet connection.';
    }

    // Timeout
    if (error.code === 'TIMEOUT') {
      return 'Request timed out. Please try again.';
    }

    // Rate limit
    if (error.code === 'RATE_LIMIT') {
      return 'Too many requests. Please wait a moment and try again.';
    }

    // Validation
    if (error.code === 'VALIDATION_ERROR') {
      if (error.details?.errors && Array.isArray(error.details.errors)) {
        return error.details.errors.join(', ');
      }
      return 'Please check your input and try again.';
    }

    // Authorization
    if (error.code === 'FORBIDDEN') {
      return 'You do not have permission to perform this action.';
    }

    // Not found
    if (error.code === 'NOT_FOUND') {
      return 'The requested resource was not found.';
    }

    return error.message || 'An error occurred. Please try again.';
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * TRACKING - Track user actions for analytics
 */
export const tracker = {
  track: (action, data = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, data);
    }
    console.log(`[TRACK] ${action}`, data);
  },

  trackError: (error, context = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: formatErrorMessage(error),
        fatal: false,
        ...context,
      });
    }
    console.error(`[TRACK ERROR]`, error, context);
  },

  trackPageView: (pageName) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pageName,
      });
    }
  },
};
