const Treatment = require('../models/Treatments.cjs');
const HospitalTreatment = require('../models/HospitalTreatment.cjs');
const DoctorTreatment = require('../models/DoctorTreatment.cjs');

// @desc    Get all treatments with hospital and doctor info
// @route   GET /api/treatments/all
// @access  Public
exports.getAllTreatments = async (req, res) => {
    try {
        const treatments = await Treatment.find({ isActive: true })
            .sort({ title: 1 })
            .lean();

        res.json({
            success: true,
            count: treatments.length,
            data: treatments
        });
    } catch (err) {
        console.error('Get all treatments error:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get treatments with hospital offerings
// @route   GET /api/treatments/hospital-offerings
// @access  Public
exports.getTreatmentsWithHospitalOfferings = async (req, res) => {
    try {
        const { hospital, treatment } = req.query;

        const filter = { isActive: true };
        if (hospital) filter.hospital = hospital;
        if (treatment) filter.treatment = treatment;

        const hospitalTreatments = await HospitalTreatment.find(filter)
            .populate('hospital', 'name city country image rating')
            .populate('treatment', 'title description category icon typicalDuration typicalComplexity')
            .sort({ finalPrice: 1 });

        res.json({
            success: true,
            count: hospitalTreatments.length,
            data: hospitalTreatments
        });
    } catch (err) {
        console.error('Get hospital treatments error:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get treatments with doctor capabilities
// @route   GET /api/treatments/doctor-capabilities
// @access  Public
exports.getTreatmentsWithDoctorCapabilities = async (req, res) => {
    try {
        const { doctor, treatment } = req.query;

        const filter = { isActive: true };
        if (doctor) filter.doctor = doctor;
        if (treatment) filter.treatment = treatment;

        const doctorTreatments = await DoctorTreatment.find(filter)
            .populate('doctor', 'firstName lastName specialty image rating experience')
            .populate('treatment', 'title description category icon typicalDuration typicalComplexity')
            .sort({ successRate: -1 });

        res.json({
            success: true,
            count: doctorTreatments.length,
            data: doctorTreatments
        });
    } catch (err) {
        console.error('Get doctor treatments error:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Get treatment by ID
// @route   GET /api/treatments/:id
// @access  Public
exports.getTreatment = async (req, res) => {
    try {
        // if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        //     return res.status(400).json({
        //         success: false,
        //         error: 'Invalid treatment ID format'
        //     });
        // }

        const treatment = await Treatment.findById(req.params.id);

        if (!treatment) {
            return res.status(404).json({
                success: false,
                error: 'Treatment not found'
            });
        }

        res.json({
            success: true,
            data: treatment
        });
    } catch (err) {
        console.error('Get treatment error:', err);
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// controllers/treatmentController.cjs

// @desc    Get treatments filtered by hospital
// @route   GET /api/treatments/filter-by-hospital/:hospitalId
// @access  Public
exports.getTreatmentsByHospital = async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const { category, minPrice, maxPrice, availability } = req.query;

        const filter = {
            hospital: hospitalId,
            isActive: true
        };

        // Additional filters
        if (category) filter['treatment.category'] = category;
        if (minPrice) filter.finalPrice = { $gte: parseFloat(minPrice) };
        if (maxPrice) filter.finalPrice = { ...filter.finalPrice, $lte: parseFloat(maxPrice) };
        if (availability) filter.availability = availability;

        const hospitalTreatments = await HospitalTreatment.find(filter)
            .populate('hospital', 'name city country image rating accreditation')
            .populate('treatment', 'title description category icon typicalDuration typicalComplexity typicalRecoveryTime')
            .sort({ 'treatment.title': 1 });

        res.json({
            success: true,
            count: hospitalTreatments.length,
            data: hospitalTreatments
        });
    } catch (err) {
        console.error('Get treatments by hospital error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all hospitals with their treatments
// @route   GET /api/treatments/hospitals-with-treatments
// @access  Public
exports.getHospitalsWithTreatments = async (req, res) => {
    try {
        const { category, country, city } = req.query;

        const hospitalFilter = { isActive: true };
        if (country) hospitalFilter.country = new RegExp(country, 'i');
        if (city) hospitalFilter.city = new RegExp(city, 'i');

        const treatmentFilter = { isActive: true };
        if (category) treatmentFilter['treatment.category'] = category;

        const hospitals = await Hospital.find(hospitalFilter)
            .populate({
                path: 'treatments',
                match: treatmentFilter,
                populate: {
                    path: 'treatment',
                    select: 'title category icon typicalDuration'
                }
            })
            .sort({ name: 1 });

        res.json({
            success: true,
            count: hospitals.length,
            data: hospitals
        });
    } catch (err) {
        console.error('Get hospitals with treatments error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// controllers/treatmentController.cjs

// @desc    Get treatments filtered by doctor
// @route   GET /api/treatments/filter-by-doctor/:doctorId
// @access  Public
exports.getTreatmentsByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { category, minSuccessRate } = req.query;

        const filter = {
            doctor: doctorId,
            isActive: true
        };

        // Additional filters
        if (category) filter['treatment.category'] = category;
        if (minSuccessRate) filter.successRate = { $gte: parseFloat(minSuccessRate) };

        const doctorTreatments = await DoctorTreatment.find(filter)
            .populate('doctor', 'firstName lastName specialty image rating experience qualifications languages')
            .populate('treatment', 'title description category icon typicalDuration typicalComplexity typicalRecoveryTime')
            .sort({ 'treatment.title': 1 });

        res.json({
            success: true,
            count: doctorTreatments.length,
            data: doctorTreatments
        });
    } catch (err) {
        console.error('Get treatments by doctor error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all doctors with their treatments
// @route   GET /api/treatments/doctors-with-treatments
// @access  Public
exports.getDoctorsWithTreatments = async (req, res) => {
    try {
        const { category, hospital, specialty } = req.query;

        const doctorFilter = { isActive: true };
        if (hospital) doctorFilter.hospital = hospital;
        if (specialty) doctorFilter.specialty = new RegExp(specialty, 'i');

        const treatmentFilter = { isActive: true };
        if (category) treatmentFilter['treatment.category'] = category;

        const doctors = await Doctor.find(doctorFilter)
            .populate('hospital', 'name city country image rating')
            .populate({
                path: 'treatments',
                match: treatmentFilter,
                populate: {
                    path: 'treatment',
                    select: 'title category icon typicalDuration'
                }
            })
            .sort({ lastName: 1, firstName: 1 });

        res.json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (err) {
        console.error('Get doctors with treatments error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// controllers/treatmentController.cjs

// @desc    Advanced filtering of treatments
// @route   GET /api/treatments/advanced-filter
// @access  Public
exports.advancedFilterTreatments = async (req, res) => {
    try {
        const {
            hospital,
            doctor,
            category,
            minPrice,
            maxPrice,
            minSuccessRate,
            availability,
            minExperience
        } = req.query;

        const filter = { isActive: true };

        // Build filter conditions
        if (hospital) filter.hospital = hospital;
        if (doctor) filter.doctor = doctor;
        if (category) filter['treatment.category'] = category;
        if (minPrice) filter.finalPrice = { $gte: parseFloat(minPrice) };
        if (maxPrice) filter.finalPrice = { ...filter.finalPrice, $lte: parseFloat(maxPrice) };
        if (minSuccessRate) filter.successRate = { $gte: parseFloat(minSuccessRate) };
        if (availability) filter.availability = availability;
        if (minExperience) filter.experienceWithProcedure = { $gte: parseInt(minExperience) };

        let results;

        if (hospital || (minPrice !== undefined || maxPrice !== undefined) || availability) {
            // Use HospitalTreatment for hospital-related filters
            results = await HospitalTreatment.find(filter)
                .populate('hospital', 'name city country image rating accreditation')
                .populate('treatment', 'title description category icon typicalDuration typicalComplexity typicalRecoveryTime')
                .populate({
                    path: 'doctorTreatments',
                    match: { isActive: true },
                    populate: {
                        path: 'doctor',
                        select: 'firstName lastName specialty image rating experience'
                    }
                });
        } else {
            // Use DoctorTreatment for doctor-related filters
            results = await DoctorTreatment.find(filter)
                .populate('doctor', 'firstName lastName specialty image rating experience qualifications languages')
                .populate('treatment', 'title description category icon typicalDuration typicalComplexity typicalRecoveryTime')
                .populate({
                    path: 'hospitalTreatments',
                    match: { isActive: true },
                    populate: {
                        path: 'hospital',
                        select: 'name city country image rating accreditation'
                    }
                });
        }

        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (err) {
        console.error('Advanced filter treatments error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};