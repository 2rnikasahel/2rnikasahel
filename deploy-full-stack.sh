#!/bin/bash

################################################################################
# Dornika Store - Full Stack Automated Deployment Script
# Ubuntu 22.04+ | Laravel 11 + React/Vite
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() { echo -e "${BLUE}========================================\n$1\n========================================${NC}"; }
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; exit 1; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }

if [ "$EUID" -ne 0 ]; then print_error "Please run as root (sudo ./deploy-full-stack.sh)"; fi

print_header "Dornika Store Full Stack Deployment"

# 1. System Update
print_header "1. Updating System"
apt update && apt upgrade -y
print_success "System updated"

# 2. Install PHP 8.3 + Extensions
print_header "2. Installing PHP 8.3"
apt install -y php8.3 php8.3-cli php8.3-fpm php8.3-mysql php8.3-xml php8.3-curl php8.3-mbstring php8.3-zip php8.3-bcmath php8.3-redis
print_success "PHP 8.3 installed"

# 3. Install Composer
print_header "3. Installing Composer"
if ! command -v composer &> /dev/null; then
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
    print_success "Composer installed"
else
    print_success "Composer found"
fi

# 4. Install Node.js 20 (for Frontend)
print_header "4. Installing Node.js 20"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
print_success "Node.js 20 installed"

# 5. Install MySQL & Redis
print_header "5. Installing MySQL & Redis"
apt install -y mysql-server redis-server
systemctl enable mysql redis-server
systemctl start mysql redis-server
print_success "MySQL & Redis installed"

# 6. Install Nginx
print_header "6. Installing Nginx"
apt install -y nginx
systemctl enable nginx
systemctl start nginx
print_success "Nginx installed"

# 7. Setup Backend
print_header "7. Setting up Laravel Backend"
cd backend
composer install --no-dev --optimize-autoloader
if [ ! -f .env ]; then cp .env.example .env; print_warning "Please edit backend/.env with your credentials"; fi
php artisan key:generate
php artisan migrate --force --seed
php artisan storage:link
chown -R www-data:www-data .
chmod -R 775 storage bootstrap/cache
print_success "Backend setup complete"

# 8. Setup Frontend
print_header "8. Building React Frontend"
cd ..
npm install
npm run build
print_success "Frontend build complete (dist/ folder created)"

# 9. Setup Nginx Configuration
print_header "9. Configuring Nginx"
cat > /etc/nginx/sites-available/dornika << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/html;

    # Serve Frontend (React Build)
    location / {
        root /var/www/html/dist;
        try_files $uri $uri/ /index.html;
    }

    # Serve Backend API (Laravel)
    location /api {
        try_files $uri $uri/ /backend/public/index.php?$query_string;
    }

    # PHP Processing for Backend
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    charset utf-8;
}
EOF

ln -sf /etc/nginx/sites-available/dornika /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
print_success "Nginx configured"

# 10. Setup Supervisor (Queue Worker)
print_header "10. Setting up Queue Worker"
cat > /etc/supervisor/conf.d/dornika-worker.conf << EOF
[program:dornika-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/html/backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/html/backend/storage/logs/worker.log
stopwaitsecs=3600
EOF

apt install -y supervisor
supervisorctl reread
supervisorctl update
supervisorctl start dornika-worker:*
print_success "Queue worker configured"

# 11. Final Optimization
print_header "11. Final Optimization"
cd backend
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
print_success "Application optimized"

print_header "Deployment Complete! 🎉"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your database and API credentials"
echo "2. Run: php artisan migrate --force --seed (if not done)"
echo "3. Set up SSL (Certbot recommended)"
echo "4. Update CORS_ALLOWED_ORIGINS in .env"
echo ""
echo "Default Admin:"
echo "Email: admin@dornika.com"
echo "Password: ChangeMeNow123!"
echo ""
print_warning "Change admin password immediately!"
