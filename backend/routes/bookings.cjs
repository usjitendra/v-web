// routes/bookings.js
const express = require('express');
const router = express.Router();
const {
    createBooking,
    getBookings,
    getBookingById,
    updateBooking,
    updateBookingStatus,
    cancelBooking,
    rescheduleBooking,
    deleteBooking,
    getBookingsByPatient,
    getBookingsByDoctor,
    getBookingsByHospital,
    checkDoctorAvailability,
    getBookingStats
} = require('../controllers/bookingController.cjs');

// Public routes (accessible to everyone)
router.post('/', createBooking);
router.get('/doctor/:doctorId/availability/:date', checkDoctorAvailability);

// Patient routes (authenticated patients)
router.get('/patient/:patientId', getBookingsByPatient);

// Doctor routes (authenticated doctors)
router.get('/doctor/:doctorId', getBookingsByDoctor);

// Hospital routes (authenticated hospital admins)
router.get('/hospital/:hospitalId', getBookingsByHospital);

// Admin routes (admin only)
router.get('/', getBookings);
router.get('/stats', getBookingStats);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking); // Full booking update
router.put('/:id/status', updateBookingStatus); // Status only update
router.put('/:id/cancel', cancelBooking); // Cancel booking
router.put('/:id/reschedule', rescheduleBooking); // Reschedule booking
router.delete('/:id', deleteBooking);

module.exports = router;