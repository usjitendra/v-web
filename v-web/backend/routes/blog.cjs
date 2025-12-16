// routes/blogRoutes.js - Add admin routes
const express = require('express');
const router = express.Router();
const {
    // Public routes
    getBlogs,
    getBlogBySlug,
    getBlogCategories,
    getBlogTags,
    addComment,
    toggleLike,
    getFeaturedBlogs,
    getRecentBlogs,
    // Admin routes
    getAdminBlogs,
    getBlogStats,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    approveBlogComment,
    deleteBlogComment
} = require('../controllers/blogController.cjs');

const { protectAdmin, restrictTo } = require('../middleware/authAdmin.cjs');

// Public routes
router.get('/public', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/recent', getRecentBlogs);
router.get('/categories', getBlogCategories);
router.get('/tags', getBlogTags);
router.get('/public/:slug', getBlogBySlug);
router.post('/:slug/comments', addComment);
router.post('/:slug/like', toggleLike);

// Admin routes
router.get('/', protectAdmin, getAdminBlogs);
router.get('/stats', protectAdmin, getBlogStats);
router.get('/:id', protectAdmin, getBlogById);
router.post('/', protectAdmin, restrictTo('admin', 'superadmin'), createBlog);
router.put('/:id', protectAdmin, restrictTo('admin', 'superadmin'), updateBlog);
router.delete('/:id', protectAdmin, restrictTo('superadmin'), deleteBlog);
router.patch('/:blogId/comments/:commentId/approve', protectAdmin, restrictTo('admin', 'superadmin'), approveBlogComment);
router.delete('/:blogId/comments/:commentId', protectAdmin, restrictTo('admin', 'superadmin'), deleteBlogComment);

module.exports = router;