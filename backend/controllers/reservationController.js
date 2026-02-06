const Reservation = require('../models/Reservation');
const Book = require('../models/Book');

// @desc    Get user reservations
// @route   GET /api/reservations
// @access  Private
const getReservations = async (req, res) => {
  try {
    // Only fetches active reservations (since we delete returned ones now)
    const reservations = await Reservation.find({ userId: req.user._id })
                                          .populate('bookId')
                                          .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private
const createReservation = async (req, res) => {
  const { bookId } = req.body;

  try {
    // 1. Check active reservation limit (Max 2 books)
    // Since we delete returned books, countDocuments works perfectly for active loans
    const activeCount = await Reservation.countDocuments({
      userId: req.user._id
    });

    if (activeCount >= 2) {
      return res.status(400).json({ message: 'Limit Reached: You can only have 2 active books at a time. Return one to borrow more.' });
    }

    // 2. Check for duplicate active reservation of the same book
    const existing = await Reservation.findOne({
      userId: req.user._id,
      bookId: bookId
    });

    if (existing) {
      return res.status(400).json({ message: 'You already have this book reserved.' });
    }

    // 3. Check Stock
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    if (book.stock < 1) {
      return res.status(400).json({ message: 'Book is currently out of stock.' });
    }

    // 4. Create Reservation (30 Day Deadline)
    // Linked to user via req.user._id (which corresponds to the logged-in Roll Number)
    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + 30); 

    const reservation = await Reservation.create({
      userId: req.user._id,
      bookId,
      deadlineDate,
      status: 'Reserved'
    });

    // 5. Decrease Stock
    book.stock = book.stock - 1;
    book.reservationCount = (book.reservationCount || 0) + 1;
    
    // If stock hits 0, mark unavailable
    if (book.stock === 0) {
        book.status = 'Unavailable';
    }
    await book.save();

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return books and delete record
// @route   POST /api/reservations/return
// @access  Private
const returnBooks = async (req, res) => {
  const { ids } = req.body; // Expects an array of Reservation IDs

  try {
    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No books selected for return" });
    }

    for (const id of ids) {
      // Find the specific reservation for this user
      const reservation = await Reservation.findOne({ _id: id, userId: req.user._id });

      if (reservation) {
        // 1. Increase Stock back
        const book = await Book.findById(reservation.bookId);
        if (book) {
          book.stock += 1;
          // If it was unavailable, make it available again
          if (book.status === 'Unavailable') {
            book.status = 'Available';
          }
          await book.save();
        }

        // 2. DELETE the reservation document
        // "no detail of past book reserved by any user should be stored"
        await Reservation.findByIdAndDelete(id);
      }
    }

    res.json({ message: 'Books returned successfully and records cleared.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pay fines (Mock)
// @route   POST /api/reservations/pay-fine
const payFine = async (req, res) => {
    // In a real app, update User model 'fines' to 0 here
    res.json({ message: "Fines paid successfully! (Mock Payment)" });
};

module.exports = { getReservations, createReservation, returnBooks, payFine };