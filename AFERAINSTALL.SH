#!/bin/bash
set -e
echo "🚀 Starting AFERA VPS Installation with Apache Reverse Proxy..."

# Domain Configuration
DOMAIN="academy.aferainnov.africa"

# System Updates
sudo apt update && sudo apt upgrade -y

echo "🔧 Configuring Apache Reverse Proxy Modules..."
sudo a2enmod proxy || true
sudo a2enmod proxy_http || true
sudo a2enmod ssl || true
sudo a2enmod rewrite || true

echo "📂 Pulling latest code from GitHub..."
[ -d "AFERA" ] && sudo rm -rf AFERA
git clone https://github.com/Alee24/AFERA.git
cd AFERA

echo "🏗️ Building and launching Docker containers on ports 5454/5455..."
docker-compose up -d --build

echo "⏳ Waiting for database to be reachable..."
MAX_RETRIES=30
COUNT=0
while ! docker-compose exec -T backend nc -z db 3306 >/dev/null 2>&1; do
    if [ $COUNT -ge $MAX_RETRIES ]; then echo "❌ Timeout waiting for database."; exit 1; fi
    sleep 2; COUNT=$((COUNT+1))
done

echo "🗄️ Running Database Migrations & Seeding..."
docker-compose exec -T backend npm run migrate
docker-compose exec -T backend npm run seed

echo "🌐 Setting up Apache Virtual Host for $DOMAIN..."
sudo bash -c "cat << 'EOF' > /etc/apache2/sites-available/afera-academy.conf
<VirtualHost *:80>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:5454/
    ProxyPassReverse / http://127.0.0.1:5454/

    ErrorLog \${APACHE_LOG_DIR}/afera_error.log
    CustomLog \${APACHE_LOG_DIR}/afera_access.log combined
</VirtualHost>
EOF"

sudo a2ensite afera-academy.conf
echo "🔄 Restarting Apache to apply virtual server configuration..."
sudo systemctl restart apache2

echo "✅ AFERA SMS is now live via Apache Reverse Proxy!"
echo "🎓 Moodle remains accessible on its original domain."
echo "🌐 App available at: http://$DOMAIN"
echo "🛠️ Admin Portal: http://$DOMAIN/en/admin"
