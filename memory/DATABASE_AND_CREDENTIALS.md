# Database Schema, Configuration & Credentials

> **Confidential Document**: Details database connection parameters, table schemas, default records, and external service credentials for **Get AshokaaZ™ / Global Exim Traders**.

---

## 1. MySQL Production Database Details

| Parameter | Production Value |
| :--- | :--- |
| **Database Engine** | MySQL 8.0 |
| **Database Name** | `global_exim` |
| **Host** | `127.0.0.1` |
| **Port** | `3306` |
| **Database User** | `root` |
| **Database Password** | `Tiger@123` |
| **Connection Pool** | Configured in `server/config/database.js` |

---

## 2. Core Tables Schema

### A. `users` Table
```sql
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'customer',
  `status` varchar(50) DEFAULT 'Active',
  `street` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(20) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'India',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
```

### Verified User Accounts in Database:
- **Admin**: `admin@globaleximtraders.com` (Role: `admin`)
- **Customers**:
  - `rahul@example.com` (Role: `customer`)
  - `priya@example.com` (Role: `customer`)
  - `amit@example.com` (Role: `customer`)
  - `akshaykumar.byndoor@gmail.com` (Role: `customer`)
  - `kavinrnivak@gmail.com` (Role: `customer`)

---

### B. `products` Table
```sql
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `images` json DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  `craftsmanship` varchar(255) DEFAULT NULL,
  `origin` varchar(255) DEFAULT NULL,
  `weight` varchar(100) DEFAULT NULL,
  `dimensions` varchar(100) DEFAULT NULL,
  `care` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);
```

---

### C. Other Tables
- `categories`: Store product categories (`id`, `name`, `description`, `icon`, `is_active`)
- `orders` & `order_items`: Customer orders, tracking, item associations, transaction IDs
- `cart`: Shopping cart persistence for logged in users
- `activity_logs`: Audit trail for logins, order creations, and updates

---

## 3. Environment Variables (`server/.env`)

```env
DATABASE=global_exim
HOST=localhost
DB_USER=root
PASSWORD=Tiger@123
JWT_SECRET=global
NODE_ENV=production
PORT=3004

# Email Services (Nodemailer)
EMAIL_USER=adityasharma10102000@gmail.com
EMAIL_PASS=ntorfozwazlaronr

# Cloudinary CDN
CLOUDINARY_CLOUD_NAME=wpcsars
CLOUDINARY_API_KEY=747261452285263
CLOUDINARY_API_SECRET=NpDuGV0bVVOtTKI89MDDMzgbJ2w

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_live_SEpkuM9oHkuG2N
RAZORPAY_SECRET=vdsNULssotoxU16k93Dep6xd
```

---

## 4. Client Environment Variables (`client/.env`)

```env
VITE_API_BASE_URL=https://getashokaazjewels.shop
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
```
