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
  const p = formatPrice(game.price);
  if (p && game.stock !== "out") {
    if (name.length <= 26) {
      return name + " pas cher dès " + p + " : prix Instant Gaming — JeuxStash";
    }
    return name + " dès " + p + " : clé Instant Gaming — JeuxStash";
  }
  if (name.length <= 32) {
    return name + " pas cher : prix Instant Gaming & verdict — JeuxStash";
  }
  return name + " : prix Instant Gaming — JeuxStash";
}

function relatedGames(game, catalog, limit) {
  const cats = game.cats || [];
  const catSet = new Set(cats);
  const scored = [];
  for (const g of catalog) {
    if (!g || g.name === game.name) continue;
    if (g.stock === "out" && !(g.cats || []).includes("coming")) continue;
    let score = 0;
    for (const c of g.cats || []) {
      if (catSet.has(c)) score += c === "hot" || c === "pass" ? 1 : 3;
    }
    if (game.tag && g.tag === game.tag) score += 1;
    const plats = game.platforms || [];
    for (const p of g.platforms || []) {
      if (plats.indexOf(p) !== -1) score += 0.5;
    }
    if (score < 2) continue;
    scored.push({ g, score });
  }
  scored.sort(function (a, b) {
    if (b.score !== a.score) return b.score - a.score;
    const pa = a.g.price == null ? 999 : a.g.price;
    const pb = b.g.price == null ? 999 : b.g.price;
    return pa - pb;
  });
  return scored.slice(0, limit || 4).map(function (x) {
    return x.g;
  });
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
        (coming ? "Précommander" : "Voir le prix") +
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

  const related = relatedGames(game, win.JEUXSTASH_CATALOG || [], 4);
  if (related.length) {
    html += '<section class="fiche-block fiche-related"><h2>Dans le même esprit</h2>';
    html += '<ul class="fiche-related-list">';
    for (const r of related) {
      const rSlug = slugify(r.name);
      const rPrice = formatPrice(r.price);
      html +=
        '<li><a href="/jeu/' +
        esc(rSlug) +
        '/"><span class="fiche-related-name">' +
        esc(r.name) +
        "</span>" +
        (rPrice
          ? '<span class="fiche-related-price">' + rPrice + "</span>"
          : '<span class="fiche-related-price fiche-related-price--muted">Voir</span>') +
        "</a></li>";
    }
    html += "</ul></section>";
  }

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
  html += "</div></section>";

  if (!oos && game.ig) {
    html +=
      '<div class="sticky-aff" aria-label="Acheter ou comparer">' +
      '<span class="sticky-aff-label">' +
      esc(game.name) +
      "</span>" +
      '<a class="btn buy small" href="' +
      esc(game.ig) +
      '" rel="sponsored noopener" target="_blank">' +
      (coming ? "Préco" : "Clé") +
      (price ? " " + price : "") +
      "</a>" +
      '<a class="btn ghost small" href="' +
      esc(game.gg || "https://gg.deals/") +
      '" rel="noopener" target="_blank">Comparer</a>' +
      "</div>";
  }

  html += "</article>";
  return html;
}

function buildPage(template, game, slug, win) {
  const priceLabel = formatPrice(game.price);
  const V = win.JEUXSTASH_VERDICT;
  const verdict = V ? V.for(game) : null;
  const title = seoTitle(game);
  let desc = game.blurb || "Fiche JeuxStash";
  if (priceLabel && game.stock !== "out") {
    desc =
      game.name +
      " au meilleur prix dès " +
      priceLabel.replace(/\u00a0/g, " ") +
      " sur Instant Gaming. Verdict : " +
      (verdict ? verdict.label : "Acheter") +
      ". Comparez avant d’acheter et vérifiez la config PC.";
  } else {
    desc =
      game.name +
      " — comparez le prix clé Instant Gaming et boutiques officielles. Verdict : " +
      (verdict ? verdict.label : "Attendre") +
      ". Config PC et disponibilité en direct.";
  }

  const url = "https://www.jeuxstash.fr/jeu/" + slug + "/";
  const img = coverOf(game);
  const jsonLd = [
    {
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
        ...(game.price && game.stock !== "out"
          ? {
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "EUR",
                lowPrice: Number(game.price),
                offerCount: 1,
                offers: [
                  {
                    "@type": "Offer",
                    price: Number(game.price),
                    priceCurrency: "EUR",
                    availability: "https://schema.org/InStock",
                    url: game.ig || url,
                    seller: {
                      "@type": "Organization",
                      name: "Instant Gaming",
                    },
                  },
                ],
              },
            }
          : {}),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: "https://www.jeuxstash.fr/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Catalogue",
          item: "https://www.jeuxstash.fr/deals",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: game.name,
          item: url,
        },
      ],
    },
  ];

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

  html = html.replace(/fiche\.js\?v=[^"]+/g, "fiche.js?v=20261028fix");
  html = html.replace(/jeu\.js\?v=[^"]+/g, "jeu.js?v=20261028fix");
  html = html.replace(/ui\.js\?v=[^"]+/g, "ui.js?v=20261028fix");
  html = html.replace(/style\.css\?v=[^"]+/g, "style.css?v=20261028design");
  html = html.replace(/verdict\.js\?v=[^"]+/g, "verdict.js?v=20261028fix");
  html = html.replace(/watchlist\.js\?v=[^"]+/g, "watchlist.js?v=20261028fix");

  return html;

  return html;
}

function writeSitemaps(slugs) {
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

  const guidesDir = path.join(root, "guides");
  let guideLocs = [];
  if (fs.existsSync(guidesDir)) {
    for (const ent of fs.readdirSync(guidesDir)) {
      if (ent.endsWith(".html") && ent !== "index.html") {
        guideLocs.push("/guides/" + ent.replace(/\.html$/, ""));
      }
    }
  }
  guideLocs.sort();

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
  const xml = lines.join("\n");

  fs.writeFileSync(path.join(root, "sitemap.xml"), xml, "utf8");
  fs.writeFileSync(path.join(root, "sitemap-jeux.xml"), xml, "utf8");
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

  writeSitemaps(slugs);
  console.log("Generated", slugs.length, "fiches under /jeu/{slug}/");
  console.log("Updated sitemap.xml and sitemap-jeux.xml with", slugs.length + 30, "URLs");
}

main();
