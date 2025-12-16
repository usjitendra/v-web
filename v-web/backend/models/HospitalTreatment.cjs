const mongoose = require('mongoose');

const hospitalTreatmentSchema = new mongoose.Schema({
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
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'Hospital reference is required']
    },
    treatment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Treatment',
        required: [true, 'Treatment reference is required']
    },

    // HOSPITAL-SPECIFIC DETAILS
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    discount: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%'],
        default: 0
    },
    finalPrice: {
        type: Number,
        min: [0, 'Price cannot be negative']
    },
    availability: {
        type: String,
        enum: ['Available', 'Limited', 'Waitlist', 'Not Available'],
        default: 'Available'
    },
    waitingPeriod: {
        type: Number, // in days
        default: 0
    },
    specialNotes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Calculate final price before saving
hospitalTreatmentSchema.pre('save', function (next) {
    if (this.isModified('price') || this.isModified('discount')) {
        this.finalPrice = this.price - (this.price * (this.discount / 100));
    }
    next();
});

// Compound index for unique hospital-treatment combination
hospitalTreatmentSchema.index({ hospital: 1, treatment: 1 }, { unique: true });

module.exports = mongoose.model('HospitalTreatment', hospitalTreatmentSchema);