#!/usr/bin/env bash
# Run on the server to diagnose 503 Service Unavailable
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/eatherahmed}"
cd "$APP_DIR"

echo "=== 1. Node app on port 3000 ==="
if curl -sf -o /dev/null -m 3 http://127.0.0.1:3000/; then
  echo "OK — Next.js responds on :3000"
else
  echo "FAIL — nothing on http://127.0.0.1:3000"
  echo "       Fix: build + start PM2 (steps below)"
fi

echo ""
echo "=== 2. PM2 status ==="
pm2 status 2>/dev/null || echo "PM2 not running or not installed"

echo ""
echo "=== 3. Standalone build exists? ==="
if [[ -f .next/standalone/server.js ]]; then
  echo "OK — .next/standalone/server.js"
else
  echo "FAIL — run: npm run build:prod"
fi

echo ""
echo "=== 4. .env file ==="
if [[ -f .env ]]; then
  echo "OK — .env exists"
  grep -q DATABASE_URL .env && echo "OK — DATABASE_URL set" || echo "WARN — DATABASE_URL missing"
else
  echo "FAIL — copy .env.production.example to .env"
fi

echo ""
echo "=== 5. SELinux (common 503 cause on Amazon Linux) ==="
if command -v getenforce >/dev/null 2>&1; then
  echo "SELinux: $(getenforce)"
  if getsebool httpd_can_network_connect 2>/dev/null | grep -q "on"; then
    echo "OK — httpd_can_network_connect is on"
  else
    echo "FAIL — run: sudo setsebool -P httpd_can_network_connect 1"
  fi
else
  echo "SELinux not present"
fi

echo ""
echo "=== 6. Apache proxy modules ==="
httpd -M 2>/dev/null | grep -E "proxy_module|proxy_http" || sudo httpd -M 2>/dev/null | grep -E "proxy_module|proxy_http"

echo ""
echo "=== 7. Recent Apache errors (eatherahmed) ==="
sudo tail -5 /var/log/httpd/eatherahmed-error.log 2>/dev/null || \
sudo tail -5 /var/log/httpd/eatherahmed-ssl-error.log 2>/dev/null || \
sudo tail -5 /var/log/httpd/error_log 2>/dev/null || true

echo ""
echo "=== 8. Recent PM2 logs ==="
pm2 logs eatherahmed --lines 10 --nostream 2>/dev/null || true

echo ""
echo "=== Quick fix (if app not running) ==="
echo "  cd $APP_DIR"
echo "  npm ci && npm run db:deploy && npm run build:prod"
echo "  cp -r public .next/standalone/public"
echo "  cp -r .next/static .next/standalone/.next/static"
echo "  cp .env .next/standalone/.env"
echo "  mkdir -p logs public/uploads"
echo "  pm2 delete eatherahmed 2>/dev/null; pm2 start deploy/ecosystem.config.cjs"
echo "  pm2 save"
echo "  sudo setsebool -P httpd_can_network_connect 1"
echo "  curl -I http://127.0.0.1:3000"
