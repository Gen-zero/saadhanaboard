const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'saadhanaboard',
  password: process.env.DB_PASSWORD || 'root',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

async function checkUsers() {
  try {
    console.log('Checking users in database...');
    const result = await pool.query('SELECT id, email, display_name FROM users');
    console.log('Users in database:');
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.display_name})`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkUsers();