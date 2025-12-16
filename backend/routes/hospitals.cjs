const express = require('express');
const {
  getHospitalStatus,
  getHospitals,
  getHospital,
  createHospital,
  createHospitalDetails,
  updateHospitalDetails,
  getHospitalDetails,
  deleteHospitalDetails,
  searchHospitals
} = require('../controllers/hospitalController.cjs');

const router = express.Router();

// Health check
router.get('/status', getHospitalStatus);

// Hospital routes
router.get('/all', getHospitals);
router.get('/search', searchHospitals);
router.get('/:id', getHospital);
router.post('/', createHospital);

// Hospital details routes
router.get('/:id/details', getHospitalDetails);
router.post('/:id/details', createHospitalDetails);
router.put('/:id/details', updateHospitalDetails);
router.delete('/:id/details', deleteHospitalDetails);

module.exports = router;