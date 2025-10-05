const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'saadhanaboard',
  password: process.env.DB_PASSWORD || 'root',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

async function resetPassword(email, newPassword) {
  try {
    console.log(`Resetting password for user: ${email}`);
    
    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update the user's password
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING id, email, display_name',
      [hashedPassword, email]
    );
    
    if (result.rows.length > 0) {
      console.log('Password updated successfully for user:', result.rows[0]);
    } else {
      console.log('User not found with email:', email);
    }
  } catch (error) {
    console.error('Error resetting password:', error.message);
  } finally {
    await pool.end();
  }
}

// Reset password for test@example.com
resetPassword('test@example.com', 'password');