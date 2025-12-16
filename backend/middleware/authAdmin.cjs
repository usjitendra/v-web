const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.cjs');

exports.protectAdmin = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to access this route'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentAdmin = await Admin.findById(decoded.id).select('-password');

        if (!currentAdmin || !currentAdmin.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Admin no longer exists or is inactive'
            });
        }

        req.admin = currentAdmin;
        next();
    } catch (err) {
        console.error('Admin auth error:', err);
        res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                error: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};