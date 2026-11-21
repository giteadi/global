# Global Exim Traders / Get AshokaaZ™ - Engineering & Operations Memory

Welcome to the central engineering knowledge base for **Get AshokaaZ™ / Global Exim Traders**. This repository of documentation details server infrastructure, production access, architecture, deployment pipelines, database schemas, and maintenance guides.

---

## 📚 Documentation Index

| Document | Purpose | Key Contents |
| :--- | :--- | :--- |
| [**SERVER_AND_DEPLOYMENT.md**](./SERVER_AND_DEPLOYMENT.md) | Production VPS & Deployment | Hostinger IP, SSH keys, sudo credentials, paths, PM2, Nginx, step-by-step deploy commands |
| [**ARCHITECTURE.md**](./ARCHITECTURE.md) | Technical Architecture & Design | Frontend stack, Apple HIG mobile navigation, Backend REST API, Admin Route guards, auth flow |
| [**DATABASE_AND_CREDENTIALS.md**](./DATABASE_AND_CREDENTIALS.md) | Database & API Credentials | MySQL config, users table, products table, Razorpay, Cloudinary, JWT secret |
| [**MAINTENANCE_AND_TROUBLESHOOTING.md**](./MAINTENANCE_AND_TROUBLESHOOTING.md) | Ops & Debugging Cheat Sheet | PM2 commands, Nginx logs, Certbot renewal, React Error #310 fix, common pitfall guide |

---

## 🌐 Quick Reference Summary

- **Production Live URL**: [https://getashokaazjewels.shop](https://getashokaazjewels.shop)
- **Production API Base**: `https://getashokaazjewels.shop/api`
- **Server IP**: `195.35.45.17` (Hostinger KVM VPS)
- **SSH User**: `aditya@195.35.45.17` (Passphrase: `1234`, Sudo: `RuhiRiya@12345`)
- **Backend Process**: PM2 `global-exim` (Port: `3004`)
- **Web Root**: `/home/global_exim_trader/dist`
- **Database**: MySQL `global_exim` on `127.0.0.1:3306`

---

*Last Updated: November 2026*  
*Maintained for: Global Exim Traders / Get AshokaaZ™*
