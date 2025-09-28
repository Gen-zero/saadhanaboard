const db = require('../config/db');

/**
 * userAnalyticsService
 * Provides lightweight analytics for users: progress metrics, engagement, segmentation
 */
const userAnalyticsService = {
  async getUserProgress(userId) {
    // returns basic progress: total_sadhanas, completed, streak (simple), avg_duration
    try {
      const totalQ = await db.query('SELECT COUNT(*)::int AS total FROM sadhanas WHERE user_id=$1', [userId]);
      const completedQ = await db.query("SELECT COUNT(*)::int AS completed FROM sadhanas WHERE user_id=$1 AND status='completed'", [userId]);
      const avgQ = await db.query('SELECT AVG(duration_minutes)::float AS avg_duration FROM sadhana_sessions WHERE user_id=$1', [userId]);
      // simple streak: count distinct days in last 14 days
      const streakQ = await db.query("SELECT COUNT(DISTINCT DATE(started_at))::int AS recent_days FROM sadhana_sessions WHERE user_id=$1 AND started_at > NOW() - INTERVAL '14 days'", [userId]);

      return {
        totalSadhanas: totalQ.rows[0].total || 0,
        completedSadhanas: completedQ.rows[0].completed || 0,
        averageSessionMinutes: Math.round((avgQ.rows[0].avg_duration || 0) * 10) / 10,
        recentPracticeDays: streakQ.rows[0].recent_days || 0,
      };
    } catch (e) {
      console.error('getUserProgress error', e);
      throw e;
    }
  },

  async getUserAnalytics(userId) {
    try {
      // login frequency (last 30 days)
      const logins = await db.query("SELECT DATE(created_at) as day, COUNT(*)::int as count FROM user_logins WHERE user_id=$1 AND created_at > NOW() - INTERVAL '30 days' GROUP BY DATE(created_at) ORDER BY DATE(created_at)", [userId]);
      const sessions = await db.query("SELECT DATE(started_at) as day, COUNT(*)::int as sessions FROM sadhana_sessions WHERE user_id=$1 AND started_at > NOW() - INTERVAL '30 days' GROUP BY DATE(started_at) ORDER BY DATE(started_at)", [userId]);

      return {
        recentLogins: logins.rows || [],
        recentSessions: sessions.rows || [],
      };
    } catch (e) {
      console.error('getUserAnalytics error', e);
      throw e;
    }
  },

  async segmentUsers(filters = {}) {
    // filters: experience_level, traditions, favorite_deity, onboarding_completed
    try {
      const where = [];
      const params = [];
      let idx = 1;
      if (filters.experience_level) { where.push(`p.experience_level = $${idx++}`); params.push(filters.experience_level); }
      if (filters.traditions) { where.push(`p.traditions @> $${idx++}`); params.push(JSON.stringify(filters.traditions)); }
      if (filters.favorite_deity) { where.push(`p.favorite_deity = $${idx++}`); params.push(filters.favorite_deity); }
      if (filters.onboarding_completed !== undefined) { where.push(`p.onboarding_completed = $${idx++}`); params.push(filters.onboarding_completed); }

      const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const q = await db.query(`SELECT u.id, u.email, u.display_name, p.experience_level, p.traditions, p.favorite_deity, p.onboarding_completed FROM users u LEFT JOIN profiles p ON p.user_id = u.id ${whereClause} ORDER BY u.id DESC LIMIT 200`, params);
      return q.rows || [];
    } catch (e) {
      console.error('segmentUsers error', e);
      throw e;
    }
  }
};

module.exports = userAnalyticsService;
