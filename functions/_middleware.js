/** Force le domaine canonique www (apex + hostname Pages de prod — pas les previews *hash*.pages.dev) */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname;
  if (host === "jeuxstash.fr" || host === "jeuxstash.pages.dev") {
    url.hostname = "www.jeuxstash.fr";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
