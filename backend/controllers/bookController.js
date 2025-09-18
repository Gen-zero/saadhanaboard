const BookService = require('../services/bookService');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads');
    // Create uploads directory if it doesn't exist
    fs.mkdir(uploadPath, { recursive: true }).then(() => {
      cb(null, uploadPath);
    }).catch(err => {
      console.error('Error creating upload directory:', err);
      cb(err);
    });
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

class BookController {
  // Get all spiritual books
  static async getBooks(req, res) {
    try {
      const { search, subjects } = req.query;
      const selectedSubjects = subjects ? JSON.parse(subjects) : [];
      
      const books = await BookService.getBooks(search, selectedSubjects);
      res.json({ books });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get unique traditions
  static async getBookTraditions(req, res) {
    try {
      const traditions = await BookService.getBookTraditions();
      res.json({ traditions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Create a new spiritual book with file upload
  static async createBook(req, res) {
    try {
      // Handle file upload if present
      upload.single('bookFile')(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: `File upload error: ${err.message}` });
        } else if (err) {
          return res.status(400).json({ error: err.message });
        }

        // Process book data
        const bookData = JSON.parse(req.body.bookData);
        
        // If file was uploaded, update book data with file info
        if (req.file) {
          bookData.storage_url = `/uploads/${req.file.filename}`;
          bookData.is_storage_file = true;
          // Set content to null for file-based books
          bookData.content = null;
        }

        const book = await BookService.createBook(bookData, req.user.id);
        res.status(201).json({ book });
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get a specific book
  static async getBookById(req, res) {
    try {
      const { id } = req.params;
      const book = await BookService.getBookById(id);
      
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }

      res.json({ book });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Serve uploaded files
  static async serveBookFile(req, res) {
    try {
      const { filename } = req.params;
      const filePath = path.join(__dirname, '../../uploads', filename);
      
      // Check if file exists
      try {
        await fs.access(filePath);
        res.sendFile(filePath);
      } catch (err) {
        res.status(404).json({ error: 'File not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// Export upload middleware for use in routes
BookController.upload = upload;

module.exports = BookController;