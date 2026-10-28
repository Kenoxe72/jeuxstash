/* Verdict Acheter / Attendre / Game Pass + comparaison IG vs boutique */
window.JEUXSTASH_VERDICT = (function () {
  /** Prix boutique indicatifs (EU) + présence Game Pass fréquente — métrique éditoriale, pas un scraper live */
  var HINTS = {
    "It Takes Two": { store: 39.99 },
    "Stardew Valley": { store: 13.99 },
    "Forza Horizon 5": { store: 59.99, pass: true },
    "Deep Rock Galactic": { store: 29.99 },
    "Overcooked 2": { store: 22.99 },
    "PlateUp!": { store: 19.99 },
    "Elden Ring": { store: 59.99 },
    "Cyberpunk 2077": { store: 59.99 },
    "Baldur's Gate 3": { store: 69.99 },
    "Sea of Thieves": { store: 39.99, pass: true },
    "Minecraft": { store: 26.95, pass: true },
    "Hades": { store: 24.99 },
    "Hades II": { store: 29.99 },
    "Risk of Rain 2": { store: 24.99 },
    "Monster Hunter Wilds": { store: 69.99 },
    "Warhammer 40,000: Space Marine 2": { store: 59.99 },
    "Black Myth: Wukong": { store: 59.99 },
    "Call of Duty: Black Ops 7": { store: 79.99 },
    "Call of Duty: Modern Warfare 4": { store: 79.99 },
    "Xbox Game Pass Ultimate — 1 mois": { store: 20.99 },
    "Xbox Game Pass Ultimate — 3 mois": { store: 62.99 },
    "Xbox Game Pass Premium — 1 mois": { store: 12.99 },
    "Xbox Game Pass Premium — 3 mois": { store: 38.99 },
    "Xbox Game Pass Essential — 1 mois": { store: 8.99 },
    "Xbox Game Pass Essential — 3 mois": { store: 24.99 },
    "Xbox Game Pass Essential — 12 mois": { store: 71.99 },
    "PC Game Pass — 3 mois": { store: 38.97 },
    "Resident Evil Requiem": { store: 69.99 },
    "Crimson Desert Enhanced": { store: 69.99 },
    "Pragmata": { store: 69.99 },
    "Mafia: The Old Country": { store: 59.99 },
    "Ghost of Yōtei": { store: 79.99 },
    "The Witcher 4": { store: 69.99 },
    "EA Sports FC 27": { store: 69.99 },
    "Grand Theft Auto VI": { store: 79.99 },
    "Grand Theft Auto V Enhanced": { store: 29.99 },
    "The Witcher 3": { store: 29.99 },
    "Resident Evil 4": { store: 39.99 },
    "Far Cry 6": { store: 59.99, pass: true },
    "Watch Dogs Legion": { store: 49.99, pass: true },
    "Watch Dogs": { store: 29.99 },
    "Helldivers 2": { store: 39.99 },
    "Clair Obscur: Expedition 33": { store: 49.99 },
    "Super Smash Bros. Ultimate": { store: 64.99 },
    "Red Dead Redemption 2": { store: 59.99 },
    "Hollow Knight": { store: 14.79 },
    "Hollow Knight: Silksong": { store: 19.5 },
    "Balatro": { store: 14.99 },
    "Vampire Survivors": { store: 4.99 },
    "Celeste": { store: 19.99 },
    "Dead Cells": { store: 24.99 },
    "Outer Wilds": { store: 22.99 },
    "No Man's Sky": { store: 59.99 },
    "Disco Elysium": { store: 39.99 },
    "The Elder Scrolls V: Skyrim Special Edition": { store: 39.99, pass: true },
    "Borderlands 4": { store: 69.99 },
    "Arc Raiders": { store: 39.99 },
    "R.E.P.O.": { store: 9.99 },
    "Content Warning": { store: 7.99 },
    "Remnant II": { store: 49.99, pass: true },
    "Death Stranding 2": { store: 69.99 },
    "PEAK": { store: 7.99 },
    "WARDOGS": { store: 39.99 },
    "Lethal Company": { store: 9.75 },
    "Phasmophobia": { store: 19.5 },
    "Valheim": { store: 19.99, pass: true },
    "Assassin's Creed Shadows": { store: 69.99 },
    "Indiana Jones and the Great Circle": { store: 69.99, pass: true },
    "DOOM: The Dark Ages": { store: 69.99, pass: true },
    "Kingdom Come: Deliverance II": { store: 59.99 },
    "Silent Hill 2": { store: 69.99 },
    "Ghost of Tsushima Director's Cut": { store: 59.99 },
    "Palworld": { store: 28.99, pass: true },
    "Split Fiction": { store: 49.99 },
    "Stellar Blade": { store: 69.99 },
    "Lies of P": { store: 59.99, pass: true },
    "TEKKEN 8": { store: 69.99 },
    "Street Fighter 6": { store: 59.99 },
    "Metaphor: ReFantazio": { store: 69.99 },
    "Persona 3 Reload": { store: 69.99, pass: true },
    "Sekiro: Shadows Die Twice": { store: 59.99 },
    "Dragon's Dogma 2": { store: 64.99 },
    "Until Dawn": { store: 69.99 },
    "Schedule I": { store: 19.99 },
    "S.T.A.L.K.E.R. 2: Heart of Chornobyl": { store: 59.99, pass: true },
    "Alan Wake 2": { store: 49.99 },
    "GTA V Enhanced": { store: 29.99 },
    "Watch Dogs 2": { store: 49.99, pass: true },
    "Far Cry 5": { store: 59.99, pass: true },
    "Assassin's Creed Odyssey": { store: 59.99, pass: true },
    "Hogwarts Legacy": { store: 59.99 },
    "God of War": { store: 49.99 },
    "Marvel's Spider-Man": { store: 59.99 },
    "Zelda: Tears of the Kingdom": { store: 69.99 },
    "Zelda: Breath of the Wild": { store: 69.99 },
    "Mario Kart 8 Deluxe": { store: 59.99 },
    "Super Mario Odyssey": { store: 59.99 },
    "Animal Crossing: New Horizons": { store: 59.99 },
    "Marvel's Spider-Man 2": { store: 69.99 },
    "God of War Ragnarök": { store: 59.99 },
    "Horizon Forbidden West": { store: 59.99 },
    "The Last of Us Part I": { store: 59.99 },
    "Astro Bot": { store: 69.99 },
    "Halo Infinite Campaign": { store: 59.99, pass: true },
    "Ace Combat 8: Wings of Theve": { store: 69.99 },
    "NieR: Automata Game of the YoRHa Edition": { store: 39.99 },
    "ARMORED CORE VI FIRES OF RUBICON": { store: 59.99 },
    "Devil May Cry 5": { store: 29.99 },
    "DOOM Eternal": { store: 39.99, pass: true },
    "Fallout 4 GOTY Edition": { store: 39.99, pass: true },
    "Terraria": { store: 9.99 },
    "Satisfactory": { store: 38.99 },
    "Factorio": { store: 35.0 },
    "Sid Meier's Civilization VI": { store: 59.99 },
    "Persona 5 Royal": { store: 59.99 },
    "Starfield": { store: 69.99, pass: true },
    "Ready or Not": { store: 49.99 },
    "DARK SOULS III": { store: 59.99 },
    "DARK SOULS REMASTERED": { store: 39.99 },
    "Core Keeper": { store: 19.99, pass: true },
    "Dave the Diver": { store: 19.99 },
    "Cult of the Lamb": { store: 22.99 },
    "Enshrouded": { store: 29.99 },
    "Avowed": { store: 69.99, pass: true },
    "Euro Truck Simulator 2": { store: 19.99 },
    "Farming Simulator 25": { store: 49.99 },
    "Raft": { store: 19.99 },
    "Project Zomboid": { store: 19.5 },
    "RimWorld": { store: 31.99 },
    "Sons of the Forest": { store: 28.99 },
    "Portal 2": { store: 9.75 },
    "Left 4 Dead 2": { store: 9.75 },
    "Cuphead": { store: 19.99 },
    "ULTRAKILL": { store: 24.5 },
    "Inscryption": { store: 19.99 },
    "Animal Well": { store: 24.5 },
    "Nine Sols": { store: 28.99 },
    "Resident Evil Village": { store: 39.99 },
    "Sifu": { store: 39.99 },
    "Dying Light 2 Stay Human": { store: 59.99 },
    "Control Ultimate Edition": { store: 39.99, pass: true },
    "Yakuza 0": { store: 19.99 },
    "Like a Dragon: Infinite Wealth": { store: 69.99 },
    "FINAL FANTASY XVI": { store: 49.99 },
    "FINAL FANTASY VII REMAKE INTERGRADE": { store: 39.99 },
    "STAR WARS Jedi: Survivor": { store: 69.99, pass: true },
    "Star Wars Outlaws": { store: 69.99 },
    "Wuchang: Fallen Feathers": { store: 49.99, pass: true },
    "METAL GEAR SOLID Δ: SNAKE EATER": { store: 69.99 },
    "Dying Light: The Beast": { store: 39.99 },
    "F1 25": { store: 69.99 },
    "EA Sports FC 26": { store: 69.99 },
    "PAYDAY 3": { store: 29.99, pass: true },
    "Hunt: Showdown 1896": { store: 29.99, pass: true },
    "The Elder Scrolls IV: Oblivion Remastered": { store: 54.99, pass: true },
    "Diablo IV": { store: 49.99, pass: true },
    "A Plague Tale: Requiem": { store: 49.99, pass: true },
    "The Last of Us Part II": { store: 49.99 },
    "Uncharted: Legacy of Thieves Collection": { store: 49.99 },
    "Titanfall 2": { store: 29.99, pass: true },
    "PowerWash Simulator": { store: 24.99, pass: true },
    "Grounded": { store: 39.99, pass: true },
    "Don't Starve Together": { store: 14.99 },
    "Ori and the Will of the Wisps": { store: 29.99, pass: true },
    "Cronos: The New Dawn": { store: 49.99 },
    "NINJA GAIDEN 4": { store: 69.99, pass: true },
    "Mass Effect Legendary Edition": { store: 59.99, pass: true },
    "Dragon Age: The Veilguard": { store: 59.99 },
    "Returnal": { store: 59.99 },
    "Ratchet & Clank: Rift Apart": { store: 59.99 },
    "Dead Space": { store: 59.99, pass: true },
    "Alan Wake Remastered": { store: 29.99 },
    "Half-Life: Alyx": { store: 58.99 },
    "V Rising": { store: 34.99 },
    "Monster Hunter: World": { store: 29.99 },
    "Resident Evil 2": { store: 39.99, pass: true },
    "Resident Evil 3": { store: 39.99, pass: true },
    "Metro Exodus": { store: 29.99 },
    "Silent Hill f": { store: 69.99 },
    "Elden Ring Nightreign": { store: 39.99 },
    "Call of Duty: Black Ops 6": { store: 79.99, pass: true },
    "Tom Clancy's Rainbow Six Siege": { store: 19.99, pass: true },
    "SnowRunner": { store: 29.99, pass: true },
    "Little Nightmares III": { store: 39.99 },
    "Microsoft Flight Simulator 2024": { store: 79.99, pass: true },
    "Forza Motorsport": { store: 69.99, pass: true },
    "Assetto Corsa Competizione": { store: 39.99 },
    "Battlefield 6": { store: 69.99 },
    "Cities: Skylines II": { store: 49.99, pass: true },
    "Subnautica": { store: 29.99 },
    "Rust": { store: 39.99 },
    "Garry's Mod": { store: 9.99 },
    "Need for Speed Unbound": { store: 69.99, pass: true },
    "NBA 2K26": { store: 69.99 },
    "FINAL FANTASY VII REBIRTH": { store: 69.99 },
    "DRAGON BALL: Sparking! ZERO": { store: 69.99 },
    "Monster Hunter Rise": { store: 39.99 },
    "Batman: Arkham Knight Premium Edition": { store: 39.99 },
    "Middle-earth: Shadow of War Definitive Edition": { store: 49.99, pass: true },
    "Mad Max": { store: 19.99 },
    "Brotato": { store: 4.99, pass: true },
    "Rise of the Tomb Raider: 20 Year Celebration": { store: 29.99 },
    "Assetto Corsa": { store: 19.99 },
    "Frostpunk 2": { store: 44.99, pass: true },
    "Sleeping Dogs: Definitive Edition": { store: 19.99 },
    "Detroit: Become Human": { store: 39.99 },
    "Slay the Spire": { store: 22.99, pass: true },
    "Dead by Daylight": { store: 19.99, pass: true },
    "Days Gone": { store: 49.99 },
    "Mortal Kombat 1 Definitive Edition": { store: 69.99 },
    "Age of Empires IV: Anniversary Edition": { store: 39.99, pass: true },
    "7 Days to Die": { store: 43.99 },
    "Manor Lords": { store: 39.99, pass: true },
    "DayZ": { store: 47.99 },
  };

  var WAIT_ALWAYS = {
    "Grand Theft Auto VI": true,
    "Call of Duty: Black Ops 7": true,
    "Call of Duty: Modern Warfare 4": true,
    "The Witcher 4": true,
    "Resident Evil Requiem": true,
    "Crimson Desert Enhanced": true,
    "EA Sports FC 27": true,
    "Borderlands 4": true,
    "Death Stranding 2": true,
    "Hollow Knight: Silksong": true,
  };

  function hintFor(game) {
    if (!game) return null;
    if (HINTS[game.name]) return HINTS[game.name];
    if (game.store || game.pass) {
      return { store: game.store, pass: !!game.pass };
    }
    return null;
  }

  function savePct(ig, store) {
    if (ig == null || store == null || store <= 0 || ig > store) return null;
    return Math.round(((store - ig) / store) * 100);
  }

  function euro(n) {
    if (n == null || Number.isNaN(n)) return null;
    return (
      Number(n).toLocaleString("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }) + "\u00a0€"
    );
  }

  function verdictFor(game) {
    var hint = hintFor(game) || {};
    var ig = game.price;
    var store = hint.store != null ? hint.store : null;
    var pass = !!hint.pass;
    var pct = savePct(ig, store);
    var out = game.stock === "out";
    var kind = "buy";
    var label = "Acheter";
    var title = "Bon rapport qualité / prix pour une clé maintenant.";

    if (WAIT_ALWAYS[game.name] && (out || ig == null || ig >= 55)) {
      kind = "wait";
      label = "Attendre";
      title = "Sortie récente ou plein tarif : mieux vaut comparer et attendre une baisse.";
    } else if (out) {
      kind = "wait";
      label = "Attendre";
      title = "Clé en rupture ou précommande — surveillez le prix ou comparez ailleurs.";
    } else if (pass && (ig == null || ig > 18) && (pct == null || pct < 45)) {
      kind = "abo";
      label = "Game Pass";
      title = "Souvent sur Game Pass : l’abo peut battre l’achat si vous testez beaucoup.";
    } else if (pct != null && pct >= 35) {
      kind = "buy";
      label = "Acheter";
      title = "Écart net vs le prix boutique — bon moment pour une clé.";
    } else if (pct != null && pct < 15 && ig >= 40) {
      kind = "wait";
      label = "Attendre";
      title = "Peu d’écart avec la boutique : une promo store ou une baisse IG peut arriver.";
    } else if (ig != null && ig <= 15) {
      kind = "buy";
      label = "Acheter";
      title = "Petit prix : peu de risque à prendre maintenant.";
    } else if (ig != null && ig >= 55) {
      kind = "wait";
      label = "Attendre";
      title = "Prix encore élevé — comparez et surveillez les soldes.";
    }

    var saveEuro =
      ig != null && store != null && store > ig
        ? Math.round((store - ig) * 100) / 100
        : null;
    var compare = null;
    if (store != null && pct != null && pct > 0 && saveEuro != null && saveEuro >= 0.5) {
      compare = "Boutique ≈ " + euro(store) + " (−" + euro(saveEuro) + " / −" + pct + "\u00a0%)";
    } else if (store != null && pct != null && pct > 0) {
      compare = "Boutique ≈ " + euro(store) + " (−" + pct + "\u00a0%)";
    } else if (store != null) {
      compare = "Boutique ≈ " + euro(store);
    } else if (pass) {
      compare = "Souvent dispo sur Game Pass";
    }

    return {
      kind: kind,
      label: label,
      title: title,
      store: store,
      pass: pass,
      savePct: pct,
      saveEuro: saveEuro,
      compare: compare,
    };
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function chipHTML(game) {
    var v = verdictFor(game);
    return (
      '<span class="verdict verdict--' +
      v.kind +
      '" title="' +
      esc(v.title) +
      '">' +
      esc(v.label) +
      "</span>"
    );
  }

  function compareHTML(game) {
    var v = verdictFor(game);
    if (!v.compare) return "";
    if (v.store != null && v.savePct != null && v.savePct > 0 && v.saveEuro != null && v.saveEuro >= 0.5) {
      return (
        '<p class="price-compare" title="' +
        esc(v.title) +
        '">Boutique ≈ <del>' +
        esc(euro(v.store)) +
        '</del> <span class="save-euro">−' +
        esc(euro(v.saveEuro)) +
        " (−" +
        v.savePct +
        "\u00a0%)</span></p>"
      );
    }
    return '<p class="price-compare" title="' + esc(v.title) + '">' + esc(v.compare) + "</p>";
  }

  return {
    for: verdictFor,
    chipHTML: chipHTML,
    compareHTML: compareHTML,
    hints: HINTS,
  };
})();
