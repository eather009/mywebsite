#!/usr/bin/env bash
# Deploy latest code to a Lightsail instance
# Usage: ./scripts/lightsail-deploy.sh [user@host] [ssh-key-path]
# Example: ./scripts/lightsail-deploy.sh ubuntu@3.112.0.0 ~/.ssh/LightsailDefaultKey.pem

set -euo pipefail

TARGET="${1:-ubuntu@YOUR_INSTANCE_IP}"
SSH_KEY="${2:-}"
APP_DIR="/var/www/eatherahmed"

SSH_OPTS=()
if [[ -n "$SSH_KEY" ]]; then
  SSH_OPTS=(-i "$SSH_KEY")
fi

echo "==> Deploying to $TARGET ..."

ssh "${SSH_OPTS[@]}" "$TARGET" bash -s <<EOF
set -euo pipefail
cd $APP_DIR

echo "==> Pulling latest code..."
git pull

echo "==> Installing dependencies..."
npm ci

echo "==> Running migrations..."
npm run db:deploy

echo "==> Building app..."
npm run build:prod

echo "==> Syncing standalone assets..."
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
mkdir -p .next/standalone/public/uploads public/uploads

echo "==> Restarting PM2..."
pm2 restart eatherahmed || pm2 start deploy/ecosystem.config.cjs
pm2 save

echo "==> Deploy complete."
EOF

echo "Done. Check https://eatherahmed.com"
