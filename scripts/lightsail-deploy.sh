#!/usr/bin/env bash
# Deploy latest code to a Lightsail instance (Amazon Linux)
# Usage: ./scripts/lightsail-deploy.sh [user@host] [ssh-key-path]
# Example: ./scripts/lightsail-deploy.sh ec2-user@3.112.0.0 ~/.ssh/LightsailDefaultKey.pem

set -euo pipefail

TARGET="${1:-ec2-user@YOUR_INSTANCE_IP}"
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

echo "==> Building app (low-memory)..."
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=512}"
pm2 stop eatherahmed 2>/dev/null || true

if [[ -f .env ]] && grep -q '^STATIC_SITE=1' .env; then
  npm run deploy:static:lowmem
else
  npm run deploy:prod:lowmem
fi

echo "==> Syncing standalone assets..."
npm run sync:standalone
mkdir -p logs

echo "==> Restarting PM2..."
pm2 delete eatherahmed 2>/dev/null || true
pm2 start deploy/ecosystem.config.cjs
pm2 save

echo "==> Deploy complete."
EOF

echo "Done. Check https://eatherahmed.com"
