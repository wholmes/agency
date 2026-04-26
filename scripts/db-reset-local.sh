#!/bin/sh
# Wipes the Docker volume and recreates the DB. REQUIRED when you change POSTGRES_USER /
# POSTGRES_PASSWORD in docker-compose.yml — otherwise the old users/passwords stay and
# Prisma will report "invalid credentials" for postgres:postgres.
set -e
cd "$(dirname "$0")/.."
export PATH="${PWD}/node_modules/.bin:${PATH}"
echo "→ Stopping and removing local Postgres data (docker compose down -v)..."
docker compose down -v
echo "→ Starting fresh Postgres (postgres / postgres, database agency) — wait until healthy..."
docker compose up -d --wait
echo "→ Syncing .env.development.local from .env.docker..."
cp -f .env.docker .env.development.local
echo "→ Running migrations (use ONLY .env.docker so Prisma CLI does not re-read .env and override with Neon)..."
dotenv -e .env.docker -- prisma migrate deploy
echo "→ Seeding CMS rows (SiteChrome, projects, …) — required or the app throws 'No SiteChrome found'..."
dotenv -e .env.docker -- prisma db seed
echo "Done. Run: npm run dev:local  then open http://127.0.0.1:3000"
