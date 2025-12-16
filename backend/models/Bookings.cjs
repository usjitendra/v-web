// models/Bookings.cjs
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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

    // Reference Fields
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'Hospital is required']
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: function () { return this.type === 'appointment'; }
    },

    // Appointment Details (required only for appointments)
    date: {
        type: Date,
        required: function () { return this.type === 'appointment'; }
    },
    time: {
        type: String,
        required: function () { return this.type === 'appointment'; }
    },

    // Message/Query
    message: {
        type: String,
        trim: true,
        default: '',
        required: function () { return this.type === 'query'; }
    },

    // Booking Type
    type: {
        type: String,
        enum: ['appointment', 'query'],
        default: 'appointment',
        required: true
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
        confirmed: {
            type: Boolean,
            default: false
        },
        // Main status for filtering
        mainStatus: {
            type: String,
            enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'query-received', 'query-responded'],
            default: function () {
                return this.type === 'appointment' ? 'scheduled' : 'query-received';
            }
        }
    },

    // Response details (for queries)
    response: {
        message: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        respondedAt: Date
    },

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
bookingSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for formatted date
bookingSchema.virtual('formattedDate').get(function () {
    return this.date ? this.date.toLocaleDateString() : 'N/A';
});

// Virtual to check if it's a query
bookingSchema.virtual('isQuery').get(function () {
    return this.type === 'query';
});

// Virtual to check if it's an appointment
bookingSchema.virtual('isAppointment').get(function () {
    return this.type === 'appointment';
});

// Set virtuals to be included in JSON output
bookingSchema.set('toJSON', { virtuals: true });

// Indexes for better query performance
bookingSchema.index({ type: 1, createdAt: -1 });
bookingSchema.index({ patientId: 1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ phone: 1 });
bookingSchema.index({ 'status.mainStatus': 1 });

module.exports = mongoose.model('Booking', bookingSchema);