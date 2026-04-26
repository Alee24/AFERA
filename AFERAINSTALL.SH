#!/bin/bash

# ==========================================================================
# AFERA INNOV ACADEMY - ONE-TIME VPS INSTALLATION SCRIPT
# Target Domain: aferainnov.africa
# Repository: https://github.com/Alee24/AFERA.git
# ==========================================================================

set -e

echo "🚀 Starting AFERA VPS Installation..."

# 1. Update System
sudo apt-get update
sudo apt-get upgrade -y

# 2. Install Docker
if ! [ -x "$(command -v docker)" ]; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
fi

# 3. Install Docker Compose
if ! [ -x "$(command -v docker-compose)" ]; then
    echo "📦 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# 4. Install Apache & Certbot
echo "🌐 Installing Apache & SSL Tools..."
sudo apt-get install -y apache2 certbot python3-certbot-apache

# 5. Enable Apache Modules for Reverse Proxy
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod ssl
sudo a2enmod rewrite

# 6. Configure Apache VirtualHost
echo "⚙️ Configuring Apache Reverse Proxy for aferainnov.africa..."
cat <<EOF | sudo tee /etc/apache2/sites-available/afera.conf
<VirtualHost *:80>
    ServerName aferainnov.africa
    ServerAlias www.aferainnov.africa

    ProxyPreserveHost On
    ProxyPass /api http://localhost:5000/api
    ProxyPassReverse /api http://localhost:5000/api
    
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog \${APACHE_LOG_DIR}/afera-error.log
    CustomLog \${APACHE_LOG_DIR}/afera-access.log combined
</VirtualHost>
EOF

sudo a2ensite afera.conf
sudo a2dissite 000-default.conf
sudo systemctl restart apache2

# 7. Clone Repository
echo "📂 Pulling latest code from GitHub..."
if [ -d "AFERA" ]; then
    sudo rm -rf AFERA
fi
git clone https://github.com/Alee24/AFERA.git
cd AFERA

# 8. Create Production .env files
echo "📝 Configuring environment variables..."
cat <<EOF > backend/.env
DB_DIALECT=mysql
DB_HOST=db
DB_NAME=afera_sms
DB_USER=root
DB_PASSWORD=root_password
JWT_SECRET=$(openssl rand -base64 32)
PORT=5000
EOF

cat <<EOF > frontend/.env.local
NEXT_PUBLIC_API_URL=/api
EOF

# 9. Launch Application with Docker Compose
echo "🏗️ Building and launching Docker containers..."
sudo docker-compose up -d --build

# 10. Configure SSL (Optional: Needs domain to be pointed already)
echo "--------------------------------------------------------"
echo "✅ Installation Complete!"
echo "--------------------------------------------------------"
echo "To enable HTTPS, ensure your domain is pointed to this IP and run:"
echo "sudo certbot --apache -d aferainnov.africa -d www.aferainnov.africa"
echo "--------------------------------------------------------"
echo "App is now running in the background."
echo "Frontend: http://aferainnov.africa"
echo "Backend: http://aferainnov.africa/api"
