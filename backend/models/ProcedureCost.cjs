const mongoose = require('mongoose');

const procedureCostSchema = new mongoose.Schema({
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
    title: {
        type: String,
        required: [true, 'Procedure title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    treatment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Treatment',
        required: [true, 'Treatment reference is required']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    icon: {
        type: String,
        default: '🦴'
    },
    basePrice: {

        type: Number,
        required: [true, 'Base price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        // enum: [
        //     'Cardiology', 'Orthopedics', 'Neurology', 'Dentistry',
        //     'Ophthalmology', 'Dermatology', 'Gastroenterology',
        //     'Urology', 'Oncology', 'ENT', 'General Surgery',
        //     'Plastic Surgery', 'Other'
        // ]
    },
    duration: {
        type: Number, // in minutes
        required: [true, 'Duration is required'],
        min: [1, 'Duration must be at least 1 minute']
    },
    complexity: {
        type: String,
        // enum: ['Low', 'Medium', 'High', 'Very High'],
        default: 'Medium'
    },
    recoveryTime: {
        type: String, // e.g., "1-2 weeks", "3-6 months"
        default: 'Varies'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for better query performance
procedureCostSchema.index({ category: 1, isActive: 1 });
procedureCostSchema.index({ title: 1 });

module.exports = mongoose.model('ProcedureCost', procedureCostSchema);