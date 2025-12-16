const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });
const ProcedureCost = require('../models/ProcedureCost.cjs');
const { default: Treatments } = require('../models/Treatments.cjs');

const procedureCostsData = [
  { title: 'Cardiology', price: '500', icon: '❤️' },
  { title: 'Orthopedics', price: '500', icon: '🦴' },
  { title: 'Neurology', price: '500', icon: '🧠' },
  { title: 'Dentistry', price: '500', icon: '🦷' },
  { title: 'Cardiac Surgery', price: '750', icon: '❤️' },
  { title: 'Orthopedic Surgery', price: '600', icon: '🦴' },
  { title: 'Neurological Surgery', price: '800', icon: '🧠' },
  { title: 'Dental Implants', price: '450', icon: '🦷' }
];

async function migrate() {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      dbName: 'healthcare',
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected for procedure costs migration');



    await ProcedureCost.deleteMany();
    console.log('🗑️  Cleared existing procedure costs');

    

    const result = await ProcedureCost.insertMany(procedureCostsData);
    console.log(`📥 Inserted ${result.length} procedure costs`);

    const count = await ProcedureCost.countDocuments();
    console.log(`🔍 Total procedure costs in DB: ${count}`);

  } catch (err) {
    console.error('❌ Procedure costs migration failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 MongoDB connection closed');
  }
}

migrate();