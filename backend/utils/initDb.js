const db = require('../config/db');

// SQL schema based on Supabase migrations
const schemaSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  experience_level TEXT,
  traditions TEXT[] DEFAULT '{}',
  location TEXT,
  available_for_guidance BOOLEAN DEFAULT false,
  date_of_birth DATE,
  time_of_birth TIME,
  place_of_birth TEXT,
  favorite_deity TEXT,
  gotra TEXT,
  varna TEXT,
  sampradaya TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  -- Removed welcome_quiz_completed column
  settings JSONB, -- Add settings column for user preferences
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spiritual_books table
CREATE TABLE IF NOT EXISTS spiritual_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  traditions TEXT[] NOT NULL DEFAULT '{}',
  content TEXT, -- This will be optional now
  storage_url TEXT, -- New field for file storage URL
  is_storage_file BOOLEAN DEFAULT false, -- New field to indicate if it's a stored file
  description TEXT,
  year INTEGER,
  language TEXT DEFAULT 'english',
  page_count INTEGER,
  cover_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sadhanas table
CREATE TABLE IF NOT EXISTS sadhanas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'daily' CHECK (category IN ('daily', 'goal')),
  due_date DATE,
  due_time TIME,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  tags TEXT[] DEFAULT '{}',
  reflection TEXT,
  sadhana_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sadhana_progress table
CREATE TABLE IF NOT EXISTS sadhana_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sadhana_id UUID REFERENCES sadhanas(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  progress_date DATE DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sadhana_id, progress_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_sadhanas_user_id ON sadhanas(user_id);
CREATE INDEX IF NOT EXISTS idx_sadhana_progress_user_id ON sadhana_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_spiritual_books_user_id ON spiritual_books(user_id);
`;

async function initDatabase() {
  try {
    console.log('Initializing database schema...');
    
    // Execute schema creation
    await db.query(schemaSQL);
    
    // Add settings column if it doesn't exist (for existing databases)
    try {
      await db.query('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS settings JSONB');
    } catch (error) {
      console.log('Settings column already exists or error adding it:', error.message);
    }
    
    // Add new columns if they don't exist (for existing databases)
    try {
      await db.query('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS settings JSONB');
      await db.query('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gotra TEXT');
      await db.query('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS varna TEXT');
      await db.query('ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sampradaya TEXT');
      // Removed welcome_quiz_completed column addition
    } catch (error) {
      console.log('Profile columns already exist or error adding them:', error.message);
    }
    
    console.log('Database schema initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    process.exit(0);
  }
}

// Run initialization
initDatabase();