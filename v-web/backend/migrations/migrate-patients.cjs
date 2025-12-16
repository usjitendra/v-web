// src/backend/migrations/migrate-patients.cjs
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Patient = require('../models/Patient.cjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });
(async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            dbName: 'healthcare',
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ MongoDB connected');

        await Patient.deleteMany({});
        console.log('🧹 Old patient records cleared');

        const plainPassword = 'TempPass123!';
        const hashed = await bcrypt.hash(plainPassword, 10);

        const samplePatients = [
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: hashed,
                gender: 'male',
                dateOfBirth: new Date('1990-05-10'),
                phone: '+1234567890',
                address: { street: '123 Example Street', city: 'Delhi' },
                medicalHistory: [
                    { condition: 'Asthma', diagnosedDate: new Date('2018-06-01'), notes: 'Uses inhaler as needed' },
                    { condition: 'Diabetes', diagnosedDate: new Date('2020-02-15'), notes: 'On metformin' }
                ],
                emergencyContact: {
                    name: 'Jane Doe',
                    relationship: 'Spouse',
                    phone: '+1987654321'
                }
            },
            {
                firstName: 'Aditi',
                lastName: 'Sharma',
                email: 'aditi@example.com',
                password: hashed,
                gender: 'female',
                dateOfBirth: new Date('1995-11-23'),
                phone: '+919876543210',
                address: { street: '45 MG Road', city: 'Bangalore' },
                medicalHistory: [
                    { condition: 'Hypertension', diagnosedDate: new Date('2021-08-10'), notes: 'Monitoring with medication' }
                ],
                emergencyContact: {
                    name: 'Rohit Sharma',
                    relationship: 'Brother',
                    phone: '+919812345678'
                }
            }
        ];

        await Patient.insertMany(samplePatients);
        console.log(`🎉 Inserted ${samplePatients.length} sample patients`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
})();
