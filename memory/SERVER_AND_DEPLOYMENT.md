# Server Infrastructure, Credentials & Deployment Guide

> **Confidential Operations Document**: Contains production VPS access details, filesystem locations, security policies, and step-by-step deployment procedures for **Get AshokaaZ™ / Global Exim Traders**.

---

## 1. Server Overview

| Property | Value |
| :--- | :--- |
| **Server IP** | `195.35.45.17` |
| **Provider** | Hostinger VPS (KVM) |
| **Operating System** | Ubuntu 24.04 LTS (x86_64) |
| **Primary Domain** | `https://getashokaazjewels.shop` & `https://www.getashokaazjewels.shop` |
| **Secondary Domain** | `https://riverview.co.in` & `https://global.riverview.co.in` |
| **SSL Certificate** | Let's Encrypt Certbot (`/etc/letsencrypt/live/getashokaazjewels.shop/`) |
| **Web Server** | Nginx 1.24.0 (Reverse proxy + Static SPA server) |
| **Process Manager** | PM2 (Process Name: `global-exim`, Port: `3004`) |

---

## 2. Credentials & SSH Access

### User Accounts

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. User: aditya                                                        │
│    - SSH Command: ssh aditya@195.35.45.17                              │
│    - SSH Auth: Public Key (~/.ssh/id_ed25519)                          │
│    - SSH Key Passphrase: 1234                                          │
│    - Sudo Password: RuhiRiya@12345                                     │
│                                                                        │
│ 2. User: root                                                          │
│    - Note: Direct root SSH is DISABLED (sshd_config: AllowUsers aditya) │
│    - Elevation: Connect as aditya, then run:                           │
│      sudo -i  (or: echo 'RuhiRiya@12345' | sudo -S bash)               │
└────────────────────────────────────────────────────────────────────────┘
```

### ⚠️ Fail2ban Safety Rule (CRITICAL)
- **Active Jail**: `[sshd]` with `nftables` banaction.
- **Rule**: Never enter incorrect SSH passwords multiple times, or the client IP will trigger a ban.
- **Safe SSH One-Liner (Local Mac)**:
  ```bash
  /opt/homebrew/bin/sshpass -P "passphrase" -p "1234" ssh -o StrictHostKeyChecking=no aditya@195.35.45.17
  ```

---

## 3. Production Project Locations

### Frontend Web App (React 19 / Vite SPA)
- **Server Location**: `/home/global_exim_trader/dist/`
- **Ownership**: `www-data:www-data`
- **Permissions**: `755` for directories, `644` for files
- **Assets Directory**: `/home/global_exim_trader/dist/assets/`
- **Nginx Serving Root**: `/home/global_exim_trader/dist` (SPA routing via `try_files $uri $uri/ /index.html;`)

### Backend API (Node.js / Express)
- **Server Location**: `/home/global_exim_trader/`
- **Main Server File**: `/home/global_exim_trader/server.js`
- **Environment File**: `/home/global_exim_trader/.env`
- **Database Config**: `/home/global_exim_trader/config/database.js`
- **PM2 Process Name**: `global-exim` (ID: `6`)
- **Active Port**: `3004` (Internal localhost only)
- **Log Files**:
  - Out Log: `/root/.pm2/logs/global-exim-out.log`
  - Error Log: `/root/.pm2/logs/global-exim-error.log`

---

## 4. Nginx Server Configuration

Configuration file location: `/etc/nginx/sites-available/getashokaazjewels.shop`  
Symlink location: `/etc/nginx/sites-enabled/getashokaazjewels.shop`

```nginx
server {
    listen 80;
    server_name getashokaazjewels.shop www.getashokaazjewels.shop;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name getashokaazjewels.shop www.getashokaazjewels.shop;

    ssl_certificate /etc/letsencrypt/live/getashokaazjewels.shop/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/getashokaazjewels.shop/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /home/global_exim_trader/dist;
    index index.html;

    # Frontend Single Page App (SPA) fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Reverse proxy to Node.js backend on Port 3004
    location /api/ {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 50M;
}
```

> ⚠️ **Nginx Warning Notice**: Ensure `/etc/nginx/sites-available/lakhera.conf` does not contain any certbot-injected shadow blocks for `getashokaazjewels.shop` with `return 404;`.

---

## 5. Deployment Procedures (Step-by-Step)

### A. Frontend Deployment (When Client Code Changes)

1. **Build bundle locally:**
   ```bash
   cd /Users/adityasharma/Desktop/global/client
   npm run build
   cd dist
   tar -czf ../../frontend-build.tar.gz .
   ```

2. **Upload archive to server:**
   ```bash
   cd /Users/adityasharma/Desktop/global
   /opt/homebrew/bin/sshpass -P "passphrase" -p "1234" scp -o StrictHostKeyChecking=no frontend-build.tar.gz aditya@195.35.45.17:/home/aditya/frontend-build.tar.gz
   ```

3. **Deploy on server & reload Nginx:**
   ```bash
   /opt/homebrew/bin/sshpass -P "passphrase" -p "1234" ssh -o StrictHostKeyChecking=no aditya@195.35.45.17 "echo 'RuhiRiya@12345' | sudo -S bash -c '
     mkdir -p /home/global_exim_trader/dist_new
     tar -xzf /home/aditya/frontend-build.tar.gz -C /home/global_exim_trader/dist_new
     rm -rf /home/global_exim_trader/dist_backup
     [ -d /home/global_exim_trader/dist ] && mv /home/global_exim_trader/dist /home/global_exim_trader/dist_backup
     mv /home/global_exim_trader/dist_new /home/global_exim_trader/dist
     chown -R www-data:www-data /home/global_exim_trader/dist
     chmod -R 755 /home/global_exim_trader/dist
     rm -f /home/aditya/frontend-build.tar.gz
     systemctl reload nginx
   '"
   ```

---

### B. Backend Deployment (When Server Code Changes)

1. **Upload specific changed backend files (e.g. `authController.js`):**
   ```bash
   /opt/homebrew/bin/sshpass -P "passphrase" -p "1234" scp -o StrictHostKeyChecking=no server/controllers/authController.js aditya@195.35.45.17:/home/aditya/
   ```

2. **Copy to application directory & restart PM2:**
   ```bash
   /opt/homebrew/bin/sshpass -P "passphrase" -p "1234" ssh -o StrictHostKeyChecking=no aditya@195.35.45.17 "echo 'RuhiRiya@12345' | sudo -S bash -c '
     cp /home/aditya/authController.js /home/global_exim_trader/controllers/
     rm -f /home/aditya/authController.js
     pm2 restart global-exim
   '"
   ```
