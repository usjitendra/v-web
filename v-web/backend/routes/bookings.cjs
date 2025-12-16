// routes/bookings.js
const express = require('express');
const router = express.Router();
const {
    createBooking,
    getBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
    getBookingStats
} = require('../controllers/bookingController.cjs');

// Public routes
router.post('/', createBooking);

// Protected routes (for admin)
router.get('/', getBookings);
router.get('/stats', getBookingStats);
router.get('/:id', getBookingById);
router.put('/:id', updateBookingStatus);
router.delete('/:id', deleteBooking);

module.exports = router;