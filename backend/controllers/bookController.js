const Book = require('../models/Book');

// @desc    Get all books with optional search
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
  try {
    const { keyword, shelf, status } = req.query;
    let query = {};

    if (keyword) {
      query.$text = { $search: keyword };
    }
    
    // Fallback if text search is not precise or desired, can use regex
    if (keyword && !query.$text) {
         query.name = { $regex: keyword, $options: 'i' };
    }

    if (shelf) {
      query.shelfNumber = shelf;
    }

    if (status) {
      query.status = status;
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    
    // Simple logic for "frequently reserved" could be done by sorting by reservationCount
    // For now we just return the filtered list
    
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Add a new book (Admin/Seeder mostly)
// @route   POST /api/books
// @access  Public (or Protected if admin exists)
const addBook = async (req, res) => {
    const { name, shelfNumber, imageUrl } = req.body;
    try {
        const book = new Book({
            name, 
            shelfNumber,
            imageUrl
        });
        const createdBook = await book.save();
        res.status(201).json(createdBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getBooks, getBookById, addBook };
