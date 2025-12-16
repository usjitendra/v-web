// migrations/createBookingsCollection.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });
const Booking = require('../models/Bookings.cjs');
const Doctor = require('../models/Doctor.cjs');
const Hospital = require('../models/Hospital.cjs');

// const migrateBookings = async () => {
//     try {
//         // Connect to MongoDB
//         await mongoose.connect(process.env.ATLAS_URI, {
//             dbName: 'healthcare',
//             serverSelectionTimeoutMS: 5000,
//             socketTimeoutMS: 30000
//         });
//         console.log('✅ MongoDB connected for hospital migration');

//         console.log('Connected to MongoDB');

//         // Create collection if it doesn't exist
//         const collectionExists = await mongoose.connection.db.listCollections({ name: 'bookings' }).hasNext();

//         if (!collectionExists) {
//             console.log('Creating bookings collection...');
//             await Booking.createCollection();
//             console.log('Bookings collection created successfully');
//         } else {
//             await Booking.deleteMany({});
//             console.log('Cleared existing doctor data');
//         }

//         // Add sample data (optional)
//         const sampleBooking = [
//             {
//                 name: 'John Doe',
//                 email: 'john@example.com',
//                 phone: '+1234567890',
//                 date: new Date('2024-12-15'),
//                 time: '10:00',
//                 message: 'Sample booking for testing',
//                 status: { read: false, replied: false }
//             },
//             {
//                 name: 'Alice Johnson',
//                 email: 'alice.johnson@example.com',
//                 phone: '+14155550123',
//                 date: new Date('2024-12-20'),
//                 time: '11:30',
//                 message: 'Follow-up appointment for annual checkup',
//                 status: { read: true, replied: false }
//             },
//             {
//                 name: 'Raj Patel',
//                 email: 'raj.patel@example.com',
//                 phone: '+919876543210',
//                 date: new Date('2025-01-05'),
//                 time: '14:00',
//                 message: 'Consultation regarding knee pain',
//                 status: { read: false, replied: false }
//             },
//             {
//                 name: 'Maria Gonzalez',
//                 email: 'maria.g@example.com',
//                 phone: '+5215544332211',
//                 date: new Date('2025-01-10'),
//                 time: '09:00',
//                 message: 'Requesting a pediatric specialist for child checkup',
//                 status: { read: true, replied: true }
//             },
//             {
//                 name: 'Liam Smith',
//                 email: 'liam.smith@example.com',
//                 phone: '+447911123456',
//                 date: new Date('2025-01-12'),
//                 time: '16:30',
//                 message: 'Follow-up for lab results discussion',
//                 status: { read: false, replied: false }
//             },
//             {
//                 name: 'Chun Hei Wong',
//                 email: 'chun.wong@example.com',
//                 phone: '+85298765432',
//                 date: new Date('2025-01-18'),
//                 time: '13:15',
//                 message: 'Dermatology appointment for skin allergy',
//                 status: { read: true, replied: false }
//             },
//             {
//                 name: 'Emily Davis',
//                 email: 'emily.davis@example.com',
//                 phone: '+13035550111',
//                 date: new Date('2025-01-20'),
//                 time: '15:45',
//                 message: 'Pre-surgery consultation',
//                 status: { read: false, replied: true }
//             },
//             {
//                 name: 'Mohammed Al-Farsi',
//                 email: 'mohammed.farsi@example.com',
//                 phone: '+971501234567',
//                 date: new Date('2025-01-25'),
//                 time: '10:30',
//                 message: 'Cardiology follow-up visit',
//                 status: { read: true, replied: true }
//             },
//             {
//                 name: 'Sofia Rossi',
//                 email: 'sofia.rossi@example.com',
//                 phone: '+393491234567',
//                 date: new Date('2025-02-01'),
//                 time: '12:00',
//                 message: 'Nutrition consultation appointment',
//                 status: { read: false, replied: false }
//             },
//             {
//                 name: 'David Miller',
//                 email: 'david.miller@example.com',
//                 phone: '+613400123456',
//                 date: new Date('2025-02-05'),
//                 time: '08:45',
//                 message: 'Orthopedic assessment for back pain',
//                 status: { read: true, replied: false }
//             }
//         ];


//         const hospital = await Hospital.find({});
//         const doctor = await Doctor.find({});
//         console.log(hospital[0]);

//         sampleBooking[0].hospital = hospital[0]._id;
//         sampleBooking[0].doctor = doctor[0]._id;

