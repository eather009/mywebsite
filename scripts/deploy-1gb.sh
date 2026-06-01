#!/usr/bin/env bash
# Memory-safe deploy for 1 GB RAM server (MariaDB + Next.js CMS)
# Stops PM2 + MariaDB before npm ci/build to avoid OOM kills.
#
# Usage: bash scripts/deploy-1gb.sh
# Env:   STATIC_SITE=1 in .env to skip database steps
# Env:   SKIP_NPM_CI=1 to skip install when package-lock.json unchanged

set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/eatherahmed}"
cd "$APP_DIR"

export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=512}"
export npm_config_jobs="${npm_config_jobs:-1}"
export npm_config_maxsockets="${npm_config_maxsockets:-1}"

echo "==> Deploy on 1 GB instance"
echo "    NODE_OPTIONS=${NODE_OPTIONS}"
echo "    npm jobs=${npm_config_jobs}"
free -h | head -2 || true

if [[ -f .env ]] && grep -q '^STATIC_SITE=1' .env; then
  echo "==> Static mode — no MariaDB"
  STATIC=1
else
  STATIC=0
fi

ensure_swap() {
  if swapon --show 2>/dev/null | grep -q /swapfile; then
    echo "==> Swap: OK"
    return 0
  fi
  echo "ERROR: No swap — npm ci will OOM on 1 GB RAM."
  echo "Run: bash scripts/setup-1gb-server.sh"
  echo "Or:  sudo dd if=/dev/zero of=/swapfile bs=1M count=2048 && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile"
  exit 1
}

stop_services() {
  echo "==> Stopping services to free RAM..."
  pm2 stop eatherahmed 2>/dev/null || true
  if [[ "$STATIC" -eq 0 ]]; then
    sudo systemctl stop mariadb 2>/dev/null || true
  fi
  sync 2>/dev/null || true
  free -h | head -2 || true
}

start_mariadb() {
  if [[ "$STATIC" -eq 0 ]]; then
    echo "==> Starting MariaDB..."
    sudo systemctl start mariadb
  fi
}

lock_hash() {
  md5sum package-lock.json 2>/dev/null | awk '{print $1}' || shasum -a 256 package-lock.json | awk '{print $1}'
}

lowmem_npm_ci() {
  echo "==> npm ci (single job, low memory)..."
  rm -rf node_modules/.cache 2>/dev/null || true
  npm ci --no-audit --no-fund --prefer-offline
  lock_hash > .deploy-lock-hash
}

ensure_swap

echo "==> Pull latest..."
git pull

stop_services

if [[ "${SKIP_NPM_CI:-0}" == "1" ]] && [[ -d node_modules ]] && [[ -f .deploy-lock-hash ]] && [[ "$(lock_hash)" == "$(cat .deploy-lock-hash)" ]]; then
  echo "==> Skip npm ci — package-lock.json unchanged"
else
  lowmem_npm_ci
fi

start_mariadb

if [[ "$STATIC" -eq 0 ]]; then
  echo "==> Database migrate..."
  npm run db:deploy
fi

echo "==> Build..."
if [[ "$STATIC" -eq 1 ]]; then
  npm run deploy:static:lowmem
else
  npm run deploy:prod:lowmem
fi

start_mariadb

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
echo "Deploy complete."
free -h | head -2 || true
