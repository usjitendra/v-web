const mongoose = require('mongoose');
const path = require('path');
const Treatment = require('../models/Treatments.cjs');
const HospitalTreatment = require('../models/HospitalTreatment.cjs');
const DoctorTreatment = require('../models/DoctorTreatment.cjs');
const Hospital = require('../models/Hospital.cjs');
const Doctor = require('../models/Doctor.cjs');
require('dotenv').config({ path: path.resolve(__dirname, '../config.env') });

async function migrate() {
    try {
        await mongoose.connect(process.env.ATLAS_URI, {
            dbName: 'healthcare',
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ MongoDB connected for FAQs migration');

        // Clear existing data
        await Treatment.deleteMany();
        await HospitalTreatment.deleteMany();
        await DoctorTreatment.deleteMany();
        console.log('🗑️  Cleared existing treatment data');

        // Get hospitals and doctors
        const hospitals = await Hospital.find();
        const doctors = await Doctor.find();


        if (hospitals.length === 0 || doctors.length === 0) {
            throw new Error('Please migrate hospitals and doctors first');
        }

        // Create base treatments
        const baseTreatments = [
            {
                title: 'Angioplasty',
                description: 'Heart artery procedure with stent placement',
                image: 'https://images.unsplash.com/photo-1588776814546-7f07b0da7a2e?auto=format&fit=crop&w=800&q=60',
                category: 'Cardiology',
                typicalDuration: 120,
                typicalComplexity: 'High',
                typicalRecoveryTime: '1-2 weeks'
            },
            {
                title: 'Knee Replacement Surgery',
                description: 'Total knee joint replacement with artificial implant',
                image: 'https://images.unsplash.com/photo-1588774069260-2850b9abf229?auto=format&fit=crop&w=800&q=60',
                category: 'Orthopedics',
                typicalDuration: 180,
                typicalComplexity: 'High',
                typicalRecoveryTime: '6-12 weeks'
            },
            {
                title: 'Root Canal Treatment',
                description: 'Dental procedure to treat infected tooth root',
                image: 'https://images.unsplash.com/photo-1606813907563-9b8f45b6a8f8?auto=format&fit=crop&w=800&q=60',
                category: 'Dentistry',
                typicalDuration: 90,
                typicalComplexity: 'Medium',
                typicalRecoveryTime: '2-3 days'
            },
            {
                title: 'Cataract Surgery',
                description: 'Removal of cloudy lens and replacement with an artificial lens',
                image: 'https://images.unsplash.com/photo-1588776814582-7f07b0da7b1e?auto=format&fit=crop&w=800&q=60',
                category: 'Ophthalmology',
                typicalDuration: 45,
                typicalComplexity: 'Medium',
                typicalRecoveryTime: '1-2 weeks'
            },
            {
                title: 'Appendectomy',
                description: 'Surgical removal of the appendix',
                image: 'https://images.unsplash.com/photo-1584367365345-123456789abc?auto=format&fit=crop&w=800&q=60',
                category: 'General Surgery',
                typicalDuration: 60,
                typicalComplexity: 'Medium',
                typicalRecoveryTime: '2-4 weeks'
            },
            {
                title: 'Chemotherapy',
                description: 'Cancer treatment using chemical substances or drugs',
                image: 'https://images.unsplash.com/photo-1596547601163-987654321def?auto=format&fit=crop&w=800&q=60',
                category: 'Oncology',
                typicalDuration: 240,
                typicalComplexity: 'High',
                typicalRecoveryTime: 'Varies'
            },
            {
                title: 'Hip Replacement Surgery',
                description: 'Replacement of hip joint with a prosthetic implant',
                image: 'https://images.unsplash.com/photo-1614287309389-123456abcd?auto=format&fit=crop&w=800&q=60',
                category: 'Orthopedics',
                typicalDuration: 150,
                typicalComplexity: 'High',
                typicalRecoveryTime: '6-12 weeks'
            },
            {
                title: 'Coronary Bypass Surgery',
                description: 'Redirecting blood around blocked coronary arteries',
                image: 'https://images.unsplash.com/photo-1600959936371-98765abcd123?auto=format&fit=crop&w=800&q=60',
                category: 'Cardiothoracic',
                typicalDuration: 240,
                typicalComplexity: 'High',
                typicalRecoveryTime: '6-12 weeks'
            },
            {
                title: 'Endoscopy',
                description: 'Minimally invasive procedure to examine internal organs',
                image: 'https://images.unsplash.com/photo-1600959936321-12345abcde?auto=format&fit=crop&w=800&q=60',
                category: 'Gastroenterology',
                typicalDuration: 30,
                typicalComplexity: 'Low',
                typicalRecoveryTime: '1-2 days'
            },
            {
                title: 'Cesarean Section (C-Section)',
                description: 'Surgical delivery of a baby through the abdomen',
                image: 'https://images.unsplash.com/photo-1610026829841-abcdef123456?auto=format&fit=crop&w=800&q=60',
                category: 'Obstetrics',
                typicalDuration: 90,
                typicalComplexity: 'High',
                typicalRecoveryTime: '4-6 weeks'
            },

            {
                title: 'एंजियोप्लास्टी',
                description: 'हृदय की धमनियों की प्रक्रिया जिसमें स्टेंट लगाया जाता है',
                image: 'https://images.unsplash.com/photo-1588776814546-7f07b0da7a2e?auto=format&fit=crop&w=800&q=60',
                category: 'हृदय रोग',
                typicalDuration: 120,
                typicalComplexity: 'उच्च',
                typicalRecoveryTime: '1-2 सप्ताह',
                language: 'HI'
            },
            {
                title: 'घुटने का प्रतिस्थापन शल्यक्रिया',
                description: 'कुल घुटने के जोड़ का कृत्रिम प्रत्यारोपण के साथ प्रतिस्थापन',
                image: 'https://images.unsplash.com/photo-1588774069260-2850b9abf229?auto=format&fit=crop&w=800&q=60',
                category: 'हड्डी रोग',
                typicalDuration: 180,
                typicalComplexity: 'उच्च',
                typicalRecoveryTime: '6-12 सप्ताह',
                language: 'HI'
            },
            {
                title: 'रूट कैनाल उपचार',
                description: 'दांत की जड़ में संक्रमण का उपचार करने की दंत चिकित्सा प्रक्रिया',
                image: 'https://images.unsplash.com/photo-1606813907563-9b8f45b6a8f8?auto=format&fit=crop&w=800&q=60',
                category: 'दंत चिकित्सा',
                typicalDuration: 90,
                typicalComplexity: 'मध्यम',
                typicalRecoveryTime: '2-3 दिन',
                language: 'HI'
            },
            {
                title: 'मोतियाबिंद शल्यक्रिया',
                description: 'धुंधली लेंस को निकालना और कृत्रिम लेंस से बदलना',
                image: 'https://images.unsplash.com/photo-1588776814582-7f07b0da7b1e?auto=format&fit=crop&w=800&q=60',
                category: 'नेत्र विज्ञान',
                typicalDuration: 45,
                typicalComplexity: 'मध्यम',
                typicalRecoveryTime: '1-2 सप्ताह',
                language: 'HI'
            },
            {
                title: 'अपेंडेक्टॉमी',
                description: 'अपेंडिक्स का शल्यक्रियात्मक हटाना',
                image: 'https://images.unsplash.com/photo-1584367365345-123456789abc?auto=format&fit=crop&w=800&q=60',
                category: 'सामान्य शल्यक्रिया',
                typicalDuration: 60,
                typicalComplexity: 'मध्यम',
                typicalRecoveryTime: '2-4 सप्ताह',
                language: 'HI'
            },
            {
                title: 'कीमोथेरेपी',
                description: 'रासायनिक पदार्थों या दवाओं का उपयोग करके कैंसर का उपचार',
                image: 'https://images.unsplash.com/photo-1596547601163-987654321def?auto=format&fit=crop&w=800&q=60',
                category: 'कैंसर विज्ञान',
                typicalDuration: 240,
                typicalComplexity: 'उच्च',
                typicalRecoveryTime: 'विविध',
                language: 'HI'
            },
            {
                title: 'कूल्हे का प्रतिस्थापन शल्यक्रिया',
                description: 'कूल्हे के जोड़ का कृत्रिम प्रत्यारोपण से प्रतिस्थापन',
                image: 'https://images.unsplash.com/photo-1614287309389-123456abcd?auto=format&fit=crop&w=800&q=60',
                category: 'हड्डी रोग',
                typicalDuration: 150,
                typicalComplexity: 'उच्च',
                typicalRecoveryTime: '6-12 सप्ताह',
                language: 'HI'
            },
            {
                title: 'कोरोनरी बाईपास शल्यक्रिया',
                description: 'ब्लॉक की हुई कोरोनरी धमनियों के चारों ओर रक्त का पुनर्निर्देशन',
                image: 'https://images.unsplash.com/photo-1600959936371-98765abcd123?auto=format&fit=crop&w=800&q=60',
                category: 'हृदय शल्यक्रिया',
                typicalDuration: 240,
                typicalComplexity: 'उच्च',
                typicalRecoveryTime: '6-12 सप्ताह',
                language: 'HI'
            },
            {
                title: 'एंडोस्कोपी',
                description: 'आंतरिक अंगों की जाँच के लिए न्यूनतम इनवेसिव प्रक्रिया',
                image: 'https://images.unsplash.com/photo-1600959936321-12345abcde?auto=format&fit=crop&w=800&q=60',
                category: 'जठरांत्र विज्ञान',
                typicalDuration: 30,
                typicalComplexity: 'कम',
                typicalRecoveryTime: '1-2 दिन',
                language: 'HI'
            },
            {
                title: 'सिज़ेरियन सेक्शन (C-Section)',
                description: 'पेट के माध्यम से बच्चे का शल्यक्रियात्मक प्रसव',
                image: 'https://images.unsplash.com/photo-1610026829841-abcdef123456?auto=format&fit=crop&w=800&q=60',
                category: 'स्त्रीरोग',
                typicalDuration: 90,
                typicalComplexity: 'उच्च',
                typicalRecoveryTime: '4-6 सप्ताह',
                language: 'HI'
            }

        ];



        const createdTreatments = await Treatment.insertMany(baseTreatments);
        console.log(`📥 Created ${createdTreatments.length} base treatments`);

        // Create hospital-treatment relationships (same treatment offered by multiple hospitals)
        const hospitalTreatments = [];
        for (const treatment of createdTreatments) {
            for (const hospital of hospitals) {
                hospitalTreatments.push({
                    hospital: hospital._id,
                    treatment: treatment._id,
                    price: treatment.category === 'Cardiology' ? 150000 :
                        treatment.category === 'Orthopedics' ? 250000 : 8000,
                    discount: Math.floor(Math.random() * 20), // Random discount 0-20%
                    availability: 'Available',
                    waitingPeriod: Math.floor(Math.random() * 14) // Random wait 0-14 days
                });
            }
        }

        const createdHospitalTreatments = await HospitalTreatment.insertMany(hospitalTreatments);
        console.log(`📥 Created ${createdHospitalTreatments.length} hospital-treatment relationships`);

        // Create doctor-treatment relationships (same treatment performed by multiple doctors)
        const doctorTreatments = [];
        for (const treatment of createdTreatments) {
            for (const doctor of doctors) {
                // Only assign treatments that match doctor's specialty
                if (doctor.specialty.includes(treatment.category) ||
                    treatment.category === 'Dentistry') { // Dentists are rare, so assign to some doctors
                    doctorTreatments.push({
                        doctor: doctor._id,
                        treatment: treatment._id,
                        successRate: 80 + Math.floor(Math.random() * 20), // 80-99%
                        experienceWithProcedure: Math.floor(Math.random() * 10) + 1, // 1-10 years
                        casesPerformed: Math.floor(Math.random() * 200) + 10 // 10-210 cases
                    });
                }
            }
        }

        const createdDoctorTreatments = await DoctorTreatment.insertMany(doctorTreatments);
        console.log(`📥 Created ${createdDoctorTreatments.length} doctor-treatment relationships`);

        // Update hospitals and doctors with treatment references
        for (const ht of createdHospitalTreatments) {
            await Hospital.findByIdAndUpdate(ht.hospital, {
                $addToSet: { treatments: ht._id }
            });
        }

        for (const dt of createdDoctorTreatments) {
            await Doctor.findByIdAndUpdate(dt.doctor, {
                $addToSet: { treatments: dt._id }
            });
        }

        console.log('✅ Updated hospitals and doctors with treatment references');

        // Verify
        const sampleHospital = await Hospital.findById(hospitals[0]._id)
            .populate({
                path: 'treatments',
                populate: { path: 'treatment', select: 'title category' }
            });

        const sampleDoctor = await Doctor.findById(doctors[0]._id)
            .populate({
                path: 'treatments',
                populate: { path: 'treatment', select: 'title category' }
            });

        console.log('📋 Sample hospital treatments:', sampleHospital.treatments.length);
        console.log('📋 Sample doctor treatments:', sampleDoctor.treatments.length);

    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🛑 MongoDB connection closed');
    }
}

migrate();