const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });
const FAQ = require('../models/FAQ.cjs');

const faqsData = [
    {
        question: "How do I start the process of medical treatment?",
        answer: "Starting your medical journey is simple. Contact us through our website, phone, or email. Our team will guide you through the initial consultation, medical history review, and help you choose the right hospital and doctor for your condition.",
        category: "General",
        order: 1
    },
    {
        question: "What information do I need to provide for a treatment estimate?",
        answer: "For an accurate estimate, please share your medical reports, diagnosis details, current medications, and any previous treatments. The more information you provide, the more precise our cost estimation and treatment plan will be.",
        category: "General",
        order: 2
    },
    {
        question: "How long does it take to get a treatment plan and cost estimate?",
        answer: "We typically provide a preliminary treatment plan and cost estimate within 24-48 hours after reviewing your medical documents. In urgent cases, we can expedite this process.",
        category: "General",
        order: 3
    },
    {
        question: "Do you help with travel arrangements and visas?",
        answer: "Yes, we provide complete assistance with medical visas, travel arrangements, airport transfers, and local accommodation. Our team will guide you through the entire process to make your medical journey smooth.",
        category: "Travel",
        order: 4
    },
    {
        question: "What happens after I complete my treatment?",
        answer: "Post-treatment, we provide follow-up care instructions and connect you with our team for any questions. We also assist with arranging follow-up consultations and can help facilitate communication with your doctors back home.",
        category: "Post-Treatment",
        order: 5
    },
    {
        question: "Are the doctors and hospitals you work with accredited?",
        answer: "Absolutely. We partner only with accredited hospitals and highly qualified doctors who have international recognition and expertise in their respective specialties.",
        category: "Quality",
        order: 6
    },
    {
        question: "What languages do your coordinators speak?",
        answer: "Our care coordinators are fluent in English, Hindi, Arabic, Spanish, and several other languages to assist patients from different regions effectively.",
        category: "Support",
        order: 7
    },
    {
        question: "How do you ensure patient privacy and data security?",
        answer: "We take patient privacy seriously. All your medical information is handled with strict confidentiality and secured through encrypted channels in compliance with international healthcare privacy standards.",
        category: "Privacy",
        order: 8
    },

    {
        question: "मैं चिकित्सा उपचार की प्रक्रिया कैसे शुरू करूँ?",
        answer: "अपनी चिकित्सा यात्रा शुरू करना आसान है। हमारी वेबसाइट, फोन, या ईमेल के माध्यम से हमसे संपर्क करें। हमारी टीम प्रारंभिक परामर्श, चिकित्सीय इतिहास की समीक्षा, और आपकी स्थिति के लिए सही अस्पताल और डॉक्टर चुनने में आपका मार्गदर्शन करेगी।",
        category: "सामान्य",
        order: 1,
        language: "HI"
    },
    {
        question: "उपचार का अनुमान प्राप्त करने के लिए मुझे कौन सी जानकारी देनी होगी?",
        answer: "सटीक अनुमान के लिए कृपया अपनी मेडिकल रिपोर्ट्स, निदान विवरण, वर्तमान दवाएँ, और कोई भी पूर्व उपचार साझा करें। जितनी अधिक जानकारी आप देंगे, हमारा लागत अनुमान और उपचार योजना उतनी ही सटीक होगी।",
        category: "सामान्य",
        order: 2,
        language: "HI"
    },
    {
        question: "उपचार योजना और लागत अनुमान प्राप्त करने में कितना समय लगता है?",
        answer: "आमतौर पर हम आपके चिकित्सा दस्तावेज़ों की समीक्षा के 24-48 घंटों के भीतर प्रारंभिक उपचार योजना और लागत अनुमान प्रदान करते हैं। आपात स्थितियों में, हम इस प्रक्रिया को और तेज़ कर सकते हैं।",
        category: "सामान्य",
        order: 3,
        language: "HI"
    },
    {
        question: "क्या आप यात्रा की व्यवस्था और वीज़ा में मदद करते हैं?",
        answer: "हाँ, हम मेडिकल वीज़ा, यात्रा व्यवस्था, हवाई अड्डा स्थानांतरण और स्थानीय आवास में पूरी सहायता प्रदान करते हैं। हमारी टीम पूरी प्रक्रिया में आपका मार्गदर्शन करेगी ताकि आपकी चिकित्सा यात्रा सहज हो।",
        category: "यात्रा",
        order: 4,
        language: "HI"
    },
    {
        question: "उपचार पूरा होने के बाद क्या होता है?",
        answer: "उपचार के बाद, हम फॉलो-अप देखभाल के निर्देश प्रदान करते हैं और किसी भी प्रश्न के लिए आपको हमारी टीम से जोड़ते हैं। हम फॉलो-अप परामर्श की व्यवस्था करने में भी मदद करते हैं और आपके घरेलू डॉक्टरों से संचार में सहायता कर सकते हैं।",
        category: "उपचार-पश्चात",
        order: 5,
        language: "HI"
    },
    {
        question: "क्या आपके डॉक्टर और अस्पताल मान्यता प्राप्त हैं?",
        answer: "बिल्कुल। हम केवल मान्यता प्राप्त अस्पतालों और अत्यधिक योग्य डॉक्टरों के साथ साझेदारी करते हैं जिनके पास अंतरराष्ट्रीय पहचान और अपने-अपने क्षेत्रों में विशेषज्ञता है।",
        category: "गुणवत्ता",
        order: 6,
        language: "HI"
    },
    {
        question: "आपके समन्वयक कौन-कौन सी भाषाएँ बोलते हैं?",
        answer: "हमारे केयर कोऑर्डिनेटर अंग्रेज़ी, हिंदी, अरबी, स्पैनिश और कई अन्य भाषाओं में निपुण हैं ताकि विभिन्न क्षेत्रों के रोगियों की प्रभावी सहायता कर सकें।",
        category: "सहायता",
        order: 7,
        language: "HI"
    },
    {
        question: "आप रोगी की गोपनीयता और डेटा सुरक्षा कैसे सुनिश्चित करते हैं?",
        answer: "हम रोगी की गोपनीयता को गंभीरता से लेते हैं। आपकी सभी चिकित्सा जानकारी को सख्त गोपनीयता के साथ संभाला जाता है और अंतरराष्ट्रीय स्वास्थ्य गोपनीयता मानकों के अनुरूप एन्क्रिप्टेड चैनलों के माध्यम से सुरक्षित रखा जाता है।",
        category: "गोपनीयता",
        order: 8,
        language: "HI"
    }


];

async function migrate() {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            dbName: 'healthcare',
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ MongoDB connected for FAQs migration');

        await FAQ.deleteMany();
        console.log('🗑️  Cleared existing FAQs');

        const result = await FAQ.insertMany(faqsData);
        console.log(`📥 Inserted ${result.length} FAQs`);

        const count = await FAQ.countDocuments();
        console.log(`🔍 Total FAQs in DB: ${count}`);

    } catch (err) {
        console.error('❌ FAQs migration failed:', err);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🛑 MongoDB connection closed');
    }
}

migrate();