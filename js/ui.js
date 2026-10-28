/* UI commune : thème, toast, retour en haut, guides liés, prix live sur articles */
(function () {
  var THEME_KEY = "jeuxstash-theme";

  function getTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") return saved;
    } catch (e) {}
    return "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
    var toggle = document.getElementById("theme-toggle");
    if (toggle) {
      var dark = theme === "dark";
      toggle.setAttribute("aria-label", dark ? "Passer en mode clair" : "Passer en mode sombre");
      toggle.setAttribute("title", dark ? "Mode clair" : "Mode sombre");
      toggle.textContent = dark ? "☀" : "☾";
    }
  }

  applyTheme(getTheme());

  function mountThemeToggle() {
    var nav = document.querySelector(".site-header nav");
    if (!nav || document.getElementById("theme-toggle")) return;
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.id = "theme-toggle";
    toggle.className = "theme-toggle";
    toggle.addEventListener("click", function () {
      applyTheme(getTheme() === "dark" ? "light" : "dark");
    });
    var cta = nav.querySelector(".nav-cta");
    if (cta) nav.insertBefore(toggle, cta);
    else nav.appendChild(toggle);
    applyTheme(getTheme());
  }
  mountThemeToggle();

  /* CTA nav → catalogue (moins « pub Instant Gaming ») */
  (function softenNavCta() {
    var cta = document.querySelector(".site-header nav .nav-cta");
    if (!cta) return;
    cta.textContent = "Catalogue";
    cta.setAttribute("href", "/deals");
    cta.removeAttribute("target");
    cta.removeAttribute("rel");
  })();

  /* Skip link + id main */
  (function mountSkipLink() {
    var main = document.querySelector("main");
    if (main && !main.id) main.id = "main";
    if (document.querySelector(".skip-link")) return;
    var a = document.createElement("a");
    a.className = "skip-link";
    a.href = "#main";
    a.textContent = "Aller au contenu";
    document.body.insertBefore(a, document.body.firstChild);
  })();

  /* Nav : pas de doublon Jeux/Catalogue, état courant */
  (function polishNav() {
    var nav = document.querySelector(".site-header nav");
    if (!nav) return;
    var path = (location.pathname || "/").replace(/\/$/, "") || "/";
    var cta = nav.querySelector(".nav-cta");
    Array.prototype.slice.call(nav.querySelectorAll("a:not(.nav-cta)")).forEach(function (a) {
      var href = (a.getAttribute("href") || "").replace(/\/$/, "") || "/";
      var label = (a.textContent || "").trim().toLowerCase();
      if ((href === "/deals" || href === "/jeu") && (label === "jeux" || label === "catalogue")) {
        a.remove();
      }
    });
    Array.prototype.forEach.call(nav.querySelectorAll("a"), function (a) {
      var href = (a.getAttribute("href") || "").replace(/\/$/, "") || "/";
      var on =
        href === "/"
          ? path === "/"
          : path === href || path.indexOf(href + "/") === 0;
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    if (cta && (path === "/deals" || path.indexOf("/jeu/") === 0)) {
      cta.setAttribute("aria-current", "page");
      cta.classList.add("nav-cta--current");
    }
  })();

  /* Ombre header au scroll */
  (function headerScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function tick() {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    }
    window.addEventListener("scroll", tick, { passive: true });
    tick();
  })();

  /* Toolbar catalogue collante */
  (function stickyDealsToolbar() {
    var tb = document.querySelector(".deals-toolbar");
    if (!tb || !("IntersectionObserver" in window)) return;
    var sentinel = document.createElement("div");
    sentinel.className = "deals-toolbar-sentinel";
    sentinel.setAttribute("aria-hidden", "true");
    tb.parentNode.insertBefore(sentinel, tb);
    var io = new IntersectionObserver(
      function (entries) {
        tb.classList.toggle("is-stuck", !entries[0].isIntersecting);
      },
      { threshold: 0 }
    );
    io.observe(sentinel);
  })();

  /* Signature auteur sur les guides d’achat */
  (function mountGuideAuthor() {
    var path = location.pathname || "";
    if (path.indexOf("/guides/") !== 0) return;
    if (/\/guides\/?(index\.html)?$/i.test(path)) return;
    var article = document.querySelector("article.article");
    if (!article || article.querySelector(".author-byline")) return;

    var byline = document.createElement("p");
    byline.className = "author-byline";
    byline.innerHTML =
      'Par la <a href="/a-propos">rédaction JeuxStash</a> · guide d’achat indépendant · <a href="/a-propos#affiliation">méthode &amp; affiliation</a>';

    var meta = article.querySelector(".meta");
    var h1 = article.querySelector("h1");
    if (meta && meta.parentNode) meta.insertAdjacentElement("afterend", byline);
    else if (h1 && h1.parentNode) h1.insertAdjacentElement("afterend", byline);
    else article.insertBefore(byline, article.firstChild);

    if (article.querySelector(".author-card")) return;
    var card = document.createElement("aside");
    card.className = "author-card";
    card.innerHTML =
      "<p><strong>JeuxStash</strong> — sélection éditoriale, prix indicatifs, verdict Acheter / Attendre / Game Pass. " +
      "Les boutons «&nbsp;Voir le prix&nbsp;» sont affiliés Instant Gaming (même prix pour vous). " +
      '<a href="/a-propos">Qui on est →</a></p>';
    var related = article.querySelector(".related-guides");
    if (related) article.insertBefore(card, related);
    else article.appendChild(card);
  })();

  function toast(msg) {
    var el = document.getElementById("js-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "js-toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      el.classList.remove("is-on");
    }, 2200);
  }
  window.JEUXSTASH_toast = toast;

  /* Icône partager — copie le lien fiche (accueil, catalogue, mes jeux) */
  document.addEventListener("click", function (e) {
    var share = e.target.closest(".js-share-deal");
    if (!share) return;
    e.preventDefault();
    e.stopPropagation();
    var name = share.getAttribute("data-name") || "";
    var url =
      window.JEUXSTASH_FICHE && window.JEUXSTASH_FICHE.url
        ? location.origin + window.JEUXSTASH_FICHE.url(name)
        : location.origin + "/deals?q=" + encodeURIComponent(name);
    function ok() {
      toast("Lien copié");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(ok).catch(function () {
        window.prompt("Copie ce lien :", url);
      });
    } else {
      window.prompt("Copie ce lien :", url);
    }
  });

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "back-top";
  btn.setAttribute("aria-label", "Retour en haut");
  btn.innerHTML = "↑";
  document.body.appendChild(btn);
  function onScroll() {
    btn.classList.toggle("is-visible", window.scrollY > 480);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  onScroll();

  document.addEventListener("keydown", function (e) {
    if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || (e.target && e.target.isContentEditable)) return;
    var search = document.getElementById("deals-search");
    if (!search) return;
    e.preventDefault();
    search.focus();
    search.select();
  });

  var catalog = window.JEUXSTASH_CATALOG;
  var Fiche = window.JEUXSTASH_FICHE;

  /* Cartes jeu dans les guides (data-picks / data-games) */
  if (catalog && catalog.length && document.querySelector(".guide-picks")) {
    function escG(str) {
      return String(str == null ? "" : str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
    function findGameG(name) {
      var want = String(name || "").toLowerCase();
      for (var i = 0; i < catalog.length; i++) {
        if ((catalog[i].name || "").toLowerCase() === want) return catalog[i];
      }
      for (var j = 0; j < catalog.length; j++) {
        if ((catalog[j].name || "").toLowerCase().indexOf(want) !== -1) return catalog[j];
      }
      return null;
    }
    function coverG(game) {
      if (game.cover) return game.cover;
      if (game.steam) {
        return "https://cdn.cloudflare.steamstatic.com/steam/apps/" + game.steam + "/header.jpg";
      }
      return "";
    }
    function priceG(n) {
      if (n == null || Number.isNaN(n)) return null;
      return (
        Number(n).toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + "\u00a0€"
      );
    }
    function ficheG(game) {
      if (Fiche && Fiche.url) return Fiche.url(game);
      return "/deals?q=" + encodeURIComponent(game.name);
    }
    function pickHTML(game, note) {
      var price = priceG(game.price);
      var oos = game.stock === "out";
      var cover = coverG(game);
      var fiche = ficheG(game);
      return (
        '<article class="guide-pick">' +
        (cover
          ? '<a class="guide-pick-cover" href="' +
            escG(fiche) +
            '"><img src="' +
            escG(cover) +
            '" alt="' +
            escG(game.name) +
            '" width="460" height="215" loading="lazy" /></a>'
          : "") +
        '<div class="guide-pick-body"><h3><a href="' +
        escG(fiche) +
        '">' +
        escG(game.name) +
        "</a></h3>" +
        (note
          ? '<p class="guide-pick-note">' + escG(note) + "</p>"
          : game.blurb
            ? '<p class="guide-pick-note">' + escG(game.blurb) + "</p>"
            : "") +
        (window.JEUXSTASH_VERDICT && window.JEUXSTASH_VERDICT.compareHTML
          ? window.JEUXSTASH_VERDICT.compareHTML(game)
          : "") +
        '<div class="guide-pick-row">' +
        (oos
          ? '<span class="guide-pick-price is-oos">Rupture / préco</span>'
          : price
            ? '<span class="guide-pick-price">' + price + "</span>"
            : "") +
        '<a class="btn ghost small" href="' +
        escG(fiche) +
        '">Fiche</a>' +
        (oos
          ? ""
          : '<a class="btn buy small" href="' +
            escG(game.ig) +
            '" rel="sponsored noopener" target="_blank">Voir le prix</a>') +
        '<a class="btn ghost small" href="' +
        escG(game.gg || "https://gg.deals/") +
        '" rel="noopener" target="_blank">Comparer</a>' +
        "</div></div></article>"
      );
    }
    document.querySelectorAll(".guide-picks").forEach(function (el) {
      if (el.getAttribute("data-ready")) return;
      var picks = [];
      try {
        if (el.getAttribute("data-picks")) picks = JSON.parse(el.getAttribute("data-picks"));
        else if (el.getAttribute("data-games")) {
          picks = JSON.parse(el.getAttribute("data-games")).map(function (n) {
            return { name: n };
          });
        }
      } catch (e) {
        return;
      }
      var html = picks
        .map(function (p) {
          var game = findGameG(p.name);
          return game ? pickHTML(game, p.note || "") : "";
        })
        .filter(Boolean)
        .join("");
      if (!html) return;
      el.innerHTML = html;
      el.setAttribute("data-ready", "1");
    });
  }

  /* FAQ guides → accordéon */
  (function () {
    var articleFaq = document.querySelector("article.article");
    if (!articleFaq || articleFaq.querySelector(".faq-list")) return;
    var faqH2 = null;
    Array.prototype.forEach.call(articleFaq.children, function (node) {
      if (node.tagName === "H2" && /faq/i.test(node.textContent || "")) faqH2 = node;
    });
    if (!faqH2) return;
    var list = document.createElement("div");
    list.className = "faq-list";
    var node = faqH2.nextElementSibling;
    var batch = [];
    while (
      node &&
      node.tagName !== "H2" &&
      !node.classList.contains("related-guides") &&
      !node.classList.contains("aff-box")
    ) {
      var next = node.nextElementSibling;
      if (node.tagName === "H3") {
        var a = next && next.tagName === "P" ? next : null;
        if (a) {
          var d = document.createElement("details");
          var s = document.createElement("summary");
          s.textContent = node.textContent;
          var ans = document.createElement("div");
          ans.className = "faq-a";
          ans.innerHTML = a.innerHTML;
          d.appendChild(s);
          d.appendChild(ans);
          batch.push(d);
          node.remove();
          a.remove();
          node = next.nextElementSibling;
          continue;
        }
      }
      node = next;
    }
    if (batch.length) {
      batch.forEach(function (d) {
        list.appendChild(d);
      });
      faqH2.insertAdjacentElement("afterend", list);
    }
  })();

  /* Guides mono-jeu : CTA fiche */
  (function () {
    var article = document.querySelector("article.article");
    if (!article || !catalog || !catalog.length) return;
    var h1 = article.querySelector("h1");
    if (!h1) return;
    function findGame(name) {
      var want = String(name || "").toLowerCase();
      for (var i = 0; i < catalog.length; i++) {
        if ((catalog[i].name || "").toLowerCase() === want) return catalog[i];
      }
      return null;
    }
    var mono = null;
    var map = [
      ["Elden Ring", /elden/i],
      ["Cyberpunk 2077", /cyberpunk/i],
      ["Baldur's Gate 3", /baldur/i],
      ["Forza Horizon 5", /forza/i],
      ["EA Sports FC 27", /fc\s*27|ea sports fc/i],
      ["Grand Theft Auto VI", /gta/i],
      ["Black Myth: Wukong", /wukong/i],
      ["Clair Obscur: Expedition 33", /expedition/i],
      ["Call of Duty: Black Ops 7", /black ops|call of duty/i],
    ];
    for (var m = 0; m < map.length; m++) {
      if (map[m][1].test(h1.textContent || "")) {
        mono = findGame(map[m][0]);
        break;
      }
    }
    if (!mono) return;
    var ficheHref =
      Fiche && Fiche.url ? Fiche.url(mono) : "/deals?q=" + encodeURIComponent(mono.name);
    article.querySelectorAll(".aff-box").forEach(function (box) {
      if (box.querySelector(".js-fiche-cta")) return;
      var a = document.createElement("a");
      a.className = "btn ghost small js-fiche-cta";
      a.href = ficheHref;
      a.textContent = "Fiche jeu";
      box.appendChild(a);
    });
    var heroImg = article.querySelector("img.game-cover");
    if (heroImg && !heroImg.closest("a")) {
      var wrap = document.createElement("a");
      wrap.className = "article-hero";
      wrap.href = ficheHref;
      wrap.setAttribute("aria-label", "Voir la fiche " + mono.name);
      heroImg.parentNode.insertBefore(wrap, heroImg);
      wrap.appendChild(heroImg);
      heroImg.removeAttribute("style");
      heroImg.classList.add("article-hero-img");
    }
  })();

  if (catalog && catalog.length) {
    var boxes = document.querySelectorAll(".article .aff-box");
    boxes.forEach(function (box) {
      var link = box.querySelector("a.btn.buy[href*='instant-gaming.com']");
      if (!link) return;
      var href = link.getAttribute("href") || "";
      var game = null;
      for (var i = 0; i < catalog.length; i++) {
        if (catalog[i].ig && href.indexOf(catalog[i].ig.split("?")[0]) !== -1) {
          game = catalog[i];
          break;
        }
        var m = href.match(/\/(\d+)-/);
        var m2 = (catalog[i].ig || "").match(/\/(\d+)-/);
        if (m && m2 && m[1] === m2[1]) {
          game = catalog[i];
          break;
        }
      }
      if (!game) return;
      if (box.querySelector(".live-price")) return;
      var pill = document.createElement("p");
      pill.className = "live-price";
      if (game.stock === "out" && (game.price == null || game.price === 0)) {
        pill.innerHTML = "<strong>Précommande / rupture clé</strong> — regarde la fiche IG.";
      } else if (game.stock === "out") {
        pill.innerHTML = "<strong>Clé en rupture</strong> — compare ailleurs ou reviens plus tard.";
      } else if (game.price != null) {
        var price = Number(game.price).toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        pill.innerHTML =
          "Clé IG ≈ <strong>" +
          price +
          "&nbsp;€</strong>" +
          (window.JEUXSTASH_PRICES_UPDATED
            ? ' <span class="fine">· maj. ' + window.JEUXSTASH_PRICES_UPDATED + "</span>"
            : "");
      }
      if (pill.innerHTML) box.insertBefore(pill, box.querySelector(".btn, a.btn"));
    });
  }

  var article = document.querySelector("article.article");
  var guides = window.JEUXSTASH_GUIDES;
  if (!article || !guides || !guides.length) return;
  if (article.querySelector(".related-guides")) return;

  var path = location.pathname.replace(/\/$/, "");
  var current = null;
  for (var i = 0; i < guides.length; i++) {
    if (path.indexOf(guides[i].id) !== -1 || path.endsWith(guides[i].href.replace("/guides/", ""))) {
      current = guides[i];
      break;
    }
  }
  if (!current) {
    for (var j = 0; j < guides.length; j++) {
      if (path.indexOf(guides[j].href.replace(".html", "")) !== -1) {
        current = guides[j];
        break;
      }
    }
  }

  var pool = guides.filter(function (g) {
    return !current || g.id !== current.id;
  });
  var seasonApi = window.JEUXSTASH_SEASON;
  if (seasonApi) {
    var plan = seasonApi.current();
    pool = seasonApi.shuffle(pool, plan.seed + 7);
    pool.sort(function (a, b) {
      var sa = a.evergreen ? 1 : 0;
      var sb = b.evergreen ? 1 : 0;
      if (a.seasons && a.seasons.indexOf(plan.key) !== -1) sa += 2;
      if (b.seasons && b.seasons.indexOf(plan.key) !== -1) sb += 2;
      return sb - sa;
    });
  }
  var pick = pool.slice(0, 3);
  if (!pick.length) return;

  var box = document.createElement("div");
  box.className = "related-guides";
  box.innerHTML =
    "<h2>Aussi utiles</h2><ul>" +
    pick
      .map(function (g) {
        return (
          "<li><a href=\"" +
          g.href +
          '"><strong>' +
          g.title +
          "</strong><span>" +
          g.blurb +
          "</span></a></li>"
        );
      })
      .join("") +
    "</ul>";
  article.appendChild(box);
})();

