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

echo "==> Applying MariaDB low-memory config (1 GB instances)..."
LOWMEM_CNF=""
if [[ -f /var/www/eatherahmed/deploy/mariadb/99-portfolio-lowmem.cnf ]]; then
  LOWMEM_CNF="/var/www/eatherahmed/deploy/mariadb/99-portfolio-lowmem.cnf"
elif [[ -f deploy/mariadb/99-portfolio-lowmem.cnf ]]; then
  LOWMEM_CNF="deploy/mariadb/99-portfolio-lowmem.cnf"
fi
if [[ -n "$LOWMEM_CNF" ]]; then
  sudo cp "$LOWMEM_CNF" /etc/my.cnf.d/99-portfolio-lowmem.cnf
  sudo systemctl restart mariadb
fi

echo ""
echo "MariaDB is running. Create the database:"
echo "  nano deploy/mariadb/init-portfolio.sql   # set password"
echo "  sudo mysql -u root -p < deploy/mariadb/init-portfolio.sql"
echo ""
echo "For 1 GB Lightsail: bash scripts/setup-1gb-server.sh && deploy/DEPLOY-1GB.md"
