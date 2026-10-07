/** Force le domaine canonique www (apex + preview Cloudflare Pages) */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname;
  if (host === "jeuxstash.fr" || host === "jeuxstash.pages.dev" || host.endsWith(".jeuxstash.pages.dev")) {
    url.hostname = "www.jeuxstash.fr";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
