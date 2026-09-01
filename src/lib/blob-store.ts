// Tiny read-modify-write helpers over Vercel Blob, used by the subscriber
// pipeline (api/subscribe.ts, api/unsubscribe.ts, api/notify-subscribers.ts)
// and the rate limiter (src/lib/rate-limit.ts). Vercel Blob has no per-key
// store the way Netlify Blobs did -- instead of one blob per subscriber (or
// per rate-limit key), each dataset lives as one single JSON blob at a fixed
// pathname (addRandomSuffix: false keeps the pathname stable across writes
// so this stays a plain upsert, not a growing pile of versioned files).
// Simple and plenty for the scale a personal blog actually reaches.
import { get, put, BlobError } from "@vercel/blob";

const token = process.env.BLOB_READ_WRITE_TOKEN;

interface BlobRead<T> {
  data: T;
  // null means the blob didn't exist yet (fallback was used) -- writeBlob
  // treats that as "create, don't overwrite" instead of an ifMatch write.
  etag: string | null;
}

async function readBlob<T>(pathname: string, fallback: T): Promise<BlobRead<T>> {
  // useCache: false -- bypass Vercel's CDN cache and read straight from
  // origin storage. Cache-control headers on the blob (see writeBlob)
  // still let a *client's* browser cache it, but every server-side read
  // in this project needs the true current value, not a copy that might
  // be up to cacheControlMaxAge stale.
  const result = await get(pathname, { access: "private", useCache: false, token });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return { data: fallback, etag: null };
  }
  const text = await new Response(result.stream).text();
  try {
    return { data: JSON.parse(text) as T, etag: result.blob.etag };
  } catch {
    return { data: fallback, etag: result.blob.etag };
  }
}

// Returns true on a successful write, false if the write lost a race
// (another writer changed -- or created -- the blob since `etag` was
// read). Any other Blob SDK error is rethrown.
async function writeBlob(pathname: string, data: unknown, etag: string | null): Promise<boolean> {
  try {
    await put(pathname, JSON.stringify(data), {
      access: "private",
      addRandomSuffix: false,
      contentType: "application/json",
      // cacheControlMaxAge: 60 (the minimum Vercel Blob allows) -- the
      // default is 30 days, which combined with a stable pathname would
      // mean an overwrite's new content could sit behind a stale cached
      // response for a month.
      cacheControlMaxAge: 60,
      token,
      // etag present -> conditional overwrite, fails if someone else wrote
      // first. etag null -> we believe the blob doesn't exist yet, so
      // require a fresh create (allowOverwrite defaults to false) instead
      // of blindly overwriting whatever another concurrent request may
      // have just created.
      ...(etag ? { ifMatch: etag } : { allowOverwrite: false }),
    });
    return true;
  } catch (err) {
    if (err instanceof BlobError) return false;
    throw err;
  }
}

export async function readJsonBlob<T>(pathname: string, fallback: T): Promise<T> {
  return (await readBlob(pathname, fallback)).data;
}

// Unconditional overwrite -- fine for callers that don't need correctness
// under concurrent writers (or that already serialize some other way).
// Anything where two near-simultaneous requests could race on a lost
// update (the rate limiter, in particular) should use updateJsonBlob
// instead.
export async function writeJsonBlob(pathname: string, data: unknown): Promise<void> {
  await put(pathname, JSON.stringify(data), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    token,
  });
}

// Read-modify-write with optimistic concurrency control: `mutate` receives
// the current value (or `fallback` if the blob doesn't exist yet) and
// returns the next value. The write is conditioned on the ETag observed at
// read time -- if another request wrote to this blob in between, the write
// fails and the whole cycle (re-read, re-run `mutate`, re-write) retries,
// so two concurrent callers correctly serialize instead of one clobbering
// the other's update. `mutate` can return its input unchanged (by
// reference) to signal "nothing to write" and skip the write entirely.
export async function updateJsonBlob<T>(
  pathname: string,
  fallback: T,
  mutate: (current: T) => T,
  maxAttempts = 5,
): Promise<T> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const { data, etag } = await readBlob(pathname, fallback);
    const next = mutate(data);
    if (next === data) return next;
    if (await writeBlob(pathname, next, etag)) return next;
    // Lost the race -- small jittered backoff before re-reading, so a
    // burst of concurrent callers doesn't retry in lockstep and collide
    // again on the next attempt.
    await new Promise((resolve) => setTimeout(resolve, 20 + Math.random() * 60));
  }
  throw new Error(`updateJsonBlob: exceeded ${maxAttempts} attempts writing ${pathname}`);
}
