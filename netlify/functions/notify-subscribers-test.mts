// Manual trigger for notify-subscribers' logic, for testing the whole
// pipeline (RSS -> Blobs -> Resend) without waiting on the @daily
// schedule — Netlify blocks direct HTTP invocation of scheduled
// functions (returns 403 on purpose), so this is a plain function that
// runs the exact same code instead.
//
// Gated behind a shared secret so this can't be used to spam-trigger
// real emails to real subscribers from a public URL. Requires an
// additional environment variable beyond the two notify-subscribers.mts
// needs:
//   MANUAL_TRIGGER_SECRET - any random string you choose
//
// Usage once that's set: GET /.netlify/functions/notify-subscribers-test?secret=<value>
//
// Safe to leave deployed permanently — without the correct secret it
// does nothing, and it shares notify-subscribers.mts's own "no new posts
// since last run" guard, so re-running it doesn't double-send.
import type { Config } from "@netlify/functions";
import { runNotify } from "./lib/notify-logic.mts";

export default async (req: Request) => {
  const secret = new URL(req.url).searchParams.get("secret");
  const expected = process.env.MANUAL_TRIGGER_SECRET;

  if (!expected) {
    return new Response("MANUAL_TRIGGER_SECRET is not set — refusing to run.", { status: 503 });
  }
  if (secret !== expected) {
    return new Response("Forbidden", { status: 403 });
  }

  const result = await runNotify();
  return new Response(result, { status: 200 });
};

export const config: Config = {
  path: "/.netlify/functions/notify-subscribers-test",
};
