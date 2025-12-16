// routes/patientRoutes.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/paitientController.cjs');
const { protect } = require('../middleware/patientAuth.cjs');

// Public routes
router.post('/register', patientController.patientRegister);
router.post('/login', patientController.patientLogin);

// Protected routes
router.get('/profile', protect, patientController.getPatientProfile);
router.put('/profile', protect, patientController.updatePatientProfile);
router.get('/bookings', protect, patientController.getPatientBookings); // Changed from appointments to bookings
router.get('/appointments', protect, patientController.getPatientAppointments); // For approved appointments only

module.exports = router;