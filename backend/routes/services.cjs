const express = require('express');
const mongoose = require('mongoose');

const {
  getServiceStatus,
  getAllServices,
  createService
} = require('../controllers/ServiceController.cjs');

const router = express.Router();

// Add DB status middleware
router.use((req, res, next) => {
  req.dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  next();
});

// Public routes
router.get('/', getServiceStatus);
router.get('/all', getAllServices);

// Protected admin routes
// router.post('/', protect, authorize('admin'), createService);

module.exports = router;