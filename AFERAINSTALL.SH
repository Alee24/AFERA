#!/bin/bash
set -e
echo "🚀 Starting AFERA VPS Installation with Multi-LMS Compatibility..."

# System Updates
sudo apt update && sudo apt upgrade -y

echo "✅ Ensuring Apache (Moodle) is running..."
sudo systemctl start apache2 || true
sudo systemctl enable apache2 || true

echo "🐳 Installing Docker & Docker Compose..."
if ! [ -x "$(command -v docker)" ]; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
fi

echo "📂 Pulling latest code from GitHub..."
[ -d "AFERA" ] && sudo rm -rf AFERA
git clone https://github.com/Alee24/AFERA.git
cd AFERA

echo "🏗️ Building and launching Docker containers on ports 5454/5455..."
docker-compose up -d --build

echo "⏳ Waiting for database to be reachable from backend..."
MAX_RETRIES=30
COUNT=0
while ! docker-compose exec -T backend nc -z db 3306 >/dev/null 2>&1; do
    if [ $COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Timeout waiting for database."
        exit 1
    fi
    echo "   ...waiting for db:3306 ($COUNT/$MAX_RETRIES)"
    sleep 2
    COUNT=$((COUNT+1))
done

echo "🗄️ Running Database Migrations & Seeding..."
docker-compose exec -T backend npm run migrate
docker-compose exec -T backend npm run seed

echo "✅ AFERA SMS is now live on secondary ports!"
echo "🎓 Moodle (Apache) is also back online."
echo "🌐 App available at: http://aferainnov.africa:5454"
echo "🌐 Secure URL: https://aferainnov.africa:5455"
echo "🛠️ Admin Portal: https://aferainnov.africa:5455/en/admin"
