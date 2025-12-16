const express = require('express');
const { getAssistance } = require('../controllers/assistanceController.cjs');

const router = express.Router();

router.get('/', getAssistance);

module.exports = router;