const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'saadhanaboard',
  password: process.env.DB_PASSWORD || 'root',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const client = await pool.connect();
    console.log('Connected successfully!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('Current database time:', result.rows[0].current_time);
    
    // Check if users table exists
    try {
      const tableCheck = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      `);
      
      if (tableCheck.rows.length > 0) {
        console.log('Users table exists');
        
        // Check if there are any users
        const userCount = await client.query('SELECT COUNT(*) as count FROM users');
        console.log('Number of users in database:', userCount.rows[0].count);
        
        if (userCount.rows[0].count > 0) {
          const users = await client.query('SELECT id, email, display_name FROM users LIMIT 5');
          console.log('Sample users:', users.rows);
        }
      } else {
        console.log('Users table does not exist');
      }
    } catch (err) {
      console.log('Error checking users table:', err.message);
    }
    
    client.release();
  } catch (err) {
    console.error('Database connection failed:', err.message);
    console.error('Please check:');
    console.error('1. PostgreSQL service is running');
    console.error('2. Database credentials in backend/.env are correct');
    console.error('3. Database "saadhanaboard" exists');
  } finally {
    await pool.end();
  }
}

testConnection();