const { pool } = require('./config/database')

async function createContactsTable() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS contacts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('New', 'In Progress', 'Resolved') DEFAULT 'New',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `

    await pool.query(createTableQuery)
    console.log('✅ Contacts table created successfully!')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating contacts table:', error.message)
    process.exit(1)
  }
}

createContactsTable()
