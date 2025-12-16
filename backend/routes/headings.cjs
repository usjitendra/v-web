const express = require('express');
const router = express.Router();
const Heading = require('../models/Headings.cjs');

// Get headings by section and language
router.get('/:section/:language', async (req, res) => {
    try {
        const { section, language } = req.params;

        const heading = await Heading.findOne({
            section,
            language: language.toUpperCase()
        });

        if (!heading) {
            return res.status(404).json({
                success: false,
                error: 'Heading not found for the specified section and language'
            });
        }

        res.json({
            success: true,
            data: heading
        });
    } catch (err) {
        console.error('Get public heading error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;