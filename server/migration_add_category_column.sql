-- Migration to add category column and update existing data
USE global_exim;

-- Check if category column exists, if not add it
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category VARCHAR(100) AFTER description;

-- Update existing products with category names from category_id
UPDATE products p
LEFT JOIN categories c ON p.category_id = c.id
SET p.category = c.name
WHERE p.category IS NULL AND p.category_id IS NOT NULL;

-- Add index on category
CREATE INDEX IF NOT EXISTS idx_category_name ON products(category);

-- Note: We're keeping category_id for backward compatibility
-- You can drop it later if needed with: ALTER TABLE products DROP COLUMN category_id;
