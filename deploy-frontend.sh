#!/bin/bash

# Frontend Deployment Script for Global Exim Traders
# Usage: ./deploy-frontend.sh

echo "🚀 Starting Frontend Deployment..."

# Build the frontend
echo "📦 Building frontend..."
cd /Users/adityasharma/Desktop/global/client
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Create clean tar file
echo "📁 Creating deployment package..."
cd /Users/adityasharma/Desktop/global
COPYFILE_DISABLE=1 tar -czf frontend-build.tar.gz -C client/dist .

if [ $? -ne 0 ]; then
    echo "❌ Tar creation failed!"
    exit 1
fi

# Upload to server
echo "⬆️ Uploading to server..."
sshpass -p 'Bazeer@12345' scp frontend-build.tar.gz root@195.35.45.17:/home/global_exim_trader/

if [ $? -ne 0 ]; then
    echo "❌ Upload failed!"
    exit 1
fi

# Deploy on server
echo "🔧 Deploying on server..."
sshpass -p 'Bazeer@12345' ssh root@195.35.45.17 "cd /home/global_exim_trader && rm -rf dist/* && tar -xzf frontend-build.tar.gz -C dist && chmod -R 755 dist && chown -R www-data:www-data dist && find dist -name '._*' -delete && systemctl reload nginx"

if [ $? -ne 0 ]; then
    echo "❌ Server deployment failed!"
    exit 1
fi

echo "✅ Frontend deployment successful!"
echo "🌐 Your site is now live at: http://195.35.45.17"
echo "🎉 All changes are now live!"
