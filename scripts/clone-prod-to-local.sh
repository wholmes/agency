#!/bin/sh
# One-time (or repeat) copy of production Postgres into local Docker.
#   export PROD_DATABASE_URL='...'   # Neon: use direct (unpooled) URL, not -pooler
#   npm run db:clone-prod:local
#
# Fails at pg_dump on network/URL — nothing is written to production.
set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"
export PATH="${PWD}/node_modules/.bin:${PATH}"

if [ -z "${PROD_DATABASE_URL}" ]; then
  echo "Set PROD_DATABASE_URL to your production Postgres connection string."
  echo "Neon: use the direct (non-pooler) URL for pg_dump."
  exit 1
fi

for cmd in docker pg_dump pg_restore psql; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing: $cmd (PostgreSQL client: brew install libpq && brew link --force libpq)"
    exit 1
  fi
done

mkdir -p tmp
DUMP="${REPO_ROOT}/tmp/agency-prod-clone.pgdump"
rm -f "$DUMP"

echo "→ Local Docker up..."
docker compose up -d --wait

echo "→ pg_dump (read-only against prod)..."
if ! pg_dump "$PROD_DATABASE_URL" -Fc -Z 6 -f "$DUMP"; then
  rm -f "$DUMP"
  echo "pg_dump failed (network, or try unpooled / direct URL on Neon)."
  exit 1
fi

echo "→ Replace local database agency..."

export PGPASSWORD=postgres
psql -h 127.0.0.1 -p 5434 -U postgres -d postgres -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS agency WITH (FORCE);"
psql -h 127.0.0.1 -p 5434 -U postgres -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE agency OWNER postgres;"

echo "→ pg_restore to local (warnings are often OK)..."
set +e
pg_restore -h 127.0.0.1 -p 5434 -U postgres -d agency --no-owner --no-acl --verbose "$DUMP"
rc=$?
set -e
if [ "$rc" -gt 1 ]; then
  echo "pg_restore failed (exit $rc)"
  exit 1
fi

cp -f .env.docker .env.development.local 2>/dev/null || true

echo "→ Done. Local = snapshot of prod. Dump: tmp/agency-prod-clone.pgdump"
echo "  Run: npm run dev:local"
