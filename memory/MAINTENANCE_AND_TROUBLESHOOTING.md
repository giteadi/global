# Operations, Maintenance & Troubleshooting Guide

> **Diagnostics & Troubleshooting Handbook**: Practical runbooks, emergency commands, and solutions for recurring issues encountered on **Get AshokaaZ™ / Global Exim Traders**.

---

## 1. Quick Diagnostics Commands

Run from local terminal (Mac) using sshpass:

```bash
# 1. Check PM2 status
/opt/homebrew/bin/sshpass -P "passphrase" -p "1234" ssh -o StrictHostKeyChecking=no aditya@195.35.45.17 "echo 'RuhiRiya@12345' | sudo -S pm2 status"

# 2. View Backend Real-Time Logs
/opt/homebrew/bin/sshpass -P "passphrase" -p "1234" ssh -o StrictHostKeyChecking=no aditya@195.35.45.17 "echo 'RuhiRiya@12345' | sudo -S pm2 logs global-exim --lines 50 --nostream"

# 3. Test Local Backend Port (Port 3004)
/opt/homebrew/bin/sshpass -P "passphrase" -p "1234" ssh -o StrictHostKeyChecking=no aditya@195.35.45.17 "echo 'RuhiRiya@12345' | sudo -S curl -s http://localhost:3004/api/products?limit=1"

# 4. Verify Nginx Configuration & Reload
/opt/homebrew/bin/sshpass -P "passphrase" -p "1234" ssh -o StrictHostKeyChecking=no aditya@195.35.45.17 "echo 'RuhiRiya@12345' | sudo -S bash -c 'nginx -t && systemctl reload nginx'"

# 5. Check MySQL Service
/opt/homebrew/bin/sshpass -P "passphrase" -p "1234" ssh -o StrictHostKeyChecking=no aditya@195.35.45.17 "echo 'RuhiRiya@12345' | sudo -S systemctl status mysql"
```

---

## 2. Solutions to Known Production Issues

### Issue 1: React Error #310 ("Rendered more hooks than previous render")
- **Cause**: Declaring React hooks (`useMemo`, `useCallback`, `useEffect`) after an early `if (loading) return ...` statement.
- **Rule**: In React components (such as `ProductDetail.jsx` and `AdminLayout.jsx`), **ALL** hooks must be placed at the very top of the component function, before any conditional return statements.
- **Verification**: Run `cd client && npx eslint src/` to verify zero hook order violations.

---

### Issue 2: Nginx Conflicting Server Name / 404 Shadowing
- **Symptom**: Nginx outputs `[warn] conflicting server name "getashokaazjewels.shop" on 0.0.0.0:443, ignored` and domain returns 404.
- **Cause**: Certbot sometimes appends automatic server blocks with `return 404;` into other configuration files (e.g. `/etc/nginx/sites-available/lakhera.conf`).
- **Fix**:
  1. Search for rogue entries: `grep -rn "getashokaazjewels.shop" /etc/nginx/sites-available/`
  2. Remove duplicate blocks from other files.
  3. Keep the single authoritative config in `/etc/nginx/sites-available/getashokaazjewels.shop`.
  4. Test and reload: `nginx -t && systemctl reload nginx`.

---

### Issue 3: Hardcoded Mock in `authController.getProfile`
- **Symptom**: Every logged-in user displays as "Admin" (`admin@globaleximtraders.com`) and sees the Admin button in the navbar.
- **Cause**: `server/controllers/authController.js` had a static test mock in `getProfile`.
- **Fix**: Must always read the authenticated user from `req.user` populated by the `auth` middleware from MySQL database.

---

### Issue 4: Preload Resource Warnings (`buddha-image.jpg`)
- **Symptom**: Browser warns: `The resource buddha-image.jpg was preloaded using link preload but not used within a few seconds...`
- **Cause**: Hardcoding `<link rel="preload" href="/assets/buddha-image.jpg" ...>` in `client/index.html`.
- **Fix**: Remove the preload tag from `index.html`. Vite automatically bundles, hashes, and optimizes CSS background images (`buddha-image-*.jpg`).

---

### Issue 5: SSL Certificate Renewal
Certificates are managed by Certbot. To test renewal:
```bash
/opt/homebrew/bin/sshpass -P "passphrase" -p "1234" ssh aditya@195.35.45.17 "echo 'RuhiRiya@12345' | sudo -S certbot renew --dry-run"
```
Certificates automatically renew via systemd timer/cron. Active certificate path:
`/etc/letsencrypt/live/getashokaazjewels.shop/fullchain.pem`
