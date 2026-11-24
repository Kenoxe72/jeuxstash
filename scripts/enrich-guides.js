#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const guidesDir = path.join(root, "guides");
const files = fs.readdirSync(guidesDir).filter(f => f.endsWith(".html"));

let updatedDate = new Date().toISOString().slice(0, 10);
try {
  const catalogPath = path.join(root, "js", "catalog.js");
  const sandbox = { window: {} };
  // eslint-disable-next-line no-new-func
  Function("window", fs.readFileSync(catalogPath, "utf8"))(sandbox.window);
  if (sandbox.window.JEUXSTASH_PRICES_UPDATED) {
    updatedDate = String(sandbox.window.JEUXSTASH_PRICES_UPDATED);
  }
} catch (e) {}
const assetVersion = updatedDate.replace(/-/g, "") + "v1";
const dateModifiedIso = `${updatedDate}T12:00:00+01:00`;

let faqCount = 0;
let articleCount = 0;

function esc(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

for (const file of files) {
  const filePath = path.join(guidesDir, file);
  let html = fs.readFileSync(filePath, "utf8");

  // 1. Unified nav (idempotent: match leading horizontal spaces too)
  const unifiedNav = 
`      <nav>
        <a href="/">Accueil</a>
        <a href="/guides/" aria-current="page">Guides</a>
        <a href="/pc-builder">Builder PC</a>
        <a href="/mes-jeux">Mes jeux</a>
        <a class="nav-cta" href="/deals">Catalogue</a>
      </nav>`;
  html = html.replace(/[ \t]*<nav>[\s\S]*?<\/nav>/, unifiedNav);

  // 2. Cache busters synchronized with catalog date
  html = html.replace(/style\.css\?v=[^"]+/g, `style.css?v=${assetVersion}`);
  html = html.replace(/ui\.js\?v=[^"]+/g, `ui.js?v=${assetVersion}`);
  html = html.replace(/deals\.js\?v=[^"]+/g, `deals.js?v=${assetVersion}`);
  html = html.replace(/catalog\.js\?v=[^"]+/g, `catalog.js?v=${assetVersion}`);
  html = html.replace(/guides-data\.js\?v=[^"]+/g, `guides-data.js?v=${assetVersion}`);
  html = html.replace(/guides-list\.js\?v=[^"]+/g, `guides-list.js?v=${assetVersion}`);
  html = html.replace(/season\.js\?v=[^"]+/g, `season.js?v=${assetVersion}`);
  html = html.replace(/verdict\.js\?v=[^"]+/g, `verdict.js?v=${assetVersion}`);
  html = html.replace(/fiche\.js\?v=[^"]+/g, `fiche.js?v=${assetVersion}`);

  if (file === "index.html") {
    const guidesDataPath = path.join(__dirname, "..", "js", "guides-data.js");
    const sandbox = { window: {} };
    // eslint-disable-next-line no-new-func
    Function("window", fs.readFileSync(guidesDataPath, "utf8"))(sandbox.window);
    const guidesList = sandbox.window.JEUXSTASH_GUIDES || [];

    const cardsHtml = guidesList.map((g, i) => {
      const num = String(i + 1).padStart(2, "0");
      const featured = i === 0 ? " guide-card--featured" : "";
      const thumb = g.thumb
        ? `<img class="guide-thumb" src="${g.thumb}" alt="" loading="lazy" width="460" height="215" />`
        : "";
      return `      <a class="guide-card${featured}" href="${g.href}" style="--i:${i}">
        ${thumb}
        <span class="guide-num">${num}</span>
        <span class="guide-kicker">${esc(g.kicker || "Guide")}</span>
        <strong>${esc(g.title)}</strong>
        <span>${esc(g.blurb || "")}</span>
      </a>`;
    }).join("\n");

    html = html.replace(
      /<div class="guide-grid" data-rotate>[\s\S]*?(?=\s*<\/main>)/,
      `<div class="guide-grid" data-rotate>\n${cardsHtml}\n    </div>`
    );

    fs.writeFileSync(filePath, html, "utf8");
    console.log("Pre-rendered", guidesList.length, "guides into guides/index.html");
    continue;
  }

  // 3. Extract metadata
  const titleM = html.match(/<title>([^<]+)<\/title>/);
  const title = titleM ? titleM[1].trim() : "Guide JeuxStash";
  const h1M = html.match(/<h1>([^<]+)<\/h1>/);
  const headline = h1M ? h1M[1].trim() : title;

  const descM = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  const desc = descM ? descM[1].trim() : "";

  const canonM = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const url = canonM ? canonM[1].trim() : `https://www.jeuxstash.fr/guides/${file.replace(".html", "")}`;

  const imgM = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  const img = imgM ? imgM[1].trim() : "https://www.jeuxstash.fr/img/og-default.png";

  // 4. Extract FAQ
  const faqItems = [];
  const faqBlockM = html.match(/<h2[^>]*>.*?faq.*?<\/h2>([\s\S]*?)(?:<h2|<\/article>|<div class="aff-box")/i);
  if (faqBlockM) {
    const faqBody = faqBlockM[1];
    const qMatches = [...faqBody.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi)];
    for (const qm of qMatches) {
      const q = qm[1].replace(/<[^>]+>/g, "").trim();
      const a = qm[2].replace(/<[^>]+>/g, "").trim();
      if (q && a) {
        faqItems.push({
          "@type": "Question",
          name: q,
          acceptedAnswer: {
            "@type": "Answer",
            text: a
          }
        });
      }
    }
  }

  // 5. Build structured data array
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: headline,
      description: desc,
      url: url,
      image: img,
      datePublished: "2026-09-15T10:00:00+02:00",
      dateModified: dateModifiedIso,
      author: {
        "@type": "Organization",
        name: "JeuxStash",
        url: "https://www.jeuxstash.fr/a-propos"
      },
      publisher: {
        "@type": "Organization",
        name: "JeuxStash",
        logo: {
          "@type": "ImageObject",
          url: "https://www.jeuxstash.fr/favicon.svg"
        }
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: "https://www.jeuxstash.fr/"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Guides",
          item: "https://www.jeuxstash.fr/guides/"
        },
        {
          "@type": "ListItem",
          position: 3,
          name: headline,
          item: url
        }
      ]
    }
  ];

  if (faqItems.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems
    });
    faqCount++;
  }

  // Remove existing JSON-LD cleanly (idempotent)
  html = html.replace(/[ \t]*<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>\s*/gi, "");

  // Insert new JSON-LD before </head>
  const ldScript = `  <script type="application/ld+json">\n  ${JSON.stringify(jsonLd)}\n  </script>\n</head>`;
  html = html.replace(/[ \t]*<\/head>/, ldScript);

  fs.writeFileSync(filePath, html, "utf8");
  articleCount++;
}

console.log(`Successfully enriched ${articleCount} guides (${faqCount} with FAQPage schema)`);
