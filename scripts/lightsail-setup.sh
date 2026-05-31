#!/usr/bin/env bash
# First-time Lightsail Ubuntu setup for eatherahmed.com
# Run on the server as ubuntu user (some steps use sudo)

set -euo pipefail

echo "==> Installing system packages..."
sudo apt-get update
sudo apt-get install -y curl git nginx certbot python3-certbot-nginx

echo "==> Installing Node.js 20..."
if ! command -v node >/dev/null || [[ "$(node -v)" != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

echo "==> Installing PM2..."
sudo npm install -g pm2

echo "==> Preparing app directory..."
sudo mkdir -p /var/www/eatherahmed/public/uploads
sudo chown -R "$USER:$USER" /var/www/eatherahmed

echo "==> Optional: add 2GB swap if RAM is tight..."
if ! swapon --show | grep -q /swapfile; then
  sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo ""
echo "Setup complete. Next steps:"
echo "  1. Clone repo into /var/www/eatherahmed"
echo "  2. cp .env.production.example .env && nano .env"
echo "  3. npm ci && npm run db:deploy && npm run db:seed && npm run build:prod"
echo "  4. cp -r public .next/standalone/public && cp -r .next/static .next/standalone/.next/static"
echo "  5. pm2 start deploy/ecosystem.config.cjs && pm2 save && pm2 startup"
echo "  6. sudo cp deploy/nginx/eatherahmed.conf /etc/nginx/sites-available/eatherahmed"
echo "  7. sudo ln -sf /etc/nginx/sites-available/eatherahmed /etc/nginx/sites-enabled/"
echo "  8. sudo nginx -t && sudo systemctl reload nginx"
echo "  9. sudo certbot --nginx -d eatherahmed.com -d www.eatherahmed.com"
echo ""
echo "See docs/DEPLOY-LIGHTSAIL.md for full details."
