interface RateLimitInfo {
  count: number;
  startTime: number;
}

const store = new Map<string, RateLimitInfo>();

interface RateLimitParams {
  key: string;
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remainingTimeMs?: number;
}

export function rateLimit({ key, limit, windowMs }: RateLimitParams): RateLimitResult {
  const now = Date.now();
  const record = store.get(key);

  if (!record) {
    store.set(key, { count: 1, startTime: now });
    return { success: true };
  }

  if (now - record.startTime > windowMs) {
    store.set(key, { count: 1, startTime: now });
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false, remainingTimeMs: windowMs - (now - record.startTime) };
  }

  record.count += 1;
  store.set(key, record);
  return { success: true };
}

export function loginRateLimiter(ipOrIdentifier: string): boolean {
  const result = rateLimit({
    key: `login:${ipOrIdentifier}`,
    limit: 10,
    windowMs: 5 * 60 * 1000 // 5 minutes
  });
  return result.success;
}

// Clean up old entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    // If a record is older than 1 hour, remove it
    if (now - record.startTime > 60 * 60 * 1000) {
      store.delete(key);
    }
  }
}, 10 * 60 * 1000); // run every 10 minutes
