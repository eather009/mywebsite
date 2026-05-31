#!/usr/bin/env bash
# Run ON THE SERVER to find why eatherahmed.com is down
# Usage: bash scripts/diagnose-server.sh

set -uo pipefail

APP_DIR="${APP_DIR:-/var/www/eatherahmed}"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok() { echo -e "${GREEN}OK${NC}  $*"; }
warn() { echo -e "${YELLOW}WARN${NC}  $*"; }
fail() { echo -e "${RED}FAIL${NC}  $*"; }

echo "=== eatherahmed deploy diagnostics ==="
echo "App dir: $APP_DIR"
echo ""

# 1. Build artifacts
echo "--- 1. Build output ---"
if [[ -f "$APP_DIR/.next/standalone/server.js" ]]; then
  ok "standalone server.js exists"
else
  fail "missing $APP_DIR/.next/standalone/server.js — run: npm run build:prod"
fi
if [[ -d "$APP_DIR/.next/standalone/.next/static" ]]; then
  ok "standalone static assets copied"
else
  fail "missing .next/standalone/.next/static — run: npm run sync:standalone"
fi
if [[ -d "$APP_DIR/.next/standalone/public" ]]; then
  ok "standalone public folder exists"
else
  warn "missing .next/standalone/public — run: npm run sync:standalone"
fi
echo ""

# 2. Environment
echo "--- 2. Environment (.env) ---"
if [[ -f "$APP_DIR/.env" ]]; then
  ok ".env exists at app root"
  grep -q '^DATABASE_URL=' "$APP_DIR/.env" && ok "DATABASE_URL is set" || fail "DATABASE_URL missing in .env"
  grep -q '^JWT_SECRET=' "$APP_DIR/.env" && ok "JWT_SECRET is set" || fail "JWT_SECRET missing in .env"
else
  fail "no $APP_DIR/.env — copy from .env.production.example"
fi
echo ""

# 3. Node / npm
echo "--- 3. Node toolchain ---"
command -v node >/dev/null && ok "node $(node -v)" || fail "node not installed"
command -v npm >/dev/null && ok "npm $(npm -v)" || fail "npm not installed"
if [[ -x "$APP_DIR/node_modules/.bin/prisma" ]]; then
  ok "prisma CLI installed"
else
  fail "prisma not in node_modules — run: npm ci (do NOT use --omit=dev)"
fi
echo ""

# 4. Database
echo "--- 4. MariaDB ---"
if systemctl is-active --quiet mariadb 2>/dev/null || systemctl is-active --quiet mysqld 2>/dev/null; then
  ok "MariaDB/MySQL service running"
else
  fail "MariaDB not running — sudo systemctl start mariadb"
fi
if [[ -f "$APP_DIR/.env" ]]; then
  DB_URL=$(grep '^DATABASE_URL=' "$APP_DIR/.env" | cut -d= -f2- | tr -d '"')
  if [[ -n "$DB_URL" ]]; then
    cd "$APP_DIR" && npx prisma db execute --stdin <<< "SELECT 1;" >/dev/null 2>&1 \
      && ok "Prisma can connect to database" \
      || fail "Prisma cannot connect — check DATABASE_URL password and that migrations ran (npm run db:deploy)"
  fi
fi
echo ""

# 5. PM2
echo "--- 5. PM2 process ---"
if command -v pm2 >/dev/null; then
  pm2 describe eatherahmed >/dev/null 2>&1 && ok "PM2 app 'eatherahmed' registered" || fail "PM2 app not started — pm2 start deploy/ecosystem.config.cjs"
  pm2 jlist 2>/dev/null | grep -q '"status":"online"' && ok "PM2 reports online" || warn "PM2 app may be stopped/errored — run: pm2 logs eatherahmed --lines 30"
else
  fail "pm2 not installed"
fi
echo ""

# 6. Node listening
echo "--- 6. Port 3000 ---"
if curl -sf -o /dev/null -m 5 http://127.0.0.1:3000/; then
  ok "Node responds on http://127.0.0.1:3000"
elif curl -sf -o /dev/null -m 5 -I http://127.0.0.1:3000/; then
  ok "Node responds on http://127.0.0.1:3000 (headers only)"
else
  fail "nothing on port 3000 — check: pm2 logs eatherahmed"
  ss -tlnp 2>/dev/null | grep ':3000' || true
fi
echo ""

# 7. Apache proxy
echo "--- 7. Apache httpd ---"
if systemctl is-active --quiet httpd 2>/dev/null; then
  ok "httpd running"
else
  fail "httpd not running"
fi
if sudo httpd -M 2>/dev/null | grep -q proxy_http_module; then
  ok "mod_proxy_http loaded"
else
  fail "mod_proxy_http not loaded"
fi
if [[ -f /etc/httpd/conf.d/eatherahmed.conf ]]; then
  ok "eatherahmed.conf present"
  grep -q '127.0.0.1:3000' /etc/httpd/conf.d/eatherahmed.conf && ok "HTTP vhost proxies to :3000" || warn "HTTP vhost may not proxy to Node"
else
  fail "missing /etc/httpd/conf.d/eatherahmed.conf"
fi
if [[ -f /etc/httpd/conf.d/eatherahmed-le-ssl.conf ]]; then
  if grep -q '127.0.0.1:3000' /etc/httpd/conf.d/eatherahmed-le-ssl.conf; then
    ok "HTTPS vhost proxies to :3000"
  else
    fail "HTTPS vhost exists but NO ProxyPass to :3000 — this causes 503 on https://"
    echo "       Fix: add ProxyPass / http://127.0.0.1:3000/ to eatherahmed-le-ssl.conf"
  fi
else
  warn "no SSL vhost yet (HTTP only until certbot)"
fi
echo ""

# 8. SELinux (Amazon Linux)
echo "--- 8. SELinux ---"
if command -v getenforce >/dev/null 2>&1; then
  MODE=$(getenforce 2>/dev/null || echo "Unknown")
  echo "SELinux mode: $MODE"
  if [[ "$MODE" == "Enforcing" ]]; then
    if getsebool httpd_can_network_connect 2>/dev/null | grep -q ' on$'; then
      ok "httpd_can_network_connect enabled"
    else
      fail "SELinux blocking Apache→Node — run: sudo setsebool -P httpd_can_network_connect 1"
    fi
  fi
else
  echo "SELinux tools not found (skipped)"
fi
echo ""

echo "=== Recent PM2 logs (last 15 lines) ==="
pm2 logs eatherahmed --nostream --lines 15 2>/dev/null || true
echo ""
echo "=== Recent Apache errors ==="
sudo tail -5 /var/log/httpd/eatherahmed-error.log 2>/dev/null || sudo tail -5 /var/log/httpd/error_log 2>/dev/null || true
