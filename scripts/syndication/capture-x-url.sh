#!/usr/bin/env bash
# capture-x-url.sh — post-hoc capture of a manually posted X thread URL.
#
# Called after Nick posts a thread on X. Reads the URL from
# plans/phase-12-evidence/day-$N/x-url.txt and UPSERTs the real URL onto the
# existing "skipped / manual_channel" row in syndication_log, flipping its
# status to "posted". See phase-A1-code-blockers.md B1.2 "X-row cascade fix".
#
# Usage:
#   scripts/syndication/capture-x-url.sh day-NN
#
# Env:
#   SUPABASE_URL, SUPABASE_SERVICE_KEY   required (PostgREST endpoint)

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "usage: $0 day-NN" >&2
  exit 2
fi

SLUG_PREFIX="$1"
if [[ ! "$SLUG_PREFIX" =~ ^day-[0-9]{2}$ ]]; then
  echo "error: first argument must be day-NN (got: $SLUG_PREFIX)" >&2
  exit 2
fi

: "${SUPABASE_URL:?SUPABASE_URL is required}"
: "${SUPABASE_SERVICE_KEY:?SUPABASE_SERVICE_KEY is required}"

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
EVIDENCE_FILE="${REPO_ROOT}/plans/phase-12-evidence/${SLUG_PREFIX}/x-url.txt"

if [[ ! -f "$EVIDENCE_FILE" ]]; then
  echo "error: missing evidence file: $EVIDENCE_FILE" >&2
  exit 1
fi

X_URL="$(head -n 1 "$EVIDENCE_FILE" | tr -d '[:space:]')"
if [[ -z "$X_URL" ]]; then
  echo "error: $EVIDENCE_FILE is empty" >&2
  exit 1
fi

if [[ ! "$X_URL" =~ ^https://(twitter\.com|x\.com)/ ]]; then
  echo "error: unexpected URL shape: $X_URL" >&2
  exit 1
fi

POSTED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
PAYLOAD="$(cat <<JSON
{
  "response_url": "${X_URL}",
  "status": "posted",
  "posted_at": "${POSTED_AT}",
  "error_message": null
}
JSON
)"

ENDPOINT="${SUPABASE_URL%/}/rest/v1/syndication_log?slug=eq.${SLUG_PREFIX}&channel=eq.x_thread"

HTTP_STATUS="$(curl -sS -o /tmp/capture-x-response.json -w '%{http_code}' \
  -X PATCH "$ENDPOINT" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  --data-raw "$PAYLOAD")"

if [[ "$HTTP_STATUS" != "200" ]]; then
  echo "error: Supabase PATCH returned HTTP $HTTP_STATUS" >&2
  cat /tmp/capture-x-response.json >&2 || true
  exit 1
fi

ROWS="$(grep -c '"slug"' /tmp/capture-x-response.json || true)"
if [[ "$ROWS" -eq 0 ]]; then
  echo "error: no row matched slug=${SLUG_PREFIX} channel=x_thread — runner must INSERT the skipped row first" >&2
  exit 1
fi

echo "captured ${SLUG_PREFIX} x_thread → ${X_URL}"
