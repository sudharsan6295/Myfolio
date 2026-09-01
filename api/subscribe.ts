// Captures a subscribe-form submission into Vercel Blob (subscribers.json,
// via src/lib/blob-store.ts) -- the Vercel-hosted replacement for the
// original netlify/functions/subscribe.mts after the site moved off a
// suspended Netlify account. Upserts by email -- resubscribing just
// updates the category picks rather than creating a duplicate entry.
import { getSubscribers, saveSubscribers } from "../src/lib/notify-logic";

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
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
  if (!email || !email.includes("@")) {
    return json({ error: "A valid email is required" }, 400);
  }

  const categories = form.getAll("categories").map(String);

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
