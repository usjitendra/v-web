const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    timezone: { type: String },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

citySchema.index({ country: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('City', citySchema);