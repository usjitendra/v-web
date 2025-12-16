const mongoose = require('mongoose');

const doctorTreatmentSchema = new mongoose.Schema({
    language: {
        type: String,
        default: "EN"
    },
    htitle: {
        type: String,
        default: "Our Medical Services"
    },
    hsubtitle: {
        type: String,
        default: "Specialized Treatments",
    },
    hdesc: {
        type: String,
        default: "We offer a wide range of medical treatments and procedures with the highest standards of care"
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: [true, 'Doctor reference is required']
    },
    treatment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Treatment',
        required: [true, 'Treatment reference is required']
    },

    // DOCTOR-SPECIFIC DETAILS
    successRate: {
        type: Number,
        min: [0, 'Success rate cannot be negative'],
        max: [100, 'Success rate cannot exceed 100%'],
        default: 0
    },
    experienceWithProcedure: {
        type: Number, // years
        min: [0, 'Experience cannot be negative'],
        default: 0
    },
    casesPerformed: {
        type: Number,
        min: [0, 'Cases cannot be negative'],
        default: 0
    },
    specialTechniques: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Compound index for unique doctor-treatment combination
doctorTreatmentSchema.index({ doctor: 1, treatment: 1, language: 1 }, { unique: true });

module.exports = mongoose.model('DoctorTreatment', doctorTreatmentSchema);