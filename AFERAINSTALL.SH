#!/bin/bash
set -e
echo "🚀 Starting AFERA VPS Installation..."

# System Updates
sudo apt update && sudo apt upgrade -y

echo "🛑 Stopping Apache to free ports for Docker..."
sudo systemctl stop apache2 || true
sudo systemctl disable apache2 || true

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

echo "🏗️ Building and launching Docker containers..."
docker-compose up -d --build

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🗄️ Running Database Migrations & Seeding..."
docker-compose exec -T backend npm run migrate
docker-compose exec -T backend npm run seed

echo "✅ AFERA SMS is now fully functional in Docker!"
echo "🌐 App is available at: https://aferainnov.africa"
echo "🛠️ Admin Portal: https://aferainnov.africa/en/admin"
