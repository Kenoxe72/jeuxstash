#!/usr/bin/env python3
"""Découverte automatique des tendances (Steam + Instant Gaming) et suivi des ruptures."""
from __future__ import annotations

import argparse
import datetime
import html as html_lib
import json
import os
from pathlib import Path
import re
import subprocess
import unicodedata
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "js" / "catalog.js"
REPORT_FILE = ROOT / "data" / "discovery-report.json"
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

ANCHOR_POPULARITY = {
    "Grand Theft Auto VI": 100,
    "Call of Duty: Modern Warfare 4": 92,
    "Call of Duty: Black Ops 7": 90,
    "EA Sports FC 27": 88,
    "Black Myth: Wukong": 86,
    "Elden Ring": 85,
    "Baldur's Gate 3": 84,
    "Cyberpunk 2077": 83,
    "Resident Evil Requiem": 82,
    "Red Dead Redemption 2": 80,
    "The Witcher 4": 75,
}

COMING_HELPER = """
/** Jeux à venir / précommandes (cat « coming » + vérification date de sortie non dépassée) */
window.JEUXSTASH_COMING = {
  isComing: function (game) {
    if (!game || (game.cats || []).indexOf("coming") === -1) return false;
    if (game.release) {
      var r = String(game.release).trim();
      var now = new Date();
      var todayStr = now.toISOString().slice(0, 10);
      if (/^\\d{4}-\\d{2}-\\d{2}$/.test(r) && r <= todayStr) return false;
      if (/^\\d{4}$/.test(r) && Number(r) < now.getFullYear()) return false;
    }
    return true;
  },
  label: function (game) {
    if (!game || !game.release) return "À venir";
    var r = String(game.release);
    if (/^\\d{4}$/.test(r)) return r;
    try {
      var d = new Date(r + "T12:00:00");
      if (Number.isNaN(d.getTime())) return "À venir";
      return d.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return "À venir";
    }
  },
};
"""


def norm(text: str) -> str:
    s = unicodedata.normalize("NFD", str(text or "").lower())
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def ig_product_id(url: str) -> str | None:
    m = re.search(r"instant-gaming\.com/fr/(\d+)-", str(url or ""))
    return m.group(1) if m else None


def load_catalog() -> tuple[list[dict], str]:
    raw = subprocess.check_output(
        [
            "node",
            "-e",
            'const fs=require("fs");'
            'const t=fs.readFileSync("js/catalog.js","utf8");'
            "global.window=global;"
            "eval(t);"
            'console.log(JSON.stringify({games:global.JEUXSTASH_CATALOG,updated:global.JEUXSTASH_PRICES_UPDATED||""}));',
        ],
        cwd=ROOT,
        text=True,
    )
    data = json.loads(raw)
    return data["games"], data["updated"]


def write_catalog(games: list[dict], updated_iso: str) -> None:
    out = (
        "/* Catalogue JeuxStash — liens Instant Gaming affiliés (igr=gamer-47bd4c) */\n"
        "window.JEUXSTASH_CATALOG = "
        + json.dumps(games, ensure_ascii=False, indent=2)
        + ";\n"
        "window.JEUXSTASH_PRICES_UPDATED = "
        + json.dumps(updated_iso)
        + ";\n"
        + COMING_HELPER
    )
    CATALOG.write_text(out, encoding="utf-8")


def fetch(url: str, timeout: int = 20) -> str:
    req = urllib.request.Request(
        url, headers={"User-Agent": UA, "Accept-Language": "fr-FR,fr;q=0.9"}
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "ignore")


def fetch_steam_trending() -> list[dict]:
    """Récupère top_sellers + coming_soon depuis Steam featuredcategories."""
    url = "https://store.steampowered.com/api/featuredcategories/?cc=fr&l=french"
    items: list[dict] = []
    seen_ids: set[int] = set()
    try:
        data = json.loads(fetch(url))
    except Exception as e:
        print(f"WARN Steam featuredcategories: {e}")
        return items

    for bucket in ("top_sellers", "coming_soon"):
        sec = data.get(bucket) or {}
        for pos, it in enumerate(sec.get("items") or [], start=1):
            appid = it.get("id")
            name = str(it.get("name") or "").strip()
            if not name or not appid or appid in seen_ids:
                continue
            seen_ids.add(int(appid))
            final_cents = it.get("final_price") or 0
            price_eur = round(final_cents / 100.0, 2) if final_cents > 0 else None
            items.append(
                {
                    "name": name,
                    "steam": int(appid),
                    "price": price_eur,
                    "source": f"steam:{bucket}",
                    "rank": pos if bucket == "top_sellers" else pos + 20,
                }
            )
    return items


def fetch_ig_trending() -> list[dict]:
    """Tente de lire les bestsellers & précommandes IG (tolérant si bloqué)."""
    urls = [
        ("ig:bestsellers", "https://www.instant-gaming.com/fr/rechercher/?sort_by=bestsellers"),
        ("ig:preorders", "https://www.instant-gaming.com/fr/rechercher/?sort_by=preorders"),
    ]
    items: list[dict] = []
    seen_ids: set[str] = set()
    link_re = re.compile(
        r'<a[^>]+href="(https://www\.instant-gaming\.com/fr/(\d+)-acheter-([^"/?]+)[^"]*)"[^>]*>(.*?)</a>',
        re.S | re.I,
    )
    for source, url in urls:
        try:
            body = fetch(url)
        except Exception as e:
            print(f"WARN {source}: {e}")
            continue
        pos = 0
        for full_url, prod_id, slug_part, inner in link_re.findall(body):
            if prod_id in seen_ids:
                continue
            title_m = re.search(r'(?:title|alt)="([^"]+)"', inner, re.I)
            raw_name = title_m.group(1) if title_m else slug_part.replace("-", " ").title()
            name = html_lib.unescape(raw_name).strip()
            if not name or len(name) < 2:
                continue
            seen_ids.add(prod_id)
            pos += 1
            price_m = re.search(r"([0-9]+[.,][0-9]{2})\s*€", inner)
            price = float(price_m.group(1).replace(",", ".")) if price_m else None
            items.append(
                {
                    "name": name,
                    "ig_id": prod_id,
                    "ig": full_url.split("?")[0] + "?igr=gamer-47bd4c",
                    "price": price,
                    "source": source,
                    "rank": pos if source == "ig:bestsellers" else pos + 15,
                }
            )
            if pos >= 25:
                break
    return items


