#!/bin/bash

# AFERA VPS Installation Script (Pure Docker)
# This script installs Docker and launches the entire stack inside containers.

set -e

echo "🚀 Starting AFERA VPS Installation..."

# 1. Update System
echo "🔄 Updating system..."
sudo apt update && sudo apt upgrade -y

# 2. Stop conflicting services (Apache) to free port 80/443
echo "🛑 Stopping Apache to free ports for Docker..."
sudo systemctl stop apache2 || true
sudo systemctl disable apache2 || true

# 3. Install Docker
echo "🐳 Installing Docker & Docker Compose..."
if ! [ -x "$(command -v docker)" ]; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
fi

# 4. Clone Repository
echo "📂 Pulling latest code from GitHub..."
if [ -d "AFERA" ]; then
    sudo rm -rf AFERA
fi
git clone https://github.com/Alee24/AFERA.git
cd AFERA

# 5. Build and Launch
echo "🏗️ Building and launching Docker containers..."
docker-compose up -d --build

echo "✅ AFERA SMS is now installing in Docker!"
echo "🌐 App will be available at: https://aferainnov.africa"
echo "🛠️ Use 'docker-compose logs -f' to monitor progress."
