const mongoose = require('mongoose');
const path = require('path');
const ProcedureCost = require('../models/ProcedureCost.cjs');
const Treatment = require('../models/Treatments.cjs');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });


// const sampleProcedures = [
//     {
//         title: "Coronary Angioplasty",
//         description: "A procedure to open clogged heart arteries using a balloon and stent",
//         icon: "❤️",
//         basePrice: 150000,
//         category: "Cardiology",
//         duration: 120,
//         complexity: "High",
//         recoveryTime: "1-2 weeks"
//     },
//     {
//         title: "Knee Replacement Surgery",
//         description: "Surgical procedure to replace a damaged knee joint with an artificial one",
//         icon: "🦴",
//         basePrice: 250000,
//         category: "Orthopedics",
//         duration: 180,
//         complexity: "High",
//         recoveryTime: "6-12 weeks"
//     },
//     {
//         title: "Brain Tumor Removal",
//         description: "Surgical procedure to remove abnormal growths in the brain",
//         icon: "🧠",
//         basePrice: 500000,
//         category: "Neurology",
//         duration: 300,
//         complexity: "Very High",
//         recoveryTime: "2-3 months"
//     },
//     {
//         title: "Root Canal Treatment",
//         description: "Dental procedure to treat infection at the center of a tooth",
//         icon: "🦷",
//         basePrice: 8000,
//         category: "Dentistry",
//         duration: 90,
//         complexity: "Medium",
//         recoveryTime: "2-3 days"
//     },
//     {
//         title: "Cataract Surgery",
//         description: "Procedure to remove the cloudy lens and replace it with an artificial one",
//         icon: "👁️",
//         basePrice: 40000,
//         category: "Ophthalmology",
//         duration: 45,
//         complexity: "Medium",
//         recoveryTime: "1-2 weeks"
//     },
//     {
//         title: "LASIK Eye Surgery",
//         description: "Laser procedure to correct vision problems",
//         icon: "👓",
//         basePrice: 60000,
//         category: "Ophthalmology",
//         duration: 30,
//         complexity: "Medium",
//         recoveryTime: "1 week"
//     },
//     {
//         title: "Skin Grafting",
//         description: "Surgical procedure to transplant skin from one area to another",
//         icon: "🩹",
//         basePrice: 75000,
//         category: "Dermatology",
//         duration: 120,
//         complexity: "High",
//         recoveryTime: "3-4 weeks"
//     },
//     {
//         title: "Appendectomy",
//         description: "Surgical removal of the appendix",
//         icon: "🔪",
//         basePrice: 45000,
//         category: "General Surgery",
//         duration: 60,
//         complexity: "Medium",
//         recoveryTime: "2-3 weeks"
//     }
// ];


