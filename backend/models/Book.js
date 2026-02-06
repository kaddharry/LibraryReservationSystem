const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true, 
  },
  author: {
    type: String,
    required: true, // Added: Needed for the new UI cards
  },
  shelfNumber: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true, // Added: Needed for the filter pills
  },
  imageUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    // Expanded enum to handle 'Unavailable' when stock hits 0
    enum: ['Available', 'Reserved', 'Unavailable'], 
    default: 'Available',
  },
  stock: {
    type: Number,
    required: true,
    default: 5, // Added: To track quantity
  },
  reservationCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Text index for smart search capability (Added author and category for better search results)
bookSchema.index({ name: 'text', shelfNumber: 'text', author: 'text', category: 'text' });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;