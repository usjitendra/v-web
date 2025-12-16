const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });

const Hospital = require('../models/Hospital.cjs');

const hospitalsData = [
  {
    id: 1,
    name: "Apollo Hospitals, Delhi",
    country: "India",
    city: "Delhi",
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop",
    specialties: ["Cardiology", "Oncology", "Orthopedics"],
    rating: 4.6,
    beds: 700,
    accreditation: ["JCI", "NABH"],
    phone: "+91 11 2345 6789",
    blurb:
      "A leading multi-specialty hospital known for advanced cardiac and cancer care.",
  },
  {
    id: 2,
    name: "Fortis Memorial, Gurgaon",
    country: "India",
    city: "Gurgaon",
    image:
      "https://images.unsplash.com/photo-1576765608642-ff4b3f0c3a22?q=80&w=1200&auto=format&fit=crop",
    specialties: ["Neurosurgery", "Transplants", "Pediatrics"],
    rating: 4.7,
    beds: 1000,
    accreditation: ["JCI"],
    phone: "+91 124 678 9900",
    blurb:
      "High-end quaternary care with international patient services and advanced ICUs.",
  },
  {
    id: 3,
    name: "Max Super Speciality, Saket",
    country: "India",
    city: "Delhi",
    image:
      "https://images.unsplash.com/photo-1580281658629-6c3b5b7c5c2b?q=80&w=1200&auto=format&fit=crop",
    specialties: ["Oncology", "ENT", "GI Surgery"],
    rating: 4.5,
    beds: 500,
    accreditation: ["NABH"],
    phone: "+91 11 4500 6500",
    blurb:
      "Comprehensive cancer and GI programs with minimally invasive surgery.",
  },
  {
    id: 4,
    name: "Kokilaben Dhirubhai Ambani, Mumbai",
    country: "India",
    city: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1200&auto=format&fit=crop",
    specialties: ["Cardiology", "Robotics", "Orthopedics"],
    rating: 4.6,
    beds: 750,
    accreditation: ["JCI", "NABH"],
    phone: "+91 22 3099 9999",
    blurb:
      "Robotic surgery programs and holistic tertiary care with global standards.",
  },
  {
    id: 5,
    name: "Mayo Clinic, Rochester",
    country: "USA",
    city: "Rochester",
    image:
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1200&auto=format&fit=crop",
    specialties: ["Neurology", "Cancer Care", "Transplant"],
    rating: 4.9,
    beds: 1200,
    accreditation: ["JCI"],
    phone: "+1 507 284 2511",
    blurb:
      "Globally renowned research-driven hospital with state-of-the-art patient care.",
  },
  {
    id: 6,
    name: "Cleveland Clinic, Ohio",
    country: "USA",
    city: "Cleveland",
    image:
      "https://images.unsplash.com/photo-1583912268189-8d2d58f76d18?q=80&w=1200&auto=format&fit=crop",
    specialties: ["Cardiac Surgery", "Digestive Diseases", "Orthopedics"],
    rating: 4.8,
    beds: 1000,
    accreditation: ["JCI"],
    phone: "+1 216 444 2200",
    blurb:
      "Top-ranked for heart surgery and advanced treatments across multiple disciplines.",
  },
  {
    id: 7,
    name: "King’s College Hospital, London",
    country: "UK",
    city: "London",
    image:
      "https://images.unsplash.com/photo-1587502536263-9f14fcaed5d3?q=80&w=1200&auto=format&fit=crop",
    specialties: ["Liver Transplant", "Neuroscience", "Pediatrics"],
    rating: 4.7,
    beds: 850,
    accreditation: ["NHS", "JCI"],
    phone: "+44 20 3299 9000",
    blurb:
      "One of Europe's largest teaching hospitals with a focus on liver care and research.",
  },
  {
    id: 8,
    name: "Singapore General Hospital",
    country: "Singapore",
    city: "Singapore",
    image:
      "https://images.unsplash.com/photo-1587351026999-4b2df86f892f?q=80&w=1200&auto=format&fit=crop",
    specialties: ["Oncology", "Renal Care", "Cardiology"],
    rating: 4.8,
    beds: 950,
    accreditation: ["JCI"],
    phone: "+65 6222 3322",
    blurb:
      "Oldest and largest hospital in Singapore delivering cutting-edge treatments.",
  },
  {
    id: 9,
    name: "Burjeel Hospital, Abu Dhabi",
    country: "UAE",
    city: "Abu Dhabi",
    image:
      "https://images.unsplash.com/photo-1606233223229-cc57bce1f5da?q=80&w=1200&auto=format&fit=crop",
    specialties: ["Cardiology", "Orthopedics", "Cosmetic Surgery"],
    rating: 4.6,
    beds: 300,
    accreditation: ["JCI"],
    phone: "+971 2 508 5555",
    blurb:
      "Premium hospital offering luxury healthcare with a patient-first approach.",
  },
  {
    id: 10,
    name: "Tokyo University Hospital",
    country: "Japan",
    city: "Tokyo",
    image:
      "https://images.unsplash.com/photo-1603909922263-3b9f5c1f3d54?q=80&w=1200&auto=format&fit=crop",
    specialties: ["Oncology", "Neurology", "Gastroenterology"],
    rating: 4.7,
    beds: 1100,
    accreditation: ["JCI"],
    phone: "+81 3 5800 8000",
    blurb:
      "Leading Japanese academic medical center renowned for innovation and research.",
  },

  {
    id: 1,
    name: "अपोलो अस्पताल, दिल्ली",
    country: "भारत",
    city: "दिल्ली",
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop",
    specialties: ["हृदय रोग", "कैंसर विज्ञान", "अस्थि रोग"],
    rating: 4.6,
    beds: 700,
    accreditation: ["जेसीआई", "एनएबीएच"],
    phone: "+91 11 2345 6789",
    blurb:
      "उन्नत हृदय और कैंसर देखभाल के लिए प्रसिद्ध एक अग्रणी मल्टी-स्पेशियलिटी अस्पताल।",
    language: "HI",
  },
  {
    id: 2,
    name: "फोर्टिस मेमोरियल, गुरुग्राम",
    country: "भारत",
    city: "गुरुग्राम",
    image:
      "https://images.unsplash.com/photo-1576765608642-ff4b3f0c3a22?q=80&w=1200&auto=format&fit=crop",
    specialties: ["न्यूरोसर्जरी", "प्रतिरोपण", "बाल चिकित्सा"],
    rating: 4.7,
    beds: 1000,
    accreditation: ["जेसीआई"],
    phone: "+91 124 678 9900",
    blurb:
      "अंतरराष्ट्रीय रोगी सेवाओं और उन्नत आईसीयू के साथ उच्च स्तरीय क्वार्टनरी देखभाल।",
    language: "HI",
  },
  {
    id: 3,
    name: "मैक्स सुपर स्पेशियलिटी, साकेत",
    country: "भारत",
    city: "दिल्ली",
    image:
      "https://images.unsplash.com/photo-1580281658629-6c3b5b7c5c2b?q=80&w=1200&auto=format&fit=crop",
    specialties: ["कैंसर विज्ञान", "ईएनटी", "जीआई सर्जरी"],
    rating: 4.5,
    beds: 500,
    accreditation: ["एनएबीएच"],
    phone: "+91 11 4500 6500",
    blurb:
      "न्यूनतम इनवेसिव सर्जरी के साथ व्यापक कैंसर और जीआई कार्यक्रम।",
    language: "HI",
  },
  {
    id: 4,
    name: "कोकिलाबेन धीरूभाई अंबानी, मुंबई",
    country: "भारत",
    city: "मुंबई",
    image:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=1200&auto=format&fit=crop",
    specialties: ["हृदय रोग", "रोबोटिक सर्जरी", "अस्थि रोग"],
    rating: 4.6,
    beds: 750,
    accreditation: ["जेसीआई", "एनएबीएच"],
    phone: "+91 22 3099 9999",
    blurb:
      "रोबोटिक सर्जरी कार्यक्रम और वैश्विक मानकों के साथ समग्र तृतीयक देखभाल।",
    language: "HI",
  },
  {
    id: 5,
    name: "मेयो क्लिनिक, रोचेस्टर",
    country: "अमेरिका",
    city: "रोचेस्टर",
    image:
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1200&auto=format&fit=crop",
    specialties: ["स्नायु विज्ञान", "कैंसर देखभाल", "प्रतिरोपण"],
    rating: 4.9,
    beds: 1200,
    accreditation: ["जेसीआई"],
    phone: "+1 507 284 2511",
    blurb:
      "अनुसंधान-आधारित रोगी देखभाल के लिए वैश्विक रूप से प्रसिद्ध अस्पताल।",
    language: "HI",
  },
  {
    id: 6,
    name: "क्लीवलैंड क्लिनिक, ओहायो",
    country: "अमेरिका",
    city: "क्लीवलैंड",
    image:
      "https://images.unsplash.com/photo-1583912268189-8d2d58f76d18?q=80&w=1200&auto=format&fit=crop",
    specialties: ["हृदय शल्य चिकित्सा", "पाचन रोग", "अस्थि रोग"],
    rating: 4.8,
    beds: 1000,
    accreditation: ["जेसीआई"],
    phone: "+1 216 444 2200",
    blurb:
      "हृदय शल्य चिकित्सा और कई क्षेत्रों में उन्नत उपचार के लिए शीर्ष स्थान पर।",
    language: "HI",
  },
  {
    id: 7,
    name: "किंग्स कॉलेज हॉस्पिटल, लंदन",
    country: "यूके",
    city: "लंदन",
    image:
      "https://images.unsplash.com/photo-1587502536263-9f14fcaed5d3?q=80&w=1200&auto=format&fit=crop",
    specialties: ["यकृत प्रत्यारोपण", "तंत्रिका विज्ञान", "बाल चिकित्सा"],
    rating: 4.7,
    beds: 850,
    accreditation: ["एनएचएस", "जेसीआई"],
    phone: "+44 20 3299 9000",
    blurb:
      "यूरोप के सबसे बड़े शिक्षण अस्पतालों में से एक, यकृत देखभाल और अनुसंधान पर केंद्रित।",
    language: "HI",
  },
  {
    id: 8,
    name: "सिंगापुर जनरल हॉस्पिटल",
    country: "सिंगापुर",
    city: "सिंगापुर",
    image:
      "https://images.unsplash.com/photo-1587351026999-4b2df86f892f?q=80&w=1200&auto=format&fit=crop",
    specialties: ["कैंसर विज्ञान", "गुर्दा देखभाल", "हृदय रोग"],
    rating: 4.8,
    beds: 950,
    accreditation: ["जेसीआई"],
    phone: "+65 6222 3322",
    blurb:
      "सिंगापुर का सबसे पुराना और सबसे बड़ा अस्पताल जो अत्याधुनिक उपचार प्रदान करता है।",
    language: "HI",
  },
  {
    id: 9,
    name: "बुर्जील अस्पताल, अबू धाबी",
    country: "यूएई",
    city: "अबू धाबी",
    image:
      "https://images.unsplash.com/photo-1606233223229-cc57bce1f5da?q=80&w=1200&auto=format&fit=crop",
    specialties: ["हृदय रोग", "अस्थि रोग", "सौंदर्य शल्य चिकित्सा"],
    rating: 4.6,
    beds: 300,
    accreditation: ["जेसीआई"],
    phone: "+971 2 508 5555",
    blurb:
      "प्रीमियम अस्पताल जो विलासिता के साथ रोगी-प्रथम दृष्टिकोण प्रदान करता है।",
    language: "HI",
  },
  {
    id: 10,
    name: "टोक्यो विश्वविद्यालय अस्पताल",
    country: "जापान",
    city: "टोक्यो",
    image:
      "https://images.unsplash.com/photo-1603909922263-3b9f5c1f3d54?q=80&w=1200&auto=format&fit=crop",
    specialties: ["कैंसर विज्ञान", "स्नायु विज्ञान", "जठरांत्र विज्ञान"],
    rating: 4.7,
    beds: 1100,
    accreditation: ["जेसीआई"],
    phone: "+81 3 5800 8000",
    blurb:
      "नवाचार और अनुसंधान के लिए प्रसिद्ध जापान का अग्रणी शैक्षणिक चिकित्सा केंद्र।",
    language: "HI",
  }


];



