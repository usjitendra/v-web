const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageController.cjs');
// const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/', languageController.getAllLanguages);

// // Admin routes
// router.get('/admin', authenticate, authorize('admin'), languageController.adminGetAllLanguages);
// router.get('/admin/:id', authenticate, authorize('admin'), languageController.getLanguage);
// router.post('/admin', authenticate, authorize('admin'), languageController.createLanguage);
// router.put('/admin/:id', authenticate, authorize('admin'), languageController.updateLanguage);
// router.delete('/admin/:id', authenticate, authorize('admin'), languageController.deleteLanguage);
// router.patch('/admin/:id/set-default', authenticate, authorize('admin'), languageController.setDefaultLanguage);

module.exports = router;