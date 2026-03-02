-- Updated Database initialization script for Global Exim Traders
-- Run this script to create all necessary tables with modifications

DROP TABLE IF EXISTS payment_transactions;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Users table (updated)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('customer', 'admin') DEFAULT 'customer',
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
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
  INDEX idx_role (role),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Categories table (updated)
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(10) DEFAULT '🏷️',
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_status (status),
  INDEX idx_is_active (is_active)
);

-- Products table (updated)
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL, -- Changed from category_id to category name for easier queries
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
  INDEX idx_category (category),
  INDEX idx_price (price),
  INDEX idx_is_active_featured (is_active, is_featured),
  INDEX idx_created_at (created_at),
  INDEX idx_stock (stock),
  FULLTEXT idx_name_description (name, description)
);

-- Carts table (updated)
CREATE TABLE IF NOT EXISTS carts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) DEFAULT 0.00,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_updated_at (updated_at)
);

-- Cart items table (updated)
CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10) DEFAULT '🏛️',
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  category VARCHAR(100),
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_cart (cart_id),
  INDEX idx_product (product_id)
);

-- Orders table (updated with payment fields)
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  order_status ENUM('Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned') DEFAULT 'Processing',
  payment_method ENUM('COD', 'UPI', 'Card', 'Net Banking') DEFAULT 'COD',
  payment_status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0.00,
  shipping DECIMAL(10,2) DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL,
  tracking_number VARCHAR(100),
  transaction_id VARCHAR(100),
  payment_date DATETIME,
  refund_amount DECIMAL(10,2),
  refund_reason TEXT,
  refund_date DATETIME,
  refund_transaction_id VARCHAR(100),
  notes TEXT,
  expected_delivery DATE,
  shipping_address JSON, -- Store shipping address as JSON
  items JSON, -- Store order items as JSON for easier retrieval
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_order_status (order_status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at),
  INDEX idx_transaction_id (transaction_id)
);

-- Order items table (legacy - kept for compatibility)
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10) DEFAULT '🏛️',
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  category VARCHAR(100),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_order (order_id),
  INDEX idx_product (product_id)
);

-- Payment transactions table (new)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  payment_method ENUM('COD', 'UPI', 'Card', 'Net Banking') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
  gateway_response JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order (order_id),
  INDEX idx_transaction_id (transaction_id),
  INDEX idx_status (status)
);

-- User sessions table (new)
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at)
);

-- Activity logs table (new)
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  details JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_created_at (created_at)
);

-- Insert sample categories
INSERT IGNORE INTO categories (name, description, icon, status) VALUES
('Temple Heritage', 'Traditional temple jewelry and artifacts', '🏛️', 'Active'),
('Contemporary Ethnic', 'Modern ethnic fashion jewelry', '💎', 'Active'),
('Handcrafted Decor', 'Handcrafted decorative items', '🏺', 'Active'),
('Export Grade', 'Premium export quality products', '📦', 'Active');

-- Insert sample admin user (password: admin123)
INSERT IGNORE INTO users (name, email, password, role, status) VALUES
('Admin', 'admin@globaleximtraders.com', 'admin123', 'admin', 'Active');

-- Insert sample customers
INSERT IGNORE INTO users (name, email, password, role, status, phone, city, state) VALUES
('Rahul Sharma', 'rahul@example.com', 'password2', 'customer', 'Active', '9876543210', 'Mumbai', 'Maharashtra'),
('Priya Patel', 'priya@example.com', 'password3', 'customer', 'Active', '9876543211', 'Delhi', 'Delhi'),
('Amit Singh', 'amit@example.com', 'password4', 'customer', 'Active', '9876543212', 'Jaipur', 'Rajasthan');

