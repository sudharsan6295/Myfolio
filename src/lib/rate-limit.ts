// A simple, self-contained rate limiter over Vercel Blob -- deliberately
// not a third-party service (Upstash, etc.): this site's traffic doesn't
// justify provisioning and paying for a dedicated rate-limiting backend,
// and Blob is already set up for the subscriber pipeline. Correctness
// under concurrent requests comes from blob-store.ts's updateJsonBlob
// (ETag-based optimistic concurrency, retried on conflict) -- an earlier
// version of this file did a plain read-modify-write and lost updates
// under rapid repeated requests (confirmed live: 7 rapid POSTs against a
// max of 5 all returned 200, and the stored counter was stuck at exactly
// 5 instead of correctly rejecting the last 2). updateJsonBlob's retry
// loop is what fixes that -- see its own comment for how.
//
// All IPs share one ratelimits.json blob (same "single JSON file,
// read-modify-write" pattern as subscribers.json) rather than one blob
// per IP, so the store doesn't accumulate a growing pile of tiny files --
// stale entries (older than the window) are pruned on every write.
import { updateJsonBlob } from "./blob-store.js";

const RATE_LIMIT_KEY = "ratelimits.json";

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

export function clientIp(request: Request): string {
  // x-forwarded-for can be a comma-separated chain (client, proxy1,
  // proxy2, ...) -- the first entry is the original client.
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function checkRateLimit(
  key: string,
  opts: { windowMs: number; max: number },
): Promise<{ allowed: boolean }> {
  const now = Date.now();
  let allowed = true;

  await updateJsonBlob<Record<string, RateLimitEntry>>(RATE_LIMIT_KEY, {}, (all) => {
    // Prune anything outside its own window while we're already reading
    // the whole file -- keeps this from growing unbounded over time.
    const pruned: Record<string, RateLimitEntry> = {};
    for (const [k, entry] of Object.entries(all)) {
      if (now - entry.windowStart < opts.windowMs) pruned[k] = entry;
    }

    const existing = pruned[key];
    if (!existing || now - existing.windowStart >= opts.windowMs) {
      pruned[key] = { count: 1, windowStart: now };
      allowed = true;
      return pruned;
    }

    if (existing.count >= opts.max) {
      allowed = false;
      // Return the *original* object (not `pruned`) so updateJsonBlob
      // sees an unchanged reference and skips the write entirely -- a
      // blocked request shouldn't cost a write, and definitely shouldn't
      // retry against a conflict just to persist a no-op.
      return all;
    }

    pruned[key] = { count: existing.count + 1, windowStart: existing.windowStart };
    allowed = true;
    return pruned;
  });

  return { allowed };
}
