-- Database initialization script for Global Exim Traders
-- Run this script to create all necessary tables

CREATE DATABASE IF NOT EXISTS global_exim;
USE global_exim;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'admin') DEFAULT 'user',
  street VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(20),
  country VARCHAR(100) DEFAULT 'India',
  is_active BOOLEAN DEFAULT TRUE,
  last_login DATETIME,
  reset_password_token VARCHAR(255),
  reset_password_expire DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(10) DEFAULT '🏷️',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_is_active (is_active)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category_id INT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount DECIMAL(5,2),
  icon VARCHAR(10) DEFAULT '🏛️',
  material VARCHAR(100),
  craftsmanship VARCHAR(100),
  origin VARCHAR(100) DEFAULT 'Rajasthan, India',
  weight VARCHAR(50),
  dimensions VARCHAR(100),
  care TEXT,
  stock INT DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  images JSON,
  features JSON,
  tags JSON,
  ratings_average DECIMAL(3,2) DEFAULT 0.00,
  ratings_count INT DEFAULT 0,
  seo_meta_title VARCHAR(255),
  seo_meta_description TEXT,
  seo_keywords JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_category (category_id),
  INDEX idx_price (price),
  INDEX idx_is_active_featured (is_active, is_featured),
  INDEX idx_created_at (created_at),
  FULLTEXT idx_name_description (name, description)
);

-- Carts table
CREATE TABLE IF NOT EXISTS carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) DEFAULT 0.00,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_updated_at (updated_at)
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10) DEFAULT '🏛️',
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  category_id INT,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_cart (cart_id),
  INDEX idx_product (product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  shipping_name VARCHAR(100) NOT NULL,
  shipping_phone VARCHAR(20) NOT NULL,
  shipping_email VARCHAR(255),
  shipping_street VARCHAR(255) NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_state VARCHAR(100) NOT NULL,
  shipping_pincode VARCHAR(20) NOT NULL,
  shipping_country VARCHAR(100) DEFAULT 'India',
  payment_method ENUM('COD', 'UPI', 'Card', 'Net Banking') DEFAULT 'COD',
  payment_status ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending',
  order_status ENUM('Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned') DEFAULT 'Processing',
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0.00,
  shipping DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL,
  tracking_number VARCHAR(100),
  notes TEXT,
  expected_delivery DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_order_status (order_status),
  INDEX idx_created_at (created_at),
  INDEX idx_shipping_email (shipping_email)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10) DEFAULT '🏛️',
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  category_id INT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_order (order_id),
  INDEX idx_product (product_id)
);

-- Insert sample categories
INSERT IGNORE INTO categories (name, description, icon) VALUES
('Temple Heritage', 'Traditional temple jewelry and artifacts', '🏛️'),
('Contemporary Ethnic', 'Modern ethnic fashion jewelry', '💎'),
('Handcrafted Decor', 'Handcrafted decorative items', '🏺'),
('Export Grade', 'Premium export quality products', '📦');

-- Insert sample admin user (password: admin123)
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin', 'admin@globaleximtraders.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample products
INSERT IGNORE INTO products (name, description, category_id, price, icon, material, craftsmanship, stock, is_featured) VALUES
('Temple Necklace Set', 'Traditional temple jewelry with intricate gold work', 1, 299.00, '🏛️', 'Gold Plated Brass', 'Handcrafted', 25, true),
('Ethnic Earrings', 'Modern ethnic design with traditional motifs', 2, 149.00, '💎', 'Brass with Stones', 'Handcrafted', 40, true),
('Handcrafted Decor Vase', 'Artisan vase with traditional Indian patterns', 3, 199.00, '🏺', 'Brass', 'Handcrafted', 15, true),
('Export Bracelet Set', 'Premium quality bracelet set for global markets', 4, 249.00, '📦', 'Gold Plated Brass', 'Machine Crafted', 30, true),
('Peacock Motif Necklace', 'Regal peacock design inspired by Indian royalty', 1, 399.00, '🦚', 'Gold Plated Brass', 'Handcrafted', 20, false),
('Kundan Pendant Set', 'Elegant kundan work with modern styling', 2, 349.00, '🌸', 'Gold with Kundan', 'Handcrafted', 18, false),
('Brass Decor Set', 'Traditional brass decorative items', 3, 179.00, '🏛️', 'Brass', 'Handcrafted', 12, false),
('Global Collection Set', 'Complete export-ready jewelry collection', 4, 449.00, '📦', 'Mixed Metals', 'Mixed', 8, false);
