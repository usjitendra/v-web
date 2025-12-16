const mongoose = require('mongoose');

const HeadingSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
     
    },
    language: {
        type: String,
        required: true,
        default: 'EN'
    },
    home: {
        type: [{
            heading: String,
            subheading: String,
            description: String
        }],
        default: []
    },
    page: {
        type: [{
            heading: String,
            subheading: String,
            description: String
        }],
        default: []
    },
    detailPage: {
        navbar: {
            type: [String],
            default: []
        },
        headings: {
            type: [{
                level: {
                    type: String,
                    enum: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
                },
                text: String
            }],
            default: []
        }
    }
}, {
    timestamps: true
});

// Create compound index for section and language
HeadingSchema.index({ section: 1, language: 1 }, { unique: true });

module.exports = mongoose.model('Heading', HeadingSchema);