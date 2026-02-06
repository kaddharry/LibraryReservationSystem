const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  reservationDate: {
    type: Date,
    default: Date.now,
  },
  deadlineDate: {
    type: Date,
    required: true,
  },
  // Added: To track when the book was actually returned
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Reserved', 'Returned', 'Late'],
    default: 'Reserved',
  },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);