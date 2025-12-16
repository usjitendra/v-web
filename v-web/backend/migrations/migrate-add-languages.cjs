const mongoose = require('mongoose');
const Language = require('../models/Language.cjs');
// require('dotenv').config();
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });


const languages = [
    { fullName: 'English', shortCode: 'en', isActive: true, isDefault: true },
    { fullName: 'Hindi', shortCode: 'hi', isActive: true },
    { fullName: 'French', shortCode: 'fr', isActive: true },
    { fullName: 'Spanish', shortCode: 'es', isActive: true },
    { fullName: 'German', shortCode: 'de', isActive: true },
    { fullName: 'Chinese', shortCode: 'zh', isActive: true },
    { fullName: 'Arabic', shortCode: 'ar', isActive: true },
    { fullName: 'Portuguese', shortCode: 'pt', isActive: true },
    { fullName: 'Russian', shortCode: 'ru', isActive: true },
    { fullName: 'Japanese', shortCode: 'ja', isActive: true }
];

async function migrateLanguages() {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            dbName: 'healthcare',
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 30000
        });
        console.log('✅ MongoDB connected for AboutUs migration');
        // Clear existing languages
        await Language.deleteMany({});
        console.log('Cleared existing languages');

        // Insert new languages
        await Language.insertMany(languages);
        console.log('Languages migrated successfully');

        // Verify the migration
        const count = await Language.countDocuments();
        console.log(`Total languages in database: ${count}`);

        mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        mongoose.connection.close();
        process.exit(1);
    }
}

migrateLanguages();