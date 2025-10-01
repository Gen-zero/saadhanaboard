const db = require('../config/db');

const upsertProgress = async ({ userId, bookId, position, page, percent }) => {
  const sql = `INSERT INTO book_progress (user_id, book_id, position, page, percent, last_seen_at)
    VALUES ($1,$2,$3,$4,$5,now())
    ON CONFLICT (user_id, book_id) DO UPDATE SET position = EXCLUDED.position, page = EXCLUDED.page, percent = EXCLUDED.percent, last_seen_at = now()
    RETURNING *`;
  const params = [userId, bookId, position, page || null, percent || null];
  const res = await db.query(sql, params);
  return res.rows[0];
};

const getProgress = async ({ userId, bookId }) => {
  const res = await db.query('SELECT * FROM book_progress WHERE user_id = $1 AND book_id = $2', [userId, bookId]);
  return res.rows[0] || null;
};

module.exports = { upsertProgress, getProgress };
