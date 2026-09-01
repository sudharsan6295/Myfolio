// Tiny read-modify-write helpers over Vercel Blob, used by the subscriber
// pipeline (api/subscribe.ts, api/unsubscribe.ts, api/notify-subscribers.ts).
// Vercel Blob has no per-key store the way Netlify Blobs did -- instead of
// one blob per subscriber, the whole subscriber list and the notify
// pipeline's own state live as two single JSON blobs at fixed pathnames
// (addRandomSuffix: false keeps the pathname stable across writes so this
// stays a plain upsert, not a growing pile of versioned files). Simple and
// plenty for the scale a personal blog's subscriber list actually reaches.
import { put, list } from "@vercel/blob";

export async function readJsonBlob<T>(pathname: string, fallback: T): Promise<T> {
  const { blobs } = await list({ prefix: pathname, limit: 1 });
  const match = blobs.find((b) => b.pathname === pathname);
  if (!match) return fallback;

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  // Cache-bust with a query param: with addRandomSuffix: false the blob's
  // URL stays identical across overwrites, but Vercel Blob URLs are
  // cached for cacheControlMaxAge (60s here, see writeJsonBlob) by
  // default -- a plain fetch(match.url) can return a stale pre-overwrite
  // copy inside that window. The query string busts that cache without
  // needing a real cache-control override on every intermediate layer.
  const bustUrl = `${match.url}?t=${Date.now()}`;
  const res = await fetch(bustUrl, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  if (!res.ok) return fallback;
  return (await res.json()) as T;
}

export async function writeJsonBlob(pathname: string, data: unknown): Promise<void> {
  // access: "private" -- these blobs hold subscriber emails (real PII) and
  // internal pipeline state, neither of which should be reachable by
  // anyone who guesses/finds the URL. Reading one back requires the same
  // BLOB_READ_WRITE_TOKEN these functions already have via the connected
  // Blob store, not a public link.
  //
  // cacheControlMaxAge: 60 (the minimum Vercel Blob allows) -- the
  // default is 30 days, which combined with a stable pathname
  // (addRandomSuffix: false) meant an overwrite's new content could sit
  // behind a stale cached response for a month. 60s is a non-issue for
  // data that changes at most a few times a day, and readJsonBlob's
  // cache-busting query param covers the rest.
  await put(pathname, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}
