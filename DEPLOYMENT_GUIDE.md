# Deployment Guide for Global Exim Traders

## Server Details
- **IP**: 195.35.45.17
- **SSH Password**: Bazeer@12345
- **Database Password**: Tiger@123

## Live URLs
- **Frontend**: https://riverview.co.in
- **API**: https://global.riverview.co.in/api
- **Direct IP**: http://195.35.45.17

## Project Structure on Server
```
/home/global_exim_trader/
├── dist/                          # Frontend build files
│   ├── index.html
│   ├── assets/
│   │   ├── index-*.js
│   │   ├── index-*.css
│   │   └── images/
│   └── vite.svg
├── server/                        # Backend Node.js application
│   ├── server.js
│   ├── package.json
│   ├── .env.production
│   ├── ecosystem.config.js        # PM2 configuration
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
└── *.tar.gz                       # Deployment archives
```

## Nginx Configuration Files
- **Main Config**: `/etc/nginx/sites-available/riverview.co.in`
- **API Config**: `/etc/nginx/sites-available/global-riverview`
- **IP Config**: `/etc/nginx/sites-available/global-exim-ip`
- **Enabled Configs**: `/etc/nginx/sites-enabled/`

## SSL Certificates
- **riverview.co.in**: `/etc/letsencrypt/live/riverview.co.in/`
- **global.riverview.co.in**: `/etc/letsencrypt/live/global.riverview.co.in/`

## Step 1: Connect to Server

```bash
ssh root@195.35.45.17
# Enter password: Bazeer@12345
```

## Step 2: Check Available Ports

```bash
# Check which ports are in use
netstat -tuln | grep LISTEN

# Or use ss command
ss -tuln | grep LISTEN

# Find available port (try 3001, 3002, 3003, etc.)
```

## Step 3: Install Dependencies (if not already installed)

```bash
# Check if Node.js is installed
node -v
npm -v

# If not installed, install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Check if MySQL is installed
mysql --version

# Install PM2 for process management
npm install -g pm2
```

## Step 4: Upload Backend Code

### Option A: Using SCP (from your local machine)

```bash
# From your local machine, navigate to project directory
cd /path/to/global-exim-traders

# Create a tar file
tar -czf server.tar.gz server/

# Upload to server
scp server.tar.gz root@195.35.45.17:/root/

# On server, extract
ssh root@195.35.45.17
cd /root
tar -xzf server.tar.gz
cd server
```

### Option B: Using Git (recommended)

```bash
# On server
cd /root
git clone <your-repository-url>
cd global-exim-traders/server
```

## Step 5: Setup Database

```bash
# Login to MySQL
mysql -u root -p
# Enter password: Tiger@123

# Create database
CREATE DATABASE IF NOT EXISTS global_exim_traders;
USE global_exim_traders;

# Run all migration files
source /root/global-exim-traders/server/database.sql;
source /root/global-exim-traders/server/migration_contacts.sql;

# Exit MySQL
exit;
```

## Step 6: Configure Environment

```bash
cd /home/global_exim_trader/server

# Copy production environment file
cp .env.production .env

# Edit .env file to set correct PORT (use available port)
nano .env

# Update these values:
# PORT=3004  (currently using this port)
# DB_HOST=127.0.0.1
# DB_PASSWORD=Tiger@123
# DB_NAME=global_exim_traders
# JWT_SECRET=<generate-a-secure-random-string>
# CORS_ORIGIN=http://riverview.co.in,https://riverview.co.in,http://global.riverview.co.in,https://global.riverview.co.in,http://195.35.45.17
```

## Step 7: Install Dependencies and Start Server

```bash
cd /home/global_exim_trader/server

# Install dependencies
npm install

# Test if server starts
node server.js

# If successful, stop it (Ctrl+C) and start with PM2
pm2 start ecosystem.config.js

# Or start directly
pm2 start server.js --name "global-exim"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system reboot
pm2 startup

# Check PM2 status
pm2 status
pm2 logs global-exim
```

## Step 8: Configure Firewall (if needed)

```bash
# Allow the port through firewall
ufw allow 3001/tcp

# Check firewall status
ufw status
```

