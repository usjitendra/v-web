const Doctor = require('../models/Doctor.cjs');
const Hospital = require('../models/Hospital.cjs');

// Get all doctors with filtering
exports.getDoctors = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10000,
            hospital,
            specialty,
            minRating,
            maxFee,
            sortBy = 'rating',
            sortOrder = 'desc'
        } = req.query;

        const filter = { isActive: true };
        if (hospital) filter.hospital = hospital;
        if (specialty) filter.specialty = new RegExp(specialty, 'i');
        if (minRating) filter.rating = { $gte: parseFloat(minRating) };
        if (maxFee) filter.consultationFee = { $lte: parseFloat(maxFee) };

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOptions
        };

        const doctors = await Doctor.find(filter)
            .sort(options.sort)
            .limit(options.limit * 1)
            .skip((options.page - 1) * options.limit)
            .populate('hospital', 'name city country image rating');

        const total = await Doctor.countDocuments(filter);

        res.json({
            success: true,
            count: doctors.length,
            total,
            page: options.page,
            pages: Math.ceil(total / options.limit),
            data: doctors
        });
    } catch (err) {
        console.error('Get doctors error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get single doctor
exports.getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .populate('hospital', 'name city country image rating beds accreditation phone');

        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }

        res.json({
            success: true,
            data: doctor
        });
    } catch (err) {
        console.error('Get doctor error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Create new doctor
exports.createDoctor = async (req, res) => {
    try {
        const { firstName, lastName, hospital, specialty, consultationFee } = req.body;

        if (!firstName || !lastName || !hospital || !specialty || !consultationFee) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: firstName, lastName, hospital, specialty, consultationFee'
            });
        }

        // Check if hospital exists
        const hospitalExists = await Hospital.findById(hospital);
        if (!hospitalExists) {
            return res.status(400).json({ success: false, error: 'Hospital does not exist' });
        }

        const doctor = await Doctor.create(req.body);
        await doctor.populate('hospital', 'name city country');

        res.status(201).json({ success: true, data: doctor });
    } catch (err) {
        console.error('Create doctor error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('hospital', 'name city country');

        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }

        res.json({ success: true, data: doctor });
    } catch (err) {
        console.error('Update doctor error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Delete doctor (soft delete)
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }

        res.json({ success: true, message: 'Doctor deleted successfully', data: doctor });
    } catch (err) {
        console.error('Delete doctor error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get doctors by hospital
exports.getDoctorsByHospital = async (req, res) => {
    try {
        const { page = 1, limit = 10000, specialty } = req.query;
        const filter = { hospital: req.params.hospitalId, isActive: true };

        if (specialty) filter.specialty = new RegExp(specialty, 'i');

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { rating: -1, lastName: 1 }
        };

        const doctors = await Doctor.find(filter)
            .sort(options.sort)
            .limit(options.limit * 1)
            .skip((options.page - 1) * options.limit)
            .populate('hospital', 'name city country image rating');

        const total = await Doctor.countDocuments(filter);

        res.json({
            success: true,
            count: doctors.length,
            total,
            page: options.page,
            pages: Math.ceil(total / options.limit),
            data: doctors
        });
    } catch (err) {
        console.error('Get doctors by hospital error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get doctors by specialty
exports.getDoctorsBySpecialty = async (req, res) => {
    try {
        const { page = 1, limit = 10000, hospital, minRating } = req.query;
        const filter = { specialty: new RegExp(req.params.specialty, 'i'), isActive: true };

        if (hospital) filter.hospital = hospital;
        if (minRating) filter.rating = { $gte: parseFloat(minRating) };

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { rating: -1, lastName: 1 }
        };

        const doctors = await Doctor.find(filter)
            .sort(options.sort)
            .limit(options.limit * 1)
            .skip((options.page - 1) * options.limit)
            .populate('hospital', 'name city country image rating');

        const total = await Doctor.countDocuments(filter);

        res.json({
            success: true,
            count: doctors.length,
            total,
            page: options.page,
            pages: Math.ceil(total / options.limit),
            data: doctors
        });
    } catch (err) {
        console.error('Get doctors by specialty error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Search doctors
exports.searchDoctors = async (req, res) => {
    try {
        const { q, hospital, specialty, minRating, maxFee } = req.query;
        const filter = { isActive: true };

        if (q) {
            filter.$or = [
                { firstName: new RegExp(q, 'i') },
                { lastName: new RegExp(q, 'i') },
                { fullName: new RegExp(q, 'i') },
                { specialty: new RegExp(q, 'i') }
            ];
        }
        if (hospital) filter.hospital = hospital;
        if (specialty) filter.specialty = new RegExp(specialty, 'i');
        if (minRating) filter.rating = { $gte: parseFloat(minRating) };
        if (maxFee) filter.consultationFee = { $lte: parseFloat(maxFee) };

        const doctors = await Doctor.find(filter)
            .sort({ rating: -1, lastName: 1 })
            .limit(50)
            .populate('hospital', 'name city country image rating');

        res.json({ success: true, count: doctors.length, data: doctors });
    } catch (err) {
        console.error('Search doctors error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};