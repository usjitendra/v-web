// models/Contact.cjs
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },

    // Contact Type
    type: {
        type: String,
        enum: ['contact', 'quote', 'inquiry', 'callback'],
        default: 'contact',
        required: true
    },

    // Subject (optional for quotes)
    subject: {
        type: String,
        trim: true
    },

    // Message/Content
    message: {
        type: String,
        required: true,
        trim: true
    },

    // Additional fields for quotes
    serviceType: {
        type: String,
        enum: ['hospital-treatment', 'doctor-consultation', 'medical-tourism', 'general-inquiry'],
        required: function() { return this.type === 'quote'; }
    },

    // Preferred contact method
    preferredContact: {
        type: String,
        enum: ['email', 'phone', 'whatsapp'],
        default: 'email'
    },

    // Status
    status: {
        read: {
            type: Boolean,
            default: false
        },
        replied: {
            type: Boolean,
            default: false
        },
        mainStatus: {
            type: String,
            enum: ['new', 'read', 'replied', 'closed'],
            default: 'new'
        }
    },

    // Response details (for admin replies)
    response: {
        message: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        respondedAt: Date
    },

    // Metadata
    ipAddress: String,
    userAgent: String,

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
contactSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for formatted date
contactSchema.virtual('formattedDate').get(function () {
    return this.createdAt.toLocaleDateString();
});

// Set virtuals to be included in JSON output
contactSchema.set('toJSON', { virtuals: true });

// Indexes for better query performance
contactSchema.index({ type: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ phone: 1 });
contactSchema.index({ 'status.mainStatus': 1 });
contactSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);
