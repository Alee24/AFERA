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

echo "🗄️ Running Migrations, Schema Fixes & Academic Seeding..."
docker-compose exec -T backend npm run migrate
docker-compose exec -T backend npm run db-fix
docker-compose exec -T backend npx ts-node src/migrations/add-swahili-fields.ts
docker-compose exec -T backend npx ts-node src/migrations/add-enrollment-finance.ts
docker-compose exec -T backend npx ts-node src/migrations/seed-programs.ts
docker-compose exec -T backend npx ts-node src/migrations/seed-applications.ts
docker-compose exec -T backend npx ts-node src/migrations/create-contacts.ts
docker-compose exec -T backend npx ts-node src/migrations/seed-scientific-committee.ts
docker-compose exec -T backend npx ts-node src/migrations/create-course-resources.ts
docker-compose exec -T backend npm run seed
docker-compose exec -T backend npx ts-node src/migrations/cleanup-courses.ts
docker-compose exec -T backend npx ts-node src/migrations/seed-grades.ts

echo "🗑️ Wiping all OLD Apache configurations to prevent conflicts..."
sudo a2dissite afera-main.conf || true
sudo a2dissite afera-sms.conf || true
sudo rm -f /etc/apache2/sites-available/afera-*.conf
sudo rm -f /etc/apache2/sites-enabled/afera-*.conf

echo "🌐 Creating the SINGLE CLEAN Apache Virtual Host..."
sudo bash -c "cat << 'EOF' > /etc/apache2/sites-available/afera-final.conf
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
    ProxyAddHeaders On
    RequestHeader set X-Forwarded-Proto "https"
    
    # API Direct Route (Priority)
    ProxyPass /api http://127.0.0.1:5455/api
    ProxyPassReverse /api http://127.0.0.1:5455/api

    # Frontend Direct Route
    ProxyPass / http://127.0.0.1:5454/
    ProxyPassReverse / http://127.0.0.1:5454/

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/$DOMAIN/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/$DOMAIN/privkey.pem

    ErrorLog \${APACHE_LOG_DIR}/afera_error.log
    CustomLog \${APACHE_LOG_DIR}/afera_access.log combined
</VirtualHost>
EOF"

# Ensure modules and site are enabled
sudo a2enmod proxy proxy_http ssl rewrite || true
sudo a2ensite afera-final.conf || true

echo "🔄 Restarting Apache..."
sudo systemctl restart apache2

echo "✅ AFERA REINSTALLATION COMPLETE!"
echo "🌐 App URL: https://$DOMAIN"
echo "👤 Admin Email: admin@aferainnov.africa"
echo "🔑 Admin Password: Digital2025"
echo "🌍 Languages: EN, FR, PT, SW"
