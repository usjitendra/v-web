// controllers/patientController.cjs
const Booking = require('../models/Bookings.cjs'); // Change from Appointment to Booking
const Patient = require('../models/Patient.cjs');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Patient Login
exports.patientLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }

        // Find patient by email
        const patient = await Patient.findOne({ email, isActive: true });

        if (!patient || !(await patient.correctPassword(password, patient.password))) {
            return res.status(401).json({
                success: false,
                error: 'Incorrect email or password'
            });
        }

        // Update last login
        patient.lastLogin = new Date();
        await patient.save();

        // Create token
        const token = signToken(patient._id);

        res.status(200).json({
            success: true,
            token,
            data: {
                id: patient._id,
                firstName: patient.firstName,
                lastName: patient.lastName,
                email: patient.email,
                phone: patient.phone
            }
        });
    } catch (err) {
        console.error('Patient login error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Patient Registration (for patients themselves)
exports.patientRegister = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            confirmPassword,
            dateOfBirth,
            gender
        } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                error: 'Please fill in all required fields'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                error: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters'
            });
        }

        // Check if patient already exists
        const existingPatient = await Patient.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingPatient) {
            return res.status(400).json({
                success: false,
                error: 'Patient with this email or phone already exists'
            });
        }

        // Create new patient
        const patient = await Patient.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            dateOfBirth: dateOfBirth || null,
            gender: gender || undefined,
            verified: false // Patients need to verify their email
        });

        // In a real application, you would send a verification email here

        // Create token
        const token = signToken(patient._id);

        // Remove password from response
        const patientResponse = patient.toObject();
        delete patientResponse.password;

        res.status(201).json({
            success: true,
            token,
            message: 'Patient registered successfully. Please verify your email.',
            data: patientResponse
        });
    } catch (err) {
        console.error('Patient registration error:', err);

        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            return res.status(400).json({
                success: false,
                error: errors.join(', ')
            });
        }

        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Patient with this email or phone already exists'
            });
        }

        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get patient profile
exports.getPatientProfile = async (req, res) => {
    try {
        // req.patient is set by the auth middleware
        const patient = await Patient.findById(req.patient.id).select('-password');

        if (!patient) {
            return res.status(404).json({
                success: false,
                error: 'Patient not found'
            });
        }

        res.json({
            success: true,
            data: patient
        });
    } catch (err) {
        console.error('Get patient profile error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update patient profile
exports.updatePatientProfile = async (req, res) => {
    try {
        // Don't allow password updates through this route
        if (req.body.password) {
            delete req.body.password;
        }

        const patient = await Patient.findByIdAndUpdate(
            req.patient.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: patient
        });
    } catch (err) {
        console.error('Update patient profile error:', err);

        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(el => el.message);
            return res.status(400).json({
                success: false,
                error: errors.join(', ')
            });
        }

        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get patient bookings (changed from appointments)
exports.getPatientBookings = async (req, res) => {
    try {
        const { status, type } = req.query;
        const filter = { patientId: req.patient.id };

        if (status) {
            filter['status.mainStatus'] = status;
        }

        if (type) {
            filter.type = type;
        }

        const bookings = await Booking.find(filter)
            .populate('hospital', 'name city address phone')
            .populate('doctor', 'firstName lastName specialty')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        console.error('Get patient bookings error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get patient appointments (approved bookings)
exports.getPatientAppointments = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {
            patientId: req.patient.id,
            type: 'appointment',
            'status.mainStatus': { $in: ['scheduled', 'confirmed', 'completed'] }
        };

        if (status) {
            filter['status.mainStatus'] = status;
        }

        const appointments = await Booking.find(filter)
            .populate('hospital', 'name city address phone')
            .populate('doctor', 'firstName lastName specialty')
            .sort({ date: 1, time: 1 });

        res.json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (err) {
        console.error('Get patient appointments error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};