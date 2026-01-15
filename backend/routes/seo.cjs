// routes/seo.cjs
const express = require('express');
const router = express.Router();

const seoController = require('../controllers/seoController.cjs');
const { protectAdmin, restrictTo } = require('../middleware/authAdmin.cjs');

// Public routes (for frontend use)
router.get('/page/:pageType/:pageIdentifier', seoController.getSEOByPage);
router.get('/page/:pageType', seoController.getSEOByPage);
router.get('/slug/:slug', seoController.getSEOBySlug);

// Admin routes (protected)
// router.use(protectAdmin);
// router.use(restrictTo('admin', 'seo-manager'));

// SEO CRUD operations
router.get('/', seoController.getSEOEntries);
router.get('/stats', seoController.getSEOStats);
router.get('/:id', seoController.getSEOById);
router.post('/', seoController.createSEO);
router.put('/:id', seoController.updateSEO);
router.delete('/:id', seoController.deleteSEO);

// Bulk operations
router.post('/bulk-update', seoController.bulkUpdateSEO);

// Generate default SEO entries
router.post('/generate-defaults', seoController.generateDefaultSEO);

module.exports = router;
