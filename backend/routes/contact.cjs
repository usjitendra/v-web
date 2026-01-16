// routes/contact.cjs
const express = require('express');
const router = express.Router();
const {
    createContact,
    getContacts,
    getContactById,
    updateContactStatus,
    replyToContact,
    deleteContact,
    getContactStats
} = require('../controllers/contactController.cjs');

// Public routes
router.post('/', createContact);

// Protected routes (for admin)
router.get('/', getContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContactById);
router.put('/:id/status', updateContactStatus);
router.put('/:id/reply', replyToContact);
router.delete('/:id', deleteContact);

module.exports = router;
