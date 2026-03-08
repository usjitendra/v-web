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

        // For appointments, patientId is optional (no login required)
        // if (type === 'appointment' && !patientId) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Patient ID is required for appointments. Please login first.'
        //     });
        // }

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

// Get bookings by patient ID (for patient dashboard)
exports.getBookingsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const {
            page = 1,
            limit = 10,
            type,
            status,
            sort = '-createdAt'
        } = req.query;

        let query = { patientId };

        // Filter by type if specified
        if (type) {
            query.type = type;
        }

        // Filter by status if specified
        if (status) {
            query['status.mainStatus'] = status;
        }

        const bookings = await Booking.find(query)
            .populate('doctor', 'firstName lastName specialty image')
            .populate('hospital', 'name city country address')
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
        console.error('Get bookings by patient error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patient bookings',
            error: error.message
        });
    }
};

// Get bookings by doctor ID (for doctor schedule/dashboard)
exports.getBookingsByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const {
            page = 1,
            limit = 20,
            date,
            status,
            type = 'appointment',
            sort = 'date'
        } = req.query;

        let query = { doctor: doctorId, type };

        // Filter by date if specified (for specific day)
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.date = { $gte: startDate, $lte: endDate };
        }

        // Filter by status if specified
        if (status) {
            query['status.mainStatus'] = status;
        }

        const bookings = await Booking.find(query)
            .populate('patientId', 'firstName lastName email phone dateOfBirth')
            .populate('hospital', 'name city')
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
        console.error('Get bookings by doctor error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctor bookings',
            error: error.message
        });
    }
};

// Get bookings by hospital ID
exports.getBookingsByHospital = async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const {
            page = 1,
            limit = 20,
            type,
            status,
            doctor,
            date,
            sort = '-createdAt'
        } = req.query;

        let query = { hospital: hospitalId };

        // Filter by type if specified
        if (type) {
            query.type = type;
        }

        // Filter by status if specified
        if (status) {
            query['status.mainStatus'] = status;
        }

        // Filter by doctor if specified
        if (doctor) {
            query.doctor = doctor;
        }

        // Filter by date if specified
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.date = { $gte: startDate, $lte: endDate };
        }

        const bookings = await Booking.find(query)
            .populate('doctor', 'firstName lastName specialty')
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
        console.error('Get bookings by hospital error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching hospital bookings',
            error: error.message
        });
    }
};

// Update full booking details (not just status)
exports.updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated directly
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.status; // Use separate endpoint for status updates

        // Validate date/time for appointments
        if (updateData.type === 'appointment' && updateData.date) {
            updateData.date = new Date(updateData.date);
        }

        const booking = await Booking.findByIdAndUpdate(
            id,
            { $set: updateData },
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
            message: 'Booking updated successfully',
            data: booking
        });
    } catch (error) {
        console.error('Update booking error:', error);

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
            message: 'Error updating booking',
            error: error.message
        });
    }
};

// Cancel booking with proper status handling
exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const booking = await Booking.findByIdAndUpdate(
            id,
            {
                $set: {
                    'status.mainStatus': 'cancelled',
                    'status.confirmed': false,
                    cancelledAt: new Date(),
                    cancelReason: reason || 'Cancelled by user'
                }
            },
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
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message
        });
    }
};

// Reschedule booking (update date/time)
exports.rescheduleBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, reason } = req.body;

        if (!date || !time) {
            return res.status(400).json({
                success: false,
                message: 'Date and time are required for rescheduling'
            });
        }

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.type !== 'appointment') {
            return res.status(400).json({
                success: false,
                message: 'Only appointments can be rescheduled'
            });
        }

        // Update date and time
        booking.date = new Date(date);
        booking.time = time;
        booking.rescheduledAt = new Date();
        booking.rescheduleReason = reason || 'Rescheduled by user';

        // Reset confirmation status if rescheduled
        booking.status.confirmed = false;
        booking.status.mainStatus = 'scheduled';

        await booking.save();

        const updatedBooking = await Booking.findById(id)
            .populate('doctor', 'firstName lastName specialty')
            .populate('hospital', 'name city')
            .populate('patientId', 'firstName lastName email phone');

        res.json({
            success: true,
            message: 'Booking rescheduled successfully',
            data: updatedBooking
        });
    } catch (error) {
        console.error('Reschedule booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Error rescheduling booking',
            error: error.message
        });
    }
};

// Check doctor availability for specific date/time
exports.checkDoctorAvailability = async (req, res) => {
    try {
        const { doctorId, date } = req.params;
        const { time } = req.query;

        if (!doctorId || !date) {
            return res.status(400).json({
                success: false,
                message: 'Doctor ID and date are required'
            });
        }

        const queryDate = new Date(date);
        const startOfDay = new Date(queryDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(queryDate);
        endOfDay.setHours(23, 59, 59, 999);

        let query = {
            doctor: doctorId,
            type: 'appointment',
            date: { $gte: startOfDay, $lte: endOfDay }
        };

        // If specific time is provided, check for conflicts
        if (time) {
            query.time = time;
        }

        const existingBookings = await Booking.find(query)
            .select('time status.mainStatus')
            .sort('time');

        // Get doctor's working hours (you might want to store this in doctor profile)
        // For now, assume standard working hours: 9 AM - 6 PM
        const workingHours = {
            start: '09:00',
            end: '18:00'
        };

        res.json({
            success: true,
            data: {
                date: date,
                availableSlots: [], // You can implement slot generation logic here
                bookedSlots: existingBookings.map(booking => ({
                    time: booking.time,
                    status: booking.status.mainStatus
                })),
                workingHours
            }
        });
    } catch (error) {
        console.error('Check availability error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking doctor availability',
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