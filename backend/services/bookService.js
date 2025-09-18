const db = require('../config/db');

class BookService {
  // Get all spiritual books with optional filtering
  static async getBooks(searchTerm = '', selectedSubjects = []) {
    try {
      let query = `
        SELECT * FROM spiritual_books 
        ORDER BY created_at DESC
      `;
      let params = [];

      if (searchTerm) {
        query = `
          SELECT * FROM spiritual_books 
          WHERE title ILIKE $1 OR author ILIKE $1 OR description ILIKE $1
          ORDER BY created_at DESC
        `;
        params = [`%${searchTerm}%`];
      }

      if (selectedSubjects && selectedSubjects.length > 0) {
        const subjectConditions = selectedSubjects.map((_, index) => 
          `$${params.length + index + 1} = ANY(traditions)`
        ).join(' OR ');
        
        if (searchTerm) {
          query = `
            SELECT * FROM spiritual_books 
            WHERE (title ILIKE $1 OR author ILIKE $1 OR description ILIKE $1)
            AND (${subjectConditions})
            ORDER BY created_at DESC
          `;
        } else {
          query = `
            SELECT * FROM spiritual_books 
            WHERE ${subjectConditions}
            ORDER BY created_at DESC
          `;
        }
        
        params = [...params, ...selectedSubjects];
      }

      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch books: ${error.message}`);
    }
  }

  // Get unique traditions from all books
  static async getBookTraditions() {
    try {
      const result = await db.query(
        `SELECT DISTINCT unnest(traditions) as tradition 
         FROM spiritual_books 
         WHERE traditions IS NOT NULL 
         ORDER BY tradition`
      );
      
      return result.rows.map(row => row.tradition);
    } catch (error) {
      throw new Error(`Failed to fetch traditions: ${error.message}`);
    }
  }

  // Create a new spiritual book
  static async createBook(bookData, userId) {
    try {
      const {
        title,
        author,
        traditions,
        content,
        storage_url,
        is_storage_file,
        description,
        year,
        language,
        page_count,
        cover_url
      } = bookData;

      const result = await db.query(
        `INSERT INTO spiritual_books 
         (user_id, title, author, traditions, content, storage_url, is_storage_file, description, year, language, page_count, cover_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [
          userId,
          title,
          author,
          traditions || [],
          content,
          storage_url,
          is_storage_file || false,
          description,
          year,
          language || 'english',
          page_count,
          cover_url
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create book: ${error.message}`);
    }
  }

  // Get a specific book by ID
  static async getBookById(bookId) {
    try {
      const result = await db.query(
        `SELECT * FROM spiritual_books WHERE id = $1`,
        [bookId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get book: ${error.message}`);
    }
  }
}

module.exports = BookService;