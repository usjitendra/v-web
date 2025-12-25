const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AppointmentSchema = new Schema({
  doctorId: {
    type: ObjectId,
    ref: "Doctor",
    required: true
  },
  patientId: {
    type: ObjectId,
    ref: "Patient",
    required: true
  },
  appointmentDate: {
    type: new Date,
    required: true
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  appointmentType: {
    type: String,
    enum: ['online', 'offline'],
    default: "offline"
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled", "no_show"],
    default: "pending"
  },
  reason: {
    type: String,
    trim: true,
    maxlength: 500
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending"
  },
  consultationFee: {
    type: Number,
    default: 0
  },
  cancelledBy: {
    type: String,
    enum: ["doctor", "patient", "system"],
    default: null
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  isRescheduled: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_deleted: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
})

AppointmentSchema.index(
  {
    doctorId: 1,
    appointmentDate: 1,
    "timeSlot.startTime": 1,
    "timeSlot.endTime": 1
  },
  {
    unique: true,
    partialFilterExpression: {
      is_deleted: false,
      status: { $in: ["pending", "confirmed"] },
    }
  }
)

module.exports = mongoose.model("Appointment", AppointmentSchema);