const express = require('express');
const {
    getDoctors,
    getDoctor,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorsByHospital,
    getDoctorsBySpecialty,
    searchDoctors
} = require('../controllers/doctorController.cjs');

const router = express.Router();

router.get('/all', getDoctors);
router.get('/search', searchDoctors);
router.get('/hospital/:hospitalId', getDoctorsByHospital);
router.get('/specialty/:specialty', getDoctorsBySpecialty);
router.get('/:id', getDoctor);
router.post('/', createDoctor);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);

module.exports = router;