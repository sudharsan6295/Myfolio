// Scheduled function (runs daily) — the actual "send an email when a new
// post goes up" piece. A static site has no database trigger to hook
// into, so this polls the site's own /rss.xml (already generated fresh
// on every build from the blog collection — see src/pages/rss.xml.js),
// compares each post's pubDate against the last time this function ran,
// and emails only the subscribers whose category picks match a genuinely
// new post. Runs against the deployed site, not the source content
// directly, since a Netlify Function doesn't have access to Astro's
// content collections at runtime.
//
// Requires two environment variables set in the Netlify dashboard (Site
// configuration -> Environment variables) — this function does nothing
// useful without them:
//   RESEND_API_KEY   - from your Resend account (resend.com)
//   RESEND_FROM_EMAIL - a "From" address. Resend's shared sandbox address
//                       onboarding@resend.dev works with no setup, but
//                       only delivers to the email you signed up to
//                       Resend with. Verify your own domain in Resend to
//                       send to real subscribers.
//
// The actual send/diff logic lives in lib/notify-logic.mts, shared with
// notify-subscribers-test.mts (a manual, secret-gated trigger for testing
// without waiting on the daily schedule — see that file).
import type { Config } from "@netlify/functions";
import { runNotify } from "./lib/notify-logic.mts";

export default async () => {
  const result = await runNotify();
  console.log(`notify-subscribers: ${result}`);
  return new Response(result, { status: 200 });
};

export const config: Config = {
  schedule: "@daily",
};
