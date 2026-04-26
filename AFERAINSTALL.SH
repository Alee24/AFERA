#!/bin/bash
set -e
echo "🚀 Starting AFERA VPS Installation (Main Domain Setup)..."

# Configuration
MAIN_DOMAIN="aferainnov.africa"
MOODLE_DOMAIN="lms.aferainnov.africa"

# System Updates
sudo apt update && sudo apt upgrade -y

echo "🔧 Configuring Apache Modules..."
sudo a2enmod proxy || true
sudo a2enmod proxy_http || true
sudo a2enmod ssl || true
sudo a2enmod rewrite || true

echo "📂 Pulling latest code from GitHub..."
[ -d "AFERA" ] && sudo rm -rf AFERA
git clone https://github.com/Alee24/AFERA.git
cd AFERA

echo "🏗️ Building and launching Docker containers..."
docker-compose up -d --build

echo "⏳ Waiting for database to be reachable..."
MAX_RETRIES=30
COUNT=0
while ! docker-compose exec -T backend nc -z db 3306 >/dev/null 2>&1; do
    if [ $COUNT -ge $MAX_RETRIES ]; then echo "❌ Timeout waiting for database."; exit 1; fi
    echo "   ...waiting for db:3306 ($COUNT/$MAX_RETRIES)"
    sleep 2; COUNT=$((COUNT+1))
done

echo "🗄️ Running Database Migrations & Seeding..."
docker-compose exec -T backend npm run migrate
docker-compose exec -T backend npm run seed

echo "🌐 Creating Apache Virtual Host for $MAIN_DOMAIN (Afera SMS)..."
sudo bash -c "cat << 'EOF' > /etc/apache2/sites-available/afera-main.conf
<VirtualHost *:80>
    ServerName $MAIN_DOMAIN
    ServerAlias www.$MAIN_DOMAIN

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:5454/
    ProxyPassReverse / http://127.0.0.1:5454/

    # Redirect HTTP to HTTPS (uncomment after SSL is configured)
    # RewriteEngine On
    # RewriteCond %{HTTPS} off
    # RewriteRule ^(.*)$ https://%{HTTP_HOST}\$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName $MAIN_DOMAIN
    ServerAlias www.$MAIN_DOMAIN

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:5455/
    ProxyPassReverse / http://127.0.0.1:5455/

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/$MAIN_DOMAIN/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/$MAIN_DOMAIN/privkey.pem

    ErrorLog \${APACHE_LOG_DIR}/afera_error.log
    CustomLog \${APACHE_LOG_DIR}/afera_access.log combined
</VirtualHost>
EOF"

echo "⚠️  NOTE: We are enabling Afera on $MAIN_DOMAIN."
echo "⚠️  Ensure you have moved Moodle to $MOODLE_DOMAIN in its config file."

sudo a2ensite afera-main.conf
sudo systemctl restart apache2

echo "✅ Afera SMS is now taking over $MAIN_DOMAIN!"
echo "🌐 URL: https://$MAIN_DOMAIN"
echo "🛠️ Admin: https://$MAIN_DOMAIN/en/admin"
