# Global Exim Traders - Production Deployment Details

## Server Information
- **Server IP**: 195.35.45.17
- **SSH Command**: `ssh root@195.35.45.17`
- **SSH Password**: Bazeer@12345

## Application Details
- **Project Name**: Global Exim Traders
- **Server Port**: 3004
- **API Base URL**: `http://195.35.45.17:3004/api`
- **Server Status**: Running (PID: 3658176)

## File Locations on Server
- **Project Directory**: `/home/global_exim_trader/`
- **Server File**: `/home/global_exim_trader/server.js`
- **Environment File**: `/home/global_exim_trader/.env`
- **Database Config**: `/home/global_exim_trader/config/database.js`
- **Frontend Build**: `/home/global_exim_trader/dist/` (for getashokaazjewels.shop)
- **Nginx Config**: `/etc/nginx/sites-available/getashokaazjewels.shop`

## Database Configuration
- **Database Type**: MySQL
- **Database Name**: global_exim
- **Host**: 127.0.0.1
- **Port**: 3306
- **Username**: root
- **Password**: Tiger@123

## Database Configuration
- **Database Type**: MySQL
- **Database Name**: global_exim
- **Host**: 127.0.0.1
- **Port**: 3306
- **Username**: root
- **Password**: Tiger@123

## Environment Variables (.env)
```
DATABASE=global_exim
HOST=localhost
DB_USER=root
PASSWORD=Tiger@123
JWT_SECRET=global
NODE_ENV=production
PORT=3004

# Email
EMAIL_USER=adityasharma10102000@gmail.com
EMAIL_PASS=ntorfozwazlaronr

# Cloudinary
CLOUDINARY_CLOUD_NAME=wpcsars
CLOUDINARY_API_KEY=747261452285263
CLOUDINARY_API_SECRET=NpDuGV0bVVOtTKI89MDDMzgbJ2w

# Razorpay
RAZORPAY_KEY_ID=rzp_live_SEpkuM9oHkuG2N
RAZORPAY_SECRET=vdsNULssotoxU16k93Dep6xd
```

## Database Statistics
- **Total Products**: 18
- **Total Users**: [Need to verify - SSH connection issue]
- **Database**: Populated with local data

## API Endpoints
- **Products**: `GET /api/products`
- **Featured Products**: `GET /api/products/featured`
- **Categories**: `GET /api/categories`
- **Auth**: `POST /api/auth/login`, `POST /api/auth/register`
- **Admin**: Full CRUD operations for products, users, orders

## Deployment Commands
```bash
# SSH into server
ssh root@195.35.45.17

# Navigate to project
cd /home/global_exim_trader

# Check server status
ps aux | grep node

# Restart server
kill -9 [PID]
npm start

# Check database
mysql -u root -pTiger@123 global_exim -e "SELECT COUNT(*) FROM products;"
```

## Frontend Deployment Commands

```bash
# Build frontend locally
cd client
npm run build

# Create tar.gz archive
cd client/dist
tar -czf frontend-build.tar.gz .

# Upload to server
scp frontend-build.tar.gz root@195.35.45.17:/home/global_exim_trader/

# SSH to server and deploy
ssh root@195.35.45.17 'cd /home/global_exim_trader && mkdir -p dist_temp && tar -xzf frontend-build.tar.gz -C dist_temp && rm -rf dist && mv dist_temp dist && rm frontend-build.tar.gz'
```

## Security Notes
- Database credentials are hardcoded in config/database.js
- JWT secret is simple (should be changed for production)
- Server is running as root user
- No SSL/HTTPS configured

## Next Steps for Production
1. Change JWT secret to secure value
2. Implement SSL/HTTPS
3. Move database credentials to environment variables
4. Set up process manager (PM2)
5. Configure firewall rules
6. Set up monitoring and logging

## Client Configuration Update
Update client API base URL to: `http://195.35.45.17:3004/api`

## Deployment Date
March 3, 2026
