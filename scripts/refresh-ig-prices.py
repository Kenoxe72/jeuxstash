#!/usr/bin/env python3
"""Rafraîchit prix/stock Instant Gaming, prix officiels Steam et historique dans js/catalog.js."""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
import datetime
import json
from pathlib import Path
import re
import subprocess
import sys
import time
import unicodedata
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "js" / "catalog.js"
HISTORY_FILE = ROOT / "data" / "price-history.json"
UA = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

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


def slugify(name: str) -> str:
    s = unicodedata.normalize("NFD", str(name or "").lower())
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


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


def fetch(url: str, timeout: int = 25) -> str:
    req = urllib.request.Request(
        url, headers={"User-Agent": UA, "Accept-Language": "fr-FR,fr;q=0.9"}
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode("utf-8", "ignore")


def scrape_ig(url: str) -> tuple[float | None, str]:
    html = fetch(url)
    avail = re.search(r'itemprop="availability"\s+content="([^"]+)"', html)
    price = re.search(r'itemprop="price"\s+content="([0-9.]+)"', html)
    if not price:
        price = re.search(r'data-price-eur="([0-9.]+)"', html)
    if not price:
        price = re.search(r'data-price="([0-9.]+)"', html)
    stock = "ok"
    if avail:
        a = avail.group(1).lower()
        if "outofstock" in a or "out_of_stock" in a:
            stock = "out"
    elif re.search(r"Hors stock|out-of-stock", html, re.I):
        stock = "out"
    p = float(price.group(1)) if price else None
    if p == 0:
        p = None
    return p, stock


def scrape_with_retry(url: str) -> tuple[float | None, str]:
    time.sleep(0.25)
    try:
        return scrape_ig(url)
    except Exception:
        time.sleep(1.2)
        return scrape_ig(url)


def fetch_steam_prices(appids: list[int]) -> dict[int, tuple[float, float | None]]:
    """Retourne {appid: (initial_eur, sale_eur_or_none)} via l'API publique Steam."""
    result: dict[int, tuple[float, float | None]] = {}
    unique_ids = sorted(set(appids))
    batch_size = 30
    for i in range(0, len(unique_ids), batch_size):
        chunk = unique_ids[i : i + batch_size]
        ids_str = ",".join(str(x) for x in chunk)
        url = (
            f"https://store.steampowered.com/api/appdetails"
            f"?appids={ids_str}&cc=fr&filters=price_overview"
        )
        try:
            payload = json.loads(fetch(url, timeout=20))
            if not isinstance(payload, dict):
                continue
            for sid, info in payload.items():
                if not isinstance(info, dict) or not info.get("success"):
                    continue
                data = info.get("data")
                if not isinstance(data, dict):
                    continue
                po = data.get("price_overview")
                if not isinstance(po, dict):
                    continue
                initial_cents = po.get("initial") or 0
                final_cents = po.get("final") or 0
                if initial_cents > 0:
                    initial = round(initial_cents / 100.0, 2)
                    sale = (
                        round(final_cents / 100.0, 2)
                        if 0 < final_cents < initial_cents
                        else None
                    )
                    result[int(sid)] = (initial, sale)
        except Exception as e:
            print(f"WARN Steam batch {chunk[0]}..: {e}")
        time.sleep(0.3)
    return result


def load_history() -> dict[str, dict]:
    if not HISTORY_FILE.exists():
        return {}
    try:
        data = json.loads(HISTORY_FILE.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def save_history(history_data: dict[str, dict]) -> None:
    HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    HISTORY_FILE.write_text(
        json.dumps(history_data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def apply_history_metrics(
    game: dict,
    entry: dict,
    today_iso: str,
    price: float | None,
    stock: str,
) -> tuple[dict, bool, bool]:
    """Met à jour l'entrée d'historique et attache low/dropPct/isLow/oosDays sur game."""
    hist: list[list] = [
        [str(d), float(p)]
        for d, p in (entry.get("history") or [])
        if isinstance(d, str) and isinstance(p, (int, float)) and p > 0
    ]
    prev_oos = int(entry.get("oosDays") or 0)
    oos_days = (prev_oos + 1) if stock == "out" else 0

    if price is not None and price > 0:
        if hist and hist[-1][0] == today_iso:
            hist[-1][1] = price
        else:
            hist.append([today_iso, price])
        hist = hist[-90:]

    low = round(min(p for _, p in hist), 2) if hist else None
    drop_pct = 0
    if price is not None and price > 0 and len(hist) >= 2:
        prev_price = hist[-2][1]
        if prev_price > 0 and price < prev_price:
            drop_pct = round(((prev_price - price) / prev_price) * 100)

    is_low = bool(
        price is not None
        and low is not None
        and stock == "ok"
        and len(hist) >= 2
        and price <= low
    )

    if low is not None:
        game["low"] = low
    else:
        game.pop("low", None)

    if drop_pct >= 5 and stock == "ok":
        game["dropPct"] = drop_pct
    else:
        game.pop("dropPct", None)

    if is_low:
        game["isLow"] = True
    else:
        game.pop("isLow", None)

    if oos_days >= 3:
        game["oosDays"] = oos_days
    else:
        game.pop("oosDays", None)

    new_entry = {"history": hist, "low": low, "oosDays": oos_days}
    return new_entry, drop_pct >= 5 and stock == "ok", is_low


def main() -> int:
    ap = argparse.ArgumentParser(description="Rafraîchir prix IG, Steam et historique")
    ap.add_argument("--limit", type=int, default=0, help="Limiter le scraping IG aux N premiers jeux")
    ap.add_argument("--workers", type=int, default=4, help="Nb de workers parallèles pour IG")
    ap.add_argument("--no-steam", action="store_true", help="Ignorer la mise à jour des prix Steam")
    args = ap.parse_args()

    games, _ = load_catalog()
    today_iso = datetime.date.today().isoformat()
    history_data = load_history()

    # Transition automatique Préco -> Sorti dès que la date de sortie est atteinte
    for g in games:
        rel = str(g.get("release") or "").strip()
        if re.match(r"^\d{4}-\d{2}-\d{2}$", rel) and rel <= today_iso:
            cats = [c for c in (g.get("cats") or []) if c != "coming"]
            g["cats"] = cats or ["hot", "action"]
            if g.get("tag") == "Préco":
                g["tag"] = "Action"
            g.pop("release", None)

    targets = [idx for idx, g in enumerate(games) if g.get("ig")]
    if args.limit and args.limit > 0:
        targets = targets[: args.limit]

    ok_count = 0
    oos_count = 0
    fail_count = 0
    drops_count = 0
    lows_count = 0

    results: dict[int, tuple[float | None, str] | Exception] = {}
    workers = max(1, min(args.workers, 8))
    with ThreadPoolExecutor(max_workers=workers) as ex:
        fut_map = {ex.submit(scrape_with_retry, games[idx]["ig"]): idx for idx in targets}
        for fut in as_completed(fut_map):
            idx = fut_map[fut]
            try:
                results[idx] = fut.result()
            except Exception as e:
                results[idx] = e

    for idx in targets:
        g = games[idx]
        res = results.get(idx)
        if isinstance(res, Exception):
            fail_count += 1
            print(f"FAIL {g['name']}: {res} (keep previous)")
            continue
        price, stock = res
        g["price"] = price
        g["stock"] = stock
        if stock == "ok":
            ok_count += 1
        else:
            oos_count += 1
        slug = slugify(g["name"])
        new_entry, dropped, is_low = apply_history_metrics(
            g, history_data.get(slug, {}), today_iso, price, stock
        )
        history_data[slug] = new_entry
        if dropped:
            drops_count += 1
        if is_low:
            lows_count += 1
        print(f"{g['name']}: {price} [{stock}]")

    attempted = len(targets)
    if attempted > 0 and (
        fail_count == attempted or (attempted >= 10 and fail_count / attempted > 0.5)
    ):
        print(
            f"ABORT: trop d'échecs IG ({fail_count}/{attempted}), catalogue non écrasé.",
            file=sys.stderr,
        )
        return 1

    steam_updated = 0
    if not args.no_steam:
        steam_targets = (
            [games[idx] for idx in targets if isinstance(games[idx].get("steam"), int)]
            if args.limit and args.limit > 0
            else [g for g in games if isinstance(g.get("steam"), int)]
        )
        appids = [int(g["steam"]) for g in steam_targets]
        if appids:
            steam_prices = fetch_steam_prices(appids)
            for g in steam_targets:
                appid = int(g["steam"])
                if appid in steam_prices:
                    initial, sale = steam_prices[appid]
                    g["store"] = initial
                    if sale is not None:
                        g["steamPrice"] = sale
                    else:
                        g.pop("steamPrice", None)
                    steam_updated += 1

    save_history(history_data)
    write_catalog(games, today_iso)
    print(
        f"Summary: {len(games)} total | IG scraped={attempted} "
        f"(ok={ok_count}, out={oos_count}, fail={fail_count}) | "
        f"drops={drops_count}, lows={lows_count} | steam_store_updated={steam_updated}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
