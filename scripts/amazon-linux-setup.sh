#!/usr/bin/env bash
# Amazon Linux setup: MariaDB + Node 20 + PM2 (existing httpd server)
# Run as ec2-user on the server

set -euo pipefail

echo "==> Installing MariaDB..."
if command -v dnf >/dev/null 2>&1; then
  sudo dnf install -y mariadb105-server mariadb105 || sudo dnf install -y mariadb-server
else
  sudo yum install -y mariadb-server
fi

sudo systemctl enable mariadb
sudo systemctl start mariadb

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

echo "==> Optional: 2GB swap for npm build..."
if ! swapon --show 2>/dev/null | grep -q /swapfile; then
  sudo dd if=/dev/zero of=/swapfile bs=1M count=2048 status=progress || true
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo ""
echo "MariaDB is running. Create the database:"
echo "  sudo mysql -u root -p"
echo "  CREATE DATABASE portfolio;"
echo "  CREATE USER 'portfolio'@'localhost' IDENTIFIED BY 'your-password';"
echo "  GRANT ALL ON portfolio.* TO 'portfolio'@'localhost';"
echo "  FLUSH PRIVILEGES;"
echo ""
echo "Then deploy the app — see docs/DEPLOY-APACHE-EXISTING-SERVER.md"