-- Insert sample products with category names
INSERT IGNORE INTO products (name, description, category, price, icon, material, craftsmanship, stock, is_featured) VALUES
('Temple Necklace Set', 'Traditional temple jewelry with intricate gold work', 'Temple Heritage', 299.00, '🏛️', 'Gold Plated Brass', 'Handcrafted', 25, true),
('Ethnic Earrings', 'Modern ethnic design with traditional motifs', 'Contemporary Ethnic', 149.00, '💎', 'Brass with Stones', 'Handcrafted', 40, true),
('Handcrafted Decor Vase', 'Artisan vase with traditional Indian patterns', 'Handcrafted Decor', 199.00, '🏺', 'Brass', 'Handcrafted', 15, true),
('Export Bracelet Set', 'Premium quality bracelet set for global markets', 'Export Grade', 249.00, '📦', 'Gold Plated Brass', 'Machine Crafted', 30, true),
('Peacock Motif Necklace', 'Regal peacock design inspired by Indian royalty', 'Temple Heritage', 399.00, '🦚', 'Gold Plated Brass', 'Handcrafted', 20, false),
('Kundan Pendant Set', 'Elegant kundan work with modern styling', 'Contemporary Ethnic', 349.00, '🌸', 'Gold with Kundan', 'Handcrafted', 18, false),
('Brass Decor Set', 'Traditional brass decorative items', 'Handcrafted Decor', 179.00, '🏛️', 'Brass', 'Handcrafted', 12, false),
('Global Collection Set', 'Complete export-ready jewelry collection', 'Export Grade', 449.00, '📦', 'Mixed Metals', 'Mixed', 8, false);

-- Insert sample orders
INSERT IGNORE INTO orders (user_id, order_status, payment_method, payment_status, subtotal, tax, shipping, total, items, shipping_address, created_at) VALUES
(2, 'Delivered', 'Card', 'Completed', 299.00, 29.90, 0.00, 328.90, 
 JSON_ARRAY(JSON_OBJECT('product_id', 1, 'name', 'Temple Necklace Set', 'price', 299.00, 'quantity', 1, 'category', 'Temple Heritage')),
 JSON_OBJECT('name', 'Priya Patel', 'phone', '9876543211', 'email', 'priya@example.com', 'street', '123 Main St', 'city', 'Delhi', 'state', 'Delhi', 'pincode', '110001', 'country', 'India'),
 '2024-02-20 10:30:00'),
(3, 'Processing', 'UPI', 'Pending', 448.00, 44.80, 50.00, 542.80,
 JSON_ARRAY(JSON_OBJECT('product_id', 2, 'name', 'Ethnic Earrings', 'price', 149.00, 'quantity', 1, 'category', 'Contemporary Ethnic'), JSON_OBJECT('product_id', 3, 'name', 'Handcrafted Decor Vase', 'price', 199.00, 'quantity', 1, 'category', 'Handcrafted Decor'), JSON_OBJECT('product_id', 4, 'name', 'Export Bracelet Set', 'price', 249.00, 'quantity', 1, 'category', 'Export Grade')),
 JSON_OBJECT('name', 'Amit Singh', 'phone', '9876543212', 'email', 'amit@example.com', 'street', '456 Park Ave', 'city', 'Jaipur', 'state', 'Rajasthan', 'pincode', '302001', 'country', 'India'),
 '2024-02-27 14:15:00'),
(2, 'Shipped', 'COD', 'Pending', 199.00, 19.90, 0.00, 218.90,
 JSON_ARRAY(JSON_OBJECT('product_id', 3, 'name', 'Handcrafted Decor Vase', 'price', 199.00, 'quantity', 1, 'category', 'Handcrafted Decor')),
 JSON_OBJECT('name', 'Priya Patel', 'phone', '9876543211', 'email', 'priya@example.com', 'street', '123 Main St', 'city', 'Delhi', 'state', 'Delhi', 'pincode', '110001', 'country', 'India'),
 '2024-02-26 09:45:00');

-- Insert sample payment transactions
INSERT IGNORE INTO payment_transactions (order_id, transaction_id, payment_method, amount, status) VALUES
(1, 'TXN20240220001', 'Card', 328.90, 'Completed'),
(2, 'TXN20240227001', 'UPI', 542.80, 'Pending');

-- Insert sample activity logs
INSERT IGNORE INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES
(1, 'LOGIN', 'user', 1, JSON_OBJECT('email', 'admin@globaleximtraders.com')),
(2, 'ORDER_CREATED', 'order', 1, JSON_OBJECT('order_id', 1, 'total', 328.90)),
(3, 'ORDER_CREATED', 'order', 2, JSON_OBJECT('order_id', 2, 'total', 542.80)),
(2, 'ORDER_CREATED', 'order', 3, JSON_OBJECT('order_id', 3, 'total', 218.90));
