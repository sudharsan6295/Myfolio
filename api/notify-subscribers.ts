// Vercel Cron job (see vercel.json's "crons" entry, runs daily) -- the
// actual "send an email on a new post" piece. A static site has no
// database trigger to hook into, so this polls the site's own /rss.xml
// (regenerated fresh on every build) via src/lib/notify-logic.ts's
// runNotify(), which diffs against last-notified state in Vercel Blob and
// emails only subscribers whose category picks match a genuinely new post.
//
// Vercel signs cron requests with `Authorization: Bearer $CRON_SECRET`
// when that env var is set -- checked here so this endpoint can't be
// triggered by an arbitrary public GET, only Vercel's own scheduler (or
// someone who has the secret).
import { runNotify } from "../src/lib/notify-logic.js";

export async function GET(request: Request): Promise<Response> {
  // Fails CLOSED. This used to be `if (cronSecret) { ...check... }`, so an
  // unset CRON_SECRET meant no check at all and any stranger could GET
  // this endpoint. Most days that is harmless -- runNotify only emails on
  // a genuinely new post -- but the day after publishing, two concurrent
  // triggers could both read the old lastNotifiedAt and mail the whole
  // list twice. An endpoint that sends real email to real people should
  // refuse to run when it cannot tell who is calling it, rather than
  // treating a missing secret as permission.
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[notify] CRON_SECRET is not set -- refusing to run.");
    return new Response("Not configured", { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // request.url is just the path in this runtime, not a full URL -- prefer
  // Vercel's own env var for the real production origin, falling back to
  // the `host` header (which new URL() needs as a base either way).
  const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : new URL(request.url, `https://${request.headers.get("host")}`).origin;

  const result = await runNotify(siteUrl);
  console.log(`notify-subscribers: ${result}`);
  return new Response(result, { status: 200 });
}
