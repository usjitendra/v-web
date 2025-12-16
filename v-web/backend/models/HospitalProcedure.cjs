const mongoose = require('mongoose');

const hospitalProcedureSchema = new mongoose.Schema({
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    procedure: { type: mongoose.Schema.Types.ObjectId, ref: 'Procedure', required: true },
    cost: { type: Number, required: true },
    currency: { type: String, required: true },
    duration: { type: Number },
    inclusions: [String],
    exclusions: [String],
    isAvailable: { type: Boolean, default: true }
}, {
    timestamps: true
});

hospitalProcedureSchema.index({ hospital: 1, procedure: 1 }, { unique: true });

module.exports = mongoose.model('HospitalProcedure', hospitalProcedureSchema);