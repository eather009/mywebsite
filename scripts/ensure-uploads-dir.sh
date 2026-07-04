#!/usr/bin/env bash
# Ensure persistent uploads dir + symlink from standalone public/uploads.
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/eatherahmed}"
UPLOADS="${APP_DIR}/public/uploads"
STANDALONE_UPLOADS="${APP_DIR}/.next/standalone/public/uploads"

mkdir -p "$UPLOADS"

# Writable by deploy user; readable by nginx (www-data)
if id www-data >/dev/null 2>&1; then
  chown -R "${USER}:www-data" "$UPLOADS" 2>/dev/null || true
  chmod 775 "$UPLOADS"
else
  chmod 755 "$UPLOADS"
fi

# Migrate any files stuck in standalone folder (real dir, not symlink)
if [[ -d "$STANDALONE_UPLOADS" && ! -L "$STANDALONE_UPLOADS" ]]; then
  shopt -s nullglob
  for f in "$STANDALONE_UPLOADS"/*; do
    [[ -f "$f" ]] || continue
    base="$(basename "$f")"
    if [[ ! -f "${UPLOADS}/${base}" ]]; then
      mv "$f" "${UPLOADS}/"
      echo "    migrated ${base}"
    fi
  done
  rm -rf "$STANDALONE_UPLOADS"
fi

mkdir -p "${APP_DIR}/.next/standalone/public"
ln -sfn "$UPLOADS" "$STANDALONE_UPLOADS"

echo "==> Uploads: ${UPLOADS} (symlinked from standalone)"
