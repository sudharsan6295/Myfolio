// Constant-time string comparison for secrets (bearer tokens, shared
// secrets) read from a header or query string. A plain `===`/`!==` leaks
// how many leading bytes matched through timing, which is enough to
// reconstruct a secret one byte at a time given enough attempts --
// unsubscribe-token.ts already avoids this with timingSafeEqual; this is
// the same fix for the endpoints that check CRON_SECRET / MANUAL_TRIGGER_SECRET.
import { timingSafeEqual } from "node:crypto";

export function secureCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
