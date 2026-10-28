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
    return "https://cdn.cloudflare.steamstatic.com/steam/apps/" + game.steam + "/capsule_616x353.jpg";
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

function launcherInfo(game) {
  const ig = String(game.ig || "").toLowerCase();
  const plats = game.platforms || ["pc"];
  if ((game.cats || []).includes("pass")) {
    return {
      storeName: "Microsoft / Xbox Game Pass",
      steps: [
        "Achetez votre code d’abonnement sur Instant Gaming et récupérez-le immédiatement dans votre espace client.",
        "Rendez-vous sur redeem.microsoft.com ou dans l’application Xbox (PC / Console) avec votre compte Microsoft.",
        "Saisissez le code à 25 caractères pour activer vos mois de Game Pass instantanément.",
      ],
    };
  }
  if (ig.includes("battle-net")) {
    return {
      storeName: "Battle.net (PC)",
      steps: [
        "Une fois le paiement validé sur Instant Gaming, copiez le code d’activation affiché dans « Mes commandes ».",
        "Ouvrez le launcher Battle.net sur votre PC (ou account.battle.net/overview).",
        "Cliquez sur « Utiliser un code », collez votre clé et lancez le téléchargement.",
      ],
    };
  }
  if (ig.includes("ubisoft-connect")) {
    return {
      storeName: "Ubisoft Connect (PC)",
      steps: [
        "Récupérez votre clé ou utilisez le lien d’activation directe Ubisoft depuis votre compte Instant Gaming.",
        "Connectez-vous à votre compte dans l’application Ubisoft Connect PC.",
        "Le jeu s’ajoute automatiquement à votre bibliothèque PC sans surcoût.",
      ],
    };
  }
  if (ig.includes("ea-app") || ig.includes("origin")) {
    return {
      storeName: "EA App (PC)",
      steps: [
        "Copiez votre code produit reçu instantanément après l’achat sur Instant Gaming.",
        "Ouvrez l’application EA App sur votre PC et allez dans « Bibliothèque » → « Utiliser un code ».",
        "Collez la clé pour lier définitivement le jeu à votre compte EA.",
      ],
    };
  }
  if (ig.includes("rockstar")) {
    return {
      storeName: "Rockstar Games Launcher (PC)",
      steps: [
        "Copiez la clé Rockstar affichée dans votre historique d’achats Instant Gaming.",
        "Ouvrez le Rockstar Games Launcher sur PC et cliquez sur votre profil → « Utiliser un code ».",
        "Validez le code pour télécharger le jeu complet.",
      ],
    };
  }
  if (ig.includes("gog-com")) {
    return {
      storeName: "GOG.com (PC — sans DRM)",
      steps: [
        "Copiez votre code GOG depuis votre compte Instant Gaming.",
        "Ouvrez GOG Galaxy ou rendez-vous sur gog.com/redeem.",
        "Entrez la clé pour ajouter le jeu sans DRM à votre bibliothèque.",
      ],
    };
  }
  if (ig.includes("microsoft-store") || (plats.includes("xbox") && !game.steam)) {
    return {
      storeName: "Microsoft Store (Xbox / PC)",
      steps: [
        "Récupérez votre code à 25 caractères immédiatement après l’achat sur Instant Gaming.",
        "Ouvrez le Microsoft Store sur PC, votre console Xbox ou la page redeem.microsoft.com.",
        "Collez le code pour débloquer le jeu sur votre compte Microsoft.",
      ],
    };
  }
  if (ig.includes("playstation-store") || (plats.includes("ps5") && !plats.includes("pc"))) {
    return {
      storeName: "PlayStation Store (PS5 / PS4)",
      steps: [
        "Récupérez votre code PSN à 12 caractères dans votre compte Instant Gaming.",
        "Sur votre PS5/PS4, ouvrez le PlayStation Store → menu « … » → « Utiliser un code ».",
        "Validez le code pour lancer le téléchargement sur votre console.",
      ],
    };
  }
  if (ig.includes("nintendo-eshop") || (plats.includes("switch") && !plats.includes("pc"))) {
    return {
      storeName: "Nintendo eShop (Switch)",
      steps: [
        "Copiez votre code Nintendo eShop à 16 caractères depuis Instant Gaming.",
        "Ouvrez le Nintendo eShop sur votre Switch et sélectionnez « Enregistrer un code ».",
        "Entrez le code pour télécharger le jeu sur votre console.",
      ],
    };
  }
  return {
    storeName: "Steam (PC)",
    steps: [
      "Après l’achat sur Instant Gaming, copiez votre clé Steam (format XXXXX-XXXXX-XXXXX) dans « Mes commandes ».",
      "Ouvrez Steam sur votre PC, puis cliquez en bas à gauche sur « + Ajouter un jeu » → « Activer un produit sur Steam… ».",
      "Collez la clé : le jeu officiel complet (mises à jour et multijoueur inclus) est lié à vie à votre compte Steam.",
    ],
  };
}

