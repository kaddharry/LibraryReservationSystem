const express = require('express');
const router = express.Router();
const { getBooks, getBookById, addBook } = require('../controllers/bookController');
const { askAI, getRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

// AI-powered recommendation endpoints
router.post('/ask-ai', askAI);                       // Public — anyone can ask
router.get('/recommendations', protect, getRecommendations); // Private — needs user history

// Standard CRUD
router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', addBook); 

module.exports = router;
