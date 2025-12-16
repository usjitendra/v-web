// pages/api/bookings/index.js
import Booking from '../../../models/Booking';
import dbConnect from '../../../utils/dbConnect';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const booking = new Booking(req.body);
            const savedBooking = await booking.save();

            res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                data: savedBooking
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error creating booking',
                error: error.message
            });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}