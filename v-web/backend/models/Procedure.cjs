const mongoose = require('mongoose');

const procedureSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: mongoose.Schema.Types.ObjectId, ref: 'Specialty', required: true },
    description: { type: String },
    duration: { type: Number },
    recoveryTime: { type: String },
    baseCost: { type: Number },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

procedureSchema.index({ specialty: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Procedure', procedureSchema);