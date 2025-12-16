const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    shortCode: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        uppercase: true,
        minlength: 2,
        maxlength: 5
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Ensure only one default language exists
languageSchema.pre('save', async function (next) {
    if (this.isDefault) {
        try {
            await mongoose.model('Language').updateMany(
                { _id: { $ne: this._id } },
                { $set: { isDefault: false } }
            );
        } catch (error) {
            return next(error);
        }
    }
    next();
});

module.exports = mongoose.model('Language', languageSchema);