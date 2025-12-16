const Hospital = require('../models/Hospital.cjs');
const HospitalDetail = require('../models/HospitalDetail.cjs');

// @desc    Get hospital API status
// @route   GET /api/hospitals/status
exports.getHospitalStatus = async (req, res) => {
    try {
        const hospitalCount = await Hospital.countDocuments();
        const detailsCount = await HospitalDetail.countDocuments();

        res.json({
            success: true,
            status: 'API is running',
            stats: {
                totalHospitals: hospitalCount,
                hospitalsWithDetails: detailsCount,
                timestamp: new Date().toISOString()
            }
        });
    } catch (err) {
        console.error('Status check error:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get all hospitals with optional details
// @route   GET /api/hospitals
exports.getHospitals = async (req, res) => {
    try {
        const { country, city, specialty, minRating, page = 1, limit = 10000 } = req.query;

        // Build filter object
        const filter = {};
        if (country) filter.country = new RegExp(country, 'i');
        if (city) filter.city = new RegExp(city, 'i');
        if (minRating) filter.rating = { $gte: parseFloat(minRating) };
        if (specialty) filter.specialties = new RegExp(specialty, 'i');

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { rating: -1, name: 1 }
        };

        const hospitals = await Hospital.find(filter)
            .sort(options.sort)
            .limit(options.limit * 1)
            .skip((options.page - 1) * options.limit);

        const total = await Hospital.countDocuments(filter);

        res.json({
            success: true,
            count: hospitals.length,
            total,
            page: options.page,
            pages: Math.ceil(total / options.limit),
            data: hospitals
        });
    } catch (err) {
        console.error('Get hospitals error:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get single hospital with details
// @route   GET /api/hospitals/:id
exports.getHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(404).json({
                success: false,
                error: 'Hospital not found'
            });
        }

        const details = await HospitalDetail.findOne({ hospital: req.params.id });

        res.json({
            success: true,
            data: {
                ...hospital.toObject(),
                details: details || null
            }
        });
    } catch (err) {
        console.error('Get hospital error:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Create new hospital
// @route   POST /api/hospitals
exports.createHospital = async (req, res) => {
    try {
        // Validate required fields
        const { name, country, city, image, phone } = req.body;
        if (!name || !country || !city || !image || !phone) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: name, country, city, image, phone'
            });
        }

        // Check if hospital already exists
        const existingHospital = await Hospital.findOne({
            name: new RegExp(`^${name}$`, 'i'),
            city: new RegExp(`^${city}$`, 'i')
        });

        if (existingHospital) {
            return res.status(400).json({
                success: false,
                error: 'Hospital already exists in this city'
            });
        }

        const hospital = await Hospital.create(req.body);

        res.status(201).json({
            success: true,
            data: hospital
        });
    } catch (err) {
        console.error('Create hospital error:', err);

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

// @desc    Get hospital details
// @route   GET /api/hospitals/:id/details
exports.getHospitalDetails = async (req, res) => {
    try {
        const details = await HospitalDetail.findOne({ hospital: req.params.id })
            .populate('hospital', 'name country city rating');

        if (!details) {
            return res.status(404).json({
                success: false,
                error: 'Hospital details not found'
            });
        }

        res.json({
            success: true,
            data: details
        });
    } catch (err) {
        console.error('Get hospital details error:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Create hospital details
// @route   POST /api/hospitals/:id/details
exports.createHospitalDetails = async (req, res) => {
    try {
        // Check if hospital exists
        const hospital = await Hospital.findById(req.params.id);
        if (!hospital) {
            return res.status(404).json({
                success: false,
                error: 'Hospital not found'
            });
        }

        // Check if details already exist
        const existingDetails = await HospitalDetail.findOne({ hospital: req.params.id });
        if (existingDetails) {
            return res.status(400).json({
                success: false,
                error: 'Hospital details already exist'
            });
        }

        // Validate required fields
        const { description, address } = req.body;
        if (!description || !address) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: description, address'
            });
        }

        const details = await HospitalDetail.create({
            hospital: req.params.id,
            ...req.body
        });

        // Populate hospital reference in response
        await details.populate('hospital', 'name country city rating');

        res.status(201).json({
            success: true,
            data: details
        });
    } catch (err) {
        console.error('Create hospital details error:', err);

        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }

        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Hospital details already exist for this hospital'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Update hospital details
// @route   PUT /api/hospitals/:id/details
exports.updateHospitalDetails = async (req, res) => {
    try {
        const details = await HospitalDetail.findOneAndUpdate(
            { hospital: req.params.id },
            req.body,
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        ).populate('hospital', 'name country city rating');

        if (!details) {
            return res.status(404).json({
                success: false,
                error: 'Hospital details not found'
            });
        }

        res.json({
            success: true,
            data: details
        });
    } catch (err) {
        console.error('Update hospital details error:', err);

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

// @desc    Delete hospital details
// @route   DELETE /api/hospitals/:id/details
exports.deleteHospitalDetails = async (req, res) => {
    try {
        const details = await HospitalDetail.findOneAndDelete({
            hospital: req.params.id
        });

        if (!details) {
            return res.status(404).json({
                success: false,
                error: 'Hospital details not found'
            });
        }

        res.json({
            success: true,
            message: 'Hospital details deleted successfully',
            data: details
        });
    } catch (err) {
        console.error('Delete hospital details error:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Search hospitals
// @route   GET /api/hospitals/search
exports.searchHospitals = async (req, res) => {
    try {
        const { q, country, city, minRating, specialty } = req.query;

        const filter = { isActive: true };

        if (q) {
            filter.$or = [
                { name: new RegExp(q, 'i') },
                { 'details.description': new RegExp(q, 'i') }
            ];
        }

        if (country) filter.country = new RegExp(country, 'i');
        if (city) filter.city = new RegExp(city, 'i');
        if (minRating) filter.rating = { $gte: parseFloat(minRating) };
        if (specialty) filter.specialties = new RegExp(specialty, 'i');

        const hospitals = await Hospital.find(filter)
            .sort({ rating: -1, name: 1 })
            .limit(50);

        res.json({
            success: true,
            count: hospitals.length,
            data: hospitals
        });
    } catch (err) {
        console.error('Search hospitals error:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};