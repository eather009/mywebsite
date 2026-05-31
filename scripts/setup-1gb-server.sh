#!/usr/bin/env bash
# One-shot setup for 1 GB RAM Lightsail + local MariaDB + httpd + Node
# Run on the server as ec2-user after SSH login.
#
# Spec: 1 GB RAM, 2 vCPU, 40 GB SSD — eatherahmed.com portfolio + CMS
#
# Usage: bash scripts/setup-1gb-server.sh

set -euo pipefail

APP_DIR="/var/www/eatherahmed"
SWAP_MB=2048
REPO="${REPO:-git@github.com:eather009/mywebsite.git}"

if [[ -d "${APP_DIR}/deploy" ]]; then
  cd "${APP_DIR}"
fi

echo "==> 1 GB server setup (MariaDB + Node + PM2 + swap)"
echo ""

# --- Swap (required for npm build on 1 GB) ---
echo "==> Swap (${SWAP_MB} MB)..."
if ! swapon --show 2>/dev/null | grep -q /swapfile; then
  if [[ ! -f /swapfile ]]; then
    sudo dd if=/dev/zero of=/swapfile bs=1M count="${SWAP_MB}" status=none 2>/dev/null || \
      sudo dd if=/dev/zero of=/swapfile bs=1M count="${SWAP_MB}"
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
  fi
  sudo swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  echo "    Swap enabled"
else
  echo "    Swap already active"
fi

# Prefer swap under memory pressure, but not aggressively
if ! grep -q 'vm.swappiness' /etc/sysctl.conf 2>/dev/null; then
  echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
  sudo sysctl -w vm.swappiness=10
fi

# --- MariaDB ---
echo "==> MariaDB..."
if command -v dnf >/dev/null 2>&1; then
  sudo dnf install -y mariadb105-server mariadb105 2>/dev/null || sudo dnf install -y mariadb-server
else
  sudo yum install -y mariadb-server
fi

sudo systemctl enable mariadb
sudo systemctl start mariadb

if [[ -f "${APP_DIR}/deploy/mariadb/99-portfolio-lowmem.cnf" ]]; then
  sudo cp "${APP_DIR}/deploy/mariadb/99-portfolio-lowmem.cnf" /etc/my.cnf.d/99-portfolio-lowmem.cnf
elif [[ -f deploy/mariadb/99-portfolio-lowmem.cnf ]]; then
  sudo cp deploy/mariadb/99-portfolio-lowmem.cnf /etc/my.cnf.d/99-portfolio-lowmem.cnf
fi
sudo systemctl restart mariadb

# --- Node 20 + PM2 ---
echo "==> Node.js 20..."
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
  if command -v dnf >/dev/null 2>&1; then
    sudo dnf install -y nodejs
  else
    sudo yum install -y nodejs
  fi
fi
echo "    node $(node -v)"

if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi

# --- httpd ---
echo "==> Apache httpd..."
if command -v dnf >/dev/null 2>&1; then
  sudo dnf install -y httpd mod_ssl git 2>/dev/null || true
else
  sudo yum install -y httpd mod_ssl git 2>/dev/null || true
fi
sudo systemctl enable httpd
sudo systemctl start httpd

if ! sudo httpd -M 2>/dev/null | grep -q proxy_http_module; then
  echo "    WARNING: mod_proxy_http not loaded — check /etc/httpd/conf.modules.d/"
fi

# --- App directory ---
echo "==> App directory ${APP_DIR}..."
sudo mkdir -p "${APP_DIR}/public/uploads" "${APP_DIR}/logs"
sudo chown -R "${USER}:${USER}" "${APP_DIR}"

# --- SELinux (Amazon Linux) ---
if command -v setsebool >/dev/null 2>&1; then
  sudo setsebool -P httpd_can_network_connect 1 2>/dev/null || true
fi

echo ""
echo "=============================================="
echo " System setup complete."
echo "=============================================="
echo ""
echo "Next steps:"
echo ""
echo "  1. Create database (edit password in SQL file first):"
echo "       nano deploy/mariadb/init-portfolio.sql"
echo "       sudo mysql -u root -p < deploy/mariadb/init-portfolio.sql"
echo ""
echo "  2. Clone app (if not already):"
echo "       cd ${APP_DIR}"
echo "       git clone ${REPO} ."
echo ""
echo "  3. Configure environment:"
echo "       cp .env.production.example .env"
echo "       nano .env"
echo "       # STATIC_SITE=0"
echo "       # DATABASE_URL=mysql://portfolio:PASSWORD@localhost:3306/portfolio?connection_limit=5"
echo ""
echo "  4. Deploy (memory-safe build for 1 GB):"
echo "       bash scripts/deploy-1gb.sh"
echo ""
echo "  5. Apache vhost + HTTPS:"
echo "       sudo cp deploy/httpd/eatherahmed.conf /etc/httpd/conf.d/"
echo "       sudo apachectl configtest && sudo systemctl reload httpd"
echo "       sudo certbot --apache -d eatherahmed.com -d www.eatherahmed.com"
echo ""
echo "Full guide: deploy/DEPLOY-1GB.md"
