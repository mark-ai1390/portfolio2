#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "==> Portfolio: $PWD"
node -e 'const [major, minor] = process.versions.node.split(".").map(Number); if (major < 22 || (major === 22 && minor < 12)) { console.error("Node.js >=22.12.0 required"); process.exit(1); }'
npm ci --no-audit --no-fund

# Use an explicit browser, installed system Chromium, or Playwright's pinned browser.
if [ -z "${PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH:-}" ]; then
  if command -v chromium >/dev/null 2>&1; then
    export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="$(command -v chromium)"
  else
    npx playwright install chromium
  fi
fi

npm run build
npm test

if [ "${RUN_START_COMMAND:-0}" = "1" ]; then
  exec npm run dev -- --port "${PORT:-5173}" --strictPort
fi
echo "Verified. Start: RUN_START_COMMAND=1 ./init.sh (default port 5173)"
