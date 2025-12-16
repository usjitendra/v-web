const express = require('express');
const {
    createHospitalTreatment,
    getHospitalTreatments,
    getHospitalsByTreatment,
    getTreatmentsByHospital
} = require('../controllers/hospitalTreatmentController.cjs');

const router = express.Router();

router.get('/', getHospitalTreatments);
router.get('/by-treatment/:treatmentId', getHospitalsByTreatment);
router.get('/by-hospital/:hospitalId', getTreatmentsByHospital);
router.post('/', createHospitalTreatment);

module.exports = router;