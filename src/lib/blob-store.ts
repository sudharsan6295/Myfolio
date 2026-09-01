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
  const res = await fetch(match.url, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined);
  if (!res.ok) return fallback;
  return (await res.json()) as T;
}

export async function writeJsonBlob(pathname: string, data: unknown): Promise<void> {
  // access: "private" -- these blobs hold subscriber emails (real PII) and
  // internal pipeline state, neither of which should be reachable by
  // anyone who guesses/finds the URL. Reading one back requires the same
  // BLOB_READ_WRITE_TOKEN these functions already have via the connected
  // Blob store, not a public link.
  await put(pathname, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
    allowOverwrite: true,
  });
}
