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

echo "⏳ Waiting for database to be ready..."
sleep 15

echo "🗄️ Running Database Migrations & Seeding..."
docker-compose exec -T backend npm run migrate
docker-compose exec -T backend npm run seed

echo "✅ AFERA SMS is now live on secondary ports!"
echo "🎓 Moodle (Apache) is also back online."
echo "🌐 App available at: http://aferainnov.africa:5454"
echo "🌐 Secure URL: https://aferainnov.africa:5455"
echo "🛠️ Admin Portal: https://aferainnov.africa:5455/en/admin"
