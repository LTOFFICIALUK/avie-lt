/**
 * A simple in-memory cache implementation with TTL support
 */

// Cache item structure
interface CacheItem<T> {
  value: T;
  expiry: number;
}

/**
 * Simple cache class for storing data with expiration (TTL)
 */
export class SimpleCache<T = any> {
  private cache: Record<string, CacheItem<T>> = {};
  private defaultTtl: number;
  
  /**
   * Create a new SimpleCache instance
   * @param defaultTtl Default time-to-live in milliseconds
   */
  constructor(defaultTtl: number = 60000) {
    this.defaultTtl = defaultTtl;
    
    // Start periodic cleanup
    setInterval(() => this.cleanup(), 5 * 60 * 1000); // Cleanup every 5 minutes
  }
  
  /**
   * Get an item from the cache
   * @param key Cache key
   * @returns The cached value or null if not found or expired
   */
  get(key: string): T | null {
    const item = this.cache[key];
    
    // Return null if item doesn't exist
    if (!item) return null;
    
    // Return null if item has expired
    if (Date.now() > item.expiry) {
      delete this.cache[key];
      return null;
    }
    
    return item.value;
  }
  
  /**
   * Store an item in the cache
   * @param key Cache key
   * @param value Value to cache
   * @param ttlMs Time-to-live in milliseconds (optional, uses default if not provided)
   */
  put(key: string, value: T, ttlMs?: number): void {
    const ttl = ttlMs || this.defaultTtl;
    const expiry = Date.now() + ttl;
    this.cache[key] = { value, expiry };
  }
  
  /**
   * Remove an item from the cache
   * @param key Cache key to remove
   */
  remove(key: string): void {
    delete this.cache[key];
  }
  
  /**
   * Clear all items from the cache
   */
  clear(): void {
    this.cache = {};
  }
  
  /**
   * Clean up expired items from the cache
   */
  cleanup(): void {
    const now = Date.now();
    for (const key in this.cache) {
      if (this.cache[key].expiry <= now) {
        delete this.cache[key];
      }
    }
  }
} 