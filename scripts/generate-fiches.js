#!/usr/bin/env node
/**
 * Génère /jeu/{slug}/index.html pour chaque jeu du catalogue.
 * Contenu SEO en HTML statique (titre, prix, verdict, CTA) + schema Product.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const catalogPath = path.join(root, "js", "catalog.js");
const verdictPath = path.join(root, "js", "verdict.js");
const templatePath = path.join(root, "jeu", "index.html");
const sitemapPath = path.join(root, "sitemap-jeux.xml");

function slugify(name) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function esc(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatPrice(n) {
  if (n == null || Number.isNaN(Number(n))) return null;
  return (
    Number(n).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + "\u00a0€"
  );
}

function loadWindow() {
  const sandbox = { window: {} };
  // eslint-disable-next-line no-new-func
  Function("window", fs.readFileSync(catalogPath, "utf8"))(sandbox.window);
  // eslint-disable-next-line no-new-func
  Function("window", fs.readFileSync(verdictPath, "utf8"))(sandbox.window);
  return sandbox.window;
}

function coverOf(game) {
  if (game.cover) return game.cover;
  if (game.steam) {
    return "https://cdn.cloudflare.steamstatic.com/steam/apps/" + game.steam + "/header.jpg";
  }
  return "https://www.jeuxstash.fr/img/og-default.png";
}

function bannerOf(game) {
  if (game.steam) {
    return "https://cdn.cloudflare.steamstatic.com/steam/apps/" + game.steam + "/capsule_616x353.jpg";
  }
  return coverOf(game);
}

function platLabel(game) {
  const plats = game.platforms || [];
  const labels = { pc: "PC", ps5: "PS5", switch: "Switch", xbox: "Xbox" };
  return plats
    .map(function (p) {
      return labels[p] || p;
    })
    .join(" · ");
}

function guideFor(game) {
  const map = {
    "Elden Ring": "/guides/elden-ring-pas-cher",
    "Cyberpunk 2077": "/guides/cyberpunk-pas-cher",
    "Baldur's Gate 3": "/guides/baldurs-gate-3-pas-cher",
    "Forza Horizon 5": "/guides/forza-horizon-5-pas-cher",
    "EA Sports FC 27": "/guides/ea-fc-pas-cher",
    "Grand Theft Auto VI": "/guides/gta-6-pas-cher",
    "Black Myth: Wukong": "/guides/black-myth-wukong-pas-cher",
    "Clair Obscur: Expedition 33": "/guides/expedition-33-pas-cher",
    "Disco Elysium": "/guides/disco-elysium-pas-cher",
    "Far Cry 5": "/guides/far-cry-5-pas-cher",
  };
  if (map[game.name]) return map[game.name];
  if ((game.name || "").indexOf("Call of Duty") === 0) return "/guides/call-of-duty-pas-cher";
  return null;
}

/** Titre SERP court, orienté clic (prix / Instant Gaming) */
function seoTitle(game) {
  const name = game.name || "Jeu";
  if (name.length <= 32) {
    return name + " pas cher : prix Instant Gaming — JeuxStash";
  }
  return name + " : prix Instant Gaming — JeuxStash";
}

