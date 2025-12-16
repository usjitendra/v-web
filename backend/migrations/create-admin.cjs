// migrations/create-admin.cjs
const mongoose = require('mongoose');
const Admin = require('../models/Admin.cjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });

const createAdmin = async () => {
    await mongoose.connect(process.env.ATLAS_URI, {
        dbName: 'healthcare',
        serverSelectionTimeoutMS: 5000
    });

    const adminData = {
        username: 'admin',
        email: 'admin@healthcare.com',
        password: 'admin123', // Change this in production!
        role: 'superadmin',
        permissions: {
            manageHospitals: true,
            manageDoctors: true,
            manageTreatments: true,
            manageUsers: true,
            manageContent: true
        }
    };

    await Admin.deleteMany({});
    await Admin.create(adminData);
    console.log('Admin user created successfully');
    process.exit(0);
};

createAdmin();