def main() -> int:
    ap = argparse.ArgumentParser(description="Découverte tendances Steam & Instant Gaming")
    ap.add_argument(
        "--update-ranks",
        action="store_true",
        help="Écrire trendingRank et popularity dans js/catalog.js",
    )
    args = ap.parse_args()

    games, updated_iso = load_catalog()
    today_iso = datetime.date.today().isoformat()

    by_steam: dict[int, dict] = {}
    by_ig: dict[str, dict] = {}
    by_norm: dict[str, dict] = {}

    for g in games:
        if isinstance(g.get("steam"), int):
            by_steam[int(g["steam"])] = g
        pid = ig_product_id(g.get("ig"))
        if pid:
            by_ig[pid] = g
        n = norm(g.get("name", ""))
        if n:
            by_norm[n] = g
        for alias in g.get("aliases") or []:
            na = norm(alias)
            if na and na not in by_norm:
                by_norm[na] = g

    trending_items = fetch_steam_trending() + fetch_ig_trending()
    matched_map: dict[str, dict] = {}
    missing_candidates: list[dict] = []
    seen_missing: set[str] = set()

    for idx, item in enumerate(trending_items, start=1):
        match = None
        if item.get("steam") and item["steam"] in by_steam:
            match = by_steam[item["steam"]]
        elif item.get("ig_id") and item["ig_id"] in by_ig:
            match = by_ig[item["ig_id"]]
        else:
            n = norm(item["name"])
            if n in by_norm:
                match = by_norm[n]

        rank = min(50, int(item.get("rank") or idx))
        if match:
            name = match["name"]
            cur = matched_map.get(name)
            if cur is None:
                matched_map[name] = {
                    "name": name,
                    "rank": rank,
                    "sources": [item["source"]],
                    "steam": match.get("steam"),
                }
            else:
                cur["rank"] = min(cur["rank"], rank)
                if item["source"] not in cur["sources"]:
                    cur["sources"].append(item["source"])
        else:
            n_miss = norm(item["name"])
            if n_miss and n_miss not in seen_missing and "dlc" not in n_miss and "soundtrack" not in n_miss:
                seen_missing.add(n_miss)
                cand = {
                    "name": item["name"],
                    "source": item["source"],
                    "rank": rank,
                    "price": item.get("price"),
                }
                if item.get("steam"):
                    cand["steam"] = item["steam"]
                if item.get("ig"):
                    cand["ig"] = item["ig"]
                missing_candidates.append(cand)

    matched_list = sorted(matched_map.values(), key=lambda x: (x["rank"], x["name"]))
    missing_candidates = missing_candidates[:20]

    chronic_oos = [
        {
            "name": g["name"],
            "oosDays": int(g.get("oosDays") or 0),
            "ig": g.get("ig"),
        }
        for g in games
        if g.get("stock") == "out" and int(g.get("oosDays") or 0) >= 14
    ]

    if args.update_ranks:
        for g in games:
            name = g["name"]
            m = matched_map.get(name)
            if m:
                g["trendingRank"] = m["rank"]
                trend_pop = max(50, 100 - m["rank"])
            else:
                g.pop("trendingRank", None)
                trend_pop = 0

            anchor = ANCHOR_POPULARITY.get(name, 0)
            pop = max(anchor, trend_pop)
            if pop > 0:
                g["popularity"] = pop
            else:
                g.pop("popularity", None)

        write_catalog(games, updated_iso or today_iso)

    REPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
    report = {
        "date": today_iso,
        "sourcesCount": len(trending_items),
        "matchedTrending": matched_list,
        "missingCandidates": missing_candidates,
        "chronicOos": chronic_oos,
    }
    REPORT_FILE.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_path:
        lines = [
            f"## Découverte tendances ({today_iso})",
            f"- Tendances collectées : **{len(trending_items)}** | Matchées catalogue : **{len(matched_list)}**",
            f"- Ruptures chroniques (>=14j) : **{len(chronic_oos)}**",
            "",
            "### Top candidats absents du catalogue",
        ]
        for c in missing_candidates[:10]:
            p = f" ({c['price']} €)" if c.get("price") else ""
            lines.append(f"- {c['name']}{p} — `{c['source']}`")
        if chronic_oos:
            lines.extend(["", "### Ruptures prolongées"])
            for o in chronic_oos[:10]:
                lines.append(f"- {o['name']} ({o['oosDays']} j)")
        with open(summary_path, "a", encoding="utf-8") as fh:
            fh.write("\n".join(lines) + "\n")

    print(
        f"Discovery {today_iso}: collected={len(trending_items)}, "
        f"matched={len(matched_list)}, missing={len(missing_candidates)}, "
        f"chronic_oos={len(chronic_oos)} → {REPORT_FILE}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
