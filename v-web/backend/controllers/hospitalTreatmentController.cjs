const HospitalTreatment = require('../models/HospitalTreatment.cjs');
const Hospital = require('../models/Hospital.cjs');
const Treatment = require('../models/Treatments.cjs');

exports.createHospitalTreatment = async (req, res) => {
    try {
        const { hospital, treatment, price } = req.body;

        if (!hospital || !treatment || !price) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: hospital, treatment, price'
            });
        }

        // Check if hospital exists
        const hospitalExists = await Hospital.findById(hospital);
        if (!hospitalExists) {
            return res.status(400).json({ success: false, error: 'Hospital does not exist' });
        }

        // Check if treatment exists
        const treatmentExists = await Treatment.findById(treatment);
        if (!treatmentExists) {
            return res.status(400).json({ success: false, error: 'Treatment does not exist' });
        }

        const hospitalTreatment = await HospitalTreatment.create(req.body);

        // Populate the created relationship
        await hospitalTreatment.populate('hospital', 'name city country');
        await hospitalTreatment.populate('treatment', 'title description category');

        // Add to hospital's treatments array
        await Hospital.findByIdAndUpdate(hospital, {
            $addToSet: { treatments: hospitalTreatment._id }
        });

        res.status(201).json({ success: true, data: hospitalTreatment });
    } catch (err) {
        console.error('Create hospital treatment error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'This hospital already offers this treatment' });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getHospitalTreatments = async (req, res) => {
    try {
        const { hospital, treatment, minPrice, maxPrice } = req.query;

        const filter = { isActive: true };
        if (hospital) filter.hospital = hospital;
        if (treatment) filter.treatment = treatment;
        if (minPrice) filter.finalPrice = { $gte: parseFloat(minPrice) };
        if (maxPrice) filter.finalPrice = { ...filter.finalPrice, $lte: parseFloat(maxPrice) };

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
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get hospitals by treatment
exports.getHospitalsByTreatment = async (req, res) => {
    try {
        const treatmentId = req.params.treatmentId;

        if (!treatmentId) {
            return res.status(400).json({ success: false, error: 'Treatment ID is required' });
        }

        const hospitalTreatments = await HospitalTreatment.find({
            treatment: treatmentId,
            isActive: true
        })
            .populate('hospital', 'name city country image rating')
            .populate('treatment', 'title category') // optional: include treatment details
            .sort({ finalPrice: 1 });

        res.json({
            success: true,
            count: hospitalTreatments.length,
            data: hospitalTreatments
        });
    } catch (err) {
        console.error('Get hospitals by treatment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// Get treatments by hospital
exports.getTreatmentsByHospital = async (req, res) => {
    try {
        const hospitalId = req.params.hospitalId;

        if (!hospitalId) {
            return res.status(400).json({ success: false, error: 'Hospital ID is required' });
        }

        const hospitalTreatments = await HospitalTreatment.find({
            hospital: hospitalId,
            // language: 'EN',
            isActive: true
        })
            .populate('treatment', 'language title description category icon typicalDuration typicalComplexity')
            .sort({ finalPrice: 1 });

        const treatments = hospitalTreatments.map(ht => ht.treatment);

        res.json({
            success: true,
            count: treatments.length,
            data: treatments
        });
    } catch (err) {
        console.error('Get treatments by hospital error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
