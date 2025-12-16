const Admin = require('../models/Admin.cjs');
const Hospital = require('../models/Hospital.cjs');
const Doctor = require('../models/Doctor.cjs');
const Treatment = require('../models/Treatments.cjs'); // ✅ FIXED - Remove the 's'
const HospitalTreatment = require('../models/HospitalTreatment.cjs');
const DoctorTreatment = require('../models/DoctorTreatment.cjs'); // make sure the path is correct
const ProcedureCost = require('../models/ProcedureCost.cjs');
const FAQ = require('../models/FAQ.cjs');
const PatientOpinion = require('../models/PatientOpinions.cjs');
const HospitalDetail = require('../models/HospitalDetail.cjs');
const About = require('../models/About.cjs');
const Language = require('../models/Language.cjs');



const jwt = require('jsonwebtoken');
// const { default: HospitalDetail } = require('../models/HospitalDetail.cjs');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide username and password'
            });
        }

        const admin = await Admin.findOne({ username, isActive: true });

        if (!admin || !(await admin.correctPassword(password, admin.password))) {
            return res.status(401).json({
                success: false,
                error: 'Incorrect username or password'
            });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        const token = signToken(admin._id);

        res.status(200).json({
            success: true,
            token,
            data: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                permissions: admin.permissions
            }
        });
    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Admin Logout
