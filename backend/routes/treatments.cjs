// routes/treatments.cjs
const express = require('express');
const router = express.Router();

// Import the controller functions
const {
    // getTreatmentStatus,
    getAllTreatments,
    getTreatment,
    // createTreatment,
    // updateTreatment,
    // deleteTreatment,
    // searchTreatments,
    getTreatmentsWithHospitalOfferings,
    getTreatmentsWithDoctorCapabilities,
    getTreatmentsByHospital,
    getHospitalsWithTreatments,
    getTreatmentsByDoctor,
    getDoctorsWithTreatments,
    advancedFilterTreatments
} = require('../controllers/treatmentController.cjs');


// Add this for all functions to see which one might be undefined

// Define routes
// router.get('/status', getTreatmentStatus);
router.get('/all', getAllTreatments);
router.get('/hospital-offerings', getTreatmentsWithHospitalOfferings);
router.get('/doctor-capabilities', getTreatmentsWithDoctorCapabilities);
router.get('/:id', getTreatment);
// router.get('/search', searchTreatments);
// router.post('/', createTreatment);
// router.put('/:id', updateTreatment);
// router.delete('/:id', deleteTreatment);

// module.exports = router;


// Filtering routes
router.get('/filter-by-hospital/:hospitalId', getTreatmentsByHospital);
router.get('/hospitals-with-treatments', getHospitalsWithTreatments);
router.get('/filter-by-doctor/:doctorId', getTreatmentsByDoctor);
router.get('/doctors-with-treatments', getDoctorsWithTreatments);
router.get('/advanced-filter', advancedFilterTreatments);

// Existing routes
// router.get('/status', getTreatmentStatus);
// router.get('/all', getAllTreatments);
// router.get('/search', searchTreatments);
// router.get('/:id', getTreatment);
// router.post('/', createTreatment);
// router.put('/:id', updateTreatment);
// router.delete('/:id', deleteTreatment);

module.exports = router;