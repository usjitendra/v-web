// routes/upload.js
const express = require('express');
const router = express.Router();
const { uploadImage, handleUpload, deleteImage } = require('../controllers/uploadController.cjs');
const { protectAdmin } = require('../middleware/authAdmin.cjs');

// Upload image to specific folder
router.post('/:folder', protectAdmin, uploadImage, handleUpload);

// Upload image to general folder
router.post('/', protectAdmin, uploadImage, handleUpload);

// Delete image
router.delete('/:folder/:filename', protectAdmin, deleteImage);

module.exports = router;