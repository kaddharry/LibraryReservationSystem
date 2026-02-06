const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    getReservations, 
    createReservation, 
    returnBooks, 
    payFine 
} = require('../controllers/reservationController');

// All routes are protected
router.route('/')
    .get(protect, getReservations)     // Fetch history
    .post(protect, createReservation); // Reserve book

router.post('/return', protect, returnBooks); // Return book
router.post('/pay-fine', protect, payFine);   // Pay fines

module.exports = router;