//         // await sampleBooking.save();
//         // console.log('Sample booking created');

//         await Booking.insertMany(sampleBooking);

//         console.log('Migration completed successfully');
//         process.exit(0);

//     } catch (error) {
//         console.error('Migration failed:', error);
//         process.exit(1);
//     }
// };

// migrateBookings();


// // migrations/createBookingsCollection.cjs
// const mongoose = require('mongoose');
// const path = require('path');
// require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });

// const Booking = require('../models/Bookings.cjs');
// const Doctor = require('../models/Doctor.cjs');
// const Hospital = require('../models/Hospital.cjs');
const Patient = require('../models/Patient.cjs'); // <-- make sure you have this model

const migrateBookings = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            dbName: 'healthcare',
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 30000,
        });
        console.log('✅ MongoDB connected for booking migration');

        // Clear existing data if collection exists
        const collectionExists = await mongoose.connection.db
            .listCollections({ name: 'bookings' })
            .hasNext();

        if (!collectionExists) {
            console.log('Creating bookings collection...');
            await Booking.createCollection();
        } else {
            await Booking.deleteMany({});
            console.log('Cleared existing booking data');
        }

        // Fetch a sample hospital, doctor, and patient
        const hospital = await Hospital.findOne();
        const doctor = await Doctor.findOne();
        const patient = await Patient.findOne();  // 👈 Must exist

        if (!patient) {
            throw new Error('No patient found. Create at least one patient first.');
        }

        // Base booking template
        const sampleBooking = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567890',
                date: new Date('2024-12-15'),
                time: '10:00',
                message: 'Sample booking for testing',
                status: { read: false, replied: false }
            },
            {
                name: 'Alice Johnson',
                email: 'alice.johnson@example.com',
                phone: '+14155550123',
                date: new Date('2024-12-20'),
                time: '11:30',
                message: 'Follow-up appointment for annual checkup',
                status: { read: true, replied: false }
            },
            {
                name: 'Raj Patel',
                email: 'raj.patel@example.com',
                phone: '+919876543210',
                date: new Date('2025-01-05'),
                time: '14:00',
                message: 'Consultation regarding knee pain',
                status: { read: false, replied: false }
            },
            {
                name: 'Maria Gonzalez',
                email: 'maria.g@example.com',
                phone: '+5215544332211',
                date: new Date('2025-01-10'),
                time: '09:00',
                message: 'Requesting a pediatric specialist for child checkup',
                status: { read: true, replied: true }
            },
            {
                name: 'Liam Smith',
                email: 'liam.smith@example.com',
                phone: '+447911123456',
                date: new Date('2025-01-12'),
                time: '16:30',
                message: 'Follow-up for lab results discussion',
                status: { read: false, replied: false }
            },
            {
                name: 'Chun Hei Wong',
                email: 'chun.wong@example.com',
                phone: '+85298765432',
                date: new Date('2025-01-18'),
                time: '13:15',
                message: 'Dermatology appointment for skin allergy',
                status: { read: true, replied: false }
            },
            {
                name: 'Emily Davis',
                email: 'emily.davis@example.com',
                phone: '+13035550111',
                date: new Date('2025-01-20'),
                time: '15:45',
                message: 'Pre-surgery consultation',
                status: { read: false, replied: true }
            },
            {
                name: 'Mohammed Al-Farsi',
                email: 'mohammed.farsi@example.com',
                phone: '+971501234567',
                date: new Date('2025-01-25'),
                time: '10:30',
                message: 'Cardiology follow-up visit',
                status: { read: true, replied: true }
            },
            {
                name: 'Sofia Rossi',
                email: 'sofia.rossi@example.com',
                phone: '+393491234567',
                date: new Date('2025-02-01'),
                time: '12:00',
                message: 'Nutrition consultation appointment',
                status: { read: false, replied: false }
            },
            {
                name: 'David Miller',
                email: 'david.miller@example.com',
                phone: '+613400123456',
                date: new Date('2025-02-05'),
                time: '08:45',
                message: 'Orthopedic assessment for back pain',
                status: { read: true, replied: false }
            }
        ];


        // Add required references to each booking
        const sampleBookings = sampleBooking.map(b => ({
            ...b,
            hospital: hospital._id,
            doctor: doctor._id,
            patientId: patient._id, // ✅ required field
        }));

        await Booking.insertMany(sampleBookings);
        console.log(`🎉 Inserted ${sampleBookings.length} sample bookings`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateBookings();
