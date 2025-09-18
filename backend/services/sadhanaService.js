const db = require('../config/db');

class SadhanaService {
  // Get sadhanas for a user
  static async getUserSadhanas(userId) {
    try {
      const result = await db.query(
        `SELECT * FROM sadhanas 
         WHERE user_id = $1 OR assigned_by = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch sadhanas: ${error.message}`);
    }
  }

  // Create a new sadhana
  static async createSadhana(sadhanaData, userId) {
    try {
      const {
        title,
        description,
        category,
        due_date,
        due_time,
        priority,
        tags,
        sadhana_id
      } = sadhanaData;

      const result = await db.query(
        `INSERT INTO sadhanas 
         (user_id, title, description, category, due_date, due_time, priority, tags, sadhana_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          userId,
          title,
          description,
          category || 'daily',
          due_date,
          due_time,
          priority || 'medium',
          tags || [],
          sadhana_id
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create sadhana: ${error.message}`);
    }
  }

  // Update a sadhana
  static async updateSadhana(sadhanaId, sadhanaData, userId) {
    try {
      const {
        title,
        description,
        completed,
        category,
        due_date,
        due_time,
        priority,
        tags,
        reflection
      } = sadhanaData;

      const result = await db.query(
        `UPDATE sadhanas 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             completed = COALESCE($3, completed),
             category = COALESCE($4, category),
             due_date = COALESCE($5, due_date),
             due_time = COALESCE($6, due_time),
             priority = COALESCE($7, priority),
             tags = COALESCE($8, tags),
             reflection = COALESCE($9, reflection),
             updated_at = NOW()
         WHERE id = $10 AND (user_id = $11 OR assigned_by = $11)
         RETURNING *`,
        [
          title,
          description,
          completed,
          category,
          due_date,
          due_time,
          priority,
          tags,
          reflection,
          sadhanaId,
          userId
        ]
      );

      if (result.rows.length === 0) {
        throw new Error('Sadhana not found or unauthorized');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update sadhana: ${error.message}`);
    }
  }

  // Delete a sadhana
  static async deleteSadhana(sadhanaId, userId) {
    try {
      const result = await db.query(
        `DELETE FROM sadhanas 
         WHERE id = $1 AND (user_id = $2 OR assigned_by = $2)
         RETURNING id`,
        [sadhanaId, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Sadhana not found or unauthorized');
      }

      return { id: result.rows[0].id };
    } catch (error) {
      throw new Error(`Failed to delete sadhana: ${error.message}`);
    }
  }

  // Get sadhana progress
  static async getSadhanaProgress(sadhanaId, userId) {
    try {
      const result = await db.query(
        `SELECT * FROM sadhana_progress 
         WHERE sadhana_id = $1 AND user_id = $2
         ORDER BY progress_date DESC`,
        [sadhanaId, userId]
      );

      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch sadhana progress: ${error.message}`);
    }
  }

  // Create or update sadhana progress
  static async upsertSadhanaProgress(progressData, userId) {
    try {
      const {
        sadhana_id,
        progress_date,
        completed,
        notes,
        duration_minutes
      } = progressData;

      const result = await db.query(
        `INSERT INTO sadhana_progress 
         (sadhana_id, user_id, progress_date, completed, notes, duration_minutes)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (sadhana_id, progress_date) 
         DO UPDATE SET 
           completed = COALESCE($4, sadhana_progress.completed),
           notes = COALESCE($5, sadhana_progress.notes),
           duration_minutes = COALESCE($6, sadhana_progress.duration_minutes),
           created_at = NOW()
         RETURNING *`,
        [
          sadhana_id,
          userId,
          progress_date || new Date().toISOString().split('T')[0],
          completed,
          notes,
          duration_minutes
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to upsert sadhana progress: ${error.message}`);
    }
  }
}

module.exports = SadhanaService;