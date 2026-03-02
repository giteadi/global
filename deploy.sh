#!/bin/bash

# Deployment Script for Global Exim Traders Backend
# Usage: ./deploy.sh or ./deploy.sh riverview.co.in

echo "🚀 Starting deployment..."

# Configuration
SERVER_IP="195.35.45.17"
SERVER_USER="root"
SERVER_PATH="/root/global-exim-traders"
PORT="3004"  # Running on port 3004
DOMAIN="${1:-195.35.45.17}"  # Use domain if provided, otherwise IP

echo "📦 Creating deployment package..."
cd server
tar -czf ../deploy.tar.gz .
cd ..

echo "📤 Uploading to server..."
sshpass -p 'Bazeer@12345' scp -o StrictHostKeyChecking=no deploy.tar.gz ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

echo "🔧 Deploying on server..."
sshpass -p 'Bazeer@12345' ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /root/global-exim-traders

# Extract files
tar -xzf deploy.tar.gz -C server/
rm deploy.tar.gz

# Navigate to server directory
cd server

# Install dependencies
echo "📥 Installing dependencies..."
npm install --production

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Stop existing process
echo "🛑 Stopping existing process..."
pm2 stop global-exim-backend 2>/dev/null || true

# Start with PM2
echo "▶️  Starting server..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Show status
pm2 list

echo "✅ Deployment completed!"
echo "📊 View logs: pm2 logs global-exim-backend"
echo "🔍 Check status: pm2 status"

ENDSSH

# Cleanup
rm deploy.tar.gz

echo "🎉 Deployment finished!"
echo "🌐 Backend should be running at: http://${DOMAIN}:${PORT}"
echo "🔍 Test with: curl http://${DOMAIN}:${PORT}/api/health"
echo ""
echo "📝 Next steps:"
echo "1. Update client/.env with: VITE_API_BASE_URL=http://${DOMAIN}:${PORT}"
echo "2. Build and deploy frontend"
echo "3. Setup SSL certificate with: certbot --nginx -d ${DOMAIN}"
