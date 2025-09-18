const ProfileService = require('../services/profileService');

class ProfileController {
  // Get user profile
  static async getProfile(req, res) {
    try {
      const profile = await ProfileService.getProfileByUserId(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      res.json({ profile: profile.toJSON() });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const profile = await ProfileService.updateProfile(req.user.id, req.body);
      res.json({ profile: profile.toJSON() });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ProfileController;