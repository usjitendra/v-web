const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });
const Assistance = require('../models/Assistance.cjs');

const assistanceData = [
    {
        title: "Medical Opinion and Cost Estimations",
        description: "Expert opinions and cost estimates from top healthcare providers.",
        icon: "FaUserMd",
        order: 1
    },
    {
        title: "Pre-Travel Consultations",
        description: "Understand your procedure before traveling with detailed guidance.",
        icon: "FaPlane",
        order: 2
    },
    {
        title: "Visa Assistance",
        description: "Complete medical visa assistance and documentation support.",
        icon: "FaPassport",
        order: 3
    },
    {
        title: "Money Exchange",
        description: "Convenient currency exchange services in your city.",
        icon: "FaMoneyBillWave",
        order: 4
    },
    {
        title: "Interpreters and Translators",
        description: "Fluent professionals to break language barriers at every step.",
        icon: "FaLanguage",
        order: 5
    },
    {
        title: "Transportation Assistance",
        description: "Complimentary airport transfers and local transportation.",
        icon: "FaCar",
        order: 6
    },
    {
        title: "Accommodation Options",
        description: "Near the hospital and matching your budget and needs.",
        icon: "FaBed",
        order: 7
    },
    {
        title: "Admission, Appointment, Pharma Care",
        description: "Full coordination of medical logistics and pharmacy services.",
        icon: "FaCalendarCheck",
        order: 8
    },
    {
        title: "Private Duty Nursing",
        description: "Arrangements of private nursing care as needed.",
        icon: "FaUserNurse",
        order: 9
    },

    {
        title: "चिकित्सा राय और लागत अनुमान",
        description: "शीर्ष स्वास्थ्य सेवा प्रदाताओं से विशेषज्ञ राय और लागत अनुमान।",
        icon: "FaUserMd",
        order: 1,
        language: "HI"
    },
    {
        title: "यात्रा पूर्व परामर्श",
        description: "यात्रा से पहले अपनी प्रक्रिया को विस्तार से समझें।",
        icon: "FaPlane",
        order: 2,
        language: "HI"
    },
    {
        title: "वीजा सहायता",
        description: "पूर्ण चिकित्सा वीज़ा सहायता और दस्तावेज़ीकरण समर्थन।",
        icon: "FaPassport",
        order: 3,
        language: "HI"
    },
    {
        title: "मुद्रा विनिमय",
        description: "आपके शहर में सुविधाजनक मुद्रा विनिमय सेवाएँ।",
        icon: "FaMoneyBillWave",
        order: 4,
        language: "HI"
    },
    {
        title: "अनुवादक और दुभाषिया",
        description: "हर कदम पर भाषा बाधाओं को दूर करने के लिए निपुण पेशेवर।",
        icon: "FaLanguage",
        order: 5,
        language: "HI"
    },
    {
        title: "परिवहन सहायता",
        description: "नि:शुल्क हवाई अड्डा स्थानांतरण और स्थानीय परिवहन।",
        icon: "FaCar",
        order: 6,
        language: "HI"
    },
    {
        title: "आवास विकल्प",
        description: "अस्पताल के पास और आपके बजट व आवश्यकताओं के अनुसार।",
        icon: "FaBed",
        order: 7,
        language: "HI"
    },
    {
        title: "भर्ती, अपॉइंटमेंट, फार्मा केयर",
        description: "चिकित्सा लॉजिस्टिक्स और फार्मेसी सेवाओं का पूर्ण समन्वय।",
        icon: "FaCalendarCheck",
        order: 8,
        language: "HI"
    },
    {
        title: "निजी नर्सिंग सेवा",
        description: "आवश्यकतानुसार निजी नर्सिंग देखभाल की व्यवस्था।",
        icon: "FaUserNurse",
        order: 9,
        language: "HI"
    }

];

async function migrate() {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            dbName: 'healthcare',
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ MongoDB connected for assistance migration');

        await Assistance.deleteMany();
        console.log('🗑️  Cleared existing assistance services');

        const result = await Assistance.insertMany(assistanceData);
        console.log(`📥 Inserted ${result.length} assistance services`);

        const count = await Assistance.countDocuments();
        console.log(`🔍 Total assistance services in DB: ${count}`);

    } catch (err) {
        console.error('❌ Assistance migration failed:', err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🛑 MongoDB connection closed');
    }
}

migrate();