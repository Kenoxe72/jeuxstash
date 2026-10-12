/** Canonique www + coquille /jeu → /deals en un seul saut */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname;
  const rawPath = url.pathname;
  const path = rawPath.replace(/\/+$/, "") || "/";
  const isJeuShell =
    path === "/jeu" || rawPath === "/jeu/index.html" || path === "/jeu/index.html";

  // /jeu (avec ou sans slash) → deals, depuis n’importe quel hostname
  if (isJeuShell) {
    return Response.redirect("https://www.jeuxstash.fr/deals", 301);
  }

  if (host === "jeuxstash.fr" || host === "jeuxstash.pages.dev") {
    url.hostname = "www.jeuxstash.fr";
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
