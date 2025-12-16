const express = require('express');
const { getFAQs } = require('../controllers/faqController.cjs');

const router = express.Router();

router.get('/', getFAQs);

module.exports = router;