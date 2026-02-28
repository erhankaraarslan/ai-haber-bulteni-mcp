interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry<unknown>>();
  private readonly DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 dakika

  set<T>(key: string, data: T, ttlMs?: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + (ttlMs ?? this.DEFAULT_TTL_MS),
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  buildKey(persona: string, timeframe: string): string {
    return `${persona}_${timeframe}`;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cacheService = new CacheService();
