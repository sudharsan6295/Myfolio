// Captures a subscribe-form submission into Netlify Blobs (a built-in
// key-value store — no separate database needed). Replaces the old plain
// Netlify Forms capture: Forms alone can only show submissions in a
// dashboard, it can't be read back by another function to actually send
// anything, so the subscribe form now posts here directly instead of to
// "/". Upserts by email — resubscribing just updates the category picks
// rather than creating a duplicate entry.
import type { Config, Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

interface Subscriber {
  email: string;
  categories: string[];
  subscribedAt: string;
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let form: URLSearchParams;
  try {
    const body = await req.text();
    form = new URLSearchParams(body);
  } catch {
    return json({ error: "Malformed request body" }, 400);
  }

  // Honeypot — same field the old Netlify Forms markup used. A real
  // visitor never fills this in; a bot usually does.
  if (form.get("bot-field")) {
    return json({ ok: true }, 200);
  }

  const email = (form.get("email") ?? "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return json({ error: "A valid email is required" }, 400);
  }

  const categories = form.getAll("categories").map(String);

  const store = getStore("subscribers");
  const existing = await store.get(email, { type: "json" }) as Subscriber | null;

  const record: Subscriber = {
    email,
    categories,
    subscribedAt: existing?.subscribedAt ?? new Date().toISOString(),
  };
  await store.setJSON(email, record);

  return json({ ok: true }, 200);
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const config: Config = {
  path: "/.netlify/functions/subscribe",
};
