const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient.cjs');

// Protect routes - patient authentication
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get patient from token
            req.patient = await Patient.findById(decoded.id).select('-password');

            if (!req.patient) {
                return res.status(401).json({
                    success: false,
                    error: 'Not authorized to access this route'
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }
    } catch (err) {
        console.error('Patient auth middleware error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};