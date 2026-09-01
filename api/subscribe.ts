// Captures a subscribe-form submission into Vercel Blob (subscribers.json,
// via src/lib/blob-store.ts) -- the Vercel-hosted replacement for the
// original netlify/functions/subscribe.mts after the site moved off a
// suspended Netlify account. Upserts by email -- resubscribing just
// updates the category picks rather than creating a duplicate entry.
import { getSubscribers, saveSubscribers } from "../src/lib/notify-logic.js";
import { checkRateLimit, clientIp } from "../src/lib/rate-limit.js";

export async function POST(request: Request): Promise<Response> {
  // 5 submissions per 15 minutes per IP -- generous for a real visitor
  // (including retries after a typo), tight enough to block a bot
  // hammering this endpoint with fake addresses.
  const { allowed } = await checkRateLimit(`subscribe:${clientIp(request)}`, {
    windowMs: 15 * 60 * 1000,
    max: 5,
  });
  if (!allowed) {
    return json({ error: "Too many attempts. Try again in a few minutes." }, 429);
  }

  let form: URLSearchParams;
  try {
    form = new URLSearchParams(await request.text());
  } catch {
    return json({ error: "Malformed request body" }, 400);
  }

  // Honeypot -- same field the original form markup used. A real visitor
  // never fills this in; a bot usually does.
  if (form.get("bot-field")) {
    return json({ ok: true }, 200);
  }

  const email = (form.get("email") ?? "").trim().toLowerCase();
  // A real format check (not just "has an @"), plus a length cap matching
  // RFC 5321's max mailbox length -- both cheap ways to reject obviously
  // bogus/oversized submissions before they ever reach storage.
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "A valid email is required" }, 400);
  }

  // Capped at 20 categories / 50 chars each -- there are only a handful of
  // real categories on the site, so this is generous headroom for a
  // legitimate submission while bounding how much a single POST can add
  // to the stored subscriber list.
  const categories = form
    .getAll("categories")
    .map(String)
    .slice(0, 20)
    .map((c) => c.slice(0, 50));

  const subscribers = await getSubscribers();
  const existing = subscribers.find((s) => s.email === email);
  const updated = { email, categories, subscribedAt: existing?.subscribedAt ?? new Date().toISOString() };

  const next = existing
    ? subscribers.map((s) => (s.email === email ? updated : s))
    : [...subscribers, updated];

  await saveSubscribers(next);

  return json({ ok: true }, 200);
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
