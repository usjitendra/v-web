const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });
const City = require('../models/City.cjs');
const Country = require('../models/Country.cjs');

const citiesData = [
    // India
    { name: 'Delhi', countryCode: 'IN', timezone: 'Asia/Kolkata' },
    { name: 'Mumbai', countryCode: 'IN', timezone: 'Asia/Kolkata' },
    { name: 'Bangalore', countryCode: 'IN', timezone: 'Asia/Kolkata' },
    { name: 'Chennai', countryCode: 'IN', timezone: 'Asia/Kolkata' },
    { name: 'Hyderabad', countryCode: 'IN', timezone: 'Asia/Kolkata' },
    { name: 'Kolkata', countryCode: 'IN', timezone: 'Asia/Kolkata' },
    { name: 'Gurgaon', countryCode: 'IN', timezone: 'Asia/Kolkata' },
    { name: 'Pune', countryCode: 'IN', timezone: 'Asia/Kolkata' },

    // USA
    { name: 'New York', countryCode: 'US', timezone: 'America/New_York' },
    { name: 'Los Angeles', countryCode: 'US', timezone: 'America/Los_Angeles' },
    { name: 'Chicago', countryCode: 'US', timezone: 'America/Chicago' },
    { name: 'Houston', countryCode: 'US', timezone: 'America/Chicago' },

    // UAE
    { name: 'Dubai', countryCode: 'AE', timezone: 'Asia/Dubai' },
    { name: 'Abu Dhabi', countryCode: 'AE', timezone: 'Asia/Dubai' },

    // UK
    { name: 'London', countryCode: 'UK', timezone: 'Europe/London' },
    { name: 'Manchester', countryCode: 'UK', timezone: 'Europe/London' },

    // Others
    { name: 'Sydney', countryCode: 'AU', timezone: 'Australia/Sydney' },
    { name: 'Toronto', countryCode: 'CA', timezone: 'America/Toronto' },
    { name: 'Berlin', countryCode: 'DE', timezone: 'Europe/Berlin' },
    { name: 'Bangkok', countryCode: 'TH', timezone: 'Asia/Bangkok' },
    { name: 'Singapore', countryCode: 'SG', timezone: 'Asia/Singapore' },
    { name: 'Istanbul', countryCode: 'TR', timezone: 'Europe/Istanbul' }
];

async function migrate() {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            dbName: 'healthcare',
            serverSelectionTimeoutMS: 5000
        });

        console.log('🚀 Starting cities migration...');

        // Get country IDs
        const countries = await Country.find();
        const countryMap = {};
        countries.forEach(c => { countryMap[c.code] = c._id; });

        // Prepare city data with country references
        const citiesToInsert = citiesData.map(city => ({
            name: city.name,
            country: countryMap[city.countryCode],
            timezone: city.timezone
        }));

        // Clear existing data
        const deleteResult = await City.deleteMany();
        console.log(`🗑️  Cleared ${deleteResult.deletedCount} cities`);

        // Insert new data
        const result = await City.insertMany(citiesToInsert);
        console.log(`✅ Inserted ${result.length} cities`);

        console.log('📋 Sample cities inserted:');
        result.slice(0, 5).forEach(city => {
            console.log(`   ${city.name} (ID: ${city._id})`);
        });

    } catch (err) {
        console.error('❌ Cities migration failed:', err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB connection closed');
    }
}

if (require.main === module) {
    migrate();
}

module.exports = { migrate };