function buildFaqItems(game, verdict, info, price, oos, coming) {
  const storePrice = verdict && verdict.store ? formatPrice(verdict.store) : null;
  const saveEuro = verdict && verdict.saveEuro ? formatPrice(verdict.saveEuro) : null;
  const pct = verdict && verdict.savePct ? verdict.savePct : null;
  const items = [];

  // Q1: Prix & économie
  let a1 = "";
  if (price && !oos) {
    a1 =
      game.name +
      " est actuellement affiché aux alentours de " +
      price.replace(/\u00a0/g, " ") +
      " en clé digitale sur Instant Gaming";
    if (storePrice && saveEuro && pct) {
      a1 +=
        ", contre environ " +
        storePrice.replace(/\u00a0/g, " ") +
        " sur la boutique officielle (" +
        info.storeName +
        "), soit une économie de " +
        saveEuro.replace(/\u00a0/g, " ") +
        " (−" +
        pct +
        " %).";
    } else if (storePrice) {
      a1 += " (prix boutique indicatif : " + storePrice.replace(/\u00a0/g, " ") + ").";
    } else {
      a1 += ".";
    }
  } else if (coming) {
    a1 =
      game.name +
      " est en précommande ou à venir" +
      (price ? " autour de " + price.replace(/\u00a0/g, " ") : "") +
      ". Comparez le tarif sur Instant Gaming et GG.deals avant la sortie.";
  } else {
    a1 =
      "La clé " +
      game.name +
      " est momentanément en rupture de stock sur Instant Gaming" +
      (storePrice ? " (prix boutique officiel : " + storePrice.replace(/\u00a0/g, " ") + ")" : "") +
      ". Vous pouvez activer une alerte stock ou comparer les autres boutiques via GG.deals.";
  }
  items.push({
    q: "Quel est le meilleur prix pour " + game.name + " ?",
    a: a1,
  });

  // Q2: Plateforme & activation
  items.push({
    q: "Sur quelle plateforme s’active la clé " + game.name + " ?",
    a:
      "L’offre référencée pour " +
      game.name +
      " s’active sur " +
      info.storeName +
      ". Une fois la clé activée, vous téléchargez exactement la même version officielle complète qu’en achetant directement sur la boutique.",
  });

  // Q3: Game Pass & Verdict
  const passText =
    verdict && verdict.pass
      ? "Oui, " +
        game.name +
        " fait partie des titres régulièrement présents dans le catalogue Xbox / PC Game Pass. Si vous voulez conserver le jeu définitivement, la clé digitale reste souvent plus rentable dès quelques semaines de jeu."
      : "Non, " +
        game.name +
        " n’est pas inclus par défaut dans le Game Pass actuellement. Le verdict JeuxStash est « " +
        (verdict ? verdict.label : "Acheter") +
        " » : " +
        (verdict && verdict.title
          ? verdict.title.charAt(0).toLowerCase() + verdict.title.slice(1)
          : "comparez le prix clé avant de passer commande.");
  items.push({
    q: game.name + " est-il dans le Game Pass ou vaut-il mieux l’acheter ?",
    a: passText,
  });

  return items;
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
  if (verdict && V && V.compareHTML) {
    html += V.compareHTML(game);
  } else if (verdict && verdict.compare) {
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

  const info = launcherInfo(game);
  const storePrice = verdict && verdict.store ? formatPrice(verdict.store) : null;
  const saveEuro = verdict && verdict.saveEuro ? formatPrice(verdict.saveEuro) : null;
  const pct = verdict && verdict.savePct ? verdict.savePct : null;

  // Tableau comparatif Prix Clé vs Boutique vs Game Pass
  html += '<section class="fiche-block fiche-compare-section">';
  html += "<h2>Comparatif prix &amp; éditions — " + esc(game.name) + "</h2>";
  html += '<div class="fiche-compare-table" role="region" aria-label="Comparatif des offres">';
  // Ligne 1 : Instant Gaming
  html += '<div class="fiche-compare-row fiche-compare-row--best">';
  html += '<div class="fiche-compare-col fiche-compare-col--source">';
  html += "<strong>Clé digitale Instant Gaming</strong>";
  html += "<span>Activation officielle sur " + esc(info.storeName) + "</span>";
  html += "</div>";
  html += '<div class="fiche-compare-col fiche-compare-col--price">';
  if (price && !oos) {
    html += '<strong class="fiche-compare-val">' + price + "</strong>";
    if (saveEuro && pct) {
      html += '<span class="save-euro">−' + saveEuro + " (−" + pct + "\u00a0%)</span>";
    }
  } else if (coming && price) {
    html += '<strong class="fiche-compare-val">' + price + "</strong>";
    html += '<span class="tag">Précommande</span>';
  } else {
    html += '<span class="fiche-compare-muted">Temporairement en rupture</span>';
  }
  html += "</div>";
  html += '<div class="fiche-compare-col fiche-compare-col--cta">';
  if ((!oos || coming) && game.ig) {
    html +=
      '<a class="btn buy small" href="' +
      esc(game.ig) +
      '" rel="sponsored noopener" target="_blank">' +
      (coming ? "Précommander" : "Voir l’offre") +
      "</a>";
  } else {
    html +=
      '<a class="btn ghost small" href="' +
      esc(game.gg || "https://gg.deals/") +
      '" rel="noopener" target="_blank">Comparer stocks</a>';
  }
  html += "</div></div>";

  // Ligne 2 : Boutique officielle
  if (storePrice) {
    html += '<div class="fiche-compare-row">';
    html += '<div class="fiche-compare-col fiche-compare-col--source">';
    html += "<strong>Boutique officielle (" + esc(info.storeName) + ")</strong>";
    html += "<span>Tarif public conseillé hors soldes</span>";
    html += "</div>";
    html += '<div class="fiche-compare-col fiche-compare-col--price">';
    html += '<span class="fiche-compare-store">' + storePrice + "</span>";
    html += "</div>";
    html += '<div class="fiche-compare-col fiche-compare-col--cta">';
    if (game.steam) {
      html +=
        '<a class="btn ghost small" href="https://store.steampowered.com/app/' +
        esc(String(game.steam)) +
        '/" rel="noopener" target="_blank">Page Steam</a>';
    } else {
      html += '<span class="fine">Tarif référence</span>';
    }
    html += "</div></div>";
  }

  // Ligne 3 : Game Pass
  html += '<div class="fiche-compare-row">';
  html += '<div class="fiche-compare-col fiche-compare-col--source">';
  html += "<strong>Abonnement Game Pass (PC / Xbox)</strong>";
  html +=
    "<span>" +
    (verdict && verdict.pass
      ? "Régulièrement inclus dans le catalogue Game Pass"
      : "Achat à l’unité uniquement (non inclus par défaut)") +
    "</span>";
  html += "</div>";
  html += '<div class="fiche-compare-col fiche-compare-col--price">';
  html +=
    '<span class="fiche-compare-muted">' +
    (verdict && verdict.pass ? "Inclus avec l’abo" : "Non inclus") +
    "</span>";
  html += "</div>";
  html += '<div class="fiche-compare-col fiche-compare-col--cta">';
  if (verdict && verdict.pass) {
    html += '<a class="btn ghost small" href="/deals?style=pass">Voir les abos</a>';
  } else {
    html += '<a class="btn ghost small" href="/guides/game-pass-vs-acheter">Abo ou achat ?</a>';
  }
  html += "</div></div>";
  html += "</div></section>";

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
      '/" rel="noopener" target="_blank">Steam</a> ou tester sur notre <a href="/pc-builder">Builder PC</a>.</p></div>';
  } else {
    html +=
      '<p class="fine" id="fiche-specs-status" hidden></p><div id="fiche-specs-body" class="fiche-specs-body"><p>Pas d’ID Steam — la config dépend de la plateforme (' +
      esc(info.storeName) +
      '). Voir nos <a href="/pc-builder">configs PC gaming</a>.</p></div>';
  }
  html += "</section></div>";

  // Comment activer sa clé en 3 étapes
  html += '<section class="fiche-block fiche-activation">';
  html += "<h2>Comment activer votre clé " + esc(game.name) + " sur " + esc(info.storeName) + "</h2>";
  html += '<ol class="steps">';
  for (const st of info.steps) {
    html += "<li>" + esc(st) + "</li>";
  }
  html += "</ol>";
  html +=
    '<p class="fine">Besoin de vérifier si votre machine suit ? Comparez votre matériel sur notre <a href="/pc-builder">simulateur Builder PC</a> ou lisez notre guide <a href="/guides/instant-gaming-fiable">Instant Gaming est-il fiable ?</a>.</p>';
  html += "</section>";

  // FAQ dynamique par jeu
  const faqItems = buildFaqItems(game, verdict, info, price, oos, coming);
  if (faqItems.length) {
    html += '<section class="fiche-block fiche-faq"><h2>Questions fréquentes — ' + esc(game.name) + "</h2>";
    html += '<div class="faq-list">';
    faqItems.forEach(function (item, idx) {
      html += "<details" + (idx === 0 ? " open" : "") + ">";
      html += "<summary>" + esc(item.q) + "</summary>";
      html += '<div class="faq-a"><p>' + esc(item.a) + "</p></div>";
      html += "</details>";
    });
    html += "</div></section>";
  }

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
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: buildFaqItems(
        game,
        verdict,
        launcherInfo(game),
        priceLabel,
        game.stock === "out",
        win.JEUXSTASH_COMING && win.JEUXSTASH_COMING.isComing(game)
      ).map(function (it) {
        return {
          "@type": "Question",
          name: it.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: it.a,
          },
        };
      }),
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

  html = html.replace(/fiche\.js\?v=[^"]+/g, "fiche.js?v=20261029v2");
  html = html.replace(/jeu\.js\?v=[^"]+/g, "jeu.js?v=20261029v2");
  html = html.replace(/ui\.js\?v=[^"]+/g, "ui.js?v=20261029v2");
  html = html.replace(/style\.css\?v=[^"]+/g, "style.css?v=20261029v2");
  html = html.replace(/verdict\.js\?v=[^"]+/g, "verdict.js?v=20261029v2");
  html = html.replace(/catalog\.js\?v=[^"]+/g, "catalog.js?v=20261029v2");
  html = html.replace(/watchlist\.js\?v=[^"]+/g, "watchlist.js?v=20261029v2");

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
  preRenderDeals(win, catalog);
  preRenderHome(win, catalog);
  console.log("Generated", slugs.length, "fiches under /jeu/{slug}/");
  console.log("Updated sitemap.xml and sitemap-jeux.xml with", slugs.length + 30, "URLs");
}

function preRenderDeals(win, catalog) {
  const dealsHtmlPath = path.join(root, "deals.html");
  if (!fs.existsSync(dealsHtmlPath)) return;
  let html = fs.readFileSync(dealsHtmlPath, "utf8");

  function platformsOf(g) {
    if (g.platforms && g.platforms.length) return g.platforms;
    return ["pc"];
  }

  function coverUrl(g) {
    if (g.cover) return g.cover;
    if (g.steam) {
      return "https://cdn.cloudflare.steamstatic.com/steam/apps/" + g.steam + "/capsule_616x353.jpg";
    }
    return "";
  }

  function badgesHTML(g) {
    const oos = g.stock === "out";
    const price = formatPrice(g.price);
    let badges = "";
    if (oos) {
      badges += '<span class="game-badge game-badge--out">Rupture</span>';
    }
    if (price) {
      badges += '<span class="game-badge game-badge--price">' + price + '</span>';
    }
    return badges ? '<span class="game-badges">' + badges + '</span>' : "";
  }

  function guideLink(g) {
    const map = {
      "Elden Ring": "/guides/elden-ring-pas-cher",
      "Cyberpunk 2077": "/guides/cyberpunk-pas-cher",
      "Baldur's Gate 3": "/guides/baldurs-gate-3-pas-cher",
      "Forza Horizon 5": "/guides/forza-horizon-5-pas-cher",
      "EA Sports FC 27": "/guides/ea-fc-pas-cher",
      "Grand Theft Auto VI": "/guides/gta-6-pas-cher",
    };
    if (map[g.name]) return '<a class="btn ghost small" href="' + map[g.name] + '">Guide</a>';
    if ((g.name || "").indexOf("Call of Duty") === 0) {
      return '<a class="btn ghost small" href="/guides/call-of-duty-pas-cher">Guide</a>';
    }
    return "";
  }

  const cardsHtml = catalog.map(function (game, index) {
    const slug = slugify(game.name);
    const fiche = "/jeu/" + slug + "/";
    const cover = coverUrl(game);
    const name = esc(game.name);
    const blurb = esc(game.blurb || "");
    const tag = esc(game.tag || "");
    const gg = esc(game.gg || ("https://gg.deals/games/?title=" + encodeURIComponent(game.name)));
    const oos = game.stock === "out";
    const cats = (game.cats || []).join(" ");
    const plats = platformsOf(game).join(" ");
    const i = Math.min(index, 12);
    const price = formatPrice(game.price);

    const img = cover
      ? '<img class="game-cover" src="' + cover + '" alt="' + name + '" width="460" height="215" loading="lazy" />'
      : '<div class="game-cover game-cover--empty" aria-hidden="true"></div>';

    let verdictChip = "";
    let compareHtml = "";
    if (win && win.JEUXSTASH_VERDICT) {
      verdictChip = win.JEUXSTASH_VERDICT.chipHTML(game);
      compareHtml = win.JEUXSTASH_VERDICT.compareHTML(game);
    }

    let buyBtn = "";
    if (game.ig) {
      if (oos) {
        buyBtn = '<span class="btn buy small is-oos" aria-disabled="true">Clé en rupture</span>';
      } else {
        buyBtn = '<a class="btn buy small" href="' + esc(game.ig) + '" rel="sponsored noopener" target="_blank">Clé digitale' + (price ? ' — ' + price : '') + '</a>';
      }
    }

    return (
      '      <article class="game-card anim-card' + (oos ? ' is-oos' : '') + '" style="--i:' + i + '" data-name="' + game.name.toLowerCase().replace(/"/g, "") + '" data-cats="' + cats + '" data-platforms="' + plats + '">' +
      '<div class="game-cover-wrap">' +
      '<a class="game-cover-link" href="' + fiche + '">' +
      img +
      badgesHTML(game) +
      '</a>' +
      '</div>' +
      '<div class="game-card-body">' +
      '<div class="card-meta">' +
      '<span class="tag">' + tag + '</span>' +
      verdictChip +
      '</div>' +
      '<h3><a class="game-title-link" href="' + fiche + '">' + name + '</a></h3>' +
      '<p>' + blurb + '</p>' +
      compareHtml +
      '<div class="row row--actions">' +
      buyBtn +
      '<a class="btn ghost small" href="' + gg + '" rel="noopener" target="_blank">Comparer</a>' +
      guideLink(game) +
      '<button type="button" class="btn-icon js-share-deal" data-name="' + name + '" title="Copier le lien" aria-label="Partager">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 3.9M15.4 6.6l-6.8 3.9"/></svg>' +
      '</button>' +
      '</div></div></article>'
    );
  }).join("\n");

  html = html.replace(
    /<div id="deals-grid" class="game-grid">[\s\S]*?(?=\s*<div id="deals-empty")/,
    `<div id="deals-grid" class="game-grid">\n${cardsHtml}\n    </div>`
  );

  fs.writeFileSync(dealsHtmlPath, html, "utf8");
  console.log("Pre-rendered", catalog.length, "game cards into deals.html");
}

function preRenderHome(win, catalog) {
  const indexHtmlPath = path.join(root, "index.html");
  if (!fs.existsSync(indexHtmlPath)) return;
  let html = fs.readFileSync(indexHtmlPath, "utf8");

  // Pre-render top 6 games into budget section
  const topGames = catalog.filter(function (g) {
    return g.stock === "ok" && g.price != null && g.price > 0 && g.price < 20;
  }).slice(0, 6);

  function coverUrl(g) {
    if (g.cover) return g.cover;
    if (g.steam) return "https://cdn.cloudflare.steamstatic.com/steam/apps/" + g.steam + "/capsule_616x353.jpg";
    return "";
  }

  const cardsHtml = topGames.map(function (game, i) {
    const slug = slugify(game.name);
    const fiche = "/jeu/" + slug + "/";
    const cover = coverUrl(game);
    const name = esc(game.name);
    const price = formatPrice(game.price);
    const tag = esc(game.tag || "");
    const img = cover ? '<img class="game-cover" src="' + cover + '" alt="' + name + '" width="616" height="353" loading="lazy" />' : "";
    return (
      '        <article class="game-card anim-card" style="--i:' + i + '">' +
      '<div class="game-cover-wrap">' +
      '<a class="game-cover-link" href="' + fiche + '">' +
      img +
      '<span class="game-badges"><span class="game-badge game-badge--price">' + price + '</span></span>' +
      '</a>' +
      '</div>' +
      '<div class="game-card-body">' +
      '<div class="card-meta"><span class="tag">' + tag + '</span></div>' +
      '<h3><a class="game-title-link" href="' + fiche + '">' + name + '</a></h3>' +
      '<p>' + esc(game.blurb || "") + '</p>' +
      '</div></article>'
    );
  }).join("\n");

  html = html.replace(
    /(<section class="section" id="petits-prix">[\s\S]*?<div class="game-grid" data-rotate>)[\s\S]*?(?=\s*<\/section>\s*<section class="section" id="tonight")/,
    `$1\n${cardsHtml}\n      </div>`
  );

  fs.writeFileSync(indexHtmlPath, html, "utf8");
  console.log("Pre-rendered", topGames.length, "featured games into index.html");
}

main();
