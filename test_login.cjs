const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const JWT_SECRET = process.env.JWT_SECRET || 'saadhanaboard_secret_key';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'saadhanaboard',
  password: process.env.DB_PASSWORD || 'root',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

async function testLogin(email, password) {
  try {
    console.log(`Testing login for email: ${email}`);
    
    // Find user
    const result = await pool.query(
      'SELECT id, email, display_name, password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('User not found');
      return;
    }

    const user = result.rows[0];
    console.log('User found:', user.email, user.display_name);

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);
    
    if (isPasswordValid) {
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      console.log('Login successful! Token generated.');
      console.log('Token:', token.substring(0, 50) + '...');
    } else {
      console.log('Invalid password');
    }
  } catch (error) {
    console.error('Login test failed:', error.message);
  } finally {
    await pool.end();
  }
}

// Test with a sample user
// You can change these credentials to test with different users
const testEmail = 'test@example.com';
const testPassword = 'password'; // Use the actual password for this user

testLogin(testEmail, testPassword);