const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });
const AboutUs = require('../models/About.cjs');

const migrateAboutUs = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.ATLAS_URI, {
            dbName: 'healthcare',
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 30000
        });
        console.log('✅ MongoDB connected for AboutUs migration');

        // Check if aboutus collection exists
        const collectionExists = await mongoose.connection.db.listCollections({ name: 'aboutus' }).hasNext();

        
            await AboutUs.deleteMany({});
            console.log('Cleared existing AboutUs data');
       

        // Sample AboutUs data based on provided API response
        const sampleAboutUs = [
            {
                title: 'About Us',
                subtitle: "We're committed to making healthcare accessible, transparent, and easy to navigate",
                missionTitle: 'Our Mission',
                missionDescription: 'This platform was created as a learning project to replicate the experience of a modern healthcare directory and booking service.',
                image: '/aboutpage.jpg',
                language:'EN',
                highlights: [
                    {
                        icon: 'HeartPulse',
                        text: 'Simplifying healthcare decisions with clarity'
                    },
                    {
                        icon: 'Stethoscope',
                        text: 'Intuitive tools for better patient experience'
                    },
                    {
                        icon: 'Users',
                        text: 'Building trust through transparency'
                    }
                ],
                email: 'xydz@gmail.com',
                whatsappNumber: '1234567890',
                whatsappMessage: 'Hello! I have a question about your healthcare services.',
                isActive: true,
                createdAt: new Date('2025-09-13T10:21:58.519Z'),
                updatedAt: new Date('2025-09-13T10:21:58.522Z')
            },
            {
                title: 'About Us',
                subtitle: "We're committed to making healthcare accessible, transparent, and easy to navigate",
                missionTitle: 'Our Mission',
                missionDescription: 'This platform was created as a learning project to replicate the experience of a modern healthcare directory and booking service.',
                language:'EN',
                image: '/aboutpage.jpg',
                highlights: [
                    {
                        icon: 'HeartPulse',
                        text: 'Simplifying healthcare decisions with clarity'
                    },
                    {
                        icon: 'Stethoscope',
                        text: 'Intuitive tools for better patient experience'
                    },
                    {
                        icon: 'Users',
                        text: 'Building trust through transparency'
                    }
                ],
                email: 'xyz@gmail.com',
                whatsappNumber: '1234567890',
                whatsappMessage: 'Hello! I have a question about your healthcare services.',
                isActive: true,
                createdAt: new Date('2025-09-13T10:21:58.519Z'),
                updatedAt: new Date('2025-09-13T10:21:58.522Z')
            }
        ];

        // Insert sample AboutUs data
        await AboutUs.insertMany(sampleAboutUs);
        console.log('Sample AboutUs data inserted successfully');

        console.log('Migration completed successfully');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    } finally {
        // Ensure MongoDB connection is closed
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
};

migrateAboutUs();