exports.adminLogout = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        console.error('Admin logout error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const [
            totalHospitals,
            totalDoctors,
            totalTreatments,
            totalHospitalTreatments,
            activeHospitals,
            activeDoctors
        ] = await Promise.all([
            Hospital.countDocuments(),
            Doctor.countDocuments(),
            Treatment.countDocuments(),
            HospitalTreatment.countDocuments(),
            Hospital.countDocuments({ isActive: true }),
            Doctor.countDocuments({ isActive: true })
        ]);

        res.json({
            success: true,
            data: {
                totalHospitals,
                totalDoctors,
                totalTreatments,
                totalHospitalTreatments,
                activeHospitals,
                activeDoctors
            }
        });
    } catch (err) {
        console.error('Get dashboard stats error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Hospital Management
exports.getHospitals = async (req, res) => {
    try {
        const { page = 1, limit = 10000, search } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { name: new RegExp(search, 'i') },
                { city: new RegExp(search, 'i') },
                { country: new RegExp(search, 'i') }
            ];
        }

        const hospitals = await Hospital.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Hospital.countDocuments(filter);

        res.json({
            success: true,
            count: hospitals.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: hospitals
        });
    } catch (err) {
        console.error('Get hospitals error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// Similar methods for doctors, treatments, etc...
exports.getDoctors = async (req, res) => {
    try {
        const { page = 1, limit = 10000, search, hospital } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { firstName: new RegExp(search, 'i') },
                { lastName: new RegExp(search, 'i') },
                { specialty: new RegExp(search, 'i') }
            ];
        }
        if (hospital) filter.hospital = hospital;

        const doctors = await Doctor.find(filter)
            .populate('hospital', 'name city')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Doctor.countDocuments(filter);

        res.json({
            success: true,
            count: doctors.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: doctors
        });
    } catch (err) {
        console.error('Get doctors error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


exports.getHospitalTreatments = async (req, res) => {
    try {
        const { page = 1, limit = 10000, hospital, treatment } = req.query;
        const filter = {};

        if (hospital) filter.hospital = hospital;
        if (treatment) filter.treatment = treatment;

        const hospitalTreatments = await HospitalTreatment.find(filter)
            .populate('hospital', 'name city country image')
            .populate('treatment', 'title category')
            .sort({ finalPrice: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await HospitalTreatment.countDocuments(filter);

        res.json({
            success: true,
            count: hospitalTreatments.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: hospitalTreatments
        });
    } catch (err) {
        console.error('Get hospital treatments error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// CRUD operations for hospitals, doctors, treatments...
exports.createHospital = async (req, res) => {
    try {
        const hospital = await Hospital.create(req.body);
        res.status(201).json({ success: true, data: hospital });
    } catch (err) {
        console.error('Create hospital error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.createHospitalDetails = async (req, res) => {
    try {
        const hospitalDetail = await HospitalDetail.create(req.body);
        res.status(201).json({ success: true, data: hospitalDetail });
    } catch (err) {
        console.error('Create Hospital Detail error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
}



exports.updateHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.json({ success: true, data: hospital });
    } catch (err) {
        console.error('Update hospital error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.deleteHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);
        if (!hospital) {
            return res.status(404).json({ success: false, error: 'Hospital not found' });
        }
        res.json({ success: true, message: 'Hospital deleted successfully' });
    } catch (err) {
        console.error('Hospital error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });

    }
}

// ================= DOCTOR CRUD =================

// Create Doctor
exports.createDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.create(req.body);
        res.status(201).json({ success: true, data: doctor });
    } catch (err) {
        console.error('Create doctor error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update Doctor
exports.updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }
        res.json({ success: true, data: doctor });
    } catch (err) {
        console.error('Update doctor error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Delete Doctor
exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }
        res.json({ success: true, message: 'Doctor deleted successfully' });
    } catch (err) {
        console.error('Delete doctor error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get Single Doctor by ID
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .populate('hospital', 'name city')
            .populate('treatments');

        if (!doctor) {
            return res.status(404).json({ success: false, error: 'Doctor not found' });
        }

        res.json({ success: true, data: doctor });
    } catch (err) {
        console.error('Get doctor by id error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// ================= HOSPITAL TREATMENT CRUD =================

// Create HospitalTreatment
exports.createHospitalTreatment = async (req, res) => {
    try {
        const hospitalTreatment = await HospitalTreatment.create(req.body);
        res.status(201).json({ success: true, data: hospitalTreatment });
    } catch (err) {
        console.error('Create hospital treatment error:', err);

        // Handle unique constraint (hospital + treatment already exists)
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'This hospital already offers this treatment'
            });
        }

        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update HospitalTreatment
exports.updateHospitalTreatment = async (req, res) => {
    try {
        const hospitalTreatment = await HospitalTreatment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!hospitalTreatment) {
            return res.status(404).json({ success: false, error: 'Hospital Treatment not found' });
        }

        res.json({ success: true, data: hospitalTreatment });
    } catch (err) {
        console.error('Update hospital treatment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Delete HospitalTreatment
exports.deleteHospitalTreatment = async (req, res) => {
    try {
        const hospitalTreatment = await HospitalTreatment.findByIdAndDelete(req.params.id);
        if (!hospitalTreatment) {
            return res.status(404).json({ success: false, error: 'Hospital Treatment not found' });
        }

        res.json({ success: true, message: 'Hospital Treatment deleted successfully' });
    } catch (err) {
        console.error('Delete hospital treatment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get Single HospitalTreatment by ID
exports.getHospitalTreatmentById = async (req, res) => {
    try {
        const hospitalTreatment = await HospitalTreatment.findById(req.params.id)
            .populate('hospital', 'name city country')
            .populate('treatment', 'title category');

        if (!hospitalTreatment) {
            return res.status(404).json({ success: false, error: 'Hospital Treatment not found' });
        }

        res.json({ success: true, data: hospitalTreatment });
    } catch (err) {
        console.error('Get hospital treatment by id error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// ================= DOCTOR TREATMENT CRUD =================

// Create DoctorTreatment
exports.createDoctorTreatment = async (req, res) => {
    try {
        const doctorTreatment = await DoctorTreatment.create(req.body);
        res.status(201).json({ success: true, data: doctorTreatment });
    } catch (err) {
        console.error('Create doctor treatment error:', err);

        // Handle unique constraint (doctor + treatment already exists)
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'This doctor already has this treatment assigned'
            });
        }

        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update DoctorTreatment
exports.updateDoctorTreatment = async (req, res) => {
    try {
        const doctorTreatment = await DoctorTreatment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!doctorTreatment) {
            return res.status(404).json({ success: false, error: 'Doctor Treatment not found' });
        }

        res.json({ success: true, data: doctorTreatment });
    } catch (err) {
        console.error('Update doctor treatment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Delete DoctorTreatment
exports.deleteDoctorTreatment = async (req, res) => {
    try {
        const doctorTreatment = await DoctorTreatment.findByIdAndDelete(req.params.id);
        if (!doctorTreatment) {
            return res.status(404).json({ success: false, error: 'Doctor Treatment not found' });
        }

        res.json({ success: true, message: 'Doctor Treatment deleted successfully' });
    } catch (err) {
        console.error('Delete doctor treatment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get Single DoctorTreatment by ID
exports.getDoctorTreatmentById = async (req, res) => {
    try {
        const doctorTreatment = await DoctorTreatment.findById(req.params.id)
            .populate('doctor', 'firstName lastName fullName specialty hospital')
            .populate('treatment', 'title category');

        if (!doctorTreatment) {
            return res.status(404).json({ success: false, error: 'Doctor Treatment not found' });
        }

        res.json({ success: true, data: doctorTreatment });
    } catch (err) {
        console.error('Get doctor treatment by id error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get All DoctorTreatments (with filters)
exports.getDoctorTreatments = async (req, res) => {
    try {
        const { page = 1, limit = 10000, doctor, treatment } = req.query;
        const filter = {};

        if (doctor) filter.doctor = doctor;
        if (treatment) filter.treatment = treatment;

        const doctorTreatments = await DoctorTreatment.find(filter)
            .populate('doctor', 'firstName lastName fullName specialty hospital')
            .populate('treatment', 'title category')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await DoctorTreatment.countDocuments(filter);

        res.json({
            success: true,
            count: doctorTreatments.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: doctorTreatments
        });
    } catch (err) {
        console.error('Get doctor treatments error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// ================= TREATMENT CRUD =================

// Create Treatment
exports.createTreatment = async (req, res) => {
    try {
        const treatment = await Treatment.create(req.body);
        res.status(201).json({ success: true, data: treatment });
    } catch (err) {
        console.error('Create treatment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update Treatment
exports.updateTreatment = async (req, res) => {
    try {
        const treatment = await Treatment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!treatment) {
            return res.status(404).json({ success: false, error: 'Treatment not found' });
        }

        res.json({ success: true, data: treatment });
    } catch (err) {
        console.error('Update treatment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Delete Treatment
exports.deleteTreatment = async (req, res) => {
    try {
        const treatment = await Treatment.findByIdAndDelete(req.params.id);
   

        if (!treatment) {
            return res.status(404).json({ success: false, error: 'Treatment not found' });
        }

        res.json({ success: true, message: 'Treatment deleted successfully' });
    } catch (err) {
        console.error('Delete treatment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get Single Treatment
exports.getTreatmentById = async (req, res) => {
    try {
        const treatment = await Treatment.findById(req.params.id)
            .populate('hospitalOfferings', 'hospital cost isAvailable')
            .populate('doctorCapabilities', 'doctor successRate experienceWithProcedure casesPerformed');

        if (!treatment) {
            return res.status(404).json({ success: false, error: 'Treatment not found' });
        }

        res.json({ success: true, data: treatment });
    } catch (err) {
        console.error('Get treatment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get All Treatments (with search & filters)
exports.getTreatments = async (req, res) => {
    try {
        const { page = 1, limit = 10000, category, search } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (search) filter.$text = { $search: search };

        const treatments = await Treatment.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Treatment.countDocuments(filter);

        res.json({
            success: true,
            count: treatments.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: treatments
        });
    } catch (err) {
        console.error('Get treatments error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// ================= PROCEDURE COST CRUD =================
exports.createProcedureCost = async (req, res) => {
    try {
        const procedure = await ProcedureCost.create(req.body);
        res.status(201).json({ success: true, data: procedure });
    } catch (err) {
        console.error('Create procedure cost error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.updateProcedureCost = async (req, res) => {
    try {
        const procedure = await ProcedureCost.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!procedure) {
            return res.status(404).json({ success: false, error: 'Procedure not found' });
        }
        res.json({ success: true, data: procedure });
    } catch (err) {
        console.error('Update procedure cost error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.deleteProcedureCost = async (req, res) => {
    try {
        const procedure = await ProcedureCost.findByIdAndDelete(req.params.id);
        if (!procedure) {
            return res.status(404).json({ success: false, error: 'Procedure not found' });
        }
        res.json({ success: true, message: 'Procedure deleted successfully' });
    } catch (err) {
        console.error('Delete procedure cost error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getProcedureCosts = async (req, res) => {
    try {
        const { page = 1, limit = 10000, category, search } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (search) filter.$or = [{ title: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];

        const procedures = await ProcedureCost.find(filter)
            .populate('treatment', 'title category')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await ProcedureCost.countDocuments(filter);
        res.json({
            success: true,
            count: procedures.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: procedures
        });
    } catch (err) {
        console.error('Get procedure costs error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getProcedureCostById = async (req, res) => {
    try {
        const procedure = await ProcedureCost.findById(req.params.id).populate('treatment', 'title category');
        if (!procedure) {
            return res.status(404).json({ success: false, error: 'Procedure not found' });
        }
        res.json({ success: true, data: procedure });
    } catch (err) {
        console.error('Get procedure cost by id error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// ================= FAQ CRUD =================
exports.createFAQ = async (req, res) => {
    try {
        const faq = await FAQ.create(req.body);
        res.status(201).json({ success: true, data: faq });
    } catch (err) {
        console.error('Create FAQ error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.updateFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });
        res.json({ success: true, data: faq });
    } catch (err) {
        console.error('Update FAQ error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.deleteFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndDelete(req.params.id);
        if (!faq) return res.status(404).json({ success: false, error: 'FAQ not found' });
        res.json({ success: true, message: 'FAQ deleted successfully' });
    } catch (err) {
        console.error('Delete FAQ error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getFAQs = async (req, res) => {
    try {
        const { page = 1, limit = 10000, category, search } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (search) filter.$or = [{ question: new RegExp(search, 'i') }, { answer: new RegExp(search, 'i') }];

        const faqs = await FAQ.find(filter)
            .sort({ order: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await FAQ.countDocuments(filter);
        res.json({
            success: true,
            count: faqs.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: faqs
        });
    } catch (err) {
        console.error('Get FAQs error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// ================= PATIENT OPINION CRUD =================
exports.createPatientOpinion = async (req, res) => {
    try {
        const opinion = await PatientOpinion.create(req.body);
        res.status(201).json({ success: true, data: opinion });
    } catch (err) {
        console.error('Create patient opinion error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.updatePatientOpinion = async (req, res) => {
    try {
        const opinion = await PatientOpinion.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!opinion) return res.status(404).json({ success: false, error: 'Patient opinion not found' });
        res.json({ success: true, data: opinion });
    } catch (err) {
        console.error('Update patient opinion error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.deletePatientOpinion = async (req, res) => {
    try {
        const opinion = await PatientOpinion.findByIdAndDelete(req.params.id);
        if (!opinion) return res.status(404).json({ success: false, error: 'Patient opinion not found' });
        res.json({ success: true, message: 'Patient opinion deleted successfully' });
    } catch (err) {
        console.error('Delete patient opinion error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

exports.getPatientOpinions = async (req, res) => {
    try {
        const { page = 1, limit = 10000, search } = req.query;
        const filter = {};
        if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { text: new RegExp(search, 'i') }];

        const opinions = await PatientOpinion.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await PatientOpinion.countDocuments(filter);
        res.json({
            success: true,
            count: opinions.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: opinions
        });
    } catch (err) {
        console.error('Get patient opinions error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// ==============================
// HOSPITAL DETAIL CONTROLLERS
// ==============================

// @desc    Get all hospital details
// @route   GET /api/admin/hospital-details
// @access  Protected
exports.getHospitalDetails = async (req, res) => {
    try {
        const details = await HospitalDetail.find().populate('hospital', 'name');
        res.status(200).json({
            status: 'success',
            results: details.length,
            data: details
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// @desc    Get single hospital detail by ID
// @route   GET /api/admin/hospital-details/:id
// @access  Protected
exports.getHospitalDetailById = async (req, res) => {
    try {
        const detail = await HospitalDetail.findById(req.params.id).populate('hospital', 'name');
        if (!detail) {
            return res.status(404).json({ status: 'fail', message: 'Hospital detail not found' });
        }
        res.status(200).json({ status: 'success', data: detail });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// @desc    Create hospital detail
// @route   POST /api/admin/hospital-details
// @access  Protected (superadmin, admin)
exports.createHospitalDetail = async (req, res) => {
    try {
        const detail = await HospitalDetail.create(req.body);
        res.status(201).json({ status: 'success', data: detail });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Update hospital detail
// @route   PUT /api/admin/hospital-details/:id
// @access  Protected (superadmin, admin)
exports.updateHospitalDetail = async (req, res) => {
    try {
        const detail = await HospitalDetail.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!detail) {
            return res.status(404).json({ status: 'fail', message: 'Hospital detail not found' });
        }
        res.status(200).json({ status: 'success', data: detail });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// @desc    Delete hospital detail
// @route   DELETE /api/admin/hospital-details/:id
// @access  Protected (superadmin only)
exports.deleteHospitalDetail = async (req, res) => {
    try {
        const detail = await HospitalDetail.findByIdAndDelete(req.params.id);
        if (!detail) {
            return res.status(404).json({ status: 'fail', message: 'Hospital detail not found' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};



// ==============================
// BOOKING MANAGEMENT CONTROLLERS
// ==============================

const Booking = require('../models/Bookings.cjs'); // Make sure to import Booking model
// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Protected
exports.getBookings = async (req, res) => {
    try {
        const { page = 1, limit = 10000, read, replied, confirmed, search } = req.query;
        const filter = {};

        // Filter by status
        if (read !== undefined) filter['status.read'] = read === 'true';
        if (replied !== undefined) filter['status.replied'] = replied === 'true';
        if (confirmed !== undefined) filter['status.confirmed'] = confirmed === 'true';

        // Search filter
        if (search) {
            filter.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { phone: new RegExp(search, 'i') },
                { 'doctor.firstName': new RegExp(search, 'i') },
                { 'doctor.lastName': new RegExp(search, 'i') },
                { 'hospital.name': new RegExp(search, 'i') }
            ];
        }

        const bookings = await Booking.find(filter)
            .populate('doctor', 'firstName lastName specialty') // Populate doctor details
            .populate('hospital', 'name city country') // Populate hospital details
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Booking.countDocuments(filter);

        res.json({
            success: true,
            count: bookings.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: bookings
        });
    } catch (err) {
        console.error('Get bookings error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get booking statistics
// @route   GET /api/admin/bookings/stats
// @access  Protected
exports.getBookingStats = async (req, res) => {
    try {
        const [
            totalBookings,
            unreadBookings,
            repliedBookings,
            confirmedBookings,
            todayBookings
        ] = await Promise.all([
            Booking.countDocuments(),
            Booking.countDocuments({ 'status.read': false }),
            Booking.countDocuments({ 'status.replied': true }),
            Booking.countDocuments({ 'status.confirmed': true }),
            Booking.countDocuments({
                createdAt: {
                    $gte: new Date().setHours(0, 0, 0, 0),
                    $lt: new Date().setHours(23, 59, 59, 999)
                }
            })
        ]);

        res.json({
            success: true,
            data: {
                total: totalBookings,
                unread: unreadBookings,
                replied: repliedBookings,
                confirmed: confirmedBookings,
                today: todayBookings
            }
        });
    } catch (err) {
        console.error('Get booking stats error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single booking by ID
// @route   GET /api/admin/bookings/:id
// @access  Protected
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('doctor', 'firstName lastName specialty experience') // Populate doctor details
            .populate('hospital', 'name city country phone'); // Populate hospital details

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }
        res.json({
            success: true,
            data: booking
        });
    } catch (err) {
        console.error('Get booking by id error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id
// @access  Protected
exports.updateBookingStatus = async (req, res) => {
    try {
        const { read, replied, confirmed } = req.body;
        const updateData = {};

        if (read !== undefined) updateData['status.read'] = read;
        if (replied !== undefined) updateData['status.replied'] = replied;
        if (confirmed !== undefined) updateData['status.confirmed'] = confirmed;

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        )
            .populate('doctor', 'firstName lastName specialty') // Populate after update
            .populate('hospital', 'name city country'); // Populate after update

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            data: booking
        });
    } catch (err) {
        console.error('Update booking status error:', err);
        res.status(400).json({
            success: false,
            error: 'Error updating booking status'
        });
    }
};

// @desc    Delete booking
// @route   DELETE /api/admin/bookings/:id
// @access  Protected (superadmin only)
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }
        res.json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (err) {
        console.error('Delete booking error:', err);
        res.status(500).json({
            success: false,
            error: 'Error deleting booking'
        });
    }
};

// controllers/aboutController.cjs - Add these functions

// @desc    Get about page content for admin
// @route   GET /api/admin/about
// @access  Protected (Admin)
exports.getAboutAdmin = async (req, res) => {
    try {
        let about = await About.findOne({ isActive: true });

        if (!about) {
            about = await About.create({
                title: "About Us",
                subtitle: "We're committed to making healthcare accessible, transparent, and easy to navigate",
                missionTitle: "Our Mission",
                missionDescription: "This platform was created as a learning project to replicate the experience of a modern healthcare directory and booking service.",
                image: "/aboutpage.jpg",
                highlights: [
                    { icon: "HeartPulse", text: "Simplifying healthcare decisions with clarity" },
                    { icon: "Stethoscope", text: "Intuitive tools for better patient experience" },
                    { icon: "Users", text: "Building trust through transparency" }
                ],
                whatsappNumber: "+1234567890",
                whatsappMessage: "Hello! I have a question about your healthcare services."
            });
        }

        res.json({
            success: true,
            data: about
        });
    } catch (err) {
        console.error('Get about admin error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update about page content from admin
// @route   PUT /api/admin/about
// @access  Protected (Admin)
exports.updateAboutAdmin = async (req, res) => {
    try {
        let about = await About.findOne({ isActive: true });

        if (!about) {
            about = new About(req.body);
        } else {
            about = await About.findByIdAndUpdate(
                about._id,
                req.body,
                { new: true, runValidators: true }
            );
        }

        const savedAbout = await about.save();

        res.json({
            success: true,
            message: 'About page updated successfully',
            data: savedAbout
        });
    } catch (err) {
        console.error('Update about admin error:', err);
        res.status(400).json({ success: false, error: 'Error updating about page' });
    }
};


// Get all admins
exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({}).select('-password'); // Exclude password
        res.json({
            success: true,
            count: admins.length,
            data: admins,
        });
    } catch (err) {
        console.error('Get admins error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get single admin by ID
exports.getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select('-password');
        if (!admin) {
            return res.status(404).json({ success: false, error: 'Admin not found' });
        }
        res.json({ success: true, data: admin });
    } catch (err) {
        console.error('Get admin by id error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Create new admin
exports.createAdmin = async (req, res) => {
    try {
        const admin = await Admin.create(req.body);
        res.status(201).json({ success: true, data: admin });
    } catch (err) {
        console.error('Create admin error:', err);
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'Username or email already exists' });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update admin
exports.updateAdmin = async (req, res) => {
    try {
        const { password, ...updateData } = req.body; // Exclude password from update unless explicitly provided
        if (password) {
            updateData.password = password;
        }
        const admin = await Admin.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        }).select('-password');
        if (!admin) {
            return res.status(404).json({ success: false, error: 'Admin not found' });
        }
        res.json({ success: true, data: admin });
    } catch (err) {
        console.error('Update admin error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, error: 'Admin not found' });
        }
        res.json({ success: true, message: 'Admin deleted successfully' });
    } catch (err) {
        console.error('Delete admin error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// ================= LANGUAGE CRUD OPERATIONS =================

// Get all languages for admin
exports.getLanguages = async (req, res) => {
    try {
        const { page = 1, limit = 10000, search = '', isActive } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { shortCode: { $regex: search, $options: 'i' } }
            ];
        }

        if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        const languages = await Language.find(filter)
            .sort({ fullName: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Language.countDocuments(filter);

        res.json({
            success: true,
            count: languages.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: languages
        });
    } catch (err) {
        console.error('Get languages error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get single language by ID
exports.getLanguageById = async (req, res) => {
    try {
        const language = await Language.findById(req.params.id);

        if (!language) {
            return res.status(404).json({
                success: false,
                error: 'Language not found'
            });
        }

        res.json({
            success: true,
            data: language
        });
    } catch (err) {
        console.error('Get language by id error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Create new language
exports.createLanguage = async (req, res) => {
    try {
        const { fullName, shortCode, isActive = true, isDefault = false } = req.body;

        // Check if language already exists
        const existingLanguage = await Language.findOne({
            $or: [
                { fullName: fullName.trim() },
                { shortCode: shortCode.trim().toUpperCase() }
            ]
        });

        if (existingLanguage) {
            return res.status(400).json({
                success: false,
                error: 'Language with this name or code already exists'
            });
        }

        const language = await Language.create({
            fullName: fullName.trim(),
            shortCode: shortCode.trim().toUpperCase(),
            isActive,
            isDefault
        });

        res.status(201).json({
            success: true,
            data: language
        });
    } catch (err) {
        console.error('Create language error:', err);

        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: Object.values(err.errors).map(e => e.message).join(', ')
            });
        }

        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update language
exports.updateLanguage = async (req, res) => {
    try {
        const { fullName, shortCode, isActive, isDefault } = req.body;

        const language = await Language.findById(req.params.id);
        if (!language) {
            return res.status(404).json({
                success: false,
                error: 'Language not found'
            });
        }

        // Check for duplicate languages (excluding current one)
        if (fullName || shortCode) {
            const duplicateQuery = {
                _id: { $ne: req.params.id },
                $or: []
            };

            if (fullName) duplicateQuery.$or.push({ fullName: fullName.trim() });
            if (shortCode) duplicateQuery.$or.push({ shortCode: shortCode.trim().toUpperCase() });

            if (duplicateQuery.$or.length > 0) {
                const existingLanguage = await Language.findOne(duplicateQuery);
                if (existingLanguage) {
                    return res.status(400).json({
                        success: false,
                        error: 'Language with this name or code already exists'
                    });
                }
            }
        }

        // Update fields
        const updateData = {};
        if (fullName) updateData.fullName = fullName.trim();
        if (shortCode) updateData.shortCode = shortCode.trim().toUpperCase();
        if (typeof isActive !== 'undefined') updateData.isActive = isActive;
        if (typeof isDefault !== 'undefined') updateData.isDefault = isDefault;

        const updatedLanguage = await Language.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: updatedLanguage
        });
    } catch (err) {
        console.error('Update language error:', err);

        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: Object.values(err.errors).map(e => e.message).join(', ')
            });
        }

        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Delete language
exports.deleteLanguage = async (req, res) => {
    try {
        const language = await Language.findById(req.params.id);
        if (!language) {
            return res.status(404).json({
                success: false,
                error: 'Language not found'
            });
        }

        // Prevent deletion of default language
        if (language.isDefault) {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete default language'
            });
        }

        await Language.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Language deleted successfully'
        });
    } catch (err) {
        console.error('Delete language error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Set default language
exports.setDefaultLanguage = async (req, res) => {
    try {
        const language = await Language.findById(req.params.id);
        if (!language) {
            return res.status(404).json({
                success: false,
                error: 'Language not found'
            });
        }

        // Update all languages to not default
        await Language.updateMany({}, { $set: { isDefault: false } });

        // Set this language as default
        language.isDefault = true;
        await language.save();

        res.json({
            success: true,
            data: language
        });
    } catch (err) {
        console.error('Set default language error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
const Heading = require('../models/Headings.cjs');

// Get all headings
exports.getHeadings = async (req, res) => {
    try {
        const { page = 1, limit = 10000, section, language, search } = req.query;
        const filter = {};

        if (section) filter.section = section;
        if (language) filter.language = language;
        if (search) {
            filter.$or = [
                { 'home.heading': new RegExp(search, 'i') },
                { 'home.subheading': new RegExp(search, 'i') },
                { 'page.heading': new RegExp(search, 'i') },
                { 'detailPage.headings.text': new RegExp(search, 'i') }
            ];
        }

        const headings = await Heading.find(filter)
            .sort({ section: 1, language: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Heading.countDocuments(filter);

        res.json({
            success: true,
            count: headings.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: headings
        });
    } catch (err) {
        console.error('Get headings error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get heading by ID
exports.getHeadingById = async (req, res) => {
    try {
        const heading = await Heading.findById(req.params.id);

        if (!heading) {
            return res.status(404).json({
                success: false,
                error: 'Heading not found'
            });
        }

        res.json({
            success: true,
            data: heading
        });
    } catch (err) {
        console.error('Get heading by id error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Create heading
exports.createHeading = async (req, res) => {
    try {
        const { section, language } = req.body;

        // Check if heading with same section and language already exists
        const existingHeading = await Heading.findOne({ section, language });
        if (existingHeading) {
            return res.status(400).json({
                success: false,
                error: 'Heading for this section and language already exists'
            });
        }

        const heading = await Heading.create(req.body);
        res.status(201).json({ success: true, data: heading });
    } catch (err) {
        console.error('Create heading error:', err);

        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Heading for this section and language already exists'
            });
        }

        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update heading
exports.updateHeading = async (req, res) => {
    try {
        const heading = await Heading.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!heading) {
            return res.status(404).json({
                success: false,
                error: 'Heading not found'
            });
        }

        res.json({
            success: true,
            data: heading
        });
    } catch (err) {
        console.error('Update heading error:', err);

        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Heading for this section and language already exists'
            });
        }

        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Delete heading
exports.deleteHeading = async (req, res) => {
    try {
        const heading = await Heading.findByIdAndDelete(req.params.id);

        if (!heading) {
            return res.status(404).json({
                success: false,
                error: 'Heading not found'
            });
        }

        res.json({
            success: true,
            message: 'Heading deleted successfully'
        });
    } catch (err) {
        console.error('Delete heading error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};




const Appointment = require('../models/Appointment.cjs');
const Patient = require('../models/Patient.cjs');

// Get all patients
exports.getPatients = async (req, res) => {
    try {
        const { page = 1, limit = 10000, search } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { firstName: new RegExp(search, 'i') },
                { lastName: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { phone: new RegExp(search, 'i') }
            ];
        }

        const patients = await Patient.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Patient.countDocuments(filter);

        res.json({
            success: true,
            count: patients.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: patients
        });
    } catch (err) {
        console.error('Get patients error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get patient by ID
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).select('-password');

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
        console.error('Get patient by id error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Create patient
exports.createPatient = async (req, res) => {
    try {
        const patient = await Patient.create(req.body);

        // Remove password from response
        const patientResponse = patient.toObject();
        delete patientResponse.password;

        res.status(201).json({ success: true, data: patientResponse });
    } catch (err) {
        console.error('Create patient error:', err);

        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Patient with this email already exists'
            });
        }

        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update patient
exports.updatePatient = async (req, res) => {
    try {
        // Don't update password through this method
        if (req.body.password) {
            delete req.body.password;
        }

        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');

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
        console.error('Update patient error:', err);

        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Patient with this email already exists'
            });
        }

        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Delete patient
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                error: 'Patient not found'
            });
        }

        // Also delete all appointments for this patient
        await Appointment.deleteMany({ patientId: req.params.id });

        res.json({
            success: true,
            message: 'Patient and associated appointments deleted successfully'
        });
    } catch (err) {
        console.error('Delete patient error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get all appointments
exports.getAppointments = async (req, res) => {
    try {
        const { page = 1, limit = 10000, patientId, status, dateFrom, dateTo } = req.query;
        const filter = {};

        if (patientId) filter.patientId = patientId;
        if (status) filter.status = status;

        // Date range filter
        if (dateFrom || dateTo) {
            filter.appointmentDate = {};
            if (dateFrom) filter.appointmentDate.$gte = new Date(dateFrom);
            if (dateTo) filter.appointmentDate.$lte = new Date(dateTo);
        }

        const appointments = await Appointment.find(filter)
            .populate('patientId', 'firstName lastName email phone')
            .populate('hospitalId', 'name city')
            .populate('doctorId', 'firstName lastName specialty')
            .populate('treatmentId', 'title category')
            .sort({ appointmentDate: 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Appointment.countDocuments(filter);

        res.json({
            success: true,
            count: appointments.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: appointments
        });
    } catch (err) {
        console.error('Get appointments error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patientId', 'firstName lastName email phone dateOfBirth gender')
            .populate('hospitalId', 'name city address phone')
            .populate('doctorId', 'firstName lastName specialty experience')
            .populate('treatmentId', 'title category description');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            data: appointment
        });
    } catch (err) {
        console.error('Get appointment by id error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Create appointment
exports.createAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.create(req.body);

        // Populate the created appointment
        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('patientId', 'firstName lastName email phone')
            .populate('hospitalId', 'name city')
            .populate('doctorId', 'firstName lastName specialty')
            .populate('treatmentId', 'title category');

        res.status(201).json({ success: true, data: populatedAppointment });
    } catch (err) {
        console.error('Create appointment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update appointment
exports.updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('patientId', 'firstName lastName email phone')
            .populate('hospitalId', 'name city')
            .populate('doctorId', 'firstName lastName specialty')
            .populate('treatmentId', 'title category');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            data: appointment
        });
    } catch (err) {
        console.error('Update appointment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        res.json({
            success: true,
            message: 'Appointment deleted successfully'
        });
    } catch (err) {
        console.error('Delete appointment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get patient dashboard data
exports.getPatientDashboard = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Verify patient exists
        const patient = await Patient.findById(patientId).select('-password');
        if (!patient) {
            return res.status(404).json({
                success: false,
                error: 'Patient not found'
            });
        }

        const currentDate = new Date();

        // Get upcoming appointments (from today onward)
        const upcomingAppointments = await Appointment.find({
            patientId,
            appointmentDate: { $gte: currentDate },
            status: { $in: ['scheduled', 'confirmed'] }
        })
            .populate('hospitalId', 'name city address phone')
            .populate('doctorId', 'firstName lastName specialty')
            .populate('treatmentId', 'title category')
            .sort({ appointmentDate: 1 });

        // Get past appointments (before today)
        const pastAppointments = await Appointment.find({
            patientId,
            appointmentDate: { $lt: currentDate }
        })
            .populate('hospitalId', 'name city')
            .populate('doctorId', 'firstName lastName specialty')
            .populate('treatmentId', 'title category')
            .sort({ appointmentDate: -1 })
            .limit(10); // Limit to last 10 appointments

        // Get appointment statistics
        const totalAppointments = await Appointment.countDocuments({ patientId });
        const completedAppointments = await Appointment.countDocuments({
            patientId,
            status: 'completed'
        });
        const upcomingCount = await Appointment.countDocuments({
            patientId,
            appointmentDate: { $gte: currentDate },
            status: { $in: ['scheduled', 'confirmed'] }
        });

        res.json({
            success: true,
            data: {
                patient,
                upcomingAppointments,
                pastAppointments,
                stats: {
                    total: totalAppointments,
                    completed: completedAppointments,
                    upcoming: upcomingCount
                }
            }
        });
    } catch (err) {
        console.error('Get patient dashboard error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Patient registration (for admin adding patients)
exports.registerPatient = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            dateOfBirth,
            gender,
            address,
            medicalHistory,
            allergies,
            emergencyContact,
            insurance,
            language
        } = req.body;

        // Check if patient already exists
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({
                success: false,
                error: 'Patient with this email already exists'
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
            address: address || {},
            medicalHistory: medicalHistory || [],
            allergies: allergies || [],
            emergencyContact: emergencyContact || {},
            insurance: insurance || {},
            language: language || 'EN',
            verified: true // Admin-added patients are automatically verified
        });

        // Remove password from response
        const patientResponse = patient.toObject();
        delete patientResponse.password;

        res.status(201).json({
            success: true,
            message: 'Patient created successfully',
            data: patientResponse
        });
    } catch (err) {
        console.error('Register patient error:', err);

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
                error: 'Patient with this email already exists'
            });
        }

        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Generate random password
exports.generatePassword = async (req, res) => {
    try {
        const length = req.query.length || 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";

        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        res.json({
            success: true,
            data: { password }
        });
    } catch (err) {
        console.error('Generate password error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// ================= BLOG MANAGEMENT CONTROLLERS =================
const Blog = require('../models/Blog.cjs');

// Get all blogs for admin
exports.getBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search, category } = req.query;
        const filter = {};

        if (status && status !== 'all') filter.status = status;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) filter.categories = category;

        const blogs = await Blog.find(filter)
            .populate('author', 'username email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Blog.countDocuments(filter);

        res.json({
            success: true,
            count: blogs.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: blogs
        });
    } catch (err) {
        console.error('Get blogs error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get blog statistics
exports.getBlogStats = async (req, res) => {
    try {
        const [
            totalBlogs,
            publishedBlogs,
            draftBlogs,
            archivedBlogs,
            featuredBlogs,
            totalComments,
            pendingComments
        ] = await Promise.all([
            Blog.countDocuments(),
            Blog.countDocuments({ status: 'published' }),
            Blog.countDocuments({ status: 'draft' }),
            Blog.countDocuments({ status: 'archived' }),
            Blog.countDocuments({ isFeatured: true }),
            Blog.aggregate([{ $project: { commentCount: { $size: '$comments' } } }, { $group: { _id: null, total: { $sum: '$commentCount' } } }]),
            Blog.aggregate([{ $unwind: '$comments' }, { $match: { 'comments.isApproved': false } }, { $count: 'total' }])
        ]);

        res.json({
            success: true,
            data: {
                total: totalBlogs,
                published: publishedBlogs,
                draft: draftBlogs,
                archived: archivedBlogs,
                featured: featuredBlogs,
                totalComments: totalComments[0]?.total || 0,
                pendingComments: pendingComments[0]?.total || 0
            }
        });
    } catch (err) {
        console.error('Get blog stats error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Get single blog by ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'username email')
            .populate('comments.patient', 'name email');

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        res.json({
            success: true,
            data: blog
        });
    } catch (err) {
        console.error('Get blog by id error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Create new blog
exports.createBlog = async (req, res) => {
    try {
        const blogData = {
            ...req.body,
            author: req.admin.id // Set the current admin as author
        };

        const blog = await Blog.create(blogData);
        const populatedBlog = await Blog.findById(blog._id).populate('author', 'username email');

        res.status(201).json({
            success: true,
            data: populatedBlog
        });
    } catch (err) {
        console.error('Create blog error:', err);

        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: Object.values(err.errors).map(e => e.message).join(', ')
            });
        }

        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Update blog
exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('author', 'username email');

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        res.json({
            success: true,
            data: blog
        });
    } catch (err) {
        console.error('Update blog error:', err);

        if (err.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                error: Object.values(err.errors).map(e => e.message).join(', ')
            });
        }

        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        res.json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (err) {
        console.error('Delete blog error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Approve blog comment
exports.approveBlogComment = async (req, res) => {
    try {
        const { blogId, commentId } = req.params;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        const comment = blog.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                error: 'Comment not found'
            });
        }

        comment.isApproved = true;
        await blog.save();

        res.json({
            success: true,
            message: 'Comment approved successfully',
            data: comment
        });
    } catch (err) {
        console.error('Approve blog comment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Delete blog comment
exports.deleteBlogComment = async (req, res) => {
    try {
        const { blogId, commentId } = req.params;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                error: 'Blog not found'
            });
        }

        blog.comments.pull(commentId);
        await blog.save();

        res.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (err) {
        console.error('Delete blog comment error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};