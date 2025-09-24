const AuthService = require('../services/authService');

class AuthController {
  // User registration
  static async register(req, res) {
    try {
      const { email, password, displayName } = req.body;

      if (!email || !password || !displayName) {
        return res.status(400).json({ error: 'Email, password, and display name are required' });
      }

      const { user, token } = await AuthService.register(email, password, displayName);

      res.status(201).json({
        message: 'User registered successfully',
        user,
        token
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Join waiting list
  static async joinWaitlist(req, res) {
    try {
      const { name, email, reason } = req.body;

      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }

      const waitlistEntry = await AuthService.joinWaitlist(name, email, reason);

      res.status(201).json({
        message: 'Successfully joined the waiting list! We will contact you soon.',
        waitlistEntry
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // User login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const { user, token } = await AuthService.login(email, password);

      res.json({
        message: 'Login successful',
        user,
        token
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  // Get current user
  static async getCurrentUser(req, res) {
    try {
      res.json({
        user: req.user
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;