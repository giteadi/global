#!/bin/bash

# Domain Deployment Script for Nginx + SSL
# Usage: ./domain-deploy.sh <domain> [www.<domain>]

if [ $# -lt 1 ]; then
    echo "Usage: $0 <domain> [www.<domain>]"
    exit 1
fi

DOMAIN=$1
WWW_DOMAIN=$2

echo "🚀 Setting up domain: $DOMAIN"

# Create nginx config
cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN ${WWW_DOMAIN:-};

    location / {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

echo "✅ Created nginx config for $DOMAIN"

# Enable site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

echo "✅ Enabled site $DOMAIN"

# Test nginx config
nginx -t

# Reload nginx
systemctl reload nginx

echo "✅ Reloaded nginx"

# Install SSL
certbot --nginx -d $DOMAIN ${WWW_DOMAIN:+-d $WWW_DOMAIN}

echo "✅ SSL installed for $DOMAIN"

# Final test
curl -I https://$DOMAIN

echo "🎉 Domain deployment completed for $DOMAIN"
