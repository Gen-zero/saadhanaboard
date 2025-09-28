/**
 * Script to check if admin user exists and verify credentials
 */
require('dotenv').config();
const db = require('./config/db');
const bcrypt = require('bcrypt');

async function checkAdmin() {
  try {
    // Check if admin_details table exists
    const tableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'admin_details'
      )
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('admin_details table does not exist!');
      process.exit(1);
    }
    
    console.log('admin_details table exists');
    
    // Check if admin user exists
    const adminResult = await db.query(`
      SELECT id, username, email, password_hash, active 
      FROM admin_details 
      WHERE username = $1
    `, ['KaliVaibhav']);
    
    if (adminResult.rows.length === 0) {
      console.log('Admin user KaliVaibhav not found!');
      process.exit(1);
    }
    
    const admin = adminResult.rows[0];
    console.log('Admin user found:', {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      active: admin.active
    });
    
    // Check if password matches
    const password = 'Subham@98';
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match!');
      process.exit(1);
    }
    
    console.log('Admin credentials are valid!');
    process.exit(0);
    
  } catch (err) {
    console.error('Error checking admin:', err.message);
    process.exit(1);
  }
}

if (require.main === module) checkAdmin();