function buildStaticArticle(game, win) {
  const price = formatPrice(game.price);
  const oos = game.stock === "out";
  const Coming = win.JEUXSTASH_COMING;
  const coming = Coming && Coming.isComing(game);
  const V = win.JEUXSTASH_VERDICT;
  const verdict = V ? V.for(game) : null;
  const cover = bannerOf(game);
  const coverFb = coverOf(game);
  const guide = guideFor(game);
  const plats = platLabel(game);

  let html = '<article class="fiche" data-static="1">';
  if (cover) {
    html +=
      '<div class="fiche-banner"><img class="fiche-cover" src="' +
      esc(cover) +
      '" alt="' +
      esc(game.name) +
      '" width="616" height="353" loading="eager" fetchpriority="high"' +
      (coverFb && coverFb !== cover ? ' data-fallback="' + esc(coverFb) + '"' : "") +
      " /></div>";
  }
  html += '<div class="fiche-hero"><div class="fiche-kicker">';
  html += '<span class="tag">' + esc(game.tag || "Jeu") + "</span>";
  if (coming && Coming) {
    html +=
      '<span class="verdict-chip verdict-chip--wait">' + esc(Coming.label(game)) + "</span>";
  }
  if (verdict && V) html += V.chipHTML(game);
  html += "</div>";
  html += "<h1>" + esc(game.name) + "</h1>";
  html += '<p class="fiche-blurb">' + esc(game.blurb || "") + "</p>";
  if (plats) html += '<p class="fine">Plateformes : ' + esc(plats) + "</p>";
  if (verdict && verdict.compare) {
    html += '<p class="price-compare">' + esc(verdict.compare) + "</p>";
  }
  if (verdict && verdict.title) {
    html += '<p class="fiche-verdict-why">' + esc(verdict.title) + "</p>";
  }
  html += '<div class="fiche-price-row">';
  if (oos && !coming) {
    html += '<span class="btn buy is-oos" aria-disabled="true">Clé en rupture</span>';
  } else {
    if (price) html += '<span class="fiche-price">' + price + "</span>";
    if (game.ig) {
      html +=
        '<a class="btn buy" href="' +
        esc(game.ig) +
        '" rel="sponsored noopener" target="_blank">' +
        (coming ? "Précommander sur Instant Gaming" : "Voir le prix sur Instant Gaming") +
        "</a>";
    }
  }
  html +=
    '<a class="btn ghost" href="' +
    esc(game.gg || "https://gg.deals/") +
    '" rel="noopener" target="_blank">Comparer</a>';
  if (guide) html += '<a class="btn ghost" href="' + guide + '">Guide d’achat</a>';
  html += "</div>";
  html +=
    '<p class="fine">Prix indicatif Instant Gaming (affiliation) — vous payez le même prix. JeuxStash n’est pas une boutique.</p>';
  html += "</div>";

  html += '<div class="fiche-grid">';
  html += '<section class="fiche-block" id="fiche-resume"><h2>Résumé</h2>';
  html +=
    '<p class="fine" id="fiche-resume-status">Résumé éditorial JeuxStash' +
    (game.steam ? " — détails Steam ci-dessous si disponibles." : ".") +
    "</p>";
  html +=
    '<div id="fiche-resume-body"><p>' +
    esc(game.blurb || "Fiche JeuxStash pour comparer le prix avant d’acheter.") +
    "</p></div></section>";

  html += '<section class="fiche-block" id="fiche-specs"><h2>Config PC</h2>';
  if (game.steam) {
    html +=
      '<p class="fine" id="fiche-specs-status">Prérequis Steam chargés si JavaScript est actif.</p>';
    html +=
      '<div id="fiche-specs-body" class="fiche-specs-body"><p>Voir aussi la fiche <a href="https://store.steampowered.com/app/' +
      esc(String(game.steam)) +
      '/" rel="noopener" target="_blank">Steam</a>.</p></div>';
  } else {
    html +=
      '<p class="fine" id="fiche-specs-status" hidden></p><div id="fiche-specs-body" class="fiche-specs-body"><p>Pas d’ID Steam — la config dépend de la plateforme (console / store).</p></div>';
  }
  html += "</section></div>";

  html += '<section class="fiche-block fiche-cta"><h2>Prêt à comparer&nbsp;?</h2>';
  html +=
    "<p>Regardez le prix clé, vérifiez ailleurs, puis achetez seulement si le verdict vous convient.</p><div class=\"row\">";
  if (!oos && game.ig) {
    html +=
      '<a class="btn buy" href="' +
      esc(game.ig) +
      '" rel="sponsored noopener" target="_blank">Instant Gaming</a>';
  }
  html +=
    '<a class="btn ghost" href="' +
    esc(game.gg || "https://gg.deals/") +
    '" rel="noopener" target="_blank">GG.deals</a>';
  html += '<a class="btn ghost" href="/deals">Retour catalogue</a>';
  html += "</div></section></article>";
  return html;
}

