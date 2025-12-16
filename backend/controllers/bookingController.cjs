// controllers/bookingController.cjs
const Booking = require('../models/Bookings.cjs');

// Create booking
exports.createBooking = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            doctor,
            hospital,
            date,
            time,
            message,
            type = 'appointment',
            patientId
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !doctor || !hospital) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // For appointments, validate date and time
        if (type === 'appointment' && (!date || !time)) {
            return res.status(400).json({
                success: false,
                message: 'Date and time are required for appointments'
            });
        }

        // For queries, validate message
        if (type === 'query' && !message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required for queries'
            });
        }

        // For appointments, validate patientId (login required)
        if (type === 'appointment' && !patientId) {
            return res.status(400).json({
                success: false,
                message: 'Patient ID is required for appointments. Please login first.'
            });
        }

        // Create booking
        const booking = new Booking({
            name,
            email,
            phone,
            doctor,
            hospital,
            date: type === 'appointment' ? new Date(date) : null,
            time: type === 'appointment' ? time : null,
            message: message || '',
            type,
            patientId: patientId || null,
            status: {
                read: false,
                replied: false,
                confirmed: false,
                mainStatus: type === 'appointment' ? 'scheduled' : 'query-received'
            }
        });

        const savedBooking = await booking.save();

        // Populate the saved booking
        const populatedBooking = await Booking.findById(savedBooking._id)
            .populate('doctor', 'firstName lastName specialty')
            .populate('hospital', 'name city')
            .populate('patientId', 'firstName lastName email phone');

        res.status(201).json({
            success: true,
            message: type === 'appointment' ? 'Appointment booked successfully' : 'Query submitted successfully',
            data: populatedBooking
        });
    } catch (error) {
        console.error('Booking creation error:', error);

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
            message: 'Error creating booking',
            error: error.message
        });
    }
};

// Get all bookings with enhanced filtering
exports.getBookings = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 1000,
            sort = '-createdAt',
            read,
            replied,
            confirmed,
            type,
            status,
            search
        } = req.query;

        let query = {};

        // Filter by read status
        if (read !== undefined) {
            query['status.read'] = read === 'true';
        }

        // Filter by replied status
        if (replied !== undefined) {
            query['status.replied'] = replied === 'true';
        }

        // Filter by confirmed status
        if (confirmed !== undefined) {
            query['status.confirmed'] = confirmed === 'true';
        }

        // Filter by type
        if (type) {
            query.type = type;
        }

        // Filter by main status
        if (status) {
            query['status.mainStatus'] = status;
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { phone: new RegExp(search, 'i') },
                { message: new RegExp(search, 'i') }
            ];
        }

        const bookings = await Booking.find(query)
            .populate('doctor', 'firstName lastName specialty')
            .populate('hospital', 'name city')
            .populate('patientId', 'firstName lastName email phone')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Booking.countDocuments(query);

        res.json({
            success: true,
            data: bookings,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('doctor', 'firstName lastName specialty')
            .populate('hospital', 'name city address')
            .populate('patientId', 'firstName lastName email phone dateOfBirth gender');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Get booking by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
};

// Update booking status
// Update booking status
exports.updateBookingStatus = async (req, res) => {
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
        if (status.confirmed !== undefined) updateData['status.confirmed'] = status.confirmed;
        if (status.mainStatus !== undefined) updateData['status.mainStatus'] = status.mainStatus;

        // If no valid updates, return error
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid status fields provided for update'
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { $set: updateData }, // Use $set operator for nested fields
            { new: true, runValidators: true }
        )
            .populate('doctor', 'firstName lastName specialty')
            .populate('hospital', 'name city')
            .populate('patientId', 'firstName lastName email phone');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            data: booking
        });
    } catch (error) {
        console.error('Update booking status error:', error);

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
            message: 'Error updating booking status',
            error: error.message
        });
    }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        res.json({
            success: true,
            message: 'Booking deleted successfully'
        });
    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting booking',
            error: error.message
        });
    }
};

// Get booking statistics
exports.getBookingStats = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const unreadBookings = await Booking.countDocuments({ 'status.read': false });
        const repliedBookings = await Booking.countDocuments({ 'status.replied': true });
        const confirmedBookings = await Booking.countDocuments({ 'status.confirmed': true });

        // Type-specific statistics
        const appointmentStats = await Booking.countDocuments({ type: 'appointment' });
        const queryStats = await Booking.countDocuments({ type: 'query' });

        // Status-specific statistics
        const scheduledStats = await Booking.countDocuments({ 'status.mainStatus': 'scheduled' });
        const confirmedStats = await Booking.countDocuments({ 'status.mainStatus': 'confirmed' });
        const completedStats = await Booking.countDocuments({ 'status.mainStatus': 'completed' });
        const cancelledStats = await Booking.countDocuments({ 'status.mainStatus': 'cancelled' });
        const queryReceivedStats = await Booking.countDocuments({ 'status.mainStatus': 'query-received' });
        const queryRespondedStats = await Booking.countDocuments({ 'status.mainStatus': 'query-responded' });

        res.json({
            success: true,
            data: {
                total: totalBookings,
                unread: unreadBookings,
                replied: repliedBookings,
                confirmed: confirmedBookings,
                byType: {
                    appointments: appointmentStats,
                    queries: queryStats
                },
                byStatus: {
                    scheduled: scheduledStats,
                    confirmed: confirmedStats,
                    completed: completedStats,
                    cancelled: cancelledStats,
                    queryReceived: queryReceivedStats,
                    queryResponded: queryRespondedStats
                }
            }
        });
    } catch (error) {
        console.error('Get booking stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching booking statistics',
            error: error.message
        });
    }
};