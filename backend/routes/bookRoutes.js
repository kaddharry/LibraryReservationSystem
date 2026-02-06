const express = require('express');
const router = express.Router();
const { getBooks, getBookById, addBook } = require('../controllers/bookController');

router.get('/', getBooks);
router.get('/:id', getBookById);
router.post('/', addBook); 

module.exports = router;
