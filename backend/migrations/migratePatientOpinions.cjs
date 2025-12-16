const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });
const PatientOpinion = require('../models/PatientOpinions.cjs');

const opinionsData = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    treatment: "Cardiac Surgery",
    rating: 5,
    image: "https://images.unsplash.com/photo-1551836026-d5c8c5ab235e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    text: "The care I received was exceptional. The doctors took time to explain everything and the hospital facilities were world-class. My recovery has been smooth thanks to their post-treatment support."
  },
  {
    name: "Robert Chen",
    location: "Sydney, Australia",
    treatment: "Orthopedic Surgery",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    text: "From consultation to post-surgery care, the team was professional and compassionate. The results exceeded my expectations and I'm back to my active lifestyle."
  },
  {
    name: "Aisha Patel",
    location: "London, UK",
    treatment: "Cancer Treatment",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    text: "The oncology department provided excellent care during my treatment. The staff was supportive throughout my journey and the facilities were top-notch."
  },
  {
    name: "Michael Rodriguez",
    location: "Toronto, Canada",
    treatment: "Neurology Treatment",
    rating: 4,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
    text: "The medical team was knowledgeable and caring. They explained all options clearly and helped me make informed decisions about my treatment."
  }
];

async function migrate() {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      dbName: 'healthcare',
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected for patient opinions migration');

    await PatientOpinion.deleteMany();
    console.log('🗑️  Cleared existing patient opinions');

    const result = await PatientOpinion.insertMany(opinionsData);
    console.log(`📥 Inserted ${result.length} patient opinions`);

    const count = await PatientOpinion.countDocuments();
    console.log(`🔍 Total patient opinions in DB: ${count}`);

  } catch (err) {
    console.error('❌ Patient opinions migration failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🛑 MongoDB connection closed');
  }
}

migrate();