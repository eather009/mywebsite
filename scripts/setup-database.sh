#!/usr/bin/env bash
# Create a fresh MariaDB/MySQL database and app user for eatherahmed.
# Safe on servers where MariaDB is already installed (drops/recreates the app user only).
#
# Usage (on server, from app directory):
#   cd /var/www/eatherahmed
#   bash scripts/setup-database.sh
#
# With custom names (optional):
#   DB_NAME=eatherahmed DB_USER=eatherahmed_app bash scripts/setup-database.sh
#
# With your own password:
#   DB_PASSWORD='MyStr0ngPass!' bash scripts/setup-database.sh
#
# If MariaDB root requires a password:
#   MYSQL_ROOT_PASSWORD='root-secret' bash scripts/setup-database.sh
#
# Env:
#   APP_DIR              — default /var/www/eatherahmed
#   DB_NAME              — default eatherahmed
#   DB_USER              — default eatherahmed_app
#   DB_PASSWORD          — auto-generated if unset (32 char alphanumeric)
#   CONNECTION_LIMIT     — default 10
#   UPDATE_ENV           — 1 (default) writes DATABASE_URL into .env
#   SKIP_TEST            — 1 skips connection test after create

set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/eatherahmed}"
DB_NAME="${DB_NAME:-portfolio}"
DB_USER="${DB_USER:-portfolio}"
DB_PASSWORD="${DB_PASSWORD:-AuVMiiv5kbdhMhXP7rL5}"
CONNECTION_LIMIT="${CONNECTION_LIMIT:-10}"
UPDATE_ENV="${UPDATE_ENV:-1}"
SKIP_TEST="${SKIP_TEST:-0}"

cd "$APP_DIR"

generate_password() {
  openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32
}

escape_sql() {
  printf "%s" "$1" | sed "s/'/''/g"
}

mysql_admin() {
  if [[ -n "${MYSQL_ROOT_PASSWORD:-}" ]]; then
    mysql -u root -p"${MYSQL_ROOT_PASSWORD}" "$@"
  elif mysql -u root -e "SELECT 1" >/dev/null 2>&1; then
    mysql -u root "$@"
  elif sudo mysql -e "SELECT 1" >/dev/null 2>&1; then
    sudo mysql "$@"
  else
    echo "ERROR: Cannot connect as MariaDB root."
    echo "       Ubuntu default: sudo mysql"
    echo "       Or set: MYSQL_ROOT_PASSWORD='...' bash scripts/setup-database.sh"
    exit 1
  fi
}

if [[ -z "${DB_PASSWORD:-}" ]]; then
  DB_PASSWORD="$(generate_password)"
  echo "==> Generated new DB password (saved to .db-credentials)"
else
  echo "==> Using DB_PASSWORD from environment"
fi

SQL_PASSWORD="$(escape_sql "$DB_PASSWORD")"

echo "==> Create database and user"
echo "    Database: ${DB_NAME}"
echo "    User:     ${DB_USER}@localhost"
echo ""

mysql_admin <<EOF
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

DROP USER IF EXISTS '${DB_USER}'@'localhost';
CREATE USER '${DB_USER}'@'localhost' IDENTIFIED BY '${SQL_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

DATABASE_URL="mysql://${DB_USER}:${DB_PASSWORD}@localhost:3306/${DB_NAME}?connection_limit=${CONNECTION_LIMIT}"

CREDENTIALS_FILE="${APP_DIR}/.db-credentials"
umask 077
cat > "${CREDENTIALS_FILE}" <<EOF
# Created $(date -u +"%Y-%m-%dT%H:%M:%SZ") — keep private, do not commit
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DATABASE_URL="${DATABASE_URL}"
EOF
chmod 600 "${CREDENTIALS_FILE}"

if [[ "$UPDATE_ENV" == "1" ]]; then
  echo "==> Update .env"
  if [[ ! -f "${APP_DIR}/.env" ]]; then
    if [[ -f "${APP_DIR}/.env.production.example" ]]; then
      cp "${APP_DIR}/.env.production.example" "${APP_DIR}/.env"
      echo "    Created .env from .env.production.example"
    else
      touch "${APP_DIR}/.env"
      echo "    Created empty .env"
    fi
  fi

  if grep -q '^DATABASE_URL=' "${APP_DIR}/.env"; then
    sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=\"${DATABASE_URL}\"|" "${APP_DIR}/.env"
    rm -f "${APP_DIR}/.env.bak"
  else
    echo "DATABASE_URL=\"${DATABASE_URL}\"" >> "${APP_DIR}/.env"
  fi
  echo "    DATABASE_URL written to .env"
fi

if [[ "$SKIP_TEST" != "1" ]]; then
  echo "==> Test connection..."
  mysql -u "${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" -e "SELECT 1 AS ok;" >/dev/null
  echo "    Connection OK"
fi

echo ""
echo "=============================================="
echo " Database ready"
echo "=============================================="
echo ""
echo "  Database:  ${DB_NAME}"
echo "  User:      ${DB_USER}"
echo "  Password:  ${DB_PASSWORD}"
echo ""
echo "  Saved to:  ${CREDENTIALS_FILE}"
if [[ "$UPDATE_ENV" == "1" ]]; then
  echo "  .env:      DATABASE_URL updated"
fi
echo ""
echo "Next:"
echo "  # Import old data (optional):"
echo "  mysql -u ${DB_USER} -p ${DB_NAME} < portfolio.sql"
echo ""
echo "  # First deploy:"
echo "  RUN_SEED=1 bash scripts/deploy.sh"
echo ""