const sampleProcedures = [
    {
        title: "Coronary Angioplasty",
        description: "A procedure to open clogged heart arteries using a balloon and stent",
        image: "https://images.unsplash.com/photo-1588776814546-7f07b0da7a2e?auto=format&fit=crop&w=800&q=60",
        basePrice: 150000,
        category: "Cardiology",
        duration: 120,
        complexity: "High",
        recoveryTime: "1-2 weeks"
    },
    {
        title: "Knee Replacement Surgery",
        description: "Surgical procedure to replace a damaged knee joint with an artificial one",
        image: "https://images.unsplash.com/photo-1588774069260-2850b9abf229?auto=format&fit=crop&w=800&q=60",
        basePrice: 250000,
        category: "Orthopedics",
        duration: 180,
        complexity: "High",
        recoveryTime: "6-12 weeks"
    },
    {
        title: "Brain Tumor Removal",
        description: "Surgical procedure to remove abnormal growths in the brain",
        image: "https://images.unsplash.com/photo-1599824301788-56a71b49a4b8?auto=format&fit=crop&w=800&q=60",
        basePrice: 500000,
        category: "Neurology",
        duration: 300,
        complexity: "Very High",
        recoveryTime: "2-3 months"
    },
    {
        title: "Root Canal Treatment",
        description: "Dental procedure to treat infection at the center of a tooth",
        image: "https://images.unsplash.com/photo-1606813907563-9b8f45b6a8f8?auto=format&fit=crop&w=800&q=60",
        basePrice: 8000,
        category: "Dentistry",
        duration: 90,
        complexity: "Medium",
        recoveryTime: "2-3 days"
    },
    {
        title: "Cataract Surgery",
        description: "Procedure to remove the cloudy lens and replace it with an artificial one",
        image: "https://images.unsplash.com/photo-1588776814582-7f07b0da7b1e?auto=format&fit=crop&w=800&q=60",
        basePrice: 40000,
        category: "Ophthalmology",
        duration: 45,
        complexity: "Medium",
        recoveryTime: "1-2 weeks"
    },
    {
        title: "LASIK Eye Surgery",
        description: "Laser procedure to correct vision problems",
        image: "https://images.unsplash.com/photo-1600172457223-abc123456789?auto=format&fit=crop&w=800&q=60",
        basePrice: 60000,
        category: "Ophthalmology",
        duration: 30,
        complexity: "Medium",
        recoveryTime: "1 week"
    },
    {
        title: "Skin Grafting",
        description: "Surgical procedure to transplant skin from one area to another",
        image: "https://images.unsplash.com/photo-1614287309389-123456abcd?auto=format&fit=crop&w=800&q=60",
        basePrice: 75000,
        category: "Dermatology",
        duration: 120,
        complexity: "High",
        recoveryTime: "3-4 weeks"
    },
    {
        title: "Appendectomy",
        description: "Surgical removal of the appendix",
        image: "https://images.unsplash.com/photo-1584367365345-123456789abc?auto=format&fit=crop&w=800&q=60",
        basePrice: 45000,
        category: "General Surgery",
        duration: 60,
        complexity: "Medium",
        recoveryTime: "2-3 weeks"
    }
    ,
    {
        language: "HI",
        title: "कोरोनरी एंजियोप्लास्टी",
        description: "ब्लॉक्ड हृदय धमनियों को बलून और स्टेंट के माध्यम से खोलने की प्रक्रिया",
        image: "https://images.unsplash.com/photo-1588776814546-7f07b0da7a2e?auto=format&fit=crop&w=800&q=60",
        basePrice: 150000,
        category: "Cardiology",
        duration: 120,
        complexity: "High",
        recoveryTime: "1-2 सप्ताह"
    },
    {
        language: "HI",
        title: "घुटने का प्रतिस्थापन शल्यक्रिया",
        description: "क्षतिग्रस्त घुटने के जोड़ को कृत्रिम जोड़ से बदलने की शल्यक्रिया",
        image: "https://images.unsplash.com/photo-1588774069260-2850b9abf229?auto=format&fit=crop&w=800&q=60",
        basePrice: 250000,
        category: "Orthopedics",
        duration: 180,
        complexity: "High",
        recoveryTime: "6-12 सप्ताह"
    },
    {
        language: "HI",
        title: "मस्तिष्क ट्यूमर निष्कासन",
        description: "मस्तिष्क में असामान्य वृद्धि को निकालने की शल्यक्रिया",
        image: "https://images.unsplash.com/photo-1599824301788-56a71b49a4b8?auto=format&fit=crop&w=800&q=60",
        basePrice: 500000,
        category: "Neurology",
        duration: 300,
        complexity: "Very High",
        recoveryTime: "2-3 महीने"
    },
    {
        language: "HI",
        title: "रूट कैनाल उपचार",
        description: "दांत के केंद्र में संक्रमण का उपचार करने की दंत प्रक्रिया",
        image: "https://images.unsplash.com/photo-1606813907563-9b8f45b6a8f8?auto=format&fit=crop&w=800&q=60",
        basePrice: 8000,
        category: "Dentistry",
        duration: 90,
        complexity: "Medium",
        recoveryTime: "2-3 दिन"
    },
    {
        language: "HI",
        title: "मोतियाबिंद सर्जरी",
        description: "धुंधली लेन्स को हटाकर कृत्रिम लेन्स से बदलने की प्रक्रिया",
        image: "https://images.unsplash.com/photo-1588776814582-7f07b0da7b1e?auto=format&fit=crop&w=800&q=60",
        basePrice: 40000,
        category: "Ophthalmology",
        duration: 45,
        complexity: "Medium",
        recoveryTime: "1-2 सप्ताह"
    },
    {
        language: "HI",
        title: "लासिक आंख सर्जरी",
        description: "दृष्टि समस्याओं को ठीक करने के लिए लेजर प्रक्रिया",
        image: "https://images.unsplash.com/photo-1600172457223-abc123456789?auto=format&fit=crop&w=800&q=60",
        basePrice: 60000,
        category: "Ophthalmology",
        duration: 30,
        complexity: "Medium",
        recoveryTime: "1 सप्ताह"
    },
    {
        language: "HI",
        title: "त्वचा ग्राफ्टिंग",
        description: "त्वचा को एक क्षेत्र से दूसरे क्षेत्र में प्रत्यारोपित करने की शल्यक्रिया",
        image: "https://images.unsplash.com/photo-1614287309389-123456abcd?auto=format&fit=crop&w=800&q=60",
        basePrice: 75000,
        category: "Dermatology",
        duration: 120,
        complexity: "High",
        recoveryTime: "3-4 सप्ताह"
    },
    {
        language: "HI",
        title: "अपेंडेक्टॉमी",
        description: "अपेंडिक्स को हटाने की शल्यक्रिया",
        image: "https://images.unsplash.com/photo-1584367365345-123456789abc?auto=format&fit=crop&w=800&q=60",
        basePrice: 45000,
        category: "General Surgery",
        duration: 60,
        complexity: "Medium",
        recoveryTime: "2-3 सप्ताह"
    }
];




const migrateProcedures = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            dbName: 'healthcare',
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ MongoDB connected for procedure costs migration');

        // Clear existing data
        await ProcedureCost.deleteMany({});
        console.log('Cleared existing procedure data');

        // adding treatment ref id
        const treatments = await Treatment.find({});
        console.log("Fetched treatments:", treatments);

        if (treatments.length === 0) {
            throw new Error("Please migrate treatments first");
        }

        let count = 0;
        for (let i = 0; i < sampleProcedures.length; i++) {
            if (count >= treatments.length) {
                count = 0; // loop back if there are fewer treatments
            }
            sampleProcedures[i].treatment = treatments[count]._id;
            count++;
        }

        // Insert sample data
        await ProcedureCost.insertMany(sampleProcedures);
        console.log('Sample procedures data migrated successfully');

        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
};

migrateProcedures();