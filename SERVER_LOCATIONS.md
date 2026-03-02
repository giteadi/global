# Global Exim Traders - Server File Locations

## Server Details
- **Server IP**: 195.35.45.17
- **SSH Access**: `ssh root@195.35.45.17`
- **SSH Password**: Bazeer@12345

## Project Directory Structure
```
/home/global_exim_trader/
├── server.js                    # Main server file
├── package.json                 # Node.js dependencies
├── package-lock.json           # Dependency lock file
├── .env                        # Environment variables
├── database_updated.sql       # Database schema and sample data
├── local_data_export.sql       # Your local database export
├── config/
│   └── database.js            # Database configuration
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── productController.js   # Product management
│   ├── cartController.js      # Shopping cart
│   ├── orderController.js     # Order processing
│   ├── paymentController.js   # Payment handling
│   ├── categoryController.js  # Category management
│   └── analyticsController.js # Analytics dashboard
├── middleware/
│   └── auth.js               # Authentication middleware
├── models/
│   ├── User.js               # User model
│   ├── Product.js            # Product model
│   ├── Category.js           # Category model
│   ├── Cart.js               # Cart model
│   └── Order.js              # Order model
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── products.js           # Product routes
│   ├── cart.js               # Cart routes
│   ├── orders.js             # Order routes
│   ├── payment.js            # Payment routes
│   ├── categories.js         # Category routes
│   └── analytics.js          # Analytics routes
└── node_modules/             # Installed dependencies
```

## Nginx Configuration
- **Nginx Config**: `/etc/nginx/sites-available/riverview.co.in`
- **Nginx Enabled**: `/etc/nginx/sites-enabled/riverview.co.in`
- **Nginx Status**: Running and configured for reverse proxy

## PM2 Process Manager
- **PM2 Status**: Installed globally
- **Process Name**: `global-exim-server`
- **Command**: `npm run dev`
- **PM2 Config**: Saved for persistence
- **Startup Script**: Configured to auto-start on server reboot

## Database Configuration
- **Database Type**: MySQL
- **Database Name**: global_exim
- **Host**: 127.0.0.1
- **Port**: 3306
- **Username**: root
- **Password**: Tiger@123
- **Data**: 18 products imported from your local database

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

## Domain Configuration
- **Domain**: riverview.co.in
- **DNS A Record**: 195.35.45.17
- **SSL Status**: Pending DNS propagation
- **Nginx Proxy**: Configured for port 3004

## Access URLs
- **API Base**: `http://195.35.45.17:3004/api`
- **Domain API**: `http://riverview.co.in/api` (after SSL)
- **Domain HTTPS**: `https://riverview.co.in/api` (after SSL)

## Server Management Commands
```bash
# SSH into server
ssh root@195.35.45.17

# Navigate to project
cd /home/global_exim_trader

# Check PM2 status
pm2 status

# Restart server
pm2 restart global-exim-server

# View logs
pm2 logs global-exim-server

# Check Nginx status
systemctl status nginx

# Reload Nginx
systemctl reload nginx

# Database access
mysql -u root -pTiger@123 global_exim
```

## File Upload Methods Used
1. **SCP Commands**: Used `sshpass` and `scp` to upload files
2. **Directory Structure**: Maintained same structure as local project
3. **Dependencies**: Installed via `npm install` on server
4. **Database**: Imported using `mysql` command line

## Security Notes
- Database credentials hardcoded in config/database.js
- JWT secret needs to be changed for production
- SSL certificate pending DNS propagation
- Server running as root user (consider creating dedicated user)

## Next Steps
1. Wait for DNS propagation (riverview.co.in → 195.35.45.17)
2. Install SSL certificate using certbot
3. Update client to use domain URLs
4. Configure HTTPS redirects
5. Set up monitoring and backup systems
