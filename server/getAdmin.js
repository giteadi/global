const { pool } = require('./config/database');

async function getAdminCredentials() {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, password, role FROM users WHERE role = ?',
      ['admin']
    );

    if (rows.length > 0) {
      console.log('Admin credentials found:');
      rows.forEach(user => {
        console.log(`ID: ${user.id}`);
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${user.password}`);
        console.log(`Role: ${user.role}`);
        console.log('---');
      });
    } else {
      console.log('No admin users found in the database.');
    }
  } catch (error) {
    console.error('Error fetching admin credentials:', error);
  } finally {
    process.exit();
  }
}

getAdminCredentials();
