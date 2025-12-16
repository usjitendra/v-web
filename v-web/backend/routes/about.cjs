// routes/about.js
const express = require('express');
const router = express.Router();
const {
    getAbout,
    updateAbout,
    createAbout
} = require('../controllers/aboutController.cjs');

// Public routes
router.get('/', getAbout);

// Protected admin routes
router.put('/', updateAbout);
router.post('/', createAbout);

module.exports = router;