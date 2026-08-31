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
import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

interface Subscriber {
  email: string;
  categories: string[];
  subscribedAt: string;
}

interface Post {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  categories: string[];
}

export default async () => {
  const siteUrl = process.env.URL ?? process.env.DEPLOY_URL;
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!siteUrl || !resendApiKey) {
    console.error("notify-subscribers: missing URL or RESEND_API_KEY, skipping run.");
    return new Response("Missing configuration", { status: 200 });
  }

  const rssRes = await fetch(new URL("/rss.xml", siteUrl));
  if (!rssRes.ok) {
    console.error(`notify-subscribers: failed to fetch /rss.xml (${rssRes.status})`);
    return new Response("Could not read RSS feed", { status: 200 });
  }
  const posts = parseRss(await rssRes.text());

  const metaStore = getStore("site-meta");
  const lastNotifiedAt = (await metaStore.get("lastNotifiedAt", { type: "text" })) ?? "1970-01-01T00:00:00.000Z";
  const lastNotifiedMs = Date.parse(lastNotifiedAt);

  const newPosts = posts.filter((p) => Date.parse(p.pubDate) > lastNotifiedMs);
  if (newPosts.length === 0) {
    return new Response("No new posts since last run", { status: 200 });
  }

  const subscriberStore = getStore("subscribers");
  const { blobs } = await subscriberStore.list();

  let emailsSent = 0;
  for (const { key } of blobs) {
    const subscriber = (await subscriberStore.get(key, { type: "json" })) as Subscriber | null;
    if (!subscriber) continue;

    const matching =
      subscriber.categories.length === 0
        ? newPosts
        : newPosts.filter((p) => p.categories.some((c) => subscriber.categories.includes(c)));

    if (matching.length === 0) continue;

    await sendDigest({ siteUrl, resendApiKey, fromEmail, subscriber, posts: matching });
    emailsSent++;
  }

  const newestPubDate = newPosts.reduce(
    (max, p) => (Date.parse(p.pubDate) > Date.parse(max) ? p.pubDate : max),
    newPosts[0].pubDate,
  );
  await metaStore.set("lastNotifiedAt", newestPubDate);

  return new Response(`Notified ${emailsSent} subscriber(s) about ${newPosts.length} new post(s).`, { status: 200 });
};

async function sendDigest(opts: {
  siteUrl: string;
  resendApiKey: string;
  fromEmail: string;
  subscriber: Subscriber;
  posts: Post[];
}) {
  const { siteUrl, resendApiKey, fromEmail, subscriber, posts } = opts;
  const unsubscribeUrl = new URL(
    `/.netlify/functions/unsubscribe?email=${encodeURIComponent(subscriber.email)}`,
    siteUrl,
  ).toString();

  const itemsHtml = posts
    .map(
      (p) => `
        <li style="margin-bottom: 1.2em;">
          <a href="${p.link}" style="color:#B93A14; font-weight:600; text-decoration:none;">${escapeHtml(p.title)}</a>
          <p style="margin: 0.3em 0 0; color:#5C666B;">${escapeHtml(p.description)}</p>
        </li>`,
    )
    .join("");

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 32rem; margin: 0 auto; color:#191D1F;">
      <p>New on Field Notes:</p>
      <ul style="list-style:none; padding:0;">${itemsHtml}</ul>
      <p style="margin-top:2em; font-size:0.8em; color:#5C666B;">
        <a href="${unsubscribeUrl}" style="color:#5C666B;">Unsubscribe</a>
      </p>
    </div>`;

  const subject = posts.length === 1 ? posts[0].title : `${posts.length} new posts`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: subscriber.email,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    console.error(`notify-subscribers: Resend failed for ${subscriber.email}: ${res.status} ${await res.text()}`);
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Minimal RSS <item> parser — deliberately not a general-purpose XML
// parser, just enough for the specific, stable shape @astrojs/rss
// generates in src/pages/rss.xml.js (title/link/description/pubDate/
// category, in that order, no CDATA).
function parseRss(xml: string): Post[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return items.map((item) => ({
    title: unescapeXml(matchTag(item, "title")),
    link: matchTag(item, "link"),
    description: unescapeXml(matchTag(item, "description")),
    pubDate: matchTag(item, "pubDate"),
    categories: [...item.matchAll(/<category>([\s\S]*?)<\/category>/g)].map((m) => unescapeXml(m[1])),
  }));
}

function matchTag(xml: string, tag: string): string {
  const m = xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return m ? m[1].trim() : "";
}

function unescapeXml(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

export const config: Config = {
  schedule: "@daily",
};
