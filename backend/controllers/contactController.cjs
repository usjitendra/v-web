// controllers/contactController.cjs
const Contact = require('../models/Contact.cjs');

// Create contact/quote/inquiry
exports.createContact = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            type = 'contact',
            subject,
            message,
            serviceType,
            preferredContact = 'email'
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, email, phone, and message'
            });
        }

        // For quotes, validate serviceType
        if (type === 'quote' && !serviceType) {
            return res.status(400).json({
                success: false,
                message: 'Service type is required for quotes'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Create contact
        const contact = new Contact({
            name,
            email,
            phone,
            type,
            subject,
            message,
            serviceType,
            preferredContact,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            status: {
                read: false,
                replied: false,
                mainStatus: 'new'
            }
        });

        const savedContact = await contact.save();

        res.status(201).json({
            success: true,
            message: type === 'quote' ? 'Quote request submitted successfully' : 'Message sent successfully',
            data: savedContact
        });
    } catch (error) {
        console.error('Contact creation error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(el => el.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: errors.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error processing your request',
            error: error.message
        });
    }
};

// Get all contacts with enhanced filtering
exports.getContacts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 1000,
            sort = '-createdAt',
            type,
            status,
            read,
            replied,
            search
        } = req.query;

        let query = {};

        // Filter by type
        if (type) {
            query.type = type;
        }

        // Filter by main status
        if (status) {
            query['status.mainStatus'] = status;
        }

        // Filter by read status
        if (read !== undefined) {
            query['status.read'] = read === 'true';
        }

        // Filter by replied status
        if (replied !== undefined) {
            query['status.replied'] = replied === 'true';
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { phone: new RegExp(search, 'i') },
                { message: new RegExp(search, 'i') },
                { subject: new RegExp(search, 'i') }
            ];
        }

        const contacts = await Contact.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Contact.countDocuments(query);

        res.json({
            success: true,
            data: contacts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts',
            error: error.message
        });
    }
};

// Get contact by ID
exports.getContactById = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        console.error('Get contact by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact',
            error: error.message
        });
    }
};

// Update contact status
exports.updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body; // Expecting the entire status object

        // Validate that status is an object
        if (!status || typeof status !== 'object') {
            return res.status(400).json({
                success: false,
                message: 'Status object is required'
            });
        }

        // Build the update object dynamically
        const updateData = {};

        // Add each status field to the update object
        if (status.read !== undefined) updateData['status.read'] = status.read;
        if (status.replied !== undefined) updateData['status.replied'] = status.replied;
        if (status.mainStatus !== undefined) updateData['status.mainStatus'] = status.mainStatus;

        // If no valid updates, return error
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid status fields provided for update'
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { $set: updateData }, // Use $set operator for nested fields
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Contact status updated successfully',
            data: contact
        });
    } catch (error) {
        console.error('Update contact status error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(el => el.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                error: errors.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error updating contact status',
            error: error.message
        });
    }
};

// Reply to contact
exports.replyToContact = async (req, res) => {
    try {
        const { message, adminId } = req.body;

        if (!message || !adminId) {
            return res.status(400).json({
                success: false,
                message: 'Message and admin ID are required'
            });
        }

        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    'status.replied': true,
                    'status.mainStatus': 'replied',
                    'response.message': message,
                    'response.respondedBy': adminId,
                    'response.respondedAt': new Date()
                }
            },
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        res.json({
            success: true,
            message: 'Reply sent successfully',
            data: contact
        });
    } catch (error) {
        console.error('Reply to contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending reply',
            error: error.message
        });
    }
};

// Delete contact
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }
        res.json({
            success: true,
            message: 'Contact deleted successfully'
        });
    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting contact',
            error: error.message
        });
    }
};

// Get contact statistics
exports.getContactStats = async (req, res) => {
    try {
        const totalContacts = await Contact.countDocuments();
        const unreadContacts = await Contact.countDocuments({ 'status.read': false });
        const repliedContacts = await Contact.countDocuments({ 'status.replied': true });

        // Type-specific statistics
        const contactStats = await Contact.countDocuments({ type: 'contact' });
        const quoteStats = await Contact.countDocuments({ type: 'quote' });
        const inquiryStats = await Contact.countDocuments({ type: 'inquiry' });
        const callbackStats = await Contact.countDocuments({ type: 'callback' });

        // Status-specific statistics
        const newStats = await Contact.countDocuments({ 'status.mainStatus': 'new' });
        const readStats = await Contact.countDocuments({ 'status.mainStatus': 'read' });
        const repliedStats = await Contact.countDocuments({ 'status.mainStatus': 'replied' });
        const closedStats = await Contact.countDocuments({ 'status.mainStatus': 'closed' });

        res.json({
            success: true,
            data: {
                total: totalContacts,
                unread: unreadContacts,
                replied: repliedContacts,
                byType: {
                    contacts: contactStats,
                    quotes: quoteStats,
                    inquiries: inquiryStats,
                    callbacks: callbackStats
                },
                byStatus: {
                    new: newStats,
                    read: readStats,
                    replied: repliedStats,
                    closed: closedStats
                }
            }
        });
    } catch (error) {
        console.error('Get contact stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact statistics',
            error: error.message
        });
    }
};
