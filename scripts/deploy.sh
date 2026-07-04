#!/usr/bin/env bash
# Standard deploy for Ubuntu 24.04 (4 GB RAM) — MariaDB + Next.js CMS + Nginx + PM2
#
# Usage:
#   cd /var/www/eatherahmed
#   bash scripts/deploy.sh
#
# Env:
#   APP_DIR=/var/www/eatherahmed   — app root (default)
#   SKIP_NPM_CI=1                 — skip npm ci when package-lock.json unchanged
#   SKIP_GIT_PULL=1               — skip git pull
#   RUN_SEED=1                    — run prisma seed after migrate (first deploy)
#
# Static mode: set STATIC_SITE=1 in .env (skips database migrate)

set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/eatherahmed}"
cd "$APP_DIR"

export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=2048}"

echo "==> Deploy eatherahmed (Ubuntu / 4 GB)"
echo "    Directory: ${APP_DIR}"
echo "    Node heap: ${NODE_OPTIONS}"
free -h | head -2 || true
echo ""

if [[ -f .env ]] && grep -q '^STATIC_SITE=1' .env; then
  echo "==> Static mode — no database"
  STATIC=1
else
  STATIC=0
fi

lock_hash() {
  md5sum package-lock.json 2>/dev/null | awk '{print $1}' || shasum -a 256 package-lock.json | awk '{print $1}'
}

if [[ "${SKIP_GIT_PULL:-0}" != "1" ]]; then
  echo "==> Pull latest..."
  git pull
fi

echo "==> Reload PM2 app (graceful)..."
pm2 reload eatherahmed 2>/dev/null || pm2 stop eatherahmed 2>/dev/null || true

if [[ "${SKIP_NPM_CI:-0}" == "1" ]] && [[ -d node_modules ]] && [[ -f .deploy-lock-hash ]] && [[ "$(lock_hash)" == "$(cat .deploy-lock-hash)" ]]; then
  echo "==> Skip npm ci — package-lock.json unchanged"
else
  echo "==> npm ci..."
  rm -rf node_modules/.cache 2>/dev/null || true
  npm ci --no-audit --no-fund
  lock_hash > .deploy-lock-hash
fi

if [[ "$STATIC" -eq 0 ]]; then
  echo "==> Database migrate..."
  npm run db:deploy

  if [[ "${RUN_SEED:-0}" == "1" ]]; then
    echo "==> Database seed..."
    npm run db:seed
  fi
fi

echo "==> Build..."
if [[ "$STATIC" -eq 1 ]]; then
  npm run deploy:static
else
  npm run deploy:prod
fi

mkdir -p logs
bash scripts/ensure-uploads-dir.sh

echo "==> Start PM2..."
PM2_CONFIG="deploy/ecosystem.ubuntu.config.cjs"
if [[ ! -f "$PM2_CONFIG" ]]; then
  PM2_CONFIG="deploy/ecosystem.config.cjs"
fi

pm2 delete eatherahmed 2>/dev/null || true
pm2 start "$PM2_CONFIG"
pm2 save

echo "==> Verify Node..."
sleep 2
if curl -sf -I http://127.0.0.1:3000/ | head -3; then
  echo ""
  echo "Deploy complete — app responding on :3000"
else
  echo ""
  echo "WARN: Node not responding — check: pm2 logs eatherahmed --lines 40"
  exit 1
fi

if systemctl is-active --quiet nginx 2>/dev/null; then
  echo "==> Nginx: active"
else
  echo "WARN: nginx not running — sudo systemctl start nginx"
fi

echo ""
free -h | head -2 || true
