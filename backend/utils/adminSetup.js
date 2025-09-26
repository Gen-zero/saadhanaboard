const db = require('../config/db');

// Create admin logs table and other necessary tables
async function setupAdminTables() {
  try {
    // Create admin_logs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER NOT NULL,
        action VARCHAR(255) NOT NULL,
        target_type VARCHAR(100),
        target_id INTEGER,
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create indexes for better performance
    await db.query('CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action)');

    // Ensure users table has necessary admin columns
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE
    `);

    // Create sadhanas table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS sadhanas (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'active',
        duration INTEGER DEFAULT 21,
        start_date DATE,
        end_date DATE,
        progress JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create books table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        tradition VARCHAR(100),
        file_path VARCHAR(500),
        description TEXT,
        upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        uploaded_by INTEGER REFERENCES users(id)
      )
    `);

    // Create themes table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS themes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        deity VARCHAR(100),
        colors JSONB,
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    console.log('Admin tables setup completed successfully');
  } catch (error) {
    console.error('Error setting up admin tables:', error);
    throw error;
  }
}

module.exports = { setupAdminTables };