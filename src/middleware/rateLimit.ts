interface RateLimitInfo {
  count: number;
  startTime: number;
}

const store = new Map<string, RateLimitInfo>();

export function loginRateLimiter(ipOrIdentifier: string): boolean {
  const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
  const MAX_ATTEMPTS = 10;
  
  const now = Date.now();
  const record = store.get(ipOrIdentifier);

  if (!record) {
    store.set(ipOrIdentifier, { count: 1, startTime: now });
    return true; // allowed
  }

  if (now - record.startTime > WINDOW_MS) {
    // reset
    store.set(ipOrIdentifier, { count: 1, startTime: now });
    return true; // allowed
  }

  if (record.count >= MAX_ATTEMPTS) {
    return false; // blocked
  }

  record.count += 1;
  store.set(ipOrIdentifier, record);
  return true; // allowed
}
