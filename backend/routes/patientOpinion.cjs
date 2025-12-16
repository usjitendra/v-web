const express = require('express');
const { getPatientOpinions } = require('../controllers/patientOpinionController.cjs');

const router = express.Router();

router.get('/', getPatientOpinions);

module.exports = router;