const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
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
        default: "Find Doctors",
    },
    pdesc: {
        type: String,
        default: "Discover 4 medical specialists with advanced filtering options to find the right healthcare professional for your needs."
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    fullName: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Image URL is required'],
        // validate: {
        //     // validator: function (v) {
        //     //     return /^(https?:\/\/).+\.(jpg|jpeg|png|webp)$/i.test(v);
        //     // },
        //     // message: 'Please provide a valid image URL'
        // }
    },
    specialty: {
        type: String,
        required: [true, 'Specialty is required'],
        trim: true
    },
    specialties: [{
        type: String,
        trim: true
    }],
    treatments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DoctorTreatment'
    }],
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'Hospital is required']
    },
    qualifications: [{
        degree: {
            type: String,
            required: true,
            trim: true
        },
        institute: {
            type: String,
            required: true,
            trim: true
        },
        year: {
            type: Number,
            min: [1900, 'Year must be after 1900'],
            max: [new Date().getFullYear(), 'Year cannot be in the future']
        }
    }],
    experience: {
        type: Number,
        min: [0, 'Experience cannot be negative'],
        max: [60, 'Experience cannot exceed 60 years']
    },
    languages: [{
        type: String,
        trim: true
    }],
    rating: {
        type: Number,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5'],
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    consultationFee: {
        type: Number,
        min: [0, 'Fee cannot be negative'],
        required: [true, 'Consultation fee is required']
    },
    availability: {
        Monday: [{ start: String, end: String }],
        Tuesday: [{ start: String, end: String }],
        Wednesday: [{ start: String, end: String }],
        Thursday: [{ start: String, end: String }],
        Friday: [{ start: String, end: String }],
        Saturday: [{ start: String, end: String }],
        Sunday: [{ start: String, end: String }]
    },
    bio: {
        type: String,
        maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    awards: [{
        name: String,
        year: Number,
        presentedBy: String
    }],
    memberships: [{
        type: String,
        trim: true
    }],
    publications: [{
        title: String,
        journal: String,
        year: Number,
        link: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create full name before saving
doctorSchema.pre('save', function (next) {
    this.fullName = `${this.firstName} ${this.lastName}`;
    next();
});

// Index for better query performance
doctorSchema.index({ hospital: 1, specialty: 1 });
doctorSchema.index({ specialty: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);