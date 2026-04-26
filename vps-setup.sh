#!/bin/bash

# Afera University VPS Setup Script
# This script prepares your Ubuntu VPS for the Student Management System

echo "🚀 Starting VPS Setup for Afera University SMS..."

# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Docker & Docker Compose
if ! command -v docker &> /dev/null
then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
fi

# 3. Clone Repository (Placeholder for user)
# git clone <your-repo-url> afera
# cd afera

# 4. Create Environment Files
echo "📝 Creating environment files..."
cat <<EOF > backend/.env
PORT=5000
DB_HOST=db
DB_NAME=afera_sms
DB_USER=root
DB_PASSWORD=root_password
JWT_SECRET=$(openssl rand -base64 32)
EOF

cat <<EOF > frontend/.env.local
NEXT_PUBLIC_API_URL=http://your-domain.com:5000/api
EOF

# 5. Build and Start Containers
echo "🏗️ Building containers..."
docker-compose up -d --build

# 6. Run Migrations & Seeding
echo "🗄️ Running migrations and seeding..."
docker exec -it afera_backend npm run migrate
docker exec -it afera_backend npm run seed

echo "✅ Setup complete! Your system should be running at http://your-domain.com"
