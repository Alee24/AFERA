# 🚀 Afera Innov Academy: Live Management Guide

This guide contains the essential terminal commands to manage your live application on the VPS.

## 📥 Deployment & Updates
To pull the latest changes from GitHub and update the live application:
```bash
# 1. Navigate to project folder
cd AFERA

# 2. Pull the latest code
git pull origin main

# 3. Rebuild and restart containers
docker-compose up -d --build

# 4. Clean up unused images to save space
docker image prune -f
```

## 📊 Monitoring & Logs
To check the status of your services and view real-time logs:
```bash
# View status of all containers
docker-compose ps

# View live backend logs
docker-compose logs -f backend

# View live frontend logs
docker-compose logs -f frontend

# View Apache error logs (for domain/SSL issues)
sudo tail -f /var/log/apache2/afera-error.log
```

## 🗄️ Database Management
To interact with the MySQL database or re-seed data:
```bash
# Access MySQL CLI inside the container
docker exec -it afera_db mysql -u root -p

# Force a data re-seed (Warning: This resets all data!)
docker exec -it afera_backend npx ts-node src/seed.ts
```

## 🔐 SSL & Security
To manage your HTTPS certificates via Certbot:
```bash
# Renew certificates (automatically handled by cron, but can be run manually)
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

## 🛠️ System Control
```bash
# Stop the entire application
docker-compose down

# Restart the entire application
docker-compose restart

# Restart Apache (web server)
sudo systemctl restart apache2
```

---
**Note:** Always ensure you are in the project root directory (`/root/AFERA` or where you installed it) before running `docker-compose` commands.
