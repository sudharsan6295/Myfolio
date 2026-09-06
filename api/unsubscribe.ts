// One-click unsubscribe -- every notification email links here with the
// subscriber's own address plus a signature over it. Removes them from the
// subscriber list and shows a plain confirmation page. GET (not POST) so
// it works as a plain link click from an email client with no JS involved.
//
// The `t` signature is required. Without it this endpoint took an address
// alone, which let anyone unsubscribe anyone, and -- because the response
// differed depending on the outcome -- let anyone test whether an address
// was on the list. See src/lib/unsubscribe-token.ts.
import { updateSubscribers } from "../src/lib/notify-logic.js";
import { checkRateLimit, clientIp } from "../src/lib/rate-limit.js";
import { verifyUnsubscribeToken } from "../src/lib/unsubscribe-token.js";

export async function GET(request: Request): Promise<Response> {
  const { allowed } = await checkRateLimit(`unsubscribe:${clientIp(request)}`, {
    windowMs: 15 * 60 * 1000,
    max: 10,
  });
  if (!allowed) {
    return html("Too many attempts. Try again in a few minutes.", 429);
  }

  // request.url is just the path in this runtime ("/api/unsubscribe?..."),
  // not a full URL -- the `host` header supplies the base new URL() needs.
  const params = new URL(request.url, `https://${request.headers.get("host")}`).searchParams;
  const email = params
    .get("email")
    ?.trim()
    .toLowerCase()
    .slice(0, 254); // RFC 5321 max mailbox length -- matches subscribe.ts's cap
  const token = params.get("t");

  if (!email) {
    return html("Missing email address.", 400);
  }

  if (!verifyUnsubscribeToken(email, token)) {
    // Deliberately says nothing about whether the address is on the list.
    // Links in mail sent before signing existed will land here; there is
    // no way to honour those without reopening the hole, so point at a
    // human instead of failing silently.
    return html(
      "This unsubscribe link isn't valid. It may be from an older email. " +
        `Get in touch through <a href="/about">the contact details on the site</a> and you'll be removed.`,
      400,
    );
  }

  // Same concurrency-safe path as subscribe.ts -- an unsubscribe landing
  // at the same moment as someone else's signup must not undo it.
  await updateSubscribers((subscribers) => subscribers.filter((s) => s.email !== email));

  // Identical whether or not that address was actually subscribed -- the
  // response must not double as a membership check.
  return html(`${escapeHtml(email)} has been unsubscribed. You won't get any more emails from this site.`, 200);
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function html(message: string, status: number) {
  return new Response(
    `<!doctype html><html><body style="font-family: system-ui, sans-serif; max-width: 32rem; margin: 4rem auto; padding: 0 1rem;"><p>${message}</p></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
