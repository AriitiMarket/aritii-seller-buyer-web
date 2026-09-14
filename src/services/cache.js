/**
 * Request Cache Manager
 * Implements simple caching for GET requests to reduce API calls
 */

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map(); // Time to live for each cache entry
  }

  /**
   * Set cache with TTL (Time To Live)
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttlMs - Time to live in milliseconds (default: 5 minutes)
   */
  set(key, value, ttlMs = 5 * 60 * 1000) {
    this.cache.set(key, value);
    
    // Clear old timeout if exists
    if (this.ttl.has(key)) {
      clearTimeout(this.ttl.get(key));
    }

    // Set new timeout to invalidate cache
    const timeout = setTimeout(() => {
      this.cache.delete(key);
      this.ttl.delete(key);
    }, ttlMs);

    this.ttl.set(key, timeout);
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {*} - Cached value or undefined
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Check if key exists in cache
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Delete specific cache entry
   * @param {string} key - Cache key
   */
  delete(key) {
    if (this.ttl.has(key)) {
      clearTimeout(this.ttl.get(key));
      this.ttl.delete(key);
    }
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.ttl.forEach(timeout => clearTimeout(timeout));
    this.cache.clear();
    this.ttl.clear();
  }

  /**
   * Invalidate cache by pattern (e.g., "/shop/*")
   * @param {string} pattern - Pattern to match keys
   */
  invalidateByPattern(pattern) {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    const keysToDelete = [];

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.delete(key));
  }
}

export default new CacheManager();
