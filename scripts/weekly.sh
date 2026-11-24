#!/bin/zsh
# Entretien manuel (si tu veux forcer hors planning GitHub Actions)
# Automatique : .github/workflows/refresh-prices.yml (tous les jours 06:15 UTC)
set -e
cd "$(dirname "$0")/.."
echo "→ refresh prix/stock IG + Steam + historique…"
python3 scripts/refresh-ig-prices.py
echo "→ découverte tendances…"
python3 scripts/discover-games.py --update-ranks
echo "→ deploy…"
./deploy.sh
echo "✓ OK"
