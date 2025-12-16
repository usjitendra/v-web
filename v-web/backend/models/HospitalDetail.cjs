const mongoose = require('mongoose');

const hospitalDetailSchema = new mongoose.Schema({
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

    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    facilities: [{
        type: String,
        trim: true
    }],
    operationRooms: {
        type: Number,
        min: 0
    },
    outpatientFacilities: {
        type: Number,
        min: 0
    },
    totalArea: {
        type: String
    },
    established: {
        type: Number
    },
    website: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    languages: [{
        type: String,
        trim: true
    }],
    transportation: {
        airport: {
            distance: String,
            time: String
        },
        railway: {
            distance: String,
            time: String
        }
    },
    infrastructure: {
        parking: { type: Boolean, default: false },
        atm: { type: Boolean, default: false },
        prayerRoom: { type: Boolean, default: false },
        hairSalon: { type: Boolean, default: false },
        businessCenter: { type: Boolean, default: false },
        spa: { type: Boolean, default: false },
        fitnessCenter: { type: Boolean, default: false },
        cafes: { type: Number, default: 0 },
        restaurants: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HospitalDetail', hospitalDetailSchema);