// models/About.cjs
const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "About Us",
        trim: true
    },
    subtitle: {
        type: String,
        default: "We're committed to making healthcare accessible, transparent, and easy to navigate",
        trim: true
    },
    missionTitle: {
        type: String,
        default: "Our Mission",
        trim: true
    },
    missionDescription: {
        type: String,
        default: "This platform was created as a learning project to replicate the experience of a modern healthcare directory and booking service.",
        trim: true
    },
    language: {
        type: String,

    },
    image: {
        type: String,
        default: "/aboutpage.jpg",
        trim: true
    },
    highlights: [{
        icon: {
            type: String,
            default: "HeartPulse",
            trim: true
        },
        text: {
            type: String,
            default: "Simplifying healthcare decisions with clarity",
            trim: true
        }
    }],
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email'
        }
    },
    whatsappNumber: {
        type: String,
        default: "+1234567890",
        trim: true
    },
    whatsappMessage: {
        type: String,
        default: "Hello! I have a question about your healthcare services.",
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

aboutSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('About', aboutSchema);