// Shared logic between the cron-triggered api/notify-subscribers.ts and
// the manual test-trigger api/notify-subscribers-test.ts -- same run, two
// different ways to invoke it. Ported from the original Netlify Functions
// version (see git history / CLAUDE.md) after the account hosting that
// pipeline was suspended and the site moved to Vercel; logic is otherwise
// unchanged, just Netlify Blobs -> Vercel Blob for storage.
import { readJsonBlob, writeJsonBlob } from "./blob-store.js";

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

const SUBSCRIBERS_KEY = "subscribers.json";
const META_KEY = "site-meta.json";

export async function getSubscribers(): Promise<Subscriber[]> {
  return readJsonBlob<Subscriber[]>(SUBSCRIBERS_KEY, []);
}

export async function saveSubscribers(subs: Subscriber[]): Promise<void> {
  await writeJsonBlob(SUBSCRIBERS_KEY, subs);
}

export async function runNotify(siteUrl: string): Promise<string> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!resendApiKey) {
    return "Missing configuration: RESEND_API_KEY is not set.";
  }

  const rssRes = await fetch(new URL("/rss.xml", siteUrl));
  if (!rssRes.ok) {
    return `Could not read /rss.xml (status ${rssRes.status}).`;
  }
  const posts = parseRss(await rssRes.text());

  const meta = await readJsonBlob<{ lastNotifiedAt: string }>(META_KEY, {
    lastNotifiedAt: "1970-01-01T00:00:00.000Z",
  });
  const lastNotifiedMs = Date.parse(meta.lastNotifiedAt);

  const newPosts = posts.filter((p) => Date.parse(p.pubDate) > lastNotifiedMs);
  if (newPosts.length === 0) {
    return `No new posts since last run (last run cutoff: ${meta.lastNotifiedAt}).`;
  }

  const subscribers = await getSubscribers();
  if (subscribers.length === 0) {
    return `Found ${newPosts.length} new post(s), but there are 0 subscribers.`;
  }

  let emailsSent = 0;
  const errors: string[] = [];
  for (const subscriber of subscribers) {
    const matching =
      subscriber.categories.length === 0
        ? newPosts
        : newPosts.filter((p) => p.categories.some((c) => subscriber.categories.includes(c)));

    if (matching.length === 0) continue;

    const result = await sendDigest({ siteUrl, resendApiKey, fromEmail, subscriber, posts: matching });
    if (result.ok === true) {
      emailsSent++;
    } else {
      const error: string = result.error;
      errors.push(`${subscriber.email}: ${error}`);
    }
  }

  const newestPubDate = newPosts.reduce(
    (max, p) => (Date.parse(p.pubDate) > Date.parse(max) ? p.pubDate : max),
    newPosts[0].pubDate,
  );
  await writeJsonBlob(META_KEY, { lastNotifiedAt: newestPubDate });

  const summary = `Notified ${emailsSent}/${subscribers.length} subscriber(s) about ${newPosts.length} new post(s).`;
  return errors.length > 0 ? `${summary} Errors: ${errors.join(" | ")}` : summary;
}

async function sendDigest(opts: {
  siteUrl: string;
  resendApiKey: string;
  fromEmail: string;
  subscriber: Subscriber;
  posts: Post[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { siteUrl, resendApiKey, fromEmail, subscriber, posts } = opts;
  const unsubscribeUrl = new URL(`/api/unsubscribe?email=${encodeURIComponent(subscriber.email)}`, siteUrl).toString();

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
    body: JSON.stringify({ from: fromEmail, to: subscriber.email, subject, html }),
  });

  if (!res.ok) {
    return { ok: false, error: `Resend ${res.status}: ${await res.text()}` };
  }
  return { ok: true };
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Minimal RSS <item> parser -- deliberately not a general-purpose XML
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