async function migrate() {
  try {
    // Debug: Check if environment variables are loaded
    console.log('ATLAS_URI:', process.env.ATLAS_URI ? 'Loaded' : 'Missing');

    if (!process.env.ATLAS_URI) {
      throw new Error('ATLAS_URI environment variable is missing. Check your config.env file');
    }

    // 1. Connect to DB
    await mongoose.connect(process.env.ATLAS_URI, {
      dbName: 'healthcare',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });
    console.log('✅ MongoDB connected for hospital migration');

    // 2. Clear existing data
    const deleteResult = await Hospital.deleteMany();
    console.log(`🗑️  Cleared ${deleteResult.deletedCount} existing hospitals`);

    // 3. Insert new data
    const result = await Hospital.insertMany(hospitalsData);
    console.log(`📥 Inserted ${result.length} hospitals`);

    // 4. Verify migration
    const count = await Hospital.countDocuments();
    console.log(`🔍 Total hospitals in DB: ${count}`);

    // 5. Show sample of inserted data
    const sample = await Hospital.find().limit(2);
    console.log('📋 Sample hospitals:', sample.map(h => h.name));

  } catch (err) {
    console.error('❌ Hospital migration failed:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🛑 MongoDB connection closed');
    }
  }
}

// Run migration
migrate();