#!/usr/bin/env bash
# Memory-safe deploy for 1 GB RAM server (MariaDB + Next.js CMS)
# Stops Node during build to free RAM, uses capped Node heap.
#
# Usage: bash scripts/deploy-1gb.sh
# Env:   STATIC_SITE=1 in .env to skip database steps

set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/eatherahmed}"
cd "$APP_DIR"

export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=512}"

echo "==> Deploy on 1 GB instance (NODE_OPTIONS=${NODE_OPTIONS})"

if [[ -f .env ]] && grep -q '^STATIC_SITE=1' .env; then
  echo "==> Static mode — no MariaDB"
  STATIC=1
else
  STATIC=0
fi

echo "==> Pull latest..."
git pull

echo "==> Install dependencies..."
npm ci

if [[ "$STATIC" -eq 0 ]]; then
  echo "==> Database migrate..."
  npm run db:deploy
fi

echo "==> Stop Node to free RAM for build..."
pm2 stop eatherahmed 2>/dev/null || true

echo "==> Build..."
if [[ "$STATIC" -eq 1 ]]; then
  npm run deploy:static:lowmem
else
  npm run deploy:prod:lowmem
fi

mkdir -p logs public/uploads

echo "==> Start PM2..."
pm2 delete eatherahmed 2>/dev/null || true
pm2 start deploy/ecosystem.config.cjs
pm2 save

echo "==> Verify..."
sleep 2
curl -sf -I http://127.0.0.1:3000/ | head -3 || {
  echo "WARN: Node not responding — check: pm2 logs eatherahmed"
  exit 1
}

echo ""
echo "Deploy complete. Reload Apache if needed:"
echo "  sudo systemctl reload httpd"
