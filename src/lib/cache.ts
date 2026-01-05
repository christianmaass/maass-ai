import 'server-only';
import { serverEnv } from '@/lib/config/env.server';

interface CacheData {
  value: unknown;
  timestamp: number;
  ttl: number;
}

/**
 * Redis-Cache mit Upstash REST API
 * Deaktiviert wenn UPSTASH_REDIS_REST_URL nicht gesetzt ist
 */
class RedisCache {
  private baseUrl: string;
  private token: string;
  private enabled: boolean;
  private readonly defaultTTL = 3600; // 1 Stunde

  constructor() {
    this.baseUrl = serverEnv.UPSTASH_REDIS_REST_URL || '';
    this.token = serverEnv.UPSTASH_REDIS_REST_TOKEN || '';
    this.enabled = Boolean(this.baseUrl && this.token);

    if (this.enabled) {
      console.log('Redis cache enabled with Upstash');
    } else {
      console.log('Redis cache disabled - missing environment variables');
    }
  }

  private async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: unknown
  ): Promise<T | null> {
    if (!this.enabled) return null;

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        console.warn(`Redis cache request failed: ${response.status} ${response.statusText}`);
        return null;
      }

      const result = await response.json();
      return result.result;
    } catch (error) {
      console.warn('Redis cache request error:', error);
      return null;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled) return null;

    try {
      const data = await this.request<CacheData>(`/get/${key}`);
      if (!data) return null;

      // Check if data is expired
      const now = Date.now();
      if (now > data.timestamp + data.ttl * 1000) {
        console.log(`Cache expired for key: ${key}`);
        await this.delete(key);
        return null;
      }

      console.log(`Cache hit for key: ${key}`);
      return data.value as T;
    } catch (error) {
      console.warn(`Error getting cache for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = this.defaultTTL): Promise<void> {
    if (!this.enabled) return;

    try {
      const cacheData: CacheData = {
        value,
        timestamp: Date.now(),
        ttl,
      };

      await this.request(`/set/${key}`, 'POST', {
        value: JSON.stringify(cacheData),
        ex: ttl,
      });

      console.log(`Cache set for key: ${key} with TTL: ${ttl}s`);
    } catch (error) {
      console.warn(`Error setting cache for key ${key}:`, error);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.enabled) return;

    try {
      await this.request(`/del/${key}`);
      console.log(`Cache deleted for key: ${key}`);
    } catch (error) {
      console.warn(`Error deleting cache for key ${key}:`, error);
    }
  }

  /**
   * Cache-Status prüfen
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Cache-Statistiken (für Monitoring)
   */
  getStats(): { enabled: boolean; baseUrl: string; hasToken: boolean } {
    return {
      enabled: this.enabled,
      baseUrl: this.baseUrl,
      hasToken: Boolean(this.token),
    };
  }
}

// Singleton instance
const redisCache = new RedisCache();

/**
 * Cache-API für einfache Verwendung
 */
export async function getCache<T>(key: string): Promise<T | null> {
  return redisCache.get<T>(key);
}

export async function setCache<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
  return redisCache.set(key, value, ttl);
}

export async function deleteCache(key: string): Promise<void> {
  return redisCache.delete(key);
}

/**
 * Cache-Status und Statistiken
 */
export function getCacheStats() {
  return redisCache.getStats();
}

export function isCacheEnabled(): boolean {
  return redisCache.isEnabled();
}
