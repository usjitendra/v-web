const Assistance = require('../models/Assistance.cjs');

// @desc    Get all active assistance services
// @route   GET /api/assistance
// @access  Public
exports.getAssistance = async (req, res) => {
  try {
    const assistance = await Assistance.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    
    res.json({
      success: true,
      count: assistance.length,
      data: assistance
    });
  } catch (err) {
    console.error('Get assistance error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};