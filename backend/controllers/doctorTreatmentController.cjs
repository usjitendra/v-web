const DoctorTreatment = require('../models/DoctorTreatment.cjs');
const Doctor = require('../models/Doctor.cjs');
const Treatment = require('../models/Treatments.cjs');

exports.createDoctorTreatment = async (req, res) => {
    try {
        const { doctor, treatment } = req.body;

        if (!doctor || !treatment) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: doctor, treatment'
            });
        }

        // Check if doctor exists
        const doctorExists = await Doctor.findById(doctor);
        if (!doctorExists) {
            return res.status(400).json({ success: false, error: 'Doctor does not exist' });
        }

        // Check if treatment exists
        const treatmentExists = await Treatment.findById(treatment);
        if (!treatmentExists) {
            return res.status(400).json({ success: false, error: 'Treatment does not exist' });
        }

        const doctorTreatment = await DoctorTreatment.create(req.body);

        // Populate the created relationship
        await doctorTreatment.populate('doctor', 'firstName lastName specialty');
        await doctorTreatment.populate('treatment', 'title description category');

        // Add to doctor's treatments array
        await Doctor.findByIdAndUpdate(doctor, {
            $addToSet: { treatments: doctorTreatment._id }
        });

        res.status(201).json({ success: true, data: doctorTreatment });
    } catch (err) {
        console.error('Create doctor treatment error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'This doctor already performs this treatment' });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getDoctorTreatments = async (req, res) => {
    try {
        const { doctor, treatment, minSuccessRate } = req.query;

        const filter = { isActive: true };
        if (doctor) filter.doctor = doctor;
        if (treatment) filter.treatment = treatment;
        if (minSuccessRate) filter.successRate = { $gte: parseFloat(minSuccessRate) };

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
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get doctors by treatment
exports.getDoctorsByTreatment = async (req, res) => {
    try {
        const treatmentId = req.params.treatmentId;

        if (!treatmentId) {
            return res.status(400).json({ success: false, error: 'Treatment ID is required' });
        }

        const doctorTreatments = await DoctorTreatment.find({
            treatment: treatmentId,
            isActive: true
        })
            .populate('doctor', 'firstName lastName specialty image rating experience')
            .populate('treatment', 'title category') // optional: include treatment details
            .sort({ successRate: -1 }); // highest success rate first

        res.json({
            success: true,
            count: doctorTreatments.length,
            data: doctorTreatments
        });
    } catch (err) {
        console.error('Get doctors by treatment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// Get treatments by doctor
exports.getTreatmentsByDoctor = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        if (!doctorId) {
            return res.status(400).json({ success: false, error: 'Doctor ID is required' });
        }

        const doctorTreatments = await DoctorTreatment.find({
            doctor: doctorId,
            isActive: true
        })
            .populate('treatment', 'title description category icon typicalDuration typicalComplexity')
            .sort({ successRate: -1 });

        const treatments = doctorTreatments.map(dt => dt.treatment);

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
