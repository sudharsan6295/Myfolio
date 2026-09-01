// Manual trigger for the same notify logic Vercel's cron runs on its own
// schedule -- for testing the whole pipeline (RSS -> Blob -> Resend)
// without waiting on the daily cron. Gated behind a shared secret so this
// can't be used to spam-trigger real emails to real subscribers from a
// public URL.
//
// Requires an environment variable beyond what notify-subscribers.ts needs:
//   MANUAL_TRIGGER_SECRET - any random string you choose
//
// Usage once that's set: GET /api/notify-subscribers-test?secret=<value>
import { runNotify } from "../src/lib/notify-logic.js";

export default async function handler(request: Request): Promise<Response> {
  const secret = new URL(request.url).searchParams.get("secret");
  const expected = process.env.MANUAL_TRIGGER_SECRET;

  if (!expected) {
    return new Response("MANUAL_TRIGGER_SECRET is not set -- refusing to run.", { status: 503 });
  }
  if (secret !== expected) {
    return new Response("Forbidden", { status: 403 });
  }

  const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : new URL(request.url).origin;

  const result = await runNotify(siteUrl);
  return new Response(result, { status: 200 });
}