/* Nav « Mes jeux » sur toutes les pages */
(function () {
  if (window.JEUXSTASH_WATCH) return;
  if (document.querySelector('script[src*="watchlist.js"]')) return;
  var s = document.createElement("script");
  s.src = "/js/watchlist.js?v=20260930x";
  s.defer = true;
  document.head.appendChild(s);
})();

/* Apparition douce des sections au scroll */
(function revealOnScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var nodes = document.querySelectorAll(".section, .trust-strip, .money-links a, .faq-list details");
  if (!nodes.length || !("IntersectionObserver" in window)) return;
  nodes.forEach(function (el) {
    if (el.tagName === "MAIN" || el.id === "deals-grid" || el.id === "build-panel" || el.querySelector("#deals-grid, .game-grid, #build-panel")) return;
    el.classList.add("reveal");
  });
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0 }
  );
  nodes.forEach(function (el) {
    if (el.classList.contains("reveal")) {
      io.observe(el);
    }
  });
})();

/* Autocomplétion en direct sur la barre de recherche d’accueil (#home-search) */
(function mountLiveAutocomplete() {
  var input = document.getElementById("home-search");
  var catalog = window.JEUXSTASH_CATALOG;
  if (!input || !catalog || !catalog.length) return;
  var form = input.closest("form");
  if (!form) return;

  form.style.position = "relative";
  var drop = document.createElement("div");
  drop.className = "search-autocomplete";
  drop.setAttribute("role", "listbox");
  drop.hidden = true;
  form.appendChild(drop);

  function escA(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function normA(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function coverA(g) {
    if (g.cover) return g.cover;
    if (g.steam) return "https://cdn.cloudflare.steamstatic.com/steam/apps/" + g.steam + "/header.jpg";
    return "";
  }

  function ficheA(g) {
    if (window.JEUXSTASH_FICHE && window.JEUXSTASH_FICHE.url) return window.JEUXSTASH_FICHE.url(g);
    return "/deals?q=" + encodeURIComponent(g.name);
  }

  function formatPriceA(n) {
    if (n == null || Number.isNaN(Number(n))) return null;
    return (
      Number(n).toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + "\u00a0€"
    );
  }

  function searchGames(q) {
    var nq = normA(q);
    if (!nq || nq.length < 2) return [];
    var compactQ = nq.replace(/\s+/g, "");
    var scored = [];
    for (var i = 0; i < catalog.length; i++) {
      var g = catalog[i];
      var nameNorm = normA(g.name);
      var aliasNorm = normA((g.aliases || []).join(" "));
      var hay = nameNorm + " " + aliasNorm + " " + normA(g.tag || "");
      var hayCompact = hay.replace(/\s+/g, "");
      var score = 0;
      if (nameNorm.indexOf(nq) === 0) score = 100;
      else if (nameNorm.indexOf(nq) !== -1) score = 75;
      else if (aliasNorm.indexOf(nq) !== -1) score = 65;
      else if (hayCompact.indexOf(compactQ) !== -1) score = 50;
      else if (hay.indexOf(nq) !== -1) score = 40;
      if (score > 0) {
        if (g.stock === "ok") score += 10;
        scored.push({ g: g, score: score });
      }
    }
    scored.sort(function (a, b) {
      return b.score - a.score;
    });
    return scored.slice(0, 5).map(function (x) {
      return x.g;
    });
  }

  function renderDrop() {
    var q = (input.value || "").trim();
    var matches = searchGames(q);
    if (!matches.length) {
      drop.hidden = true;
      drop.innerHTML = "";
      return;
    }
    var V = window.JEUXSTASH_VERDICT;
    var html = matches
      .map(function (g) {
        var price = formatPriceA(g.price);
        var v = V ? V.for(g) : null;
        var pct = v && v.savePct ? "−" + v.savePct + "\u00a0%" : "";
        var cov = coverA(g);
        var url = ficheA(g);
        return (
          '<a class="search-ac-item" role="option" href="' +
          escA(url) +
          '">' +
          (cov ? '<img class="search-ac-thumb" src="' + escA(cov) + '" alt="" width="68" height="32" loading="lazy" />' : "") +
          '<span class="search-ac-info">' +
          '<strong class="search-ac-title">' +
          escA(g.name) +
          "</strong>" +
          '<span class="search-ac-meta">' +
          escA(g.tag || "Jeu") +
          (g.stock === "out" ? " · Rupture" : "") +
          "</span>" +
          "</span>" +
          '<span class="search-ac-right">' +
          (pct && g.stock !== "out" ? '<span class="search-ac-pct">' + pct + "</span>" : "") +
          (price && g.stock !== "out"
            ? '<strong class="search-ac-price">' + price + "</strong>"
            : '<span class="search-ac-oos">Voir</span>') +
          "</span></a>"
        );
      })
      .join("");
    html +=
      '<a class="search-ac-all" href="/deals?q=' +
      encodeURIComponent(q) +
      '">Voir tous les résultats pour « ' +
      escA(q) +
      " » →</a>";
    drop.innerHTML = html;
    drop.hidden = false;
    selectedIndex = -1;
  }

  var selectedIndex = -1;

  function updateSelected() {
    var items = drop.querySelectorAll(".search-ac-item, .search-ac-all");
    items.forEach(function (it, idx) {
      if (idx === selectedIndex) {
        it.classList.add("is-selected");
        it.scrollIntoView({ block: "nearest" });
      } else {
        it.classList.remove("is-selected");
      }
    });
  }

  input.addEventListener("input", renderDrop);
  input.addEventListener("focus", function () {
    if ((input.value || "").trim().length >= 2) renderDrop();
  });
  document.addEventListener("click", function (e) {
    if (!form.contains(e.target)) {
      drop.hidden = true;
      selectedIndex = -1;
    }
  });
  input.addEventListener("keydown", function (e) {
    if (drop.hidden) return;
    var items = drop.querySelectorAll(".search-ac-item, .search-ac-all");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateSelected();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
      updateSelected();
    } else if (e.key === "Enter" && selectedIndex >= 0 && items[selectedIndex]) {
      e.preventDefault();
      items[selectedIndex].click();
    } else if (e.key === "Escape") {
      drop.hidden = true;
      selectedIndex = -1;
    }
  });
})();
