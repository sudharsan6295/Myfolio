// Signed unsubscribe links.
//
// The unsubscribe endpoint used to identify people by nothing but an email
// address in the query string, so anyone could unsubscribe anyone by
// guessing an address -- and, because the response differed, use it to
// check whether a given address was on the list at all. Every link now
// carries an HMAC of the address; the endpoint refuses anything that
// doesn't verify.
//
// The key comes from UNSUBSCRIBE_SECRET when it is set. When it isn't, it
// is DERIVED from RESEND_API_KEY rather than falling back to "no
// verification" -- a fallback that silently disables the check is worse
// than no check at all, because it looks fixed. Deriving is safe here
// because the derivation is domain-separated (a distinct hash prefix), so
// the value used for signing can't be turned back into the API key, and
// RESEND_API_KEY is always present wherever unsubscribe links exist: the
// notify pipeline no-ops without it, so no email -- and therefore no link
// -- is ever produced.
//
// The tradeoff of relying on the derivation: rotating the Resend key
// invalidates unsubscribe links in already-delivered emails. Set
// UNSUBSCRIBE_SECRET to decouple the two.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/** Lower-cased and trimmed, matching how subscribe.ts stores an address
 *  and how the endpoint reads one back. Signing a differently-cased
 *  string than the endpoint verifies would fail every link. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 254);
}

function signingKey(): Buffer | null {
  const explicit = process.env.UNSUBSCRIBE_SECRET;
  if (explicit) return Buffer.from(explicit, "utf8");

  const resend = process.env.RESEND_API_KEY;
  if (!resend) return null;
  return createHash("sha256").update(`myfolio:unsubscribe-link:${resend}`).digest();
}

/** The token for an address, or null if no key is configured (in which
 *  case nothing can be signed, and nothing will verify either). */
export function unsubscribeToken(email: string): string | null {
  const key = signingKey();
  if (!key) return null;
  // 32 base64url chars ~ 192 bits. Short enough to keep the link tidy in
  // an email footer, far beyond guessable.
  return createHmac("sha256", key).update(normalizeEmail(email)).digest("base64url").slice(0, 32);
}

/** True only for a token this server would have produced for that address.
 *  Compared in constant time: a plain === leaks how much of the token was
 *  correct through timing, which is enough to reconstruct one byte at a
 *  time given enough attempts. */
export function verifyUnsubscribeToken(email: string, token: string | null | undefined): boolean {
  if (!token) return false;
  const expected = unsubscribeToken(email);
  if (!expected) return false;

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(token, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** The full link to put in an email. Returns null when no key is
 *  configured, so a caller can decide what to do rather than silently
 *  emailing a link that can never work. */
export function unsubscribeUrl(email: string, siteUrl: string): string | null {
  const token = unsubscribeToken(email);
  if (!token) return null;
  const url = new URL("/api/unsubscribe", siteUrl);
  url.searchParams.set("email", normalizeEmail(email));
  url.searchParams.set("t", token);
  return url.toString();
}
