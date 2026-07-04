#!/usr/bin/env bash
# One-shot setup for Ubuntu 24.04 LTS — MariaDB + Nginx + Node 20 + PM2
# Run on a fresh server after SSH login (4 GB RAM recommended).
#
# Usage:
#   export REPO=git@github-eather:eather009/mywebsite.git   # optional
#   bash scripts/setup-ubuntu-server.sh
#
# App directory: /var/www/eatherahmed

set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/eatherahmed}"
REPO="${REPO:-git@github-eather:eather009/mywebsite.git}"
DEPLOY_USER="${SUDO_USER:-${USER}}"

if [[ -d "${APP_DIR}/deploy" ]]; then
  cd "${APP_DIR}"
fi

echo "==> Ubuntu server setup (MariaDB + Nginx + Node 20 + PM2)"
echo "    App dir: ${APP_DIR}"
echo "    User:    ${DEPLOY_USER}"
echo ""

require_root() {
  if [[ "${EUID}" -ne 0 ]]; then
    echo "ERROR: re-run with sudo: sudo bash scripts/setup-ubuntu-server.sh"
    exit 1
  fi
}

require_root

echo "==> System packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y \
  git curl ca-certificates gnupg \
  nginx mariadb-server \
  ufw certbot python3-certbot-nginx

echo "==> MariaDB..."
systemctl enable mariadb
systemctl start mariadb

if [[ -f "${APP_DIR}/deploy/mariadb/99-portfolio.cnf" ]]; then
  cp "${APP_DIR}/deploy/mariadb/99-portfolio.cnf" /etc/mysql/mariadb.conf.d/99-portfolio.cnf
  systemctl restart mariadb
elif [[ -f deploy/mariadb/99-portfolio.cnf ]]; then
  cp deploy/mariadb/99-portfolio.cnf /etc/mysql/mariadb.conf.d/99-portfolio.cnf
  systemctl restart mariadb
fi

echo "==> Node.js 20..."
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "    node $(node -v)"
echo "    npm  $(npm -v)"

if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

echo "==> App directory ${APP_DIR}..."
mkdir -p "${APP_DIR}/public/uploads" "${APP_DIR}/logs"
chown -R "${DEPLOY_USER}:${DEPLOY_USER}" "${APP_DIR}"

echo "==> Nginx site..."
NGINX_CONF="/etc/nginx/sites-available/eatherahmed"
if [[ -f "${APP_DIR}/deploy/nginx/eatherahmed.conf" ]]; then
  cp "${APP_DIR}/deploy/nginx/eatherahmed.conf" "${NGINX_CONF}"
elif [[ -f deploy/nginx/eatherahmed.conf ]]; then
  cp deploy/nginx/eatherahmed.conf "${NGINX_CONF}"
else
  echo "ERROR: deploy/nginx/eatherahmed.conf not found — clone the repo into ${APP_DIR} first."
  exit 1
fi

ln -sf "${NGINX_CONF}" /etc/nginx/sites-enabled/eatherahmed
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl reload nginx

echo "==> Firewall (UFW)..."
ufw --force reset >/dev/null 2>&1 || true
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "==> PM2 startup on boot (run once after first deploy)..."
echo "    pm2 startup systemd -u ${DEPLOY_USER} --hp /home/${DEPLOY_USER}"
echo "    pm2 save"

echo ""
echo "=============================================="
echo " System setup complete."
echo "=============================================="
echo ""
echo "Next steps (as ${DEPLOY_USER}):"
echo ""
echo "  1. Clone app (if not already):"
echo "       cd ${APP_DIR}"
if [[ ! -f "${APP_DIR}/package.json" ]]; then
  echo "       git clone ${REPO} ."
fi
echo ""
echo "  2. Create database + user (generates password, updates .env):"
echo "       bash scripts/setup-database.sh"
echo ""
echo "  3. Configure environment (JWT, admin login, etc.):"
echo "       cp .env.production.example .env   # skip if setup-database created .env"
echo "       nano .env"
echo ""
echo "  4. First deploy:"
echo "       RUN_SEED=1 bash scripts/deploy.sh"
echo ""
echo "  5. HTTPS:"
echo "       sudo certbot --nginx -d eatherahmed.com -d www.eatherahmed.com"
echo ""
echo "Full guide: deploy/DEPLOY-UBUNTU.md"
