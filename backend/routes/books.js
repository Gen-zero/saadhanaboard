const express = require('express');
const BookController = require('../controllers/bookController');
const { authenticate } = require('../middleware/auth');
const path = require('path');

const router = express.Router();

// Public routes
router.get('/', BookController.getBooks);
router.get('/traditions', BookController.getBookTraditions);
router.get('/:id', BookController.getBookById);
router.get('/files/:filename', BookController.serveBookFile);

// Protected routes
router.post('/', authenticate, BookController.createBook);

module.exports = router;