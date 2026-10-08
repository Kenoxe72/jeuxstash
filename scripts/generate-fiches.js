commit cc1de22695caf45182cba1ffaa7af3a1be921117
Author: Kevin Gohier <kevingohier@macbook-air-de-kevin.home>
Date:   Thu Oct 8 18:35:46 2026 +0200

    Retire le noindex des fiches /jeu/{slug}/ pour débloquer l’indexation.
    
    Le template shell avait noindex (volontaire pour /jeu/) et il était recopié sur les 193 fiches — Search Console refusait la validation. Accueil resserré en bonus.
    
    Co-authored-by: Cursor <cursoragent@cursor.com>

diff --git a/css/style.css b/css/style.css
index c184896..d20e3b7 100644
--- a/css/style.css
+++ b/css/style.css
@@ -273,7 +273,7 @@ nav .nav-current {
 .hero--immersive {
   position: relative;
   max-width: none;
-  min-height: min(54vh, 480px);
+  min-height: min(42vh, 380px);
   margin: 0;
   padding: 0;
   display: flex;
@@ -284,10 +284,14 @@ nav .nav-current {
 }
 
 html[data-theme="dark"] .hero--immersive {
-  min-height: min(72vh, 620px);
+  min-height: min(48vh, 420px);
   border-bottom: 1px solid var(--line);
 }
 
+.section--after-hero {
+  padding-top: 1.35rem;
+}
+
 .hero--immersive .eyebrow {
   color: rgba(255, 180, 84, 0.95);
 }
@@ -365,17 +369,17 @@ html[data-theme="dark"] .hero-bg-shade {
   width: 100%;
   max-width: var(--max);
   margin: 0 auto;
-  padding: 2.4rem 1.2rem 2rem;
+  padding: 1.8rem 1.2rem 1.55rem;
 }
 
 html[data-theme="dark"] .hero-inner {
-  padding: 3.2rem 1.2rem 2.5rem;
+  padding: 2rem 1.2rem 1.7rem;
 }
 
 .hero-brand {
-  margin: 0 0 0.7rem;
+  margin: 0 0 0.45rem;
   font-family: var(--display);
-  font-size: clamp(2.5rem, 8vw, 4.25rem);
+  font-size: clamp(2.35rem, 7vw, 3.75rem);
   font-weight: 700;
   line-height: 0.95;
   letter-spacing: -0.035em;
@@ -397,15 +401,22 @@ html[data-theme="dark"] .hero-inner {
 
 .hero h1 {
   margin: 0;
-  max-width: 16ch;
+  max-width: 14ch;
   font-family: var(--display);
-  font-size: clamp(1.7rem, 3.8vw, 2.4rem);
+  font-size: clamp(1.55rem, 3.4vw, 2.15rem);
   line-height: 1.12;
   letter-spacing: -0.028em;
   color: #fff;
   font-weight: 600;
 }
 
+.hero--immersive .lead {
+  margin-top: 0.55rem;
+  max-width: 28rem;
+  font-size: 0.98rem;
+  line-height: 1.45;
+}
+
 .lead {
   margin: 0.9rem 0 0;
   max-width: 30rem;
@@ -423,7 +434,7 @@ html[data-theme="dark"] .hero-inner {
   display: flex;
   flex-wrap: wrap;
   gap: 0.65rem;
-  margin-top: 1.25rem;
+  margin-top: 1rem;
 }
 
 .hero-search {
@@ -432,7 +443,7 @@ html[data-theme="dark"] .hero-inner {
   gap: 0.55rem;
   align-items: stretch;
   max-width: 34rem;
-  margin: 1rem 0 0;
+  margin: 0.85rem 0 0;
 }
 
 .hero-search input {
@@ -2492,16 +2503,16 @@ html[data-theme="light"] .watch-btn.is-on {
   }
 
   .hero--immersive {
-    min-height: min(52vh, 440px);
+    min-height: min(40vh, 360px);
   }
 
   html[data-theme="dark"] .hero--immersive {
-    min-height: min(70vh, 560px);
+    min-height: min(44vh, 390px);
   }
 
   .hero-inner {
-    padding-top: 2.2rem;
-    padding-bottom: 1.75rem;
+    padding-top: 1.6rem;
+    padding-bottom: 1.35rem;
   }
 
   html[data-theme="dark"] .hero-bg-shade {
@@ -2565,7 +2576,7 @@ html[data-theme="dark"] .back-top {
 @media (max-width: 720px) {
   html[data-theme="light"] .hero--immersive,
   html:not([data-theme="dark"]) .hero--immersive {
-    min-height: min(48vh, 420px);
+    min-height: min(38vh, 340px);
   }
 }
 
diff --git a/functions/_middleware.js b/functions/_middleware.js
index 3a2477f..f6b9290 100644
--- a/functions/_middleware.js
+++ b/functions/_middleware.js
@@ -1,8 +1,8 @@
-/** Force le domaine canonique www (apex + preview Cloudflare Pages) */
+/** Force le domaine canonique www (apex + hostname Pages de prod — pas les previews *hash*.pages.dev) */
 export async function onRequest(context) {
   const url = new URL(context.request.url);
   const host = url.hostname;
-  if (host === "jeuxstash.fr" || host === "jeuxstash.pages.dev" || host.endsWith(".jeuxstash.pages.dev")) {
+  if (host === "jeuxstash.fr" || host === "jeuxstash.pages.dev") {
     url.hostname = "www.jeuxstash.fr";
     url.protocol = "https:";
     return Response.redirect(url.toString(), 301);
diff --git a/index.html b/index.html
index 38f8460..866f71b 100644
--- a/index.html
+++ b/index.html
@@ -34,7 +34,7 @@
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
-  <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
+  <link rel="stylesheet" href="/css/style.css?v=20261007hero" />
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
@@ -61,38 +61,36 @@
       </div>
       <div class="hero-inner anim-fade">
         <p class="hero-brand">Jeux<span>Stash</span></p>
-        <p class="eyebrow" id="hero-season">Automne · Rentrée</p>
         <h1>Le bon jeu.<br />Au bon prix.</h1>
-        <p class="lead">Une sélection claire, le prix sous la jaquette, un verdict <strong>Acheter / Attendre / Game Pass</strong>, puis vous comparez.</p>
+        <p class="lead">Prix sous la jaquette, verdict <strong>Acheter / Attendre / Game Pass</strong> — puis vous comparez.</p>
         <div class="hero-actions">
-          <a class="btn buy" href="https://www.instant-gaming.com/fr/4824-acheter-elden-ring-pc-steam/?igr=gamer-47bd4c" rel="sponsored noopener" target="_blank">Voir le prix — Elden Ring</a>
-          <a class="btn ghost" href="#idees">Voir les idées</a>
+          <a class="btn buy" href="/deals">Explorer le catalogue</a>
+          <a class="btn ghost" href="#promos">Voir les baisses</a>
         </div>
         <form class="hero-search" action="/deals" method="get" role="search">
           <label class="sr-only" for="home-search">Rechercher un jeu</label>
-          <input id="home-search" name="q" type="search" placeholder="Chercher un jeu… MW4, Requiem, Silksong…" autocomplete="off" />
+          <input id="home-search" name="q" type="search" placeholder="Chercher un jeu…" autocomplete="off" />
           <button type="submit" class="btn ghost">Chercher</button>
         </form>
-        <p class="hero-note">
-          <a id="season-cta" href="/guides/black-friday-jeux-2026">Guide Black Friday 2026</a>
-          <span class="hero-note-sep" aria-hidden="true">·</span>
-          <a href="/deals?under20=1">Jeux sous 20&nbsp;€</a>
-        </p>
       </div>
     </section>
 
     <section class="trust-strip" aria-label="En bref">
       <div class="trust-strip-inner">
         <p id="trust-stats">Catalogue à jour · verdict sur chaque jeu · aucun compte</p>
-        <p class="trust-strip-note"><a href="/a-propos">Affiliation transparente</a> — vous payez le même prix.</p>
+        <p class="trust-strip-note"><a href="/a-propos">Guide indépendant</a> · affiliation sans surcoût</p>
       </div>
     </section>
 
-    <section class="section edit-note" id="methode" aria-label="Méthode">
-      <div class="edit-note-inner">
-        <h2>Un guide, pas une boutique</h2>
-        <p>On sélectionne des jeux, on affiche un prix indicatif et un verdict <strong>Acheter / Attendre / Game Pass</strong>, puis vous comparez ailleurs si besoin. Pas de compte ici — <a href="/a-propos">comment on travaille</a>.</p>
+    <section class="section section--after-hero" id="promos">
+      <div class="section-head">
+        <div>
+          <h2>Grosses baisses du moment</h2>
+          <p>Écarts forts vs boutique — à ouvrir tout de suite.</p>
+        </div>
+        <a class="text-link" href="/deals?sort=save">Voir plus →</a>
       </div>
+      <div class="promo-rail" id="promo-rail"></div>
     </section>
 
     <section class="section" id="tonight">
@@ -106,17 +104,6 @@
       <div class="game-grid" data-rotate></div>
     </section>
 
-    <section class="section" id="promos">
-      <div class="section-head">
-        <div>
-          <h2>Grosses baisses du moment</h2>
-          <p>Écarts forts vs boutique, avec des titres qu’on a envie d’ouvrir.</p>
-        </div>
-        <a class="text-link" href="/deals?sort=save">Voir plus →</a>
-      </div>
-      <div class="promo-rail" id="promo-rail"></div>
-    </section>
-
     <section class="section" id="coming">
       <div class="section-head">
         <div>
@@ -290,7 +277,7 @@
   <script src="/js/guides-data.js?v=20261004pass"></script>
   <script src="/js/fiche.js?v=20261004pass"></script>
   <script src="/js/watchlist.js?v=20261004pass"></script>
-  <script src="/js/home.js?v=20261004share"></script>
+  <script src="/js/home.js?v=20261007hero"></script>
   <script src="/js/config.js"></script>
   <script src="/js/ui.js?v=20261007cred2"></script>
   <script src="/js/seo.js?v=20260929"></script>
diff --git a/jeu/a-plague-tale-requiem/index.html b/jeu/a-plague-tale-requiem/index.html
index 899d6de..ba999a2 100644
--- a/jeu/a-plague-tale-requiem/index.html
+++ b/jeu/a-plague-tale-requiem/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>A Plague Tale: Requiem — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Suite Plague Tale — rats &amp; fraternité. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/a-plague-tale-requiem/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"A Plague Tale: Requiem","description":"Suite Plague Tale — rats & fraternité.","image":"https://gaming-cdn.com/images/products/9034/616x353/a-plague-tale-requiem-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"15.52","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/a-plague-tale-requiem/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"A Plague Tale: Requiem","description":"Suite Plague Tale — rats & fraternité.","image":"https://gaming-cdn.com/images/products/9034/616x353/a-plague-tale-requiem-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"15.52","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/9034-acheter-steam-a-plague-tale-requiem-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/ace-combat-8-wings-of-theve/index.html b/jeu/ace-combat-8-wings-of-theve/index.html
index c3e70b7..99ba32f 100644
--- a/jeu/ace-combat-8-wings-of-theve/index.html
+++ b/jeu/ace-combat-8-wings-of-theve/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Ace Combat 8: Wings of Theve — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Combat aérien Project Aces — sortie imminente. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/ace-combat-8-wings-of-theve/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Ace Combat 8: Wings of Theve","description":"Combat aérien Project Aces — sortie imminente.","image":"https://gaming-cdn.com/images/products/9408/616x353/ace-combat-8-wings-of-theve-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"58.27","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/ace-combat-8-wings-of-theve/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Ace Combat 8: Wings of Theve","description":"Combat aérien Project Aces — sortie imminente.","image":"https://gaming-cdn.com/images/products/9408/616x353/ace-combat-8-wings-of-theve-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"58.27","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/9408-acheter-steam-ace-combat-8-wings-of-theve-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/alan-wake-2/index.html b/jeu/alan-wake-2/index.html
index 4d94a53..62ca728 100644
--- a/jeu/alan-wake-2/index.html
+++ b/jeu/alan-wake-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Alan Wake 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Horreur narrative Remedy. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/alan-wake-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Alan Wake 2","description":"Horreur narrative Remedy.","image":"https://gaming-cdn.com/images/products/7493/616x353/alan-wake-2-pc-jeu-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"44.99","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/alan-wake-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Alan Wake 2","description":"Horreur narrative Remedy.","image":"https://gaming-cdn.com/images/products/7493/616x353/alan-wake-2-pc-jeu-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"44.99","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/7493-acheter-alan-wake-2-pc-jeu/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/alan-wake-remastered/index.html b/jeu/alan-wake-remastered/index.html
index a409cf3..4f399cd 100644
--- a/jeu/alan-wake-remastered/index.html
+++ b/jeu/alan-wake-remastered/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Alan Wake Remastered — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Remaster du thriller Remedy. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/alan-wake-remastered/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Alan Wake Remastered","description":"Remaster du thriller Remedy.","image":"https://gaming-cdn.com/images/products/9490/616x353/alan-wake-remastered-remastered-pc-jeu-epic-games-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"11.24","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/alan-wake-remastered/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Alan Wake Remastered","description":"Remaster du thriller Remedy.","image":"https://gaming-cdn.com/images/products/9490/616x353/alan-wake-remastered-remastered-pc-jeu-epic-games-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"11.24","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/9490-acheter-epic-games-alan-wake-remastered-remastered-pc-jeu-epic-games?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/animal-crossing-new-horizons/index.html b/jeu/animal-crossing-new-horizons/index.html
index 3cdeef0..11f2702 100644
--- a/jeu/animal-crossing-new-horizons/index.html
+++ b/jeu/animal-crossing-new-horizons/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Animal Crossing: New Horizons — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Île chill. Zéro stress, longue durée. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/animal-crossing-new-horizons/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Animal Crossing: New Horizons","description":"Île chill. Zéro stress, longue durée.","image":"https://gaming-cdn.com/images/products/4809/616x353/animal-crossing-new-horizons-switch-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"62.09","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/animal-crossing-new-horizons/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Animal Crossing: New Horizons","description":"Île chill. Zéro stress, longue durée.","image":"https://gaming-cdn.com/images/products/4809/616x353/animal-crossing-new-horizons-switch-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"62.09","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/4809-acheter-animal-crossing-new-horizons-switch-jeu-nintendo-eshop-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/animal-well/index.html b/jeu/animal-well/index.html
index 3461818..e8795c2 100644
--- a/jeu/animal-well/index.html
+++ b/jeu/animal-well/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Animal Well — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Metroidvania mystère — hit indie. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/animal-well/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Animal Well","description":"Metroidvania mystère — hit indie.","image":"https://gaming-cdn.com/images/products/16313/616x353/animal-well-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"20.25","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/animal-well/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Animal Well","description":"Metroidvania mystère — hit indie.","image":"https://gaming-cdn.com/images/products/16313/616x353/animal-well-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"20.25","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/16313-acheter-steam-animal-well-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/arc-raiders/index.html b/jeu/arc-raiders/index.html
index 59e45dd..0ea9b9a 100644
--- a/jeu/arc-raiders/index.html
+++ b/jeu/arc-raiders/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Arc Raiders — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Extraction PvPvE — sessions tendues. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/arc-raiders/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Arc Raiders","description":"Extraction PvPvE — sessions tendues.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1808500/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"24.74","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/arc-raiders/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Arc Raiders","description":"Extraction PvPvE — sessions tendues.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1808500/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"24.74","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/10142-acheter-steam-arc-raiders-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/armored-core-vi-fires-of-rubicon/index.html b/jeu/armored-core-vi-fires-of-rubicon/index.html
index 682ae88..15d6ee9 100644
--- a/jeu/armored-core-vi-fires-of-rubicon/index.html
+++ b/jeu/armored-core-vi-fires-of-rubicon/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>ARMORED CORE VI FIRES OF RUBICON — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Mechas FromSoftware — combats intenses. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/armored-core-vi-fires-of-rubicon/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"ARMORED CORE VI FIRES OF RUBICON","description":"Mechas FromSoftware — combats intenses.","image":"https://gaming-cdn.com/images/products/13289/616x353/armored-core-vi-fires-of-rubicon-pc-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"22.49","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/armored-core-vi-fires-of-rubicon/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"ARMORED CORE VI FIRES OF RUBICON","description":"Mechas FromSoftware — combats intenses.","image":"https://gaming-cdn.com/images/products/13289/616x353/armored-core-vi-fires-of-rubicon-pc-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"22.49","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/13289-acheter-steam-armored-core-vi-fires-of-rubicon-pc-jeu-steam-europe?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/assassin-s-creed-odyssey/index.html b/jeu/assassin-s-creed-odyssey/index.html
index 2352d5b..c7bcb2d 100644
--- a/jeu/assassin-s-creed-odyssey/index.html
+++ b/jeu/assassin-s-creed-odyssey/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Assassin's Creed Odyssey — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Grèce antique immense. Longue durée. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/assassin-s-creed-odyssey/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Assassin's Creed Odyssey","description":"Grèce antique immense. Longue durée.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/812140/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"12.03","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/assassin-s-creed-odyssey/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Assassin's Creed Odyssey","description":"Grèce antique immense. Longue durée.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/812140/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"12.03","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2648-acheter-assassin-s-creed-odyssey-pc-jeu-ubisoft-connect-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/assassin-s-creed-shadows/index.html b/jeu/assassin-s-creed-shadows/index.html
index 0299722..a13fff9 100644
--- a/jeu/assassin-s-creed-shadows/index.html
+++ b/jeu/assassin-s-creed-shadows/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Assassin's Creed Shadows — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Japon féodal. Ubisoft Connect. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/assassin-s-creed-shadows/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Assassin's Creed Shadows","description":"Japon féodal. Ubisoft Connect.","image":"https://gaming-cdn.com/images/products/12831/616x353/assassin-s-creed-shadows-pc-ubisoft-connect-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"28.34","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/assassin-s-creed-shadows/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Assassin's Creed Shadows","description":"Japon féodal. Ubisoft Connect.","image":"https://gaming-cdn.com/images/products/12831/616x353/assassin-s-creed-shadows-pc-ubisoft-connect-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"28.34","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/12831-acheter-assassin-s-creed-shadows-pc-ubisoft-connect/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/assetto-corsa-competizione/index.html b/jeu/assetto-corsa-competizione/index.html
index e0d8b99..be9d652 100644
--- a/jeu/assetto-corsa-competizione/index.html
+++ b/jeu/assetto-corsa-competizione/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Assetto Corsa Competizione — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Simu GT3 — réalisme. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/assetto-corsa-competizione/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Assetto Corsa Competizione","description":"Simu GT3 — réalisme.","image":"https://gaming-cdn.com/images/products/3153/616x353/assetto-corsa-competizione-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"4.49","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/assetto-corsa-competizione/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Assetto Corsa Competizione","description":"Simu GT3 — réalisme.","image":"https://gaming-cdn.com/images/products/3153/616x353/assetto-corsa-competizione-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"4.49","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/3153-acheter-steam-assetto-corsa-competizione-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/astro-bot/index.html b/jeu/astro-bot/index.html
index b431529..ea8a857 100644
--- a/jeu/astro-bot/index.html
+++ b/jeu/astro-bot/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Astro Bot — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Plateforme de l’année. Joyeux et parfait DualSense. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/astro-bot/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Astro Bot","description":"Plateforme de l’année. Joyeux et parfait DualSense.","image":"https://gaming-cdn.com/images/products/16944/616x353/astro-bot-playstation-5-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"72","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/astro-bot/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Astro Bot","description":"Plateforme de l’année. Joyeux et parfait DualSense.","image":"https://gaming-cdn.com/images/products/16944/616x353/astro-bot-playstation-5-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"72","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/16944-acheter-astro-bot-playstation-5-jeu-playstation-store-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/avowed/index.html b/jeu/avowed/index.html
index 407d233..511de12 100644
--- a/jeu/avowed/index.html
+++ b/jeu/avowed/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Avowed — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="RPG Obsidian — monde d’Eora. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/avowed/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Avowed","description":"RPG Obsidian — monde d’Eora.","image":"https://gaming-cdn.com/images/products/7367/616x353/avowed-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"62.11","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/avowed/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Avowed","description":"RPG Obsidian — monde d’Eora.","image":"https://gaming-cdn.com/images/products/7367/616x353/avowed-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"62.11","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/7367-acheter-steam-avowed-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/balatro/index.html b/jeu/balatro/index.html
index e8d0d35..e82dee5 100644
--- a/jeu/balatro/index.html
+++ b/jeu/balatro/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Balatro — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Poker rogue-like addictif, sessions courtes. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/balatro/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Balatro","description":"Poker rogue-like addictif, sessions courtes.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/2379780/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"11.48","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/balatro/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Balatro","description":"Poker rogue-like addictif, sessions courtes.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/2379780/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"11.48","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/15920-acheter-steam-balatro-pc-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/baldur-s-gate-3/index.html b/jeu/baldur-s-gate-3/index.html
index a36970b..f028756 100644
--- a/jeu/baldur-s-gate-3/index.html
+++ b/jeu/baldur-s-gate-3/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Baldur's Gate 3 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Le RPG de référence. Solo ou coop. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/baldur-s-gate-3/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Baldur's Gate 3","description":"Le RPG de référence. Solo ou coop.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"63","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/baldur-s-gate-3/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Baldur's Gate 3","description":"Le RPG de référence. Solo ou coop.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"63","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/4804-acheter-baldur-s-gate-3-pc-jeu-gog-com/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/battlefield-6/index.html b/jeu/battlefield-6/index.html
index fbe6eff..d956486 100644
--- a/jeu/battlefield-6/index.html
+++ b/jeu/battlefield-6/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Battlefield 6 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Nouveau Battlefield — multi large échelle. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/battlefield-6/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Battlefield 6","description":"Nouveau Battlefield — multi large échelle.","image":"https://gaming-cdn.com/images/products/17306/616x353/battlefield-6-pc-ea-app-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"46.68","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/battlefield-6/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Battlefield 6","description":"Nouveau Battlefield — multi large échelle.","image":"https://gaming-cdn.com/images/products/17306/616x353/battlefield-6-pc-ea-app-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"46.68","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/17306-acheter-ea-app-battlefield-6-pc-ea-app?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/black-myth-wukong/index.html b/jeu/black-myth-wukong/index.html
index 41afa3d..e358988 100644
--- a/jeu/black-myth-wukong/index.html
+++ b/jeu/black-myth-wukong/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Black Myth: Wukong — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Action RPG mythologique. Gros solo. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/black-myth-wukong/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Black Myth: Wukong","description":"Action RPG mythologique. Gros solo.","image":"https://gaming-cdn.com/images/products/7678/616x353/black-myth-wukong-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"39.93","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/black-myth-wukong/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Black Myth: Wukong","description":"Action RPG mythologique. Gros solo.","image":"https://gaming-cdn.com/images/products/7678/616x353/black-myth-wukong-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"39.93","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/7678-acheter-black-myth-wukong-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/borderlands-4/index.html b/jeu/borderlands-4/index.html
index 9bed4d8..12cdcb0 100644
--- a/jeu/borderlands-4/index.html
+++ b/jeu/borderlands-4/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Borderlands 4 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Loot shooter coop — le nouveau Borderlands. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/borderlands-4/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Borderlands 4","description":"Loot shooter coop — le nouveau Borderlands.","image":"https://gaming-cdn.com/images/products/15381/616x353/steam-borderlands-4-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"56.24","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/borderlands-4/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Borderlands 4","description":"Loot shooter coop — le nouveau Borderlands.","image":"https://gaming-cdn.com/images/products/15381/616x353/steam-borderlands-4-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"56.24","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/15381-acheter-steam-borderlands-4-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/call-of-duty-black-ops-6/index.html b/jeu/call-of-duty-black-ops-6/index.html
index ff8e95a..26c71d6 100644
--- a/jeu/call-of-duty-black-ops-6/index.html
+++ b/jeu/call-of-duty-black-ops-6/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Call of Duty: Black Ops 6 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="COD 2024 — campagne &amp; multi. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/call-of-duty-black-ops-6/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Call of Duty: Black Ops 6","description":"COD 2024 — campagne & multi.","image":"https://gaming-cdn.com/images/products/13629/616x353/call-of-duty-black-ops-6-pc-jeu-battle-net-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"77.62","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/call-of-duty-black-ops-6/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Call of Duty: Black Ops 6","description":"COD 2024 — campagne & multi.","image":"https://gaming-cdn.com/images/products/13629/616x353/call-of-duty-black-ops-6-pc-jeu-battle-net-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"77.62","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/13629-acheter-battle-net-call-of-duty-black-ops-6-pc-jeu-battle-net?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/call-of-duty-black-ops-7/index.html b/jeu/call-of-duty-black-ops-7/index.html
index 23d3298..a0b2bf7 100644
--- a/jeu/call-of-duty-black-ops-7/index.html
+++ b/jeu/call-of-duty-black-ops-7/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Call of Duty: Black Ops 7 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="COD sur Xbox / PC. Compare avant le plein pot. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/call-of-duty-black-ops-7/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Call of Duty: Black Ops 7","description":"COD sur Xbox / PC. Compare avant le plein pot.","image":"https://gaming-cdn.com/images/products/20546/616x353/call-of-duty-black-ops-7-cross-gen-bundle-xbox-one-xbox-series-x-s-pc-microsoft-store-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"59.28","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/call-of-duty-black-ops-7/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Call of Duty: Black Ops 7","description":"COD sur Xbox / PC. Compare avant le plein pot.","image":"https://gaming-cdn.com/images/products/20546/616x353/call-of-duty-black-ops-7-cross-gen-bundle-xbox-one-xbox-series-x-s-pc-microsoft-store-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"59.28","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/20546-acheter-call-of-duty-black-ops-7-cross-gen-bundle-xbox-one-xbox-series-x-s-pc-microsoft-store/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/call-of-duty-modern-warfare-4/index.html b/jeu/call-of-duty-modern-warfare-4/index.html
index 56f5b72..b9fe280 100644
--- a/jeu/call-of-duty-modern-warfare-4/index.html
+++ b/jeu/call-of-duty-modern-warfare-4/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Call of Duty: Modern Warfare 4 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Sortie 23 oct. 2026 — précommande Xbox / PC. Compare avant le plein tarif. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/call-of-duty-modern-warfare-4/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Call of Duty: Modern Warfare 4","description":"Sortie 23 oct. 2026 — précommande Xbox / PC. Compare avant le plein tarif.","image":"https://gaming-cdn.com/images/products/16809/616x353/call-of-duty-modern-warfare-4-xbox-series-x-s-pc-microsoft-store-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"69.75","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/call-of-duty-modern-warfare-4/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Call of Duty: Modern Warfare 4","description":"Sortie 23 oct. 2026 — précommande Xbox / PC. Compare avant le plein tarif.","image":"https://gaming-cdn.com/images/products/16809/616x353/call-of-duty-modern-warfare-4-xbox-series-x-s-pc-microsoft-store-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"69.75","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/16809-acheter-call-of-duty-modern-warfare-4-pc-xbox-series-x-s-microsoft-store/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/celeste/index.html b/jeu/celeste/index.html
index 58adade..7a3c9a8 100644
--- a/jeu/celeste/index.html
+++ b/jeu/celeste/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Celeste — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Plateforme précise, bande-son mémorable. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/celeste/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Celeste","description":"Plateforme précise, bande-son mémorable.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"3.03","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/celeste/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Celeste","description":"Plateforme précise, bande-son mémorable.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"3.03","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/8003-acheter-steam-celeste-pc-mac-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/cities-skylines-ii/index.html b/jeu/cities-skylines-ii/index.html
index e0d98d6..84b1fdd 100644
--- a/jeu/cities-skylines-ii/index.html
+++ b/jeu/cities-skylines-ii/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Cities: Skylines II — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Gestion de ville nouvelle gen. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/cities-skylines-ii/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Cities: Skylines II","description":"Gestion de ville nouvelle gen.","image":"https://gaming-cdn.com/images/products/8863/616x353/cities-skylines-ii-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"30.59","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/cities-skylines-ii/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Cities: Skylines II","description":"Gestion de ville nouvelle gen.","image":"https://gaming-cdn.com/images/products/8863/616x353/cities-skylines-ii-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"30.59","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/8863-acheter-steam-cities-skylines-ii-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/clair-obscur-expedition-33/index.html b/jeu/clair-obscur-expedition-33/index.html
index 47831c6..dc31cd2 100644
--- a/jeu/clair-obscur-expedition-33/index.html
+++ b/jeu/clair-obscur-expedition-33/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Clair Obscur: Expedition 33 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="RPG au tour par tour acclamé. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/clair-obscur-expedition-33/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Clair Obscur: Expedition 33","description":"RPG au tour par tour acclamé.","image":"https://gaming-cdn.com/images/products/17015/616x353/clair-obscur-expedition-33-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.64","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/clair-obscur-expedition-33/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Clair Obscur: Expedition 33","description":"RPG au tour par tour acclamé.","image":"https://gaming-cdn.com/images/products/17015/616x353/clair-obscur-expedition-33-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.64","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/17015-acheter-clair-obscur-expedition-33-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/content-warning/index.html b/jeu/content-warning/index.html
index 9983c57..86cbd43 100644
--- a/jeu/content-warning/index.html
+++ b/jeu/content-warning/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Content Warning — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Caméra en cave, rires garantis à plusieurs. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/content-warning/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Content Warning","description":"Caméra en cave, rires garantis à plusieurs.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/2881650/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.73","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/content-warning/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Content Warning","description":"Caméra en cave, rires garantis à plusieurs.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/2881650/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.73","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/16548-acheter-steam-content-warning-pc-jeu-steam-europe-us-canada/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/control-ultimate-edition/index.html b/jeu/control-ultimate-edition/index.html
index 5eefbcd..a8dee97 100644
--- a/jeu/control-ultimate-edition/index.html
+++ b/jeu/control-ultimate-edition/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Control Ultimate Edition — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Remedy — pouvoir &amp; Bureau. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/control-ultimate-edition/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Control Ultimate Edition","description":"Remedy — pouvoir & Bureau.","image":"https://gaming-cdn.com/images/products/7467/616x353/control-ultimate-edition-ultimate-edition-pc-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.5","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/control-ultimate-edition/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Control Ultimate Edition","description":"Remedy — pouvoir & Bureau.","image":"https://gaming-cdn.com/images/products/7467/616x353/control-ultimate-edition-ultimate-edition-pc-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.5","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/7467-acheter-steam-control-ultimate-edition-ultimate-edition-pc-jeu-steam-europe?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/core-keeper/index.html b/jeu/core-keeper/index.html
index 411cd95..51ce7e1 100644
--- a/jeu/core-keeper/index.html
+++ b/jeu/core-keeper/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Core Keeper — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Survie 2D sous terre — mining &amp; boss. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/core-keeper/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Core Keeper","description":"Survie 2D sous terre — mining & boss.","image":"https://gaming-cdn.com/images/products/10564/616x353/core-keeper-pc-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"6.51","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/core-keeper/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Core Keeper","description":"Survie 2D sous terre — mining & boss.","image":"https://gaming-cdn.com/images/products/10564/616x353/core-keeper-pc-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"6.51","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/10564-acheter-steam-core-keeper-pc-jeu-steam-europe?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/crimson-desert-enhanced/index.html b/jeu/crimson-desert-enhanced/index.html
index ea2898b..a86f9d4 100644
--- a/jeu/crimson-desert-enhanced/index.html
+++ b/jeu/crimson-desert-enhanced/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Crimson Desert Enhanced — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Open world Pearl Abyss — action, montures, factions. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/crimson-desert-enhanced/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Crimson Desert Enhanced","description":"Open world Pearl Abyss — action, montures, factions.","image":"https://gaming-cdn.com/images/products/8400/616x353/crimson-desert-enhanced-pc-mac-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"46.34","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/crimson-desert-enhanced/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Crimson Desert Enhanced","description":"Open world Pearl Abyss — action, montures, factions.","image":"https://gaming-cdn.com/images/products/8400/616x353/crimson-desert-enhanced-pc-mac-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"46.34","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/8400-acheter-crimson-desert-enhanced-pc-mac-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/cronos-the-new-dawn/index.html b/jeu/cronos-the-new-dawn/index.html
index a0fb881..790050c 100644
--- a/jeu/cronos-the-new-dawn/index.html
+++ b/jeu/cronos-the-new-dawn/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Cronos: The New Dawn — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Survival horror Bloober. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/cronos-the-new-dawn/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Cronos: The New Dawn","description":"Survival horror Bloober.","image":"https://gaming-cdn.com/images/products/17854/616x353/cronos-the-new-dawn-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"20.69","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/cronos-the-new-dawn/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Cronos: The New Dawn","description":"Survival horror Bloober.","image":"https://gaming-cdn.com/images/products/17854/616x353/cronos-the-new-dawn-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"20.69","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/17854-acheter-steam-cronos-the-new-dawn-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/cult-of-the-lamb/index.html b/jeu/cult-of-the-lamb/index.html
index cbb794d..db67079 100644
--- a/jeu/cult-of-the-lamb/index.html
+++ b/jeu/cult-of-the-lamb/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Cult of the Lamb — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Roguelike + gestion de culte. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/cult-of-the-lamb/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Cult of the Lamb","description":"Roguelike + gestion de culte.","image":"https://gaming-cdn.com/images/products/9423/616x353/cult-of-the-lamb-pc-mac-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"9.55","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/cult-of-the-lamb/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Cult of the Lamb","description":"Roguelike + gestion de culte.","image":"https://gaming-cdn.com/images/products/9423/616x353/cult-of-the-lamb-pc-mac-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"9.55","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/9423-acheter-steam-cult-of-the-lamb-pc-mac-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/cuphead/index.html b/jeu/cuphead/index.html
index 6b43457..80b709a 100644
--- a/jeu/cuphead/index.html
+++ b/jeu/cuphead/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Cuphead — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Run &amp; gun cartoon — boss fights. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/cuphead/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Cuphead","description":"Run & gun cartoon — boss fights.","image":"https://gaming-cdn.com/images/products/2310/616x353/cuphead-pc-mac-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"9.78","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/cuphead/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Cuphead","description":"Run & gun cartoon — boss fights.","image":"https://gaming-cdn.com/images/products/2310/616x353/cuphead-pc-mac-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"9.78","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2310-acheter-steam-cuphead-pc-mac-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/cyberpunk-2077/index.html b/jeu/cyberpunk-2077/index.html
index 384ac96..3ff81ef 100644
--- a/jeu/cyberpunk-2077/index.html
+++ b/jeu/cyberpunk-2077/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Cyberpunk 2077 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Souvent très promo. Gros solo immersif. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/cyberpunk-2077/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Cyberpunk 2077","description":"Souvent très promo. Gros solo immersif.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"27.78","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/cyberpunk-2077/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Cyberpunk 2077","description":"Souvent très promo. Gros solo immersif.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"27.78","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/840-acheter-cyberpunk-2077-pc-jeu-gog-com/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/dark-souls-iii/index.html b/jeu/dark-souls-iii/index.html
index 1df8209..485c987 100644
--- a/jeu/dark-souls-iii/index.html
+++ b/jeu/dark-souls-iii/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>DARK SOULS III — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Le souls FromSoftware le plus accessible. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/dark-souls-iii/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"DARK SOULS III","description":"Le souls FromSoftware le plus accessible.","image":"https://gaming-cdn.com/images/products/857/616x353/dark-souls-3-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.42","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/dark-souls-iii/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"DARK SOULS III","description":"Le souls FromSoftware le plus accessible.","image":"https://gaming-cdn.com/images/products/857/616x353/dark-souls-3-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.42","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/857-acheter-steam-dark-souls-3-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/dark-souls-remastered/index.html b/jeu/dark-souls-remastered/index.html
index 590e3d6..421085e 100644
--- a/jeu/dark-souls-remastered/index.html
+++ b/jeu/dark-souls-remastered/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>DARK SOULS REMASTERED — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Le premier Dark Souls remasterisé. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/dark-souls-remastered/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"DARK SOULS REMASTERED","description":"Le premier Dark Souls remasterisé.","image":"https://gaming-cdn.com/images/products/2364/616x353/dark-souls-remastered-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.98","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/dark-souls-remastered/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"DARK SOULS REMASTERED","description":"Le premier Dark Souls remasterisé.","image":"https://gaming-cdn.com/images/products/2364/616x353/dark-souls-remastered-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.98","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2364-acheter-steam-dark-souls-remastered-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/dave-the-diver/index.html b/jeu/dave-the-diver/index.html
index eb54fdd..7758160 100644
--- a/jeu/dave-the-diver/index.html
+++ b/jeu/dave-the-diver/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Dave the Diver — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Plongée + resto — hit détente. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/dave-the-diver/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Dave the Diver","description":"Plongée + resto — hit détente.","image":"https://gaming-cdn.com/images/products/14242/616x353/dave-the-diver-pc-mac-jeu-steam-europe-us-canada-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"7.86","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/dave-the-diver/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Dave the Diver","description":"Plongée + resto — hit détente.","image":"https://gaming-cdn.com/images/products/14242/616x353/dave-the-diver-pc-mac-jeu-steam-europe-us-canada-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"7.86","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/14242-acheter-steam-dave-the-diver-pc-mac-jeu-steam-europe-us-canada?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/dead-cells/index.html b/jeu/dead-cells/index.html
index a9785e3..6794d54 100644
--- a/jeu/dead-cells/index.html
+++ b/jeu/dead-cells/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Dead Cells — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Roguelite coupant, rythme nerveux. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/dead-cells/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Dead Cells","description":"Roguelite coupant, rythme nerveux.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/588650/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"4.71","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/dead-cells/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Dead Cells","description":"Roguelite coupant, rythme nerveux.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/588650/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"4.71","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2090-acheter-steam-dead-cells-pc-mac-jeu-steam-europe-us-canada/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/dead-space/index.html b/jeu/dead-space/index.html
index 0c8b25f..1cda85b 100644
--- a/jeu/dead-space/index.html
+++ b/jeu/dead-space/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Dead Space — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Remake survival horror EA Motive. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/dead-space/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Dead Space","description":"Remake survival horror EA Motive.","image":"https://gaming-cdn.com/images/products/16850/616x353/dead-space-2023-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"23.01","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/dead-space/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Dead Space","description":"Remake survival horror EA Motive.","image":"https://gaming-cdn.com/images/products/16850/616x353/dead-space-2023-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"23.01","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/16850-acheter-steam-dead-space-2023-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/death-stranding-2/index.html b/jeu/death-stranding-2/index.html
index fbf72a0..e2aaf87 100644
--- a/jeu/death-stranding-2/index.html
+++ b/jeu/death-stranding-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Death Stranding 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Suite Kojima — livraison, monde, cinéma. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/death-stranding-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Death Stranding 2","description":"Suite Kojima — livraison, monde, cinéma.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/3280350/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"55.79","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/death-stranding-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Death Stranding 2","description":"Suite Kojima — livraison, monde, cinéma.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/3280350/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"55.79","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/13292-acheter-steam-death-stranding-2-on-the-beach-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/deep-rock-galactic/index.html b/jeu/deep-rock-galactic/index.html
index ff6c944..0e90f3e 100644
--- a/jeu/deep-rock-galactic/index.html
+++ b/jeu/deep-rock-galactic/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Deep Rock Galactic — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Missions courtes, fun immédiat. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/deep-rock-galactic/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Deep Rock Galactic","description":"Missions courtes, fun immédiat.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/548430/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"8.88","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/deep-rock-galactic/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Deep Rock Galactic","description":"Missions courtes, fun immédiat.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/548430/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"8.88","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/6323-acheter-deep-rock-galactic-pc-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/devil-may-cry-5/index.html b/jeu/devil-may-cry-5/index.html
index 8513afb..85df472 100644
--- a/jeu/devil-may-cry-5/index.html
+++ b/jeu/devil-may-cry-5/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Devil May Cry 5 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Combo stylish Capcom — Vergil inclus. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/devil-may-cry-5/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Devil May Cry 5","description":"Combo stylish Capcom — Vergil inclus.","image":"https://gaming-cdn.com/images/products/2670/616x353/devil-may-cry-5-vergil-pc-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.39","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/devil-may-cry-5/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Devil May Cry 5","description":"Combo stylish Capcom — Vergil inclus.","image":"https://gaming-cdn.com/images/products/2670/616x353/devil-may-cry-5-vergil-pc-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.39","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2670-acheter-steam-devil-may-cry-5-vergil-pc-jeu-steam-europe?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/diablo-iv/index.html b/jeu/diablo-iv/index.html
index ae7f713..b6bf33c 100644
--- a/jeu/diablo-iv/index.html
+++ b/jeu/diablo-iv/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Diablo IV — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="ARPG Blizzard — saisons et campagnes. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/diablo-iv/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Diablo IV","description":"ARPG Blizzard — saisons et campagnes.","image":"https://gaming-cdn.com/images/products/5680/616x353/diablo-iv-pc-battle-net-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"49.49","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/diablo-iv/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Diablo IV","description":"ARPG Blizzard — saisons et campagnes.","image":"https://gaming-cdn.com/images/products/5680/616x353/diablo-iv-pc-battle-net-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"49.49","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/5680-acheter-battle-net-diablo-iv-pc-battle-net?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/disco-elysium/index.html b/jeu/disco-elysium/index.html
index 13387e0..0214286 100644
--- a/jeu/disco-elysium/index.html
+++ b/jeu/disco-elysium/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Disco Elysium — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="RPG narratif, Final Cut — dialogue et enquête. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/disco-elysium/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Disco Elysium","description":"RPG narratif, Final Cut — dialogue et enquête.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/632470/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"4.74","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/disco-elysium/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Disco Elysium","description":"RPG narratif, Final Cut — dialogue et enquête.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/632470/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"4.74","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/9753-acheter-steam-disco-elysium-the-final-cut-pc-mac-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/don-t-starve-together/index.html b/jeu/don-t-starve-together/index.html
index 389b8b7..de0c264 100644
--- a/jeu/don-t-starve-together/index.html
+++ b/jeu/don-t-starve-together/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Don't Starve Together — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Survie Wilson &amp; potes. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/don-t-starve-together/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Don't Starve Together","description":"Survie Wilson & potes.","image":"https://gaming-cdn.com/images/products/5415/616x353/don-t-starve-together-pc-mac-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.5","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/don-t-starve-together/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Don't Starve Together","description":"Survie Wilson & potes.","image":"https://gaming-cdn.com/images/products/5415/616x353/don-t-starve-together-pc-mac-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.5","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/5415-acheter-steam-don-t-starve-together-pc-mac-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/doom-eternal/index.html b/jeu/doom-eternal/index.html
index 3dbe51b..95ffcc1 100644
--- a/jeu/doom-eternal/index.html
+++ b/jeu/doom-eternal/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>DOOM Eternal — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="FPS ultra-violent id Software. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/doom-eternal/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"DOOM Eternal","description":"FPS ultra-violent id Software.","image":"https://gaming-cdn.com/images/products/7664/616x353/doom-eternal-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"10.11","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/doom-eternal/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"DOOM Eternal","description":"FPS ultra-violent id Software.","image":"https://gaming-cdn.com/images/products/7664/616x353/doom-eternal-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"10.11","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/7664-acheter-steam-doom-eternal-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/doom-the-dark-ages/index.html b/jeu/doom-the-dark-ages/index.html
index 89866f0..77c9fa5 100644
--- a/jeu/doom-the-dark-ages/index.html
+++ b/jeu/doom-the-dark-ages/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>DOOM: The Dark Ages — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Le nouveau DOOM. Slayer mode on. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/doom-the-dark-ages/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"DOOM: The Dark Ages","description":"Le nouveau DOOM. Slayer mode on.","image":"https://gaming-cdn.com/images/products/16798/616x353/doom-the-dark-ages-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.75","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/doom-the-dark-ages/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"DOOM: The Dark Ages","description":"Le nouveau DOOM. Slayer mode on.","image":"https://gaming-cdn.com/images/products/16798/616x353/doom-the-dark-ages-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.75","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/16798-acheter-doom-the-dark-ages-pc-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/dragon-age-the-veilguard/index.html b/jeu/dragon-age-the-veilguard/index.html
index a68f015..eb8902a 100644
--- a/jeu/dragon-age-the-veilguard/index.html
+++ b/jeu/dragon-age-the-veilguard/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Dragon Age: The Veilguard — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="RPG BioWare — compagnons &amp; combats. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/dragon-age-the-veilguard/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Dragon Age: The Veilguard","description":"RPG BioWare — compagnons & combats.","image":"https://gaming-cdn.com/images/products/6367/616x353/dragon-age-the-veilguard-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"31.89","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/dragon-age-the-veilguard/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Dragon Age: The Veilguard","description":"RPG BioWare — compagnons & combats.","image":"https://gaming-cdn.com/images/products/6367/616x353/dragon-age-the-veilguard-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"31.89","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/6367-acheter-steam-dragon-age-the-veilguard-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/dragon-s-dogma-2/index.html b/jeu/dragon-s-dogma-2/index.html
index 6b31566..4df1782 100644
--- a/jeu/dragon-s-dogma-2/index.html
+++ b/jeu/dragon-s-dogma-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Dragon's Dogma 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Open world + pions. Capcom. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/dragon-s-dogma-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Dragon's Dogma 2","description":"Open world + pions. Capcom.","image":"https://gaming-cdn.com/images/products/7911/616x353/dragon-s-dogma-2-pc-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"13.83","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/dragon-s-dogma-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Dragon's Dogma 2","description":"Open world + pions. Capcom.","image":"https://gaming-cdn.com/images/products/7911/616x353/dragon-s-dogma-2-pc-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"13.83","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/7911-acheter-dragon-s-dogma-2-pc-jeu-steam-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/dying-light-2-stay-human/index.html b/jeu/dying-light-2-stay-human/index.html
index 193b3df..52fc923 100644
--- a/jeu/dying-light-2-stay-human/index.html
+++ b/jeu/dying-light-2-stay-human/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Dying Light 2 Stay Human — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Parkour zombies Techland. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/dying-light-2-stay-human/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Dying Light 2 Stay Human","description":"Parkour zombies Techland.","image":"https://gaming-cdn.com/images/products/15968/616x353/dying-light-2-stay-human-reloaded-edition-reloaded-edition-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"10.68","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/dying-light-2-stay-human/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Dying Light 2 Stay Human","description":"Parkour zombies Techland.","image":"https://gaming-cdn.com/images/products/15968/616x353/dying-light-2-stay-human-reloaded-edition-reloaded-edition-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"10.68","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/15968-acheter-steam-dying-light-2-stay-human-reloaded-edition-reloaded-edition-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/dying-light-the-beast/index.html b/jeu/dying-light-the-beast/index.html
index 3b5921b..e449cfc 100644
--- a/jeu/dying-light-the-beast/index.html
+++ b/jeu/dying-light-the-beast/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Dying Light: The Beast — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Standalone Dying Light — Crane. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/dying-light-the-beast/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Dying Light: The Beast","description":"Standalone Dying Light — Crane.","image":"https://gaming-cdn.com/images/products/17430/616x353/dying-light-the-beast-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"27.1","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/dying-light-the-beast/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Dying Light: The Beast","description":"Standalone Dying Light — Crane.","image":"https://gaming-cdn.com/images/products/17430/616x353/dying-light-the-beast-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"27.1","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/17430-acheter-steam-dying-light-the-beast-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/ea-sports-fc-26/index.html b/jeu/ea-sports-fc-26/index.html
index 1ed49a0..3bfc886 100644
--- a/jeu/ea-sports-fc-26/index.html
+++ b/jeu/ea-sports-fc-26/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>EA Sports FC 26 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Foot EA — saison 25/26. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/ea-sports-fc-26/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"EA Sports FC 26","description":"Foot EA — saison 25/26.","image":"https://gaming-cdn.com/images/products/22947/616x353/ea-sports-fc-26-the-world-s-game-edition-pc-ea-app-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"44.88","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/ea-sports-fc-26/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"EA Sports FC 26","description":"Foot EA — saison 25/26.","image":"https://gaming-cdn.com/images/products/22947/616x353/ea-sports-fc-26-the-world-s-game-edition-pc-ea-app-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"44.88","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/22947-acheter-ea-app-ea-sports-fc-26-the-world-s-game-edition-pc-ea-app?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/ea-sports-fc-27/index.html b/jeu/ea-sports-fc-27/index.html
index 59e09ed..dbdf204 100644
--- a/jeu/ea-sports-fc-27/index.html
+++ b/jeu/ea-sports-fc-27/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>EA Sports FC 27 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Le foot 2026/27. Compare avant d’acheter plein pot. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/ea-sports-fc-27/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"EA Sports FC 27","description":"Le foot 2026/27. Compare avant d’acheter plein pot.","image":"https://gaming-cdn.com/images/products/21656/616x353/ea-sports-fc-27-pc-ea-app-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"64.12","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/ea-sports-fc-27/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"EA Sports FC 27","description":"Le foot 2026/27. Compare avant d’acheter plein pot.","image":"https://gaming-cdn.com/images/products/21656/616x353/ea-sports-fc-27-pc-ea-app-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"64.12","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/21656-acheter-ea-sports-fc-27-pc-ea-app/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/elden-ring-nightreign/index.html b/jeu/elden-ring-nightreign/index.html
index 425515f..5690c88 100644
--- a/jeu/elden-ring-nightreign/index.html
+++ b/jeu/elden-ring-nightreign/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Elden Ring Nightreign — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Spin-off Elden Ring coop. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/elden-ring-nightreign/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Elden Ring Nightreign","description":"Spin-off Elden Ring coop.","image":"https://gaming-cdn.com/images/products/18294/616x353/elden-ring-nightreign-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"33.64","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/elden-ring-nightreign/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Elden Ring Nightreign","description":"Spin-off Elden Ring coop.","image":"https://gaming-cdn.com/images/products/18294/616x353/elden-ring-nightreign-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"33.64","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/18294-acheter-steam-elden-ring-nightreign-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/elden-ring/index.html b/jeu/elden-ring/index.html
index 73c5045..f001e3c 100644
--- a/jeu/elden-ring/index.html
+++ b/jeu/elden-ring/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Elden Ring — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Open world exigeant. À prendre en promo. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/elden-ring/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Elden Ring","description":"Open world exigeant. À prendre en promo.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"51.74","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/elden-ring/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Elden Ring","description":"Open world exigeant. À prendre en promo.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"51.74","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/4824-acheter-elden-ring-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/enshrouded/index.html b/jeu/enshrouded/index.html
index af51815..c40a1b7 100644
--- a/jeu/enshrouded/index.html
+++ b/jeu/enshrouded/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Enshrouded — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Survie voxel — craft et exploration. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/enshrouded/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Enshrouded","description":"Survie voxel — craft et exploration.","image":"https://gaming-cdn.com/images/products/14129/616x353/enshrouded-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"36.44","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/enshrouded/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Enshrouded","description":"Survie voxel — craft et exploration.","image":"https://gaming-cdn.com/images/products/14129/616x353/enshrouded-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"36.44","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/14129-acheter-steam-enshrouded-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/euro-truck-simulator-2/index.html b/jeu/euro-truck-simulator-2/index.html
index e6c559f..187c587 100644
--- a/jeu/euro-truck-simulator-2/index.html
+++ b/jeu/euro-truck-simulator-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Euro Truck Simulator 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Camionnage chill — Europe. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/euro-truck-simulator-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Euro Truck Simulator 2","description":"Camionnage chill — Europe.","image":"https://gaming-cdn.com/images/products/309/616x353/euro-truck-simulator-2-pc-mac-jeu-steam-europe-us-canada-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"12.36","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/euro-truck-simulator-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Euro Truck Simulator 2","description":"Camionnage chill — Europe.","image":"https://gaming-cdn.com/images/products/309/616x353/euro-truck-simulator-2-pc-mac-jeu-steam-europe-us-canada-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"12.36","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/309-acheter-steam-euro-truck-simulator-2-pc-mac-jeu-steam-europe-us-canada?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/f1-25/index.html b/jeu/f1-25/index.html
index dcf3791..26062ce 100644
--- a/jeu/f1-25/index.html
+++ b/jeu/f1-25/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>F1 25 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Formule 1 EA — career &amp; multi. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/f1-25/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"F1 25","description":"Formule 1 EA — career & multi.","image":"https://gaming-cdn.com/images/products/18916/616x353/f1-25-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"47.69","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/f1-25/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"F1 25","description":"Formule 1 EA — career & multi.","image":"https://gaming-cdn.com/images/products/18916/616x353/f1-25-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"47.69","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/18916-acheter-ea-app-f1-25-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/factorio/index.html b/jeu/factorio/index.html
index e7366f8..1f50012 100644
--- a/jeu/factorio/index.html
+++ b/jeu/factorio/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Factorio — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Automatisation addictive — un classique. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/factorio/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Factorio","description":"Automatisation addictive — un classique.","image":"https://gaming-cdn.com/images/products/2157/616x353/jeu-steam-factorio-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"32.62","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/factorio/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Factorio","description":"Automatisation addictive — un classique.","image":"https://gaming-cdn.com/images/products/2157/616x353/jeu-steam-factorio-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"32.62","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/2157-acheter-steam-jeu-steam-factorio?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/fallout-4-goty-edition/index.html b/jeu/fallout-4-goty-edition/index.html
index 1bbe4f9..2fd9e4e 100644
--- a/jeu/fallout-4-goty-edition/index.html
+++ b/jeu/fallout-4-goty-edition/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Fallout 4 GOTY Edition — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Post-apo Bethesda — GOTY avec DLC. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/fallout-4-goty-edition/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Fallout 4 GOTY Edition","description":"Post-apo Bethesda — GOTY avec DLC.","image":"https://gaming-cdn.com/images/products/2207/616x353/fallout-4-goty-edition-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"13.49","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/fallout-4-goty-edition/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Fallout 4 GOTY Edition","description":"Post-apo Bethesda — GOTY avec DLC.","image":"https://gaming-cdn.com/images/products/2207/616x353/fallout-4-goty-edition-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"13.49","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2207-acheter-steam-fallout-4-goty-edition-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/far-cry-5/index.html b/jeu/far-cry-5/index.html
index 977cd5f..63f9ccc 100644
--- a/jeu/far-cry-5/index.html
+++ b/jeu/far-cry-5/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Far Cry 5 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Open world chaos. Très souvent en promo. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/far-cry-5/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Far Cry 5","description":"Open world chaos. Très souvent en promo.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/552520/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"9.21","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/far-cry-5/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Far Cry 5","description":"Open world chaos. Très souvent en promo.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/552520/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"9.21","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/1842-acheter-far-cry-5-pc-jeu-ubisoft-connect-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/far-cry-6/index.html b/jeu/far-cry-6/index.html
index 0718b1e..89ca27f 100644
--- a/jeu/far-cry-6/index.html
+++ b/jeu/far-cry-6/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Far Cry 6 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Dictature tropicale + armes folles. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/far-cry-6/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Far Cry 6","description":"Dictature tropicale + armes folles.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/2369390/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"9.44","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/far-cry-6/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Far Cry 6","description":"Dictature tropicale + armes folles.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/2369390/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"9.44","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/7080-acheter-far-cry-6-pc-jeu-ubisoft-connect-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/farming-simulator-25/index.html b/jeu/farming-simulator-25/index.html
index 31b8263..adb7dec 100644
--- a/jeu/farming-simulator-25/index.html
+++ b/jeu/farming-simulator-25/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Farming Simulator 25 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Ferme et engins — solo ou coop. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/farming-simulator-25/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Farming Simulator 25","description":"Ferme et engins — solo ou coop.","image":"https://gaming-cdn.com/images/products/16993/616x353/farming-simulator-25-pc-mac-jeu-steam-europe-us-canada-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"17.99","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/farming-simulator-25/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Farming Simulator 25","description":"Ferme et engins — solo ou coop.","image":"https://gaming-cdn.com/images/products/16993/616x353/farming-simulator-25-pc-mac-jeu-steam-europe-us-canada-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"17.99","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/16993-acheter-steam-farming-simulator-25-pc-mac-jeu-steam-europe-us-canada?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/final-fantasy-vii-remake-intergrade/index.html b/jeu/final-fantasy-vii-remake-intergrade/index.html
index 91eff2a..6ff5f9e 100644
--- a/jeu/final-fantasy-vii-remake-intergrade/index.html
+++ b/jeu/final-fantasy-vii-remake-intergrade/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>FINAL FANTASY VII REMAKE INTERGRADE — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="FF7 Remake sur PC — Midgar. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/final-fantasy-vii-remake-intergrade/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"FINAL FANTASY VII REMAKE INTERGRADE","description":"FF7 Remake sur PC — Midgar.","image":"https://gaming-cdn.com/images/products/5913/616x353/final-fantasy-vii-remake-intergrade-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"17.2","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/final-fantasy-vii-remake-intergrade/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"FINAL FANTASY VII REMAKE INTERGRADE","description":"FF7 Remake sur PC — Midgar.","image":"https://gaming-cdn.com/images/products/5913/616x353/final-fantasy-vii-remake-intergrade-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"17.2","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/5913-acheter-steam-final-fantasy-vii-remake-intergrade-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/final-fantasy-xvi/index.html b/jeu/final-fantasy-xvi/index.html
index 3a405c3..544687f 100644
--- a/jeu/final-fantasy-xvi/index.html
+++ b/jeu/final-fantasy-xvi/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>FINAL FANTASY XVI — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Action FF — Clive et Eikons. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/final-fantasy-xvi/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"FINAL FANTASY XVI","description":"Action FF — Clive et Eikons.","image":"https://gaming-cdn.com/images/products/17418/616x353/final-fantasy-xvi-complete-edition-complete-edition-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"29.35","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/final-fantasy-xvi/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"FINAL FANTASY XVI","description":"Action FF — Clive et Eikons.","image":"https://gaming-cdn.com/images/products/17418/616x353/final-fantasy-xvi-complete-edition-complete-edition-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"29.35","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/17418-acheter-steam-final-fantasy-xvi-complete-edition-complete-edition-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/forza-horizon-5/index.html b/jeu/forza-horizon-5/index.html
index caae215..6d54e7e 100644
--- a/jeu/forza-horizon-5/index.html
+++ b/jeu/forza-horizon-5/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Forza Horizon 5 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Conduire + musique. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/forza-horizon-5/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Forza Horizon 5","description":"Conduire + musique.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"29.47","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/forza-horizon-5/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Forza Horizon 5","description":"Conduire + musique.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"29.47","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/8701-acheter-forza-horizon-5-pc-xbox-one-xbox-series-x-s-jeu-microsoft-store/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/forza-motorsport/index.html b/jeu/forza-motorsport/index.html
index 0512aa7..fdd3287 100644
--- a/jeu/forza-motorsport/index.html
+++ b/jeu/forza-motorsport/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Forza Motorsport — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Course simcade Xbox. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/forza-motorsport/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Forza Motorsport","description":"Course simcade Xbox.","image":"https://gaming-cdn.com/images/products/6842/616x353/forza-motorsport-pc-xbox-series-x-s-microsoft-store-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"35.65","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/forza-motorsport/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Forza Motorsport","description":"Course simcade Xbox.","image":"https://gaming-cdn.com/images/products/6842/616x353/forza-motorsport-pc-xbox-series-x-s-microsoft-store-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"35.65","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/6842-acheter-xbox-series-x-s-forza-motorsport-pc-xbox-series-x-s-microsoft-store?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/garry-s-mod/index.html b/jeu/garry-s-mod/index.html
index 8d4ef69..954898f 100644
--- a/jeu/garry-s-mod/index.html
+++ b/jeu/garry-s-mod/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Garry's Mod — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Sandbox Steam — modes infinis. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/garry-s-mod/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Garry's Mod","description":"Sandbox Steam — modes infinis.","image":"https://gaming-cdn.com/images/products/6401/616x353/garry-s-mod-pc-mac-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"7.3","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/garry-s-mod/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Garry's Mod","description":"Sandbox Steam — modes infinis.","image":"https://gaming-cdn.com/images/products/6401/616x353/garry-s-mod-pc-mac-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"7.3","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/6401-acheter-steam-garry-s-mod-pc-mac-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/ghost-of-tsushima-director-s-cut/index.html b/jeu/ghost-of-tsushima-director-s-cut/index.html
index 16b2a8a..dfcba02 100644
--- a/jeu/ghost-of-tsushima-director-s-cut/index.html
+++ b/jeu/ghost-of-tsushima-director-s-cut/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Ghost of Tsushima Director's Cut — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Samouraï open world. Director's Cut. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/ghost-of-tsushima-director-s-cut/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Ghost of Tsushima Director's Cut","description":"Samouraï open world. Director's Cut.","image":"https://gaming-cdn.com/images/products/9093/616x353/ghost-of-tsushima-director-s-cut-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"33.52","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/ghost-of-tsushima-director-s-cut/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Ghost of Tsushima Director's Cut","description":"Samouraï open world. Director's Cut.","image":"https://gaming-cdn.com/images/products/9093/616x353/ghost-of-tsushima-director-s-cut-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"33.52","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/9093-acheter-ghost-of-tsushima-director-s-cut-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/ghost-of-yotei/index.html b/jeu/ghost-of-yotei/index.html
index 62df6c5..db853a9 100644
--- a/jeu/ghost-of-yotei/index.html
+++ b/jeu/ghost-of-yotei/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Ghost of Yōtei — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Suite spirituelle de Ghost of Tsushima — PS5. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/ghost-of-yotei/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Ghost of Yōtei","description":"Suite spirituelle de Ghost of Tsushima — PS5.","image":"https://gaming-cdn.com/images/products/17722/616x353/ghost-of-yotei-playstation-5-playstation-store-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Ghost of Yōtei","description":"Suite spirituelle de Ghost of Tsushima — PS5.","image":"https://gaming-cdn.com/images/products/17722/616x353/ghost-of-yotei-playstation-5-playstation-store-cover.jpg"}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/god-of-war-ragnarok/index.html b/jeu/god-of-war-ragnarok/index.html
index e347d3b..25407df 100644
--- a/jeu/god-of-war-ragnarok/index.html
+++ b/jeu/god-of-war-ragnarok/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>God of War Ragnarök — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Suite mythique. Souvent en promo PS5. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/god-of-war-ragnarok/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"God of War Ragnarök","description":"Suite mythique. Souvent en promo PS5.","image":"https://gaming-cdn.com/images/products/9312/616x353/god-of-war-ragnarok-playstation-5-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"48.85","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/god-of-war-ragnarok/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"God of War Ragnarök","description":"Suite mythique. Souvent en promo PS5.","image":"https://gaming-cdn.com/images/products/9312/616x353/god-of-war-ragnarok-playstation-5-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"48.85","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/9312-acheter-god-of-war-ragnarok-playstation-5-jeu-playstation-store-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/god-of-war/index.html b/jeu/god-of-war/index.html
index d57bd7a..2ac4968 100644
--- a/jeu/god-of-war/index.html
+++ b/jeu/god-of-war/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>God of War — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Kratos + Atreus. Solo narratif fort. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/god-of-war/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"God of War","description":"Kratos + Atreus. Solo narratif fort.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"18.44","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/god-of-war/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"God of War","description":"Kratos + Atreus. Solo narratif fort.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"18.44","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/7325-acheter-god-of-war-pc-jeu-steam-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/grand-theft-auto-vi/index.html b/jeu/grand-theft-auto-vi/index.html
index f7043d9..43a3a30 100644
--- a/jeu/grand-theft-auto-vi/index.html
+++ b/jeu/grand-theft-auto-vi/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Grand Theft Auto VI — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Précommande PC Rockstar. Surveille le prix avant le jour J. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/grand-theft-auto-vi/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Grand Theft Auto VI","description":"Précommande PC Rockstar. Surveille le prix avant le jour J.","image":"https://gaming-cdn.com/images/products/2462/616x353/grand-theft-auto-vi-pc-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Grand Theft Auto VI","description":"Précommande PC Rockstar. Surveille le prix avant le jour J.","image":"https://gaming-cdn.com/images/products/2462/616x353/grand-theft-auto-vi-pc-cover.jpg"}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/grounded/index.html b/jeu/grounded/index.html
index 24d642f..1b1010e 100644
--- a/jeu/grounded/index.html
+++ b/jeu/grounded/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Grounded — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Survie insectes — solo ou potes. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/grounded/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Grounded","description":"Survie insectes — solo ou potes.","image":"https://gaming-cdn.com/images/products/6268/616x353/grounded-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"22.49","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/grounded/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Grounded","description":"Survie insectes — solo ou potes.","image":"https://gaming-cdn.com/images/products/6268/616x353/grounded-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"22.49","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/6268-acheter-steam-grounded-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/gta-v-enhanced/index.html b/jeu/gta-v-enhanced/index.html
index a72f1fb..dfe8fc3 100644
--- a/jeu/gta-v-enhanced/index.html
+++ b/jeu/gta-v-enhanced/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>GTA V Enhanced — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Classique pas cher + GTA Online. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/gta-v-enhanced/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"GTA V Enhanced","description":"Classique pas cher + GTA Online.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/3240220/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"11.01","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/gta-v-enhanced/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"GTA V Enhanced","description":"Classique pas cher + GTA Online.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/3240220/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"11.01","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/4211-acheter-grand-theft-auto-v-enhanced-pc-rockstar/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/hades-ii/index.html b/jeu/hades-ii/index.html
index 1866ccb..4423de8 100644
--- a/jeu/hades-ii/index.html
+++ b/jeu/hades-ii/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Hades II — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Suite du roguelike d’enfer. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/hades-ii/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hades II","description":"Suite du roguelike d’enfer.","image":"https://gaming-cdn.com/images/products/13290/616x353/hades-ii-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"18.23","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/hades-ii/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hades II","description":"Suite du roguelike d’enfer.","image":"https://gaming-cdn.com/images/products/13290/616x353/hades-ii-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"18.23","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/13290-acheter-hades-ii-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/hades/index.html b/jeu/hades/index.html
index c387104..f1578f9 100644
--- a/jeu/hades/index.html
+++ b/jeu/hades/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Hades — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Une run vite. Difficile de s’arrêter. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/hades/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hades","description":"Une run vite. Difficile de s’arrêter.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"21.71","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/hades/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hades","description":"Une run vite. Difficile de s’arrêter.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"21.71","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/5972-acheter-hades-pc-mac-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/half-life-alyx/index.html b/jeu/half-life-alyx/index.html
index 876235f..934fd6a 100644
--- a/jeu/half-life-alyx/index.html
+++ b/jeu/half-life-alyx/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Half-Life: Alyx — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="VR Valve — le best-of Half-Life. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/half-life-alyx/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Half-Life: Alyx","description":"VR Valve — le best-of Half-Life.","image":"https://gaming-cdn.com/images/products/5816/616x353/half-life-alyx-vr-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"47.6","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/half-life-alyx/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Half-Life: Alyx","description":"VR Valve — le best-of Half-Life.","image":"https://gaming-cdn.com/images/products/5816/616x353/half-life-alyx-vr-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"47.6","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/5816-acheter-steam-half-life-alyx-vr-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/halo-infinite-campaign/index.html b/jeu/halo-infinite-campaign/index.html
index 9a5b175..6b52ebb 100644
--- a/jeu/halo-infinite-campaign/index.html
+++ b/jeu/halo-infinite-campaign/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Halo Infinite Campaign — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Campagne Spartan. Xbox + PC (Play Anywhere). Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/halo-infinite-campaign/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Halo Infinite Campaign","description":"Campagne Spartan. Xbox + PC (Play Anywhere).","image":"https://gaming-cdn.com/images/products/2674/616x353/halo-infinite-campaign-pc-xbox-one-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"16.53","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/halo-infinite-campaign/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Halo Infinite Campaign","description":"Campagne Spartan. Xbox + PC (Play Anywhere).","image":"https://gaming-cdn.com/images/products/2674/616x353/halo-infinite-campaign-pc-xbox-one-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"16.53","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2674-acheter-halo-infinite-campaign-pc-xbox-one-jeu-microsoft-store/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/helldivers-2/index.html b/jeu/helldivers-2/index.html
index a3039ed..ed60d38 100644
--- a/jeu/helldivers-2/index.html
+++ b/jeu/helldivers-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Helldivers 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Bruyant, drôle, parfait en groupe. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/helldivers-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Helldivers 2","description":"Bruyant, drôle, parfait en groupe.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"26.99","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/helldivers-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Helldivers 2","description":"Bruyant, drôle, parfait en groupe.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"26.99","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/9575-acheter-helldivers-2-pc-jeu-steam-europe-us-canada/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/hogwarts-legacy/index.html b/jeu/hogwarts-legacy/index.html
index d1b5e77..b062cee 100644
--- a/jeu/hogwarts-legacy/index.html
+++ b/jeu/hogwarts-legacy/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Hogwarts Legacy — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Poudlard open world. Souvent soldé. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/hogwarts-legacy/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hogwarts Legacy","description":"Poudlard open world. Souvent soldé.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"8.54","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/hogwarts-legacy/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hogwarts Legacy","description":"Poudlard open world. Souvent soldé.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/990080/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"8.54","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/7072-acheter-hogwarts-legacy-l-heritage-de-poudlard-pc-jeu-steam-europe-us-canada/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/hollow-knight-silksong/index.html b/jeu/hollow-knight-silksong/index.html
index 8e693ed..8971724 100644
--- a/jeu/hollow-knight-silksong/index.html
+++ b/jeu/hollow-knight-silksong/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Hollow Knight: Silksong — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="La suite tant attendue — exploration et combats serrés. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/hollow-knight-silksong/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hollow Knight: Silksong","description":"La suite tant attendue — exploration et combats serrés.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1030300/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"14.84","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/hollow-knight-silksong/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hollow Knight: Silksong","description":"La suite tant attendue — exploration et combats serrés.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1030300/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"14.84","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/3952-acheter-steam-hollow-knight-silksong-pc-mac-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/hollow-knight/index.html b/jeu/hollow-knight/index.html
index c32cd0e..7be5a25 100644
--- a/jeu/hollow-knight/index.html
+++ b/jeu/hollow-knight/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Hollow Knight — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Metroidvania exigeant, monde souterrain immense. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/hollow-knight/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hollow Knight","description":"Metroidvania exigeant, monde souterrain immense.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"8.76","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/hollow-knight/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hollow Knight","description":"Metroidvania exigeant, monde souterrain immense.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"8.76","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2198-acheter-steam-hollow-knight-pc-mac-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/horizon-forbidden-west/index.html b/jeu/horizon-forbidden-west/index.html
index 514e96a..6bfd0db 100644
--- a/jeu/horizon-forbidden-west/index.html
+++ b/jeu/horizon-forbidden-west/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Horizon Forbidden West — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Open world machines. PS4 &amp; PS5. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/horizon-forbidden-west/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Horizon Forbidden West","description":"Open world machines. PS4 & PS5.","image":"https://gaming-cdn.com/images/products/13049/616x353/horizon-forbidden-west-playstation-5-playstation-4-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"40.97","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/horizon-forbidden-west/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Horizon Forbidden West","description":"Open world machines. PS4 & PS5.","image":"https://gaming-cdn.com/images/products/13049/616x353/horizon-forbidden-west-playstation-5-playstation-4-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"40.97","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/13049-acheter-horizon-forbidden-west-playstation-5-playstation-4-jeu-playstation-store-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/hunt-showdown-1896/index.html b/jeu/hunt-showdown-1896/index.html
index a2cddc3..4af9fd6 100644
--- a/jeu/hunt-showdown-1896/index.html
+++ b/jeu/hunt-showdown-1896/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Hunt: Showdown 1896 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Extraction PvPvE — bayou 1896. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/hunt-showdown-1896/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hunt: Showdown 1896","description":"Extraction PvPvE — bayou 1896.","image":"https://gaming-cdn.com/images/products/2464/616x353/hunt-showdown-1896-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"11.13","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/hunt-showdown-1896/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Hunt: Showdown 1896","description":"Extraction PvPvE — bayou 1896.","image":"https://gaming-cdn.com/images/products/2464/616x353/hunt-showdown-1896-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"11.13","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2464-acheter-steam-hunt-showdown-1896-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/indiana-jones-and-the-great-circle/index.html b/jeu/indiana-jones-and-the-great-circle/index.html
index aef9ba6..e2e158b 100644
--- a/jeu/indiana-jones-and-the-great-circle/index.html
+++ b/jeu/indiana-jones-and-the-great-circle/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Indiana Jones and the Great Circle — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Aventure 1ère personne Bethesda. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/indiana-jones-and-the-great-circle/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Indiana Jones and the Great Circle","description":"Aventure 1ère personne Bethesda.","image":"https://gaming-cdn.com/images/products/8043/616x353/indiana-jones-et-le-cercle-ancien-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"34.87","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/indiana-jones-and-the-great-circle/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Indiana Jones and the Great Circle","description":"Aventure 1ère personne Bethesda.","image":"https://gaming-cdn.com/images/products/8043/616x353/indiana-jones-et-le-cercle-ancien-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"34.87","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/8043-acheter-indiana-jones-et-le-cercle-ancien-pc-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/inscryption/index.html b/jeu/inscryption/index.html
index 771f549..33b037f 100644
--- a/jeu/inscryption/index.html
+++ b/jeu/inscryption/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Inscryption — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Deckbuilder horreur — twists. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/inscryption/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Inscryption","description":"Deckbuilder horreur — twists.","image":"https://gaming-cdn.com/images/products/9879/616x353/inscryption-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"7.08","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/inscryption/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Inscryption","description":"Deckbuilder horreur — twists.","image":"https://gaming-cdn.com/images/products/9879/616x353/inscryption-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"7.08","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/9879-acheter-steam-inscryption-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/it-takes-two/index.html b/jeu/it-takes-two/index.html
index 87a7138..949ac3a 100644
--- a/jeu/it-takes-two/index.html
+++ b/jeu/it-takes-two/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>It Takes Two — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Le duo coop n°1. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/it-takes-two/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"It Takes Two","description":"Le duo coop n°1.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"15.29","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/it-takes-two/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"It Takes Two","description":"Le duo coop n°1.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1426210/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"15.29","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/8103-acheter-it-takes-two-pc-jeu-ea-app/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/kingdom-come-deliverance-ii/index.html b/jeu/kingdom-come-deliverance-ii/index.html
index 215212d..c56636f 100644
--- a/jeu/kingdom-come-deliverance-ii/index.html
+++ b/jeu/kingdom-come-deliverance-ii/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Kingdom Come: Deliverance II — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="RPG médiéval réaliste, suite attendue. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/kingdom-come-deliverance-ii/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Kingdom Come: Deliverance II","description":"RPG médiéval réaliste, suite attendue.","image":"https://gaming-cdn.com/images/products/8988/616x353/kingdom-come-deliverance-ii-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"22.94","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/kingdom-come-deliverance-ii/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Kingdom Come: Deliverance II","description":"RPG médiéval réaliste, suite attendue.","image":"https://gaming-cdn.com/images/products/8988/616x353/kingdom-come-deliverance-ii-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"22.94","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/8988-acheter-kingdom-come-deliverance-ii-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/left-4-dead-2/index.html b/jeu/left-4-dead-2/index.html
index 8b4aa03..b0d0ba1 100644
--- a/jeu/left-4-dead-2/index.html
+++ b/jeu/left-4-dead-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Left 4 Dead 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Zombies Valve — 4 joueurs. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/left-4-dead-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Left 4 Dead 2","description":"Zombies Valve — 4 joueurs.","image":"https://gaming-cdn.com/images/products/733/616x353/left-4-dead-2-pc-mac-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"4.06","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/left-4-dead-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Left 4 Dead 2","description":"Zombies Valve — 4 joueurs.","image":"https://gaming-cdn.com/images/products/733/616x353/left-4-dead-2-pc-mac-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"4.06","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/733-acheter-steam-left-4-dead-2-pc-mac-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/lethal-company/index.html b/jeu/lethal-company/index.html
index e806eb1..62d6a81 100644
--- a/jeu/lethal-company/index.html
+++ b/jeu/lethal-company/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Lethal Company — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Petit prix, gros fou rire. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/lethal-company/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Lethal Company","description":"Petit prix, gros fou rire.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Lethal Company","description":"Petit prix, gros fou rire.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/header.jpg"}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/lies-of-p/index.html b/jeu/lies-of-p/index.html
index f1deb32..eeaba08 100644
--- a/jeu/lies-of-p/index.html
+++ b/jeu/lies-of-p/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Lies of P — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Souls-like Pinocchio. Exigeant. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/lies-of-p/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Lies of P","description":"Souls-like Pinocchio. Exigeant.","image":"https://gaming-cdn.com/images/products/8855/616x353/lies-of-p-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"22.49","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/lies-of-p/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Lies of P","description":"Souls-like Pinocchio. Exigeant.","image":"https://gaming-cdn.com/images/products/8855/616x353/lies-of-p-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"22.49","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/8855-acheter-lies-of-p-pc-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/like-a-dragon-infinite-wealth/index.html b/jeu/like-a-dragon-infinite-wealth/index.html
index 0461fbb..7a5fa9f 100644
--- a/jeu/like-a-dragon-infinite-wealth/index.html
+++ b/jeu/like-a-dragon-infinite-wealth/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Like a Dragon: Infinite Wealth — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Yakuza turn-based — Hawaii &amp; Yokohama. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/like-a-dragon-infinite-wealth/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Like a Dragon: Infinite Wealth","description":"Yakuza turn-based — Hawaii & Yokohama.","image":"https://gaming-cdn.com/images/products/12541/616x353/like-a-dragon-infinite-wealth-pc-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"26.54","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/like-a-dragon-infinite-wealth/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Like a Dragon: Infinite Wealth","description":"Yakuza turn-based — Hawaii & Yokohama.","image":"https://gaming-cdn.com/images/products/12541/616x353/like-a-dragon-infinite-wealth-pc-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"26.54","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/12541-acheter-steam-like-a-dragon-infinite-wealth-pc-jeu-steam-europe?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/little-nightmares-iii/index.html b/jeu/little-nightmares-iii/index.html
index 8bc780c..38bc08c 100644
--- a/jeu/little-nightmares-iii/index.html
+++ b/jeu/little-nightmares-iii/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Little Nightmares III — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Horreur puzzle coop. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/little-nightmares-iii/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Little Nightmares III","description":"Horreur puzzle coop.","image":"https://gaming-cdn.com/images/products/14831/616x353/little-nightmares-iii-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"21.37","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/little-nightmares-iii/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Little Nightmares III","description":"Horreur puzzle coop.","image":"https://gaming-cdn.com/images/products/14831/616x353/little-nightmares-iii-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"21.37","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/14831-acheter-steam-little-nightmares-iii-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/mafia-the-old-country/index.html b/jeu/mafia-the-old-country/index.html
index d3f50da..f2ac9fd 100644
--- a/jeu/mafia-the-old-country/index.html
+++ b/jeu/mafia-the-old-country/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Mafia: The Old Country — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Sicile 1900 — origines de la mafia, action à la 3e personne. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/mafia-the-old-country/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Mafia: The Old Country","description":"Sicile 1900 — origines de la mafia, action à la 3e personne.","image":"https://gaming-cdn.com/images/products/19337/616x353/mafia-the-old-country-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"50.62","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/mafia-the-old-country/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Mafia: The Old Country","description":"Sicile 1900 — origines de la mafia, action à la 3e personne.","image":"https://gaming-cdn.com/images/products/19337/616x353/mafia-the-old-country-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"50.62","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/19337-acheter-mafia-the-old-country-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/mario-kart-8-deluxe/index.html b/jeu/mario-kart-8-deluxe/index.html
index e67e728..01fb273 100644
--- a/jeu/mario-kart-8-deluxe/index.html
+++ b/jeu/mario-kart-8-deluxe/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Mario Kart 8 Deluxe — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Le party game Switch n°1. Canapé obligatoire. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/mario-kart-8-deluxe/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Mario Kart 8 Deluxe","description":"Le party game Switch n°1. Canapé obligatoire.","image":"https://gaming-cdn.com/images/products/2615/616x353/mario-kart-8-deluxe-switch-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"64.68","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/mario-kart-8-deluxe/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Mario Kart 8 Deluxe","description":"Le party game Switch n°1. Canapé obligatoire.","image":"https://gaming-cdn.com/images/products/2615/616x353/mario-kart-8-deluxe-switch-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"64.68","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2615-acheter-mario-kart-8-deluxe-switch-jeu-nintendo-eshop-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/marvel-s-spider-man-2/index.html b/jeu/marvel-s-spider-man-2/index.html
index ed2f14d..c28ef46 100644
--- a/jeu/marvel-s-spider-man-2/index.html
+++ b/jeu/marvel-s-spider-man-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Marvel's Spider-Man 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Peter + Miles. Gros solo PS5. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/marvel-s-spider-man-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Marvel's Spider-Man 2","description":"Peter + Miles. Gros solo PS5.","image":"https://gaming-cdn.com/images/products/15218/616x353/marvel-s-spider-man-2-playstation-5-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"74.14","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/marvel-s-spider-man-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Marvel's Spider-Man 2","description":"Peter + Miles. Gros solo PS5.","image":"https://gaming-cdn.com/images/products/15218/616x353/marvel-s-spider-man-2-playstation-5-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"74.14","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/15218-acheter-marvel-s-spider-man-2-playstation-5-jeu-playstation-store-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/marvel-s-spider-man/index.html b/jeu/marvel-s-spider-man/index.html
index 69bafa5..868cd39 100644
--- a/jeu/marvel-s-spider-man/index.html
+++ b/jeu/marvel-s-spider-man/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Marvel's Spider-Man — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Swinguer à New York. Remaster PC. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/marvel-s-spider-man/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Marvel's Spider-Man","description":"Swinguer à New York. Remaster PC.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"21.82","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/marvel-s-spider-man/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Marvel's Spider-Man","description":"Swinguer à New York. Remaster PC.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1817070/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"21.82","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/11907-acheter-marvel-s-spider-man-remastered-pc-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/mass-effect-legendary-edition/index.html b/jeu/mass-effect-legendary-edition/index.html
index 07637fd..05d4993 100644
--- a/jeu/mass-effect-legendary-edition/index.html
+++ b/jeu/mass-effect-legendary-edition/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Mass Effect Legendary Edition — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="La trilogie ME remasterisée. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/mass-effect-legendary-edition/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Mass Effect Legendary Edition","description":"La trilogie ME remasterisée.","image":"https://gaming-cdn.com/images/products/15228/616x353/mass-effect-legendary-edition-legendary-edition-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.88","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/mass-effect-legendary-edition/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Mass Effect Legendary Edition","description":"La trilogie ME remasterisée.","image":"https://gaming-cdn.com/images/products/15228/616x353/mass-effect-legendary-edition-legendary-edition-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.88","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/15228-acheter-steam-mass-effect-legendary-edition-legendary-edition-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/metal-gear-solid-snake-eater/index.html b/jeu/metal-gear-solid-snake-eater/index.html
index 5c5bf7b..4976ee3 100644
--- a/jeu/metal-gear-solid-snake-eater/index.html
+++ b/jeu/metal-gear-solid-snake-eater/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>METAL GEAR SOLID Δ: SNAKE EATER — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Remake MGS3 — Snake Eater. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/metal-gear-solid-snake-eater/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"METAL GEAR SOLID Δ: SNAKE EATER","description":"Remake MGS3 — Snake Eater.","image":"https://gaming-cdn.com/images/products/9827/616x353/metal-gear-solid-delta-snake-eater-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"44.99","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/metal-gear-solid-snake-eater/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"METAL GEAR SOLID Δ: SNAKE EATER","description":"Remake MGS3 — Snake Eater.","image":"https://gaming-cdn.com/images/products/9827/616x353/metal-gear-solid-delta-snake-eater-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"44.99","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/9827-acheter-steam-metal-gear-solid-delta-snake-eater-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/metaphor-refantazio/index.html b/jeu/metaphor-refantazio/index.html
index ab283b4..aac71fe 100644
--- a/jeu/metaphor-refantazio/index.html
+++ b/jeu/metaphor-refantazio/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Metaphor: ReFantazio — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="JRPG Atlus, plusieurs fois Jeu de l’année. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/metaphor-refantazio/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Metaphor: ReFantazio","description":"JRPG Atlus, plusieurs fois Jeu de l’année.","image":"https://gaming-cdn.com/images/products/14352/616x353/metaphor-refantazio-pc-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"21.03","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/metaphor-refantazio/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Metaphor: ReFantazio","description":"JRPG Atlus, plusieurs fois Jeu de l’année.","image":"https://gaming-cdn.com/images/products/14352/616x353/metaphor-refantazio-pc-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"21.03","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/14352-acheter-metaphor-refantazio-pc-jeu-steam-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/metro-exodus/index.html b/jeu/metro-exodus/index.html
index 2cf8f3e..01b3b23 100644
--- a/jeu/metro-exodus/index.html
+++ b/jeu/metro-exodus/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Metro Exodus — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="FPS post-apo — voyage en train. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/metro-exodus/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Metro Exodus","description":"FPS post-apo — voyage en train.","image":"https://gaming-cdn.com/images/products/6460/616x353/metro-exodus-steam-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.61","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/metro-exodus/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Metro Exodus","description":"FPS post-apo — voyage en train.","image":"https://gaming-cdn.com/images/products/6460/616x353/metro-exodus-steam-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.61","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/6460-acheter-steam-metro-exodus-steam-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/microsoft-flight-simulator-2024/index.html b/jeu/microsoft-flight-simulator-2024/index.html
index 232dcb4..406254b 100644
--- a/jeu/microsoft-flight-simulator-2024/index.html
+++ b/jeu/microsoft-flight-simulator-2024/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Microsoft Flight Simulator 2024 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Le simu de vol nouvelle gen. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/microsoft-flight-simulator-2024/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Microsoft Flight Simulator 2024","description":"Le simu de vol nouvelle gen.","image":"https://gaming-cdn.com/images/products/14345/616x353/microsoft-flight-simulator-2024-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"48.37","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/microsoft-flight-simulator-2024/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Microsoft Flight Simulator 2024","description":"Le simu de vol nouvelle gen.","image":"https://gaming-cdn.com/images/products/14345/616x353/microsoft-flight-simulator-2024-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"48.37","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/14345-acheter-steam-microsoft-flight-simulator-2024-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/minecraft/index.html b/jeu/minecraft/index.html
index 7148475..e341505 100644
--- a/jeu/minecraft/index.html
+++ b/jeu/minecraft/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Minecraft — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Java &amp; Bedrock. Petit prix, durée de vie infinie. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/minecraft/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Minecraft","description":"Java & Bedrock. Petit prix, durée de vie infinie.","image":"https://gaming-cdn.com/images/products/12567/616x353/minecraft-java-bedrock-edition-pc-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"18.44","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/minecraft/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Minecraft","description":"Java & Bedrock. Petit prix, durée de vie infinie.","image":"https://gaming-cdn.com/images/products/12567/616x353/minecraft-java-bedrock-edition-pc-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"18.44","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/12567-acheter-minecraft-java-bedrock-edition-pc/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/monster-hunter-wilds/index.html b/jeu/monster-hunter-wilds/index.html
index f787bc9..cf848c6 100644
--- a/jeu/monster-hunter-wilds/index.html
+++ b/jeu/monster-hunter-wilds/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Monster Hunter Wilds — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Chasse en coop, le nouveau MH. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/monster-hunter-wilds/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Monster Hunter Wilds","description":"Chasse en coop, le nouveau MH.","image":"https://gaming-cdn.com/images/products/7930/616x353/monster-hunter-wilds-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.42","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/monster-hunter-wilds/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Monster Hunter Wilds","description":"Chasse en coop, le nouveau MH.","image":"https://gaming-cdn.com/images/products/7930/616x353/monster-hunter-wilds-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.42","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/7930-acheter-monster-hunter-wilds-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/monster-hunter-world/index.html b/jeu/monster-hunter-world/index.html
index ad62110..03eea50 100644
--- a/jeu/monster-hunter-world/index.html
+++ b/jeu/monster-hunter-world/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Monster Hunter: World — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Chasse Capcom — le hit PC. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/monster-hunter-world/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Monster Hunter: World","description":"Chasse Capcom — le hit PC.","image":"https://gaming-cdn.com/images/products/2155/616x353/monster-hunter-world-pc-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"6.51","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/monster-hunter-world/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Monster Hunter: World","description":"Chasse Capcom — le hit PC.","image":"https://gaming-cdn.com/images/products/2155/616x353/monster-hunter-world-pc-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"6.51","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2155-acheter-steam-monster-hunter-world-pc-jeu-steam-europe?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/nba-2k26/index.html b/jeu/nba-2k26/index.html
index c274a9d..4f0ac21 100644
--- a/jeu/nba-2k26/index.html
+++ b/jeu/nba-2k26/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>NBA 2K26 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Basket 2K de la saison. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/nba-2k26/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"NBA 2K26","description":"Basket 2K de la saison.","image":"https://gaming-cdn.com/images/products/21128/616x353/nba-2k26-slam-edition-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"14.95","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/nba-2k26/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"NBA 2K26","description":"Basket 2K de la saison.","image":"https://gaming-cdn.com/images/products/21128/616x353/nba-2k26-slam-edition-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"14.95","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/21128-acheter-steam-nba-2k26-slam-edition-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/need-for-speed-unbound/index.html b/jeu/need-for-speed-unbound/index.html
index cc02f80..4d834aa 100644
--- a/jeu/need-for-speed-unbound/index.html
+++ b/jeu/need-for-speed-unbound/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Need for Speed Unbound — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Course urbaine EA. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/need-for-speed-unbound/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Need for Speed Unbound","description":"Course urbaine EA.","image":"https://gaming-cdn.com/images/products/13496/616x353/need-for-speed-unbound-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"27.43","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/need-for-speed-unbound/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Need for Speed Unbound","description":"Course urbaine EA.","image":"https://gaming-cdn.com/images/products/13496/616x353/need-for-speed-unbound-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"27.43","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/13496-acheter-steam-need-for-speed-unbound-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/nier-automata-game-of-the-yorha-edition/index.html b/jeu/nier-automata-game-of-the-yorha-edition/index.html
index 4f47e0e..3a989fd 100644
--- a/jeu/nier-automata-game-of-the-yorha-edition/index.html
+++ b/jeu/nier-automata-game-of-the-yorha-edition/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>NieR: Automata Game of the YoRHa Edition — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Action Yoko Taro — édition complète YoRHa. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/nier-automata-game-of-the-yorha-edition/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"NieR: Automata Game of the YoRHa Edition","description":"Action Yoko Taro — édition complète YoRHa.","image":"https://gaming-cdn.com/images/products/4082/616x353/nierautomata-game-of-the-yorha-edition-game-of-the-yorha-edition-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"16.19","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/nier-automata-game-of-the-yorha-edition/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"NieR: Automata Game of the YoRHa Edition","description":"Action Yoko Taro — édition complète YoRHa.","image":"https://gaming-cdn.com/images/products/4082/616x353/nierautomata-game-of-the-yorha-edition-game-of-the-yorha-edition-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"16.19","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/4082-acheter-steam-nierautomata-game-of-the-yorha-edition-game-of-the-yorha-edition-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/nine-sols/index.html b/jeu/nine-sols/index.html
index 0d298e3..0c83eb0 100644
--- a/jeu/nine-sols/index.html
+++ b/jeu/nine-sols/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Nine Sols — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Souls-like taïwanais — Sekiro vibes. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/nine-sols/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Nine Sols","description":"Souls-like taïwanais — Sekiro vibes.","image":"https://gaming-cdn.com/images/products/13794/616x353/nine-sols-pc-mac-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"19.12","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/nine-sols/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Nine Sols","description":"Souls-like taïwanais — Sekiro vibes.","image":"https://gaming-cdn.com/images/products/13794/616x353/nine-sols-pc-mac-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"19.12","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/13794-acheter-steam-nine-sols-pc-mac-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/ninja-gaiden-4/index.html b/jeu/ninja-gaiden-4/index.html
index c5e1139..9fb42d9 100644
--- a/jeu/ninja-gaiden-4/index.html
+++ b/jeu/ninja-gaiden-4/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>NINJA GAIDEN 4 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Retour Ninja Gaiden — Team Ninja × Platinum. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/ninja-gaiden-4/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"NINJA GAIDEN 4","description":"Retour Ninja Gaiden — Team Ninja × Platinum.","image":"https://gaming-cdn.com/images/products/18599/616x353/ninja-gaiden-4-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"37.13","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/ninja-gaiden-4/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"NINJA GAIDEN 4","description":"Retour Ninja Gaiden — Team Ninja × Platinum.","image":"https://gaming-cdn.com/images/products/18599/616x353/ninja-gaiden-4-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"37.13","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/18599-acheter-steam-ninja-gaiden-4-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/no-man-s-sky/index.html b/jeu/no-man-s-sky/index.html
index a7714ab..c99d176 100644
--- a/jeu/no-man-s-sky/index.html
+++ b/jeu/no-man-s-sky/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>No Man's Sky — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Univers procédural — solo ou potes. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/no-man-s-sky/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"No Man's Sky","description":"Univers procédural — solo ou potes.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/275850/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"16.87","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/no-man-s-sky/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"No Man's Sky","description":"Univers procédural — solo ou potes.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/275850/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"16.87","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/414-acheter-steam-no-man-s-sky-pc-mac-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/ori-and-the-will-of-the-wisps/index.html b/jeu/ori-and-the-will-of-the-wisps/index.html
index aeaba3f..8b12811 100644
--- a/jeu/ori-and-the-will-of-the-wisps/index.html
+++ b/jeu/ori-and-the-will-of-the-wisps/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Ori and the Will of the Wisps — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Metroidvania Moon Studios. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/ori-and-the-will-of-the-wisps/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Ori and the Will of the Wisps","description":"Metroidvania Moon Studios.","image":"https://gaming-cdn.com/images/products/19582/616x353/ori-and-the-will-of-the-wisps-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"8.2","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/ori-and-the-will-of-the-wisps/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Ori and the Will of the Wisps","description":"Metroidvania Moon Studios.","image":"https://gaming-cdn.com/images/products/19582/616x353/ori-and-the-will-of-the-wisps-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"8.2","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/19582-acheter-steam-ori-and-the-will-of-the-wisps-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/outer-wilds/index.html b/jeu/outer-wilds/index.html
index 58f0021..f3feec8 100644
--- a/jeu/outer-wilds/index.html
+++ b/jeu/outer-wilds/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Outer Wilds — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Exploration spatiale, mystère, zéro combat inutile. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/outer-wilds/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Outer Wilds","description":"Exploration spatiale, mystère, zéro combat inutile.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/753640/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"10.45","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/outer-wilds/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Outer Wilds","description":"Exploration spatiale, mystère, zéro combat inutile.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/753640/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"10.45","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2586-acheter-steam-outer-wilds-pc-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/overcooked-2/index.html b/jeu/overcooked-2/index.html
index ac8b7a4..ee25d41 100644
--- a/jeu/overcooked-2/index.html
+++ b/jeu/overcooked-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Overcooked 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Chaos garanti en 1 match. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/overcooked-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Overcooked 2","description":"Chaos garanti en 1 match.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/728880/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.05","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/overcooked-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Overcooked 2","description":"Chaos garanti en 1 match.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/728880/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.05","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2705-acheter-overcooked-2-pc-mac-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/palworld/index.html b/jeu/palworld/index.html
index 9b35f45..89e04ee 100644
--- a/jeu/palworld/index.html
+++ b/jeu/palworld/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Palworld — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Pokémon meets survival craft. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/palworld/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Palworld","description":"Pokémon meets survival craft.","image":"https://gaming-cdn.com/images/products/23676/616x353/palworld-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"22.49","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/palworld/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Palworld","description":"Pokémon meets survival craft.","image":"https://gaming-cdn.com/images/products/23676/616x353/palworld-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"22.49","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/23676-acheter-palworld-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/payday-3/index.html b/jeu/payday-3/index.html
index 4aeb406..02e4dc6 100644
--- a/jeu/payday-3/index.html
+++ b/jeu/payday-3/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>PAYDAY 3 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Braquages coop. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/payday-3/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"PAYDAY 3","description":"Braquages coop.","image":"https://gaming-cdn.com/images/products/6442/616x353/payday-3-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"14.62","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/payday-3/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"PAYDAY 3","description":"Braquages coop.","image":"https://gaming-cdn.com/images/products/6442/616x353/payday-3-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"14.62","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/6442-acheter-steam-payday-3-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/pc-game-pass-3-mois/index.html b/jeu/pc-game-pass-3-mois/index.html
index 1f4d764..82d98b9 100644
--- a/jeu/pc-game-pass-3-mois/index.html
+++ b/jeu/pc-game-pass-3-mois/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>PC Game Pass — 3 mois — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Catalogue PC uniquement (EA Play inclus). Pas besoin de console. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/pc-game-pass-3-mois/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"PC Game Pass — 3 mois","description":"Catalogue PC uniquement (EA Play inclus). Pas besoin de console.","image":"https://gaming-cdn.com/images/products/7613/616x353/xbox-game-pass-3-mois-pc-microsoft-store-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"38.24","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/pc-game-pass-3-mois/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"PC Game Pass — 3 mois","description":"Catalogue PC uniquement (EA Play inclus). Pas besoin de console.","image":"https://gaming-cdn.com/images/products/7613/616x353/xbox-game-pass-3-mois-pc-microsoft-store-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"38.24","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/7613-acheter-xbox-game-pass-3-mois-pc-microsoft-store/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/peak/index.html b/jeu/peak/index.html
index 20695d8..0abb906 100644
--- a/jeu/peak/index.html
+++ b/jeu/peak/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>PEAK — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Escalade coop absurde — ne lâchez pas la corde. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/peak/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"PEAK","description":"Escalade coop absurde — ne lâchez pas la corde.","image":"https://gaming-cdn.com/images/products/19648/616x353/peak-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"4.04","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/peak/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"PEAK","description":"Escalade coop absurde — ne lâchez pas la corde.","image":"https://gaming-cdn.com/images/products/19648/616x353/peak-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"4.04","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/19648-acheter-steam-peak-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/persona-3-reload/index.html b/jeu/persona-3-reload/index.html
index 03ddb05..53e4096 100644
--- a/jeu/persona-3-reload/index.html
+++ b/jeu/persona-3-reload/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Persona 3 Reload — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="JRPG nocturne, remake soigné. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/persona-3-reload/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Persona 3 Reload","description":"JRPG nocturne, remake soigné.","image":"https://gaming-cdn.com/images/products/14279/616x353/persona-3-reload-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"16.42","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/persona-3-reload/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Persona 3 Reload","description":"JRPG nocturne, remake soigné.","image":"https://gaming-cdn.com/images/products/14279/616x353/persona-3-reload-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"16.42","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/14279-acheter-persona-3-reload-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/persona-5-royal/index.html b/jeu/persona-5-royal/index.html
index 4cb5ce1..37d2314 100644
--- a/jeu/persona-5-royal/index.html
+++ b/jeu/persona-5-royal/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Persona 5 Royal — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Le JRPG Atlus de référence — version complète. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/persona-5-royal/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Persona 5 Royal","description":"Le JRPG Atlus de référence — version complète.","image":"https://gaming-cdn.com/images/products/12919/616x353/persona-5-royal-pc-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"13.15","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/persona-5-royal/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Persona 5 Royal","description":"Le JRPG Atlus de référence — version complète.","image":"https://gaming-cdn.com/images/products/12919/616x353/persona-5-royal-pc-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"13.15","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/12919-acheter-steam-persona-5-royal-pc-jeu-steam-europe?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/phasmophobia/index.html b/jeu/phasmophobia/index.html
index 91e9277..541ccef 100644
--- a/jeu/phasmophobia/index.html
+++ b/jeu/phasmophobia/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Phasmophobia — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Horreur légère, parfait Discord. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/phasmophobia/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Phasmophobia","description":"Horreur légère, parfait Discord.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/739630/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Phasmophobia","description":"Horreur légère, parfait Discord.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/739630/header.jpg"}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/plateup/index.html b/jeu/plateup/index.html
index 0f3bfe3..28dcd3f 100644
--- a/jeu/plateup/index.html
+++ b/jeu/plateup/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>PlateUp! — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Cuisine + construction de resto. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/plateup/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"PlateUp!","description":"Cuisine + construction de resto.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1599600/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"2.24","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/plateup/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"PlateUp!","description":"Cuisine + construction de resto.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1599600/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"2.24","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/12605-acheter-plateup-pc-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/portal-2/index.html b/jeu/portal-2/index.html
index e9d1464..0ac5afb 100644
--- a/jeu/portal-2/index.html
+++ b/jeu/portal-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Portal 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Puzzle Valve — solo ou coop. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/portal-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Portal 2","description":"Puzzle Valve — solo ou coop.","image":"https://gaming-cdn.com/images/products/220/616x353/portal-2-pc-mac-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"7.81","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/portal-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Portal 2","description":"Puzzle Valve — solo ou coop.","image":"https://gaming-cdn.com/images/products/220/616x353/portal-2-pc-mac-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"7.81","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/220-acheter-steam-portal-2-pc-mac-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/powerwash-simulator/index.html b/jeu/powerwash-simulator/index.html
index d388ea2..f7e7d1b 100644
--- a/jeu/powerwash-simulator/index.html
+++ b/jeu/powerwash-simulator/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>PowerWash Simulator — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Nettoyage zen. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/powerwash-simulator/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"PowerWash Simulator","description":"Nettoyage zen.","image":"https://gaming-cdn.com/images/products/8977/616x353/powerwash-simulator-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"15.29","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/powerwash-simulator/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"PowerWash Simulator","description":"Nettoyage zen.","image":"https://gaming-cdn.com/images/products/8977/616x353/powerwash-simulator-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"15.29","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/8977-acheter-steam-powerwash-simulator-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/pragmata/index.html b/jeu/pragmata/index.html
index 762dde6..2320c40 100644
--- a/jeu/pragmata/index.html
+++ b/jeu/pragmata/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Pragmata — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Action SF Capcom — duo humain / androïde sur la Lune. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/pragmata/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Pragmata","description":"Action SF Capcom — duo humain / androïde sur la Lune.","image":"https://gaming-cdn.com/images/products/21402/616x353/pragmata-deluxe-edition-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"55.68","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/pragmata/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Pragmata","description":"Action SF Capcom — duo humain / androïde sur la Lune.","image":"https://gaming-cdn.com/images/products/21402/616x353/pragmata-deluxe-edition-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"55.68","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/21402-acheter-pragmata-deluxe-edition-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/project-zomboid/index.html b/jeu/project-zomboid/index.html
index 73770bf..92a2233 100644
--- a/jeu/project-zomboid/index.html
+++ b/jeu/project-zomboid/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Project Zomboid — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Zombies isométriques — hardcore &amp; multi. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/project-zomboid/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Project Zomboid","description":"Zombies isométriques — hardcore & multi.","image":"https://gaming-cdn.com/images/products/953/616x353/project-zomboid-pc-mac-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.75","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/project-zomboid/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Project Zomboid","description":"Zombies isométriques — hardcore & multi.","image":"https://gaming-cdn.com/images/products/953/616x353/project-zomboid-pc-mac-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.75","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/953-acheter-steam-project-zomboid-pc-mac-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/r-e-p-o/index.html b/jeu/r-e-p-o/index.html
index fe32cff..d0e9b62 100644
--- a/jeu/r-e-p-o/index.html
+++ b/jeu/r-e-p-o/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>R.E.P.O. — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Horreur coop chaos — récupérer des objets. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/r-e-p-o/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"R.E.P.O.","description":"Horreur coop chaos — récupérer des objets.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/3241660/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"R.E.P.O.","description":"Horreur coop chaos — récupérer des objets.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/3241660/header.jpg"}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/raft/index.html b/jeu/raft/index.html
index 49a4e24..c10485d 100644
--- a/jeu/raft/index.html
+++ b/jeu/raft/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Raft — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Survie sur un radeau — multi chill. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/raft/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Raft","description":"Survie sur un radeau — multi chill.","image":"https://gaming-cdn.com/images/products/2627/616x353/jeu-steam-raft-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Raft","description":"Survie sur un radeau — multi chill.","image":"https://gaming-cdn.com/images/products/2627/616x353/jeu-steam-raft-cover.jpg"}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/ratchet-clank-rift-apart/index.html b/jeu/ratchet-clank-rift-apart/index.html
index 9f4993e..62f544c 100644
--- a/jeu/ratchet-clank-rift-apart/index.html
+++ b/jeu/ratchet-clank-rift-apart/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Ratchet &amp; Clank: Rift Apart — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Plateformer Insomniac — dimensions. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/ratchet-clank-rift-apart/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Ratchet & Clank: Rift Apart","description":"Plateformer Insomniac — dimensions.","image":"https://gaming-cdn.com/images/products/9665/616x353/ratchet-clank-rift-apart-pc-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"21.93","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/ratchet-clank-rift-apart/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Ratchet & Clank: Rift Apart","description":"Plateformer Insomniac — dimensions.","image":"https://gaming-cdn.com/images/products/9665/616x353/ratchet-clank-rift-apart-pc-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"21.93","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/9665-acheter-steam-ratchet-clank-rift-apart-pc-jeu-steam-europe?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/ready-or-not/index.html b/jeu/ready-or-not/index.html
index f6cfef3..653352c 100644
--- a/jeu/ready-or-not/index.html
+++ b/jeu/ready-or-not/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Ready or Not — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="SWAT tactique réaliste. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/ready-or-not/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Ready or Not","description":"SWAT tactique réaliste.","image":"https://gaming-cdn.com/images/products/2075/616x353/ready-or-not-pc-jeu-steam-europe-us-canada-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"21.25","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/ready-or-not/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Ready or Not","description":"SWAT tactique réaliste.","image":"https://gaming-cdn.com/images/products/2075/616x353/ready-or-not-pc-jeu-steam-europe-us-canada-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"21.25","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2075-acheter-steam-ready-or-not-pc-jeu-steam-europe-us-canada?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/red-dead-redemption-2/index.html b/jeu/red-dead-redemption-2/index.html
index 0cdb06d..f1bdd0f 100644
--- a/jeu/red-dead-redemption-2/index.html
+++ b/jeu/red-dead-redemption-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Red Dead Redemption 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Énorme aventure. Excellent en solde. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/red-dead-redemption-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Red Dead Redemption 2","description":"Énorme aventure. Excellent en solde.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"18.44","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/red-dead-redemption-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Red Dead Redemption 2","description":"Énorme aventure. Excellent en solde.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"18.44","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/5653-acheter-red-dead-redemption-2-ultimate-edition-ultimate-edition-pc-jeu-rockstar/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/remnant-ii/index.html b/jeu/remnant-ii/index.html
index 45b2943..bb374b2 100644
--- a/jeu/remnant-ii/index.html
+++ b/jeu/remnant-ii/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Remnant II — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Shooter-souls coop, mondes procéduraux. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/remnant-ii/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Remnant II","description":"Shooter-souls coop, mondes procéduraux.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1282100/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"9.89","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/remnant-ii/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Remnant II","description":"Shooter-souls coop, mondes procéduraux.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1282100/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"9.89","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/13288-acheter-steam-remnant-2-pc-jeu-steam-europe-us-canada/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/resident-evil-2/index.html b/jeu/resident-evil-2/index.html
index 5b5e428..2f247aa 100644
--- a/jeu/resident-evil-2/index.html
+++ b/jeu/resident-evil-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Resident Evil 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Remake RE2 — Leon &amp; Claire. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/resident-evil-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Resident Evil 2","description":"Remake RE2 — Leon & Claire.","image":"https://gaming-cdn.com/images/products/2709/616x353/resident-evil-2-biohazard-re-2-pc-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"6.51","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/resident-evil-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Resident Evil 2","description":"Remake RE2 — Leon & Claire.","image":"https://gaming-cdn.com/images/products/2709/616x353/resident-evil-2-biohazard-re-2-pc-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"6.51","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/2709-acheter-steam-resident-evil-2-biohazard-re-2-pc-jeu-steam-europe?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/resident-evil-3/index.html b/jeu/resident-evil-3/index.html
index c8e6510..375a400 100644
--- a/jeu/resident-evil-3/index.html
+++ b/jeu/resident-evil-3/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Resident Evil 3 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Remake RE3 — Nemesis. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/resident-evil-3/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Resident Evil 3","description":"Remake RE3 — Nemesis.","image":"https://gaming-cdn.com/images/products/5873/616x353/resident-evil-3-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"7.41","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/resident-evil-3/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Resident Evil 3","description":"Remake RE3 — Nemesis.","image":"https://gaming-cdn.com/images/products/5873/616x353/resident-evil-3-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"7.41","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/5873-acheter-steam-resident-evil-3-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/resident-evil-4/index.html b/jeu/resident-evil-4/index.html
index 3f5c113..fc2cfb4 100644
--- a/jeu/resident-evil-4/index.html
+++ b/jeu/resident-evil-4/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Resident Evil 4 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Remake 2023. Horreur et action. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/resident-evil-4/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Resident Evil 4","description":"Remake 2023. Horreur et action.","image":"https://gaming-cdn.com/images/products/6772/616x353/resident-evil-4-2023-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"9.44","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/resident-evil-4/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Resident Evil 4","description":"Remake 2023. Horreur et action.","image":"https://gaming-cdn.com/images/products/6772/616x353/resident-evil-4-2023-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"9.44","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/6772-acheter-resident-evil-4-2023-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/resident-evil-requiem/index.html b/jeu/resident-evil-requiem/index.html
index 7aa96f6..f9dda0b 100644
--- a/jeu/resident-evil-requiem/index.html
+++ b/jeu/resident-evil-requiem/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Resident Evil Requiem — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Nouveau RE — Grace + Leon. Survival horror Capcom. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/resident-evil-requiem/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Resident Evil Requiem","description":"Nouveau RE — Grace + Leon. Survival horror Capcom.","image":"https://gaming-cdn.com/images/products/9000/616x353/resident-evil-requiem-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"44.66","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/resident-evil-requiem/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Resident Evil Requiem","description":"Nouveau RE — Grace + Leon. Survival horror Capcom.","image":"https://gaming-cdn.com/images/products/9000/616x353/resident-evil-requiem-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"44.66","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/9000-acheter-resident-evil-requiem-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/resident-evil-village/index.html b/jeu/resident-evil-village/index.html
index e5123da..efd5ed1 100644
--- a/jeu/resident-evil-village/index.html
+++ b/jeu/resident-evil-village/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Resident Evil Village — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="RE8 — village, Lady D. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/resident-evil-village/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Resident Evil Village","description":"RE8 — village, Lady D.","image":"https://gaming-cdn.com/images/products/6329/616x353/resident-evil-village-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.16","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/resident-evil-village/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Resident Evil Village","description":"RE8 — village, Lady D.","image":"https://gaming-cdn.com/images/products/6329/616x353/resident-evil-village-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.16","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/6329-acheter-steam-resident-evil-village-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/returnal/index.html b/jeu/returnal/index.html
index 826ba02..6387844 100644
--- a/jeu/returnal/index.html
+++ b/jeu/returnal/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Returnal — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Roguelike 3e personne Housemarque. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/returnal/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Returnal","description":"Roguelike 3e personne Housemarque.","image":"https://gaming-cdn.com/images/products/9666/616x353/returnal-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"16.87","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/returnal/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Returnal","description":"Roguelike 3e personne Housemarque.","image":"https://gaming-cdn.com/images/products/9666/616x353/returnal-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"16.87","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/9666-acheter-steam-returnal-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/rimworld/index.html b/jeu/rimworld/index.html
index 15544a5..70a89db 100644
--- a/jeu/rimworld/index.html
+++ b/jeu/rimworld/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>RimWorld — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Colonie sci-fi — histoires improbables. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/rimworld/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"RimWorld","description":"Colonie sci-fi — histoires improbables.","image":"https://gaming-cdn.com/images/products/3237/616x353/rimworld-pc-mac-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"22.15","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/rimworld/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"RimWorld","description":"Colonie sci-fi — histoires improbables.","image":"https://gaming-cdn.com/images/products/3237/616x353/rimworld-pc-mac-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"22.15","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/3237-acheter-steam-rimworld-pc-mac-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/risk-of-rain-2/index.html b/jeu/risk-of-rain-2/index.html
index 553bab1..02922ad 100644
--- a/jeu/risk-of-rain-2/index.html
+++ b/jeu/risk-of-rain-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Risk of Rain 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Chaos croissant, solo ou coop. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/risk-of-rain-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Risk of Rain 2","description":"Chaos croissant, solo ou coop.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/632360/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"20.24","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/risk-of-rain-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Risk of Rain 2","description":"Chaos croissant, solo ou coop.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/632360/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"20.24","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/4378-acheter-risk-of-rain-2-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/rust/index.html b/jeu/rust/index.html
index 0385370..5394efe 100644
--- a/jeu/rust/index.html
+++ b/jeu/rust/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Rust — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Survie hardcore PvP — craft et bases. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/rust/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Rust","description":"Survie hardcore PvP — craft et bases.","image":"https://gaming-cdn.com/images/products/1230/616x353/rust-pc-mac-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"33.74","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/rust/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Rust","description":"Survie hardcore PvP — craft et bases.","image":"https://gaming-cdn.com/images/products/1230/616x353/rust-pc-mac-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"33.74","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/1230-acheter-steam-rust-pc-mac-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/s-t-a-l-k-e-r-2-heart-of-chornobyl/index.html b/jeu/s-t-a-l-k-e-r-2-heart-of-chornobyl/index.html
index 1c02544..1893d99 100644
--- a/jeu/s-t-a-l-k-e-r-2-heart-of-chornobyl/index.html
+++ b/jeu/s-t-a-l-k-e-r-2-heart-of-chornobyl/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>S.T.A.L.K.E.R. 2: Heart of Chornobyl — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="FPS survival Zone. Xbox/PC. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/s-t-a-l-k-e-r-2-heart-of-chornobyl/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"S.T.A.L.K.E.R. 2: Heart of Chornobyl","description":"FPS survival Zone. Xbox/PC.","image":"https://gaming-cdn.com/images/products/9766/616x353/s-t-a-l-k-e-r-2-heart-of-chornobyl-xbox-series-x-s-microsoft-store-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"41.73","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/s-t-a-l-k-e-r-2-heart-of-chornobyl/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"S.T.A.L.K.E.R. 2: Heart of Chornobyl","description":"FPS survival Zone. Xbox/PC.","image":"https://gaming-cdn.com/images/products/9766/616x353/s-t-a-l-k-e-r-2-heart-of-chornobyl-xbox-series-x-s-microsoft-store-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"41.73","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/9766-acheter-s-t-a-l-k-e-r-2-heart-of-chornobyl-xbox-series-x-s-microsoft-store/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/satisfactory/index.html b/jeu/satisfactory/index.html
index e675805..18bf7c2 100644
--- a/jeu/satisfactory/index.html
+++ b/jeu/satisfactory/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Satisfactory — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Usine en 1re personne — solo ou potes. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/satisfactory/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Satisfactory","description":"Usine en 1re personne — solo ou potes.","image":"https://gaming-cdn.com/images/products/4229/616x353/satisfactory-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"27.67","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/satisfactory/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Satisfactory","description":"Usine en 1re personne — solo ou potes.","image":"https://gaming-cdn.com/images/products/4229/616x353/satisfactory-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"27.67","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/4229-acheter-steam-satisfactory-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/schedule-i/index.html b/jeu/schedule-i/index.html
index deba7cc..afaee7f 100644
--- a/jeu/schedule-i/index.html
+++ b/jeu/schedule-i/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Schedule I — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Sim crime absurde, hit indie. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/schedule-i/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Schedule I","description":"Sim crime absurde, hit indie.","image":"https://gaming-cdn.com/images/products/18918/616x353/schedule-i-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"20.07","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/schedule-i/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Schedule I","description":"Sim crime absurde, hit indie.","image":"https://gaming-cdn.com/images/products/18918/616x353/schedule-i-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"20.07","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/18918-acheter-schedule-i-pc-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/sea-of-thieves/index.html b/jeu/sea-of-thieves/index.html
index 19b6035..52eb368 100644
--- a/jeu/sea-of-thieves/index.html
+++ b/jeu/sea-of-thieves/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Sea of Thieves — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Pirates entre potes. Sessions souples. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/sea-of-thieves/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Sea of Thieves","description":"Pirates entre potes. Sessions souples.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1172620/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"19.45","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/sea-of-thieves/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Sea of Thieves","description":"Pirates entre potes. Sessions souples.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1172620/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"19.45","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/967-acheter-sea-of-thieves-2026-edition-pc-xbox-one-xbox-series-x-s-microsoft-store/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/sekiro-shadows-die-twice/index.html b/jeu/sekiro-shadows-die-twice/index.html
index a62a2b3..ae54be5 100644
--- a/jeu/sekiro-shadows-die-twice/index.html
+++ b/jeu/sekiro-shadows-die-twice/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Sekiro: Shadows Die Twice — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="GOTY FromSoftware. Parry or die. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/sekiro-shadows-die-twice/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Sekiro: Shadows Die Twice","description":"GOTY FromSoftware. Parry or die.","image":"https://gaming-cdn.com/images/products/3325/616x353/sekiro-shadows-die-twice-goty-edition-goty-edition-pc-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"37.5","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/sekiro-shadows-die-twice/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Sekiro: Shadows Die Twice","description":"GOTY FromSoftware. Parry or die.","image":"https://gaming-cdn.com/images/products/3325/616x353/sekiro-shadows-die-twice-goty-edition-goty-edition-pc-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"37.5","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/3325-acheter-sekiro-shadows-die-twice-goty-edition-goty-edition-pc-jeu-steam-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/sid-meier-s-civilization-vi/index.html b/jeu/sid-meier-s-civilization-vi/index.html
index 092ad57..90e1045 100644
--- a/jeu/sid-meier-s-civilization-vi/index.html
+++ b/jeu/sid-meier-s-civilization-vi/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Sid Meier's Civilization VI — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="4X — encore un tour. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/sid-meier-s-civilization-vi/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Sid Meier's Civilization VI","description":"4X — encore un tour.","image":"https://gaming-cdn.com/images/products/1437/616x353/sid-meier-s-civilization-vi-pc-mac-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"48.37","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/sid-meier-s-civilization-vi/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Sid Meier's Civilization VI","description":"4X — encore un tour.","image":"https://gaming-cdn.com/images/products/1437/616x353/sid-meier-s-civilization-vi-pc-mac-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"48.37","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/1437-acheter-steam-sid-meier-s-civilization-vi-pc-mac-jeu-steam-europe?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/sifu/index.html b/jeu/sifu/index.html
index 222af11..64a9a7c 100644
--- a/jeu/sifu/index.html
+++ b/jeu/sifu/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Sifu — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Kung-fu revenge — âge &amp; maîtrise. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/sifu/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Sifu","description":"Kung-fu revenge — âge & maîtrise.","image":"https://gaming-cdn.com/images/products/13881/616x353/sifu-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"6.51","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/sifu/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Sifu","description":"Kung-fu revenge — âge & maîtrise.","image":"https://gaming-cdn.com/images/products/13881/616x353/sifu-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"6.51","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/13881-acheter-steam-sifu-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/silent-hill-2/index.html b/jeu/silent-hill-2/index.html
index e139212..daa228c 100644
--- a/jeu/silent-hill-2/index.html
+++ b/jeu/silent-hill-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Silent Hill 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Horreur remake. Atmosphère lourde. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/silent-hill-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Silent Hill 2","description":"Horreur remake. Atmosphère lourde.","image":"https://gaming-cdn.com/images/products/13083/616x353/silent-hill-2-pc-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"24.74","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/silent-hill-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Silent Hill 2","description":"Horreur remake. Atmosphère lourde.","image":"https://gaming-cdn.com/images/products/13083/616x353/silent-hill-2-pc-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"24.74","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/13083-acheter-silent-hill-2-pc-jeu-steam-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/silent-hill-f/index.html b/jeu/silent-hill-f/index.html
index 5dfe70c..206d36a 100644
--- a/jeu/silent-hill-f/index.html
+++ b/jeu/silent-hill-f/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Silent Hill f — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Nouveau Silent Hill — Japon années 60. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/silent-hill-f/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Silent Hill f","description":"Nouveau Silent Hill — Japon années 60.","image":"https://gaming-cdn.com/images/products/13087/616x353/silent-hill-f-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"31.72","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/silent-hill-f/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Silent Hill f","description":"Nouveau Silent Hill — Japon années 60.","image":"https://gaming-cdn.com/images/products/13087/616x353/silent-hill-f-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"31.72","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/13087-acheter-steam-silent-hill-f-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/snowrunner/index.html b/jeu/snowrunner/index.html
index 91f53ee..b04c6fb 100644
--- a/jeu/snowrunner/index.html
+++ b/jeu/snowrunner/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>SnowRunner — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Off-road mud &amp; neige — coop. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/snowrunner/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"SnowRunner","description":"Off-road mud & neige — coop.","image":"https://gaming-cdn.com/images/products/8798/616x353/snowrunner-pc-mac-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"13.04","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/snowrunner/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"SnowRunner","description":"Off-road mud & neige — coop.","image":"https://gaming-cdn.com/images/products/8798/616x353/snowrunner-pc-mac-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"13.04","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/8798-acheter-steam-snowrunner-pc-mac-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/sons-of-the-forest/index.html b/jeu/sons-of-the-forest/index.html
index a9561d8..4738fce 100644
--- a/jeu/sons-of-the-forest/index.html
+++ b/jeu/sons-of-the-forest/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Sons of the Forest — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Survie horreur — suite de The Forest. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/sons-of-the-forest/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Sons of the Forest","description":"Survie horreur — suite de The Forest.","image":"https://gaming-cdn.com/images/products/5953/616x353/sons-of-the-forest-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"22.49","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/sons-of-the-forest/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Sons of the Forest","description":"Survie horreur — suite de The Forest.","image":"https://gaming-cdn.com/images/products/5953/616x353/sons-of-the-forest-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"22.49","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/5953-acheter-steam-sons-of-the-forest-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/split-fiction/index.html b/jeu/split-fiction/index.html
index d5f088f..d5ae7c0 100644
--- a/jeu/split-fiction/index.html
+++ b/jeu/split-fiction/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Split Fiction — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Coop narratif des créateurs d’It Takes Two. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/split-fiction/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Split Fiction","description":"Coop narratif des créateurs d’It Takes Two.","image":"https://gaming-cdn.com/images/products/17864/616x353/split-fiction-pc-jeu-ea-app-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"44.77","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/split-fiction/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Split Fiction","description":"Coop narratif des créateurs d’It Takes Two.","image":"https://gaming-cdn.com/images/products/17864/616x353/split-fiction-pc-jeu-ea-app-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"44.77","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/17864-acheter-split-fiction-pc-jeu-ea-app/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/star-wars-jedi-survivor/index.html b/jeu/star-wars-jedi-survivor/index.html
index 777820a..894c38c 100644
--- a/jeu/star-wars-jedi-survivor/index.html
+++ b/jeu/star-wars-jedi-survivor/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>STAR WARS Jedi: Survivor — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Suite Jedi Fallen Order. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/star-wars-jedi-survivor/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"STAR WARS Jedi: Survivor","description":"Suite Jedi Fallen Order.","image":"https://gaming-cdn.com/images/products/14063/616x353/star-wars-jedi-survivor-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"38.47","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/star-wars-jedi-survivor/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"STAR WARS Jedi: Survivor","description":"Suite Jedi Fallen Order.","image":"https://gaming-cdn.com/images/products/14063/616x353/star-wars-jedi-survivor-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"38.47","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/14063-acheter-steam-star-wars-jedi-survivor-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/star-wars-outlaws/index.html b/jeu/star-wars-outlaws/index.html
index 92ee6cf..dca14ce 100644
--- a/jeu/star-wars-outlaws/index.html
+++ b/jeu/star-wars-outlaws/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Star Wars Outlaws — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Open world Star Wars Ubisoft. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/star-wars-outlaws/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Star Wars Outlaws","description":"Open world Star Wars Ubisoft.","image":"https://gaming-cdn.com/images/products/14344/616x353/star-wars-outlaws-pc-jeu-ubisoft-connect-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"19.12","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/star-wars-outlaws/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Star Wars Outlaws","description":"Open world Star Wars Ubisoft.","image":"https://gaming-cdn.com/images/products/14344/616x353/star-wars-outlaws-pc-jeu-ubisoft-connect-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"19.12","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/14344-acheter-ubisoft-connect-star-wars-outlaws-pc-jeu-ubisoft-connect?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/stardew-valley/index.html b/jeu/stardew-valley/index.html
index f71a136..a5589f2 100644
--- a/jeu/stardew-valley/index.html
+++ b/jeu/stardew-valley/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Stardew Valley — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Petit prix, énorme durée de vie. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/stardew-valley/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Stardew Valley","description":"Petit prix, énorme durée de vie.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"15.4","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/stardew-valley/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Stardew Valley","description":"Petit prix, énorme durée de vie.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"15.4","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/1767-acheter-stardew-valley-pc-mac-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/starfield/index.html b/jeu/starfield/index.html
index 73115b8..298a1b0 100644
--- a/jeu/starfield/index.html
+++ b/jeu/starfield/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Starfield — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="RPG spatial Bethesda. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/starfield/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Starfield","description":"RPG spatial Bethesda.","image":"https://gaming-cdn.com/images/products/2675/616x353/starfield-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.87","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/starfield/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Starfield","description":"RPG spatial Bethesda.","image":"https://gaming-cdn.com/images/products/2675/616x353/starfield-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.87","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2675-acheter-steam-starfield-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/stellar-blade/index.html b/jeu/stellar-blade/index.html
index e0f1325..855f9e8 100644
--- a/jeu/stellar-blade/index.html
+++ b/jeu/stellar-blade/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Stellar Blade — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Action spectacle, désormais sur PC. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/stellar-blade/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Stellar Blade","description":"Action spectacle, désormais sur PC.","image":"https://gaming-cdn.com/images/products/16874/616x353/stellar-blade-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"39.71","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/stellar-blade/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Stellar Blade","description":"Action spectacle, désormais sur PC.","image":"https://gaming-cdn.com/images/products/16874/616x353/stellar-blade-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"39.71","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/16874-acheter-stellar-blade-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/street-fighter-6/index.html b/jeu/street-fighter-6/index.html
index addbfab..c63bc88 100644
--- a/jeu/street-fighter-6/index.html
+++ b/jeu/street-fighter-6/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Street Fighter 6 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Combo et ranked. Petit prix souvent. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/street-fighter-6/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Street Fighter 6","description":"Combo et ranked. Petit prix souvent.","image":"https://gaming-cdn.com/images/products/6008/616x353/street-fighter-6-pc-jeu-steam-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"13.04","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/street-fighter-6/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Street Fighter 6","description":"Combo et ranked. Petit prix souvent.","image":"https://gaming-cdn.com/images/products/6008/616x353/street-fighter-6-pc-jeu-steam-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"13.04","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/6008-acheter-street-fighter-6-pc-jeu-steam-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/subnautica/index.html b/jeu/subnautica/index.html
index 2944e37..a79461a 100644
--- a/jeu/subnautica/index.html
+++ b/jeu/subnautica/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Subnautica — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Survie sous-marine — exploration. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/subnautica/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Subnautica","description":"Survie sous-marine — exploration.","image":"https://gaming-cdn.com/images/products/1003/616x353/subnautica-pc-mac-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"9.89","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/subnautica/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Subnautica","description":"Survie sous-marine — exploration.","image":"https://gaming-cdn.com/images/products/1003/616x353/subnautica-pc-mac-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"9.89","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/1003-acheter-steam-subnautica-pc-mac-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/super-mario-odyssey/index.html b/jeu/super-mario-odyssey/index.html
index 9d27242..b75e293 100644
--- a/jeu/super-mario-odyssey/index.html
+++ b/jeu/super-mario-odyssey/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Super Mario Odyssey — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Plateforme joyeuse. Parfait solo ou canapé. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/super-mario-odyssey/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Super Mario Odyssey","description":"Plateforme joyeuse. Parfait solo ou canapé.","image":"https://gaming-cdn.com/images/products/2618/616x353/super-mario-odyssey-switch-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"61.66","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/super-mario-odyssey/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Super Mario Odyssey","description":"Plateforme joyeuse. Parfait solo ou canapé.","image":"https://gaming-cdn.com/images/products/2618/616x353/super-mario-odyssey-switch-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"61.66","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2618-acheter-super-mario-odyssey-switch-nintendo-eshop/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/super-smash-bros-ultimate/index.html b/jeu/super-smash-bros-ultimate/index.html
index dfb1ab4..b87fd45 100644
--- a/jeu/super-smash-bros-ultimate/index.html
+++ b/jeu/super-smash-bros-ultimate/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Super Smash Bros. Ultimate — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Combat party. Tous les perso Nintendo. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/super-smash-bros-ultimate/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Super Smash Bros. Ultimate","description":"Combat party. Tous les perso Nintendo.","image":"https://gaming-cdn.com/images/products/3000/616x353/super-smash-bros-ultimate-switch-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"74.25","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/super-smash-bros-ultimate/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Super Smash Bros. Ultimate","description":"Combat party. Tous les perso Nintendo.","image":"https://gaming-cdn.com/images/products/3000/616x353/super-smash-bros-ultimate-switch-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"74.25","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/3000-acheter-super-smash-bros-ultimate-switch-jeu-nintendo-eshop-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/tekken-8/index.html b/jeu/tekken-8/index.html
index 0e8d9e8..2c9e743 100644
--- a/jeu/tekken-8/index.html
+++ b/jeu/tekken-8/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>TEKKEN 8 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="La ref des combats 3D. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/tekken-8/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"TEKKEN 8","description":"La ref des combats 3D.","image":"https://gaming-cdn.com/images/products/9579/616x353/tekken-8-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"20.49","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/tekken-8/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"TEKKEN 8","description":"La ref des combats 3D.","image":"https://gaming-cdn.com/images/products/9579/616x353/tekken-8-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"20.49","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/9579-acheter-tekken-8-pc-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/terraria/index.html b/jeu/terraria/index.html
index b8075f2..15eca50 100644
--- a/jeu/terraria/index.html
+++ b/jeu/terraria/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Terraria — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Sandbox 2D — craft, boss, multi. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/terraria/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Terraria","description":"Sandbox 2D — craft, boss, multi.","image":"https://gaming-cdn.com/images/products/932/616x353/terraria-pc-mac-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"8.31","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/terraria/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Terraria","description":"Sandbox 2D — craft, boss, multi.","image":"https://gaming-cdn.com/images/products/932/616x353/terraria-pc-mac-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"8.31","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/932-acheter-steam-terraria-pc-mac-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/the-elder-scrolls-iv-oblivion-remastered/index.html b/jeu/the-elder-scrolls-iv-oblivion-remastered/index.html
index 9d1fb36..8e85957 100644
--- a/jeu/the-elder-scrolls-iv-oblivion-remastered/index.html
+++ b/jeu/the-elder-scrolls-iv-oblivion-remastered/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>The Elder Scrolls IV: Oblivion Remastered — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Remaster du classique Bethesda. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/the-elder-scrolls-iv-oblivion-remastered/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"The Elder Scrolls IV: Oblivion Remastered","description":"Remaster du classique Bethesda.","image":"https://gaming-cdn.com/images/products/18367/616x353/the-elder-scrolls-iv-oblivion-remastered-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"32.05","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/the-elder-scrolls-iv-oblivion-remastered/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"The Elder Scrolls IV: Oblivion Remastered","description":"Remaster du classique Bethesda.","image":"https://gaming-cdn.com/images/products/18367/616x353/the-elder-scrolls-iv-oblivion-remastered-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"32.05","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/18367-acheter-steam-the-elder-scrolls-iv-oblivion-remastered-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/the-elder-scrolls-v-skyrim-special-edition/index.html b/jeu/the-elder-scrolls-v-skyrim-special-edition/index.html
index 6c19630..2a39807 100644
--- a/jeu/the-elder-scrolls-v-skyrim-special-edition/index.html
+++ b/jeu/the-elder-scrolls-v-skyrim-special-edition/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>The Elder Scrolls V: Skyrim Special Edition — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Le classique open-world, encore immense. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/the-elder-scrolls-v-skyrim-special-edition/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"The Elder Scrolls V: Skyrim Special Edition","description":"Le classique open-world, encore immense.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/489830/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"36.22","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/the-elder-scrolls-v-skyrim-special-edition/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"The Elder Scrolls V: Skyrim Special Edition","description":"Le classique open-world, encore immense.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/489830/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"36.22","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/1512-acheter-steam-the-elder-scrolls-v-skyrim-special-edition-special-edition-pc-jeu-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/the-last-of-us-part-i/index.html b/jeu/the-last-of-us-part-i/index.html
index 6c9852e..bbf97e7 100644
--- a/jeu/the-last-of-us-part-i/index.html
+++ b/jeu/the-last-of-us-part-i/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>The Last of Us Part I — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Remaster PS5. Histoire culte. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/the-last-of-us-part-i/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"The Last of Us Part I","description":"Remaster PS5. Histoire culte.","image":"https://gaming-cdn.com/images/products/12105/616x353/the-last-of-us-part-i-playstation-5-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"75.41","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/the-last-of-us-part-i/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"The Last of Us Part I","description":"Remaster PS5. Histoire culte.","image":"https://gaming-cdn.com/images/products/12105/616x353/the-last-of-us-part-i-playstation-5-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"75.41","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/12105-acheter-the-last-of-us-part-i-playstation-5-jeu-playstation-store-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/the-last-of-us-part-ii/index.html b/jeu/the-last-of-us-part-ii/index.html
index 857c3bd..249503e 100644
--- a/jeu/the-last-of-us-part-ii/index.html
+++ b/jeu/the-last-of-us-part-ii/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>The Last of Us Part II — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Suite TLOU — Ellie &amp; Abby (PC). Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/the-last-of-us-part-ii/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"The Last of Us Part II","description":"Suite TLOU — Ellie & Abby (PC).","image":"https://gaming-cdn.com/images/products/6215/616x353/the-last-of-us-part-ii-remastered-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"32.39","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/the-last-of-us-part-ii/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"The Last of Us Part II","description":"Suite TLOU — Ellie & Abby (PC).","image":"https://gaming-cdn.com/images/products/6215/616x353/the-last-of-us-part-ii-remastered-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"32.39","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/6215-acheter-steam-the-last-of-us-part-ii-remastered-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/the-witcher-3/index.html b/jeu/the-witcher-3/index.html
index 6c4484d..4547e1e 100644
--- a/jeu/the-witcher-3/index.html
+++ b/jeu/the-witcher-3/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>The Witcher 3 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="GOTY. Le RPG à prendre en promo. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/the-witcher-3/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"The Witcher 3","description":"GOTY. Le RPG à prendre en promo.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"20.02","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/the-witcher-3/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"The Witcher 3","description":"GOTY. Le RPG à prendre en promo.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"20.02","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/1497-acheter-the-witcher-3-wild-hunt-complete-edition-pc-gog-com/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/the-witcher-4/index.html b/jeu/the-witcher-4/index.html
index eef2276..3afd49c 100644
--- a/jeu/the-witcher-4/index.html
+++ b/jeu/the-witcher-4/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>The Witcher 4 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Prochain gros RPG CDPR — sortie annoncée 2028. Surveiller les préco. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/the-witcher-4/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"The Witcher 4","description":"Prochain gros RPG CDPR — sortie annoncée 2028. Surveiller les préco.","image":"https://gaming-cdn.com/images/products/6962/616x353/the-witcher-4-pc-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"The Witcher 4","description":"Prochain gros RPG CDPR — sortie annoncée 2028. Surveiller les préco.","image":"https://gaming-cdn.com/images/products/6962/616x353/the-witcher-4-pc-cover.jpg"}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/titanfall-2/index.html b/jeu/titanfall-2/index.html
index b555aec..729b979 100644
--- a/jeu/titanfall-2/index.html
+++ b/jeu/titanfall-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Titanfall 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Campagne + multi mechs. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/titanfall-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Titanfall 2","description":"Campagne + multi mechs.","image":"https://gaming-cdn.com/images/products/7149/616x353/titanfall-2-ultimate-edition-ultimate-edition-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.44","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/titanfall-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Titanfall 2","description":"Campagne + multi mechs.","image":"https://gaming-cdn.com/images/products/7149/616x353/titanfall-2-ultimate-edition-ultimate-edition-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"25.44","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/7149-acheter-steam-titanfall-2-ultimate-edition-ultimate-edition-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/tom-clancy-s-rainbow-six-siege/index.html b/jeu/tom-clancy-s-rainbow-six-siege/index.html
index d430f23..f62e4a4 100644
--- a/jeu/tom-clancy-s-rainbow-six-siege/index.html
+++ b/jeu/tom-clancy-s-rainbow-six-siege/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Tom Clancy's Rainbow Six Siege — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Tactique 5v5 — operators. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/tom-clancy-s-rainbow-six-siege/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Tom Clancy's Rainbow Six Siege","description":"Tactique 5v5 — operators.","image":"https://gaming-cdn.com/images/products/1857/616x353/tom-clancy-s-rainbow-six-siege-ultimate-edition-pc-ubisoft-connect-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"37.18","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/tom-clancy-s-rainbow-six-siege/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Tom Clancy's Rainbow Six Siege","description":"Tactique 5v5 — operators.","image":"https://gaming-cdn.com/images/products/1857/616x353/tom-clancy-s-rainbow-six-siege-ultimate-edition-pc-ubisoft-connect-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"37.18","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/1857-acheter-ubisoft-connect-tom-clancy-s-rainbow-six-siege-ultimate-edition-pc-ubisoft-connect?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/ultrakill/index.html b/jeu/ultrakill/index.html
index 09f16b2..083a030 100644
--- a/jeu/ultrakill/index.html
+++ b/jeu/ultrakill/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>ULTRAKILL — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="FPS rétro ultra-rapide. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/ultrakill/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"ULTRAKILL","description":"FPS rétro ultra-rapide.","image":"https://gaming-cdn.com/images/products/15729/616x353/ultrakill-pc-jeu-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"8.54","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/ultrakill/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"ULTRAKILL","description":"FPS rétro ultra-rapide.","image":"https://gaming-cdn.com/images/products/15729/616x353/ultrakill-pc-jeu-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"8.54","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/15729-acheter-steam-ultrakill-pc-jeu-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/uncharted-legacy-of-thieves-collection/index.html b/jeu/uncharted-legacy-of-thieves-collection/index.html
index 021c1e2..e523a19 100644
--- a/jeu/uncharted-legacy-of-thieves-collection/index.html
+++ b/jeu/uncharted-legacy-of-thieves-collection/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Uncharted: Legacy of Thieves Collection — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Uncharted 4 + Lost Legacy sur PC. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/uncharted-legacy-of-thieves-collection/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Uncharted: Legacy of Thieves Collection","description":"Uncharted 4 + Lost Legacy sur PC.","image":"https://gaming-cdn.com/images/products/8907/616x353/uncharted-legacy-of-thieves-collection-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"14.86","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/uncharted-legacy-of-thieves-collection/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Uncharted: Legacy of Thieves Collection","description":"Uncharted 4 + Lost Legacy sur PC.","image":"https://gaming-cdn.com/images/products/8907/616x353/uncharted-legacy-of-thieves-collection-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"14.86","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/8907-acheter-steam-uncharted-legacy-of-thieves-collection-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/until-dawn/index.html b/jeu/until-dawn/index.html
index 540d83d..26ed820 100644
--- a/jeu/until-dawn/index.html
+++ b/jeu/until-dawn/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Until Dawn — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Horreur narrative, choix qui comptent. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/until-dawn/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Until Dawn","description":"Horreur narrative, choix qui comptent.","image":"https://gaming-cdn.com/images/products/15739/616x353/until-dawn-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"31.94","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/until-dawn/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Until Dawn","description":"Horreur narrative, choix qui comptent.","image":"https://gaming-cdn.com/images/products/15739/616x353/until-dawn-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"31.94","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/15739-acheter-until-dawn-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/v-rising/index.html b/jeu/v-rising/index.html
index dc62bdb..51e36a9 100644
--- a/jeu/v-rising/index.html
+++ b/jeu/v-rising/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>V Rising — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Vampire survival — château et boss. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/v-rising/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"V Rising","description":"Vampire survival — château et boss.","image":"https://gaming-cdn.com/images/products/11030/616x353/v-rising-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.16","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/v-rising/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"V Rising","description":"Vampire survival — château et boss.","image":"https://gaming-cdn.com/images/products/11030/616x353/v-rising-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"5.16","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/11030-acheter-steam-v-rising-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/valheim/index.html b/jeu/valheim/index.html
index 867fe0d..eb94eed 100644
--- a/jeu/valheim/index.html
+++ b/jeu/valheim/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Valheim — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Souvent en promo, longue durée. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/valheim/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Valheim","description":"Souvent en promo, longue durée.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/892970/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"24.18","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/valheim/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Valheim","description":"Souvent en promo, longue durée.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/892970/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"24.18","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/7119-acheter-valheim-pc-mac-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/vampire-survivors/index.html b/jeu/vampire-survivors/index.html
index b1c7727..6a3b212 100644
--- a/jeu/vampire-survivors/index.html
+++ b/jeu/vampire-survivors/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Vampire Survivors — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Survie auto-shooter, parfait pour 20 minutes. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/vampire-survivors/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Vampire Survivors","description":"Survie auto-shooter, parfait pour 20 minutes.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1794680/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"3.81","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/vampire-survivors/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Vampire Survivors","description":"Survie auto-shooter, parfait pour 20 minutes.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/1794680/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"3.81","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/10934-acheter-steam-vampire-survivors-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/wardogs/index.html b/jeu/wardogs/index.html
index f7663bb..f3bce8e 100644
--- a/jeu/wardogs/index.html
+++ b/jeu/wardogs/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>WARDOGS — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Le jeu du moment. FPS 100 joueurs, 3 équipes. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/wardogs/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"WARDOGS","description":"Le jeu du moment. FPS 100 joueurs, 3 équipes.","image":"https://gaming-cdn.com/images/products/21740/616x353/wardogs-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"33.74","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/wardogs/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"WARDOGS","description":"Le jeu du moment. FPS 100 joueurs, 3 équipes.","image":"https://gaming-cdn.com/images/products/21740/616x353/wardogs-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"33.74","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/21740-acheter-wardogs-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/warhammer-40-000-space-marine-2/index.html b/jeu/warhammer-40-000-space-marine-2/index.html
index 19e9f35..313ec15 100644
--- a/jeu/warhammer-40-000-space-marine-2/index.html
+++ b/jeu/warhammer-40-000-space-marine-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Warhammer 40,000: Space Marine 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Tirades de bolter, coop 3. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/warhammer-40-000-space-marine-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Warhammer 40,000: Space Marine 2","description":"Tirades de bolter, coop 3.","image":"https://gaming-cdn.com/images/products/10140/616x353/warhammer-40-000-space-marine-2-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"16.75","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/warhammer-40-000-space-marine-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Warhammer 40,000: Space Marine 2","description":"Tirades de bolter, coop 3.","image":"https://gaming-cdn.com/images/products/10140/616x353/warhammer-40-000-space-marine-2-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"16.75","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/10140-acheter-warhammer-40-000-space-marine-2-pc-steam/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/watch-dogs-2/index.html b/jeu/watch-dogs-2/index.html
index 4dbd298..073eba1 100644
--- a/jeu/watch-dogs-2/index.html
+++ b/jeu/watch-dogs-2/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Watch Dogs 2 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="San Francisco, hacking fun. Excellent rapport qualité/prix. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/watch-dogs-2/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Watch Dogs 2","description":"San Francisco, hacking fun. Excellent rapport qualité/prix.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/447040/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"3.59","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/watch-dogs-2/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Watch Dogs 2","description":"San Francisco, hacking fun. Excellent rapport qualité/prix.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/447040/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"3.59","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/1365-acheter-watch-dogs-2-pc-jeu-ubisoft-connect-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/watch-dogs-legion/index.html b/jeu/watch-dogs-legion/index.html
index c60feed..f12cebd 100644
--- a/jeu/watch-dogs-legion/index.html
+++ b/jeu/watch-dogs-legion/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Watch Dogs Legion — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Recrute n’importe qui à Londres. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/watch-dogs-legion/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Watch Dogs Legion","description":"Recrute n’importe qui à Londres.","image":"https://gaming-cdn.com/images/products/2540/616x353/watch-dogs-legion-pc-jeu-ubisoft-connect-europe-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"6.63","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/watch-dogs-legion/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Watch Dogs Legion","description":"Recrute n’importe qui à Londres.","image":"https://gaming-cdn.com/images/products/2540/616x353/watch-dogs-legion-pc-jeu-ubisoft-connect-europe-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"6.63","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2540-acheter-watch-dogs-legion-pc-jeu-ubisoft-connect-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/watch-dogs/index.html b/jeu/watch-dogs/index.html
index 54a974c..dc93f1a 100644
--- a/jeu/watch-dogs/index.html
+++ b/jeu/watch-dogs/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Watch Dogs — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Pirater Chicago. Souvent soldé. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/watch-dogs/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Watch Dogs","description":"Pirater Chicago. Souvent soldé.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/243470/header.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"4.15","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/watch-dogs/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Watch Dogs","description":"Pirater Chicago. Souvent soldé.","image":"https://cdn.cloudflare.steamstatic.com/steam/apps/243470/header.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"4.15","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/254-acheter-watch-dogs-pc-jeu-ubisoft-connect-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/wuchang-fallen-feathers/index.html b/jeu/wuchang-fallen-feathers/index.html
index 14577a0..296a8ea 100644
--- a/jeu/wuchang-fallen-feathers/index.html
+++ b/jeu/wuchang-fallen-feathers/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Wuchang: Fallen Feathers — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Souls-like chinois — peste &amp; combats. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/wuchang-fallen-feathers/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Wuchang: Fallen Feathers","description":"Souls-like chinois — peste & combats.","image":"https://gaming-cdn.com/images/products/17007/616x353/wuchang-fallen-feathers-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"29.47","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/wuchang-fallen-feathers/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Wuchang: Fallen Feathers","description":"Souls-like chinois — peste & combats.","image":"https://gaming-cdn.com/images/products/17007/616x353/wuchang-fallen-feathers-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"29.47","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/17007-acheter-steam-wuchang-fallen-feathers-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/xbox-game-pass-essential-1-mois/index.html b/jeu/xbox-game-pass-essential-1-mois/index.html
index 617358a..443e826 100644
--- a/jeu/xbox-game-pass-essential-1-mois/index.html
+++ b/jeu/xbox-game-pass-essential-1-mois/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Xbox Game Pass Essential — 1 mois — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Multi console + petits jeux. Le moins cher pour jouer en ligne. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/xbox-game-pass-essential-1-mois/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Xbox Game Pass Essential — 1 mois","description":"Multi console + petits jeux. Le moins cher pour jouer en ligne.","image":"https://gaming-cdn.com/images/products/3/616x353/xbox-game-pass-essential-1-mois-xbox-one-xbox-series-x-s-pc-microsoft-store-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"7.86","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/xbox-game-pass-essential-1-mois/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Xbox Game Pass Essential — 1 mois","description":"Multi console + petits jeux. Le moins cher pour jouer en ligne.","image":"https://gaming-cdn.com/images/products/3/616x353/xbox-game-pass-essential-1-mois-xbox-one-xbox-series-x-s-pc-microsoft-store-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"7.86","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/3-acheter-xbox-game-pass-essential-1-mois-xbox-one-xbox-series-x-s-pc-microsoft-store/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/xbox-game-pass-essential-12-mois/index.html b/jeu/xbox-game-pass-essential-12-mois/index.html
index 2b3f0bc..c7217e7 100644
--- a/jeu/xbox-game-pass-essential-12-mois/index.html
+++ b/jeu/xbox-game-pass-essential-12-mois/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Xbox Game Pass Essential — 12 mois — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="1 an Essential — souvent rentable si tu joues online toute l’année. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/xbox-game-pass-essential-12-mois/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Xbox Game Pass Essential — 12 mois","description":"1 an Essential — souvent rentable si tu joues online toute l’année.","image":"https://gaming-cdn.com/images/products/1/616x353/xbox-game-pass-essential-12-mois-xbox-one-xbox-series-x-s-pc-microsoft-store-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"59.62","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/xbox-game-pass-essential-12-mois/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Xbox Game Pass Essential — 12 mois","description":"1 an Essential — souvent rentable si tu joues online toute l’année.","image":"https://gaming-cdn.com/images/products/1/616x353/xbox-game-pass-essential-12-mois-xbox-one-xbox-series-x-s-pc-microsoft-store-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"59.62","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/1-acheter-xbox-game-pass-essential-12-mois-xbox-one-xbox-series-x-s-pc-microsoft-store/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/xbox-game-pass-essential-3-mois/index.html b/jeu/xbox-game-pass-essential-3-mois/index.html
index 39bd8a7..efe64e2 100644
--- a/jeu/xbox-game-pass-essential-3-mois/index.html
+++ b/jeu/xbox-game-pass-essential-3-mois/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Xbox Game Pass Essential — 3 mois — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="3 mois Essential — multi + catalogue de base. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/xbox-game-pass-essential-3-mois/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Xbox Game Pass Essential — 3 mois","description":"3 mois Essential — multi + catalogue de base.","image":"https://gaming-cdn.com/images/products/2/616x353/xbox-game-pass-essential-3-mois-xbox-one-xbox-series-x-s-pc-microsoft-store-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"20.24","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/xbox-game-pass-essential-3-mois/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Xbox Game Pass Essential — 3 mois","description":"3 mois Essential — multi + catalogue de base.","image":"https://gaming-cdn.com/images/products/2/616x353/xbox-game-pass-essential-3-mois-xbox-one-xbox-series-x-s-pc-microsoft-store-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"20.24","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2-acheter-xbox-game-pass-essential-3-mois-xbox-one-xbox-series-x-s-pc-microsoft-store/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/xbox-game-pass-premium-1-mois/index.html b/jeu/xbox-game-pass-premium-1-mois/index.html
index c2791af..8c03558 100644
--- a/jeu/xbox-game-pass-premium-1-mois/index.html
+++ b/jeu/xbox-game-pass-premium-1-mois/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Xbox Game Pass Premium — 1 mois — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Console + catalogue jour J Microsoft, sans tout l’Ultimate. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/xbox-game-pass-premium-1-mois/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Xbox Game Pass Premium — 1 mois","description":"Console + catalogue jour J Microsoft, sans tout l’Ultimate.","image":"https://gaming-cdn.com/images/products/21565/616x353/xbox-game-pass-premium-1-mois-pc-xbox-series-x-s-xbox-one-microsoft-store-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"11.24","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/xbox-game-pass-premium-1-mois/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Xbox Game Pass Premium — 1 mois","description":"Console + catalogue jour J Microsoft, sans tout l’Ultimate.","image":"https://gaming-cdn.com/images/products/21565/616x353/xbox-game-pass-premium-1-mois-pc-xbox-series-x-s-xbox-one-microsoft-store-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"11.24","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/21565-acheter-xbox-game-pass-premium-1-mois-pc-xbox-series-x-s-xbox-one-microsoft-store/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/xbox-game-pass-premium-3-mois/index.html b/jeu/xbox-game-pass-premium-3-mois/index.html
index 4232cc9..2469626 100644
--- a/jeu/xbox-game-pass-premium-3-mois/index.html
+++ b/jeu/xbox-game-pass-premium-3-mois/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Xbox Game Pass Premium — 3 mois — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="3 mois Premium — bon milieu entre Essential et Ultimate. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/xbox-game-pass-premium-3-mois/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Xbox Game Pass Premium — 3 mois","description":"3 mois Premium — bon milieu entre Essential et Ultimate.","image":"https://gaming-cdn.com/images/products/21566/616x353/xbox-game-pass-premium-3-mois-pc-xbox-one-xbox-series-x-s-microsoft-store-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"31.49","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/xbox-game-pass-premium-3-mois/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Xbox Game Pass Premium — 3 mois","description":"3 mois Premium — bon milieu entre Essential et Ultimate.","image":"https://gaming-cdn.com/images/products/21566/616x353/xbox-game-pass-premium-3-mois-pc-xbox-one-xbox-series-x-s-microsoft-store-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"31.49","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/21566-acheter-xbox-game-pass-premium-3-mois-pc-xbox-one-xbox-series-x-s-microsoft-store/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/xbox-game-pass-ultimate-1-mois/index.html b/jeu/xbox-game-pass-ultimate-1-mois/index.html
index 5f7c8f1..9b6ff38 100644
--- a/jeu/xbox-game-pass-ultimate-1-mois/index.html
+++ b/jeu/xbox-game-pass-ultimate-1-mois/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Xbox Game Pass Ultimate — 1 mois — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="PC + console + cloud. Le plus complet pour tester beaucoup. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/xbox-game-pass-ultimate-1-mois/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Xbox Game Pass Ultimate — 1 mois","description":"PC + console + cloud. Le plus complet pour tester beaucoup.","image":"https://gaming-cdn.com/images/products/4993/616x353/xbox-game-pass-ultimate-1-mois-xbox-one-xbox-series-x-s-pc-microsoft-store-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"19.12","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/xbox-game-pass-ultimate-1-mois/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Xbox Game Pass Ultimate — 1 mois","description":"PC + console + cloud. Le plus complet pour tester beaucoup.","image":"https://gaming-cdn.com/images/products/4993/616x353/xbox-game-pass-ultimate-1-mois-xbox-one-xbox-series-x-s-pc-microsoft-store-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"19.12","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/4993-acheter-xbox-game-pass-ultimate-1-mois-xbox-one-xbox-series-x-s-pc-microsoft-store/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/xbox-game-pass-ultimate-3-mois/index.html b/jeu/xbox-game-pass-ultimate-3-mois/index.html
index 0a2bead..b913f33 100644
--- a/jeu/xbox-game-pass-ultimate-3-mois/index.html
+++ b/jeu/xbox-game-pass-ultimate-3-mois/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Xbox Game Pass Ultimate — 3 mois — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="3 mois Ultimate : souvent le meilleur rapport durée / prix. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/xbox-game-pass-ultimate-3-mois/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Xbox Game Pass Ultimate — 3 mois","description":"3 mois Ultimate : souvent le meilleur rapport durée / prix.","image":"https://gaming-cdn.com/images/products/4994/616x353/xbox-game-pass-ultimate-3-mois-xbox-one-xbox-series-x-s-pc-microsoft-store-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"50.62","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/xbox-game-pass-ultimate-3-mois/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Xbox Game Pass Ultimate — 3 mois","description":"3 mois Ultimate : souvent le meilleur rapport durée / prix.","image":"https://gaming-cdn.com/images/products/4994/616x353/xbox-game-pass-ultimate-3-mois-xbox-one-xbox-series-x-s-pc-microsoft-store-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"50.62","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/4994-acheter-xbox-game-pass-ultimate-3-mois-xbox-one-xbox-series-x-s-pc-microsoft-store/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/yakuza-0/index.html b/jeu/yakuza-0/index.html
index 85cd8bc..cf80de5 100644
--- a/jeu/yakuza-0/index.html
+++ b/jeu/yakuza-0/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Yakuza 0 — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Préquelle Yakuza — 80s Tokyo/Osaka. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/yakuza-0/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Yakuza 0","description":"Préquelle Yakuza — 80s Tokyo/Osaka.","image":"https://gaming-cdn.com/images/products/3104/616x353/yakuza-0-pc-steam-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"10.13","availability":"https://schema.org/OutOfStock","url":"https://www.jeuxstash.fr/jeu/yakuza-0/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Yakuza 0","description":"Préquelle Yakuza — 80s Tokyo/Osaka.","image":"https://gaming-cdn.com/images/products/3104/616x353/yakuza-0-pc-steam-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"10.13","availability":"https://schema.org/OutOfStock","url":"https://www.instant-gaming.com/fr/3104-acheter-steam-yakuza-0-pc-steam?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/zelda-breath-of-the-wild/index.html b/jeu/zelda-breath-of-the-wild/index.html
index 60cbfb8..29c843a 100644
--- a/jeu/zelda-breath-of-the-wild/index.html
+++ b/jeu/zelda-breath-of-the-wild/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Zelda: Breath of the Wild — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="Le classique open world Switch. Toujours excellent. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/zelda-breath-of-the-wild/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Zelda: Breath of the Wild","description":"Le classique open world Switch. Toujours excellent.","image":"https://gaming-cdn.com/images/products/2616/616x353/the-legend-of-zelda-breath-of-the-wild-switch-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"74.92","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/zelda-breath-of-the-wild/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Zelda: Breath of the Wild","description":"Le classique open world Switch. Toujours excellent.","image":"https://gaming-cdn.com/images/products/2616/616x353/the-legend-of-zelda-breath-of-the-wild-switch-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"74.92","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/2616-acheter-the-legend-of-zelda-breath-of-the-wild-switch-jeu-nintendo-eshop-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/jeu/zelda-tears-of-the-kingdom/index.html b/jeu/zelda-tears-of-the-kingdom/index.html
index b93e834..67e885c 100644
--- a/jeu/zelda-tears-of-the-kingdom/index.html
+++ b/jeu/zelda-tears-of-the-kingdom/index.html
@@ -16,7 +16,6 @@
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <title>Zelda: Tears of the Kingdom — prix, résumé &amp; config — JeuxStash</title>
   <meta id="meta-desc" name="description" content="L’aventure Switch du moment. À checker en stock. Prix clé Instant Gaming, verdict, config PC si dispo." />
-  <meta name="robots" content="noindex,follow" />
   <link id="canonical" rel="canonical" href="https://www.jeuxstash.fr/jeu/zelda-tears-of-the-kingdom/" />
   <meta name="twitter:card" content="summary_large_image" />
   <meta property="og:type" content="website" />
@@ -36,7 +35,7 @@
   <link rel="preconnect" href="https://cdn.cloudflare.steamstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
   <link rel="stylesheet" href="/css/style.css?v=20261007cred2" />
-<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Zelda: Tears of the Kingdom","description":"L’aventure Switch du moment. À checker en stock.","image":"https://gaming-cdn.com/images/products/4860/616x353/the-legend-of-zelda-tears-of-the-kingdom-switch-cover.jpg","brand":{"@type":"Brand","name":"JeuxStash"},"offers":{"@type":"Offer","priceCurrency":"EUR","price":"71.43","availability":"https://schema.org/InStock","url":"https://www.jeuxstash.fr/jeu/zelda-tears-of-the-kingdom/"}}</script>
+<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"Zelda: Tears of the Kingdom","description":"L’aventure Switch du moment. À checker en stock.","image":"https://gaming-cdn.com/images/products/4860/616x353/the-legend-of-zelda-tears-of-the-kingdom-switch-cover.jpg","offers":{"@type":"Offer","priceCurrency":"EUR","price":"71.43","availability":"https://schema.org/InStock","url":"https://www.instant-gaming.com/fr/4860-acheter-the-legend-of-zelda-tears-of-the-kingdom-switch-jeu-nintendo-eshop-europe/?igr=gamer-47bd4c","seller":{"@type":"Organization","name":"Instant Gaming"}}}</script>
 </head>
 <body>
   <div class="bg-grid" aria-hidden="true"></div>
diff --git a/js/home.js b/js/home.js
index ccf4ef0..4b5e0d0 100644
--- a/js/home.js
+++ b/js/home.js
@@ -223,11 +223,11 @@
   function setHero(game) {
     if (!game) return;
     const actions = document.querySelector(".hero-actions");
-    const eyebrow = document.querySelector(".hero .eyebrow");
     const bgImg = document.getElementById("hero-bg-img");
-    if (eyebrow) {
-      eyebrow.textContent = plan.eyebrow + " · " + plan.label;
-    }
+    const fiche =
+      window.JEUXSTASH_FICHE && window.JEUXSTASH_FICHE.url
+        ? window.JEUXSTASH_FICHE.url(game)
+        : "/deals?q=" + encodeURIComponent(game.name);
     if (bgImg) {
       const hd = heroBgUrl(game);
       bgImg.src = hd;
@@ -249,24 +249,18 @@
     if (actions) {
       const buy = actions.querySelector(".btn.buy, .btn.is-oos");
       if (buy) {
-        if (game.stock === "out") {
-          const span = document.createElement("span");
-          span.className = "btn buy is-oos";
-          span.setAttribute("aria-disabled", "true");
-          span.textContent = game.name + " — rupture";
-          buy.replaceWith(span);
-        } else if (buy.tagName === "A") {
-          buy.href = game.ig;
-          buy.rel = "sponsored noopener";
-          buy.target = "_blank";
-          buy.textContent = "Voir le prix — " + game.name;
+        if (buy.tagName === "A") {
+          buy.className = "btn buy";
+          buy.href = fiche;
+          buy.removeAttribute("rel");
+          buy.removeAttribute("target");
+          buy.removeAttribute("aria-disabled");
+          buy.textContent = "Voir " + game.name;
         } else {
           const a = document.createElement("a");
           a.className = "btn buy";
-          a.href = game.ig;
-          a.rel = "sponsored noopener";
-          a.target = "_blank";
-          a.textContent = "Voir le prix — " + game.name;
+          a.href = fiche;
+          a.textContent = "Voir " + game.name;
           buy.replaceWith(a);
         }
       }
diff --git a/scripts/generate-fiches.js b/scripts/generate-fiches.js
index de57c63..b27e508 100644
--- a/scripts/generate-fiches.js
+++ b/scripts/generate-fiches.js
@@ -59,7 +59,6 @@ function buildPage(template, game, slug) {
     name: game.name,
     description: game.blurb || desc,
     image: img,
-    brand: { "@type": "Brand", name: "JeuxStash" },
     offers: game.price
       ? {
           "@type": "Offer",
@@ -69,13 +68,16 @@ function buildPage(template, game, slug) {
             game.stock === "out"
               ? "https://schema.org/OutOfStock"
               : "https://schema.org/InStock",
-          url: url,
+          url: game.ig || url,
+          seller: { "@type": "Organization", name: "Instant Gaming" },
         }
       : undefined,
   };
   if (!jsonLd.offers) delete jsonLd.offers;
 
   let html = template;
+  // Les fiches doivent être indexables (ne pas hériter du noindex du shell /jeu/)
+  html = html.replace(/\s*<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?>\s*/gi, "\n  ");
   html = html.replace(/<title>[^<]*<\/title>/, "<title>" + esc(title) + "</title>");
   html = html.replace(
     /<meta id="meta-desc" name="description" content="[^"]*" \/>/,
diff --git a/sitemap-jeux.xml b/sitemap-jeux.xml
index ffc81fd..a237483 100644
--- a/sitemap-jeux.xml
+++ b/sitemap-jeux.xml
@@ -1,224 +1,224 @@
 <?xml version="1.0" encoding="UTF-8"?>
 <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
-  <url><loc>https://www.jeuxstash.fr/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/deals</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/pc-builder</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/a-propos</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/mentions-legales</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/confidentialite</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/black-friday-jeux-2026</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/meilleurs-jeux-pas-cher-automne-2026</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/black-myth-wukong-pas-cher</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/expedition-33-pas-cher</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/call-of-duty-pas-cher</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/gta-6-pas-cher</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/ea-fc-pas-cher</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/instant-gaming-fiable</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/cyberpunk-pas-cher</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/elden-ring-pas-cher</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/acheter-jeux-pas-cher</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/jeux-ce-soir-pas-cher</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/game-pass-vs-acheter</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/meilleurs-jeux-coop-2026</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/pc-gaming-petit-budget</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/meilleurs-jeux-sport-2026</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/cles-jeux-legitimes</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/baldurs-gate-3-pas-cher</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/cle-steam-pas-cher</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/forza-horizon-5-pas-cher</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/guides/soldes-steam-payer-moins</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/wardogs/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/it-takes-two/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/stardew-valley/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/forza-horizon-5/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/deep-rock-galactic/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/overcooked-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/plateup/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/lethal-company/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/phasmophobia/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/helldivers-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/valheim/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/hades/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/risk-of-rain-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/grand-theft-auto-vi/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/call-of-duty-modern-warfare-4/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/resident-evil-requiem/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/crimson-desert-enhanced/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/pragmata/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/mafia-the-old-country/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/ghost-of-yotei/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/the-witcher-4/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/xbox-game-pass-ultimate-1-mois/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/xbox-game-pass-ultimate-3-mois/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/xbox-game-pass-premium-1-mois/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/xbox-game-pass-premium-3-mois/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/xbox-game-pass-essential-1-mois/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/xbox-game-pass-essential-3-mois/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/xbox-game-pass-essential-12-mois/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/pc-game-pass-3-mois/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/minecraft/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/ea-sports-fc-27/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/black-myth-wukong/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/clair-obscur-expedition-33/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/monster-hunter-wilds/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/assassin-s-creed-shadows/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/indiana-jones-and-the-great-circle/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/doom-the-dark-ages/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/kingdom-come-deliverance-ii/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/silent-hill-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/ghost-of-tsushima-director-s-cut/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/palworld/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/hades-ii/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/split-fiction/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/warhammer-40-000-space-marine-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/stellar-blade/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/lies-of-p/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/resident-evil-4/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/tekken-8/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/street-fighter-6/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/metaphor-refantazio/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/persona-3-reload/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/sekiro-shadows-die-twice/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/dragon-s-dogma-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/until-dawn/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/schedule-i/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/s-t-a-l-k-e-r-2-heart-of-chornobyl/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/alan-wake-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/baldur-s-gate-3/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/elden-ring/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/cyberpunk-2077/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/gta-v-enhanced/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/red-dead-redemption-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/sea-of-thieves/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/watch-dogs/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/watch-dogs-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/watch-dogs-legion/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/far-cry-5/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/far-cry-6/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/assassin-s-creed-odyssey/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/the-witcher-3/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/hogwarts-legacy/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/god-of-war/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/marvel-s-spider-man/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/zelda-tears-of-the-kingdom/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/zelda-breath-of-the-wild/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/mario-kart-8-deluxe/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/super-mario-odyssey/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/animal-crossing-new-horizons/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/super-smash-bros-ultimate/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/marvel-s-spider-man-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/god-of-war-ragnarok/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/horizon-forbidden-west/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/the-last-of-us-part-i/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/astro-bot/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/call-of-duty-black-ops-7/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/halo-infinite-campaign/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/hollow-knight/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/hollow-knight-silksong/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/balatro/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/vampire-survivors/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/celeste/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/dead-cells/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/outer-wilds/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/no-man-s-sky/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/disco-elysium/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/the-elder-scrolls-v-skyrim-special-edition/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/borderlands-4/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/arc-raiders/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/r-e-p-o/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/content-warning/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/remnant-ii/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/death-stranding-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/peak/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/ace-combat-8-wings-of-theve/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/nier-automata-game-of-the-yorha-edition/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/armored-core-vi-fires-of-rubicon/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/devil-may-cry-5/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/doom-eternal/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/fallout-4-goty-edition/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/terraria/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/satisfactory/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/factorio/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/sid-meier-s-civilization-vi/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/persona-5-royal/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/starfield/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/ready-or-not/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/dark-souls-iii/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/dark-souls-remastered/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/core-keeper/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/dave-the-diver/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/cult-of-the-lamb/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/enshrouded/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/avowed/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/euro-truck-simulator-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/farming-simulator-25/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/raft/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/project-zomboid/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/rimworld/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/sons-of-the-forest/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/portal-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/left-4-dead-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/cuphead/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/ultrakill/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/inscryption/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/animal-well/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/nine-sols/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/resident-evil-village/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/sifu/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/dying-light-2-stay-human/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/control-ultimate-edition/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/yakuza-0/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/like-a-dragon-infinite-wealth/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/final-fantasy-xvi/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/final-fantasy-vii-remake-intergrade/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/star-wars-jedi-survivor/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/star-wars-outlaws/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/wuchang-fallen-feathers/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/metal-gear-solid-snake-eater/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/dying-light-the-beast/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/f1-25/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/ea-sports-fc-26/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/payday-3/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/hunt-showdown-1896/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/the-elder-scrolls-iv-oblivion-remastered/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/diablo-iv/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/a-plague-tale-requiem/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/the-last-of-us-part-ii/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/uncharted-legacy-of-thieves-collection/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/titanfall-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/powerwash-simulator/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/grounded/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/don-t-starve-together/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/ori-and-the-will-of-the-wisps/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/cronos-the-new-dawn/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/ninja-gaiden-4/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/mass-effect-legendary-edition/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/dragon-age-the-veilguard/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/returnal/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/ratchet-clank-rift-apart/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/dead-space/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/alan-wake-remastered/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/half-life-alyx/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/v-rising/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/monster-hunter-world/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/resident-evil-2/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/resident-evil-3/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/metro-exodus/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/silent-hill-f/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/elden-ring-nightreign/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/call-of-duty-black-ops-6/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/tom-clancy-s-rainbow-six-siege/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/snowrunner/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/little-nightmares-iii/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/microsoft-flight-simulator-2024/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/forza-motorsport/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/assetto-corsa-competizione/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/battlefield-6/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/cities-skylines-ii/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/subnautica/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/rust/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/garry-s-mod/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/need-for-speed-unbound/</loc><lastmod>2026-10-07</lastmod></url>
-  <url><loc>https://www.jeuxstash.fr/jeu/nba-2k26/</loc><lastmod>2026-10-07</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/deals</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/pc-builder</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/a-propos</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/mentions-legales</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/confidentialite</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/black-friday-jeux-2026</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/meilleurs-jeux-pas-cher-automne-2026</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/black-myth-wukong-pas-cher</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/expedition-33-pas-cher</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/call-of-duty-pas-cher</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/gta-6-pas-cher</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/ea-fc-pas-cher</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/instant-gaming-fiable</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/cyberpunk-pas-cher</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/elden-ring-pas-cher</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/acheter-jeux-pas-cher</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/jeux-ce-soir-pas-cher</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/game-pass-vs-acheter</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/meilleurs-jeux-coop-2026</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/pc-gaming-petit-budget</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/meilleurs-jeux-sport-2026</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/cles-jeux-legitimes</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/baldurs-gate-3-pas-cher</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/cle-steam-pas-cher</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/forza-horizon-5-pas-cher</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/guides/soldes-steam-payer-moins</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/wardogs/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/it-takes-two/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/stardew-valley/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/forza-horizon-5/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/deep-rock-galactic/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/overcooked-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/plateup/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/lethal-company/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/phasmophobia/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/helldivers-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/valheim/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/hades/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/risk-of-rain-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/grand-theft-auto-vi/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/call-of-duty-modern-warfare-4/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/resident-evil-requiem/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/crimson-desert-enhanced/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/pragmata/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/mafia-the-old-country/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/ghost-of-yotei/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/the-witcher-4/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/xbox-game-pass-ultimate-1-mois/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/xbox-game-pass-ultimate-3-mois/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/xbox-game-pass-premium-1-mois/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/xbox-game-pass-premium-3-mois/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/xbox-game-pass-essential-1-mois/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/xbox-game-pass-essential-3-mois/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/xbox-game-pass-essential-12-mois/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/pc-game-pass-3-mois/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/minecraft/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/ea-sports-fc-27/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/black-myth-wukong/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/clair-obscur-expedition-33/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/monster-hunter-wilds/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/assassin-s-creed-shadows/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/indiana-jones-and-the-great-circle/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/doom-the-dark-ages/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/kingdom-come-deliverance-ii/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/silent-hill-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/ghost-of-tsushima-director-s-cut/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/palworld/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/hades-ii/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/split-fiction/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/warhammer-40-000-space-marine-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/stellar-blade/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/lies-of-p/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/resident-evil-4/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/tekken-8/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/street-fighter-6/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/metaphor-refantazio/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/persona-3-reload/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/sekiro-shadows-die-twice/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/dragon-s-dogma-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/until-dawn/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/schedule-i/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/s-t-a-l-k-e-r-2-heart-of-chornobyl/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/alan-wake-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/baldur-s-gate-3/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/elden-ring/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/cyberpunk-2077/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/gta-v-enhanced/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/red-dead-redemption-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/sea-of-thieves/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/watch-dogs/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/watch-dogs-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/watch-dogs-legion/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/far-cry-5/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/far-cry-6/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/assassin-s-creed-odyssey/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/the-witcher-3/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/hogwarts-legacy/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/god-of-war/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/marvel-s-spider-man/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/zelda-tears-of-the-kingdom/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/zelda-breath-of-the-wild/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/mario-kart-8-deluxe/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/super-mario-odyssey/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/animal-crossing-new-horizons/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/super-smash-bros-ultimate/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/marvel-s-spider-man-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/god-of-war-ragnarok/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/horizon-forbidden-west/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/the-last-of-us-part-i/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/astro-bot/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/call-of-duty-black-ops-7/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/halo-infinite-campaign/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/hollow-knight/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/hollow-knight-silksong/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/balatro/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/vampire-survivors/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/celeste/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/dead-cells/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/outer-wilds/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/no-man-s-sky/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/disco-elysium/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/the-elder-scrolls-v-skyrim-special-edition/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/borderlands-4/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/arc-raiders/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/r-e-p-o/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/content-warning/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/remnant-ii/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/death-stranding-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/peak/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/ace-combat-8-wings-of-theve/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/nier-automata-game-of-the-yorha-edition/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/armored-core-vi-fires-of-rubicon/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/devil-may-cry-5/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/doom-eternal/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/fallout-4-goty-edition/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/terraria/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/satisfactory/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/factorio/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/sid-meier-s-civilization-vi/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/persona-5-royal/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/starfield/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/ready-or-not/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/dark-souls-iii/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/dark-souls-remastered/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/core-keeper/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/dave-the-diver/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/cult-of-the-lamb/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/enshrouded/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/avowed/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/euro-truck-simulator-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/farming-simulator-25/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/raft/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/project-zomboid/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/rimworld/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/sons-of-the-forest/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/portal-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/left-4-dead-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/cuphead/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/ultrakill/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/inscryption/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/animal-well/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/nine-sols/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/resident-evil-village/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/sifu/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/dying-light-2-stay-human/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/control-ultimate-edition/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/yakuza-0/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/like-a-dragon-infinite-wealth/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/final-fantasy-xvi/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/final-fantasy-vii-remake-intergrade/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/star-wars-jedi-survivor/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/star-wars-outlaws/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/wuchang-fallen-feathers/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/metal-gear-solid-snake-eater/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/dying-light-the-beast/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/f1-25/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/ea-sports-fc-26/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/payday-3/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/hunt-showdown-1896/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/the-elder-scrolls-iv-oblivion-remastered/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/diablo-iv/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/a-plague-tale-requiem/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/the-last-of-us-part-ii/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/uncharted-legacy-of-thieves-collection/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/titanfall-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/powerwash-simulator/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/grounded/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/don-t-starve-together/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/ori-and-the-will-of-the-wisps/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/cronos-the-new-dawn/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/ninja-gaiden-4/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/mass-effect-legendary-edition/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/dragon-age-the-veilguard/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/returnal/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/ratchet-clank-rift-apart/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/dead-space/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/alan-wake-remastered/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/half-life-alyx/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/v-rising/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/monster-hunter-world/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/resident-evil-2/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/resident-evil-3/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/metro-exodus/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/silent-hill-f/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/elden-ring-nightreign/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/call-of-duty-black-ops-6/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/tom-clancy-s-rainbow-six-siege/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/snowrunner/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/little-nightmares-iii/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/microsoft-flight-simulator-2024/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/forza-motorsport/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/assetto-corsa-competizione/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/battlefield-6/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/cities-skylines-ii/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/subnautica/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/rust/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/garry-s-mod/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/need-for-speed-unbound/</loc><lastmod>2026-10-08</lastmod></url>
+  <url><loc>https://www.jeuxstash.fr/jeu/nba-2k26/</loc><lastmod>2026-10-08</lastmod></url>
 </urlset>
