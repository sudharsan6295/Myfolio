// A simple, self-contained rate limiter over Vercel Blob -- deliberately
// not a third-party service (Upstash, etc.): this site's traffic doesn't
// justify provisioning and paying for a dedicated rate-limiting backend,
// and Blob is already set up for the subscriber pipeline. Not a precise
// distributed limiter under heavy concurrent load (a read-modify-write
// race is possible between two near-simultaneous requests from the same
// IP), but that's an acceptable trade-off for what this actually guards
// against: a bot hammering /api/subscribe or /api/unsubscribe, not a
// high-traffic production API needing exact request accounting.
//
// All IPs share one ratelimits.json blob (same "single JSON file,
// read-modify-write" pattern as subscribers.json) rather than one blob
// per IP, so the store doesn't accumulate a growing pile of tiny files --
// stale entries (older than the window) are pruned on every write.
import { readJsonBlob, writeJsonBlob } from "./blob-store.js";

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
  const all = await readJsonBlob<Record<string, RateLimitEntry>>(RATE_LIMIT_KEY, {});

  // Prune anything outside its own window while we're already reading
  // the whole file -- keeps this from growing unbounded over time.
  const pruned: Record<string, RateLimitEntry> = {};
  for (const [k, entry] of Object.entries(all)) {
    if (now - entry.windowStart < opts.windowMs) pruned[k] = entry;
  }

  const existing = pruned[key];
  if (!existing || now - existing.windowStart >= opts.windowMs) {
    pruned[key] = { count: 1, windowStart: now };
    await writeJsonBlob(RATE_LIMIT_KEY, pruned);
    return { allowed: true };
  }

  if (existing.count >= opts.max) {
    return { allowed: false };
  }

  pruned[key] = { count: existing.count + 1, windowStart: existing.windowStart };
  await writeJsonBlob(RATE_LIMIT_KEY, pruned);
  return { allowed: true };
}
