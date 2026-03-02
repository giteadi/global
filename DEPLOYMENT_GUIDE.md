# Deployment Guide for Global Exim Traders

## Server Details
- **IP**: 195.35.45.17
- **Password**: Bazeer@12345
- **Database Password**: Tiger@123

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
cd /root/global-exim-traders/server

# Copy production environment file
cp .env.production .env

# Edit .env file to set correct PORT (use available port)
nano .env

# Update these values:
# PORT=3001  (or any available port)
# DB_HOST=127.0.0.1
# DB_PASSWORD=Tiger@123
# JWT_SECRET=<generate-a-secure-random-string>
```

## Step 7: Install Dependencies and Start Server

```bash
cd /root/global-exim-traders/server

# Install dependencies
npm install

# Test if server starts
node server.js

# If successful, stop it (Ctrl+C) and start with PM2
pm2 start server.js --name "global-exim-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system reboot
pm2 startup
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
