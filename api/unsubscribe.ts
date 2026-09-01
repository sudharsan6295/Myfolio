// One-click unsubscribe -- every notification email links here with the
// subscriber's own address in the query string. Removes them from the
// subscriber list and shows a plain confirmation page. GET (not POST) so
// it works as a plain link click from an email client with no JS involved.
import { getSubscribers, saveSubscribers } from "../src/lib/notify-logic.js";

export async function GET(request: Request): Promise<Response> {
  // request.url is just the path in this runtime ("/api/unsubscribe?..."),
  // not a full URL -- the `host` header supplies the base new URL() needs.
  const email = new URL(request.url, `https://${request.headers.get("host")}`).searchParams
    .get("email")
    ?.trim()
    .toLowerCase()
    .slice(0, 254); // RFC 5321 max mailbox length -- matches subscribe.ts's cap

  if (!email) {
    return html("Missing email address.", 400);
  }

  const subscribers = await getSubscribers();
  await saveSubscribers(subscribers.filter((s) => s.email !== email));

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
