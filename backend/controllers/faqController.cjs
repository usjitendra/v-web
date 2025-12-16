const FAQ = require('../models/FAQ.cjs');

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 });
    
    res.json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (err) {
    console.error('Get FAQs error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};