function buildPage(template, game, slug, win) {
  const priceLabel = formatPrice(game.price);
  const V = win.JEUXSTASH_VERDICT;
  const verdict = V ? V.for(game) : null;
  const title = seoTitle(game);
  let desc = game.blurb || "Fiche JeuxStash";
  if (priceLabel) {
    desc =
      game.name +
      " à " +
      priceLabel.replace(/\u00a0/g, " ") +
      " sur Instant Gaming (indicatif). " +
      desc;
  } else {
    desc = game.name + " — prix Instant Gaming à comparer. " + desc;
  }
  if (verdict) desc += " Verdict : " + verdict.label + ".";
  desc += " Comparez avant d’acheter.";

  const url = "https://www.jeuxstash.fr/jeu/" + slug + "/";
  const img = coverOf(game);
  // Pas de Product/Offer : on n’est pas marchand — évite les alertes GSC « Achats »
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: desc,
    url: url,
    isPartOf: {
      "@type": "WebSite",
      name: "JeuxStash",
      url: "https://www.jeuxstash.fr/",
    },
    about: {
      "@type": "VideoGame",
      name: game.name,
      description: game.blurb || desc,
      image: img,
      url: url,
      applicationCategory: "Game",
      operatingSystem: platLabel(game) || "PC",
    },
  };

  let html = template;
  html = html.replace(/\s*<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?>\s*/gi, "\n  ");
  html = html.replace(/<title>[^<]*<\/title>/, "<title>" + esc(title) + "</title>");
  html = html.replace(
    /<meta id="meta-desc" name="description" content="[^"]*" \/>/,
    '<meta id="meta-desc" name="description" content="' + esc(desc) + '" />'
  );
  html = html.replace(
    /<link id="canonical" rel="canonical" href="[^"]*" \/>/,
    '<link id="canonical" rel="canonical" href="' + esc(url) + '" />'
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*" \/>/,
    '<meta property="og:image" content="' +
      esc(img) +
      '" />\n' +
      '  <meta property="og:title" content="' +
      esc(title) +
      '" />\n' +
      '  <meta property="og:url" content="' +
      esc(url) +
      '" />\n' +
      '  <meta property="og:description" content="' +
      esc(desc) +
      '" />'
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*" \/>/,
    '<meta name="twitter:image" content="' +
      esc(img) +
      '" />\n' +
      '  <meta name="twitter:title" content="' +
      esc(title) +
      '" />'
  );

  const article = buildStaticArticle(game, win);
  html = html.replace(
    /<div id="fiche-root" class="fiche-root">[\s\S]*?<\/div>\s*<\/main>/,
    '<div id="fiche-root" class="fiche-root" data-slug="' +
      esc(slug) +
      '" data-static="1">\n' +
      article +
      "\n    </div>\n  </main>"
  );

  const ldTag =
    '<script type="application/ld+json">' + JSON.stringify(jsonLd) + "</script>\n</head>";
  html = html.replace("</head>", ldTag);

  html = html.replace(/fiche\.js\?v=[^"]+/g, "fiche.js?v=20261008static");
  html = html.replace(/jeu\.js\?v=[^"]+/g, "jeu.js?v=20261008static");
  html = html.replace(/style\.css\?v=[^"]+/g, "style.css?v=20261008static");

  return html;
}

function writeSitemap(slugs, guidesXmlPath) {
  const today = new Date().toISOString().slice(0, 10);
  const origin = "https://www.jeuxstash.fr";
  const staticUrls = [
    "/",
    "/deals",
    "/pc-builder",
    "/a-propos",
    "/mentions-legales",
    "/confidentialite",
    "/guides/",
  ];

  let guideLocs = [];
  if (fs.existsSync(guidesXmlPath)) {
    const prev = fs.readFileSync(guidesXmlPath, "utf8");
    const re = /<loc>(https:\/\/www\.jeuxstash\.fr\/guides\/[^<]+)<\/loc>/g;
    let m;
    while ((m = re.exec(prev))) guideLocs.push(m[1].replace(origin, ""));
  }
  guideLocs = Array.from(new Set(guideLocs));

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  function add(loc) {
    lines.push(
      "  <url><loc>" + origin + loc + "</loc><lastmod>" + today + "</lastmod></url>"
    );
  }
  staticUrls.forEach(add);
  guideLocs.forEach(add);
  slugs.forEach(function (s) {
    add("/jeu/" + s + "/");
  });
  lines.push("</urlset>", "");
  fs.writeFileSync(guidesXmlPath, lines.join("\n"), "utf8");
}

function main() {
  const win = loadWindow();
  const catalog = win.JEUXSTASH_CATALOG;
  if (!Array.isArray(catalog) || !catalog.length) throw new Error("empty catalog");
  const template = fs.readFileSync(templatePath, "utf8");
  const slugs = [];
  const seen = new Set();

  for (const ent of fs.readdirSync(path.join(root, "jeu"), { withFileTypes: true })) {
    if (ent.isDirectory()) {
      fs.rmSync(path.join(root, "jeu", ent.name), { recursive: true, force: true });
    }
  }

  for (const game of catalog) {
    const slug = slugify(game.name);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
    const dir = path.join(root, "jeu", slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), buildPage(template, game, slug, win), "utf8");
  }

  writeSitemap(slugs, sitemapPath);
  console.log("Generated", slugs.length, "fiches under /jeu/{slug}/");
}

main();
