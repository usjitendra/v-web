const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
    // BASIC TREATMENT INFO
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
    ptitle: {
        type: String,
        default: "Medical Treatments & Procedures"
    },
    pdesc: {
        type: String,
        default: "Explore 2 medical treatments and procedures with advanced filtering options to find the right care for your needs."
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    icon: {
        type: String,
        default: '⚕️'
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        // enum: [
        //     'Cardiology', 'Orthopedics', 'Neurology', 'Dentistry',
        //     'Ophthalmology', 'Dermatology', 'Gastroenterology',
        //     'Urology', 'Oncology', 'ENT', 'General Surgery',
        //     'Plastic Surgery', 'Other'
        // ]
    },

    // GENERAL TREATMENT DETAILS (not specific to hospital/doctor)
    typicalDuration: {
        type: Number, // in minutes
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be at least 1 minute']
    },
    typicalComplexity: {
        type: String,
        // enum: ['Low', 'Medium', 'High', 'Very High'],
        default: 'Medium'
    },
    typicalRecoveryTime: {
        type: String,
        default: 'Varies'
    },

    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for hospital offerings
treatmentSchema.virtual('hospitalOfferings', {
    ref: 'HospitalTreatment',
    localField: '_id',
    foreignField: 'treatment'
});

// Virtual for doctor capabilities
treatmentSchema.virtual('doctorCapabilities', {
    ref: 'DoctorTreatment',
    localField: '_id',
    foreignField: 'treatment'
});

// Indexes
treatmentSchema.index({ category: 1 });
treatmentSchema.index({ isActive: 1 });


module.exports = mongoose.model('Treatment', treatmentSchema);