#!/bin/sh
# Repair schema/table ownership (local Docker). Default superuser: postgres.
set -e
cd "$(dirname "$0")/.."
docker compose exec -T postgres psql -U postgres -d agency <<'SQL'
ALTER SCHEMA public OWNER TO postgres;
GRANT USAGE, CREATE ON SCHEMA public TO PUBLIC;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
SQL
echo "OK: public schema + objects updated for user postgres."
