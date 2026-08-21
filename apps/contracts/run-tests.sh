#!/bin/bash
# Runs the Cairo test suite.
#
#   ./run-tests.sh                 # everything
#   ./run-tests.sh test_vesu_deposit   # one test, by exact name
#   ./run-tests.sh --sequential    # one at a time (see below)
#
# Fork tests need MAINNET_RPC_URL. Prefer a keyed endpoint: run in parallel
# against a free public node they hit rate limits and fail with
# "JsonRpc provider error: expected value at line 1", which reads like a
# contract failure but is not. --sequential proves it by running them one by one.
set -euo pipefail
cd "$(dirname "$0")"

# `source` rather than `export $(... | xargs)`: the latter word-splits on spaces
# and mangles any value containing '=' — such as an RPC URL with a query string.
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

if [ -z "${MAINNET_RPC_URL:-}" ]; then
  echo "Error: MAINNET_RPC_URL is not set. Copy .env.example to .env and fill it in." >&2
  exit 1
fi

if [ "${1:-}" = "--sequential" ]; then
  pass=0; fail=0
  while IFS= read -r t; do
    [ -z "$t" ] && continue
    if snforge test -e "$t" >/dev/null 2>&1; then
      echo "  PASS  $t"; pass=$((pass + 1))
    else
      echo "  FAIL  $t"; fail=$((fail + 1))
    fi
  done < <(grep -rh "fn test_" src --include="*.cairo" | sed -E 's/.*fn (test_[a-z0-9_]+).*/\1/' | sort -u)
  echo
  echo "$pass passed, $fail failed"
  [ "$fail" -eq 0 ]
else
  snforge test "$@"
fi
