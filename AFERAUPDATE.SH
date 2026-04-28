#!/bin/bash
set -e
echo "🚀 Starting AFERA Platform Update (No Data Loss)..."

cd /var/www/AFERA/AFERA

echo "📂 Pulling fresh code from GitHub..."
git fetch origin main
git reset --hard origin/main

echo "🏗️ Rebuilding changed services..."
docker-compose up -d --build

echo "⏳ Waiting for database to be reachable..."
MAX_RETRIES=40
COUNT=0
while ! docker-compose exec -T backend nc -z db 3306 >/dev/null 2>&1; do
    if [ $COUNT -ge $MAX_RETRIES ]; then echo "❌ Timeout waiting for database."; exit 1; fi
    echo "   ...waiting for db:3306 ($COUNT/$MAX_RETRIES)"
    sleep 2; COUNT=$((COUNT+1))
done

echo "🗄️ Synchronizing newly added database models (SystemSettings etc.)..."
docker-compose exec -T backend npm run db-fix

echo "🔄 Restarting backend/frontend to ensure new code runs perfectly..."
docker-compose restart backend frontend

echo "✅ AFERA successfully updated to the latest commit!"
