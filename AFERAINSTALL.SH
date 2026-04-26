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
    sudo sh get-docker.sh## Error Type
Runtime ReferenceError

## Error Message
DollarSign is not defined


    at module evaluation (src/components/AdminSidebar.tsx:27:11)
    at module evaluation (src/app/[lang]/admin/layout.tsx:4:1)

## Code Frame
  25 |   { icon: BookOpen, label: 'Programs & Courses', href: '/admin/courses' },
  26 |   { icon: ShieldCheck, label: 'Academic Structure', href: '/admin/academic' },
> 27 |   { icon: DollarSign, label: 'Finance & Billing', href: '/admin/finance' },
     |           ^
  28 |   { icon: MessageSquare, label: 'Contact Inbox', href: '/admin/contacts' },
  29 |   { icon: FileText, label: 'Strategic Reports', href: '/admin/reports' },
  30 | ];

Next.js version: 16.2.4 (Turbopack)

    sudo usermod -aG docker $USER
fi

# 4. Clone Repository
echo "📂 Pulling latest code from GitHub..."
if [ -d "AFERA" ]; then
    sudo rm -rf AFERA
fi
git clone https://github.com/Alee24/AFERA.git
cd AFERA

# 5. Create Production .env files
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
