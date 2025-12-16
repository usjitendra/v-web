const PatientOpinion = require('../models/PatientOpinions.cjs');

// @desc    Get all patient opinions
// @route   GET /api/patient-opinions
// @access  Public
exports.getPatientOpinions = async (req, res) => {
    try {
        const opinions = await PatientOpinion.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: opinions.length,
            data: opinions
        });
    } catch (err) {
        console.error('Get patient opinions error:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};