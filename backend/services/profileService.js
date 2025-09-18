const db = require('../config/db');
const Profile = require('../models/Profile');

class ProfileService {
  // Get profile by user ID
  static async getProfileByUserId(userId) {
    try {
      const result = await db.query(
        `SELECT * FROM profiles WHERE id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return new Profile(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to get profile: ${error.message}`);
    }
  }

  // Update profile
  static async updateProfile(userId, profileData) {
    try {
      const {
        display_name,
        avatar_url,
        bio,
        experience_level,
        traditions,
        location,
        available_for_guidance,
        date_of_birth,
        time_of_birth,
        place_of_birth,
        favorite_deity,
        gotra,
        varna,
        sampradaya,
        onboarding_completed,
        // Removed welcome_quiz_completed field
        settings // Add settings parameter
      } = profileData;

      const result = await db.query(
        `UPDATE profiles 
         SET display_name = COALESCE($1, display_name),
             avatar_url = COALESCE($2, avatar_url),
             bio = COALESCE($3, bio),
             experience_level = COALESCE($4, experience_level),
             traditions = COALESCE($5, traditions),
             location = COALESCE($6, location),
             available_for_guidance = COALESCE($7, available_for_guidance),
             date_of_birth = COALESCE($8, date_of_birth),
             time_of_birth = COALESCE($9, time_of_birth),
             place_of_birth = COALESCE($10, place_of_birth),
             favorite_deity = COALESCE($11, favorite_deity),
             gotra = COALESCE($12, gotra),
             varna = COALESCE($13, varna),
             sampradaya = COALESCE($14, sampradaya),
             onboarding_completed = COALESCE($15, onboarding_completed),
             -- Removed welcome_quiz_completed field
             settings = COALESCE($16, settings), -- Add settings update
             updated_at = NOW()
         WHERE id = $17
         RETURNING *`,
        [
          display_name,
          avatar_url,
          bio,
          experience_level,
          traditions,
          location,
          available_for_guidance,
          date_of_birth,
          time_of_birth,
          place_of_birth,
          favorite_deity,
          gotra,
          varna,
          sampradaya,
          onboarding_completed,
          // Removed welcome_quiz_completed field
          settings, // Add settings parameter
          userId
        ]
      );

      if (result.rows.length === 0) {
        throw new Error('Profile not found');
      }

      return new Profile(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  // Create profile (for new users)
  static async createProfile(userId, displayName) {
    try {
      const result = await db.query(
        `INSERT INTO profiles (id, display_name)
         VALUES ($1, $2)
         RETURNING *`,
        [userId, displayName]
      );

      return new Profile(result.rows[0]);
    } catch (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }
  }
}

module.exports = ProfileService;