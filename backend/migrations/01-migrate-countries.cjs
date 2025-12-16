const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });
const Country = require('../models/Country.cjs');

const countriesData = [
    { name: 'India', code: 'IN', currency: 'INR', timezone: 'Asia/Kolkata' },
    { name: 'United States', code: 'US', currency: 'USD', timezone: 'America/New_York' },
    { name: 'United Arab Emirates', code: 'AE', currency: 'AED', timezone: 'Asia/Dubai' },
    { name: 'United Kingdom', code: 'UK', currency: 'GBP', timezone: 'Europe/London' },
    { name: 'Australia', code: 'AU', currency: 'AUD', timezone: 'Australia/Sydney' },
    { name: 'Canada', code: 'CA', currency: 'CAD', timezone: 'America/Toronto' },
    { name: 'Germany', code: 'DE', currency: 'EUR', timezone: 'Europe/Berlin' },
    { name: 'Thailand', code: 'TH', currency: 'THB', timezone: 'Asia/Bangkok' },
    { name: 'Singapore', code: 'SG', currency: 'SGD', timezone: 'Asia/Singapore' },
    { name: 'Turkey', code: 'TR', currency: 'TRY', timezone: 'Europe/Istanbul' }
];

async function migrate() {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            dbName: 'healthcare',
            serverSelectionTimeoutMS: 5000
        });

        console.log('🚀 Starting countries migration...');

        // Clear existing data
        const deleteResult = await Country.deleteMany();
        console.log(`🗑️  Cleared ${deleteResult.deletedCount} countries`);

        // Insert new data
        const result = await Country.insertMany(countriesData);
        console.log(`✅ Inserted ${result.length} countries`);

        // Log country IDs for reference
        const countries = await Country.find();
        console.log('📋 Country IDs:');
        countries.forEach(country => {
            console.log(`   ${country.code}: ${country._id}`);
        });

    } catch (err) {
        console.error('❌ Countries migration failed:', err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run if called directly
if (require.main === module) {
    migrate();
}

module.exports = { migrate };