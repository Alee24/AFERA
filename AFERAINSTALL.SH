#!/bin/bash
set -e
echo "🚀 Starting COMPLETE AFERA REINSTALLATION..."

# Configuration
DOMAIN="aferainnov.africa"

# System Updates
sudo apt update && sudo apt upgrade -y

echo "🛑 Stopping and Removing all previous containers and data..."
cd /var/www/AFERA/AFERA || true
docker-compose down -v --remove-orphans || true

echo "📂 Pulling absolute latest code from GitHub..."
cd /var/www/AFERA
sudo rm -rf AFERA
git clone https://github.com/Alee24/AFERA.git
cd AFERA

echo "🏗️ Building and launching Docker (Fresh Build)..."
docker-compose up -d --build

echo "⏳ Waiting for database to be reachable..."
MAX_RETRIES=40
COUNT=0
while ! docker-compose exec -T backend nc -z db 3306 >/dev/null 2>&1; do
    if [ $COUNT -ge $MAX_RETRIES ]; then echo "❌ Timeout waiting for database."; exit 1; fi
    echo "   ...waiting for db:3306 ($COUNT/$MAX_RETRIES)"
    sleep 2; COUNT=$((COUNT+1))
done

echo "🗄️ Running Migrations & Seeding (Including Admin: Digital2025)..."
docker-compose exec -T backend npm run migrate
docker-compose exec -T backend npm run seed

echo "🌐 Overwriting Apache Virtual Host for $DOMAIN..."
sudo bash -c "cat << 'EOF' > /etc/apache2/sites-available/afera-sms.conf
<VirtualHost *:80>
    ServerName $DOMAIN
    ServerAlias www.\$DOMAIN
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}\$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName $DOMAIN
    ServerAlias www.\$DOMAIN

    ProxyPreserveHost On
    # Connect directly to the Proxy container on port 5454
    ProxyPass / http://127.0.0.1:5454/
    ProxyPassReverse / http://127.0.0.1:5454/

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/$DOMAIN/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/$DOMAIN/privkey.pem

    ErrorLog \${APACHE_LOG_DIR}/afera_error.log
    CustomLog \${APACHE_LOG_DIR}/afera_access.log combined
</VirtualHost>
EOF"

# Ensure modules are enabled
sudo a2enmod proxy proxy_http ssl rewrite || true
sudo a2ensite afera-sms.conf || true

echo "🔄 Restarting Apache..."
sudo systemctl restart apache2

echo "✅ AFERA REINSTALLATION COMPLETE!"
echo "🌐 App URL: https://$DOMAIN"
echo "👤 Admin Email: admin@aferainnov.africa"
echo "🔑 Admin Password: Digital2025"
echo "🌍 Languages: EN, FR, PT, SW"
