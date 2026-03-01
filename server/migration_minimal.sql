-- Minimal Migration script for Global Exim Traders Database
-- Only add missing tables and columns

USE global_exim;

-- Modify users table role column if needed
ALTER TABLE users 
MODIFY COLUMN role ENUM('customer', 'admin') DEFAULT 'customer';

-- Update existing users role from 'user' to 'customer'
UPDATE users SET role = 'customer' WHERE role = 'user';

-- Check if categories table has status column, add if missing
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS status ENUM('Active', 'Inactive') DEFAULT 'Active' AFTER icon;

-- Check if orders table has JSON columns, add if missing
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS items JSON AFTER shipping_country,
ADD COLUMN IF NOT EXISTS shipping_address JSON AFTER items,
ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(100) AFTER tracking_number,
ADD COLUMN IF NOT EXISTS payment_date DATETIME AFTER payment_status,
ADD COLUMN IF NOT EXISTS refund_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS refund_reason TEXT,
ADD COLUMN IF NOT EXISTS refund_date DATETIME,
ADD COLUMN IF NOT EXISTS refund_transaction_id VARCHAR(100);

-- Create payment_transactions table if not exists
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

-- Create user_sessions table if not exists
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

-- Create activity_logs table if not exists
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

-- Update existing orders with JSON data (only if items is NULL)
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
)
WHERE o.items IS NULL AND o.id IN (
  SELECT DISTINCT order_id FROM order_items
);

-- Update shipping address for orders (only if NULL)
UPDATE orders o
SET o.shipping_address = JSON_OBJECT(
  'name', o.shipping_name,
  'phone', o.shipping_phone,
  'email', o.shipping_email,
  'street', o.shipping_street,
  'city', o.shipping_city,
  'state', o.shipping_state,
  'pincode', o.shipping_pincode,
  'country', o.shipping_country
)
WHERE o.shipping_address IS NULL;

-- Insert sample data if not exists
INSERT IGNORE INTO categories (name, description, icon, status) VALUES
('Temple Heritage', 'Traditional temple jewelry and artifacts', '🏛️', 'Active'),
('Contemporary Ethnic', 'Modern ethnic fashion jewelry', '💎', 'Active'),
('Handcrafted Decor', 'Handcrafted decorative items', '🏺', 'Active'),
('Export Grade', 'Premium export quality products', '📦', 'Active');

INSERT IGNORE INTO users (name, email, password, role, status) VALUES
('Admin', 'admin@globaleximtraders.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Active');

INSERT IGNORE INTO users (name, email, password, role, status, phone, city, state) VALUES
('Rahul Sharma', 'rahul@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'Active', '9876543210', 'Mumbai', 'Maharashtra'),
('Priya Patel', 'priya@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'Active', '9876543211', 'Delhi', 'Delhi'),
('Amit Singh', 'amit@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'Active', '9876543212', 'Jaipur', 'Rajasthan');

INSERT IGNORE INTO products (name, description, category, price, icon, material, craftsmanship, stock, is_featured) VALUES
('Temple Necklace Set', 'Traditional temple jewelry with intricate gold work', 'Temple Heritage', 299.00, '🏛️', 'Gold Plated Brass', 'Handcrafted', 25, true),
('Ethnic Earrings', 'Modern ethnic design with traditional motifs', 'Contemporary Ethnic', 149.00, '💎', 'Brass with Stones', 'Handcrafted', 40, true),
('Handcrafted Decor Vase', 'Artisan vase with traditional Indian patterns', 'Handcrafted Decor', 199.00, '🏺', 'Brass', 'Handcrafted', 15, true),
('Export Bracelet Set', 'Premium quality bracelet set for global markets', 'Export Grade', 249.00, '📦', 'Gold Plated Brass', 'Machine Crafted', 30, true),
('Peacock Motif Necklace', 'Regal peacock design inspired by Indian royalty', 'Temple Heritage', 399.00, '🦚', 'Gold Plated Brass', 'Handcrafted', 20, false),
('Kundan Pendant Set', 'Elegant kundan work with modern styling', 'Contemporary Ethnic', 349.00, '🌸', 'Gold with Kundan', 'Handcrafted', 18, false),
('Brass Decor Set', 'Traditional brass decorative items', 'Handcrafted Decor', 179.00, '🏛️', 'Brass', 'Handcrafted', 12, false),
('Global Collection Set', 'Complete export-ready jewelry collection', 'Export Grade', 449.00, '📦', 'Mixed Metals', 'Mixed', 8, false);

-- Show final status
SELECT 'Migration completed successfully!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_categories FROM categories;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_orders FROM orders;
SELECT COUNT(*) as total_payment_transactions FROM payment_transactions;
