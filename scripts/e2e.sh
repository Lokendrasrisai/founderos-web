#!/usr/bin/env bash
# Builds the site in each content/contact mode and runs the Playwright suite against it.
#   bash scripts/e2e.sh                 # all modes
#   bash scripts/e2e.sh preview         # one mode
set -euo pipefail
cd "$(dirname "$0")/.."

modes=("${@:-production preview form}")
# shellcheck disable=SC2206
modes=(${modes[@]})

run_mode() {
  local m="$1"
  echo "━━━ E2E mode: $m ━━━"
  case "$m" in
    production)
      env -u FOUNDEROS_DEMO_CONTENT npx next build >/dev/null
      E2E_MODE=production npx playwright test ;;
    preview)
      FOUNDEROS_DEMO_CONTENT=true npx next build >/dev/null
      FOUNDEROS_DEMO_CONTENT=true E2E_MODE=preview npx playwright test ;;
    form)
      # Test-only values. Delivery is pointed at a local mock provider started by contact.spec.ts.
      export RESEND_API_KEY=test-key CONTACT_TO_EMAIL=team@example.com CONTACT_FROM_EMAIL=site@example.com
      export RESEND_API_BASE=http://127.0.0.1:4010
      npx next build >/dev/null
      E2E_MODE=form npx playwright test ;;
    *) echo "unknown mode $m"; exit 1 ;;
  esac
}

for m in "${modes[@]}"; do run_mode "$m"; done
