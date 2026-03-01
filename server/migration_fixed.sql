-- Fixed Migration script for Global Exim Traders Database
-- This script will modify existing tables and add new ones

USE global_exim;

-- Modify users table
ALTER TABLE users 
MODIFY COLUMN role ENUM('customer', 'admin') DEFAULT 'customer',
ADD COLUMN status ENUM('Active', 'Inactive') DEFAULT 'Active' AFTER role;

-- Update existing users role from 'user' to 'customer'
UPDATE users SET role = 'customer' WHERE role = 'user';

-- Modify categories table  
ALTER TABLE categories
ADD COLUMN status ENUM('Active', 'Inactive') DEFAULT 'Active' AFTER icon;

-- Modify orders table to add JSON fields
ALTER TABLE orders
ADD COLUMN items JSON AFTER shipping_country,
ADD COLUMN shipping_address JSON AFTER items,
ADD COLUMN transaction_id VARCHAR(100) AFTER tracking_number,
ADD COLUMN payment_date DATETIME AFTER payment_status,
ADD COLUMN refund_amount DECIMAL(10,2),
ADD COLUMN refund_reason TEXT,
ADD COLUMN refund_date DATETIME,
ADD COLUMN refund_transaction_id VARCHAR(100);

-- Create payment_transactions table
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

-- Create user_sessions table
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

-- Create activity_logs table
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

-- Update existing orders with JSON data
UPDATE orders o
SET o.items = (
  SELECT JSON_ARRAYAGG(
    JSON_OBJECT(
      'product', oi.product_id,
      'name', oi.name,
      'icon', oi.icon,
      'price', oi.price,
      'quantity', oi.quantity,
      'category', oi.category
    )
  )
  FROM order_items oi 
  WHERE oi.order_id = o.id
),
o.shipping_address = JSON_OBJECT(
  'name', o.shipping_name,
  'phone', o.shipping_phone,
  'email', o.shipping_email,
  'street', o.shipping_street,
  'city', o.shipping_city,
  'state', o.shipping_state,
  'pincode', o.shipping_pincode,
  'country', o.shipping_country
)
WHERE o.id IS NOT NULL;

-- Insert sample categories if not exists
INSERT IGNORE INTO categories (name, description, icon, status) VALUES
('Temple Heritage', 'Traditional temple jewelry and artifacts', '🏛️', 'Active'),
('Contemporary Ethnic', 'Modern ethnic fashion jewelry', '💎', 'Active'),
('Handcrafted Decor', 'Handcrafted decorative items', '🏺', 'Active'),
('Export Grade', 'Premium export quality products', '📦', 'Active');

-- Insert sample admin user if not exists
INSERT IGNORE INTO users (name, email, password, role, status) VALUES
('Admin', 'admin@globaleximtraders.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Active');

-- Insert sample customers if not exists
INSERT IGNORE INTO users (name, email, password, role, status, phone, city, state) VALUES
('Rahul Sharma', 'rahul@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'Active', '9876543210', 'Mumbai', 'Maharashtra'),
('Priya Patel', 'priya@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'Active', '9876543211', 'Delhi', 'Delhi'),
('Amit Singh', 'amit@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'Active', '9876543212', 'Jaipur', 'Rajasthan');

-- Insert sample products with category names if not exists
INSERT IGNORE INTO products (name, description, category, price, icon, material, craftsmanship, stock, is_featured) VALUES
('Temple Necklace Set', 'Traditional temple jewelry with intricate gold work', 'Temple Heritage', 299.00, '🏛️', 'Gold Plated Brass', 'Handcrafted', 25, true),
('Ethnic Earrings', 'Modern ethnic design with traditional motifs', 'Contemporary Ethnic', 149.00, '💎', 'Brass with Stones', 'Handcrafted', 40, true),
('Handcrafted Decor Vase', 'Artisan vase with traditional Indian patterns', 'Handcrafted Decor', 199.00, '🏺', 'Brass', 'Handcrafted', 15, true),
('Export Bracelet Set', 'Premium quality bracelet set for global markets', 'Export Grade', 249.00, '📦', 'Gold Plated Brass', 'Machine Crafted', 30, true),
('Peacock Motif Necklace', 'Regal peacock design inspired by Indian royalty', 'Temple Heritage', 399.00, '🦚', 'Gold Plated Brass', 'Handcrafted', 20, false),
('Kundan Pendant Set', 'Elegant kundan work with modern styling', 'Contemporary Ethnic', 349.00, '🌸', 'Gold with Kundan', 'Handcrafted', 18, false),
('Brass Decor Set', 'Traditional brass decorative items', 'Handcrafted Decor', 179.00, '🏛️', 'Brass', 'Handcrafted', 12, false),
('Global Collection Set', 'Complete export-ready jewelry collection', 'Export Grade', 449.00, '📦', 'Mixed Metals', 'Mixed', 8, false);

-- Insert sample orders if not exists
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

-- Show final status
SELECT 'Migration completed successfully!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_categories FROM categories;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_orders FROM orders;