## Step 9: Test Backend

```bash
# Test from server
curl http://localhost:3001/api/health

# Test from outside (from your local machine)
curl http://195.35.45.17:3001/api/health
```

## Step 10: Update Frontend Configuration

Update `client/.env` with production backend URL:

```env
VITE_API_URL=http://195.35.45.17:3001
```

## Useful PM2 Commands

```bash
# View logs
pm2 logs global-exim-backend

# Restart server
pm2 restart global-exim-backend

# Stop server
pm2 stop global-exim-backend

# Delete from PM2
pm2 delete global-exim-backend

# List all processes
pm2 list

# Monitor
pm2 monit
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Database Connection Issues
```bash
# Check MySQL is running
systemctl status mysql

# Restart MySQL
systemctl restart mysql

# Check MySQL logs
tail -f /var/log/mysql/error.log
```

### Permission Issues
```bash
# Give proper permissions
chmod -R 755 /root/global-exim-traders/server
chown -R root:root /root/global-exim-traders/server
```

## Production Checklist

- [ ] Database created and migrations run
- [ ] .env file configured with correct values
- [ ] JWT_SECRET changed to secure random string
- [ ] Server running on available port
- [ ] Firewall configured to allow port
- [ ] PM2 configured to restart on reboot
- [ ] Backend API accessible from outside
- [ ] Frontend .env updated with backend URL
- [ ] Test all API endpoints
- [ ] Monitor logs for errors

## Security Recommendations

1. Change default MySQL root password
2. Create separate MySQL user for application
3. Use strong JWT_SECRET
4. Enable HTTPS with SSL certificate
5. Setup proper firewall rules
6. Regular backups of database
7. Keep Node.js and dependencies updated
8. Use environment variables for sensitive data
9. Implement rate limiting
10. Setup monitoring and alerts


## Nginx Configuration Details

### Frontend Config (riverview.co.in)
Location: `/etc/nginx/sites-available/riverview.co.in`

```nginx
server {
    server_name riverview.co.in www.riverview.co.in;
    root /home/global_exim_trader/dist;
    index index.html;

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3004/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /home/global_exim_trader/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Frontend routes - SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/riverview.co.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/riverview.co.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name riverview.co.in www.riverview.co.in;
    return 301 https://$host$request_uri;
}
```

### API Config (global.riverview.co.in)
Location: `/etc/nginx/sites-available/global-riverview`

```nginx
server {
    server_name global.riverview.co.in;
    root /home/global_exim_trader/dist;
    index index.html;

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3004/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /home/global_exim_trader/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/global.riverview.co.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/global.riverview.co.in/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    server_name global.riverview.co.in;
    return 301 https://$host$request_uri;
}
```

### IP-based Config (195.35.45.17)
Location: `/etc/nginx/sites-available/global-exim-ip`

```nginx
server {
    listen 80;
    server_name 195.35.45.17;
    root /home/global_exim_trader/dist;
    index index.html;

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3004/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control 'public, immutable';
        try_files $uri =404;
    }

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html =404;
    }
}
```

## SSL Certificate Management

### Install SSL Certificate
```bash
# For riverview.co.in
certbot --nginx -d riverview.co.in -d www.riverview.co.in --non-interactive --agree-tos --email adityasharma10102000@gmail.com --redirect

# For global.riverview.co.in (API subdomain)
certbot --nginx -d global.riverview.co.in --non-interactive --agree-tos --email adityasharma10102000@gmail.com --redirect
```

### Renew SSL Certificates
```bash
# Test renewal
certbot renew --dry-run

# Force renewal
certbot renew --force-renewal

# Auto-renewal is configured via cron
```

### Check SSL Certificate Status
```bash
# Check certificate details
certbot certificates

# Check expiry
openssl x509 -in /etc/letsencrypt/live/riverview.co.in/fullchain.pem -noout -dates
```

## Frontend Deployment

### Build Frontend Locally
```bash
cd client

# Update .env with production API URL
echo "VITE_API_BASE_URL=https://global.riverview.co.in" > .env

# Build
npm run build

