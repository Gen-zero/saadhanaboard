const ProfileService = require('../services/profileService');
const SocialService = require('../services/socialService');
const userAnalyticsService = require('../services/userAnalyticsService');
const analyticsExportService = require('../services/analyticsExportService');

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

  static async follow(req, res) {
    try {
      const followerId = req.user.id;
      const followedId = req.params.id;
      const result = await SocialService.followUser(followerId, followedId);
      return res.json(result);
    } catch (err) {
      console.error('follow error', err);
      return res.status(400).json({ error: err.message });
    }
  }

  static async unfollow(req, res) {
    try {
      const followerId = req.user.id;
      const followedId = req.params.id;
      const result = await SocialService.unfollowUser(followerId, followedId);
      return res.json(result);
    } catch (err) {
      console.error('unfollow error', err);
      return res.status(400).json({ error: err.message });
    }
  }

  static async followers(req, res) {
    try {
      const userId = req.params.id;
      const pagination = { limit: parseInt(req.query.limit,10) || 50, offset: parseInt(req.query.offset,10) || 0 };
      const data = await SocialService.getFollowers(userId, pagination);
      return res.json(data);
    } catch (err) {
      console.error('followers error', err);
      return res.status(400).json({ error: err.message });
    }
  }

  static async following(req, res) {
    try {
      const userId = req.params.id;
      const pagination = { limit: parseInt(req.query.limit,10) || 50, offset: parseInt(req.query.offset,10) || 0 };
      const data = await SocialService.getFollowing(userId, pagination);
      return res.json(data);
    } catch (err) {
      console.error('following error', err);
      return res.status(400).json({ error: err.message });
    }
  }

  static async followStats(req, res) {
    try {
      const userId = req.params.id;
      const stats = await SocialService.getFollowStats(userId);
      return res.json(stats);
    } catch (err) {
      console.error('followStats error', err);
      return res.status(400).json({ error: err.message });
    }
  }

  static async isFollowing(req, res) {
    try {
      const followerId = req.user.id;
      const followedId = req.params.id;
      const isFollowing = await SocialService.isFollowing(followerId, followedId);
      return res.json({ isFollowing });
    } catch (err) {
      console.error('isFollowing error', err);
      return res.status(400).json({ error: err.message });
    }
  }

  // Analytics endpoints
  static async getPracticeTrends(req, res) {
    try {
      const userId = req.user.id;
      const timeframe = req.query.timeframe || '30d';
      const granularity = req.query.granularity || 'daily';
      const data = await userAnalyticsService.getPracticeTrends(userId, timeframe, granularity);
      return res.json(data);
    } catch (err) {
      console.error('getPracticeTrends error', err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getCompletionRates(req, res) {
    try {
      const userId = req.user.id;
      const groupBy = req.query.groupBy || 'category';
      const timeframe = req.query.timeframe || '30d';
      const data = await userAnalyticsService.getCompletionRates(userId, groupBy, timeframe);
      return res.json(data);
    } catch (err) {
      console.error('getCompletionRates error', err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getStreaks(req, res) {
    try {
      const userId = req.user.id;
      const data = await userAnalyticsService.getStreakAnalytics(userId);
      return res.json(data);
    } catch (err) {
      console.error('getStreaks error', err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getComparative(req, res) {
    try {
      const userId = req.user.id;
      const timeframe = req.query.timeframe || '30d';
      const data = await userAnalyticsService.getComparativeAnalytics(userId, timeframe);
      return res.json(data);
    } catch (err) {
      console.error('getComparative error', err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getDetailedReport(req, res) {
    try {
      const userId = req.user.id;
      const start = req.query.start;
      const end = req.query.end;
      if (!start || !end) return res.status(400).json({ error: 'start and end query params required (YYYY-MM-DD)' });
      const data = await userAnalyticsService.getDetailedProgressReport(userId, start, end);
      return res.json(data);
    } catch (err) {
      console.error('getDetailedReport error', err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getHeatmap(req, res) {
    try {
      const userId = req.user.id;
      const year = parseInt(req.query.year,10) || new Date().getFullYear();
      const data = await userAnalyticsService.getPracticeHeatmap(userId, year);
      return res.json(data);
    } catch (err) {
      console.error('getHeatmap error', err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async getCategoryInsights(req, res) {
    try {
      const userId = req.user.id;
      const data = await userAnalyticsService.getCategoryInsights(userId);
      return res.json(data);
    } catch (err) {
      console.error('getCategoryInsights error', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // Export endpoints
  static async exportCSV(req, res) {
    try {
      const type = req.query.type || 'detailed';
      const userId = req.user.id;
      if (type === 'detailed') {
        const start = req.query.start; const end = req.query.end;
        if (!start || !end) return res.status(400).json({ error: 'start and end params required for detailed export' });
        const report = await userAnalyticsService.getDetailedProgressReport(userId, start, end);
        // flatten report.summary + breakdown
        const rows = [];
        rows.push({ key: 'totalPractices', value: report.summary.totalPractices });
        rows.push({ key: 'totalCompletions', value: report.summary.totalCompletions });
        for (const b of report.categoryBreakdown) rows.push({ key: `category:${b.category}`, value: `${b.practices} practices, ${b.completionRate}% completion` });
        const csv = await analyticsExportService.generateCSVReport(rows, [{ key: 'key', title: 'Key' }, { key: 'value', title: 'Value' }]);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="analytics_${userId}_${type}.csv"`);
        return res.send(csv);
      }
      return res.status(400).json({ error: 'unknown export type' });
    } catch (err) {
      console.error('exportCSV error', err);
      return res.status(500).json({ error: err.message });
    }
  }

  static async exportPDF(req, res) {
    try {
      const type = req.query.type || 'detailed';
      const userId = req.user.id;
      if (type === 'detailed') {
        const start = req.query.start; const end = req.query.end;
        if (!start || !end) return res.status(400).json({ error: 'start and end params required for detailed export' });
        const report = await userAnalyticsService.getDetailedProgressReport(userId, start, end);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="analytics_${userId}_${type}.pdf"`);
        await analyticsExportService.streamPDFReport(`Analytics: ${userId} ${type}`, [report.summary, ...report.categoryBreakdown], res);
        return res.end();
      }
      return res.status(400).json({ error: 'unknown export type' });
    } catch (err) {
      console.error('exportPDF error', err);
      return res.status(500).json({ error: err.message });
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