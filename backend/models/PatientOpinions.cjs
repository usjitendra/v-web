const mongoose = require('mongoose');

const patientOpinionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  treatment: {
    type: String,
    required: [true, 'Treatment is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    // validate: {
    //   validator: function(v) {
    //     return /^https?:\/\/.+\..+/.test(v);
    //   },
    //   message: 'Invalid image URL format'
    // }
  },
  text: {
    type: String,
    required: [true, 'Testimonial text is required'],
    maxlength: [1000, 'Testimonial cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('PatientOpinion', patientOpinionSchema);