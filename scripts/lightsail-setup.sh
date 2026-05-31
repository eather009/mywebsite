#!/usr/bin/env bash
# First-time Lightsail setup — Amazon Linux (ec2-user)
# Installs Node 20, httpd, certbot, PM2

set -euo pipefail

echo "==> Installing system packages (Amazon Linux)..."
if command -v dnf >/dev/null 2>&1; then
  sudo dnf install -y git httpd mod_ssl
  sudo dnf install -y certbot python3-certbot-apache || true
else
  sudo yum install -y git httpd mod_ssl
  sudo yum install -y certbot python3-certbot-apache || true
fi

sudo systemctl enable httpd
sudo systemctl start httpd

echo "==> Installing Node.js 20..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
if command -v dnf >/dev/null 2>&1; then
  sudo dnf install -y nodejs
else
  sudo yum install -y nodejs
fi

echo "==> Installing PM2..."
sudo npm install -g pm2

echo "==> Checking Apache proxy modules..."
if ! sudo httpd -M 2>/dev/null | grep -q proxy_module; then
  echo "WARNING: mod_proxy not loaded. Check /etc/httpd/conf.modules.d/"
fi

echo "==> Preparing app directory..."
sudo mkdir -p /var/www/eatherahmed/public/uploads
sudo chown -R "$USER:$USER" /var/www/eatherahmed

echo "==> Optional: 2GB swap for npm build..."
if ! swapon --show 2>/dev/null | grep -q /swapfile; then
  sudo dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress 2>/dev/null || \
    sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo ""
echo "Setup complete (Amazon Linux + httpd). Next steps:"
echo "  1 GB instance? Run: bash scripts/setup-1gb-server.sh  (see deploy/DEPLOY-1GB.md)"
echo "  1. Clone repo: cd /var/www/eatherahmed && git clone git@github.com:eather009/mywebsite.git ."
echo "  2. cp .env.production.example .env && nano .env"
echo "  3. sudo mysql -u root -p < deploy/mariadb/init-portfolio.sql"
echo "  4. bash scripts/deploy-1gb.sh"
echo "  5. pm2 save && pm2 startup"
echo "  6. sudo cp deploy/httpd/eatherahmed.conf /etc/httpd/conf.d/eatherahmed.conf"
echo "  7. sudo apachectl configtest && sudo systemctl reload httpd"
echo "  8. sudo certbot --apache -d eatherahmed.com -d www.eatherahmed.com"
echo ""
echo "See deploy/DEPLOY-1GB.md (1 GB + MariaDB) or docs/DEPLOY-APACHE-EXISTING-SERVER.md"