# Create tar archive
tar -czf ../frontend-build.tar.gz -C dist .
```

### Deploy Frontend to Server
```bash
# Upload to server
scp frontend-build.tar.gz root@195.35.45.17:/home/global_exim_trader/

# SSH to server
ssh root@195.35.45.17

# Extract and deploy
cd /home/global_exim_trader
rm -rf dist
mkdir -p dist
tar -xzf frontend-build.tar.gz -C dist/
chmod -R 755 dist
chown -R www-data:www-data dist
find dist -name "._*" -delete
systemctl reload nginx
```

## Backend Deployment

### Deploy Backend Code
```bash
# From local machine
cd server
tar -czf ../backend-deploy.tar.gz .
scp backend-deploy.tar.gz root@195.35.45.17:/home/global_exim_trader/

# On server
ssh root@195.35.45.17
cd /home/global_exim_trader
tar -xzf backend-deploy.tar.gz -C server/
cd server
npm install --production
pm2 restart global-exim
pm2 save
```

## Useful Commands

### Nginx Commands
```bash
# Test configuration
nginx -t

# Reload nginx
systemctl reload nginx

# Restart nginx
systemctl restart nginx

# Check nginx status
systemctl status nginx

# View nginx error logs
tail -f /var/log/nginx/error.log

# View nginx access logs
tail -f /var/log/nginx/access.log
```

### PM2 Commands
```bash
# List all processes
pm2 list

# View logs
pm2 logs global-exim

# Restart process
pm2 restart global-exim

# Stop process
pm2 stop global-exim

# Delete process
pm2 delete global-exim

# Monitor
pm2 monit

# Save current process list
pm2 save

# Resurrect saved processes
pm2 resurrect
```

### Database Commands
```bash
# Connect to MySQL
mysql -u root -pTiger@123 global_exim_traders

# Backup database
mysqldump -u root -pTiger@123 global_exim_traders > backup_$(date +%Y%m%d).sql

# Restore database
mysql -u root -pTiger@123 global_exim_traders < backup.sql

# Check database size
mysql -u root -pTiger@123 -e "SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.TABLES WHERE table_schema = 'global_exim_traders';"
```

### System Monitoring
```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check running processes
ps aux | grep node

# Check port usage
netstat -tulpn | grep 3004
```

## Troubleshooting

### Frontend Not Loading
1. Check nginx configuration: `nginx -t`
2. Check file permissions: `ls -la /home/global_exim_trader/dist`
3. Check nginx error logs: `tail -f /var/log/nginx/error.log`
4. Verify files exist: `ls -la /home/global_exim_trader/dist/assets/`

### API Not Responding
1. Check PM2 status: `pm2 status`
2. Check PM2 logs: `pm2 logs global-exim`
3. Check if port is listening: `netstat -tulpn | grep 3004`
4. Test API directly: `curl http://localhost:3004/api/health`

### Database Connection Issues
1. Check MySQL is running: `systemctl status mysql`
2. Test connection: `mysql -u root -pTiger@123 global_exim_traders`
3. Check database exists: `mysql -u root -pTiger@123 -e "SHOW DATABASES;"`

### SSL Certificate Issues
1. Check certificate status: `certbot certificates`
2. Test renewal: `certbot renew --dry-run`
3. Check nginx SSL config: `nginx -t`
4. Verify certificate files exist: `ls -la /etc/letsencrypt/live/riverview.co.in/`

## Performance Optimization

### Enable Gzip Compression
Add to nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### Enable Browser Caching
Already configured in static assets location block with 1 year expiry.

### Database Optimization
```sql
-- Add indexes for frequently queried columns
ALTER TABLE products ADD INDEX idx_category (category);
ALTER TABLE products ADD INDEX idx_is_featured (is_featured);
ALTER TABLE products ADD INDEX idx_is_active (is_active);
```

## Backup Strategy

### Automated Backup Script
Create `/home/global_exim_trader/backup.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/global_exim_trader/backups"
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u root -pTiger@123 global_exim_traders > $BACKUP_DIR/db_$DATE.sql

# Backup uploaded files (if any)
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /home/global_exim_trader/dist

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### Setup Cron Job
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /home/global_exim_trader/backup.sh >> /home/global_exim_trader/backup.log 2>&1
```
