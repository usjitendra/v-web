const Service = require('../models/Service.cjs');

// @desc    Get service health status
// @route   GET /api/services
// @access  Public
exports.getServiceStatus = async (req, res) => {
  try {
    res.json({ 
      status: 'Services API is healthy',
      dbStatus: req.dbStatus || 'Unknown' // Injected from middleware
    });
  } catch (err) {
    console.error('Health check error:', err);
    res.status(500).json({ 
      error: 'Service unavailable',
      details: err.message
    });
  }
};

// @desc    Get all services
// @route   GET /api/services/all
// @access  Public
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (err) {
    console.error('Database error:', {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      data: service
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};