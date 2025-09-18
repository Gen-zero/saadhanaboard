const SadhanaService = require('../services/sadhanaService');

class SadhanaController {
  // Get user sadhanas
  static async getUserSadhanas(req, res) {
    try {
      const sadhanas = await SadhanaService.getUserSadhanas(req.user.id);
      res.json({ sadhanas });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create a new sadhana
  static async createSadhana(req, res) {
    try {
      const sadhana = await SadhanaService.createSadhana(req.body, req.user.id);
      res.status(201).json({ sadhana });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update a sadhana
  static async updateSadhana(req, res) {
    try {
      const { id } = req.params;
      const sadhana = await SadhanaService.updateSadhana(id, req.body, req.user.id);
      res.json({ sadhana });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a sadhana
  static async deleteSadhana(req, res) {
    try {
      const { id } = req.params;
      await SadhanaService.deleteSadhana(id, req.user.id);
      res.json({ message: 'Sadhana deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get sadhana progress
  static async getSadhanaProgress(req, res) {
    try {
      const { sadhanaId } = req.params;
      const progress = await SadhanaService.getSadhanaProgress(sadhanaId, req.user.id);
      res.json({ progress });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create or update sadhana progress
  static async upsertSadhanaProgress(req, res) {
    try {
      const { sadhanaId } = req.params;
      const progressData = { ...req.body, sadhana_id: sadhanaId };
      const progress = await SadhanaService.upsertSadhanaProgress(progressData, req.user.id);
      res.json({ progress });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = SadhanaController;