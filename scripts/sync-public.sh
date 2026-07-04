#!/usr/bin/env bash
# Copy public assets into standalone without overwriting user uploads.
set -euo pipefail

mkdir -p public/uploads .next/standalone/public/uploads

shopt -s nullglob
for item in public/*; do
  name="$(basename "$item")"
  if [[ "$name" == "uploads" ]]; then
    continue
  fi
  rm -rf ".next/standalone/public/${name}"
  cp -r "$item" ".next/standalone/public/"
done
